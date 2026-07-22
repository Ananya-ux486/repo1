import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import Stripe from "stripe";
import PDFDocument from "pdfkit";
import rateLimit from "express-rate-limit";
import { Payment, PaymentLink, Service, User } from "../models/index.js";
import { normalizeEmail, readSession } from "../utils/auth.js";
import { safeLogError } from "../utils/security.js";

const router = Router();

const CUSTOM_AMOUNT_MIN_MINOR = 100;
const CUSTOM_AMOUNT_MAX_MINOR = 100_000_000;

const checkoutLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many checkout attempts. Please try again later." },
});

const providers = {
  razorpay: () =>
    Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
  ccavenue: () =>
    Boolean(
      process.env.CCAVENUE_MERCHANT_ID &&
        process.env.CCAVENUE_ACCESS_CODE &&
        process.env.CCAVENUE_WORKING_KEY,
    ),
  stripe: () =>
    Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
  paypal: () =>
    Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
};

function publicSiteUrl() {
  return (process.env.PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function clean(value, max = 250) {
  return String(value || "").trim().slice(0, max);
}

function parseMoney(value, currency) {
  const raw = clean(value, 50).toLowerCase().replace(/,/g, "");
  const number = Number((raw.match(/[\d.]+/) || [])[0]);
  if (!Number.isFinite(number) || number <= 0) return null;
  const multiplier = raw.includes("k") ? 1000 : 1;
  const major = number * multiplier;
  return {
    amountMinor: Math.round(major * 100),
    displayAmount:
      currency === "INR"
        ? `₹${major.toLocaleString("en-IN")}`
        : `$${major.toFixed(2)}`,
  };
}

function parseCustomInrAmount(value) {
  const normalized = String(value ?? "").trim().replace(/,/g, "");
  const match = normalized.match(/^(\d{1,7})(?:\.(\d{1,2}))?$/);
  if (!match) {
    throw Object.assign(
      new Error("Enter a valid INR amount with no more than two decimal places."),
      { status: 400 },
    );
  }

  const amountMinor =
    Number.parseInt(match[1], 10) * 100 +
    Number.parseInt((match[2] || "").padEnd(2, "0") || "0", 10);
  if (
    !Number.isSafeInteger(amountMinor) ||
    amountMinor < CUSTOM_AMOUNT_MIN_MINOR ||
    amountMinor > CUSTOM_AMOUNT_MAX_MINOR
  ) {
    throw Object.assign(
      new Error("Custom amount must be between ₹1 and ₹10,00,000."),
      { status: 400 },
    );
  }

  return {
    amountMinor,
    displayAmount: `₹${(amountMinor / 100).toLocaleString("en-IN", {
      minimumFractionDigits: amountMinor % 100 ? 2 : 0,
      maximumFractionDigits: 2,
    })}`,
  };
}

function reference() {
  return `TF-${Date.now()}-${crypto.randomBytes(10).toString("hex").toUpperCase()}`;
}

function providerCurrency(provider) {
  return provider === "razorpay" || provider === "ccavenue" ? "INR" : "USD";
}

function isTestProvider(provider) {
  if (provider === "razorpay") {
    return String(process.env.RAZORPAY_KEY_ID || "").startsWith("rzp_test_");
  }
  if (provider === "stripe") {
    return String(process.env.STRIPE_SECRET_KEY || "").startsWith("sk_test_");
  }
  if (provider === "paypal") return process.env.PAYPAL_ENV !== "live";
  if (provider === "ccavenue") return process.env.CCAVENUE_ENV !== "live";
  return false;
}

async function requirePaymentUser(req, res, next) {
  try {
    const session = readSession(req);
    if (
      !session?.projectsAccess ||
      !session.userId ||
      session.userId === "team-admin"
    ) {
      return res.status(401).json({
        error: "Please log in or sign up to continue with this payment.",
        code: "AUTH_REQUIRED",
      });
    }
    const user = await User.findById(session.userId)
      .select("_id name email phone")
      .lean();
    if (!user) {
      return res.status(401).json({
        error: "Your session is no longer valid. Please log in again.",
        code: "AUTH_REQUIRED",
      });
    }
    req.paymentUser = user;
    next();
  } catch (error) {
    next(error);
  }
}

async function resolveCheckout(body) {
  const provider = clean(body?.provider, 20).toLowerCase();
  if (!Object.hasOwn(providers, provider)) {
    throw Object.assign(new Error("Unsupported payment provider."), { status: 400 });
  }
  if (!providers[provider]()) {
    throw Object.assign(
      new Error(`${provider} is not configured yet. Please contact support.`),
      { status: 503 },
    );
  }

  const currency = providerCurrency(provider);
  const linkToken = clean(body?.paymentLink, 120);
  if (linkToken) {
    const link = await PaymentLink.findOne({
      token: linkToken,
      active: true,
      expiresAt: { $gt: new Date() },
    }).lean();
    if (!link || !link.allowedProviders.includes(provider)) {
      throw Object.assign(new Error("This payment link is invalid or expired."), {
        status: 404,
      });
    }
    if (link.currency !== currency) {
      throw Object.assign(
        new Error(`This quote accepts ${link.currency} payments only.`),
        { status: 400 },
      );
    }
    return {
      provider,
      currency,
      amountMinor: link.amountMinor,
      displayAmount:
        currency === "INR"
          ? `₹${(link.amountMinor / 100).toLocaleString("en-IN")}`
          : `$${(link.amountMinor / 100).toFixed(2)}`,
      source: "quote",
      serviceSlug: "",
      serviceTitle: link.title,
      quoteRequestId: link.quoteRequestId,
      presetCustomer: {
        name: link.customerName,
        email: link.customerEmail,
        phone: link.customerPhone,
      },
    };
  }

  if (clean(body?.paymentType, 20).toLowerCase() === "custom") {
    if (provider !== "razorpay") {
      throw Object.assign(
        new Error("Custom INR payments are available through Razorpay only."),
        { status: 400 },
      );
    }
    const money = parseCustomInrAmount(body?.customAmount);
    return {
      provider,
      currency: "INR",
      ...money,
      source: "custom",
      serviceSlug: "",
      serviceTitle: "Custom payment",
      quoteRequestId: null,
      presetCustomer: null,
      metadata: {
        customPayment: true,
        enteredAmountMajor: (money.amountMinor / 100).toFixed(2),
      },
    };
  }

  const serviceSlug = clean(body?.serviceSlug, 100).toLowerCase();
  const service = await Service.findOne({
    slug: serviceSlug,
    published: true,
    pricingType: "fixed",
  }).lean();
  if (!service) {
    throw Object.assign(new Error("Select a valid fixed-price package."), {
      status: 400,
    });
  }
  const money = parseMoney(
    currency === "INR" ? service.indiaPrice : service.foreignPrice,
    currency,
  );
  if (!money) {
    throw Object.assign(new Error("This package has no price for that provider."), {
      status: 400,
    });
  }
  return {
    provider,
    currency,
    ...money,
    source: "package",
    serviceSlug: service.slug,
    serviceTitle: service.title,
    quoteRequestId: null,
    presetCustomer: null,
  };
}

async function paypalAccessToken() {
  const base =
    process.env.PAYPAL_ENV === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";
  const authorization = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new Error("PayPal authentication failed.");
  const data = await response.json();
  return { base, token: data.access_token };
}

function ccavenueEncrypt(payload) {
  const key = crypto
    .createHash("md5")
    .update(process.env.CCAVENUE_WORKING_KEY)
    .digest();
  const iv = Buffer.from(Array.from({ length: 16 }, (_, index) => index));
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  return cipher.update(payload, "utf8", "hex") + cipher.final("hex");
}

function ccavenueDecrypt(payload) {
  const key = crypto
    .createHash("md5")
    .update(process.env.CCAVENUE_WORKING_KEY)
    .digest();
  const iv = Buffer.from(Array.from({ length: 16 }, (_, index) => index));
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  return decipher.update(payload, "hex", "utf8") + decipher.final("utf8");
}

router.get("/config", (_req, res) => {
  return res.json({
    providers: Object.fromEntries(
      Object.entries(providers).map(([name, available]) => [name, available()]),
    ),
    currencies: {
      razorpay: "INR",
      ccavenue: "INR",
      stripe: "USD",
      paypal: "USD",
    },
  });
});

router.get("/packages", async (_req, res) => {
  const items = await Service.find({ published: true, pricingType: "fixed" })
    .sort({ order: 1, title: 1 })
    .select("slug title tagline indiaPrice foreignPrice")
    .lean();
  return res.json({ items });
});

router.get("/links/:token", async (req, res) => {
  const item = await PaymentLink.findOne({
    token: clean(req.params.token, 120),
    active: true,
    expiresAt: { $gt: new Date() },
  })
    .select(
      "token title amountMinor currency allowedProviders expiresAt",
    )
    .lean();
  if (!item) return res.status(404).json({ error: "Payment link is invalid or expired." });
  return res.json({ item });
});

router.post("/create", checkoutLimiter, requirePaymentUser, async (req, res) => {
  try {
    const checkout = await resolveCheckout(req.body);
    const customer = {
      name: clean(req.paymentUser.name, 120),
      email: normalizeEmail(req.paymentUser.email),
      phone: clean(
        req.body?.phone ||
          req.paymentUser.phone ||
          checkout.presetCustomer?.phone,
        30,
      ),
    };
    if (
      customer.name.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)
    ) {
      return res.status(400).json({ error: "Valid name and email are required." });
    }

    const ref = reference();
    const payment = await Payment.create({
      reference: ref,
      provider: checkout.provider,
      status: "created",
      amountMinor: checkout.amountMinor,
      currency: checkout.currency,
      displayAmount: checkout.displayAmount,
      source: checkout.source,
      ownerUserId: req.paymentUser._id,
      serviceSlug: checkout.serviceSlug,
      serviceTitle: checkout.serviceTitle,
      quoteRequestId: checkout.quoteRequestId,
      customer,
      metadata: {
        ...(checkout.metadata || {}),
        testMode: isTestProvider(checkout.provider),
      },
    });
    const successUrl = `${publicSiteUrl()}/payment/result?reference=${encodeURIComponent(ref)}`;
    const cancelUrl = `${publicSiteUrl()}/payment/result?reference=${encodeURIComponent(ref)}&cancelled=1`;

    if (checkout.provider === "razorpay") {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      const order = await razorpay.orders.create({
        amount: checkout.amountMinor,
        currency: checkout.currency,
        receipt: ref,
        notes: {
          reference: ref,
          service: checkout.serviceTitle,
          source: checkout.source,
        },
      });
      payment.providerOrderId = order.id;
      payment.status = "pending";
      await payment.save();
      return res.json({
        kind: "razorpay",
        reference: ref,
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: order.id,
        amount: checkout.amountMinor,
        currency: checkout.currency,
        name: "TasmaFive Solutions",
        description: checkout.serviceTitle,
        customer,
      });
    }

    if (checkout.provider === "stripe") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${successUrl}&stripe_session={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        customer_email: customer.email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: checkout.currency.toLowerCase(),
              unit_amount: checkout.amountMinor,
              product_data: { name: checkout.serviceTitle },
            },
          },
        ],
        metadata: { reference: ref },
        payment_intent_data: { metadata: { reference: ref } },
      });
      payment.providerSessionId = session.id;
      payment.status = "pending";
      await payment.save();
      return res.json({ kind: "redirect", reference: ref, url: session.url });
    }

    if (checkout.provider === "paypal") {
      const { base, token } = await paypalAccessToken();
      const response = await fetch(`${base}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": ref,
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: ref,
              description: checkout.serviceTitle,
              amount: {
                currency_code: checkout.currency,
                value: (checkout.amountMinor / 100).toFixed(2),
              },
            },
          ],
          payment_source: {
            paypal: {
              experience_context: {
                return_url: `${successUrl}&paypal_return=1`,
                cancel_url: cancelUrl,
                user_action: "PAY_NOW",
              },
            },
          },
        }),
      });
      const order = await response.json();
      if (!response.ok) throw new Error(order?.message || "PayPal order failed.");
      const approve = order.links?.find(
        (link) => link.rel === "payer-action" || link.rel === "approve",
      );
      if (!approve?.href) throw new Error("PayPal approval link was not returned.");
      payment.providerOrderId = order.id;
      payment.status = "pending";
      await payment.save();
      return res.json({ kind: "redirect", reference: ref, url: approve?.href });
    }

    const payload = new URLSearchParams({
      merchant_id: process.env.CCAVENUE_MERCHANT_ID,
      order_id: ref,
      currency: checkout.currency,
      amount: (checkout.amountMinor / 100).toFixed(2),
      redirect_url: `${process.env.API_PUBLIC_URL || "http://localhost:8080"}/api/payments/ccavenue/callback`,
      cancel_url: `${process.env.API_PUBLIC_URL || "http://localhost:8080"}/api/payments/ccavenue/callback`,
      language: "EN",
      billing_name: customer.name,
      billing_email: customer.email,
      billing_tel: customer.phone,
      merchant_param1: ref,
    }).toString();
    payment.providerOrderId = ref;
    payment.status = "pending";
    await payment.save();
    return res.json({
      kind: "form",
      reference: ref,
      url:
        process.env.CCAVENUE_ENV === "live"
          ? "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"
          : "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction",
      fields: {
        encRequest: ccavenueEncrypt(payload),
        access_code: process.env.CCAVENUE_ACCESS_CODE,
      },
    });
  } catch (error) {
    safeLogError("payment-create", error);
    return res
      .status(error.status || 500)
      .json({ error: error.status ? error.message : "Unable to start payment." });
  }
});

router.post(
  "/razorpay/verify",
  checkoutLimiter,
  requirePaymentUser,
  async (req, res) => {
  if (!process.env.RAZORPAY_KEY_SECRET?.trim()) {
    return res.status(503).json({ error: "Payment verification is unavailable." });
  }
  const orderId = clean(req.body?.razorpay_order_id, 120);
  const paymentId = clean(req.body?.razorpay_payment_id, 120);
  const signature = clean(req.body?.razorpay_signature, 300);
  const referenceValue = clean(req.body?.reference, 120);
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  if (
    !signature ||
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    await Payment.findOneAndUpdate(
      { reference: referenceValue, ownerUserId: req.paymentUser._id },
      { status: "failed", failureMessage: "Invalid Razorpay signature." },
    );
    return res.status(400).json({ error: "Payment verification failed." });
  }
  const payment = await Payment.findOne({
    reference: referenceValue,
    providerOrderId: orderId,
    provider: "razorpay",
    ownerUserId: req.paymentUser._id,
  });
  if (!payment) return res.status(404).json({ error: "Payment record not found." });
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    let providerPayment = await razorpay.payments.fetch(paymentId);
    if (providerPayment.status === "authorized") {
      providerPayment = await razorpay.payments.capture(
        paymentId,
        payment.amountMinor,
        payment.currency,
      );
    }
    if (
      providerPayment.status !== "captured" ||
      providerPayment.order_id !== orderId ||
      Number(providerPayment.amount) !== payment.amountMinor ||
      providerPayment.currency !== payment.currency
    ) {
      throw new Error("Provider amount, currency or capture status did not match.");
    }
    payment.status = "paid";
    payment.providerPaymentId = paymentId;
    payment.paidAt = new Date();
    await payment.save();
  } catch (error) {
    payment.status = "failed";
    payment.failureMessage = clean(error.message, 500);
    await payment.save();
    return res.status(400).json({ error: "Payment could not be confirmed." });
  }
  return res.json({ ok: true, reference: payment.reference });
  },
);

router.post(
  "/paypal/capture",
  checkoutLimiter,
  requirePaymentUser,
  async (req, res) => {
  try {
    const orderId = clean(req.body?.orderId, 120);
    const referenceValue = clean(req.body?.reference, 120);
    const payment = await Payment.findOne({
      reference: referenceValue,
      provider: "paypal",
      providerOrderId: orderId,
      ownerUserId: req.paymentUser._id,
    });
    if (!payment) return res.status(404).json({ error: "Payment record not found." });
    if (payment.status === "paid") return res.json({ ok: true, reference: payment.reference });
    const { base, token } = await paypalAccessToken();
    const response = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `${referenceValue}-capture`,
      },
    });
    const result = await response.json();
    if (
      !response.ok ||
      result.id !== orderId ||
      result.status !== "COMPLETED" ||
      result.purchase_units?.[0]?.reference_id !== referenceValue
    ) {
      payment.status = "failed";
      payment.failureMessage = result?.message || "PayPal capture failed.";
      await payment.save();
      return res.status(400).json({ error: "Payment could not be captured." });
    }
    const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
    if (
      capture?.amount?.currency_code !== payment.currency ||
      Math.round(Number(capture?.amount?.value) * 100) !== payment.amountMinor
    ) {
      payment.status = "failed";
      payment.failureMessage = "PayPal amount or currency did not match.";
      await payment.save();
      return res.status(400).json({ error: "Payment amount verification failed." });
    }
    payment.status = "paid";
    payment.providerPaymentId = capture?.id || "";
    payment.paidAt = new Date();
    await payment.save();
    return res.json({ ok: true, reference: payment.reference });
  } catch (error) {
    safeLogError("paypal-capture", error);
    return res.status(500).json({ error: "PayPal verification failed." });
  }
  },
);

router.post("/ccavenue/callback", async (req, res) => {
  try {
    const decrypted = ccavenueDecrypt(clean(req.body?.encResp, 100000));
    const data = Object.fromEntries(new URLSearchParams(decrypted));
    const payment = await Payment.findOne({ reference: data.order_id });
    if (!payment) return res.redirect(`${publicSiteUrl()}/payment/result?invalid=1`);
    payment.providerPaymentId = clean(data.tracking_id, 120);
    payment.metadata = {
      ...(payment.metadata || {}),
      bankRefNo: clean(data.bank_ref_no, 120),
      paymentMode: clean(data.payment_mode, 80),
      cardName: clean(data.card_name, 80),
      statusMessage: clean(data.status_message, 500),
    };
    const amountMatches =
      Math.round(Number(data.amount) * 100) === payment.amountMinor &&
      data.currency === payment.currency;
    if (data.order_status === "Success" && amountMatches) {
      payment.status = "paid";
      payment.paidAt = new Date();
    } else if (data.order_status === "Aborted") {
      payment.status = "cancelled";
      payment.cancelledAt = new Date();
    } else {
      payment.status = "failed";
      payment.failureMessage = clean(
        amountMatches
          ? data.failure_message || data.status_message
          : "CCAvenue amount or currency did not match.",
        500,
      );
    }
    await payment.save();
    return res.redirect(
      `${publicSiteUrl()}/payment/result?reference=${encodeURIComponent(payment.reference)}`,
    );
  } catch (error) {
    safeLogError("ccavenue-callback", error);
    return res.redirect(`${publicSiteUrl()}/payment/result?invalid=1`);
  }
});

router.post("/cancel", checkoutLimiter, requirePaymentUser, async (req, res) => {
  const referenceValue = clean(req.body?.reference, 120);
  const payment = await Payment.findOneAndUpdate(
    {
      reference: referenceValue,
      ownerUserId: req.paymentUser._id,
      status: { $in: ["created", "pending"] },
    },
    { status: "cancelled", cancelledAt: new Date() },
    { new: true },
  );
  return res.json({ ok: Boolean(payment) });
});

router.get("/status/:reference", requirePaymentUser, async (req, res) => {
  const payment = await Payment.findOne({
    reference: clean(req.params.reference, 120),
    ownerUserId: req.paymentUser._id,
  })
    .select(
      "reference provider status displayAmount currency serviceTitle paidAt createdAt",
    )
    .lean();
  if (!payment) return res.status(404).json({ error: "Payment not found." });
  return res.json({ payment });
});

function receiptBusinessDetails() {
  return {
    name: "TasmaFive Solutions",
    email: "info@tasmafivesolutions.com",
    website: "https://tasmafivesolutions.com",
  };
}

function addReceiptRow(doc, label, value, y) {
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#64748b")
    .text(label, 54, y, { width: 155 });
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#0f172a")
    .text(String(value || "—"), 215, y, { width: 325, align: "right" });
}

function streamReceipt(res, payment) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 54,
    info: {
      Title: `Payment receipt ${payment.reference}`,
      Author: "TasmaFive Solutions",
      Subject: "Verified payment receipt",
    },
  });
  const business = receiptBusinessDetails();
  const isTest =
    typeof payment.metadata?.testMode === "boolean"
      ? payment.metadata.testMode
      : isTestProvider(payment.provider);

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="TasmaFive-receipt-${payment.reference}.pdf"`,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });
  doc.pipe(res);

  doc.rect(0, 0, 595.28, 126).fill("#0f172a");
  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor("#ffffff")
    .text("PAYMENT RECEIPT", 54, 42);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#cbd5e1")
    .text(business.name, 54, 76)
    .text(`${business.email}  •  ${business.website}`, 54, 94);

  if (isTest) {
    doc
      .roundedRect(422, 43, 119, 30, 4)
      .fill("#f59e0b")
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#0f172a")
      .text("TEST TRANSACTION", 428, 53, { width: 107, align: "center" });
  }

  doc
    .roundedRect(54, 154, 487, 54, 6)
    .fill("#ecfdf5")
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#047857")
    .text("PAID", 72, 169);
  doc
    .fontSize(20)
    .fillColor("#0f172a")
    .text(
      `${payment.currency} ${(payment.amountMinor / 100).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      200,
      166,
      { width: 323, align: "right" },
    );

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#0f172a")
    .text("Transaction details", 54, 240);
  const paidDate = payment.paidAt || payment.updatedAt;
  [
    ["Receipt reference", payment.reference],
    ["Provider", clean(payment.provider, 30).toUpperCase()],
    ["Provider payment ID", payment.providerPaymentId || "Not supplied"],
    ["Provider order ID", payment.providerOrderId || "Not supplied"],
    ["Payment date", new Date(paidDate).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
    ["Service", payment.serviceTitle],
    ["Status", "Successful / Captured"],
  ].forEach(([label, value], index) => addReceiptRow(doc, label, value, 270 + index * 26));

  doc
    .moveTo(54, 460)
    .lineTo(541, 460)
    .strokeColor("#e2e8f0")
    .stroke();
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#0f172a")
    .text("Customer", 54, 482);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#334155")
    .text(payment.customer.name, 54, 508)
    .text(payment.customer.email, 54, 526)
    .text(payment.customer.phone || "Phone not provided", 54, 544);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#0f172a")
    .text("Issued by", 320, 482);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#334155")
    .text(business.name, 320, 508)
    .text(business.email, 320, 526)
    .text(business.website, 320, 544);

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("#64748b")
    .text(
      isTest
        ? "This receipt records a test-mode transaction and is not proof of a live funds transfer."
        : "This receipt was generated from a server-verified successful payment record.",
      54,
      742,
      { width: 487, align: "center" },
    );
  doc.end();
}

router.get("/receipt/:reference", async (req, res, next) => {
  try {
    const referenceValue = clean(req.params.reference, 120);
    const session = readSession(req);
    const ownershipFilter =
      session?.projectsAccess &&
      session.userId &&
      session.userId !== "team-admin"
        ? { ownerUserId: session.userId }
        : null;
    if (!ownershipFilter) {
      return res.status(401).json({
        error: "Authentication is required to download this receipt.",
        code: "AUTH_REQUIRED",
      });
    }
    const payment = await Payment.findOne({
      reference: referenceValue,
      status: "paid",
      ...ownershipFilter,
    }).lean();
    if (!payment) {
      return res.status(404).json({
        error: "A successful payment receipt was not found.",
      });
    }
    streamReceipt(res, payment);
  } catch (error) {
    next(error);
  }
});

export async function stripeWebhook(req, res) {
  try {
    if (
      !process.env.STRIPE_SECRET_KEY?.trim() ||
      !process.env.STRIPE_WEBHOOK_SECRET?.trim()
    ) {
      return res.status(503).json({ error: "Webhook is not configured." });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    const object = event.data.object;
    let referenceValue = object.metadata?.reference;
    let paymentIntentId =
      typeof object.payment_intent === "string" ? object.payment_intent : "";
    if (!referenceValue && event.type === "charge.dispute.created" && object.charge) {
      const charge = await stripe.charges.retrieve(String(object.charge));
      referenceValue = charge.metadata?.reference;
      paymentIntentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : "";
    }
    if (event.type === "checkout.session.completed" && referenceValue) {
      const payment = await Payment.findOne({
        reference: referenceValue,
        provider: "stripe",
      });
      if (payment) {
        const reconciled =
          object.id === payment.providerSessionId &&
          object.payment_status === "paid" &&
          Number(object.amount_total) === payment.amountMinor &&
          String(object.currency || "").toUpperCase() === payment.currency;
        payment.metadata = {
          ...(payment.metadata || {}),
          stripeEvent: event.type,
        };
        if (reconciled) {
          payment.status = "paid";
          payment.providerPaymentId = String(object.payment_intent || "");
          payment.paidAt = new Date();
        } else {
          payment.status = "failed";
          payment.failureMessage = "Stripe amount, currency, session or paid status did not match.";
        }
        await payment.save();
      }
    } else if (referenceValue || paymentIntentId) {
      const update = { "metadata.stripeEvent": event.type };
      if (event.type === "payment_intent.payment_failed") {
        update.status = "failed";
        update.failureMessage = "Stripe reported that the payment failed.";
      } else if (event.type === "charge.refunded") {
        update.status = "refunded";
        update.refundedAt = new Date();
      } else if (event.type === "charge.dispute.created") {
        update.status = "disputed";
      }
      await Payment.findOneAndUpdate(
        {
          provider: "stripe",
          ...(referenceValue
            ? { reference: referenceValue }
            : { providerPaymentId: paymentIntentId }),
        },
        update,
      );
    }
    return res.json({ received: true });
  } catch (error) {
    safeLogError("stripe-webhook", error);
    return res.status(400).json({ error: "Webhook verification failed." });
  }
}

export async function razorpayWebhook(req, res) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
    if (!webhookSecret) {
      return res.status(503).json({ error: "Webhook is not configured." });
    }
    const signature = clean(req.headers["x-razorpay-signature"], 300);
    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");
    if (
      !signature ||
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return res.status(400).json({ error: "Invalid webhook signature." });
    }
    const event = JSON.parse(req.body.toString("utf8"));
    const entity = event.payload?.payment?.entity;
    const orderId = entity?.order_id;
    if (orderId) {
      const payment = await Payment.findOne({ providerOrderId: orderId });
      if (
        payment &&
        Number(entity.amount) === payment.amountMinor &&
        entity.currency === payment.currency
      ) {
        payment.providerPaymentId = entity.id || "";
        payment.metadata = {
          ...(payment.metadata || {}),
          razorpayEvent: event.event,
        };
        if (event.event === "payment.captured") {
          payment.status = "paid";
          payment.paidAt = new Date();
        } else if (event.event === "payment.failed") {
          payment.status = "failed";
          payment.failureCode = entity.error_code || "";
          payment.failureMessage = entity.error_description || "Payment failed.";
        }
        await payment.save();
      }
    }
    return res.json({ received: true });
  } catch (error) {
    safeLogError("razorpay-webhook", error);
    return res.status(400).json({ error: "Webhook processing failed." });
  }
}

export async function paypalWebhook(req, res) {
  try {
    if (
      !process.env.PAYPAL_CLIENT_ID?.trim() ||
      !process.env.PAYPAL_CLIENT_SECRET?.trim() ||
      !process.env.PAYPAL_WEBHOOK_ID?.trim()
    ) {
      return res.status(503).json({ error: "Webhook is not configured." });
    }
    const { base, token } = await paypalAccessToken();
    const verify = await fetch(
      `${base}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_algo: req.headers["paypal-auth-algo"],
          cert_url: req.headers["paypal-cert-url"],
          transmission_id: req.headers["paypal-transmission-id"],
          transmission_sig: req.headers["paypal-transmission-sig"],
          transmission_time: req.headers["paypal-transmission-time"],
          webhook_id: process.env.PAYPAL_WEBHOOK_ID,
          webhook_event: req.body,
        }),
      },
    );
    const verified = await verify.json();
    if (verified.verification_status !== "SUCCESS") {
      return res.status(400).json({ error: "Invalid webhook signature." });
    }
    const eventType = req.body.event_type;
    const resource = req.body.resource;
    const orderId =
      resource?.supplementary_data?.related_ids?.order_id ||
      resource?.id;
    const payment = await Payment.findOne({
      provider: "paypal",
      providerOrderId: orderId,
    });
    if (payment) {
      payment.metadata = {
        ...(payment.metadata || {}),
        paypalEvent: eventType,
      };
      if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
        const reconciled =
          resource?.status === "COMPLETED" &&
          resource?.amount?.currency_code === payment.currency &&
          Math.round(Number(resource?.amount?.value) * 100) === payment.amountMinor;
        if (reconciled) {
          payment.status = "paid";
          payment.providerPaymentId = resource.id || "";
          payment.paidAt = new Date();
        } else {
          payment.status = "failed";
          payment.failureMessage = "PayPal amount, currency or capture status did not match.";
        }
      } else if (eventType === "PAYMENT.CAPTURE.DENIED") {
        payment.status = "failed";
      } else if (eventType === "PAYMENT.CAPTURE.REFUNDED") {
        payment.status = "refunded";
        payment.refundedAt = new Date();
      } else if (eventType === "CUSTOMER.DISPUTE.CREATED") {
        payment.status = "disputed";
      }
      await payment.save();
    }
    return res.json({ received: true });
  } catch (error) {
    safeLogError("paypal-webhook", error);
    return res.status(400).json({ error: "Webhook verification failed." });
  }
}

export default router;

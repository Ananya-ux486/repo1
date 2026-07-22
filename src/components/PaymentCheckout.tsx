"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import ProjectsAuthModal from "@/components/ProjectsAuthModal";

type Provider = "razorpay" | "ccavenue" | "stripe" | "paypal";
type Package = {
  slug: string;
  title: string;
  tagline: string;
  indiaPrice: string;
  foreignPrice: string;
};
type PaymentLink = {
  token: string;
  title: string;
  amountMinor: number;
  currency: "INR" | "USD";
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  allowedProviders: Provider[];
  expiresAt: string;
};

const CUSTOM_SERVICE_SLUG = "__custom__";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, callback: (data: Record<string, string>) => void) => void;
    };
  }
}

const providerDetails: Record<
  Provider,
  { label: string; description: string; region: string }
> = {
  razorpay: {
    label: "Razorpay",
    description: "UPI, cards, net banking and wallets",
    region: "India · INR",
  },
  ccavenue: {
    label: "CCAvenue",
    description: "Cards, net banking and Indian payment methods",
    region: "India · INR",
  },
  stripe: {
    label: "Stripe",
    description: "International credit and debit cards",
    region: "International · USD",
  },
  paypal: {
    label: "PayPal",
    description: "PayPal balance and supported cards",
    region: "International · USD",
  },
};

async function json<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error || "Request failed.") as Error & {
      status?: number;
      code?: string;
    };
    error.status = response.status;
    error.code = data.code;
    throw error;
  }
  return data;
}

function loadRazorpay() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentCheckout() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [available, setAvailable] = useState<Record<Provider, boolean>>({
    razorpay: false,
    ccavenue: false,
    stripe: false,
    paypal: false,
  });
  const [paymentLink, setPaymentLink] = useState<PaymentLink | null>(null);
  const [serviceSlug, setServiceSlug] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [provider, setProvider] = useState<Provider>("razorpay");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const packageParam = params.get("package") || "";
    const linkToken = params.get("link") || "";
    Promise.all([
      json<{
        authenticated: boolean;
        projectsAccess: boolean;
        user?: { id: string; name: string; email: string };
      }>("/api/auth/session"),
      json<{ providers: Record<Provider, boolean> }>("/api/payments/config"),
      json<{ items: Package[] }>("/api/payments/packages"),
      linkToken
        ? json<{ item: PaymentLink }>(`/api/payments/links/${encodeURIComponent(linkToken)}`)
        : Promise.resolve(null),
    ])
      .then(([session, config, packageData, linkData]) => {
        setAvailable(config.providers);
        setPackages(packageData.items);
        setServiceSlug(
          packageData.items.some((item) => item.slug === packageParam)
            ? packageParam
            : packageData.items[0]?.slug || "",
        );
        if (linkData?.item) {
          setPaymentLink(linkData.item);
          setName(linkData.item.customerName || "");
          setEmail(linkData.item.customerEmail || "");
          setPhone(linkData.item.customerPhone || "");
          const first = linkData.item.allowedProviders.find(
            (item) => config.providers[item],
          );
          if (first) setProvider(first);
        } else {
          const first = (Object.keys(config.providers) as Provider[]).find(
            (item) => config.providers[item],
          );
          if (first) setProvider(first);
        }
        const canPay =
          session.authenticated &&
          session.projectsAccess &&
          Boolean(session.user) &&
          session.user?.id !== "team-admin";
        setAuthenticated(canPay);
        if (canPay && session.user) {
          setName(session.user.name);
          setEmail(session.user.email);
        }
      })
      .catch((reason) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedPackage = packages.find((item) => item.slug === serviceSlug);
  const isCustomPayment = !paymentLink && serviceSlug === CUSTOM_SERVICE_SLUG;
  const allowedProviders = useMemo(() => {
    if (!paymentLink) return Object.keys(providerDetails) as Provider[];
    return paymentLink.allowedProviders;
  }, [paymentLink]);
  const checkoutProviders = isCustomPayment
    ? (["razorpay"] as Provider[])
    : allowedProviders;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await json<{
        kind: "redirect" | "form" | "razorpay";
        reference: string;
        url?: string;
        fields?: Record<string, string>;
        keyId?: string;
        orderId?: string;
        amount?: number;
        currency?: string;
        description?: string;
        customer?: { name: string; email: string; phone: string };
      }>("/api/payments/create", {
        method: "POST",
        body: JSON.stringify({
          provider,
          serviceSlug,
          paymentType: isCustomPayment ? "custom" : "package",
          customAmount: isCustomPayment ? customAmount : undefined,
          paymentLink: paymentLink?.token,
          name,
          email,
          phone,
        }),
      });

      if (result.kind === "redirect" && result.url) {
        window.location.assign(result.url);
        return;
      }
      if (result.kind === "form" && result.url && result.fields) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = result.url;
        Object.entries(result.fields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return;
      }
      if (result.kind === "razorpay") {
        if (!(await loadRazorpay()) || !window.Razorpay) {
          throw new Error("Razorpay checkout could not load. Please retry.");
        }
        const checkout = new window.Razorpay({
          key: result.keyId,
          order_id: result.orderId,
          amount: result.amount,
          currency: result.currency,
          name: "TasmaFive Solutions",
          description: result.description,
          prefill: result.customer,
          theme: { color: "#0f172a" },
          modal: {
            ondismiss: () => {
              void fetch("/api/payments/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference: result.reference }),
              });
              window.location.assign(
                `/payment/result?reference=${encodeURIComponent(result.reference)}&cancelled=1`,
              );
            },
          },
          handler: async (response: Record<string, string>) => {
            await json("/api/payments/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({ ...response, reference: result.reference }),
            });
            window.location.assign(
              `/payment/result?reference=${encodeURIComponent(result.reference)}`,
            );
          },
        });
        checkout.on("payment.failed", (response) => {
          setError(response.error_description || "Payment failed. Please retry.");
          setSubmitting(false);
        });
        checkout.open();
        return;
      }
      throw new Error("Invalid payment response.");
    } catch (reason) {
      const requestError = reason as Error & { status?: number };
      if (requestError.status === 401) setAuthenticated(false);
      setError(
        reason instanceof Error ? reason.message : "Payment could not start.",
      );
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm text-slate-600">
        Loading secure checkout…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <LockKeyhole className="mx-auto h-10 w-10 text-slate-900" />
          <h1 className="mt-4 text-2xl font-bold text-slate-950">
            Login required for payment
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Log in or create an account to securely continue. You will return to
            this payment after verification.
          </p>
        </div>
        <ProjectsAuthModal
          open
          purpose="payment"
          onUnlocked={(user) => {
            setAuthenticated(true);
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone || "");
            setError("");
          }}
        />
      </section>
    );
  }

  const noProvider = !checkoutProviders.some((item) => available[item]);

  return (
    <section className="bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_380px]">
        <form
          onSubmit={submit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-7 flex items-start gap-3">
            <span className="rounded-xl bg-slate-900 p-2.5 text-white">
              <LockKeyhole className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-950">Secure payment</h1>
              <p className="mt-1 text-sm text-slate-600">
                Payment details are handled by the selected PCI-compliant provider.
              </p>
            </div>
          </div>

          {!paymentLink && (
            <label className="mb-5 block text-sm font-semibold text-slate-800">
              Service package
              <select
                value={serviceSlug}
                onChange={(event) => {
                  const value = event.target.value;
                  setServiceSlug(value);
                  if (value === CUSTOM_SERVICE_SLUG) setProvider("razorpay");
                }}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-slate-700"
                required
              >
                {packages.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.title} · {item.indiaPrice || "INR custom"} /{" "}
                    {item.foreignPrice || "USD custom"}
                  </option>
                ))}
                <option value={CUSTOM_SERVICE_SLUG}>Custom amount · INR</option>
              </select>
            </label>
          )}

          {isCustomPayment && (
            <label className="mb-5 block text-sm font-semibold text-slate-800">
              Custom amount (INR)
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Enter an amount from ₹1 to ₹10,00,000.
              </span>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-500">
                  ₹
                </span>
                <input
                  value={customAmount}
                  onChange={(event) => setCustomAmount(event.target.value)}
                  type="number"
                  inputMode="decimal"
                  min="1"
                  max="1000000"
                  step="0.01"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 outline-none focus:border-slate-700"
                  placeholder="Enter amount"
                  required
                />
              </div>
            </label>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-800">
              Full name
              <input
                value={name}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-700"
                autoComplete="name"
                readOnly
                required
              />
            </label>
            <label className="text-sm font-semibold text-slate-800">
              Email
              <input
                value={email}
                type="email"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-700"
                autoComplete="email"
                readOnly
                required
              />
            </label>
          </div>
          <label className="mt-4 block text-sm font-semibold text-slate-800">
            Phone number
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-700"
              autoComplete="tel"
            />
          </label>

          <fieldset className="mt-7">
            <legend className="mb-3 text-sm font-semibold text-slate-800">
              Choose payment provider
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {checkoutProviders.map((item) => {
                const detail = providerDetails[item];
                const enabled = available[item];
                return (
                  <label
                    key={item}
                    className={`rounded-xl border p-4 ${
                      provider === item
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200"
                    } ${enabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="provider"
                        value={item}
                        checked={provider === item}
                        onChange={() => setProvider(item)}
                        disabled={!enabled}
                      />
                      <span>
                        <span className="block font-bold text-slate-950">
                          {detail.label}
                        </span>
                        <span className="block text-xs text-slate-500">
                          {detail.region}
                        </span>
                      </span>
                    </span>
                    <span className="mt-2 block text-xs text-slate-600">
                      {enabled ? detail.description : "Setup pending"}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {error && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {noProvider && !error && (
            <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Online payment setup is pending. Please contact TasmaFive support before
              placing this payment.
            </p>
          )}
          <button
            type="submit"
            disabled={submitting || noProvider}
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CreditCard className="h-5 w-5" />
            {submitting ? "Opening secure checkout…" : "Continue to payment"}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-950">Order summary</h2>
          <div className="mt-5 border-b border-slate-200 pb-5">
            <p className="font-semibold text-slate-900">
              {isCustomPayment
                ? "Custom payment"
                : paymentLink?.title || selectedPackage?.title || "Service package"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {paymentLink
                ? `Valid until ${new Date(paymentLink.expiresAt).toLocaleDateString()}`
                : isCustomPayment
                  ? "Secure INR payment via Razorpay"
                  : selectedPackage?.tagline}
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-slate-600">Amount</span>
            <strong className="text-xl text-slate-950">
              {paymentLink
                ? paymentLink.currency === "INR"
                  ? `₹${(paymentLink.amountMinor / 100).toLocaleString("en-IN")}`
                  : `$${(paymentLink.amountMinor / 100).toFixed(2)}`
                : isCustomPayment
                  ? customAmount
                    ? `₹${Number(customAmount).toLocaleString("en-IN")}`
                    : "Enter amount"
                : provider === "razorpay" || provider === "ccavenue"
                  ? selectedPackage?.indiaPrice
                  : selectedPackage?.foreignPrice}
            </strong>
          </div>
          <ul className="mt-7 space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              Server-verified amount and payment status
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
              We never store card numbers or CVV
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

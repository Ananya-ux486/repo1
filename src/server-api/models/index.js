import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, default: "" },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } },
);

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Number, required: true },
  purpose: { type: String, default: "projects-access" },
  attempts: { type: Number, default: 0 },
});

const activitySchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  ip: String,
  userAgent: String,
  notifiedAdmin: { type: Boolean, default: false },
  createdAt: { type: String, required: true },
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  reason: String,
  message: String,
  createdAt: { type: String, required: true },
});

const quoteSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  projectType: String,
  budget: String,
  details: String,
  createdAt: { type: String, required: true },
});

const auditSchema = new mongoose.Schema({
  name: String,
  email: String,
  countryCode: String,
  phone: String,
  fullPhone: String,
  company: String,
  website: String,
  focus: String,
  message: String,
  createdAt: { type: String, required: true },
});

const serviceSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      enum: [
        "web-development",
        "digital-marketing",
        "crm",
        "cloud-solutions",
        "other",
      ],
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    details: { type: String, default: "" },
    features: { type: [String], default: [] },
    subServices: {
      type: [
        {
          name: { type: String, required: true },
          description: { type: String, default: "" },
          _id: false,
        },
      ],
      default: [],
    },
    pricingType: {
      type: String,
      enum: ["", "fixed", "custom"],
      default: "",
    },
    indiaPrice: { type: String, default: "" },
    foreignPrice: { type: String, default: "" },
    indiaNote: { type: String, default: "" },
    foreignNote: { type: String, default: "" },
    accent: {
      type: String,
      enum: ["", "amber", "coral", "sky", "mint"],
      default: "",
    },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

const projectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    tags: { type: [String], default: [] },
    preview: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

const paymentSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    provider: {
      type: String,
      required: true,
      enum: ["razorpay", "ccavenue", "stripe", "paypal"],
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "created",
        "pending",
        "paid",
        "failed",
        "cancelled",
        "refunded",
        "disputed",
      ],
      default: "created",
      index: true,
    },
    amountMinor: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, uppercase: true, trim: true },
    displayAmount: { type: String, required: true },
    source: {
      type: String,
      enum: ["package", "quote", "custom"],
      default: "package",
      index: true,
    },
    ownerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceSlug: { type: String, default: "", index: true },
    serviceTitle: { type: String, default: "" },
    quoteRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuoteRequest",
      default: null,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true, index: true },
      phone: { type: String, default: "" },
    },
    providerOrderId: { type: String, default: "", index: true },
    providerPaymentId: { type: String, default: "", index: true },
    providerSessionId: { type: String, default: "", index: true },
    receiptUrl: { type: String, default: "" },
    failureCode: { type: String, default: "" },
    failureMessage: { type: String, default: "" },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    paidAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

paymentSchema.index({ createdAt: -1 });

const paymentLinkSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    amountMinor: { type: Number, required: true, min: 1 },
    currency: { type: String, required: true, uppercase: true },
    customerName: { type: String, default: "" },
    customerEmail: { type: String, default: "" },
    customerPhone: { type: String, default: "" },
    quoteRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuoteRequest",
      default: null,
    },
    allowedProviders: {
      type: [String],
      default: ["razorpay", "ccavenue", "stripe", "paypal"],
    },
    active: { type: Boolean, default: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
export const Otp = mongoose.model("Otp", otpSchema);
export const Activity = mongoose.model("Activity", activitySchema);
export const ContactMessage = mongoose.model("ContactMessage", contactSchema);
export const QuoteRequest = mongoose.model("QuoteRequest", quoteSchema);
export const AuditRequest = mongoose.model("AuditRequest", auditSchema);
export const Service = mongoose.model("Service", serviceSchema);
export const Project = mongoose.model("Project", projectSchema);
export const Payment = mongoose.model("Payment", paymentSchema);
export const PaymentLink = mongoose.model("PaymentLink", paymentLinkSchema);

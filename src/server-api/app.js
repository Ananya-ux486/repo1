import "./load-env.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { closeDb, connectDb } from "./db.js";
import contactRoutes from "./routes/contact.js";
import quoteRoutes from "./routes/quote.js";
import auditRoutes from "./routes/audit.js";
import instagramRoutes from "./routes/instagram.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import paymentRoutes, {
  paypalWebhook,
  razorpayWebhook,
  stripeWebhook,
} from "./routes/payments.js";
import { seedCmsContent } from "./seed.js";
import { safeLogError, validateRuntimeConfig } from "./utils/security.js";

let initialized = false;

export function createPublicApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      hsts:
        process.env.NODE_ENV === "production"
          ? { maxAge: 31536000, includeSubDomains: true, preload: true }
          : false,
    }),
  );
  app.use(
    process.env.NODE_ENV === "production"
      ? morgan(":method :status :response-time ms")
      : morgan("dev"),
  );
  const allowedOrigins = new Set(
    (
      process.env.ALLOWED_ORIGINS ||
      (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000")
    )
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) return callback(null, true);
        const error = new Error("Origin is not allowed by CORS.");
        error.status = 403;
        return callback(error);
      },
      credentials: true,
      methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type"],
      maxAge: 600,
    }),
  );

  // Webhook routes must precede all parsers so provider signatures see raw bytes.
  app.post(
    "/api/payments/webhooks/stripe",
    express.raw({ type: "application/json", limit: "256kb" }),
    stripeWebhook,
  );
  app.post(
    "/api/payments/webhooks/razorpay",
    express.raw({ type: "application/json", limit: "256kb" }),
    razorpayWebhook,
  );
  app.use(express.json({ limit: "512kb" }));
  app.use(express.urlencoded({ extended: false, limit: "256kb" }));
  app.use(cookieParser());
  app.use(
    "/api",
    rateLimit({
      windowMs: 60 * 1000,
      limit: 180,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "tasmafive-server" });
  });
  app.use("/api/contact", contactRoutes);
  app.use("/api/quote", quoteRoutes);
  app.use("/api/audit", auditRoutes);
  app.use("/api/instagram", instagramRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/content", contentRoutes);
  app.post("/api/payments/webhooks/paypal", paypalWebhook);
  app.use("/api/payments", paymentRoutes);
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found." });
  });
  app.use((err, _req, res, _next) => {
    if (err?.type === "entity.parse.failed" || err instanceof SyntaxError) {
      return res.status(400).json({ error: "Invalid JSON body." });
    }
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ error: "A record with this slug or email already exists." });
    }
    if (err?.status === 403) {
      return res.status(403).json({ error: "Request origin is not allowed." });
    }
    safeLogError("server", err);
    return res.status(500).json({ error: "Internal server error." });
  });
  return app;
}

export async function initializePublicApi() {
  if (initialized) return createPublicApp();
  validateRuntimeConfig();
  await connectDb(process.env.MONGODB_URI);
  await seedCmsContent();
  initialized = true;
  return createPublicApp();
}

export async function closePublicApi() {
  initialized = false;
  await closeDb();
}

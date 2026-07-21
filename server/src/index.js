import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDb } from "./db.js";
import contactRoutes from "./routes/contact.js";
import quoteRoutes from "./routes/quote.js";
import auditRoutes from "./routes/audit.js";
import instagramRoutes from "./routes/instagram.js";
import authRoutes from "./routes/auth.js";
import adminRoutes, { ensureInitialAdmin } from "./routes/admin.js";
import contentRoutes from "./routes/content.js";
import { seedCmsContent } from "./seed.js";

const PORT = Number(process.env.PORT || 8080);
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("[server] MONGODB_URI missing in server/.env");
  process.exit(1);
}

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(process.env.NODE_ENV === "production" ? morgan("combined") : morgan("dev"));
const allowedOrigins = new Set(
  (
    process.env.ALLOWED_ORIGINS ||
    "http://localhost:3000,http://localhost:3001,https://project.tasmafivesolutions.com,https://admin.tasmafivesolutions.com"
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "512kb" }));
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
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  if (err?.type === "entity.parse.failed" || err instanceof SyntaxError) {
    return res.status(400).json({ error: "Invalid JSON body." });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ error: "A record with this slug or email already exists." });
  }
  console.error("[server]", err);
  res.status(500).json({ error: "Internal server error." });
});

await connectDb(MONGODB_URI);
await ensureInitialAdmin();
await seedCmsContent();
app.listen(PORT, () => {
  console.log(`[tasmafive-server] http://localhost:${PORT}`);
});

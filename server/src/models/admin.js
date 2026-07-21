import mongoose from "mongoose";
import { getAdminConnection } from "../db.js";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, default: "Administrator" },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["owner", "editor"], default: "owner" },
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

const adminAuditSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: String,
    ip: String,
    userAgent: String,
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const adminSessionSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
      index: true,
    },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    revokedAt: { type: Date, default: null },
    ip: String,
    userAgent: String,
  },
  { timestamps: true },
);

let models;

export function getAdminModels() {
  if (models) return models;
  const connection = getAdminConnection();
  models = {
    Admin:
      connection.models.Admin ||
      connection.model("Admin", adminSchema),
    AdminAudit:
      connection.models.AdminAudit ||
      connection.model("AdminAudit", adminAuditSchema),
    AdminSession:
      connection.models.AdminSession ||
      connection.model("AdminSession", adminSessionSchema),
  };
  return models;
}

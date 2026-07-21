import mongoose from "mongoose";

let adminConnection;

function deriveAdminUri(uri) {
  const marker = ".mongodb.net/";
  const index = uri.indexOf(marker);
  if (index === -1) return uri;
  const prefix = uri.slice(0, index + marker.length);
  const queryIndex = uri.indexOf("?", index);
  const query = queryIndex === -1 ? "" : uri.slice(queryIndex);
  return `${prefix}tasmafiveAdminDB${query}`;
}

export async function connectDb(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  const adminUri =
    process.env.MONGODB_ADMIN_URI?.trim() || deriveAdminUri(uri);
  adminConnection = await mongoose
    .createConnection(adminUri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
    })
    .asPromise();
  console.log(
    `[db] connected → shared=${mongoose.connection.name}, admin=${adminConnection.name}`,
  );
}

export function getAdminConnection() {
  if (!adminConnection) {
    throw new Error("Admin database is not connected.");
  }
  return adminConnection;
}

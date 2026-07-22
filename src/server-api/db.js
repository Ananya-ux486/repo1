import mongoose from "mongoose";

export async function connectDb(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`[db] shared database connected → ${mongoose.connection.name}`);
}

export async function closeDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

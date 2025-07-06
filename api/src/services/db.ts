import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log("🔗 Connecting to MongoDB...");
console.log(process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not set");
}
if (!process.env.MONGO_MAX_POOL) {
  console.warn("MONGO_MAX_POOL is not set, using default value of 100");
}
if (!process.env.MONGO_MIN_POOL) {
  console.warn("MONGO_MIN_POOL is not set, using default value of 0");
}
if (!process.env.MONGO_MAX_IDLE_MS) {
  console.warn("MONGO_MAX_IDLE_MS is not set, using default value of 0");
}
if (!process.env.MONGO_WAIT_QUEUE_MS) {
  console.warn("MONGO_WAIT_QUEUE_MS is not set, using default value of 0");
}
if (!process.env.MONGO_MAX_CONNECTING) {
  console.warn("MONGO_MAX_CONNECTING is not set, using default value of 2");
}

const client = new MongoClient(process.env.MONGO_URI!, {
  maxPoolSize: parseInt(process.env.MONGO_MAX_POOL ?? "100", 10),
  minPoolSize: parseInt(process.env.MONGO_MIN_POOL ?? "0", 10),
  maxIdleTimeMS: parseInt(process.env.MONGO_MAX_IDLE_MS ?? "0", 10),
  waitQueueTimeoutMS: parseInt(process.env.MONGO_WAIT_QUEUE_MS ?? "0", 10),
  maxConnecting: parseInt(process.env.MONGO_MAX_CONNECTING ?? "2", 10),
  retryWrites: true,
  retryReads: true,
});

export const db: Db = client.db("fleetiq");

export const connectMongo = async () => {
  let attempts = 5;

  while (attempts > 0) {
    try {
      await client.connect();
      console.log("✅ MongoDB connected");
      return;
    } catch (err) {
      attempts--;
      console.warn(`MongoDB not ready, retrying (${attempts})…`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
  throw new Error("❌ Could not reach MongoDB after retries");
};

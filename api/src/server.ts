import Fastify from "fastify";
import cors from "@fastify/cors";
import telemetryRoutes from "./routes/telemetry.js";
import { connectMongo } from "./services/db.js";
import healthRoute from "./routes/health.js";
import "dotenv/config";

// Validate environment variables
const PORT = Number(process.env.PORT ?? 3000);
const LOG_LEVEL = process.env.LOG_LEVEL ?? "info";
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

const app = Fastify({
  logger: {
    level: LOG_LEVEL,
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  },
});

async function startServer() {
  try {
    app.log.info("Connecting to MongoDB at", process.env.MONGO_URI);

    // Connect to MongoDB before registering routes or starting the server
    const db = await connectMongo();
    app.decorate("db", db); // Make MongoDB client available to routes

    // Register plugins and routes
    await app.register(cors, {
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://your-domain.com"]
          : true,
    });
    await app.register(telemetryRoutes);
    await app.register(healthRoute);

    // Start the server
    await app.listen({ port: PORT, host: "0.0.0.0" });

    console.log(`🚀 API ready on http://localhost:${PORT}`);
  } catch (error) {
    app.log.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGTERM", (error) => {
  console.log(error);
});

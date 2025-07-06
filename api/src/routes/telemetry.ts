import { FastifyPluginAsync } from "fastify";
import { db } from "../services/db.js";

const telemetryRoutes: FastifyPluginAsync = async (app) => {
  app.get("/telemetry", async (_request, reply) => {
    const docs = await db
      .collection("telemetry")
      .find({}, { projection: { _id: 0 } })
      .limit(50)
      .toArray();
    reply.send(docs);
  });
};

export default telemetryRoutes;

import { FastifyPluginAsync } from "fastify";
import { db } from "../services/db.js";

const healthRoute: FastifyPluginAsync = async (app) => {
  app.get("/health", async (_, reply) => {
    const stats = await db.admin().command({ connPoolStats: 1 });
    reply.send({
      ok: true,
      pool: {
        inUse: stats.pools[0].inUse,
        available: stats.pools[0].available,
        waitQueueSize: stats.pools[0].waitQueueSize,
      },
    });
  });
};

export default healthRoute;

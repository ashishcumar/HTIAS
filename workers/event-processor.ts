import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

export const QUEUE_NAME = "events";

const prisma = new PrismaClient();

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    try {
      const eventData = job.data;
      const { eventType, timestamp, source, entityId, context } = eventData;
      await prisma.event.create({
        data: {
          eventType,
          timestamp: BigInt(timestamp),
          source,
          entityId: entityId || null,
          context: context || null,
        },
      });
      console.log(`Event processed: ${job.id}`);
    } catch (e) {
      console.error(`Event processing job ${job.id}:`, e);
      throw e;
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT || "6379"),
    },
  }
);

console.log(`Worker started, listening to queue: ${QUEUE_NAME}`);

worker.on("completed", (job) => {
  console.log(`job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.log(`job ${job?.id} failed:`, err);
});

process.on("SIGTERM", async () => {
  await worker.close();
  await prisma.$disconnect();
  process.exit(0);
});

import "dotenv/config";

import { env } from "node:process";

import { z } from "zod";

const configSchema = z.object({
  ADAX_USERNAME: z.string().min(1),
  ADAX_PASSWORD: z.string().min(1),
  MQTT_BROKER_URL: z.string().min(1),
  MQTT_CRON_SCHEDULE: z.string().optional(),
});

const config = configSchema.safeParse(env);

if (!config.success) {
  console.error("❌ Invalid environment variables:", config.error.format());
  process.exit(1);
}

export default config.data;

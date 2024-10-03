import "dotenv/config";

import cron from "node-cron";

import { refreshEnergyData } from "./messages";

const EVERY_TEN_MINUTES = "*/10 * * * *";

cron.schedule(process.env.MQTT_CRON_SCHEDULE ?? EVERY_TEN_MINUTES, () => {
  void refreshEnergyData();
});

void refreshEnergyData();

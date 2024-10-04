import cron from "node-cron";

import config from "./config";
import { refreshEnergyData } from "./messages";

const EVERY_TEN_MINUTES = "*/10 * * * *";

cron.schedule(config.MQTT_CRON_SCHEDULE ?? EVERY_TEN_MINUTES, () => {
  void refreshEnergyData();
});

void refreshEnergyData();

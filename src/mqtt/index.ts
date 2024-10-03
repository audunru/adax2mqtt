import "dotenv/config";

import cron from "node-cron";

import { getContent } from "../adax-api/content";
import { publishDiscoveryMessages } from "./messages/discovery";
import { publishEnergyMessages } from "./messages/energy";

const EVERY_TEN_MINUTES = "*/10 * * * *";

const refreshEnergyData = async (): Promise<void> => {
  const data = await getContent();

  await publishDiscoveryMessages(data.rooms);
  await publishEnergyMessages(data.rooms);
};

cron.schedule(process.env.MQTT_CRON_SCHEDULE ?? EVERY_TEN_MINUTES, () => {
  const refresh = async (): Promise<void> => {
    try {
      await refreshEnergyData();
    } catch (e) {
      if (e instanceof Error) {
        console.error("Error during refresh of energy data: " + e.message);
      } else {
        console.error("Error during refresh of energy data");
      }
    }
  };

  void refresh();
});

void refreshEnergyData();

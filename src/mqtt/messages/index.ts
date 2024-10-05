import { getContent } from "../../adax-api/content";
import * as device from "./device";
import * as room from "./room";

export const refreshEnergyData = async (): Promise<void> => {
  try {
    const data = await getContent();

    await room.publishDiscoveryMessages(data.rooms);
    await device.publishDiscoveryMessages(data.devices);
    await room.publishEnergyMessages(data.rooms);
    await device.publishEnergyMessages(data.devices);
  } catch (e) {
    console.error("Error during refresh of energy data", (e as Error)?.message);
  }
};

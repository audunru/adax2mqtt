import { getContent } from "../../adax-api/content";
import { publishDiscoveryMessages } from "./discovery";
import { publishEnergyMessages } from "./energy";

export const refreshEnergyData = async (): Promise<void> => {
  try {
    const data = await getContent();

    await publishDiscoveryMessages(data.rooms);
    await publishEnergyMessages(data.rooms);
  } catch (e) {
    console.error("Error during refresh of energy data", (e as Error)?.message);
  }
};

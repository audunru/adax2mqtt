import { getEnergyLog } from "../../adax-api/energy";
import { publish } from "../client";
import { getTopic, RoomType } from "../utils";

export const publishEnergyMessages = async (
  rooms: RoomType[],
): Promise<void> => {
  for (const room of rooms) {
    const roomData = await getEnergyLog(room.id);
    const point = roomData.points[roomData.points.length - 1];

    const energyTopic = getTopic(room, "state");
    const energyKWh = point.energyWh / 1000;
    publish(getTopic(room, "state"), energyKWh.toString(10));
    console.info(`Published energy usage ${energyKWh} kWh to ${energyTopic}`);

    const lastResetTopic = getTopic(room, "last_reset");
    const lastReset = point.fromTime;
    publish(lastResetTopic, lastReset.toISOString());
    console.info(
      `Published last reset ${lastReset.toISOString()} to ${lastResetTopic}`,
    );
  }
};

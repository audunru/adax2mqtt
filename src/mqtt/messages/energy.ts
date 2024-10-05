import { getEnergyLog } from "../../adax-api/energy";
import { publishAsync } from "../client";
import { EnergyMessage, Publishable } from "../types";
import { getTopic, RoomType } from "../utils";

const getEnergyMessage = async (room: RoomType): Promise<Publishable> => {
  const roomData = await getEnergyLog(room.id);
  const point = roomData.points[roomData.points.length - 1];

  const energyKWh = point.energyWh / 1000;
  const lastReset = point.fromTime.toISOString();

  const message: EnergyMessage = {
    value: energyKWh,
    last_reset: lastReset,
  };

  return {
    topic: getTopic(room, "state"),
    message: JSON.stringify(message),
  };
};

export const publishEnergyMessages = async (
  rooms: RoomType[],
): Promise<void> => {
  for (const room of rooms) {
    const { topic, message } = await getEnergyMessage(room);
    await publishAsync(topic, message);

    console.info(`Published energy message ${message} to ${topic}`);
  }
};

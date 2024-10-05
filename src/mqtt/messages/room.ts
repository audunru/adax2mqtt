import { createCache } from "cache-manager";

import { getEnergyLog } from "../../adax-api/energy";
import { RoomType } from "../../adax-api/types";
import { publishAsync } from "../client";
import { EnergyMessage, Publishable } from "../types";
import { getTopic } from "../utils";

const discoveryCache = createCache();

const getDiscoveryMessage = (room: RoomType): Publishable => {
  const message = {
    name: `${room.name} Electric Consumption [kWh]`,
    unique_id: `adax_room_${room.id}_electric_consumption`,
    state_topic: getTopic(room.name, "room", "state"),
    unit_of_measurement: "kWh",
    device_class: "energy",
    state_class: "total",
    value_template: "{{ value_json.value }}",
    last_reset_value_template: "{{ value_json.last_reset }}",
  };

  return {
    topic: getTopic(room.name, "room", "config"),
    message: JSON.stringify(message),
  };
};

export const publishDiscoveryMessages = async (
  rooms: RoomType[],
): Promise<void> => {
  for (const room of rooms) {
    if ((await discoveryCache.get(`room_${room.id}`)) === null) {
      const { topic, message } = getDiscoveryMessage(room);
      await publishAsync(topic, message);

      console.info(`Published discovery message to ${topic}`);

      await discoveryCache.set(`room_${room.id}`, "discovered");
    }
  }
};

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
    topic: getTopic(room.name, "room", "state"),
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

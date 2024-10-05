import { createCache } from "cache-manager";

import { publishAsync } from "../client";
import { Publishable } from "../types";
import { getTopic, RoomType } from "../utils";

const discoveryCache = createCache();

const getDiscoveryMessage = (room: RoomType): Publishable => {
  const message = {
    name: `${room.name} Electric Consumption [kWh]`,
    unique_id: `adax_room_${room.id}_electric_consumption`,
    state_topic: getTopic(room, "state"),
    unit_of_measurement: "kWh",
    device_class: "energy",
    state_class: "total",
    value_template: "{{ value_json.value }}",
    last_reset_value_template: "{{ value_json.last_reset }}",
  };

  return {
    topic: getTopic(room, "config"),
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

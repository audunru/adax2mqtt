import { createCache } from "cache-manager";

import { DeviceType } from "../../adax-api/types";
import { publishAsync } from "../client";
import {
  EnergyMessage,
  Publishable,
  TotalIncreasingDiscoveryMessage,
} from "../types";
import { getTopic } from "../utils";

const discoveryCache = createCache();

const getDiscoveryMessage = (device: DeviceType): Publishable => {
  const message: TotalIncreasingDiscoveryMessage = {
    name: `${device.name} Electric Consumption [kWh]`,
    unique_id: `adax_device_${device.id}_electric_consumption`,
    state_topic: getTopic(device.name, "device", "state"),
    unit_of_measurement: "kWh",
    device_class: "energy",
    state_class: "total_increasing",
    value_template: "{{ value_json.value }}",
  };

  return {
    topic: getTopic(device.name, "device", "config"),
    message: JSON.stringify(message),
  };
};

export const publishDiscoveryMessages = async (
  devices: DeviceType[],
): Promise<void> => {
  for (const device of devices) {
    if ((await discoveryCache.get(`device_${device.id}`)) === null) {
      const { topic, message } = getDiscoveryMessage(device);
      await publishAsync(topic, message);

      console.info(`Published discovery message to ${topic}`);

      await discoveryCache.set(`device_${device.id}`, "discovered");
    }
  }
};

const getEnergyMessage = (device: DeviceType): Publishable => {
  const energyKWh = device.energyWh / 1000;

  const message: EnergyMessage = {
    value: energyKWh,
  };

  return {
    topic: getTopic(device.name, "device", "state"),
    message: JSON.stringify(message),
  };
};

export const publishEnergyMessages = async (
  devices: DeviceType[],
): Promise<void> => {
  for (const device of devices) {
    const { topic, message } = getEnergyMessage(device);
    await publishAsync(topic, message);

    console.info(`Published energy message ${message} to ${topic}`);
  }
};

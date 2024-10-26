import mqtt, { IClientPublishOptions } from "mqtt";

import config from "./config";

const client = mqtt.connect(config.MQTT_BROKER_URL, {
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD,
});

export const publishAsync = async (
  topic: string,
  message: string,
  options?: IClientPublishOptions,
): Promise<void> => {
  try {
    await client.publishAsync(topic, message, { qos: 1, ...options });
  } catch (e) {
    console.error(
      `Failed to publish message for ${topic}`,
      (e as Error)?.message,
    );
  }
};

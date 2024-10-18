import mqtt from "mqtt";

import config from "./config";

const client = mqtt.connect(config.MQTT_BROKER_URL, {
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD,
});

export const publishAsync = async (
  topic: string,
  message: string,
): Promise<void> => {
  try {
    await client.publishAsync(topic, message, { qos: 1 });
  } catch (e) {
    console.error(
      `Failed to publish message for ${topic}`,
      (e as Error)?.message,
    );
  }
};

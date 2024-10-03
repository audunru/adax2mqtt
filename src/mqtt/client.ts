import mqtt from "mqtt";

const client = mqtt.connect(process.env.MQTT_BROKER_URL);

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

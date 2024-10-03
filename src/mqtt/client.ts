import mqtt from "mqtt";

const client = mqtt.connect(process.env.MQTT_BROKER_URL);

export const publishAsync = async (
  topic: string,
  message: string,
): Promise<void> => {
  try {
    await client.publishAsync(topic, message, { qos: 1 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to publish message for ${topic}:`, error.message);
    } else {
      console.error(`Failed to publish message for ${topic}`);
    }
  }
};

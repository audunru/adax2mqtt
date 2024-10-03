import mqtt from "mqtt";

const client = mqtt.connect(process.env.MQTT_BROKER_URL);

const handleError = (error: Error | undefined, topic: string): void => {
  if (error) {
    console.error(`Failed to publish message for ${topic}:`, error.message);
  }
};

export const publish = (topic: string, message: string): void => {
  client.publish(topic, message, { qos: 1 }, (error) =>
    handleError(error, topic),
  );
};

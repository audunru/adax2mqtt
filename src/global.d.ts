declare namespace NodeJS {
  interface ProcessEnv {
    ADAX_USERNAME: string;
    ADAX_PASSWORD: string;
    MQTT_BROKER_URL: string;
    MQTT_CRON_SCHEDULE: string;
  }
}

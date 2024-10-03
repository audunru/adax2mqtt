declare namespace NodeJS {
  interface ProcessEnv {
    USERNAME: string;
    PASSWORD: string;
    MQTT_BROKER_URL: string;
    MQTT_CRON_SCHEDULE: string;
  }
}

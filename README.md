# adax2mqtt: Publish Adax electrix heater energy consumption to MQTT

This repo is now archived, because the built-in [Adax integration](https://www.home-assistant.io/integrations/adax/) now has support for energy monitoring.

View your Adax electric heaters in [Home Assistant](https://www.home-assistant.io/)'s energy dashboard.

This is a work in progress.

# Install and run

This assumes you already have Home Assistant and MQTT running.

## Docker

```sh
docker run -d -e ADAX_USERNAME="123" -e ADAX_PASSWORD="abc" -e MQTT_BROKER_URL="mqtt://127.0.0.1:1883" audunru/adax2mqtt
```

If you're using a username/password with MQTT, you can add `-e MQTT_USERNAME="" -e MQTT_PASSWORD=""` as well to the command.

## Docker Compose

```yml
services:
  adax2mqtt:
    image: audunru/adax2mqtt
    environment:
      ADAX_USERNAME: "" # Your Adax API account ID
      ADAX_PASSWORD: "" # Your Adax API token
      MQTT_BROKER_URL: "mqtt://127.0.0.1:1883"
      # MQTT_USERNAME: ""
      # MQTT_PASSWORD: ""
```

# Development

## Node

```sh
cp .env.example .env # Edit the values in .env afterwards
npm i
npm run dev
```

## Docker

```sh
docker build -t adax2mqtt-dev .
docker run -d -e ADAX_USERNAME="123" -e ADAX_PASSWORD="abc" -e MQTT_BROKER_URL="mqtt://127.0.0.1:1883" --name adax2mqtt-dev adax2mqtt-dev
```

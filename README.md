# adax2mqtt: Publish Adax electrix heater energy consumption to MQTT

View your Adax electric heaters in [Home Assistant](https://www.home-assistant.io/)'s energy dashboard.

This is a work in progress.

# Install and run

This assumes you already have Home Assistant and MQTT running.

## Docker

```sh
docker run -d -e ADAX_USERNAME="123" -e ADAX_PASSWORD="abc" -e MQTT_BROKER_URL="mqtt://127.0.0.1:1883" audunru/adax2mqtt
```

## Docker Compose

```yml
services:
  adax2mqtt:
    image: audunru/adax2mqtt
    environment:
      ADAX_USERNAME: "" # Your Adax API account ID
      ADAX_PASSWORD: "" # Your Adax API token
      MQTT_BROKER_URL: "mqtt://127.0.0.1:1883"
```

# Development

## Node

```sh
cp .env.example .env # Edit the values in .env afterwards
npm i
npm run build
node dist/mqtt.cjs
```

## Docker

```sh
docker build -t adax2mqtt-dev .
docker run -d -e ADAX_USERNAME="123" -e ADAX_PASSWORD="abc" -e MQTT_BROKER_URL="mqtt://127.0.0.1:1883" --name adax2mqtt-dev adax2mqtt-dev
```

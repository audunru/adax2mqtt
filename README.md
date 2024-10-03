TODO:

- startup
- kjør energy request 59 også
- vurder å bruke siste item i energy_log i stedet
- dokumentasjon
- flytt til repo
- start av express-server

```sh
docker build -t adax-mqtt -f adax-mqtt.Dockerfile .
docker run -d -e USERNAME=123 -e PASSWORD=abc --name adax-mqtt adax-mqtt
```

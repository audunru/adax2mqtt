import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, test, vi } from "vitest";

import multipleRoomsContent from "../../../__data__/multipleRoomsContent.json";
import { server } from "../../../mocks/server";
import { refreshEnergyData } from "..";

const mockPublishAsync = vi.fn();

vi.mock("../../../mqtt/client.ts", () => ({
  publishAsync: (topic: string, message: string) => {
    mockPublishAsync(topic, message);
  },
}));

vi.mock("cache-manager", () => ({
  createCache: () => ({
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn(),
  }),
}));

afterEach(() => {
  mockPublishAsync.mockClear();
});

describe("Given that the Adax API responds without errors", () => {
  describe("When refreshEnergyData is called", () => {
    test("It publishes expected messages to MQTT", async () => {
      await refreshEnergyData();

      expect(mockPublishAsync).toHaveBeenCalledTimes(4);
      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        1,
        "homeassistant/sensor/adax_room_living_room/config",
        JSON.stringify({
          name: "Living room Electric Consumption [kWh]",
          unique_id: "adax_room_100_electric_consumption",
          state_topic: "homeassistant/sensor/adax_room_living_room/state",
          unit_of_measurement: "kWh",
          device_class: "energy",
          state_class: "total",
          value_template: "{{ value_json.value }}",
          last_reset_value_template: "{{ value_json.last_reset }}",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        2,
        "homeassistant/sensor/adax_device_living_room/config",
        JSON.stringify({
          name: "Living room Electric Consumption [kWh]",
          unique_id: "adax_device_1000_electric_consumption",
          state_topic: "homeassistant/sensor/adax_device_living_room/state",
          unit_of_measurement: "kWh",
          device_class: "energy",
          state_class: "total_increasing",
          value_template: "{{ value_json.value }}",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        3,
        "homeassistant/sensor/adax_room_living_room/state",
        JSON.stringify({
          value: 5.123,
          last_reset: "2024-10-03T03:00:00.000Z",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        4,
        "homeassistant/sensor/adax_device_living_room/state",
        JSON.stringify({
          value: 0.007,
        }),
      );
    });
  });
});

describe("Given that the token endpoint responds with an error", () => {
  describe("When refreshEnergyData is called", () => {
    test("Nothing is published", async () => {
      server.use(
        http.post("https://api-1.adax.no/client-api/auth/token", () => {
          return HttpResponse.json({}, { status: 500 });
        }),
      );

      await refreshEnergyData();

      expect(mockPublishAsync).not.toHaveBeenCalled();
    });
  });
});

describe("Given that the content endpoint responds with an error", () => {
  describe("When refreshEnergyData is called", () => {
    test("Nothing is published", async () => {
      server.use(
        http.get("https://api-1.adax.no/client-api/rest/v1/content", () => {
          return HttpResponse.json({}, { status: 500 });
        }),
      );

      await refreshEnergyData();

      expect(mockPublishAsync).not.toHaveBeenCalled();
    });
  });
});

describe("Given that the energy_log endpoint responds with an error", () => {
  describe("When refreshEnergyData is called", () => {
    test("Discovery and energy messages for other rooms and all devices are published", async () => {
      server.use(
        http.get(
          "https://api-1.adax.no/client-api/rest/v1/energy_log/:id",
          () => {
            return HttpResponse.json({}, { status: 500 });
          },
        ),
      );

      await refreshEnergyData();

      expect(mockPublishAsync).toHaveBeenCalledTimes(3);
      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        1,
        "homeassistant/sensor/adax_room_living_room/config",
        JSON.stringify({
          name: "Living room Electric Consumption [kWh]",
          unique_id: "adax_room_100_electric_consumption",
          state_topic: "homeassistant/sensor/adax_room_living_room/state",
          unit_of_measurement: "kWh",
          device_class: "energy",
          state_class: "total",
          value_template: "{{ value_json.value }}",
          last_reset_value_template: "{{ value_json.last_reset }}",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        2,
        "homeassistant/sensor/adax_device_living_room/config",
        JSON.stringify({
          name: "Living room Electric Consumption [kWh]",
          unique_id: "adax_device_1000_electric_consumption",
          state_topic: "homeassistant/sensor/adax_device_living_room/state",
          unit_of_measurement: "kWh",
          device_class: "energy",
          state_class: "total_increasing",
          value_template: "{{ value_json.value }}",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        3,
        "homeassistant/sensor/adax_device_living_room/state",
        JSON.stringify({
          value: 0.007,
        }),
      );
    });
  });
});

describe("Given that the Living room energy_log endpoint responds with an error", () => {
  describe("When refreshEnergyData is called", () => {
    test("Discovery and energy messages for other rooms and all devices are published", async () => {
      server.use(
        http.get("https://api-1.adax.no/client-api/rest/v1/content", () => {
          return HttpResponse.json(multipleRoomsContent, { status: 200 });
        }),
      );

      server.use(
        http.get(
          "https://api-1.adax.no/client-api/rest/v1/energy_log/100",
          () => {
            return HttpResponse.json({}, { status: 500 });
          },
        ),
      );

      await refreshEnergyData();

      expect(mockPublishAsync).toHaveBeenCalledTimes(7);
      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        1,
        "homeassistant/sensor/adax_room_living_room/config",
        JSON.stringify({
          name: "Living room Electric Consumption [kWh]",
          unique_id: "adax_room_100_electric_consumption",
          state_topic: "homeassistant/sensor/adax_room_living_room/state",
          unit_of_measurement: "kWh",
          device_class: "energy",
          state_class: "total",
          value_template: "{{ value_json.value }}",
          last_reset_value_template: "{{ value_json.last_reset }}",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        2,
        "homeassistant/sensor/adax_room_bedroom/config",
        JSON.stringify({
          name: "Bedroom Electric Consumption [kWh]",
          unique_id: "adax_room_200_electric_consumption",
          state_topic: "homeassistant/sensor/adax_room_bedroom/state",
          unit_of_measurement: "kWh",
          device_class: "energy",
          state_class: "total",
          value_template: "{{ value_json.value }}",
          last_reset_value_template: "{{ value_json.last_reset }}",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        3,
        "homeassistant/sensor/adax_device_living_room/config",
        JSON.stringify({
          name: "Living room Electric Consumption [kWh]",
          unique_id: "adax_device_1000_electric_consumption",
          state_topic: "homeassistant/sensor/adax_device_living_room/state",
          unit_of_measurement: "kWh",
          device_class: "energy",
          state_class: "total_increasing",
          value_template: "{{ value_json.value }}",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        4,
        "homeassistant/sensor/adax_device_bedroom/config",
        JSON.stringify({
          name: "Bedroom Electric Consumption [kWh]",
          unique_id: "adax_device_2000_electric_consumption",
          state_topic: "homeassistant/sensor/adax_device_bedroom/state",
          unit_of_measurement: "kWh",
          device_class: "energy",
          state_class: "total_increasing",
          value_template: "{{ value_json.value }}",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        5,
        "homeassistant/sensor/adax_room_bedroom/state",
        JSON.stringify({
          value: 5.123,
          last_reset: "2024-10-03T03:00:00.000Z",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        6,
        "homeassistant/sensor/adax_device_living_room/state",
        JSON.stringify({
          value: 0.007,
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        7,
        "homeassistant/sensor/adax_device_bedroom/state",
        JSON.stringify({
          value: 0.007,
        }),
      );
    });
  });
});

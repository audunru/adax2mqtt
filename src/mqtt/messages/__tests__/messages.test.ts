import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, test, vi } from "vitest";

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

describe("Given that the Adax API responds without errors", () => {
  afterEach(() => {
    mockPublishAsync.mockClear();
  });
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
        "homeassistant/sensor/adax_room_living_room/state",
        JSON.stringify({
          value: 5.123,
          last_reset: "2024-10-03T03:00:00.000Z",
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
          state_class: "total",
          value_template: "{{ value_json.value }}",
          last_reset_value_template: "{{ value_json.last_reset }}",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        4,
        "homeassistant/sensor/adax_device_living_room/state",
        JSON.stringify({
          value: 0.007,
          last_reset: "2024-10-03T12:00:00.000Z",
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
    test("Only discovery message is published", async () => {
      server.use(
        http.get(
          "https://api-1.adax.no/client-api/rest/v1/energy_log/:id",
          () => {
            return HttpResponse.json({}, { status: 500 });
          },
        ),
      );

      await refreshEnergyData();

      expect(mockPublishAsync).toHaveBeenCalledTimes(1);
      expect(mockPublishAsync).toHaveBeenCalledWith(
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
    });
  });
});

import { describe, expect, test, vi } from "vitest";

import { refreshEnergyData } from "../";

const mockPublishAsync = vi.fn();

vi.mock("../../mqtt/client.ts", () => ({
  publishAsync: (topic: string, message: string) => {
    mockPublishAsync(topic, message);
  },
}));

describe("Given that the Adax API responds without errors", () => {
  describe("When refreshEnergyData is called", () => {
    test("It publishes expected messages to MQTT", async () => {
      await refreshEnergyData();

      expect(mockPublishAsync).toHaveBeenCalledTimes(3);
      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        1,
        "homeassistant/sensor/adax_room_living_room/config",
        JSON.stringify({
          name: "Living room Electric Consumption [kWh]",
          unique_id: "adax_room_100_electric_consumption",
          state_topic: "homeassistant/sensor/adax_room_living_room/state",
          last_reset_topic:
            "homeassistant/sensor/adax_room_living_room/last_reset",
          unit_of_measurement: "kWh",
          device_class: "energy",
          state_class: "total_increasing",
        }),
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        2,
        "homeassistant/sensor/adax_room_living_room/state",
        "5.123",
      );

      expect(mockPublishAsync).toHaveBeenNthCalledWith(
        3,
        "homeassistant/sensor/adax_room_living_room/last_reset",
        "2024-10-03T03:00:00.000Z",
      );
    });
  });
});

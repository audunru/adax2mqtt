export type Publishable = {
  topic: string;
  message: string;
};

interface DiscoveryMessage {
  name: string;
  unique_id: string;
  state_topic: string;
  unit_of_measurement: "kWh";
  device_class: "energy";
  state_class: "total" | "total_increasing";
  value_template: string;
}

export interface TotalDiscoveryMessage extends DiscoveryMessage {
  state_class: "total";
  last_reset_value_template: string;
}

export interface TotalIncreasingDiscoveryMessage extends DiscoveryMessage {
  state_class: "total_increasing";
}

export type EnergyMessage = {
  value: number;
  last_reset?: string;
};

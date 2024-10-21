import z from "zod";

import api from "./client";

const energy = z.object({
  fromTime: z.number().transform((v) => new Date(v)),
  toTime: z.number().transform((v) => new Date(v)),
  points: z.array(
    z.object({
      fromTime: z.number().transform((v) => new Date(v)),
      toTime: z.number().transform((v) => new Date(v)),
      energyWh: z.number(),
    }),
  ),
});

export type EnergyType = z.infer<typeof energy>;

export const getEnergyLog = async (roomId: number): Promise<EnergyType> => {
  const url = `/rest/v1/energy_log/${roomId}`;
  try {
    const response = await api(url);

    return energy.parse(response.data);
  } catch (e) {
    throw new Error(`Could not get data from ${url}: ` + (e as Error)?.message);
  }
};

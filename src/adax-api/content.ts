import z from "zod";

import api from "./client";

const content = z.object({
  homes: z.array(z.object({ id: z.number(), name: z.string() })),
  rooms: z.array(
    z.object({
      id: z.number(),
      homeId: z.number(),
      name: z.string(),
      heatingEnabled: z.boolean(),
      targetTemperature: z.number(),
      temperature: z.number(),
    }),
  ),
  devices: z.array(
    z.object({
      id: z.number(),
      homeId: z.number(),
      roomId: z.number(),
      name: z.string(),
      type: z.string(),
      energyTime: z.number().transform((v) => new Date(v)),
      energyWh: z.number(),
    }),
  ),
});

export type ContentType = z.infer<typeof content>;

export const getContent = async (): Promise<ContentType> => {
  const url = "/rest/v1/content?withEnergy=1";
  try {
    const response = await api.get("/rest/v1/content?withEnergy=1");

    return content.parse(response.data);
  } catch (e) {
    throw new Error(`Could not get data from ${url}: ` + (e as Error)?.message);
  }
};

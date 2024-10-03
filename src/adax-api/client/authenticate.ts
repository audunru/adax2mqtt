import axios from "axios";
import z from "zod";

import { BASE_URL } from ".";

const authentication = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
});

export type AuthenticationType = z.infer<typeof authentication>;

export const authenticate = async (): Promise<AuthenticationType> => {
  const form = new URLSearchParams();
  form.append("grant_type", "password");
  form.append("username", process.env.ADAX_USERNAME);
  form.append("password", process.env.ADAX_PASSWORD);

  try {
    const response = await axios.post(`${BASE_URL}/auth/token`, form);

    console.info("Obtained access token");

    return authentication.parse(response.data);
  } catch (e) {
    throw new Error("Could not obtain access token: " + (e as Error)?.message);
  }
};

export const refresh = async (
  refreshToken: string,
): Promise<AuthenticationType> => {
  const form = new URLSearchParams();
  form.append("grant_type", "refresh_token");
  form.append("username", process.env.ADAX_USERNAME);
  form.append("password", process.env.ADAX_PASSWORD);
  form.append("refresh_token", refreshToken);

  try {
    const response = await axios.post(`${BASE_URL}/auth/token`, form);

    console.info("Obtained refreshed token");

    return authentication.parse(response.data);
  } catch (e) {
    throw new Error(
      "Could not obtain refreshed token: " + (e as Error)?.message,
    );
  }
};

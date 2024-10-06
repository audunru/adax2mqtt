import axios from "axios";
import { createCache } from "cache-manager";
import z from "zod";

import config from "../../mqtt/config";
import { BASE_URL } from ".";

const authentication = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
});

type AuthenticationType = z.infer<typeof authentication>;

const getAccessToken = async (
  refreshToken?: string,
): Promise<AuthenticationType> => {
  const form = new URLSearchParams();
  form.append("grant_type", refreshToken ? "refresh_token" : "password");
  form.append("username", config.ADAX_USERNAME);
  form.append("password", config.ADAX_PASSWORD);

  if (refreshToken) {
    form.append("refresh_token", refreshToken);
  }

  try {
    const response = await axios.post(`${BASE_URL}/auth/token`, form);

    console.info("Obtained access token");

    return authentication.parse(response.data);
  } catch (e) {
    throw new Error("Could not obtain access token: " + (e as Error)?.message);
  }
};

const cache = createCache();

const ACCESS_TOKEN_KEY = "access-token";
const REFRESH_TOKEN_KEY = "refresh-token";

const updateCache = async (auth: AuthenticationType): Promise<void> => {
  await cache.set(
    ACCESS_TOKEN_KEY,
    auth.access_token,
    (auth.expires_in - 60) * 1000,
  );
  await cache.set(REFRESH_TOKEN_KEY, auth.refresh_token);
};

const getAccessTokenWithRefreshToken = async (): Promise<string | null> => {
  const refreshToken = await cache.get<string>(REFRESH_TOKEN_KEY);

  if (refreshToken !== null) {
    try {
      const auth = await getAccessToken(refreshToken);
      await updateCache(auth);

      return auth.access_token;
    } catch (e) {
      // Do not rethrow, if a token can not be obtained with a refresh token,
      // a new token should be retrieved instead.
      console.error((e as Error)?.message);
    }
  }

  return null;
};

export const getNewAccessToken = async (): Promise<string> => {
  const auth = await getAccessToken();
  await updateCache(auth);

  return auth.access_token;
};

export const getCachedAccessToken = async (): Promise<string> => {
  // 1. Use existing access token
  let accessToken = await cache.get<string>(ACCESS_TOKEN_KEY);
  if (accessToken !== null) {
    return accessToken;
  }

  // 2. Access token may be expired, use refresh token to get a new one
  accessToken = await getAccessTokenWithRefreshToken();
  if (accessToken !== null) {
    return accessToken;
  }

  // 3. Cache is empty, get new access token
  return getNewAccessToken();
};

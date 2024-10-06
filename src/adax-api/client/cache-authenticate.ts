import { createCache } from "cache-manager";

import {
  authenticate as baseAuthenticate,
  AuthenticationType,
  refresh,
} from "./authenticate";

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
      const auth = await refresh(refreshToken);
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
  const auth = await baseAuthenticate();
  await updateCache(auth);

  return auth.access_token;
};

export const authenticate = async (): Promise<string> => {
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

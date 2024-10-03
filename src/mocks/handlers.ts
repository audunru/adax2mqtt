import { http, HttpResponse } from "msw";

import content from "../__data__/content.json";
import energy_log from "../__data__/energy_log.json";

export const handlers = [
  http.post("https://api-1.adax.no/client-api/auth/token", () => {
    return HttpResponse.json({
      access_token: "access_token",
      token_type: "Bearer",
      expires_in: 86400,
      refresh_token: "refresh_token",
    });
  }),
  http.get("https://api-1.adax.no/client-api/rest/v1/content", () => {
    return HttpResponse.json(content);
  }),
  http.get("https://api-1.adax.no/client-api/rest/v1/energy_log/:id", () => {
    return HttpResponse.json(energy_log);
  }),
];

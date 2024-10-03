import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import content from "./src/__data__/content.json";
import energy_log from "./src/__data__/energy_log.json";

export const restHandlers = [
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

const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

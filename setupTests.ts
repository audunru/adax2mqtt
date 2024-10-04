import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "./src/mocks/server";

process.env.ADAX_USERNAME = "test_username";
process.env.ADAX_PASSWORD = "test_password";
process.env.MQTT_BROKER_URL = "mqtt://127.0.0.1:1883";

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());

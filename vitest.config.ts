import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./setupTests.ts",
    coverage: {
      exclude: ["dist", "dist-dev", "*.{js,ts,mjs}"],
    },
  },
});

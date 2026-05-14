import { defineConfig } from "tsup";

export default defineConfig([
  {
    // Vercel serverless entry — bundled into api/index.js
    // @repo/types is inlined so Vercel never needs to resolve the workspace package
    entry: { index: "src/app.ts" },
    format: ["esm"],
    outDir: "api",
    noExternal: ["@repo/types"],
    clean: false,
  },
  {
    // Traditional server entry — used by `pnpm start` on Railway / Render
    entry: { server: "src/server.ts" },
    format: ["esm"],
    outDir: "dist",
    noExternal: ["@repo/types"],
    clean: true,
  },
]);

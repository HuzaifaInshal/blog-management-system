import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/app.ts", "src/server.ts"],
  format: ["esm"],
  outDir: "dist",
  // Bundle @repo/types inline so Vercel never needs to resolve the workspace package
  noExternal: ["@repo/types"],
  clean: true,
});

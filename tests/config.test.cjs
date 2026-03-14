const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");

test("vite config keeps rollup treeshake at the correct level", () => {
  const viteConfig = fs.readFileSync(path.join(repoRoot, "vite.config.ts"), "utf8");
  assert.match(viteConfig, /rollupOptions:\s*\{[\s\S]*treeshake:\s*true/, "rollupOptions.treeshake should be set");
  assert.match(viteConfig, /output:\s*\{[\s\S]*manualChunks\(/, "manualChunks should be under rollupOptions.output");
});

test("routes helper provides fallbacks for core routes", () => {
  const routesFile = fs.readFileSync(path.join(repoRoot, "src/utils/routes.ts"), "utf8");
  assert.match(routesFile, /createRoutes\s*=\s*\(env/, "createRoutes should exist");
  assert.match(routesFile, /VITE_DASHBOARD_ROUTE/, "routes should read env values");
  assert.match(routesFile, /\"\/dashboard\"/, "routes should include fallback defaults");
});

const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/**/*.test.ts", "**/src/**/*.spec.ts"], 
  testPathIgnorePatterns: ["/node_modules/", "/tests/e2e/"], 
  // sirf .test.ts files run karenge
};
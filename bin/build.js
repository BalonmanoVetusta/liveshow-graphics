#!/usr/bin/env bun --bun
import { join, resolve } from "path";
import { nodecg } from "../package.json";
import html from "bun-plugin-html";

const srcPath = resolve(join(import.meta.dir, "..", "src"));

// Entrypoints
const dashboardsFiles = nodecg.dashboardPanels.map((panel) => join(srcPath, "dashboard", panel.file));
const graphicsFiles = nodecg.graphics.map((live) => join(srcPath, "graphics", live.file));
// const extensionFile = [join(srcPath, "extension", "index.ts")];

// Output directories
const dashboardOutput = resolve(join(import.meta.dir, "..", "dashboard"));
const graphicsOutput = resolve(join(import.meta.dir, "..", "graphics"));
// const extensionOutput = resolve(join(import.meta.dir, "..", "extension"));

console.log("Building graphics...");
await Bun.build({
  entrypoints: graphicsFiles,
  outdir: graphicsOutput,
  target: "browser",
  minify: true,
  format: "esm",
  splitting: true,
  sourcemap: "external",
  root: ".",
  loader: {
    ".woff": "dataurl",
    ".woff2": "dataurl",
  },
  plugins: [html()],
});

console.log("Building dashboards...");
await Bun.build({
  entrypoints: dashboardsFiles,
  outdir: dashboardOutput,
  target: "browser",
  minify: true,
  format: "esm",
  splitting: true,
  sourcemap: "external",
  root: ".",
  loader: {
    ".woff": "dataurl",
    ".woff2": "dataurl",
  },
  plugins: [html()],
});

// console.log("Building extension...");
// await Bun.build({
//   entrypoints: extensionFile,
//   outdir: extensionOutput,
//   target: "node",
//   minify: true,
//   format: "esm",
//   splitting: true,
//   sourcemap: "external",
//   root: "./src/extension",
// });

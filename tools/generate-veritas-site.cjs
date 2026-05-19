#!/usr/bin/env node
"use strict";

console.error([
  "generate-veritas-site.cjs is intentionally disabled.",
  "",
  "Reason: this legacy generator no longer matches the current Veritas Humanum pages and can overwrite live HTML with stale copy, missing asset paths, and public technical placeholder text.",
  "",
  "Use the committed static HTML files as the source of truth until the generator is rebuilt from the current route manifest."
].join("\n"));

process.exitCode = 1;

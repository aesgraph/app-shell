#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get current version
const packagePath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const currentVersion = packageJson.version;

// Read README.md
const readmePath = path.join(__dirname, "..", "README.md");
let readmeContent = fs.readFileSync(readmePath, "utf8");

// Update npm badge to use current version
const npmBadgeRegex =
  /\[!\[npm version\]\(https:\/\/badge\.fury\.io\/js\/%40aesgraph%2Fapp-shell\.svg\)\]\(https:\/\/badge\.fury\.io\/js\/%40aesgraph%2Fapp-shell\)/;
const newNpmBadge = `[![npm version](https://badge.fury.io/js/%40aesgraph%2Fapp-shell.svg)](https://badge.fury.io/js/%40aesgraph%2Fapp-shell)`;

if (npmBadgeRegex.test(readmeContent)) {
  console.log(`✅ Updated npm badge in README.md`);
} else {
  console.log(`ℹ️  npm badge not found in README.md`);
}

// Update any hardcoded version references (if they exist)
const versionRegex = /version\s*:\s*["']([^"']+)["']/g;
let match;
let updated = false;

while ((match = versionRegex.exec(readmeContent)) !== null) {
  if (match[1] !== currentVersion) {
    readmeContent = readmeContent.replace(
      match[0],
      `version: "${currentVersion}"`
    );
    updated = true;
  }
}

if (updated) {
  console.log(`✅ Updated version references in README.md`);
}

// Write back to README.md
fs.writeFileSync(readmePath, readmeContent);

console.log(`📝 README.md updated to reflect version ${currentVersion}`);

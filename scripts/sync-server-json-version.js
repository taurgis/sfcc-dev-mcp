#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL, URL } from 'node:url';

export function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function synchronizeServerJson(packageJson, serverJson) {
  if (!Array.isArray(serverJson.packages) || serverJson.packages.length === 0) {
    throw new Error('server.json must contain at least one package entry');
  }

  return {
    ...serverJson,
    version: packageJson.version,
    packages: serverJson.packages.map((pkg, index) => {
      if (index !== 0) {
        return pkg;
      }

      return {
        ...pkg,
        version: packageJson.version,
        identifier: packageJson.name,
      };
    }),
  };
}

export function main() {
  const packageJsonPath = new URL('../package.json', import.meta.url);
  const serverJsonPath = new URL('../server.json', import.meta.url);

  const packageJson = readJson(packageJsonPath);
  const serverJson = readJson(serverJsonPath);
  const synchronizedServerJson = synchronizeServerJson(packageJson, serverJson);

  writeJson(serverJsonPath, synchronizedServerJson);

  console.log(`Synchronized server.json to package version ${packageJson.version}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
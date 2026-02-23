#!/usr/bin/env node

import { readFileSync } from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import https from 'https';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function validateVersionParity(serverJson, packageJson) {
  const errors = [];
  const packageVersion = packageJson.version;
  const serverVersion = serverJson.version;
  const packageEntryVersion = serverJson?.packages?.[0]?.version;
  const packageEntryIdentifier = serverJson?.packages?.[0]?.identifier;

  if (typeof packageVersion !== 'string' || packageVersion.trim().length === 0) {
    errors.push('package.json version is missing or invalid');
  }

  if (typeof serverVersion !== 'string' || serverVersion.trim().length === 0) {
    errors.push('server.json version is missing or invalid');
  }

  if (typeof packageEntryVersion !== 'string' || packageEntryVersion.trim().length === 0) {
    errors.push('server.json packages[0].version is missing or invalid');
  }

  if (typeof packageEntryIdentifier !== 'string' || packageEntryIdentifier.trim().length === 0) {
    errors.push('server.json packages[0].identifier is missing or invalid');
  }

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  if (serverVersion !== packageVersion) {
    errors.push(`server.json version (${serverVersion}) does not match package.json version (${packageVersion})`);
  }

  if (packageEntryVersion !== packageVersion) {
    errors.push(`server.json packages[0].version (${packageEntryVersion}) does not match package.json version (${packageVersion})`);
  }

  if (packageEntryIdentifier !== packageJson.name) {
    errors.push(`server.json packages[0].identifier (${packageEntryIdentifier}) does not match package.json name (${packageJson.name})`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

async function validateServerJson() {
  try {
    // Read server.json
    const serverJson = readJson('./server.json');
    const packageJson = readJson('./package.json');
    console.log('✓ server.json is valid JSON');
    
    // Fetch the schema
    const schemaUrl = serverJson.$schema;
    console.log(`\nFetching schema from: ${schemaUrl}`);
    
    const schema = await new Promise((resolve, reject) => {
      https.get(schemaUrl, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
    
    console.log('✓ Schema fetched successfully');
    
    // Validate against schema
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    
    const validate = ajv.compile(schema);
    const valid = validate(serverJson);
    
    if (valid) {
      const parity = validateVersionParity(serverJson, packageJson);
      if (!parity.valid) {
        console.error('\n❌ server.json parity validation failed:');
        for (const error of parity.errors) {
          console.error(`  - ${error}`);
        }
        return false;
      }

      console.log('\n✅ server.json is valid according to the schema!');
      console.log('✅ server.json metadata is in sync with package.json');
      console.log('\nServer details:');
      console.log(`  Name: ${serverJson.name}`);
      console.log(`  Description: ${serverJson.description}`);
      console.log(`  Version: ${serverJson.version}`);
      if (serverJson.repository) {
        console.log(`  Repository: ${serverJson.repository.url}`);
      }
      console.log(`  Package identifier: ${serverJson.packages[0].identifier}`);
      console.log(`  Package version: ${serverJson.packages[0].version}`);
      console.log(`  Package registry: ${serverJson.packages[0].registryType}`);
      return true;
    } else {
      console.error('\n❌ server.json validation failed:');
      console.error(JSON.stringify(validate.errors, null, 2));
      return false;
    }
  } catch (error) {
    console.error('\n❌ Error during validation:');
    console.error(error instanceof Error ? error.message : String(error));
    return false;
  }
}

validateServerJson().then(valid => {
  process.exit(valid ? 0 : 1);
});

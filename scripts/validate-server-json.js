#!/usr/bin/env node

import { readFileSync } from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import https from 'https';

async function validateServerJson() {
  try {
    // Read server.json
    const serverJson = JSON.parse(readFileSync('./server.json', 'utf8'));
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
      console.log('\n✅ server.json is valid according to the schema!');
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
    console.error(error.message);
    return false;
  }
}

validateServerJson().then(valid => {
  process.exit(valid ? 0 : 1);
});

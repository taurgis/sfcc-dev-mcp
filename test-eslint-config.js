#!/usr/bin/env node

/**
 * Test script to verify the updated ESLint configuration
 */

import { CartridgeGenerationClient } from './dist/clients/cartridge-generation-client.js';
import * as fs from 'fs/promises';
import * as path from 'path';

async function testEslintConfig() {
  const testDir = path.join(process.cwd(), 'test-eslint-config');
  
  try {
    // Clean up any existing test directory
    await fs.rm(testDir, { recursive: true }).catch(() => {
      // Ignore errors if directory doesn't exist
    });
    
    console.log('Testing ESLint configuration generation...');
    
    const client = new CartridgeGenerationClient(true);
    
    // Generate cartridge with full project setup
    const result = await client.generateCartridgeStructure({
      cartridgeName: 'test_eslint',
      targetPath: testDir,
      fullProjectSetup: true,
    });
    
    if (result.success) {
      // Read the generated .eslintrc.json file
      const eslintrcPath = path.join(testDir, '.eslintrc.json');
      const eslintrcContent = await fs.readFile(eslintrcPath, 'utf8');
      const eslintConfig = JSON.parse(eslintrcContent);
      
      console.log('\n✅ Generated .eslintrc.json:');
      console.log(JSON.stringify(eslintConfig, null, 2));
      
      // Verify that our custom rules are present
      const hasCustomRules = eslintConfig.rules && 
        eslintConfig.rules['import/no-unresolved'] === 'off' &&
        eslintConfig.rules['require-jsdoc'] === 'error' &&
        eslintConfig.rules['func-names'] === 'off';
      
      if (hasCustomRules) {
        console.log('\n✅ SUCCESS: Custom ESLint rules are correctly included!');
      } else {
        console.log('\n❌ FAILURE: Custom ESLint rules are missing!');
      }
    } else {
      console.log('❌ Failed to generate cartridge:', result.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Clean up test directory
    await fs.rm(testDir, { recursive: true }).catch(() => {
      // Ignore errors if directory doesn't exist
    });
    console.log('\nTest cleanup completed.');
  }
}

testEslintConfig();

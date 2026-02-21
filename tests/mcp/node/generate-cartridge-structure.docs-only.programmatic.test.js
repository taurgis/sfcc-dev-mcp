/**
 * Programmatic tests for generate_cartridge_structure tool
 * 
 * These tests provide comprehensive verification of cartridge generation functionality,
 * including directory structure validation, file content verification, cleanup operations,
 * and edge case handling. All tests use system temp directory for safe isolation.
 * 
 * Response format discovered via aegis query:
 * - Success: { content: [{ type: "text", text: "{\"success\": true, \"message\": \"...\", \"createdFiles\": [...], \"createdDirectories\": [...], \"skippedFiles\": []}" }] }
 * - Error: { content: [{ type: "text", text: "Error: ..." }], isError: true }
 */

import { test, describe, before, after, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';
import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomBytes } from 'node:crypto';

describe('generate_cartridge_structure Programmatic Tests', () => {
  let client;
  let testDirectories = []; // Track directories for cleanup

  before(async () => {
    client = await connect('./aegis.config.docs-only.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent test interference
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  afterEach(async () => {
    // Clean up all test directories
    for (const dir of testDirectories) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
      } catch (error) {
        // Ignore cleanup errors - directory might not exist
        console.warn(`Cleanup warning for ${dir}:`, error.message);
      }
    }
    testDirectories = [];
  });

  /**
   * Create a unique temporary directory for testing
   * @returns {string} Absolute path to temporary directory
   */
  function createTempTestDir() {
    const uniqueId = randomBytes(8).toString('hex');
    const testDir = join(tmpdir(), `mcp-cartridge-test-${uniqueId}`);
    testDirectories.push(testDir);
    return testDir;
  }

  /**
   * Check if a file exists and is readable
   * @param {string} filePath - Path to check
   * @returns {Promise<boolean>} True if file exists and is readable
   */
  async function fileExists(filePath) {
    try {
      await fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if a directory exists and is readable
   * @param {string} dirPath - Path to check
   * @returns {Promise<boolean>} True if directory exists and is readable
   */
  async function directoryExists(dirPath) {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Read and parse JSON response from tool execution
   * @param {object} result - MCP tool result
   * @returns {object} Parsed response object
   */
  function parseToolResponse(result) {
    assert.equal(result.isError, false, 'Tool should execute successfully');
    assert.ok(result.content, 'Result should have content');
    assert.equal(result.content.length, 1, 'Should have exactly one content item');
    assert.equal(result.content[0].type, 'text', 'Content should be text type');
    
    const responseText = result.content[0].text;
    return JSON.parse(responseText);
  }

  describe('Protocol Compliance', () => {
    test('should be properly connected to MCP server', async () => {
      assert.ok(client.connected, 'Client should be connected');
    });

    test('should have generate_cartridge_structure tool available', async () => {
      const tools = await client.listTools();
      const cartridgeTool = tools.find(tool => tool.name === 'generate_cartridge_structure');
      
      assert.ok(cartridgeTool, 'generate_cartridge_structure tool should be available');
      assert.equal(cartridgeTool.name, 'generate_cartridge_structure');
      assert.ok(cartridgeTool.description, 'Tool should have description');
      assert.ok(cartridgeTool.inputSchema, 'Tool should have input schema');
      assert.equal(cartridgeTool.inputSchema.type, 'object');
      assert.ok(cartridgeTool.inputSchema.properties.cartridgeName, 'Tool should have cartridgeName parameter');
      assert.ok(cartridgeTool.inputSchema.required.includes('cartridgeName'), 'cartridgeName should be required');
    });
  });

  describe('Full Project Setup Generation', () => {
    test('should create complete project structure with all required files', async () => {
      const testDir = createTempTestDir();
      const cartridgeName = 'test_full_project';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName,
        targetPath: testDir,
        fullProjectSetup: true
      });

      const response = parseToolResponse(result);
      
      // Verify response structure
      assert.equal(response.success, true, 'Operation should be successful');
      assert.ok(response.message.includes('Successfully created full project setup'), 'Message should indicate full project setup');
      assert.ok(response.message.includes(cartridgeName), 'Message should include cartridge name');
      assert.ok(response.message.includes(testDir), 'Message should include target path');
      assert.ok(Array.isArray(response.createdFiles), 'Should have createdFiles array');
      assert.ok(Array.isArray(response.createdDirectories), 'Should have createdDirectories array');
      assert.ok(Array.isArray(response.skippedFiles), 'Should have skippedFiles array');

      // Verify essential project files were created
      const expectedProjectFiles = [
        'package.json',
        'dw.json',
        'webpack.config.js',
        '.eslintrc.json',
        '.stylelintrc.json',
        '.eslintignore',
        '.gitignore'
      ];

      for (const file of expectedProjectFiles) {
        const filePath = join(testDir, file);
        assert.ok(await fileExists(filePath), `Project file ${file} should exist`);
        assert.ok(response.createdFiles.some(f => f.endsWith(file)), `${file} should be in createdFiles list`);
      }

      // Verify cartridge-specific files
      const cartridgeDir = join(testDir, 'cartridges', cartridgeName);
      const expectedCartridgeFiles = [
        '.project',
        join('cartridge', `${cartridgeName}.properties`)
      ];

      for (const file of expectedCartridgeFiles) {
        const filePath = join(cartridgeDir, file);
        assert.ok(await fileExists(filePath), `Cartridge file ${file} should exist`);
      }

      // Verify directory structure
      const expectedDirectories = [
        testDir,
        join(testDir, 'cartridges'),
        cartridgeDir,
        join(cartridgeDir, 'cartridge'),
        join(cartridgeDir, 'cartridge', 'controllers'),
        join(cartridgeDir, 'cartridge', 'models'),
        join(cartridgeDir, 'cartridge', 'templates'),
        join(cartridgeDir, 'cartridge', 'templates', 'default'),
        join(cartridgeDir, 'cartridge', 'templates', 'resources'),
        join(cartridgeDir, 'cartridge', 'client'),
        join(cartridgeDir, 'cartridge', 'client', 'default'),
        join(cartridgeDir, 'cartridge', 'client', 'default', 'js'),
        join(cartridgeDir, 'cartridge', 'client', 'default', 'scss')
      ];

      for (const dir of expectedDirectories) {
        assert.ok(await directoryExists(dir), `Directory ${dir} should exist`);
      }

      // Verify file contents - check package.json contains cartridge name
      const packageJsonPath = join(testDir, 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      assert.ok(packageJson.name.includes(cartridgeName), 'package.json should reference cartridge name');
    });

    test('should create cartridge with default fullProjectSetup when not specified', async () => {
      const testDir = createTempTestDir();
      const cartridgeName = 'test_default_full';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName,
        targetPath: testDir
        // fullProjectSetup not specified - should default to true
      });

      const response = parseToolResponse(result);
      
      assert.equal(response.success, true, 'Operation should be successful');
      assert.ok(response.message.includes('full project setup'), 'Should create full project setup by default');

      // Verify project files were created (indicates full project setup)
      const packageJsonPath = join(testDir, 'package.json');
      assert.ok(await fileExists(packageJsonPath), 'package.json should exist with default full project setup');
    });
  });

  describe('Cartridge-Only Generation', () => {
    test('should create cartridge structure without project files when fullProjectSetup is false', async () => {
      const testDir = createTempTestDir();
      const cartridgeName = 'test_cartridge_only';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName,
        targetPath: testDir,
        fullProjectSetup: false
      });

      const response = parseToolResponse(result);
      
      // Verify response structure
      assert.equal(response.success, true, 'Operation should be successful');
      assert.ok(response.message.includes('Successfully created cartridge'), 'Message should indicate cartridge creation');
      assert.ok(response.message.includes('existing project'), 'Message should indicate existing project context');
      assert.ok(response.message.includes(cartridgeName), 'Message should include cartridge name');

      // Verify cartridge files were created
      const cartridgeDir = join(testDir, 'cartridges', cartridgeName);
      const expectedCartridgeFiles = [
        join(cartridgeDir, '.project'),
        join(cartridgeDir, 'cartridge', `${cartridgeName}.properties`)
      ];

      for (const filePath of expectedCartridgeFiles) {
        assert.ok(await fileExists(filePath), `Cartridge file ${filePath} should exist`);
      }

      // Verify project files were NOT created
      const projectFiles = ['package.json', 'dw.json', 'webpack.config.js'];
      for (const file of projectFiles) {
        const filePath = join(testDir, file);
        assert.ok(!(await fileExists(filePath)), `Project file ${file} should NOT exist in cartridge-only mode`);
      }

      // Verify cartridge directory structure exists
      const expectedDirs = [
        join(testDir, 'cartridges'),
        cartridgeDir,
        join(cartridgeDir, 'cartridge'),
        join(cartridgeDir, 'cartridge', 'controllers'),
        join(cartridgeDir, 'cartridge', 'models'),
        join(cartridgeDir, 'cartridge', 'templates')
      ];

      for (const dir of expectedDirs) {
        assert.ok(await directoryExists(dir), `Cartridge directory ${dir} should exist`);
      }
    });
  });

  describe('Target Path Handling', () => {
    test('should create cartridge in current working directory when targetPath not specified', async () => {
      const cartridgeName = 'test_cwd_cartridge';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName
        // targetPath not specified - should use current working directory
      });

      const response = parseToolResponse(result);
      
      assert.equal(response.success, true, 'Operation should be successful');
      assert.ok(Array.isArray(response.createdFiles), 'Should have createdFiles array');
      assert.ok(response.createdFiles.length > 0, 'Should have created files');

      // Clean up files created in current directory
      const cwd = process.cwd();
      const createdPaths = [...response.createdFiles, ...response.createdDirectories];
      
      for (const path of createdPaths) {
        try {
          if (path.startsWith(cwd)) {
            const relativePath = path.substring(cwd.length + 1);
            if (relativePath.startsWith('cartridges/') || ['package.json', 'dw.json', 'webpack.config.js', '.eslintrc.json', '.stylelintrc.json', '.eslintignore', '.gitignore'].includes(relativePath)) {
              await fs.rm(path, { recursive: true, force: true });
            }
          }
        } catch {
          // Ignore cleanup errors
        }
      }
    });

    test('should handle absolute target paths correctly', async () => {
      const testDir = createTempTestDir();
      const cartridgeName = 'test_absolute_path';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName,
        targetPath: testDir,
        fullProjectSetup: false
      });

      const response = parseToolResponse(result);
      
      assert.equal(response.success, true, 'Operation should be successful');
      
      // Verify files were created in specified absolute path
      const cartridgeDir = join(testDir, 'cartridges', cartridgeName);
      assert.ok(await directoryExists(cartridgeDir), 'Cartridge should be created in specified absolute path');
      
      // Verify all created paths are under the specified target directory
      for (const createdPath of response.createdFiles) {
        assert.ok(createdPath.startsWith(testDir), `Created file ${createdPath} should be under target directory ${testDir}`);
      }
      
      for (const createdDir of response.createdDirectories) {
        assert.ok(createdDir.startsWith(testDir) || createdDir === testDir, `Created directory ${createdDir} should be under target directory ${testDir}`);
      }
    });
  });

  describe('Cartridge Name Validation', () => {
    test('should reject empty cartridge name', async () => {
      const testDir = createTempTestDir();

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName: '',
        targetPath: testDir
      });

      assert.equal(result.isError, true, 'Should return error for empty cartridge name');
      assert.ok(result.content[0].text.includes('Error'), 'Error message should be present');
      assert.ok(
        result.content[0].text.includes('cartridgeName must be a non-empty string') ||
        result.content[0].text.includes('valid identifier'),
        'Should mention non-empty or identifier requirement',
      );
    });

    test('should reject missing cartridge name', async () => {
      const testDir = createTempTestDir();

      const result = await client.callTool('generate_cartridge_structure', {
        targetPath: testDir
        // cartridgeName missing
      });

      assert.equal(result.isError, true, 'Should return error for missing cartridge name');
      assert.ok(result.content[0].text.includes('Error'), 'Error message should be present');
    });

    test('should accept valid cartridge names with different formats', async () => {
      const testDir = createTempTestDir();
      const validNames = [
        'simple_cartridge',
        'plugin-example',
        'my_plugin_123',
        'cart123',
        'a_b_c'
      ];

      for (const cartridgeName of validNames) {
        const subTestDir = join(testDir, cartridgeName + '_test');
        testDirectories.push(subTestDir);

        const result = await client.callTool('generate_cartridge_structure', {
          cartridgeName,
          targetPath: subTestDir,
          fullProjectSetup: false
        });

        const response = parseToolResponse(result);
        assert.equal(response.success, true, `Cartridge name "${cartridgeName}" should be valid`);
        assert.ok(response.message.includes(cartridgeName), `Message should include cartridge name "${cartridgeName}"`);
      }
    });
  });

  describe('File System Integration', () => {
    test('should handle directory creation permissions correctly', async () => {
      const testDir = createTempTestDir();
      const cartridgeName = 'test_permissions';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName,
        targetPath: testDir,
        fullProjectSetup: false
      });

      const response = parseToolResponse(result);
      assert.equal(response.success, true, 'Should handle directory creation successfully');

      // Verify created directories have appropriate permissions (readable and writable)
      const cartridgeDir = join(testDir, 'cartridges', cartridgeName);
      const stat = await fs.stat(cartridgeDir);
      
      // Check that directory is readable and writable by owner
      const mode = stat.mode;
      const ownerRead = (mode & 0o400) !== 0;
      const ownerWrite = (mode & 0o200) !== 0;
      const ownerExecute = (mode & 0o100) !== 0;
      
      assert.ok(ownerRead, 'Directory should be readable by owner');
      assert.ok(ownerWrite, 'Directory should be writable by owner');
      assert.ok(ownerExecute, 'Directory should be executable by owner');
    });

    test('should create files with correct content structure', async () => {
      const testDir = createTempTestDir();
      const cartridgeName = 'test_file_content';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName,
        targetPath: testDir,
        fullProjectSetup: true
      });

      const response = parseToolResponse(result);
      assert.equal(response.success, true, 'Should create files successfully');

      // Check package.json structure
      const packageJsonPath = join(testDir, 'package.json');
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      assert.ok(packageJson.name, 'package.json should have name field');
      assert.ok(packageJson.version, 'package.json should have version field');
      assert.ok(packageJson.scripts, 'package.json should have scripts');
      assert.ok(packageJson.devDependencies, 'package.json should have devDependencies');

      // Check cartridge properties file
      const propertiesPath = join(testDir, 'cartridges', cartridgeName, 'cartridge', `${cartridgeName}.properties`);
      const propertiesContent = await fs.readFile(propertiesPath, 'utf-8');
      
      assert.ok(propertiesContent.includes('demandware.cartridges'), 'Properties file should contain demandware.cartridges');
      assert.ok(propertiesContent.includes(cartridgeName), 'Properties file should reference cartridge name');

      // Check .project file (Eclipse project file)
      const projectPath = join(testDir, 'cartridges', cartridgeName, '.project');
      const projectContent = await fs.readFile(projectPath, 'utf-8');
      
      assert.ok(projectContent.includes('<name>'), '.project file should contain project name tag');
      assert.ok(projectContent.includes(cartridgeName), '.project file should reference cartridge name');
    });

    test('should handle nested directory creation correctly', async () => {
      const testDir = createTempTestDir();
      const cartridgeName = 'test_nested_dirs';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName,
        targetPath: testDir,
        fullProjectSetup: false
      });

      const response = parseToolResponse(result);
      assert.equal(response.success, true, 'Should create nested directories successfully');

      // Verify deeply nested directories were created
      const deepPath = join(testDir, 'cartridges', cartridgeName, 'cartridge', 'client', 'default', 'scss');
      assert.ok(await directoryExists(deepPath), 'Deep nested directory structure should be created');

      // Verify specific key directories in the structure exist
      const keyDirectories = [
        join(testDir, 'cartridges', cartridgeName),
        join(testDir, 'cartridges', cartridgeName, 'cartridge'),
        join(testDir, 'cartridges', cartridgeName, 'cartridge', 'client'),
        join(testDir, 'cartridges', cartridgeName, 'cartridge', 'client', 'default'),
        join(testDir, 'cartridges', cartridgeName, 'cartridge', 'client', 'default', 'scss')
      ];
      
      for (const dir of keyDirectories) {
        assert.ok(await directoryExists(dir), `Key directory ${dir} should exist`);
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle special characters in target path', async () => {
      const specialDir = join(tmpdir(), 'mcp-test-special chars & symbols');
      testDirectories.push(specialDir);
      const cartridgeName = 'test_special_path';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName,
        targetPath: specialDir,
        fullProjectSetup: false
      });

      const response = parseToolResponse(result);
      assert.equal(response.success, true, 'Should handle special characters in path');
      
      const cartridgeDir = join(specialDir, 'cartridges', cartridgeName);
      assert.ok(await directoryExists(cartridgeDir), 'Should create cartridge in path with special characters');
    });

    test('should report created files and directories accurately', async () => {
      const testDir = createTempTestDir();
      const cartridgeName = 'test_file_reporting';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName,
        targetPath: testDir,
        fullProjectSetup: true
      });

      const response = parseToolResponse(result);
      assert.equal(response.success, true, 'Operation should be successful');

      // Verify all reported files actually exist
      for (const filePath of response.createdFiles) {
        assert.ok(await fileExists(filePath), `Reported file ${filePath} should actually exist`);
      }

      // Verify all reported directories actually exist
      for (const dirPath of response.createdDirectories) {
        assert.ok(await directoryExists(dirPath), `Reported directory ${dirPath} should actually exist`);
      }

      // Verify files list is comprehensive - check for essential files
      const essentialFiles = ['package.json', 'dw.json', '.gitignore'];
      for (const file of essentialFiles) {
        assert.ok(response.createdFiles.some(f => f.endsWith(file)), `Essential file ${file} should be in createdFiles list`);
      }

      // Verify no duplicate entries in created files/directories
      const uniqueFiles = new Set(response.createdFiles);
      const uniqueDirs = new Set(response.createdDirectories);
      
      assert.equal(response.createdFiles.length, uniqueFiles.size, 'createdFiles should not contain duplicates');
      assert.equal(response.createdDirectories.length, uniqueDirs.size, 'createdDirectories should not contain duplicates');
    });

    test('should handle very long cartridge names appropriately', async () => {
      const testDir = createTempTestDir();
      const longCartridgeName = 'very_long_cartridge_name_that_exceeds_normal_limits_but_should_still_work_properly_for_testing_purposes';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName: longCartridgeName,
        targetPath: testDir,
        fullProjectSetup: false
      });

      // The tool should return a response with success: false for names exceeding 64 characters
      const response = parseToolResponse(result);
      
      if (response.success) {
        // If somehow accepted, verify structure was created
        const cartridgeDir = join(testDir, 'cartridges', longCartridgeName);
        assert.ok(await directoryExists(cartridgeDir), 'Should create directory with long name if accepted');
      } else {
        // Should provide clear error message about name constraints
        assert.ok(
          response.message.includes('too long') || 
          response.message.includes('64 characters') ||
          response.message.includes('valid identifier'),
          `Should provide clear error for long names, got: ${response.message}`
        );
      }
    });
  });

  describe('Response Format Consistency', () => {
    test('should always return consistent JSON response structure', async () => {
      const testDir = createTempTestDir();
      const cartridgeName = 'test_response_format';

      const result = await client.callTool('generate_cartridge_structure', {
        cartridgeName,
        targetPath: testDir,
        fullProjectSetup: false
      });

      const response = parseToolResponse(result);
      
      // Verify required response fields
      assert.ok(typeof response.success === 'boolean', 'Response should have boolean success field');
      assert.ok(typeof response.message === 'string', 'Response should have string message field');
      assert.ok(Array.isArray(response.createdFiles), 'Response should have createdFiles array');
      assert.ok(Array.isArray(response.createdDirectories), 'Response should have createdDirectories array');
      assert.ok(Array.isArray(response.skippedFiles), 'Response should have skippedFiles array');

      // Verify field content types
      for (const file of response.createdFiles) {
        assert.ok(typeof file === 'string', 'All createdFiles entries should be strings');
        assert.ok(file.length > 0, 'All createdFiles entries should be non-empty');
      }

      for (const dir of response.createdDirectories) {
        assert.ok(typeof dir === 'string', 'All createdDirectories entries should be strings');
        assert.ok(dir.length > 0, 'All createdDirectories entries should be non-empty');
      }

      for (const skipped of response.skippedFiles) {
        assert.ok(typeof skipped === 'string', 'All skippedFiles entries should be strings');
      }
    });

    test('should provide meaningful success messages', async () => {
      const testDir = createTempTestDir();
      const cartridgeName = 'test_success_message';

      // Test full project setup message
      const fullResult = await client.callTool('generate_cartridge_structure', {
        cartridgeName: cartridgeName + '_full',
        targetPath: testDir + '_full',
        fullProjectSetup: true
      });

      const fullResponse = parseToolResponse(fullResult);
      assert.ok(fullResponse.message.includes('full project setup'), 'Full project message should mention full project setup');
      assert.ok(fullResponse.message.includes(cartridgeName + '_full'), 'Message should include cartridge name');

      // Test cartridge-only message
      const cartridgeResult = await client.callTool('generate_cartridge_structure', {
        cartridgeName: cartridgeName + '_only',
        targetPath: testDir + '_only',
        fullProjectSetup: false
      });

      const cartridgeResponse = parseToolResponse(cartridgeResult);
      assert.ok(cartridgeResponse.message.includes('existing project'), 'Cartridge-only message should mention existing project');
      assert.ok(cartridgeResponse.message.includes(cartridgeName + '_only'), 'Message should include cartridge name');

      // Add these additional test directories to cleanup list
      testDirectories.push(testDir + '_full', testDir + '_only');
    });
  });
});

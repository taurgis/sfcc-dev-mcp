import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('summarize_logs - Full Mode Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent leaking into next tests
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  // Helper function to get current date in YYYYMMDD format
  function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // Comprehensive helper functions for complex validation
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  }

  function assertSuccessResponse(result) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an error response');
    assert.equal(result.content[0].type, 'text');
  }

  function validateCompleteLogSummary(result, expectedDate = null) {
    assertSuccessResponse(result);
    const text = result.content[0].text;
    
    // Validate header format
    if (expectedDate) {
      assert.ok(text.includes(`Log Summary for ${expectedDate}`),
        `Should contain "Log Summary for ${expectedDate}"`);
    } else {
      assert.ok(/Log Summary for \d{8}/.test(text),
        'Should contain "Log Summary for YYYYMMDD" pattern');
    }
    
    // Validate all required sections with complex logic
    const requiredSections = ['📊 Counts:', '📁 Log Files', '🔥 Key Issues:'];
    const missingSections = requiredSections.filter(section => !text.includes(section));
    assert.equal(missingSections.length, 0, 
      `Missing required sections: ${missingSections.join(', ')}`);
    
    // Validate numeric count patterns with regex precision
    const countPatterns = [
      { pattern: /- Errors: \d+/, name: 'Errors' },
      { pattern: /- Warnings: \d+/, name: 'Warnings' },
      { pattern: /- Info: \d+/, name: 'Info' },
      { pattern: /- Debug: \d+/, name: 'Debug' }
    ];
    
    const failedCounts = countPatterns.filter(({ pattern, name }) => {
      const matches = pattern.test(text);
      if (!matches) {
        console.log(`Failed count validation for ${name}: pattern ${pattern} not found in text`);
      }
      return !matches;
    });
    
    assert.equal(failedCounts.length, 0,
      `Failed count validations: ${failedCounts.map(f => f.name).join(', ')}`);
    
    return { text, sections: requiredSections };
  }

  function validateLogFileSection(text) {
    // Complex validation for log file section format
    const logFileMatch = text.match(/📁 Log Files \((\d+)\):/);
    if (logFileMatch) {
      const fileCount = parseInt(logFileMatch[1], 10);
      
      // Count actual log file entries
      const logFilePatterns = [
        /error-blade-\d{8}-\d{6}\.log/g,
        /warn-blade-\d{8}-\d{6}\.log/g,
        /info-blade-\d{8}-\d{6}\.log/g,
        /debug-blade-\d{8}-\d{6}\.log/g
      ];
      
      let actualFileCount = 0;
      logFilePatterns.forEach(pattern => {
        const matches = text.match(pattern) || [];
        actualFileCount += matches.length;
      });
      
      return { declaredCount: fileCount, actualCount: actualFileCount };
    }
    return null;
  }

  function validateKeyIssuesSection(text) {
    // Extract and validate key issues content
    const keyIssuesSplit = text.split('🔥 Key Issues:');
    if (keyIssuesSplit.length > 1) {
      const keyIssuesContent = keyIssuesSplit[1].trim();
      
      // Should not be empty
      assert.ok(keyIssuesContent.length > 0, 'Key issues section should not be empty');
      
      // Should contain meaningful assessment patterns
      const assessmentPatterns = [
        /No major issues detected/i,
        /Key issues identified/i,
        /Critical errors found/i,
        /\d+ error/i,
        /\d+ warning/i,
        /detected/i,
        /found/i
      ];
      
      const hasValidAssessment = assessmentPatterns.some(pattern => pattern.test(keyIssuesContent));
      assert.ok(hasValidAssessment, 
        `Key issues should contain meaningful assessment. Content: "${keyIssuesContent}"`);
      
      return keyIssuesContent;
    }
    return null;
  }

  // Core functionality - comprehensive validation
  describe('Comprehensive Functionality Validation', () => {
    test('should provide complete log summary with all sections and cross-validation', async () => {
      const result = await client.callTool('summarize_logs', {});
      const validation = validateCompleteLogSummary(result);
      
      // Advanced cross-section validation
      const fileValidation = validateLogFileSection(validation.text);
      if (fileValidation) {
        // Log file count should be reasonable (not negative, not excessively high)
        assert.ok(fileValidation.declaredCount >= 0, 'File count should not be negative');
        assert.ok(fileValidation.declaredCount <= 100, 'File count should be reasonable (<=100)');
        
        // If we have specific file entries, count should match or be reasonable
        if (fileValidation.actualCount > 0) {
          assert.ok(fileValidation.declaredCount >= fileValidation.actualCount,
            `Declared count (${fileValidation.declaredCount}) should be >= actual entries (${fileValidation.actualCount})`);
        }
      }
      
      // Validate key issues assessment quality
      const keyIssuesContent = validateKeyIssuesSection(validation.text);
      assert.ok(keyIssuesContent, 'Should have key issues section');
    });

    test('should handle both log scenarios with appropriate responses', async () => {
      const result = await client.callTool('summarize_logs', {});
      assertValidMCPResponse(result);
      
      const text = result.content[0].text;
      const hasLogSummary = text.includes('📊 Counts:');
      const noLogsFound = text.includes('No log files found');
      
      assert.ok(hasLogSummary || noLogsFound, 
        'Should either show log summary or no logs message');
      
      if (hasLogSummary) {
        // Comprehensive validation for log summary scenario
        validateCompleteLogSummary(result);
      } else {
        // Validation for no logs scenario
        assert.ok(/No log files found for date \d{8}/.test(text),
          'No logs message should include specific date in YYYYMMDD format');
      }
    });
  });

  // Dynamic date validation with cross-scenario consistency
  describe('Dynamic Date Validation and Consistency', () => {
    test('should maintain consistent response format across multiple date scenarios', async () => {
      const testScenarios = [
          { date: getCurrentDateString(), description: 'current date', expectError: false },
          { date: '20220101', description: 'old date', expectError: false },
          { date: '20301231', description: 'future date', expectError: false },
          { date: 'invalid-format', description: 'invalid format', expectError: true },
          { date: '2024-01-01', description: 'wrong format', expectError: true },
          { date: '', description: 'empty string', expectError: true }
      ];
      
      const results = [];
      
      // Sequential execution to avoid buffer conflicts
      for (const scenario of testScenarios) {
        const result = await client.callTool('summarize_logs', { date: scenario.date });
        assertValidMCPResponse(result);
        
        results.push({
          ...scenario,
          result,
          text: result.content[0].text,
          isError: result.isError,
          hasLogSummary: result.content[0].text.includes('📊 Counts:'),
          isNoLogsMessage: result.content[0].text.includes('No log files found')
        });
      }
      
      // Cross-scenario validation
        results.forEach(({ date, description, result, text, isError, hasLogSummary, isNoLogsMessage, expectError }) => {
        // All should follow same response structure
        assert.equal(result.content.length, 1, 
          `${description} should have exactly one content element`);
        assert.equal(result.content[0].type, 'text',
          `${description} content type should be text`);

          if (expectError) {
            assert.equal(isError, true, `${description} should be marked as error`);
            assert.ok(
              text.includes('date must match pattern') || text.includes('date must be a non-empty string'),
              `${description} should include validation error text`,
            );
            return;
          }

          assert.equal(isError, false,
            `${description} should not be marked as error`);
        
        // Should either have log summary or no logs message
        assert.ok(hasLogSummary || isNoLogsMessage,
          `${description} should either show summary or no logs message`);
        
        // Date format validation in response
        if (hasLogSummary) {
            assert.ok(/Log Summary for \d{8}/.test(text),
              `${description} summary should include YYYYMMDD date`);
        } else if (isNoLogsMessage) {
          assert.ok(text.includes(`No log files found for date ${date}`),
            `${description} should include the exact date parameter in no-logs message`);
        }
      });
      
        // Validate consistent behavior for invalid dates
        const invalidDateResults = results.filter(r =>
          ['invalid format', 'wrong format', 'empty string'].includes(r.description));
      
        invalidDateResults.forEach(({ description, isError }) => {
          assert.equal(isError, true,
            `${description} should result in validation error`);
      });
    });

    test('should handle parameter variations and edge cases dynamically', async () => {
      const parameterVariations = [
          { args: {}, description: 'empty object', expectError: false },
          { args: undefined, description: 'undefined args', expectError: false },
          { args: { date: null }, description: 'null date', expectError: true },
          { args: { date: getCurrentDateString(), extra: 'ignored' }, description: 'extra parameters', expectError: true }
      ];
      
        for (const { args, description, expectError } of parameterVariations) {
        const result = await client.callTool('summarize_logs', args);
        assertValidMCPResponse(result);

          if (expectError) {
            assert.equal(result.isError, true,
              `${description} should cause validation error response`);
            continue;
          }

          assert.equal(result.isError, false,
            `${description} should not cause error response`);
        
        const text = result.content[0].text;
        const hasValidResponse = text.includes('📊 Counts:') || 
                               text.includes('No log files found');
        
        assert.ok(hasValidResponse, 
          `${description} should produce valid response format`);
      }
    });
  });

  // Advanced content analysis and business logic validation
  describe('Advanced Content Analysis', () => {
    test('should validate log count arithmetic and consistency', async () => {
      const result = await client.callTool('summarize_logs', {});
      assertSuccessResponse(result);
      
      const text = result.content[0].text;
      
      if (text.includes('📊 Counts:')) {
        // Extract all numeric counts
        const countMatches = {
          errors: text.match(/- Errors: (\d+)/),
          warnings: text.match(/- Warnings: (\d+)/),
          info: text.match(/- Info: (\d+)/),
          debug: text.match(/- Debug: (\d+)/)
        };
        
        // Validate all counts were found
        Object.entries(countMatches).forEach(([level, match]) => {
          assert.ok(match, `Should find ${level} count in response`);
          
          const count = parseInt(match[1], 10);
          assert.ok(count >= 0, `${level} count should not be negative`);
          assert.ok(count < 1000000, `${level} count should be reasonable (<1M)`);
        });
        
        // Advanced business logic: total log entries should be reasonable
        const totalEntries = Object.values(countMatches)
          .map(match => parseInt(match[1], 10))
          .reduce((sum, count) => sum + count, 0);
        
        assert.ok(totalEntries >= 0, 'Total log entries should not be negative');
        
        // If we have log entries, we should have log files
        if (totalEntries > 0) {
          assert.ok(text.includes('📁 Log Files'), 
            'Should have log files section when log entries exist');
        }
      }
    });

    test('should validate emoji consistency and section ordering', async () => {
      const result = await client.callTool('summarize_logs', {});
      assertSuccessResponse(result);
      
      const text = result.content[0].text;
      
      if (text.includes('📊 Counts:')) {
        // Validate section ordering by finding their positions
        const sectionPositions = {
          counts: text.indexOf('📊 Counts:'),
          files: text.indexOf('📁 Log Files'),
          issues: text.indexOf('🔥 Key Issues:')
        };
        
        // All sections should be found
        Object.entries(sectionPositions).forEach(([section, position]) => {
          assert.ok(position >= 0, `Should find ${section} section`);
        });
        
        // Validate logical ordering: counts -> files -> issues
        assert.ok(sectionPositions.counts < sectionPositions.files,
          'Counts section should come before files section');
        assert.ok(sectionPositions.files < sectionPositions.issues,
          'Files section should come before issues section');
        
        // Validate consistent emoji usage
        const expectedEmojis = ['📊', '📁', '🔥'];
        expectedEmojis.forEach(emoji => {
          assert.ok(text.includes(emoji), 
            `Should use ${emoji} emoji consistently`);
        });
      }
    });
  });
});

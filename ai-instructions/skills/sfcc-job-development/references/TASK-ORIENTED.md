# Task-Oriented Job Steps Reference

Complete reference for task-oriented (script-module-step) job development in SFCC.

## When to Use Task-Oriented Jobs

Choose task-oriented jobs for:
- Single configuration file downloads
- Single API calls to external services
- Quick, targeted database updates
- Tasks where calculating progress is impractical

## Script Structure

```javascript
'use strict';

var Status = require('dw/system/Status');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');

/**
 * Main function for task-oriented job step
 * @param {Object} parameters - Parameters from Business Manager
 * @param {dw.job.JobStepExecution} stepExecution - Job context and logging
 * @returns {dw.system.Status} - Exit status
 */
exports.execute = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'TaskOrientedJob');
    
    try {
        logger.info('Starting job with parameters: {0}', JSON.stringify(parameters));
        
        var result = performBusinessLogic(parameters, logger);
        
        if (result.success) {
            logger.info('Job completed successfully');
            return new Status(Status.OK);
        } else {
            logger.warn('Job completed with warnings: {0}', result.message);
            return new Status(Status.OK, 'OK', result.message);
        }
        
    } catch (e) {
        logger.error('Job failed with error: {0}', e.message);
        return new Status(Status.ERROR, 'ERROR', e.message);
    }
};

function performBusinessLogic(parameters, logger) {
    // Implementation here
    return { success: true, message: 'Operation completed' };
}
```

## Status Control for Flow Management

```javascript
exports.execute = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'StatusControlJob');
    
    try {
        var inputFile = new File(File.IMPEX + parameters.fileName);
        
        if (!inputFile.exists()) {
            logger.info('Input file not found: {0}', parameters.fileName);
            // Use OK status with descriptive message for conditional flow control
            return new Status(Status.OK, 'OK', 'Input file was not present - skipping processing');
        }
        
        if (inputFile.length() === 0) {
            logger.info('Input file is empty: {0}', parameters.fileName);
            return new Status(Status.OK, 'OK', 'No data to process - file is empty');
        }
        
        // Process file...
        return new Status(Status.OK, 'OK', 'File processed successfully');
        
    } catch (e) {
        logger.error('Processing failed: {0}', e.message);
        return new Status(Status.ERROR, 'ERROR', e.message);
    }
};
```

## Transaction Management

```javascript
// RECOMMENDED: Use Transaction.wrap for automatic lifecycle management
exports.execute = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'TransactionJob');
    
    try {
        var category = CatalogMgr.getCategory(parameters.categoryID);
        var products = ProductMgr.queryProductsInCatalog(category.getCatalog());
        var updateCount = 0;
        
        // Transaction.wrap handles begin/commit/rollback automatically
        Transaction.wrap(function () {
            while (products.hasNext()) {
                var product = products.next();
                if (product.isOnline() && product.isAssignedToCategory(category)) {
                    product.setOnlineFlag(false);
                    updateCount++;
                }
            }
        });
        
        products.close();
        logger.info('Updated {0} products', updateCount);
        return new Status(Status.OK);
        
    } catch (e) {
        logger.error('Transaction failed: {0}', e.message);
        return new Status(Status.ERROR);
    }
};
```

## Status Codes

```javascript
// Success
return new Status(Status.OK);
return new Status(Status.OK, 'CUSTOM_CODE', 'Custom message');

// Error
return new Status(Status.ERROR);
return new Status(Status.ERROR, null, 'Error message');
```

**Important:** Custom status codes work **only** with OK status. If you use a custom code with ERROR status, it is replaced with ERROR. Custom status codes cannot contain commas, wildcards, leading/trailing whitespace, or exceed 100 characters.

## steptypes.json Configuration

```json
{
    "step-types": {
        "script-module-step": [
            {
                "@type-id": "custom.DeactivateProducts",
                "@supports-site-context": true,
                "@supports-organization-context": false,
                "description": "Deactivates all online products in a specified category",
                "module": "plugin_examplecartridge/cartridge/scripts/jobs/deactivateProducts.js",
                "function": "execute",
                "transactional": false,
                "timeout-in-seconds": 900,
                "parameters": {
                    "parameter": [
                        {
                            "@name": "categoryID",
                            "@type": "string",
                            "@required": true,
                            "description": "ID of the category containing products to deactivate"
                        },
                        {
                            "@name": "dryRun",
                            "@type": "boolean", 
                            "@required": false,
                            "description": "If true, only logs what would be deactivated"
                        }
                    ]
                },
                "status-codes": {
                    "status": [
                        { "@code": "OK", "description": "Products deactivated successfully" },
                        { "@code": "ERROR", "description": "An error occurred during processing" }
                    ]
                }
            }
        ]
    }
}
```

## Attribute Reference

| Attribute | Required | Description | Default |
|-----------|----------|-------------|---------|
| `@type-id` | Yes | Unique ID (must start with `custom.`, max 100 chars) | - |
| `@supports-parallel-execution` | No | Allow parallel execution | `true` |
| `@supports-site-context` | No | Available in site-scoped jobs | `true` |
| `@supports-organization-context` | No | Available in org-scoped jobs | `true` |
| `module` | Yes | Path to script module | - |
| `function` | Yes | Function name to execute | `execute` |
| `transactional` | No | Wrap in single transaction | `false` |
| `timeout-in-seconds` | No | Step timeout (recommended to set) | - |

**Context Constraints:** `@supports-site-context` and `@supports-organization-context` cannot both be `true` or both be `false`.

## External Service Integration

```javascript
var ServiceRegistry = require('dw/svc/ServiceRegistry');

exports.execute = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'ServiceJob');
    
    try {
        var service = ServiceRegistry.get('MyExternalService');
        var result = service.call({
            action: parameters.action,
            data: parameters.data
        });
        
        if (result.isOk()) {
            logger.info('Service call successful');
            return new Status(Status.OK);
        } else {
            logger.warn('Service call failed: {0}', result.getErrorMessage());
            return new Status(Status.ERROR, 'ERROR', result.getErrorMessage());
        }
    } catch (e) {
        logger.error('Service error: {0}', e.message);
        return new Status(Status.ERROR, 'ERROR', e.message);
    }
};
```

## Idempotent Job Design

```javascript
exports.execute = function (parameters, stepExecution) {
    var logger = Logger.getLogger('jobs', 'IdempotentJob');
    
    // Check for previous successful run
    var statusFile = new File(File.IMPEX + 'status/' + parameters.jobRunID + '.complete');
    if (statusFile.exists()) {
        logger.info('Job already completed successfully. Skipping.');
        return new Status(Status.OK, 'ALREADY_COMPLETED');
    }
    
    try {
        // Create processing flag
        var processingFile = new File(File.IMPEX + 'status/' + parameters.jobRunID + '.processing');
        var writer = new FileWriter(processingFile);
        writer.writeLine(new Date().toISOString());
        writer.close();
        
        // Perform business logic...
        
        // Mark job as completed
        var completeWriter = new FileWriter(statusFile);
        completeWriter.writeLine(new Date().toISOString());
        completeWriter.close();
        
        // Clean up processing flag
        processingFile.remove();
        
        return new Status(Status.OK);
    } catch (e) {
        logger.error('Job failed: {0}', e.message);
        return new Status(Status.ERROR, 'ERROR', e.message);
    }
};
```

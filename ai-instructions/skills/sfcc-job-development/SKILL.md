---
name: sfcc-job-development
description: Guide for developing custom jobs in Salesforce B2C Commerce Job Framework. Use this when asked to create batch jobs, scheduled tasks, chunk-oriented processing, or task-oriented jobs.
---

# SFCC Job Development Skill

This skill guides you through creating custom job steps for Salesforce B2C Commerce batch processing.

## Quick Checklist

```text
[ ] Choose the right model: task-oriented vs chunk-oriented
[ ] steptypes.json exists at the cartridge ROOT (not under cartridge/)
[ ] Step script exports required functions for its step type
[ ] All resources closed (iterators, file readers/writers) in afterStep
[ ] Timeouts are explicit and realistic for the dataset
[ ] Transactions scoped intentionally (avoid giant single transactions)
```

## Overview

Custom job steps execute custom business logic as part of B2C Commerce jobs. Two execution models:

| Model | Use Case | Progress Tracking |
|-------|----------|-------------------|
| **Task-oriented** | Single operations (FTP, import/export) | Limited |
| **Chunk-oriented** | Bulk data processing | Fine-grained |

## File Structure

```
my_cartridge/
├── cartridge/
│   ├── scripts/
│   │   └── steps/
│   │       ├── myTaskStep.js
│   │       └── myChunkStep.js
│   └── my_cartridge.properties
└── steptypes.json  ← Must be here, NOT inside cartridge/
```

**Important:** Only one `steptypes.json` per cartridge. Must be at cartridge root.

## Task-Oriented Steps

Use for single operations like FTP transfers, file generation, or quick database updates.

```javascript
'use strict';

var Status = require('dw/system/Status');
var Logger = require('dw/system/Logger');

exports.execute = function (parameters, stepExecution) {
    var log = Logger.getLogger('job', 'MyTaskStep');

    try {
        var inputFile = parameters.InputFile;
        
        if (!parameters.Enabled) {
            log.info('Step disabled, skipping');
            return new Status(Status.OK, 'SKIP', 'Step disabled');
        }

        // Your business logic here
        log.info('Processing file: ' + inputFile);

        return new Status(Status.OK);

    } catch (e) {
        log.error('Step failed: ' + e.message);
        return new Status(Status.ERROR, 'ERROR', e.message);
    }
};
```

### Status Codes

```javascript
// Success
return new Status(Status.OK);
return new Status(Status.OK, 'CUSTOM_CODE', 'Custom message');

// Error
return new Status(Status.ERROR);
return new Status(Status.ERROR, null, 'Error message');
```

**Important:** Custom status codes work **only** with OK status. ERROR status replaces custom codes.

## Chunk-Oriented Steps

Use for bulk processing of countable data (products, orders, customers).

### Required Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `read()` | Get next item | Item or nothing |
| `process(item)` | Transform item | Processed item or nothing (filters) |
| `write(items)` | Save chunk of items | Nothing |

### Optional Functions

| Function | Purpose |
|----------|---------|
| `beforeStep()` | Initialize (open files, queries) |
| `afterStep(success)` | Cleanup (close files) |
| `getTotalCount()` | Return total items for progress |
| `beforeChunk()` | Before each chunk |
| `afterChunk()` | After each chunk |

### Script Example

```javascript
'use strict';

var ProductMgr = require('dw/catalog/ProductMgr');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');

var log = Logger.getLogger('job', 'MyChunkStep');
var products;

exports.beforeStep = function (parameters, stepExecution) {
    log.info('Starting chunk processing');
    products = ProductMgr.queryAllSiteProducts();
};

exports.getTotalCount = function (parameters, stepExecution) {
    return products.count; // Use built-in count!
};

exports.read = function (parameters, stepExecution) {
    if (products.hasNext()) {
        return products.next();
    }
    // Return nothing = end of data
};

exports.process = function (product, parameters, stepExecution) {
    if (!product.online) {
        return;  // Filtered out
    }
    return {
        id: product.ID,
        name: product.name,
        price: product.priceModel.price.value
    };
};

exports.write = function (items, parameters, stepExecution) {
    for (var i = 0; i < items.size(); i++) {
        var item = items.get(i);
        // Write item...
    }
};

exports.afterStep = function (success, parameters, stepExecution) {
    if (products) {
        products.close(); // Critical: close iterators!
    }
    log.info(success ? 'Completed successfully' : 'Failed');
};
```

**Important:** Chunk-oriented steps always finish with either **OK** or **ERROR**. Custom exit status codes are not supported.

## steptypes.json Configuration

### Task-Oriented Step

```json
{
    "step-types": {
        "script-module-step": [
            {
                "@type-id": "custom.MyTaskStep",
                "@supports-site-context": true,
                "@supports-organization-context": false,
                "description": "My custom task step",
                "module": "my_cartridge/cartridge/scripts/steps/myTaskStep.js",
                "function": "execute",
                "timeout-in-seconds": 900,
                "parameters": {
                    "parameter": [
                        {
                            "@name": "InputFile",
                            "@type": "string",
                            "@required": true,
                            "description": "Path to input file"
                        }
                    ]
                },
                "status-codes": {
                    "status": [
                        { "@code": "OK", "description": "Step completed" },
                        { "@code": "ERROR", "description": "Step failed" }
                    ]
                }
            }
        ]
    }
}
```

### Chunk-Oriented Step

```json
{
    "step-types": {
        "chunk-script-module-step": [
            {
                "@type-id": "custom.MyChunkStep",
                "@supports-site-context": true,
                "@supports-organization-context": false,
                "description": "Bulk data processing step",
                "module": "my_cartridge/cartridge/scripts/steps/myChunkStep.js",
                "before-step-function": "beforeStep",
                "read-function": "read",
                "process-function": "process",
                "write-function": "write",
                "after-step-function": "afterStep",
                "total-count-function": "getTotalCount",
                "chunk-size": 100,
                "transactional": false,
                "timeout-in-seconds": 1800
            }
        ]
    }
}
```

## Key Configuration Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `@type-id` | Yes | Unique ID (must start with `custom.`) |
| `@supports-site-context` | No | Available in site-scoped jobs |
| `@supports-organization-context` | No | Available in org-scoped jobs |
| `module` | Yes | Path to script module |
| `function` | Yes | Function name (task-oriented) |
| `chunk-size` | Yes* | Items per chunk (*chunk steps only) |
| `timeout-in-seconds` | No | Step timeout (recommended) |

**Context Constraints:** `@supports-site-context` and `@supports-organization-context` cannot both be `true` or both be `false`.

## Parameter Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text value | `"my-value"` |
| `boolean` | true/false | `true` |
| `long` | Integer | `12345` |
| `double` | Decimal | `123.45` |

## Critical Performance Pattern

**Use SeekableIterator's built-in count** instead of creating separate iterators:

```javascript
// ✅ CORRECT - Uses built-in count
exports.getTotalCount = function() {
    return products.getCount(); // Instant, no DB hit
}

// ❌ WRONG - Creates duplicate query!
exports.getTotalCount = function() {
    var counter = ProductMgr.queryAllSiteProducts(); // Unnecessary!
    var count = 0;
    while (counter.hasNext()) { counter.next(); count++; }
    counter.close();
    return count;
}
```

## Best Practices

1. **Use chunk-oriented** for bulk data - better progress tracking and resumability
2. **Close resources** in `afterStep()` - queries, files, connections
3. **Set explicit timeouts** - default may be too short
4. **Log progress** - helps debugging
5. **Handle errors gracefully** - return proper Status objects
6. **Don't rely on transactional=true** - use `Transaction.wrap()` for control
7. **Use streaming APIs** for file processing
8. **Avoid accumulating objects** in global scope

## Chunk Size Guidelines

| Operation Type | Recommended Size |
|----------------|------------------|
| Simple attribute updates | 500-1000 |
| Complex object creation | 100-300 |
| File I/O operations | 200-500 |
| General operations | 250 |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| OutOfMemoryError | Use streaming APIs, close iterators, reduce chunk size |
| ScriptingTimeoutError | Use chunk-oriented model, review algorithm |
| Transaction timeouts | Reduce chunk size, commit per chunk |
| Job not visible in BM | Check code version is active |

## Related Skills

- **[sfcc-logging](../sfcc-logging/SKILL.md)** - Comprehensive logging patterns, custom log files, NDC tracing. Essential for job debugging and monitoring.

## Detailed References

- [Task-Oriented Steps](references/TASK-ORIENTED.md) - Full task step patterns
- [Chunk-Oriented Steps](references/CHUNK-ORIENTED.md) - Full chunk step patterns
- [steptypes.json Reference](references/STEPTYPES-JSON.md) - Complete schema

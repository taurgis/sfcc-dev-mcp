# Chunk-Oriented Job Steps Reference

Complete reference for chunk-oriented (chunk-script-module-step) job development in SFCC.

## When to Use Chunk-Oriented Jobs

Choose chunk-oriented jobs for:
- Processing large datasets (>1000 items)
- Iterating over products, orders, customers, or file rows
- When progress monitoring is required
- When failure resilience is critical
- When transaction control is important

## Lifecycle Functions

### Required Functions (Data Pipeline)

| Function | Purpose | Returns |
|----------|---------|---------|
| `read()` | Get next item from data source | Item or nothing (signals end) |
| `process(item)` | Transform item | Processed item or nothing (filters out) |
| `write(items)` | Save chunk of items | Nothing |

### Optional Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `beforeStep()` | Initialize (open files, queries) | Nothing |
| `afterStep(success)` | Cleanup (close files) | Nothing |
| `getTotalCount()` | Return total items for progress | Number |
| `beforeChunk()` | Before each chunk | Nothing |
| `afterChunk()` | After each chunk | Nothing |

## Complete Script Example

```javascript
'use strict';

var File = require('dw/io/File');
var FileReader = require('dw/io/FileReader');
var CSVStreamReader = require('dw/io/CSVStreamReader');
var ProductMgr = require('dw/catalog/ProductMgr');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');

var csvReader;
var totalLines = 0;
var processedLines = 0;
var logger = Logger.getLogger('jobs', 'BulkProductUpdate');

/**
 * Setup function - opens input file and prepares for processing
 */
exports.beforeStep = function (parameters, stepExecution) {
    try {
        var inputFile = new File(File.IMPEX + parameters.inputFileName);
        if (!inputFile.exists()) {
            throw new Error('Input file not found: ' + parameters.inputFileName);
        }
        
        var fileReader = new FileReader(inputFile);
        csvReader = new CSVStreamReader(fileReader);
        
        // Skip header row if present
        if (parameters.hasHeader === 'true') {
            csvReader.readNext();
        }
        
        logger.info('Started processing file: {0}', parameters.inputFileName);
        
    } catch (e) {
        logger.error('Setup failed: {0}', e.message);
        throw e;
    }
};

/**
 * Returns total count for progress monitoring
 */
exports.getTotalCount = function (parameters, stepExecution) {
    return totalLines > 0 ? totalLines : null;
};

/**
 * Reads next item from data source
 * @returns {Object|null} Next item or null when finished
 */
exports.read = function (parameters, stepExecution) {
    var line = csvReader.readNext();
    if (line && line.length > 0) {
        return {
            productID: line[0],
            newOnlineStatus: line[1] === 'true',
            lineNumber: ++processedLines
        };
    }
    return null; // Signals end of data
};

/**
 * Processes a single item
 * @param {Object} item - Item from read()
 * @returns {Object|null} Processed item or null to filter out
 */
exports.process = function (item, parameters, stepExecution) {
    try {
        var product = ProductMgr.getProduct(item.productID);
        if (!product) {
            return {
                productID: item.productID,
                status: 'ERROR',
                message: 'Product not found',
                lineNumber: item.lineNumber
            };
        }
        
        if (typeof item.newOnlineStatus !== 'boolean') {
            return {
                productID: item.productID,
                status: 'SKIPPED',
                message: 'Invalid online status value',
                lineNumber: item.lineNumber
            };
        }
        
        return {
            product: product,
            productID: item.productID,
            newOnlineStatus: item.newOnlineStatus,
            status: 'READY',
            lineNumber: item.lineNumber
        };
        
    } catch (e) {
        logger.warn('Error processing product {0}: {1}', item.productID, e.message);
        return {
            productID: item.productID,
            status: 'ERROR',
            message: e.message,
            lineNumber: item.lineNumber
        };
    }
};

/**
 * Writes a chunk of processed items
 * @param {dw.util.ArrayList} chunk - Collection of processed items
 */
exports.write = function (chunk, parameters, stepExecution) {
    var successCount = 0;
    var errorCount = 0;
    
    for (var i = 0; i < chunk.size(); i++) {
        var item = chunk.get(i);
        
        if (item.status === 'READY') {
            try {
                item.product.setOnlineFlag(item.newOnlineStatus);
                successCount++;
            } catch (e) {
                errorCount++;
                logger.error('Failed to update product {0}: {1}', item.productID, e.message);
            }
        } else {
            errorCount++;
        }
    }
    
    logger.info('Chunk processed: {0} success, {1} errors', successCount, errorCount);
};

/**
 * Pre-chunk setup to begin a transaction
 */
exports.beforeChunk = function (parameters, stepExecution) {
    Transaction.begin();
};

/**
 * Commits transaction after successful chunk processing
 */
exports.afterChunk = function (parameters, stepExecution) { 
    Transaction.commit();
};

/**
 * Cleanup function - closes resources
 */
exports.afterStep = function (success, parameters, stepExecution) {
    if (csvReader) {
        csvReader.close();
    }
    
    logger.info('Processing completed. Total lines processed: {0}', processedLines);
    
    if (!success) {
        logger.error('Job completed with errors');
    }
};
```

## SeekableIterator Optimization (Critical)

**ALWAYS** use the SeekableIterator's built-in count property instead of creating separate iterators for counting.

### ✅ OPTIMAL Pattern

```javascript
var products; // Declare at module level

exports.beforeStep = function(parameters) {
    products = ProductMgr.queryAllSiteProductsSorted(); // Single query
}

exports.getTotalCount = function() {
    if (products && products.getCount) {
        var totalCount = products.getCount(); // Instant, no DB hit
        return totalCount >= 0 ? totalCount : null;
    }
    return null;
}

exports.read = function() {
    return products.hasNext() ? products.next() : null;
}
```

### ❌ ANTI-PATTERN (Avoid!)

```javascript
// Creates TWO expensive database queries!
exports.getTotalCount = function() {
    var counter = ProductMgr.queryAllSiteProducts(); // Unnecessary Query #1
    var count = 0;
    while (counter.hasNext()) { counter.next(); count++; } // Manual counting!
    counter.close();
    return count;
}

exports.read = function() {
    if (!products) {
        products = ProductMgr.queryAllSiteProductsSorted(); // Query #2
    }
    return products.hasNext() ? products.next() : null;
}
```

**Performance Impact:** The anti-pattern increases database load by **100%** and can add **1-5 minutes** to job startup for large catalogs.

## Transaction Per Chunk Pattern

```javascript
exports.beforeChunk = function (parameters, stepExecution) {
    Transaction.begin();
};

exports.write = function (chunk, parameters, stepExecution) {
    for (var i = 0; i < chunk.size(); i++) {
        var item = chunk.get(i);
        updateDatabaseObject(item);
    }
};

exports.afterChunk = function (parameters, stepExecution) {
    try {
        Transaction.commit();
    } catch (e) {
        Transaction.rollback();
        throw e;
    }
};
```

## steptypes.json Configuration

```json
{
    "step-types": {
        "chunk-script-module-step": [
            {
                "@type-id": "custom.BulkProductUpdate",
                "@supports-parallel-execution": false,
                "@supports-site-context": true,
                "@supports-organization-context": false,
                "description": "Updates product online status from CSV file in chunks",
                "module": "plugin_examplecartridge/cartridge/scripts/jobs/bulkProductUpdate.js",
                "before-step-function": "beforeStep",
                "total-count-function": "getTotalCount",
                "before-chunk-function": "beforeChunk",
                "read-function": "read",
                "process-function": "process",
                "write-function": "write",
                "after-chunk-function": "afterChunk",
                "after-step-function": "afterStep",
                "chunk-size": 200,
                "transactional": false,
                "parameters": {
                    "parameter": [
                        {
                            "@name": "inputFileName",
                            "@type": "string",
                            "@required": true,
                            "description": "Name of CSV file in IMPEX folder"
                        },
                        {
                            "@name": "hasHeader",
                            "@type": "boolean",
                            "@required": false,
                            "description": "Whether CSV file has header row"
                        }
                    ]
                },
                "status-codes": {
                    "status": [
                        { "@code": "OK", "description": "Processing completed successfully" },
                        { "@code": "ERROR", "description": "An error occurred during processing" }
                    ]
                }
            }
        ]
    }
}
```

## Chunk-Specific Attributes

| Attribute | Required | Description | Default |
|-----------|----------|-------------|---------|
| `before-step-function` | No | Setup function before processing starts | None |
| `total-count-function` | No | Returns total items for progress tracking | None |
| `before-chunk-function` | No | Setup before each chunk | None |
| `read-function` | No | Reads next item from data source | `read` |
| `process-function` | No | Processes individual items | `process` |
| `write-function` | No | Writes processed chunk | `write` |
| `after-chunk-function` | No | Cleanup after each chunk | None |
| `after-step-function` | No | Final cleanup after all chunks | None |
| `chunk-size` | **Yes** | Number of items per chunk | Must be > 0 |

## Chunk Size Guidelines

| Operation Type | Recommended Chunk Size |
|----------------|------------------------|
| Simple attribute updates | 500-1000 items |
| Complex object creation | 100-300 items |
| File I/O operations | 200-500 items |
| General operations | 250 items (good balance) |

## Memory Management

### Always Use Streaming APIs

```javascript
// ❌ WRONG: Loading entire file into memory
var content = new FileReader(file).readBytes();
var lines = content.toString().split('\n');

// ✅ CORRECT: Stream processing
var csvReader = new CSVStreamReader(new FileReader(file));
var line;
while ((line = csvReader.readNext()) !== null) {
    // Process one line at a time
}
csvReader.close();
```

### Always Close Iterators

```javascript
exports.afterStep = function (success, parameters, stepExecution) {
    if (csvReader) csvReader.close();
    if (xmlReader) xmlReader.close();
    if (iterator) iterator.close(); // Critical: prevents memory leaks
};
```

### Avoid Object Accumulation

```javascript
// ❌ WRONG: Accumulating objects
var allProducts = [];
while (products.hasNext()) {
    allProducts.push(products.next()); // Memory grows linearly
}

// ✅ CORRECT: Process and release
while (products.hasNext()) {
    var product = products.next();
    processProduct(product);
    // Product reference goes out of scope
}
```

**Important:** Chunk-oriented steps always finish with either **OK** or **ERROR**. Custom exit status codes are not supported for chunk steps.

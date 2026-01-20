# steptypes.json Reference

Complete schema and configuration reference for SFCC job step type definitions.

## File Placement

**Critical Requirements:**
- File must be named **exactly** `steptypes.json`
- Must be placed in the **root folder** of your custom cartridge (not inside the cartridge subfolder)
- Only **one** `steptypes.json` file per cartridge is allowed
- Cannot coexist with `steptypes.xml` - choose one format only

**Correct File Structure:**
```
my_cartridge/
├── cartridge/
│   ├── controllers/
│   ├── scripts/
│   │   └── steps/
│   │       ├── myTaskStep.js
│   │       └── myChunkStep.js
│   └── my_cartridge.properties
└── steptypes.json ← Must be here, NOT inside cartridge/
```

## Root Structure

```json
{
  "step-types": {
    "script-module-step": [],
    "chunk-script-module-step": [],
    "pipeline-step": []
  }
}
```

**Note**: At least one step type category must be defined, but all three are optional.

## Parameter Types

| Type | Description | Example Value |
|------|-------------|---------------|
| `string` | Text value | `"my-value"` |
| `boolean` | true/false | `true` |
| `long` | Integer | `12345` |
| `double` | Decimal | `123.45` |
| `datetime-string` | ISO datetime | `"2024-01-15T10:30:00Z"` |
| `date-string` | ISO date | `"2024-01-15"` |
| `time-string` | ISO time | `"10:30:00"` |

## Parameter Validation Attributes

| Attribute | Applies To | Description |
|-----------|------------|-------------|
| `@trim` | All | Trim whitespace before validation (default: `true`) |
| `@required` | All | Mark as required (default: `true`) |
| `@target-type` | datetime-string, date-string, time-string | Convert to `long` or `date` (default: `date`) |
| `pattern` | string | Regex pattern for validation |
| `min-length` | string | Minimum string length (must be ≥1) |
| `max-length` | string | Maximum string length (max 1000 chars total) |
| `min-value` | long, double, datetime-string, time-string | Minimum numeric value |
| `max-value` | long, double, datetime-string, time-string | Maximum numeric value |
| `enum-values` | All | Restrict to allowed values (dropdown in BM) |

## Script-Module-Step Attributes

| Attribute | Required | Description | Default |
|-----------|----------|-------------|---------|
| `@type-id` | **Yes** | Unique ID (must start with `custom.`, max 100 chars) | - |
| `@supports-parallel-execution` | No | Allow parallel execution | `true` |
| `@supports-site-context` | No | Available in site-scoped jobs | `true` |
| `@supports-organization-context` | No | Available in org-scoped jobs | `true` |
| `description` | No | Internal description (not shown in BM) | - |
| `module` | **Yes** | Path to script module | - |
| `function` | **Yes** | Function name to execute | `execute` |
| `transactional` | No | Wrap in single transaction | `false` |
| `timeout-in-seconds` | No | Step timeout | - |

## Chunk-Script-Module-Step Attributes

All script-module-step attributes plus:

| Attribute | Required | Description | Default |
|-----------|----------|-------------|---------|
| `before-step-function` | No | Setup function name | None |
| `total-count-function` | No | Progress tracking function | None |
| `before-chunk-function` | No | Pre-chunk function | None |
| `read-function` | No | Read next item function | `read` |
| `process-function` | No | Process item function | `process` |
| `write-function` | No | Write chunk function | `write` |
| `after-chunk-function` | No | Post-chunk function | None |
| `after-step-function` | No | Cleanup function | None |
| `chunk-size` | **Yes** | Items per chunk | Must be > 0 |

## Complete Task-Oriented Example

```json
{
  "step-types": {
    "script-module-step": [
      {
        "@type-id": "custom.DeactivateProducts",
        "@supports-parallel-execution": true,
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

## Complete Chunk-Oriented Example

```json
{
  "step-types": {
    "chunk-script-module-step": [
      {
        "@type-id": "custom.BulkPriceUpdate",
        "@supports-parallel-execution": false,
        "@supports-site-context": true,
        "@supports-organization-context": false,
        "description": "Updates product prices from CSV file in chunks",
        "module": "plugin_examplecartridge/cartridge/scripts/jobs/bulkPriceUpdate.js",
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
        "timeout-in-seconds": 1800,
        "parameters": {
          "parameter": [
            {
              "@name": "inputFileName",
              "@type": "string",
              "@required": true,
              "min-length": 1,
              "max-length": 255,
              "description": "Name of CSV file in IMPEX folder"
            },
            {
              "@name": "hasHeader",
              "@type": "boolean",
              "@required": false,
              "default-value": "true",
              "description": "Whether CSV file has header row"
            },
            {
              "@name": "priceMultiplier",
              "@type": "double",
              "@required": false,
              "min-value": 0.01,
              "max-value": 100.0,
              "default-value": "1.0",
              "description": "Factor to multiply prices by"
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

## Parameter with Enum Values

```json
{
  "@name": "exportFormat",
  "@type": "string",
  "@required": true,
  "description": "Output format for export",
  "enum-values": {
    "value": ["CSV", "XML", "JSON"]
  }
}
```

## Pipeline Step (Legacy)

```json
{
  "step-types": {
    "pipeline-step": [
      {
        "@type-id": "custom.LegacyPipelineStep",
        "@supports-site-context": true,
        "@supports-organization-context": false,
        "description": "Legacy pipeline step",
        "pipeline": "cartridge/pipelines/jobs/LegacyPipeline.xml",
        "start-node": "Start"
      }
    ]
  }
}
```

**Note**: Pipeline steps are legacy - use script-module-step or chunk-script-module-step for new development.

## Context Constraints

**Important:** `@supports-site-context` and `@supports-organization-context` cannot both be `true` or both be `false` - one must be `true` and the other `false`.

## Status Codes

Custom status codes enable flow control in Business Manager:

```json
{
  "status-codes": {
    "status": [
      { "@code": "OK", "description": "Standard success" },
      { "@code": "NO_DATA", "description": "No data to process" },
      { "@code": "PARTIAL", "description": "Partial completion" },
      { "@code": "ERROR", "description": "Processing failed" }
    ]
  }
}
```

**Task-Oriented:** Custom status codes work only with `Status.OK`. If used with `Status.ERROR`, the custom code is replaced with `ERROR`.

**Chunk-Oriented:** Only `OK` or `ERROR` status is supported. Custom codes are not available.

## Validation Rules Summary

- `@type-id`: Must start with `custom.`, max 100 chars, no whitespace, unique across all cartridges
- `@type-id`: Cannot conflict with system step types like `ExecutePipeline` or `IncludeStepsFromJob`
- `description`: Max 4000 characters
- `module` and `function`: No leading/trailing whitespace
- `chunk-size`: Must be numeric > 0
- Status codes: Cannot contain commas, wildcards, or exceed 100 characters

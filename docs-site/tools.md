---
title: Available Tools
layout: page
nav_order: 6
---

# 🛠️ Available Tools

The SFCC Development MCP Server provides 30 specialized tools organized into logical categories based on functionality and required credentials.

## Tool Availability by Mode

| Mode | Total Tools | Description |
|------|-------------|-------------|
| **Documentation-Only** | 15 tools | No SFCC credentials required |
| **Full Mode** | 30 tools | Requires SFCC instance access |

---

## 📚 SFCC Documentation Tools (5 tools)
*Available in both modes*

### `get_sfcc_class_info`
Get detailed information about any SFCC class including properties, methods, and descriptions.

**Parameters:**
- `className` (required): The SFCC class name (e.g., 'Catalog', 'dw.catalog.Catalog')
- `expand` (optional): Include detailed information about referenced types

**Example Usage:**
```javascript
// Get Product class information
get_sfcc_class_info({ className: "dw.catalog.Product" })

// Get expanded information with referenced types
get_sfcc_class_info({ className: "dw.order.Order", expand: true })
```

### `search_sfcc_classes`
Find SFCC classes by name with partial matching capabilities.

**Parameters:**
- `query` (required): Search query for class names (single word only)

**Example Usage:**
```javascript
// Find all catalog-related classes
search_sfcc_classes({ query: "catalog" })

// Find customer-related classes  
search_sfcc_classes({ query: "customer" })
```

### `search_sfcc_methods`
Find methods across all SFCC classes by method name.

**Parameters:**
- `methodName` (required): Method name to search for (single word only)

**Example Usage:**
```javascript
// Find all 'get' methods across SFCC classes
search_sfcc_methods({ methodName: "get" })

// Find 'create' methods
search_sfcc_methods({ methodName: "create" })
```

### `list_sfcc_classes`
Get a complete list of all available SFCC classes for exploration and discovery.

**Example Usage:**
```javascript
// List all SFCC classes
list_sfcc_classes()
```

### `get_sfcc_class_documentation`
Get the complete raw Markdown documentation for an SFCC class.

**Parameters:**
- `className` (required): The SFCC class name

**Example Usage:**
```javascript
// Get complete documentation for Product class
get_sfcc_class_documentation({ className: "Product" })
```

---

## 📖 Best Practices Tools (4 tools)
*Available in both modes*

### `get_available_best_practice_guides`
List all available SFCC best practice guides covering various development areas.

**Example Usage:**
```javascript
// Get list of all available guides
get_available_best_practice_guides()
```

### `get_best_practice_guide`
Retrieve comprehensive best practice guides with structured content.

**Parameters:**
- `guideName` (required): Guide name (e.g., 'cartridge_creation', 'isml_templates', 'sfra_controllers')

**Available Guides:**
- `cartridge_creation` - Complete cartridge development
- `isml_templates` - Template development with security
- `job_framework` - Background job development
- `localserviceregistry` - Service integration patterns
- `ocapi_hooks` - OCAPI hook implementation
- `scapi_hooks` - SCAPI hook development
- `sfra_controllers` - Controller best practices
- `sfra_models` - Model architecture patterns
- `scapi_custom_endpoint` - Custom API endpoints
- `performance` - Performance optimization
- `security` - Security best practices

**Example Usage:**
```javascript
// Get cartridge creation guide
get_best_practice_guide({ guideName: "cartridge_creation" })

// Get SFRA controller patterns
get_best_practice_guide({ guideName: "sfra_controllers" })
```

### `search_best_practices`
Search across all best practice guides for specific terms or concepts.

**Parameters:**
- `query` (required): Search term or concept (single words work best)

**Example Usage:**
```javascript
// Search for validation patterns
search_best_practices({ query: "validation" })

// Find security-related content
search_best_practices({ query: "security" })
```

### `get_hook_reference`
Access detailed hook reference tables for OCAPI and SCAPI hooks.

**Parameters:**
- `guideName` (required): Either 'ocapi_hooks' or 'scapi_hooks'

**Example Usage:**
```javascript
// Get OCAPI hook reference
get_hook_reference({ guideName: "ocapi_hooks" })

// Get SCAPI hook reference  
get_hook_reference({ guideName: "scapi_hooks" })
```

---

## 🏗️ SFRA Documentation Tools (5 tools)
*Available in both modes*

### `get_available_sfra_documents`
List all 26+ available SFRA documents with smart categorization.

**Example Usage:**
```javascript
// Get all SFRA documents with categories
get_available_sfra_documents()
```

### `get_sfra_document`
Retrieve complete SFRA class, module, or model documentation.

**Parameters:**
- `documentName` (required): SFRA document name (e.g., 'server', 'request', 'cart', 'product-full')

**Example Usage:**
```javascript
// Get Server class documentation
get_sfra_document({ documentName: "server" })

// Get cart model documentation
get_sfra_document({ documentName: "cart" })

// Get complete product model documentation
get_sfra_document({ documentName: "product-full" })
```

### `search_sfra_documentation`
Advanced search across all SFRA documentation with relevance scoring.

**Parameters:**
- `query` (required): Search term or concept

**Example Usage:**
```javascript
// Search for middleware patterns
search_sfra_documentation({ query: "middleware" })

// Find routing information
search_sfra_documentation({ query: "routing" })
```

### `get_sfra_documents_by_category`
Filter SFRA documents by functional category for efficient discovery.

**Parameters:**
- `category` (required): Category name ('core', 'product', 'order', 'customer', 'pricing', 'store', 'other')

**Categories:**
- **core** (5 docs): Server, Request, Response, QueryString, render
- **product** (5 docs): Product models and search functionality
- **order** (6 docs): Cart, billing, shipping, payment models
- **customer** (2 docs): Account and address management
- **pricing** (3 docs): Price models and discount handling
- **store** (2 docs): Store location and management
- **other** (3+ docs): Categories, content, locale utilities

**Example Usage:**
```javascript
// Get all core SFRA classes
get_sfra_documents_by_category({ category: "core" })

// Get product-related models
get_sfra_documents_by_category({ category: "product" })
```

### `get_sfra_categories`
Get all available SFRA document categories with counts and descriptions.

**Example Usage:**
```javascript
// Get category overview
get_sfra_categories()
```

---

## 🚀 Cartridge Generation Tools (1 tool)
*Available in both modes*

### `generate_cartridge_structure`
Generate complete cartridge directory structures with all necessary files.

**Parameters:**
- `cartridgeName` (required): Name of the cartridge (e.g., "plugin_example")
- `targetPath` (optional): Target directory path for cartridge files
- `fullProjectSetup` (optional): Whether to create complete project setup (default: true)

**Example Usage:**
```javascript
// Create new cartridge with full project setup
generate_cartridge_structure({ 
  cartridgeName: "plugin_myfeature",
  targetPath: "/path/to/project"
})

// Add cartridge to existing project
generate_cartridge_structure({
  cartridgeName: "int_payment",
  fullProjectSetup: false,
  targetPath: "/path/to/existing/project"
})
```

---

## 📊 Log Analysis Tools (7 tools)
*Full Mode only - requires SFCC credentials*

### `get_latest_error`
Retrieve the most recent error messages from SFCC logs for debugging critical issues.

**Parameters:**
- `date` (optional): Date in YYYYMMDD format (default: today)
- `limit` (optional): Number of entries to return (default: 10)

### `get_latest_warn`
Fetch recent warning messages to identify potential issues and performance concerns.

**Parameters:**
- `date` (optional): Date in YYYYMMDD format (default: today)  
- `limit` (optional): Number of entries to return (default: 10)

### `get_latest_info`
Access recent info-level log entries to understand application flow and verify operations.

**Parameters:**
- `date` (optional): Date in YYYYMMDD format (default: today)
- `limit` (optional): Number of entries to return (default: 10)

### `get_latest_debug`
Get detailed debug messages for step-by-step code execution tracing.

**Parameters:**
- `date` (optional): Date in YYYYMMDD format (default: today)
- `limit` (optional): Number of entries to return (default: 10)

### `summarize_logs`
Get a comprehensive overview of log activity with counts and key issues for system health assessment.

**Parameters:**
- `date` (optional): Date in YYYYMMDD format (default: today)

### `search_logs`
Search for specific patterns, keywords, or error messages across SFCC logs.

**Parameters:**
- `pattern` (required): Search pattern or keyword to find in logs
- `date` (optional): Date in YYYYMMDD format (default: today)
- `limit` (optional): Number of matching entries to return (default: 20)
- `logLevel` (optional): Restrict search to specific log level ('error', 'warn', 'info', 'debug')

### `list_log_files`
View available log files with metadata including sizes and modification dates.

**Example Usage:**
```javascript
// Get recent errors
get_latest_error({ limit: 5 })

// Search for specific error pattern
search_logs({ 
  pattern: "NullPointerException",
  logLevel: "error" 
})

// Get daily log summary
summarize_logs({ date: "20241218" })
```

---

## ⚙️ System Object Definition Tools (6 tools)
*Full Mode only - requires OAuth credentials*

### `get_system_object_definitions`
Retrieve a complete list of all system object definitions with metadata.

**Parameters:**
- `count` (optional): Number of items to return (default: 200)
- `start` (optional): Start index for pagination (default: 0)  
- `select` (optional): Property selector (default: "(**)")

### `get_system_object_definition`
Get detailed information about a specific system object including basic metadata.

**Parameters:**
- `objectType` (required): System object type (e.g., 'Product', 'Customer', 'Order')

### `search_system_object_attribute_definitions`
Search for specific attribute definitions within a system object using complex queries.

**Parameters:**
- `objectType` (required): System object type to search within
- `searchRequest` (required): Complex search query with filtering and sorting

### `search_site_preferences`
Search site preferences across sites in specified preference groups.

**Parameters:**
- `groupId` (required): ID of the preference group to search within
- `instanceType` (optional): Instance type ('sandbox', 'staging', 'development', 'production')
- `searchRequest` (required): Search query with filtering options
- `options` (optional): Additional options like expanding values

### `search_system_object_attribute_groups`
Search attribute groups for system objects, essential for discovering site preference groups.

**Parameters:**
- `objectType` (required): System object type (use "SitePreferences" for site preferences)
- `searchRequest` (required): Search query with filtering and sorting

### `search_custom_object_attribute_definitions`
Search for attribute definitions within custom object types.

**Parameters:**
- `objectType` (required): Custom object type name
- `searchRequest` (required): Complex search query

**Example Usage:**
```javascript
// Get all system objects
get_system_object_definitions()

// Get Product object details
get_system_object_definition({ objectType: "Product" })

// Find site preference groups
search_system_object_attribute_groups({
  objectType: "SitePreferences",
  searchRequest: {
    query: { match_all_query: {} }
  }
})

// Search for custom product attributes
search_system_object_attribute_definitions({
  objectType: "Product",
  searchRequest: {
    query: {
      text_query: {
        fields: ["id", "display_name"],
        search_phrase: "custom"
      }
    }
  }
})
```

---

## 🔄 Code Version Management Tools (2 tools)
*Requires Full Mode (OCAPI credentials)*

### `get_code_versions`
Retrieve all code versions from the SFCC instance for deployment management and troubleshooting.

**Parameters:**
- None required

**Use Cases:**
- Code-switch fixes for SCAPI endpoint registration issues
- Job deployment troubleshooting  
- Deployment conflict resolution
- Version management and rollback planning

**Example Usage:**
```javascript
// Get all available code versions
get_code_versions()
```

**Sample Response:**
```json
{
  "_v": "23.2",
  "_type": "code_version_result", 
  "count": 2,
  "data": [
    {
      "_type": "code_version",
      "_resource_state": "860cde3040519cce439cd99e209f8a87c3ad0b7e2813edbf6f5501f763b73bd5",
      "id": "version1",
      "active": true,
      "cartridges": "app_storefront_base, plugin_cartridge", 
      "compatibility_mode": "23.2",
      "activation_time": "2024-01-15T10:30:00Z",
      "total_size": "2.1 MB"
    },
    {
      "_type": "code_version",
      "_resource_state": "950cde3040519cce439cd99e209f8a87c3ad0b7e2813edbf6f5501f763b73bd6", 
      "id": "version2",
      "active": false,
      "cartridges": "app_storefront_base",
      "compatibility_mode": "23.1", 
      "activation_time": "2024-01-10T14:20:00Z",
      "total_size": "1.8 MB"
    }
  ],
  "total": 2
}
```

### `activate_code_version`
Activate a specific code version to resolve deployment issues and perform code-switch fixes.

**Parameters:**
- `codeVersionId` (required): The ID of the code version to activate

**Use Cases:**
- Perform code-switch fixes for SCAPI endpoint registration issues
- Resolve job deployment conflicts
- Switch to a known working version during incidents
- Activate newly deployed code versions

**Important Notes:**
- Only inactive code versions can be activated
- Activating a version automatically deactivates the currently active version

**Example Usage:**
```javascript
// First, get available code versions to find the ID
get_code_versions()

// Then activate a specific version
activate_code_version({
  codeVersionId: "version2"
})
```

**Sample Response:**
```json
{
  "_v": "23.2",
  "_type": "code_version",
  "_resource_state": "a60cde3040519cce439cd99e209f8a87c3ad0b7e2813edbf6f5501f763b73bd7",
  "id": "version2",
  "active": true,
  "cartridges": "app_storefront_base",
  "compatibility_mode": "23.1",
  "activation_time": "2024-01-19T15:45:22Z",
  "last_modification_time": "2024-01-19T15:45:22Z",
  "total_size": "1.8 MB",
  "web_dav_url": "https://example.com/on/demandware.servlet/webdav/Sites/Cartridges/version2"
}
```

**Error Handling:**
- **404 Not Found**: Code version ID doesn't exist
- **400 Bad Request**: Trying to modify an already active code version
- **409 Conflict**: Code version ID already exists (when renaming)

### **Complete Code-Switch Workflow**
Here's a typical workflow for performing a code-switch fix:

```javascript
// Step 1: View current code versions to understand the situation
get_code_versions()
// Response shows version1 is active, version2 is inactive

// Step 2: Activate the desired version
activate_code_version({
  codeVersionId: "version2"
})
// This automatically deactivates version1 and activates version2

// Step 3: Verify the activation was successful
get_code_versions()
// Response now shows version2 is active, version1 is inactive
```

This workflow is particularly useful when:
- SCAPI endpoints fail to register properly
- Job definitions don't deploy correctly  
- You need to quickly revert to a known working state
- Testing different cartridge configurations

---

## 🎯 Tool Selection Guide

### For Learning SFCC
**Use Documentation-Only Mode (15 tools):**
- `list_sfcc_classes` - Explore available APIs
- `get_sfcc_class_info` - Understand class capabilities  
- `get_available_best_practice_guides` - Learn development patterns
- `get_sfra_document` - Study SFRA architecture

### For Active Development  
**Use Full Mode (30 tools):**
- All documentation tools for reference
- `generate_cartridge_structure` - Start new features
- `get_latest_error` - Debug issues quickly
- `search_logs` - Track down specific problems
- `search_system_object_attribute_definitions` - Explore data model

### For Debugging Issues
**Focus on Log Analysis Tools:**
- `summarize_logs` - Get overview of system health
- `get_latest_error` - Find recent failures
- `search_logs` - Look for specific error patterns
- `get_latest_debug` - Trace execution flow

### For Data Model Work
**Use System Object Tools:**
- `get_system_object_definitions` - Understand available objects
- `search_system_object_attribute_definitions` - Find custom attributes
- `search_site_preferences` - Explore configuration options

### For Deployment Management
**Use Code Version Tools:**
- `get_code_versions` - View available code versions for deployment troubleshooting
- `activate_code_version` - Perform code-switch fixes and activate specific versions
- Useful for SCAPI endpoint registration issues and job deployment conflicts

---

## Next Steps

- 💡 **[Examples](examples)** - See real-world tool usage patterns
- 🐛 **[Troubleshooting](troubleshooting)** - Common tool issues and solutions
- 📖 **[AI Interface Setup](ai-interfaces)** - Configure your preferred AI assistant

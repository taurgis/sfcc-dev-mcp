# Instructions for Creating a Salesforce B2C Commerce (SFRA) Cartridge

This document provides instructions to create, configure, and deploy a new custom cartridge for Salesforce B2C Commerce using the Storefront Reference Architecture (SFRA).

**NOTE**: When doing this, also request best practices for controller creation from this MCP server. Additionally, consult the **Performance and Stability Best Practices** guide from this MCP server to ensure your cartridge follows performance optimization strategies and coding standards.

## 1. Core Principles

**Cartridge:** A cartridge is a self-contained module for code and data. It is the fundamental unit for extending functionality.

**Cartridge Path:** A colon-separated list of cartridge names that dictates the order of code execution. The path is searched from left to right, and the first resource found is used.

**Override Mechanism:** To customize functionality, create a new cartridge (e.g., app_custom_mybrand) and place it at the beginning of the cartridge path. This allows your custom files to override the base functionality without modifying the core app_storefront_base cartridge.

**Example Path:** `app_custom_mybrand:app_storefront_base`

## 2. Prerequisites

- **Git Client:** Installed and configured.
- **Node.js:** Version 18 is recommended for compatibility.
- **SFCC Sandbox:** Access to a sandbox instance, including Business Manager credentials.
- **GitHub Access:** Ability to clone SalesforceCommerceCloud repositories.

## 3. Environment Setup

Create a parent project directory.

Clone the following repositories as siblings inside the parent directory:

Note: This step is not necessary unless specifically asked for. You should only clone these if the user requests it, for most
projects, there is only a need for the new cartridge that is being built - but not the entire storefront reference architecture.

```bash
# Contains the base cartridge (app_storefront_base)
git clone git@github.com:SalesforceCommerceCloud/storefront-reference-architecture.git

# Contains build and deployment scripts
git clone git@github.com:SalesforceCommerceCloud/sgmf-scripts.git
```

Install dependencies:

```bash
cd storefront-reference-architecture
npm install
```

## 4. Cartridge File Structure

A new cartridge should be created using the provided scaffolding tool. The core structure is as follows:

```
package.json
.eslintrc.json
.eslintignore
.stylelintrc.json
.gitignore
README.md
dw.json    
webpack.config.js           
cartridges/
└── plugin_my_custom_cartridge/
    └── cartridge/
        ├── client/             
        │   └── default/
        │       ├── js/
        │       └── scss/
        ├── controllers/        
        ├── models/             
        ├── scripts/            
        └── templates/       
            └── default/
```

Optional but common directories:

- `cartridge/forms/default/`: XML form definitions.
- `cartridge/services/`: Definitions for external web service integrations.
- `cartridge/scripts/jobs/`: Scripts for automated tasks scheduled in Business Manager.
- `cartridge/properties/`: Localization string files (.properties).

## 5. Creating a New Cartridge

### Step 1: Generate the Cartridge Structure

!IMPORTANT!: Always do this step, don't attempt to create the cartridge structure manually. The MCP server ensures all necessary files and configurations are created correctly.

**Using MCP Server (Recommended)**
Use the `generate_cartridge_structure` tool from this MCP server to automatically create the cartridge structure:

```json
{
  "cartridgeName": "plugin_my_custom_cartridge",
  "targetPath": "/path/to/your/project",
  "fullProjectSetup": true
}
```

This tool will:
- Create all necessary configuration files (package.json, webpack.config.js, etc.)
- Set up the complete cartridge structure with proper organization
- Ensure the cartridge is created exactly where needed in your project structure
- Generate all required directories and files for a fully functional cartridge

## 6. "Hello, World" Example

### Step 1: Navigate to Your Project

After creating the cartridge structure, navigate to your project directory:

```bash
# If you kept the subdirectory structure:
cd plugin_my_custom_cartridge

# If you moved files to root level, you're already in the right place
```

### Step 2: Create the Controller

**File:** `cartridges/plugin_my_custom_cartridge/cartridge/controllers/Hello.js`

```javascript
'use strict';

var server = require('server');

// URL: /Hello-Show
server.get('Show', function (req, res, next) {
    res.render('hello/helloTemplate', {
        message: 'Hello from a custom cartridge!'
    });
    next();
});

module.exports = server.exports();
```

### Step 3: Create the ISML Template

**File:** `cartridges/plugin_my_custom_cartridge/cartridge/templates/default/hello/helloTemplate.isml`

```html
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<isdecorate template="common/layout/page">
    <isreplace name="main">
        <div class="container">
            <h1>Custom Page</h1>
            <p>${pdict.message}</p>
        </div>
    </isreplace>
</isdecorate>
```

### Step 4: Update Deployment Configuration

Ensure your `dw.json` file has the correct sandbox credentials (this file is automatically generated but needs your specific sandbox details).

## 7. Deployment and Registration

### Step 1: Upload the Cartridge

From the project root, run:

```bash
npm run uploadCartridge plugin_my_custom_cartridge
```

For continuous development, use `npm run watch`.

## 8. Naming Conventions & Best Practices

**Cartridge Naming:** Use standard prefixes.

- `app_custom_*`: Site-specific customizations.
- `int_*`: Third-party integrations.
- `bm_*`: Business Manager extensions.
- `plugin_*`: Reusable SFRA feature extensions.

**File Naming:** Controllers use PascalCase.js. Other JS files use camelCase.js.

**NEVER modify app_storefront_base or other base/plugin cartridges directly.**

**Extend, Don't Replace:** Use server.append() or server.prepend() to extend controllers. Avoid server.replace().

**Logic-less Templates:** Keep business logic out of ISML files. Use models to prepare data.

**Security:** Protect all state-changing POST requests with CSRF tokens. Properly encode all user-provided output to prevent XSS.

**Localization:** Use Resource.msg() in templates to fetch text from .properties files.

## 9. MCP Integration Workflow

When using this MCP server for cartridge development, follow this enhanced workflow:

1. **Generate Cartridge Structure**: Use the `generate_cartridge_structure` tool to create the initial cartridge with all necessary files and configurations
2. **Get Best Practices**: Use `get_best_practice_guide` with "sfra_controllers" for controller development patterns
3. **Search Documentation**: Use `search_sfcc_classes` and `get_sfcc_class_info` for API reference
4. **Validate Implementation**: Use `search_best_practices` to ensure your code follows security and performance guidelines
5. **Debug Issues**: Use log analysis tools to troubleshoot deployment or runtime issues

This integrated approach ensures your cartridge follows all best practices and leverages the full power of the SFCC development ecosystem with direct file generation capabilities.

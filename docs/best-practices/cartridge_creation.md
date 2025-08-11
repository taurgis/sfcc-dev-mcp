# Instructions for Creating a Salesforce B2C Commerce (SFRA) Cartridge

This document provides instructions to create, configure, and deploy a new custom cartridge for Salesforce B2C Commerce using the Storefront Reference Architecture (SFRA).

NOTE: When doing this, also request best practices for controller creation from this MCP server.

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
dw.json               
cartridges/
└── your_cartridge_name/
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

## 5. Configuration Files

Place these files in the project's root directory.

### dw.json (Deployment Credentials)

This file contains sandbox credentials. It must be added to .gitignore. This file lives in the root of the project.

```json
{
  "hostname": "your-sandbox-id.dx.commercecloud.salesforce.com",
  "username": "your.username@example.com",
  "password": "your-business-manager-password",
  "code-version": "sfra_dev_v1"
}
```

### package.json (Build Configuration)

This file manages dependencies and defines build scripts. The "paths" object is critical for the compiler to resolve imports across cartridges.

```json
{
  "name": "my-sfra-project",
  "version": "1.0.0",
  "scripts": {
    "compile:js": "sgmf-scripts --compile js",
    "compile:scss": "sgmf-scripts --compile css",
    "upload": "sgmf-scripts --upload",
    "uploadCartridge": "sgmf-scripts --uploadCartridge",
    "watch": "sgmf-scripts --watch"
  },
  "devDependencies": {
    "sgmf-scripts": "^2.4.1",
    "webpack": "^5.91.0"
  },
  "paths": {
    "base": "./storefront-reference-architecture/cartridges/app_storefront_base",
    "app_helloworld": "./cartridges/app_helloworld"
  }
}
```

## 6. "Hello, World" Example

### Step 1: Scaffold the Cartridge

From the project root, run:

```bash
node node_modules/sgmf-scripts/index.js --createCartridge app_helloworld
```

### Step 2: Create the Controller

**File:** `cartridges/app_helloworld/cartridge/controllers/Hello.js`

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

**File:** `cartridges/app_helloworld/cartridge/templates/default/hello/helloTemplate.isml`

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

### Step 4: Update package.json

Ensure the app_helloworld cartridge is added to the "paths" object in the root package.json file, as shown in the example in Section 5.

## 7. Deployment and Registration

### Step 1: Upload the Cartridge

From the project root, run:

```bash
npm run uploadCartridge app_helloworld
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

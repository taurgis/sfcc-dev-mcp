/**
 * Script Debugger Tool Schemas
 *
 * Defines the MCP tool for evaluating scripts on SFCC instances
 * using the Script Debugger API.
 */

export const SCRIPT_DEBUGGER_TOOLS = [
  {
    name: 'evaluate_script',
    description: `Execute JavaScript code on the SFCC instance for quick testing and POC validation.

This tool automates the entire workflow using the existing Default-Start endpoint:
1. Creates a debugger session
2. Sets a breakpoint on the Default.js controller (or custom file/line)
3. Triggers the Default-Start endpoint via HTTP
4. Evaluates your expression in the halted context
5. Resumes and cleans up

**Supports both SFRA and SiteGenesis** - automatically detects which storefront is deployed.

**Use cases:**
- Test SFCC API calls (e.g., ProductMgr, CustomerMgr)
- Validate business logic before implementing in a cartridge
- Quick POC to verify an approach works
- Debug data issues by querying objects directly

**Requirements:**
- SFCC instance with script debugging enabled (Administration > Development Setup)
- Business Manager user with "Modules - Script Debugger" functional permission
- The site must have app_storefront_base (SFRA) or app_storefront_controllers (SiteGenesis) in its cartridge path

**Example scripts:**
- \`var ProductMgr = require('dw/catalog/ProductMgr'); return ProductMgr.getProduct('12345')?.name;\`
- \`var Site = require('dw/system/Site'); return Site.current.ID;\`
- \`return JSON.stringify({test: 'hello'});\`

**Note:** Complex scripts with async operations may timeout. Keep scripts focused and synchronous.`,
    inputSchema: {
      type: 'object',
      properties: {
        script: {
          type: 'string',
          description: `The JavaScript code to execute on the SFCC instance. 

The script runs in a server-side context with access to all dw.* APIs.
The expression is evaluated in the context of a halted request.

Examples:
- "var ProductMgr = require('dw/catalog/ProductMgr'); return ProductMgr.getProduct('SKU123')?.name;"
- "var Site = require('dw/system/Site'); return Site.current.preferences.custom.myPreference;"
- "return 1 + 1;"`,
        },
        timeout: {
          type: 'number',
          description: 'Maximum time in milliseconds to wait for script execution (default: 30000). Increase for complex scripts.',
          default: 30000,
        },
        siteId: {
          type: 'string',
          description: 'The site ID to execute the script against (e.g., "RefArch", "RefArchGlobal").',
          default: 'RefArch',
        },
        locale: {
          type: 'string',
          description: 'Storefront locale segment to use when triggering the Default-Start request (default: "default"). If the instance supports locale-less trigger, it will be tried first and locale will be used as fallback.',
          default: 'default',
        },
        breakpointFile: {
          type: 'string',
          description: `Optional: Custom controller file path for the breakpoint. Use this if automatic detection fails.
Format: /{cartridge}/cartridge/controllers/{Controller}.js
Example: "/app_storefront_base/cartridge/controllers/Default.js"`,
        },
        breakpointLine: {
          type: 'number',
          description: 'Optional: Line number for the breakpoint. Required if breakpointFile is specified. Should be a line inside a route handler that executes on page load.',
        },
      },
      required: ['script'],
    },
  },
];

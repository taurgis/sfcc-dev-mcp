---
name: sfcc-hooks-registration
description: 'Register SFCC hooks via cartridge package.json and hooks.json. Use when adding hooks or troubleshooting hook registration.'
---

# SFCC Hooks Registration

## When to Use
- Adding new script hooks for a cartridge
- Fixing missing hook execution
- Verifying hook registration structure

## Procedure
1. Add a package.json at the top level of the cartridge (cartridges/<cartridge-name>/package.json).
2. Define the hooks path relative to that package.json:
   ```json
   {
     "hooks": "./cartridge/scripts/hooks.json"
   }
   ```
3. In hooks.json, map hook names to script files relative to hooks.json:
   ```json
   {
     "hooks": [
       {
         "name": "dw.order.calculate",
         "script": "./hooks/cart/calculate.js"
       }
     ]
   }
   ```
4. Export hook functions as CommonJS exports with the unqualified hook name (for example, `dw.order.calculate` uses `exports.calculate`).
5. Enable the **Salesforce Commerce Cloud API hook execution** feature switch in Business Manager for OCAPI/SCAPI hooks.
6. Ensure the cartridge is in the site cartridge path and upload the cartridge.

## Notes
- The hooks path is relative to the package.json location.
- The script path in hooks.json is relative to hooks.json itself.
- For Shopper API hooks, returning a value can skip the system implementation; return nothing when you want the default implementation to run.

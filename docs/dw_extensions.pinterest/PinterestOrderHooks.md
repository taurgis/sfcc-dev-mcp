## Package: dw.extensions.pinterest

# Class PinterestOrderHooks

## Inheritance Hierarchy

- dw.extensions.pinterest.PinterestOrderHooks

## Description

PinterestOrderHooks interface containing extension points for customizing Pinterest order status. These hooks are not executed in a transaction. The extension points (hook names), and the functions that are called by each extension point. A function must be defined inside a JavaScript source and must be exported. The script with the exported hook function must be located inside a site cartridge. Inside the site cartridge a 'package.json' file with a 'hooks' entry must exist. "hooks": "./hooks.json" The hooks entry links to a json file, relative to the 'package.json' file. This file lists all registered hooks inside the hooks property: "hooks": [ {"name": "dw.extensions.pinterest.order.getStatus", "script": "./hooks.ds"} ] A hook entry has a 'name' and a 'script' property. The 'name' contains the extension point, the hook name. The 'script' contains the script relative to the hooks file, with the exported hook function.

## Constants

## Properties

## Constructor Summary

## Method Summary

### getStatus

**Signature:** `getStatus(order : PinterestOrder) : Status`

Called to retrieve status for the given order.

## Method Detail

## Method Details

### getStatus

**Signature:** `getStatus(order : PinterestOrder) : Status`

**Description:** Called to retrieve status for the given order. Return a null status for unknown orders.

**Parameters:**

- `order`: the Pinterest order

**Returns:**

a non-null Status ends the hook execution

---
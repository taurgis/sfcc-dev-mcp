## Package: dw.extensions.pinterest

# Class PinterestFeedHooks

## Inheritance Hierarchy

- dw.extensions.pinterest.PinterestFeedHooks

## Description

PinterestFeedHooks interface containing extension points for customizing Pinterest export feeds. These hooks are not executed in a transaction. The extension points (hook names), and the functions that are called by each extension point. A function must be defined inside a JavaScript source and must be exported. The script with the exported hook function must be located inside a site cartridge. Inside the site cartridge a 'package.json' file with a 'hooks' entry must exist. "hooks": "./hooks.json" The hooks entry links to a json file, relative to the 'package.json' file. This file lists all registered hooks inside the hooks property: "hooks": [ {"name": "dw.extensions.pinterest.feed.transformProduct", "script": "./hooks.ds"} ] A hook entry has a 'name' and a 'script' property. The 'name' contains the extension point, the hook name. The 'script' contains the script relative to the hooks file, with the exported hook function.

## Constants

## Properties

## Constructor Summary

## Method Summary

### transformAvailability

**Signature:** `transformAvailability(product : Product, pinterestAvailability : PinterestAvailability) : Status`

Called after default transformation of given Demandware product to Pinterest availability as part of the availability feed export.

### transformProduct

**Signature:** `transformProduct(product : Product, pinterestProduct : PinterestProduct) : Status`

Called after default transformation of given Demandware product to Pinterest product as part of the catalog feed export.

## Method Detail

## Method Details

### transformAvailability

**Signature:** `transformAvailability(product : Product, pinterestAvailability : PinterestAvailability) : Status`

**Description:** Called after default transformation of given Demandware product to Pinterest availability as part of the availability feed export.

**Parameters:**

- `product`: the Demandware product
- `pinterestAvailability`: the Pinterest representation of the product availability

**Returns:**

a non-null Status ends the hook execution

---

### transformProduct

**Signature:** `transformProduct(product : Product, pinterestProduct : PinterestProduct) : Status`

**Description:** Called after default transformation of given Demandware product to Pinterest product as part of the catalog feed export.

**Parameters:**

- `product`: the Demandware product
- `pinterestProduct`: the Pinterest representation of the product

**Returns:**

a non-null Status ends the hook execution

---
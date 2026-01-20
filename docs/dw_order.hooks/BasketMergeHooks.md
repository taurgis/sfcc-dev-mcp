## Package: dw.order.hooks

# Class BasketMergeHooks

## Inheritance Hierarchy

- dw.order.hooks.BasketMergeHooks

## Description

This interface represents all script hooks that can be registered to merge baskets. It contains the extension points (hook names), and the functions that are called by each extension point. A function must be defined inside a JavaScript source and must be exported. The script with the exported hook function must be located inside a site cartridge. Inside the site cartridge a 'package.json' file with a 'hooks' entry must exist. "hooks": "./hooks.json" The hooks entry links to a json file, relative to the 'package.json' file. This file lists all registered hooks inside the hooks property: "hooks": [ {"name": "dw.order.mergeBasket", "script": "./mergeBasket.js"} ] A hook entry has a 'name' and a 'script' property. The 'name' contains the extension point, the hook name. The 'script' contains the script relative to the hooks file, with the exported hook function.

## Constants

## Properties

## Constructor Summary

## Method Summary

### mergeBasket

**Signature:** `mergeBasket(source : Basket, currentBasket : Basket) : Status`

Merges contents from a source basket (usually a former registered shopper's basket) to a destination basket (usually a former guest shopper basket that was transferred to the registered shopper upon login).

## Method Detail

## Method Details

### mergeBasket

**Signature:** `mergeBasket(source : Basket, currentBasket : Basket) : Status`

**Description:** Merges contents from a source basket (usually a former registered shopper's basket) to a destination basket (usually a former guest shopper basket that was transferred to the registered shopper upon login). In case of no implementation is registered, the default implementation is invoked. This method is automatically called for the following scenarios: After a successful call to the transfer Rest API with query parameter merge=true, whereby the guest and registered users, both had an active basket attached. In this scenario the registered shopper's basket will be the source of the merge and the transferred guest shopper's basket will be the destination.

**Parameters:**

- `source`: the basket from which data should be merged into the destination, can be null e.g. in case the former guest shopper did not create a basket
- `currentBasket`: the destination basket to merge data into

---
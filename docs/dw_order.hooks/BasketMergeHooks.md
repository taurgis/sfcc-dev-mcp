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

Merges content from a source basket (typically a former registered shopper's basket) into the current basket (usually a former guest shopper's basket that was transferred to the registered shopper).

## Method Detail

## Method Details

### mergeBasket

**Signature:** `mergeBasket(source : Basket, currentBasket : Basket) : Status`

**Description:** Merges content from a source basket (typically a former registered shopper's basket) into the current basket (usually a former guest shopper's basket that was transferred to the registered shopper). If no override script is registered, the system defaults to the platform's standard basket merging logic. This method is automatically invoked after a successful execution of the /transfer REST API with the query parameter merge=true, if either the guest or the registered users had baskets assigned. The registered shopper's basket will be the source for the merge, and the transferred guest shopper's basket will be the current basket.

**Parameters:**

- `source`: the basket from which data will be merged into the current basket. Will be null if the former guest shopper did not have an assigned basket.
- `currentBasket`: the current basket to merge data into

---
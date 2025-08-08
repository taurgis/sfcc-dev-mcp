## Package: dw.extensions.facebook

# Class FacebookFeedHooks

## Inheritance Hierarchy

- dw.extensions.facebook.FacebookFeedHooks

## Description

FacebookFeedHooks interface containing extension points for customizing Facebook export feeds. These hooks are not executed in a transaction. The extension points (hook names), and the functions that are called by each extension point. A function must be defined inside a JavaScript source and must be exported. The script with the exported hook function must be located inside a site cartridge. Inside the site cartridge a 'package.json' file with a 'hooks' entry must exist. "hooks": "./hooks.json" The hooks entry links to a json file, relative to the 'package.json' file. This file lists all registered hooks inside the hooks property: "hooks": [ {"name": "dw.extensions.facebook.feed.transformProduct", "script": "./hooks.ds"} ] A hook entry has a 'name' and a 'script' property. The 'name' contains the extension point, the hook name. The 'script' contains the script relative to the hooks file, with the exported hook function.

## Constants

## Properties

## Constructor Summary

## Method Summary

### transformProduct

**Signature:** `transformProduct(product : Product, facebookProduct : FacebookProduct, feedId : String) : Status`

Called after default transformation of given Demandware product to Facebook product as part of the catalog feed export.

## Method Detail

## Method Details

### transformProduct

**Signature:** `transformProduct(product : Product, facebookProduct : FacebookProduct, feedId : String) : Status`

**Description:** Called after default transformation of given Demandware product to Facebook product as part of the catalog feed export. To customize multiple feeds differently, for example if one is for Facebook Dynamic Ads and the other is for Instagram Commerce, use the feedId parameter to determine which feed is being exported. If the same customization should apply to all feeds, ignore the parameter.

**Parameters:**

- `product`: the Demandware product
- `facebookProduct`: the Facebook representation of the product
- `feedId`: the merchant-selected ID for the feed being exported

**Returns:**

a non-null Status ends the hook execution

---
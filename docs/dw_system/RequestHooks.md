## Package: dw.system

# Class RequestHooks

## Inheritance Hierarchy

- dw.system.RequestHooks

## Description

This class represents all script hooks that can be registered to receive notifications about storefront requests. It contains the extension points (hook names), and the functions that are called by each extension point. A function must be defined inside a JavaScript source and must be exported. The script with the exported hook function must be located inside a site cartridge. Inside the site cartridge a 'package.json' file with a 'hooks' entry must exist. "hooks": "./hooks.json" The hooks entry links to a json file, relative to the 'package.json' file. This file lists all registered hooks inside the hooks property: "hooks": [ {"name": "dw.system.request.onSession", "script": "./script.js"}, {"name": "dw.system.request.onRequest", "script": "./script.js"}, ] A hook entry has a 'name' and a 'script' property. The 'name' contains the extension point, the hook name. The 'script' contains the script relative to the hooks file, with the exported hook function.

## Constants

## Properties

## Constructor Summary

## Method Summary

### onRequest

**Signature:** `onRequest() : Status`

The function is called by extension point extensionPointOnRequest.

### onSession

**Signature:** `onSession() : Status`

The function is called by extension point extensionPointOnSession.

## Method Detail

## Method Details

### onRequest

**Signature:** `onRequest() : Status`

**Description:** The function is called by extension point extensionPointOnRequest. It is called when a storefront request was received from the client.

**Returns:**

Status.OK for success.Status.ERROR for error.

---

### onSession

**Signature:** `onSession() : Status`

**Description:** The function is called by extension point extensionPointOnSession. It is called when a new storefront session was started.

**Returns:**

Status.OK for success.Status.ERROR for error.

---
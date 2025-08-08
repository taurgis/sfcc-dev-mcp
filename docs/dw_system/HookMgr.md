## Package: dw.system

# Class HookMgr

## Inheritance Hierarchy

- Object
  - dw.system.HookMgr

## Description

This class provides functionality to call hooks. A hook is an extension point in the business logic, where you can register scripts to customize functionality.

## Constructor Summary

## Method Summary

### callHook

**Signature:** `static callHook(extensionPoint : String, function : String, args : Object...) : Object`

Calls a hook on base of the specified extensionPoint and function.

### hasHook

**Signature:** `static hasHook(extensionPoint : String) : boolean`

Checks whether a hook is registered or a system default implementation exists for this extension point.

## Method Detail

## Method Details

### callHook

**Signature:** `static callHook(extensionPoint : String, function : String, args : Object...) : Object`

**Description:** Calls a hook on base of the specified extensionPoint and function. If a hook throws an exception, then this method will also throw an exception. If no hook and no system default implementation is provided, then this method will return undefined. Sample: dw.system.HookMgr.callHook( "dw.order.calculate", "calculate", basket );

**Parameters:**

- `extensionPoint`: the extension point to call
- `function`: the script function to call
- `args`: the Array of function parameters

**Returns:**

the object returned by the hook or undefined

---

### hasHook

**Signature:** `static hasHook(extensionPoint : String) : boolean`

**Description:** Checks whether a hook is registered or a system default implementation exists for this extension point. extensionPoint refers to the same name used to register a script as implementation. With this method it's only possible to check for a whole script registered but it is not possible to check, whether an individual function is implemented. Sample: dw.system.HookMgr.hasHook( "dw.order.calculate" );

**Parameters:**

- `extensionPoint`: the extension point

**Returns:**

true, if a hook is registered or a default implementation exists, otherwise false

---
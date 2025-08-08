## Package: TopLevel

# Class Symbol

## Inheritance Hierarchy

- Object
  - Symbol

## Description

Symbol is a primitive data type that can serve as object properties. Symbol instance can be created explicitly or via a global registry, see for(String).

## Constants

## Properties

## Constructor Summary

Symbol() Creates a new symbol.

Symbol(description : String) Creates a new symbol.

## Method Summary

### for

**Signature:** `static for(key : String) : Symbol`

Obtains a symbol from the global registry.

### keyFor

**Signature:** `static keyFor(symbol : Symbol) : String`

Returns the key within the global symbol registry under which the given symbol is stored.

## Constructor Detail

## Method Detail

## Method Details

### for

**Signature:** `static for(key : String) : Symbol`

**Description:** Obtains a symbol from the global registry. If no symbol exists for the key within the registry a new symbol is created and stored in the global registry.

**API Versioned:**

From version 21.2.

**Parameters:**

- `key`: The key for a symbol within the global registry.

**Returns:**

The found or newly created symbol.

---

### keyFor

**Signature:** `static keyFor(symbol : Symbol) : String`

**Description:** Returns the key within the global symbol registry under which the given symbol is stored.

**Parameters:**

- `symbol`: The symbol to look for.

**Returns:**

The key for the given symbol if the symbol is known to the global registry, else return undefined.

---
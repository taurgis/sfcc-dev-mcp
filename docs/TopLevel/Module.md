## Package: TopLevel

# Class Module

## Inheritance Hierarchy

- Object
  - Module

## Description

CommonJS modules are JavaScript files that are loaded using the require(String) function. This function returns a module object, which wraps the script code from the file. Within a module implementation, the module object can be accessed via the module variable. A module has a unique absolute id. The same module may be resolved by require(String) for different path arguments, like relative paths (starting with "./" or "../"), or absolute paths. See the documentation of require for more details about the lookup procedure. Every module object has an exports property which can be used by the module implementation to expose its public functions or properties. Only functions and properties that are explicitly exported are accessible from other modules, all others are private and not visible. For convenience, the global exports variable is by default also initialized with the module.exports property of the current module. In the most simple case, module elements can be exposed by adding them to the exports object, like: // Greeting.js exports.sayHello = function() { return 'Hello World!'; }; This is equivalent to: // Greeting.js module.exports.sayHello = function() { return 'Hello World!'; }; With the above implementation, a caller (for example another module in the same directory) could call the module function like this: var message = require('./Greeting').sayHello(); It is also possible to replace the whole module exports object with a completely different value, for example with a function: // Greeting.js module.exports = function sayHello() { return 'Hi!'; } Now the result of require would be a function, which can be invoked directly like: var message = require('./Greeting')(); This construction can be used for exporting constructor functions, so that a module becomes something like a class: // Greeting.js function Greeting() { this.message = 'Hi!'; } Greeting.prototype.getMessage = function() { return this.message; } module.exports = Greeting; which would be used like: var Greeting = require('./Greeting'); var m = new Greeting().getMessage();

## Properties

### cartridge

**Type:** String

The name of the cartridge which contains the module.

### exports

**Type:** Object

The exports of the module.

### id

**Type:** String

The absolute, normalized id of the module, which uniquely identifies it. A call to the
 global.require(String) function with this id would resolve this module.

### superModule

**Type:** Module

The module (if exists) that is overridden by this module. The super module would have the same path as the
 current module but its code location would be checked later in the lookup sequence. This property is useful to
 reuse functionality implemented in overridden modules.

## Constructor Summary

## Method Summary
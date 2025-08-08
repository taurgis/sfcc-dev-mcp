## Package: dw.util

# Class Assert

## Inheritance Hierarchy

- Object
  - dw.util.Assert

## Description

The Assert class provides utility methods for assertion events.

## Constructor Summary

## Method Summary

### areEqual

**Signature:** `static areEqual(arg1 : Object, arg2 : Object) : void`

Propagates an assertion if the specified objects are not equal.

### areEqual

**Signature:** `static areEqual(arg1 : Object, arg2 : Object, msg : String) : void`

Propagates an assertion using the specified message if the specified objects are not equal.

### areSame

**Signature:** `static areSame(arg1 : Object, arg2 : Object) : void`

Propagates an assertion if the specified objects are not the same.

### areSame

**Signature:** `static areSame(arg1 : Object, arg2 : Object, msg : String) : void`

Propagates an assertion using the specified message if the specified objects are not the same.

### fail

**Signature:** `static fail() : void`

Propagates a failure assertion.

### fail

**Signature:** `static fail(msg : String) : void`

Propagates a failure assertion using the specified message.

### isEmpty

**Signature:** `static isEmpty(arg : Object) : void`

Propagates an assertion if the specified check does not evaluate to an empty object.

### isEmpty

**Signature:** `static isEmpty(arg : Object, msg : String) : void`

Propagates an assertion using the specified message if the specified check does not evaluate to an empty object.

### isFalse

**Signature:** `static isFalse(check : boolean) : void`

Propagates an assertion if the specified check does not evaluate to false.

### isFalse

**Signature:** `static isFalse(check : boolean, msg : String) : void`

Propagates an assertion using the specified message if the specified check does not evaluate to false.

### isInstanceOf

**Signature:** `static isInstanceOf(clazz : Object, arg : Object) : void`

Propagates an assertion if the specified object 'arg' is not an instance of the specified class 'clazz'.

### isInstanceOf

**Signature:** `static isInstanceOf(clazz : Object, arg : Object, msg : String) : void`

Propagates an assertion using the specified message if the specified object is not an instance of the specified class.

### isNotEmpty

**Signature:** `static isNotEmpty(arg : Object) : void`

Propagates an assertion if the specified object is empty.

### isNotEmpty

**Signature:** `static isNotEmpty(arg : Object, msg : String) : void`

Propagates an assertion using the specified message if the specified object is empty.

### isNotNull

**Signature:** `static isNotNull(arg : Object) : void`

Propagates an assertion if the specified object is null.

### isNotNull

**Signature:** `static isNotNull(arg : Object, msg : String) : void`

Propagates an assertion using the specified message if the specified object is null.

### isNull

**Signature:** `static isNull(arg : Object) : void`

Propagates an assertion if the specified object is not null.

### isNull

**Signature:** `static isNull(arg : Object, msg : String) : void`

Propagates an assertion using the specified message if the specified object is not null.

### isTrue

**Signature:** `static isTrue(check : boolean) : void`

Propagates an assertion if the specified check does not evaluate to true.

### isTrue

**Signature:** `static isTrue(check : boolean, msg : String) : void`

Propagates an assertion using the specified message if the specified check does not evaluate to true.

## Method Detail

## Method Details

### areEqual

**Signature:** `static areEqual(arg1 : Object, arg2 : Object) : void`

**Description:** Propagates an assertion if the specified objects are not equal.

**Parameters:**

- `arg1`: the first object to check.
- `arg2`: the second object to check.

---

### areEqual

**Signature:** `static areEqual(arg1 : Object, arg2 : Object, msg : String) : void`

**Description:** Propagates an assertion using the specified message if the specified objects are not equal.

**Parameters:**

- `arg1`: the first object to check.
- `arg2`: the second object to check.
- `msg`: the assertion message.

---

### areSame

**Signature:** `static areSame(arg1 : Object, arg2 : Object) : void`

**Description:** Propagates an assertion if the specified objects are not the same.

**Parameters:**

- `arg1`: the first object to check.
- `arg2`: the second object to check.

---

### areSame

**Signature:** `static areSame(arg1 : Object, arg2 : Object, msg : String) : void`

**Description:** Propagates an assertion using the specified message if the specified objects are not the same.

**Parameters:**

- `arg1`: the first object to check.
- `arg2`: the second object to check.
- `msg`: the assertion message.

---

### fail

**Signature:** `static fail() : void`

**Description:** Propagates a failure assertion.

---

### fail

**Signature:** `static fail(msg : String) : void`

**Description:** Propagates a failure assertion using the specified message.

**Parameters:**

- `msg`: the assertion message.

---

### isEmpty

**Signature:** `static isEmpty(arg : Object) : void`

**Description:** Propagates an assertion if the specified check does not evaluate to an empty object.

**Parameters:**

- `arg`: the object to check.

---

### isEmpty

**Signature:** `static isEmpty(arg : Object, msg : String) : void`

**Description:** Propagates an assertion using the specified message if the specified check does not evaluate to an empty object.

**Parameters:**

- `arg`: the object to check.
- `msg`: the assertion message.

---

### isFalse

**Signature:** `static isFalse(check : boolean) : void`

**Description:** Propagates an assertion if the specified check does not evaluate to false.

**Parameters:**

- `check`: the condition to check.

---

### isFalse

**Signature:** `static isFalse(check : boolean, msg : String) : void`

**Description:** Propagates an assertion using the specified message if the specified check does not evaluate to false.

**Parameters:**

- `check`: the condition to check.
- `msg`: the assertion message.

---

### isInstanceOf

**Signature:** `static isInstanceOf(clazz : Object, arg : Object) : void`

**Description:** Propagates an assertion if the specified object 'arg' is not an instance of the specified class 'clazz'. For example, the following call does not propagate an assertion: var test = new dw.util.HashMap(); dw.util.Assert.isInstanceOf(dw.util.HashMap, test); But the following call will propagate an assertion: var test = new dw.util.Set(); dw.util.Assert.isInstanceOf(dw.util.HashMap, test); Note that 'clazz' can only be a Demandware API Scripting class.

**Parameters:**

- `clazz`: the scripting class to use to check the object.
- `arg`: the object to check.

---

### isInstanceOf

**Signature:** `static isInstanceOf(clazz : Object, arg : Object, msg : String) : void`

**Description:** Propagates an assertion using the specified message if the specified object is not an instance of the specified class. For example, the following call does not propagate an assertion: var test = new dw.util.HashMap(); dw.util.Assert.isInstanceOf(dw.util.HashMap, test); But the following call will propagate an assertion: var test = new dw.util.Set(); dw.util.Assert.isInstanceOf(dw.util.HashMap, test); Note that 'clazz' can only be a Demandware API Scripting class.

**Parameters:**

- `clazz`: the scripting class to use to check the object.
- `arg`: the object to check.
- `msg`: the assertion message.

---

### isNotEmpty

**Signature:** `static isNotEmpty(arg : Object) : void`

**Description:** Propagates an assertion if the specified object is empty.

**Parameters:**

- `arg`: the object to check.

---

### isNotEmpty

**Signature:** `static isNotEmpty(arg : Object, msg : String) : void`

**Description:** Propagates an assertion using the specified message if the specified object is empty.

**Parameters:**

- `arg`: the object to check.
- `msg`: the assertion message.

---

### isNotNull

**Signature:** `static isNotNull(arg : Object) : void`

**Description:** Propagates an assertion if the specified object is null.

**Parameters:**

- `arg`: the object to check.

---

### isNotNull

**Signature:** `static isNotNull(arg : Object, msg : String) : void`

**Description:** Propagates an assertion using the specified message if the specified object is null.

**Parameters:**

- `arg`: the object to check.
- `msg`: the assertion message.

---

### isNull

**Signature:** `static isNull(arg : Object) : void`

**Description:** Propagates an assertion if the specified object is not null.

**Parameters:**

- `arg`: the object to check.

---

### isNull

**Signature:** `static isNull(arg : Object, msg : String) : void`

**Description:** Propagates an assertion using the specified message if the specified object is not null.

**Parameters:**

- `arg`: the object to check.
- `msg`: the assertion message.

---

### isTrue

**Signature:** `static isTrue(check : boolean) : void`

**Description:** Propagates an assertion if the specified check does not evaluate to true.

**Parameters:**

- `check`: the condition to check.

---

### isTrue

**Signature:** `static isTrue(check : boolean, msg : String) : void`

**Description:** Propagates an assertion using the specified message if the specified check does not evaluate to true.

**Parameters:**

- `check`: the condition to check.
- `msg`: the assertion message.

---
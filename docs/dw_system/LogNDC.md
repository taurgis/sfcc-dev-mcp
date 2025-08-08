## Package: dw.system

# Class LogNDC

## Inheritance Hierarchy

- Object
  - dw.system.LogNDC

## Description

A Nested Diagnostic Context, or NDC in short, is an instrument to distinguish interleaved log output from different sources. Log output is typically interleaved when a server handles multiple script calls near-simultaneously.

## Constructor Summary

## Method Summary

### peek

**Signature:** `peek() : String`

Looks at the last diagnostic context at the top of this NDC without removing it.

### pop

**Signature:** `pop() : String`

Clients should call this method before leaving a diagnostic context.

### push

**Signature:** `push(message : String) : void`

Push new diagnostic context information for the current script execution.

### remove

**Signature:** `remove() : void`

Remove the diagnostic context for this script call.

## Method Detail

## Method Details

### peek

**Signature:** `peek() : String`

**Description:** Looks at the last diagnostic context at the top of this NDC without removing it. The returned value is the value that was pushed last. If no context is available, then the empty string "" is returned.

**Returns:**

String The innermost diagnostic context.

---

### pop

**Signature:** `pop() : String`

**Description:** Clients should call this method before leaving a diagnostic context. The returned value is the value that was pushed last. If no context is available, then the empty string "" is returned. NOTE: The NDC is removed after every script execution.

**Returns:**

String The innermost diagnostic context.

---

### push

**Signature:** `push(message : String) : void`

**Description:** Push new diagnostic context information for the current script execution.

**Parameters:**

- `message`: - The new diagnostic context information.

---

### remove

**Signature:** `remove() : void`

**Description:** Remove the diagnostic context for this script call.

---
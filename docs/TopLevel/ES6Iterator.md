## Package: TopLevel

# Class ES6Iterator

## Inheritance Hierarchy

- ES6Iterator

## Description

This isn't a built-in type. It describes the properties an object must have in order to work as an iterator since ECMAScript 2015.

## Constructor Summary

## Method Summary

### next

**Signature:** `next() : Object`

Returns an iterator result object.

## Method Detail

## Method Details

### next

**Signature:** `next() : Object`

**Description:** Returns an iterator result object. An iterator result object can have two properties: done and value. If done is false or undefined, then the value property contains an iterator value. The value property may not be present if the value would be undefined. After a call that returns a result where done equals true, all subsequent calls must also return done as true.

---
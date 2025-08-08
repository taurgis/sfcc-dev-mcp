## Package: TopLevel

# Class Iterator

## Inheritance Hierarchy

- Object
  - Iterator

## Description

An Iterator is a special object that lets you access items from a collection one at a time, while keeping track of its current position within that sequence.

## Constructor Summary

Iterator(object : Object) Creates an Iterator instance for the specified object.

Iterator(object : Object, keysOnly : boolean) Creates an Iterator instance for the specified object's keys.

## Method Summary

### next

**Signature:** `next() : Object`

Returns the next item in the iterator.

## Constructor Detail

## Method Detail

## Method Details

### next

**Signature:** `next() : Object`

**Description:** Returns the next item in the iterator. If there are no items left, the StopIteration exception is thrown. You should generally use this method in the context of a try...catch block to handle the StopIteration case. There is no guaranteed ordering of the data.

**Returns:**

the next item in the iterator.

**See Also:**

StopIteration

---
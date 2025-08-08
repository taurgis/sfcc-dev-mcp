## Package: dw.web

# Class LoopIterator

## Inheritance Hierarchy

- Object
  - dw.util.Iterator
  - dw.web.LoopIterator

## Description

Iterator used in <ISLOOP> implementation. It defines properties used to determine loop status. LoopIterator object is assigned to variable declared in "status" attribute of the <ISLOOP> tag.

## Properties

### begin

**Type:** Number (Read Only)

Return begin iteration index. By default begin index is 0.

### count

**Type:** Number (Read Only)

Return iteration count, starting with 1.

### end

**Type:** Number (Read Only)

Return end iteration index. By default end index equals 'length - 1', provided that length is determined.
 If length cannot be determined end index is -1.

### even

**Type:** boolean (Read Only)

Identifies if count is an even value.

### first

**Type:** boolean (Read Only)

Identifies if the iterator is positioned at first iteratable item.

### index

**Type:** Number (Read Only)

Return iteration index, which is the position of the iterator in the underlying iteratable object.
 Index is 0-based and is calculated according the following formula: Index = (Count - 1) * Step.

### last

**Type:** boolean (Read Only)

Identifies if the iterator is positioned at last iteratable item.

### length

**Type:** Number (Read Only)

Return the length of the object. If length cannot be determined, -1 is returned.

### odd

**Type:** boolean (Read Only)

Identifies if count is an odd value.

### step

**Type:** Number (Read Only)

Return iterator step.

## Constructor Summary

## Method Summary

### getBegin

**Signature:** `getBegin() : Number`

Return begin iteration index.

### getCount

**Signature:** `getCount() : Number`

Return iteration count, starting with 1.

### getEnd

**Signature:** `getEnd() : Number`

Return end iteration index.

### getIndex

**Signature:** `getIndex() : Number`

Return iteration index, which is the position of the iterator in the underlying iteratable object.

### getLength

**Signature:** `getLength() : Number`

Return the length of the object.

### getStep

**Signature:** `getStep() : Number`

Return iterator step.

### isEven

**Signature:** `isEven() : boolean`

Identifies if count is an even value.

### isFirst

**Signature:** `isFirst() : boolean`

Identifies if the iterator is positioned at first iteratable item.

### isLast

**Signature:** `isLast() : boolean`

Identifies if the iterator is positioned at last iteratable item.

### isOdd

**Signature:** `isOdd() : boolean`

Identifies if count is an odd value.

## Method Detail

## Method Details

### getBegin

**Signature:** `getBegin() : Number`

**Description:** Return begin iteration index. By default begin index is 0.

**Returns:**

the begin iteration index.

---

### getCount

**Signature:** `getCount() : Number`

**Description:** Return iteration count, starting with 1.

**Returns:**

the iteration count.

---

### getEnd

**Signature:** `getEnd() : Number`

**Description:** Return end iteration index. By default end index equals 'length - 1', provided that length is determined. If length cannot be determined end index is -1.

---

### getIndex

**Signature:** `getIndex() : Number`

**Description:** Return iteration index, which is the position of the iterator in the underlying iteratable object. Index is 0-based and is calculated according the following formula: Index = (Count - 1) * Step.

**Returns:**

the iteration index.

---

### getLength

**Signature:** `getLength() : Number`

**Description:** Return the length of the object. If length cannot be determined, -1 is returned.

**Returns:**

the length of the object

---

### getStep

**Signature:** `getStep() : Number`

**Description:** Return iterator step.

**Returns:**

the iterator step.

---

### isEven

**Signature:** `isEven() : boolean`

**Description:** Identifies if count is an even value.

**Returns:**

true if count is even, false otherwise.

---

### isFirst

**Signature:** `isFirst() : boolean`

**Description:** Identifies if the iterator is positioned at first iteratable item.

**Returns:**

true if the iterator is at first item, false otherwise.

---

### isLast

**Signature:** `isLast() : boolean`

**Description:** Identifies if the iterator is positioned at last iteratable item.

**Returns:**

true if iterator is at last item, false otherwise.

---

### isOdd

**Signature:** `isOdd() : boolean`

**Description:** Identifies if count is an odd value.

**Returns:**

true if count is odd, false otherwise.

---
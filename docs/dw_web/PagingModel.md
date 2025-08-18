## Package: dw.web

# Class PagingModel

## Inheritance Hierarchy

- Object
  - dw.web.PagingModel

## Description

A page model is a helper class to apply a pages to a collection of elements or an iterator of elements and supports creating URLs for continued paging through the elements. The page model is intended to be initialized with the collection or iterator, than the paging position is applyed and than the elements are extracted with getPageElements(). In case the page model is initialized with a collection the page model can be reused multiple times.

## Constants

### DEFAULT_PAGE_SIZE

**Type:** Number = 10

The default page size.

### MAX_PAGE_SIZE

**Type:** Number = 2000

The maximum supported page size.

### PAGING_SIZE_PARAMETER

**Type:** String = "sz"

The URL Parameter used for the page size.

### PAGING_START_PARAMETER

**Type:** String = "start"

The URL parameter used for the start position.

## Properties

### count

**Type:** Number (Read Only)

The count of the number of items in the model.

### currentPage

**Type:** Number (Read Only)

The index number of the current page. The page
 counting starts with 0. The method also works with a miss-aligned
 start. In that case the start is always treated as the start of
 a page.

### empty

**Type:** boolean (Read Only)

Identifies if the model is empty.

### end

**Type:** Number (Read Only)

The index of the last element on the current page.

### maxPage

**Type:** Number (Read Only)

The maximum possible page number. Counting for pages starts
 with 0.  The method also works with a miss-aligned start. In that case
 the returned number might be higher than ((count-1) / pageSize).

### pageCount

**Type:** Number (Read Only)

The total page count. The method also works
 with a miss-aligned start. In that case the returned number might
 be higher than (count / pageSize).

### pageElements

**Type:** Iterator (Read Only)

An iterator that can be used to iterate through the elements of
 the current page.

 In case of a collection as the page models source, the method can be
 called multiple times. Each time a fresh iterator is returned.

 In case of an iterator as the page models source, the method must be
 called only once. The method will always return the same iterator,
 which means the method amy return an exhausted iterator.

### pageSize

**Type:** Number

The size of the page.

### start

**Type:** Number

The current start position from which iteration will start.

## Constructor Summary

PagingModel(elements : Iterator, count : Number) Constructs the PagingModel using the specified iterator and count value.

PagingModel(elements : Collection) Constructs the PagingModel using the specified collection.

## Method Summary

### appendPageSize

**Signature:** `static appendPageSize(url : URL, pageSize : Number) : URL`

Returns an URL containing the page size parameter appended to the specified url.

### appendPaging

**Signature:** `appendPaging(url : URL) : URL`

Returns an URL by appending the current page start position and the current page size to the URL.

### appendPaging

**Signature:** `appendPaging(url : URL, position : Number) : URL`

Returns an URL by appending the paging parameters for a desired page start position and the current page size to the specified url.

### getCount

**Signature:** `getCount() : Number`

Returns the count of the number of items in the model.

### getCurrentPage

**Signature:** `getCurrentPage() : Number`

Returns the index number of the current page.

### getEnd

**Signature:** `getEnd() : Number`

Returns the index of the last element on the current page.

### getMaxPage

**Signature:** `getMaxPage() : Number`

Returns the maximum possible page number.

### getPageCount

**Signature:** `getPageCount() : Number`

Returns the total page count.

### getPageElements

**Signature:** `getPageElements() : Iterator`

Returns an iterator that can be used to iterate through the elements of the current page.

### getPageSize

**Signature:** `getPageSize() : Number`

Returns the size of the page.

### getStart

**Signature:** `getStart() : Number`

Returns the current start position from which iteration will start.

### isEmpty

**Signature:** `isEmpty() : boolean`

Identifies if the model is empty.

### setPageSize

**Signature:** `setPageSize(pageSize : Number) : void`

Sets the size of the page.

### setStart

**Signature:** `setStart(start : Number) : void`

Sets the current start position from which iteration will start.

## Constructor Detail

## Method Detail

## Method Details

### appendPageSize

**Signature:** `static appendPageSize(url : URL, pageSize : Number) : URL`

**Description:** Returns an URL containing the page size parameter appended to the specified url. The name of the page size parameter is 'sz' (see PAGE_SIZE_PARAMETER). The start position parameter is not appended to the returned URL.

**Parameters:**

- `url`: the URL to append the page size parameter to.
- `pageSize`: the page size

**Returns:**

an URL that contains the page size parameter.

---

### appendPaging

**Signature:** `appendPaging(url : URL) : URL`

**Description:** Returns an URL by appending the current page start position and the current page size to the URL.

**Parameters:**

- `url`: the URL to append the current paging position to.

**Returns:**

an URL containing the current paging position.

---

### appendPaging

**Signature:** `appendPaging(url : URL, position : Number) : URL`

**Description:** Returns an URL by appending the paging parameters for a desired page start position and the current page size to the specified url. The name of the page start position parameter is 'start' (see PAGING_START_PARAMETER) and the page size parameter is 'sz' (see PAGE_SIZE_PARAMETER).

**Parameters:**

- `url`: the URL to append the paging parameter to.
- `position`: the start position.

**Returns:**

an URL that contains the paging parameters.

---

### getCount

**Signature:** `getCount() : Number`

**Description:** Returns the count of the number of items in the model.

**Returns:**

the count of the number of items in the model.

---

### getCurrentPage

**Signature:** `getCurrentPage() : Number`

**Description:** Returns the index number of the current page. The page counting starts with 0. The method also works with a miss-aligned start. In that case the start is always treated as the start of a page.

**Returns:**

the index number of the current page.

---

### getEnd

**Signature:** `getEnd() : Number`

**Description:** Returns the index of the last element on the current page.

**Returns:**

the index of the last element on the current page.

---

### getMaxPage

**Signature:** `getMaxPage() : Number`

**Description:** Returns the maximum possible page number. Counting for pages starts with 0. The method also works with a miss-aligned start. In that case the returned number might be higher than ((count-1) / pageSize).

**Returns:**

the maximum possible page number.

---

### getPageCount

**Signature:** `getPageCount() : Number`

**Description:** Returns the total page count. The method also works with a miss-aligned start. In that case the returned number might be higher than (count / pageSize).

**Returns:**

the total page count.

---

### getPageElements

**Signature:** `getPageElements() : Iterator`

**Description:** Returns an iterator that can be used to iterate through the elements of the current page. In case of a collection as the page models source, the method can be called multiple times. Each time a fresh iterator is returned. In case of an iterator as the page models source, the method must be called only once. The method will always return the same iterator, which means the method amy return an exhausted iterator.

**Returns:**

an iterator that you use to iterate through the elements of the current page.

---

### getPageSize

**Signature:** `getPageSize() : Number`

**Description:** Returns the size of the page.

**Returns:**

the size of the page.

---

### getStart

**Signature:** `getStart() : Number`

**Description:** Returns the current start position from which iteration will start.

**Returns:**

the current start position from which iteration will start.

---

### isEmpty

**Signature:** `isEmpty() : boolean`

**Description:** Identifies if the model is empty.

**Returns:**

true if the model is empty, false otherwise.

---

### setPageSize

**Signature:** `setPageSize(pageSize : Number) : void`

**Description:** Sets the size of the page. The page size must be greater or equal to 1.

**Parameters:**

- `pageSize`: the size of the page.

---

### setStart

**Signature:** `setStart(start : Number) : void`

**Description:** Sets the current start position from which iteration will start.

**Parameters:**

- `start`: the current start position from which iteration will start.

---
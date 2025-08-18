## Package: dw.util

# Class FilteringCollection

## Inheritance Hierarchy

- Object
  - dw.util.Collection
  - dw.util.FilteringCollection

## Description

FilteringCollection is an extension of Collection which provides possibilities to filter the elements to return a new FilteringCollection with a filtered set of elements sort the elements to return a new FilteringCollection with a defined sort order transform the elements to return a new FilteringCollection containing related elements provide a map of the elements against a predefined key Usage - In the current version each FilteringCollection provides a set of predefined qualifier constants which can be passed into the select(Object) method used to filter the elements. Generally qualifiers have the prefix QUALIFIER_. A second method sort(Object) is used to create a new instance with a different element ordering, which takes an orderB< constant. Generally orderBys have the prefix ORDERBY_: examples are ShippingOrder.ORDERBY_ITEMID, ShippingOrder.ORDERBY_ITEMPOSITION, and ORDERBY_REVERSE can be used to provide a FilteringCollection with the reverse ordering. An example with method ShippingOrder.getItems(): var allItems : FilteringCollection = shippingOrder.items; var productItems : FilteringCollection = allItems.select(ShippingOrder.QUALIFIER_PRODUCTITEMS); var serviceItems : FilteringCollection = allItems.select(ShippingOrder.QUALIFIER_SERVICEITEMS); var byPosition : FilteringCollection = productItems.sort(ShippingOrder.ORDERBY_ITEMPOSITION); var revByPosition: FilteringCollection = byPosition.sort(FilteringCollection.ORDERBY_REVERSE); var mapByItemID : Map = allItems.asMap();

## Constants

### ORDERBY_REVERSE

**Type:** Object

Pass this orderBy with the sort(Object) method to obtain a new FilteringCollection with the reversed sort order. Only use on a FilteringCollection which has been previously sorted.

## Properties

## Constructor Summary

## Method Summary

### asMap

**Signature:** `asMap() : Map`

Returns a Map containing the elements of this FilteringCollection against a predefined key.

### select

**Signature:** `select(qualifier : Object) : FilteringCollection`

Select a new FilteringCollection instance by passing a predefined qualifier as an argument to this method.

### sort

**Signature:** `sort(orderBy : Object) : FilteringCollection`

Select a new FilteringCollection instance by passing a predefined orderBy as an argument to this method.

## Method Detail

## Method Details

### asMap

**Signature:** `asMap() : Map`

**Description:** Returns a Map containing the elements of this FilteringCollection against a predefined key. The key used is documented in the method returning the FilteringCollection and is typically the ItemID assigned to an element in the collection.

**Returns:**

a Map containing the elements of this FilteringCollection against a predefined key.

---

### select

**Signature:** `select(qualifier : Object) : FilteringCollection`

**Description:** Select a new FilteringCollection instance by passing a predefined qualifier as an argument to this method. See FilteringCollection.

**Parameters:**

- `qualifier`: possible qualifiers are documented in the method returning the FilteringCollection

**Returns:**

a new FilteringCollection instance

---

### sort

**Signature:** `sort(orderBy : Object) : FilteringCollection`

**Description:** Select a new FilteringCollection instance by passing a predefined orderBy as an argument to this method. See FilteringCollection.

**Parameters:**

- `orderBy`: possible orderBys are documented in the method returning the FilteringCollection

**Returns:**

a new FilteringCollection instance

---
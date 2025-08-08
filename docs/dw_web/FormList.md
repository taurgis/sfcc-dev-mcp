## Package: dw.web

# Class FormList

## Inheritance Hierarchy

- Object
  - dw.web.FormElement
  - dw.web.FormGroup
    - dw.web.FormList

## Description

Represents a list of forms.

## Properties

### selectManyItems

**Type:** List (Read Only)

The selected list items if the list is
 configured to support selection of items.

### selectManyObjects

**Type:** List (Read Only)

A list of all selected objects if the list is configured
 to support the selection of items. The objects are the objects that were
 bound to each row.

### selectOneItem

**Type:** FormListItem (Read Only)

The default list item if the list is configured to
 support the selection of a default item.

### selectOneObject

**Type:** Object (Read Only)

The selected object if the list is configured to
 support the selection of a default item. The object is the object
 bound to the item.

## Constructor Summary

## Method Summary

### getSelectManyItems

**Signature:** `getSelectManyItems() : List`

returns the selected list items if the list is configured to support selection of items.

### getSelectManyObjects

**Signature:** `getSelectManyObjects() : List`

Returns a list of all selected objects if the list is configured to support the selection of items.

### getSelectOneItem

**Signature:** `getSelectOneItem() : FormListItem`

Returns the default list item if the list is configured to support the selection of a default item.

### getSelectOneObject

**Signature:** `getSelectOneObject() : Object`

Returns the selected object if the list is configured to support the selection of a default item.

## Method Detail

## Method Details

### getSelectManyItems

**Signature:** `getSelectManyItems() : List`

**Description:** returns the selected list items if the list is configured to support selection of items.

**Returns:**

a List of FormListItem elements or null if no selection was configured for the form.

---

### getSelectManyObjects

**Signature:** `getSelectManyObjects() : List`

**Description:** Returns a list of all selected objects if the list is configured to support the selection of items. The objects are the objects that were bound to each row.

**Returns:**

a List of objects or null if no selection was configured for the form.

---

### getSelectOneItem

**Signature:** `getSelectOneItem() : FormListItem`

**Description:** Returns the default list item if the list is configured to support the selection of a default item.

**Returns:**

the default FormListItem elements or null if no selection was configured

---

### getSelectOneObject

**Signature:** `getSelectOneObject() : Object`

**Description:** Returns the selected object if the list is configured to support the selection of a default item. The object is the object bound to the item.

**Returns:**

the selected object.

---
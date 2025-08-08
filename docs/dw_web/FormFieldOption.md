## Package: dw.web

# Class FormFieldOption

## Inheritance Hierarchy

- Object
  - dw.web.FormFieldOption

## Description

Represents an option for a form field.

## Properties

### checked

**Type:** boolean (Read Only)

Identifies if this option is checked.

### htmlValue

**Type:** String (Read Only)

The value for the HTML value attribute of a HTML option element.

### label

**Type:** String

The value for the HTML label attribute of the HTML option element.
 If not specified in the form option definition the label is identical with
 the string representation of option value (see getValue()).

### object

**Type:** Object (Read Only)

The object that was bound to this option value.

### optionId

**Type:** String (Read Only)

The ID of the option. This is an internal ID used to uniquely
 reference this option. If not specified in the form option definition
 the ID is identical with the string representation of the option value
 (see getValue()).

### parent

**Type:** FormField (Read Only)

The parent, which is a field element.

### selected

**Type:** boolean (Read Only)

Identifies if this option is selected.

### value

**Type:** Object (Read Only)

The actual value associated with this option. This value is formatted
 and than returned as HTML value with the method getHtmlValue().

## Constructor Summary

## Method Summary

### getHtmlValue

**Signature:** `getHtmlValue() : String`

Returns the value for the HTML value attribute of a HTML option element.

### getLabel

**Signature:** `getLabel() : String`

Returns the value for the HTML label attribute of the HTML option element.

### getObject

**Signature:** `getObject() : Object`

Returns the object that was bound to this option value.

### getOptionId

**Signature:** `getOptionId() : String`

Returns the ID of the option.

### getParent

**Signature:** `getParent() : FormField`

The parent, which is a field element.

### getValue

**Signature:** `getValue() : Object`

The actual value associated with this option.

### isChecked

**Signature:** `isChecked() : boolean`

Identifies if this option is checked.

### isSelected

**Signature:** `isSelected() : boolean`

Identifies if this option is selected.

### setLabel

**Signature:** `setLabel(label : String) : void`

Sets the label attribute for this option.

## Method Detail

## Method Details

### getHtmlValue

**Signature:** `getHtmlValue() : String`

**Description:** Returns the value for the HTML value attribute of a HTML option element.

**Returns:**

the value for the HTML value attribute of a HTML option element.

---

### getLabel

**Signature:** `getLabel() : String`

**Description:** Returns the value for the HTML label attribute of the HTML option element. If not specified in the form option definition the label is identical with the string representation of option value (see getValue()).

**Returns:**

the value for the HTML label attribute of the HTML option element.

---

### getObject

**Signature:** `getObject() : Object`

**Description:** Returns the object that was bound to this option value.

**Returns:**

the object that was bound to this option value.

---

### getOptionId

**Signature:** `getOptionId() : String`

**Description:** Returns the ID of the option. This is an internal ID used to uniquely reference this option. If not specified in the form option definition the ID is identical with the string representation of the option value (see getValue()).

**Returns:**

the ID of the option.

---

### getParent

**Signature:** `getParent() : FormField`

**Description:** The parent, which is a field element.

**Returns:**

the parent form field.

---

### getValue

**Signature:** `getValue() : Object`

**Description:** The actual value associated with this option. This value is formatted and than returned as HTML value with the method getHtmlValue().

**Returns:**

the value associated with this option

---

### isChecked

**Signature:** `isChecked() : boolean`

**Description:** Identifies if this option is checked.

**Returns:**

true if this option is checked, false otherwise.

---

### isSelected

**Signature:** `isSelected() : boolean`

**Description:** Identifies if this option is selected.

**Returns:**

true if this option is selected, false otherwise.

---

### setLabel

**Signature:** `setLabel(label : String) : void`

**Description:** Sets the label attribute for this option.

**Parameters:**

- `label`: the label value.

---
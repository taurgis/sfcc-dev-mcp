## Package: dw.web

# Class FormAction

## Inheritance Hierarchy

- Object
  - dw.web.FormElement
  - dw.web.FormAction

## Description

The FormAction class represents the action in form instance hierarchy.

## Properties

### description

**Type:** String (Read Only)

The optional description for the action. The description could be used
 as tooltip for the action.

### label

**Type:** String (Read Only)

The optional label for the action. The label would be typically used
 as button text.

### object

**Type:** Object (Read Only)

The object that was bound to the form in which the action
 is contained. The method is a convenience method for getParent().getObject().
 In most cases this is actually the object for which
 the specific action is triggered.

### submitted

**Type:** boolean (Read Only)

Identifies if the form action was submitted from
 the client to the server.

### triggered

**Type:** boolean (Read Only)

Identifies that this action is triggerd. An
 action is only triggered if it was submitted and the constraints, regarding
 a valid form, are met.

### x

**Type:** Number (Read Only)

In case of an image button, returns the x coordinate of the last click.

### y

**Type:** Number (Read Only)

In case of an image button, returns the y coordinate of the last click.

## Constructor Summary

## Method Summary

### getDescription

**Signature:** `getDescription() : String`

Returns the optional description for the action.

### getLabel

**Signature:** `getLabel() : String`

Returns the optional label for the action.

### getObject

**Signature:** `getObject() : Object`

Returns the object that was bound to the form in which the action is contained.

### getX

**Signature:** `getX() : Number`

In case of an image button, returns the x coordinate of the last click.

### getY

**Signature:** `getY() : Number`

In case of an image button, returns the y coordinate of the last click.

### isSubmitted

**Signature:** `isSubmitted() : boolean`

Identifies if the form action was submitted from the client to the server.

### isTriggered

**Signature:** `isTriggered() : boolean`

Identifies that this action is triggerd.

## Method Detail

## Method Details

### getDescription

**Signature:** `getDescription() : String`

**Description:** Returns the optional description for the action. The description could be used as tooltip for the action.

**Returns:**

the optional description for the action.

---

### getLabel

**Signature:** `getLabel() : String`

**Description:** Returns the optional label for the action. The label would be typically used as button text.

**Returns:**

the optional label for the action.

---

### getObject

**Signature:** `getObject() : Object`

**Description:** Returns the object that was bound to the form in which the action is contained. The method is a convenience method for getParent().getObject(). In most cases this is actually the object for which the specific action is triggered.

**Returns:**

the object that was bound to the form in which the action is contained.

---

### getX

**Signature:** `getX() : Number`

**Description:** In case of an image button, returns the x coordinate of the last click.

**Returns:**

the x coordinate of the last click.

---

### getY

**Signature:** `getY() : Number`

**Description:** In case of an image button, returns the y coordinate of the last click.

**Returns:**

the y coordinate of the last click.

---

### isSubmitted

**Signature:** `isSubmitted() : boolean`

**Description:** Identifies if the form action was submitted from the client to the server.

**Returns:**

true if the form action was submitted, false otherwise.

---

### isTriggered

**Signature:** `isTriggered() : boolean`

**Description:** Identifies that this action is triggerd. An action is only triggered if it was submitted and the constraints, regarding a valid form, are met.

**Returns:**

true if the action is triggered, false otherwise.

---
## Package: dw.web

# Class FormGroup

## Inheritance Hierarchy

- Object
  - dw.web.FormElement
  - dw.web.FormGroup

## Description

The class is the central class within the whole form handling. It is the container element for fields and other form elements. A form group can contain other forms, also called sub-forms. Access to the elements of a form is provided via an index based access or via an associative array access. For example, the field "firstname" can be accessed with the expression "myform.firstname".

## Properties

### childCount

**Type:** Number (Read Only)

The number of elements in the form.

### error

**Type:** String (Read Only)

A form-wide error message. If no error message
 is present the method returns null.

### object

**Type:** Object (Read Only)

The object that was bound to this form group.

### submittedAction

**Type:** FormAction (Read Only)

The action that was submitted with the last request. The action is
 set independent whether the form must be valid for this action. The method
 returns null if no action at all was submitted with the last request for this
 form group.

### triggeredAction

**Type:** FormAction (Read Only)

The action that was triggered with the last request. An action is
 only marked as triggered if the constraints regarding form validation are
 meet. The method returns null if no action was marked as triggered.

## Constructor Summary

## Method Summary

### accept

**Signature:** `accept() : void`

The method copies the value from a form into the object, which was previously bound to the form.

### copyFrom

**Signature:** `copyFrom(obj : Object) : void`

The method updates the form with the values from the given object. The method call is basically equivalent to the pipelet UpdateFormWithObject. The method not only copies the value, it also binds the object to the form.

### copyTo

**Signature:** `copyTo(obj : Object) : void`

The method updates the object with the values from the form. The method call is basically equivalent to the pipelet UpdateObjectWithForm. The method needs a submitted form.

### getChildCount

**Signature:** `getChildCount() : Number`

Returns the number of elements in the form.

### getError

**Signature:** `getError() : String`

Returns a form-wide error message.

### getObject

**Signature:** `getObject() : Object`

The object that was bound to this form group.

### getSubmittedAction

**Signature:** `getSubmittedAction() : FormAction`

Returns the action that was submitted with the last request.

### getTriggeredAction

**Signature:** `getTriggeredAction() : FormAction`

Returns the action that was triggered with the last request.

## Method Detail

## Method Details

### accept

**Signature:** `accept() : void`

**Description:** The method copies the value from a form into the object, which was previously bound to the form. The method is equivalent to the pipelet AcceptForm. This method is equivalent to the call formgroup.copyFrom( formgroup.object ).

---

### copyFrom

**Signature:** `copyFrom(obj : Object) : void`

**Description:** The method updates the form with the values from the given object. The method call is basically equivalent to the pipelet UpdateFormWithObject. The method not only copies the value, it also binds the object to the form. Binding means that the form keeps the information from which objects the values were taken. This can be used for two purposes: for lists it makes it easier in the code to find the associated object, for example in case of a related action, and it allows to copy back the values from the form into the object (see accept()). Because of this bind behavior, the operation is also sometimes called a bind-operation.

**Parameters:**

- `obj`: the object from, which the values are read

---

### copyTo

**Signature:** `copyTo(obj : Object) : void`

**Description:** The method updates the object with the values from the form. The method call is basically equivalent to the pipelet UpdateObjectWithForm. The method needs a submitted form. The copyTo call is delegated to the form fields. Each form field than checks if its value was submitted as part of the form: If this is true, the object gets updated with the form field value. If this is false, the object will not be updated. This is the reason why you cannot copy values from one object into another object by using copyFrom(Object) and copyTo(Object) within the same request (e.g. by one call to a script or controller).

**Parameters:**

- `obj`: the object, which is updated from the form

---

### getChildCount

**Signature:** `getChildCount() : Number`

**Description:** Returns the number of elements in the form.

**Returns:**

the number of elements in the form.

---

### getError

**Signature:** `getError() : String`

**Description:** Returns a form-wide error message. If no error message is present the method returns null.

**Returns:**

a form-wide error message or null.

---

### getObject

**Signature:** `getObject() : Object`

**Description:** The object that was bound to this form group.

**Returns:**

the bound object.

---

### getSubmittedAction

**Signature:** `getSubmittedAction() : FormAction`

**Description:** Returns the action that was submitted with the last request. The action is set independent whether the form must be valid for this action. The method returns null if no action at all was submitted with the last request for this form group.

**Returns:**

the action that was submitted with the last request or null.

---

### getTriggeredAction

**Signature:** `getTriggeredAction() : FormAction`

**Description:** Returns the action that was triggered with the last request. An action is only marked as triggered if the constraints regarding form validation are meet. The method returns null if no action was marked as triggered.

**Returns:**

the action that was triggered with the last request.

---
## Package: dw.object

# Class Note

## Inheritance Hierarchy

- Object
  - dw.object.Note

## Description

Represents a note that can be attached to any persistent object that supports this feature.

## Properties

### createdBy

**Type:** String (Read Only)

Return the login ID of user that is stored in the session at the time
 the note is created.

### creationDate

**Type:** Date (Read Only)

Return the date and time that the note was created.  This is usually
 set by the system, but may be specified if the note is generated
 via an import.

### subject

**Type:** String (Read Only)

Return the subject of the note.

### text

**Type:** String (Read Only)

Return the text of the note.

## Constructor Summary

## Method Summary

### getCreatedBy

**Signature:** `getCreatedBy() : String`

Return the login ID of user that is stored in the session at the time the note is created.

### getCreationDate

**Signature:** `getCreationDate() : Date`

Return the date and time that the note was created.

### getSubject

**Signature:** `getSubject() : String`

Return the subject of the note.

### getText

**Signature:** `getText() : String`

Return the text of the note.

## Method Detail

## Method Details

### getCreatedBy

**Signature:** `getCreatedBy() : String`

**Description:** Return the login ID of user that is stored in the session at the time the note is created.

**Returns:**

the username.

---

### getCreationDate

**Signature:** `getCreationDate() : Date`

**Description:** Return the date and time that the note was created. This is usually set by the system, but may be specified if the note is generated via an import.

**Returns:**

the creation date.

---

### getSubject

**Signature:** `getSubject() : String`

**Description:** Return the subject of the note.

**Returns:**

the subject.

---

### getText

**Signature:** `getText() : String`

**Description:** Return the text of the note.

**Returns:**

the text.

---
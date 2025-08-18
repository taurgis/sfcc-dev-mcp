## Package: dw.net

# Class Mail

## Inheritance Hierarchy

- Object
  - dw.net.Mail

## Description

This class is used to send an email with either plain text or MimeEncodedText content. Recipient data (from, to, cc, bcc) and subject are specified using setter methods. When the send() method is invoked, the email is put into an internal queue and sent asynchronously. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk. The following example script sends an email with MimeEncodedText content: function sendMail() { var template: Template = new dw.util.Template("myTemplate.isml"); var o: Map = new dw.util.HashMap(); o.put("customer","customer"); o.put("product","product"); var content: MimeEncodedText = template.render(o); var mail: Mail = new dw.net.Mail(); mail.addTo("to@example.org"); mail.setFrom("from@example.org"); mail.setSubject("Example Email"); mail.setContent(content); mail.send();//returns either Status.ERROR or Status.OK, mail might not be sent yet, when this method returns } See Sending email via scripts or hooks in the documentation for additional examples.

## Properties

### bcc

**Type:** List

Gets the bcc address List.

### cc

**Type:** List

Gets the cc address List.

### from

**Type:** String

Gets the email address to use as the from address for the
 email.

### replyTo

**Type:** List (Read Only)

Gets the replyTo address List.

### subject

**Type:** String

Gets the subject of the email.

### to

**Type:** List

Gets the to address List where the email is sent.

## Constructor Summary

Mail()

## Method Summary

### addBcc

**Signature:** `addBcc(bcc : String) : Mail`

Adds an address to the bcc List.

### addCc

**Signature:** `addCc(cc : String) : Mail`

Adds an address to the cc List.

### addReplyTo

**Signature:** `addReplyTo(replyTo : String) : Mail`

Adds an address to the replyTo List.

### addTo

**Signature:** `addTo(to : String) : Mail`

Adds an address to the to address List.

### getBcc

**Signature:** `getBcc() : List`

Gets the bcc address List.

### getCc

**Signature:** `getCc() : List`

Gets the cc address List.

### getFrom

**Signature:** `getFrom() : String`

Gets the email address to use as the from address for the email.

### getReplyTo

**Signature:** `getReplyTo() : List`

Gets the replyTo address List.

### getSubject

**Signature:** `getSubject() : String`

Gets the subject of the email.

### getTo

**Signature:** `getTo() : List`

Gets the to address List where the email is sent.

### send

**Signature:** `send() : Status`

prepares an email that is queued to the internal mail system for delivery.

### setBcc

**Signature:** `setBcc(bcc : List) : Mail`

Sets the bcc address List.

### setCc

**Signature:** `setCc(cc : List) : Mail`

Sets the cc address List where the email is sent.

### setContent

**Signature:** `setContent(content : String) : Mail`

Mandatory Sets the email content.

### setContent

**Signature:** `setContent(content : String, mimeType : String, encoding : String) : Mail`

Mandatory Sets the email content, MIME type, and encoding.

### setContent

**Signature:** `setContent(mimeEncodedText : MimeEncodedText) : Mail`

Mandatory Uses MimeEncodedText to set the content, MIME type and encoding.

### setFrom

**Signature:** `setFrom(from : String) : Mail`

Mandatory Sets the sender address for this email.

### setListUnsubscribe

**Signature:** `setListUnsubscribe(listUnsubscribe : String) : Mail`

Sets the List-Unsubscribe header value to work with List-Unsubscribe-Post to allow integration with an externally-managed mailing list.

### setListUnsubscribePost

**Signature:** `setListUnsubscribePost(listUnsubscribePost : String) : Mail`

Sets the List-Unsubscribe-Post header value.

### setSubject

**Signature:** `setSubject(subject : String) : Mail`

Mandatory sets the subject for the email.

### setTo

**Signature:** `setTo(to : List) : Mail`

Sets the to address List where the email is sent.

### validateAddress

**Signature:** `static validateAddress(address : String) : boolean`

Validates the address that is sent as parameter.

## Constructor Detail

## Method Detail

## Method Details

### addBcc

**Signature:** `addBcc(bcc : String) : Mail`

**Description:** Adds an address to the bcc List. Address must conform to the RFC822 standard.

**Parameters:**

- `bcc`: new bcc address to add to bcc address List.

**Returns:**

this Mail object.

---

### addCc

**Signature:** `addCc(cc : String) : Mail`

**Description:** Adds an address to the cc List. The address must conform to RFC822 standard.

**Parameters:**

- `cc`: new cc address to be added to cc address List.

**Returns:**

this Mail object.

---

### addReplyTo

**Signature:** `addReplyTo(replyTo : String) : Mail`

**Description:** Adds an address to the replyTo List. Address must conform to the RFC822 standard.

**Parameters:**

- `replyTo`: new replyTo address to add to replyTo address List.

**Returns:**

this Mail object.

**Throws:**

IllegalArgumentException - if the email address is invalid

---

### addTo

**Signature:** `addTo(to : String) : Mail`

**Description:** Adds an address to the to address List. The address must conform to the RFC822 standard.

**Parameters:**

- `to`: email address to add to the to address List.

**Returns:**

this Mail object.

---

### getBcc

**Signature:** `getBcc() : List`

**Description:** Gets the bcc address List.

**Returns:**

bcc address List or empty List if no bcc addresses are set.

---

### getCc

**Signature:** `getCc() : List`

**Description:** Gets the cc address List.

**Returns:**

cc address List or empty List if no cc addresses are set.

---

### getFrom

**Signature:** `getFrom() : String`

**Description:** Gets the email address to use as the from address for the email.

**Returns:**

the from address for this mail or null if no from address is set yet.

---

### getReplyTo

**Signature:** `getReplyTo() : List`

**Description:** Gets the replyTo address List.

**Returns:**

replyTo address List or empty List if no replyTo addresses are set.

---

### getSubject

**Signature:** `getSubject() : String`

**Description:** Gets the subject of the email.

**Returns:**

subject or null if no subject is set yet.

---

### getTo

**Signature:** `getTo() : List`

**Description:** Gets the to address List where the email is sent.

**Returns:**

to address List or empty List if no to addresses are set.

---

### send

**Signature:** `send() : Status`

**Description:** prepares an email that is queued to the internal mail system for delivery.

**Returns:**

Status which tells if the mail could be successfully queued ( Status.OK) or not ( Status.ERROR). If an error is raised, more information about the reason for the failure can be found within the log files. If the mandatory fields from, content, and subject are empty an IllegalArgumentException is raised. An IllegalArgumentException is raised if neither to, cc nor bcc are set.

---

### setBcc

**Signature:** `setBcc(bcc : List) : Mail`

**Description:** Sets the bcc address List. If there are already bcc addresses they are overwritten.

**Parameters:**

- `bcc`: list of Strings representing RFC822 compliant email addresses. List replaces any previously set list of addresses. Throws an exception if the given list is null.

**Returns:**

this Mail object.

---

### setCc

**Signature:** `setCc(cc : List) : Mail`

**Description:** Sets the cc address List where the email is sent. If there are already cc addresses set, they are overwritten. The address(es) must conform to the RFC822 standard.

**Parameters:**

- `cc`: List of Strings representing RFC822 compliant email addresses. This List replaces any previously set List of addresses. Throws an exception if the given List is null.

**Returns:**

this Mail object

---

### setContent

**Signature:** `setContent(content : String) : Mail`

**Description:** Mandatory Sets the email content. The MIME type is set to "text/plain;charset=UTF-8" and encoding set to "UTF-8".

**Parameters:**

- `content`: String containing the content of the email.

**Returns:**

this Mail object.

---

### setContent

**Signature:** `setContent(content : String, mimeType : String, encoding : String) : Mail`

**Description:** Mandatory Sets the email content, MIME type, and encoding. No validation of MIME type and encoding is done. It is the responsibility of the caller to specify a valid MIME type and encoding.

**Parameters:**

- `content`: String containing the content of the mail
- `mimeType`: mime type of the content. For example "text/plain;charset=UTF-8" or "text/html"
- `encoding`: character encoding of the email content. For example UTF-8-8

**Returns:**

this Mail object.

---

### setContent

**Signature:** `setContent(mimeEncodedText : MimeEncodedText) : Mail`

**Description:** Mandatory Uses MimeEncodedText to set the content, MIME type and encoding.

**Parameters:**

- `mimeEncodedText`: MimeEncodedText from which the content, MIME type, and encoding information is extracted.

**Returns:**

this Mail object.

---

### setFrom

**Signature:** `setFrom(from : String) : Mail`

**Description:** Mandatory Sets the sender address for this email. The address must conform to the RFC822 standard.

**Parameters:**

- `from`: String containing a RFC822 compliant email address

**Returns:**

this Mail object.

---

### setListUnsubscribe

**Signature:** `setListUnsubscribe(listUnsubscribe : String) : Mail`

**Description:** Sets the List-Unsubscribe header value to work with List-Unsubscribe-Post to allow integration with an externally-managed mailing list.

**Parameters:**

- `listUnsubscribe`: The List-Unsubscribe header value, e.g., "<https://example.com/unsubscribe>"

**Returns:**

this Mail object

---

### setListUnsubscribePost

**Signature:** `setListUnsubscribePost(listUnsubscribePost : String) : Mail`

**Description:** Sets the List-Unsubscribe-Post header value. This header supports one-click unsubscribe functionality.

**Parameters:**

- `listUnsubscribePost`: The List-Unsubscribe-Post header value, typically "List-Unsubscribe=One-Click"

**Returns:**

this Mail object

---

### setSubject

**Signature:** `setSubject(subject : String) : Mail`

**Description:** Mandatory sets the subject for the email. If the subject is not set or set to null at the time send() is invoked and IllegalArgumentException is thrown.

**Parameters:**

- `subject`: subject of the mail to send.

**Returns:**

this Mail object.

---

### setTo

**Signature:** `setTo(to : List) : Mail`

**Description:** Sets the to address List where the email is sent. If there are already to addresses, they are overwritten.

**Parameters:**

- `to`: list of Strings representing RFC822 compliant email addresses. List replaces any previously set List of addresses. Throws an exception if the given List is null.

**Returns:**

this Mail object

---

### validateAddress

**Signature:** `static validateAddress(address : String) : boolean`

**Description:** Validates the address that is sent as parameter. This validation includes: The format must match RFC822 The address must be 7-bit ASCII The top-level domain must be IANA-registered Sample domains such as example.com are not allowed

**Parameters:**

- `address`: Email address to be validated

**Returns:**

true if valid, false otherwise

---
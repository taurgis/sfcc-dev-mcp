## Package: dw.web

# Class Resource

## Inheritance Hierarchy

- Object
  - dw.web.Resource

## Description

Library class which provides methods for retrieving messages from properties resource bundles which contain locale-specific strings. When your program needs a locale-specific String, it loads it from the resource bundle that is appropriate for the user's current locale. In this way, the program code is largely independent of the user's locale. In Commerce Cloud Digital, resources are associated with the templates of a cartridge. These bundles consist of properties files with a common name defined in the template/resources directory of a site cartridge. For example: templates/resources/message.properties templates/resources/message_en.properties templates/resources/message_en_US.properties templates/resources/message_de_DE.properties Resource bundle lookup generally follows the same rules as the Java ResourceBundle class, where the locale used for lookup is based on the current request. See method javadoc for additional details. Properties resource files are assumed to use the UTF-8 character encoding. Unicode escape sequences are also supported.

## Constructor Summary

## Method Summary

### msg

**Signature:** `static msg(key : String) : String`

Returns the message from the default properties resource bundle (base name "message") corresponding to the specified key and the request locale.

### msg

**Signature:** `static msg(key : String, defaultMessage : String) : String`

Returns the message from the default properties resource bundle (base name "message") corresponding to the specified key and the request locale.

### msg

**Signature:** `static msg(key : String, bundleName : String, defaultMessage : String) : String`

Returns the message from the specified properties resource bundle.

### msgf

**Signature:** `static msgf(key : String, bundleName : String, defaultMessage : String, args : Object...) : String`

Returns the message from the specified properties resource bundle, with the provided arguments substituted for the message argument placeholders (specified using the Java MessageFormat approach).

## Method Detail

## Method Details

### msg

**Signature:** `static msg(key : String) : String`

**Description:** Returns the message from the default properties resource bundle (base name "message") corresponding to the specified key and the request locale. This method is equivalent to msg(String, null).

**Parameters:**

- `key`: resource bundle message key

**Returns:**

the resource bundle message or the key itself if no message is defined.

**See Also:**

msg(String, String)

---

### msg

**Signature:** `static msg(key : String, defaultMessage : String) : String`

**Description:** Returns the message from the default properties resource bundle (base name "message") corresponding to the specified key and the request locale. If no message for the key is found, returns the default message if it is not null, otherwise returns the key itself. This method is equivalent to msg(key, null, defaultMessage).

**Parameters:**

- `key`: resource bundle message key
- `defaultMessage`: default message to return if no message corresponding to the key is found

**Returns:**

the resource bundle message or default message

**See Also:**

msg(String, String, String)

---

### msg

**Signature:** `static msg(key : String, bundleName : String, defaultMessage : String) : String`

**Description:** Returns the message from the specified properties resource bundle. The resource bundle is located by iterating the site cartridges and looking for a bundle with the specified name in the cartridge template/resources directory. If it finds a bundle, it tries to return a message from the bundle using standard Java ResourceBundle logic. If a message is found in that cartridge's bundle, it is returned, otherwise, the next cartridge is examined. The method throws an exception if the key is null.

**Parameters:**

- `key`: resource bundle message key
- `bundleName`: base bundle name, if null, default bundle name, "message", is used
- `defaultMessage`: default message to return if no message corresponding to the key is found and defaultMessage is not null

**Returns:**

the resource bundle message or default message

---

### msgf

**Signature:** `static msgf(key : String, bundleName : String, defaultMessage : String, args : Object...) : String`

**Description:** Returns the message from the specified properties resource bundle, with the provided arguments substituted for the message argument placeholders (specified using the Java MessageFormat approach). If null is passed for the varargs argument, this method is equivalent to msg(key, bundleName, defaultMessage).

**Parameters:**

- `key`: resource bundle message key
- `bundleName`: base bundle name, if null, default bundle name, "message", is used
- `defaultMessage`: default message to return if no message corresponding to the key is found and defaultMessage is not null
- `args`: optional list of arguments or a collection, which are included into the result string

**Returns:**

the resource bundle message or default message

**See Also:**

msg(String, String, String)

---
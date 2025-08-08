## Package: dw.io

# Class XMLStreamWriter

## Inheritance Hierarchy

- Object
  - dw.io.XMLStreamWriter

## Description

The XMLStreamWriter can be used to write small and large XML feeds. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk. The XMLStreamWriter does not perform well-formedness checking on its input. However the writeCharacters method escapes '&' , '<' and '>'. For attribute values the writeAttribute method escapes the above characters plus '"' to ensure that all character content and attribute values are well formed. The following example illustrates how to use this class: var fileWriter : FileWriter = new FileWriter(file, "UTF-8"); var xsw : XMLStreamWriter = new XMLStreamWriter(fileWriter); xsw.writeStartDocument(); xsw.writeStartElement("products"); xsw.writeStartElement("product"); xsw.writeAttribute("id", "p42"); xsw.writeStartElement("name"); xsw.writeCharacters("blue t-shirt"); xsw.writeEndElement(); xsw.writeStartElement("rating"); xsw.writeCharacters("2.0"); xsw.writeEndElement(); xsw.writeEndElement(); xsw.writeEndElement(); xsw.writeEndDocument(); xsw.close(); fileWriter.close(); The code above will write the following to file: <?xml version="1.0" ?> <products> <product id="p42"> <name>a blue t-shirt</name> <rating>2.0</rating> </product> </products> Note: This output has been formatted for readability. See XMLIndentingStreamWriter.

## Properties

### defaultNamespace

**Type:** String

The current default name space.

## Constructor Summary

XMLStreamWriter(writer : Writer) Constructs the XMLStreamWriter for a writer.

## Method Summary

### close

**Signature:** `close() : void`

Close this writer and free any resources associated with the writer.

### flush

**Signature:** `flush() : void`

Write any cached data to the underlying output mechanism.

### getDefaultNamespace

**Signature:** `getDefaultNamespace() : String`

Returns the current default name space.

### getPrefix

**Signature:** `getPrefix(uri : String) : String`

Gets the prefix the URI is bound to.

### setDefaultNamespace

**Signature:** `setDefaultNamespace(uri : String) : void`

Binds a URI to the default namespace.

### setPrefix

**Signature:** `setPrefix(prefix : String, uri : String) : void`

Sets the prefix the uri is bound to.

### writeAttribute

**Signature:** `writeAttribute(localName : String, value : String) : void`

Writes an attribute to the output stream without a prefix.

### writeAttribute

**Signature:** `writeAttribute(prefix : String, namespaceURI : String, localName : String, value : String) : void`

Writes an attribute to the output stream.

### writeAttribute

**Signature:** `writeAttribute(namespaceURI : String, localName : String, value : String) : void`

Writes an attribute to the output stream.

### writeCData

**Signature:** `writeCData(data : String) : void`

Writes a CData section.

### writeCharacters

**Signature:** `writeCharacters(text : String) : void`

Write text to the output.

### writeComment

**Signature:** `writeComment(data : String) : void`

Writes an XML comment with the data enclosed.

### writeDefaultNamespace

**Signature:** `writeDefaultNamespace(namespaceURI : String) : void`

Writes the default namespace to the stream.

### writeDTD

**Signature:** `writeDTD(dtd : String) : void`

Write a DTD section.

### writeEmptyElement

**Signature:** `writeEmptyElement(namespaceURI : String, localName : String) : void`

Writes an empty element tag to the output.

### writeEmptyElement

**Signature:** `writeEmptyElement(prefix : String, localName : String, namespaceURI : String) : void`

Writes an empty element tag to the output.

### writeEmptyElement

**Signature:** `writeEmptyElement(localName : String) : void`

Writes an empty element tag to the output.

### writeEndDocument

**Signature:** `writeEndDocument() : void`

Closes any start tags and writes corresponding end tags.

### writeEndElement

**Signature:** `writeEndElement() : void`

Writes an end tag to the output relying on the internal state of the writer to determine the prefix and local name of the event.

### writeEntityRef

**Signature:** `writeEntityRef(name : String) : void`

Writes an entity reference.

### writeNamespace

**Signature:** `writeNamespace(prefix : String, namespaceURI : String) : void`

Writes a namespace to the output stream.

### writeProcessingInstruction

**Signature:** `writeProcessingInstruction(target : String) : void`

Writes a processing instruction.

### writeProcessingInstruction

**Signature:** `writeProcessingInstruction(target : String, data : String) : void`

Writes a processing instruction.

### writeRaw

**Signature:** `writeRaw(raw : String) : void`

Writes the given string directly into the output stream.

### writeStartDocument

**Signature:** `writeStartDocument() : void`

Write the XML Declaration.

### writeStartDocument

**Signature:** `writeStartDocument(version : String) : void`

Write the XML Declaration.

### writeStartDocument

**Signature:** `writeStartDocument(encoding : String, version : String) : void`

Write the XML Declaration.

### writeStartElement

**Signature:** `writeStartElement(localName : String) : void`

Writes a start tag to the output.

### writeStartElement

**Signature:** `writeStartElement(namespaceURI : String, localName : String) : void`

Writes a start tag to the output.

### writeStartElement

**Signature:** `writeStartElement(prefix : String, localName : String, namespaceURI : String) : void`

Writes a start tag to the output.

## Constructor Detail

## Method Detail

## Method Details

### close

**Signature:** `close() : void`

**Description:** Close this writer and free any resources associated with the writer. This method does not close the underlying writer.

---

### flush

**Signature:** `flush() : void`

**Description:** Write any cached data to the underlying output mechanism.

---

### getDefaultNamespace

**Signature:** `getDefaultNamespace() : String`

**Description:** Returns the current default name space.

**Returns:**

the current default name space.

---

### getPrefix

**Signature:** `getPrefix(uri : String) : String`

**Description:** Gets the prefix the URI is bound to.

**Parameters:**

- `uri`: the URI to use.

**Returns:**

the prefix or null.

---

### setDefaultNamespace

**Signature:** `setDefaultNamespace(uri : String) : void`

**Description:** Binds a URI to the default namespace. This URI is bound in the scope of the current START_ELEMENT / END_ELEMENT pair. If this method is called before a START_ELEMENT has been written the uri is bound in the root scope.

**Parameters:**

- `uri`: the uri to bind to the default namespace, may be null.

---

### setPrefix

**Signature:** `setPrefix(prefix : String, uri : String) : void`

**Description:** Sets the prefix the uri is bound to. This prefix is bound in the scope of the current START_ELEMENT / END_ELEMENT pair. If this method is called before a START_ELEMENT has been written the prefix is bound in the root scope.

**Parameters:**

- `prefix`: the prefix to bind to the uri, may not be null.
- `uri`: the uri to bind to the prefix, may be null.

---

### writeAttribute

**Signature:** `writeAttribute(localName : String, value : String) : void`

**Description:** Writes an attribute to the output stream without a prefix.

**Parameters:**

- `localName`: the local name of the attribute.
- `value`: the value of the attribute.

---

### writeAttribute

**Signature:** `writeAttribute(prefix : String, namespaceURI : String, localName : String, value : String) : void`

**Description:** Writes an attribute to the output stream.

**Parameters:**

- `prefix`: the prefix for this attribute.
- `namespaceURI`: the uri of the prefix for this attribute.
- `localName`: the local name of the attribute.
- `value`: the value of the attribute.

---

### writeAttribute

**Signature:** `writeAttribute(namespaceURI : String, localName : String, value : String) : void`

**Description:** Writes an attribute to the output stream.

**Parameters:**

- `namespaceURI`: the uri of the prefix for this attribute.
- `localName`: the local name of the attribute.
- `value`: the value of the attribute.

---

### writeCData

**Signature:** `writeCData(data : String) : void`

**Description:** Writes a CData section.

**Parameters:**

- `data`: the data contained in the CData Section, may not be null.

---

### writeCharacters

**Signature:** `writeCharacters(text : String) : void`

**Description:** Write text to the output.

**Parameters:**

- `text`: the value to write.

---

### writeComment

**Signature:** `writeComment(data : String) : void`

**Description:** Writes an XML comment with the data enclosed.

**Parameters:**

- `data`: the data contained in the comment, may be null.

---

### writeDefaultNamespace

**Signature:** `writeDefaultNamespace(namespaceURI : String) : void`

**Description:** Writes the default namespace to the stream.

**Parameters:**

- `namespaceURI`: the uri to bind the default namespace to.

---

### writeDTD

**Signature:** `writeDTD(dtd : String) : void`

**Description:** Write a DTD section. This string represents the entire doctypedecl production from the XML 1.0 specification.

**Parameters:**

- `dtd`: the DTD to be written.

---

### writeEmptyElement

**Signature:** `writeEmptyElement(namespaceURI : String, localName : String) : void`

**Description:** Writes an empty element tag to the output.

**Parameters:**

- `namespaceURI`: the uri to bind the tag to, may not be null.
- `localName`: local name of the tag, may not be null.

---

### writeEmptyElement

**Signature:** `writeEmptyElement(prefix : String, localName : String, namespaceURI : String) : void`

**Description:** Writes an empty element tag to the output.

**Parameters:**

- `prefix`: the prefix of the tag, may not be null.
- `localName`: local name of the tag, may not be null.
- `namespaceURI`: the uri to bind the tag to, may not be null.

---

### writeEmptyElement

**Signature:** `writeEmptyElement(localName : String) : void`

**Description:** Writes an empty element tag to the output.

**Parameters:**

- `localName`: local name of the tag, may not be null.

---

### writeEndDocument

**Signature:** `writeEndDocument() : void`

**Description:** Closes any start tags and writes corresponding end tags.

---

### writeEndElement

**Signature:** `writeEndElement() : void`

**Description:** Writes an end tag to the output relying on the internal state of the writer to determine the prefix and local name of the event.

---

### writeEntityRef

**Signature:** `writeEntityRef(name : String) : void`

**Description:** Writes an entity reference.

**Parameters:**

- `name`: the name of the entity.

---

### writeNamespace

**Signature:** `writeNamespace(prefix : String, namespaceURI : String) : void`

**Description:** Writes a namespace to the output stream. If the prefix argument to this method is the empty string, "xmlns", or null this method will delegate to writeDefaultNamespace.

**Parameters:**

- `prefix`: the prefix to bind this namespace to.
- `namespaceURI`: the uri to bind the prefix to.

---

### writeProcessingInstruction

**Signature:** `writeProcessingInstruction(target : String) : void`

**Description:** Writes a processing instruction.

**Parameters:**

- `target`: the target of the processing instruction, may not be null.

---

### writeProcessingInstruction

**Signature:** `writeProcessingInstruction(target : String, data : String) : void`

**Description:** Writes a processing instruction.

**Parameters:**

- `target`: the target of the processing instruction, may not be null.
- `data`: the data contained in the processing instruction, may not be null.

---

### writeRaw

**Signature:** `writeRaw(raw : String) : void`

**Description:** Writes the given string directly into the output stream. No checks regarding the correctness of the XML are done. The caller must ensure that the final result is a correct XML.

**Parameters:**

- `raw`: the string to write to the output stream.

---

### writeStartDocument

**Signature:** `writeStartDocument() : void`

**Description:** Write the XML Declaration. Defaults the XML version to 1.0, and the encoding to utf-8

---

### writeStartDocument

**Signature:** `writeStartDocument(version : String) : void`

**Description:** Write the XML Declaration. Defaults the XML version to 1.0

**Parameters:**

- `version`: version of the xml document.

---

### writeStartDocument

**Signature:** `writeStartDocument(encoding : String, version : String) : void`

**Description:** Write the XML Declaration. Note that the encoding parameter does not set the actual encoding of the underlying output. That must be set when the instance of the XMLStreamWriter is created using the XMLOutputFactory.

**Parameters:**

- `encoding`: encoding of the xml declaration.
- `version`: version of the xml document.

---

### writeStartElement

**Signature:** `writeStartElement(localName : String) : void`

**Description:** Writes a start tag to the output. All writeStartElement methods open a new scope in the internal namespace context. Writing the corresponding EndElement causes the scope to be closed.

**Parameters:**

- `localName`: local name of the tag, may not be null.

---

### writeStartElement

**Signature:** `writeStartElement(namespaceURI : String, localName : String) : void`

**Description:** Writes a start tag to the output.

**Parameters:**

- `namespaceURI`: the namespaceURI of the prefix to use, may not be null.
- `localName`: local name of the tag, may not be null.

---

### writeStartElement

**Signature:** `writeStartElement(prefix : String, localName : String, namespaceURI : String) : void`

**Description:** Writes a start tag to the output.

**Parameters:**

- `prefix`: the prefix of the tag, may not be null.
- `localName`: local name of the tag, may not be null.
- `namespaceURI`: the uri to bind the prefix to, may not be null.

---
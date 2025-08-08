## Package: dw.io

# Class XMLStreamReader

## Inheritance Hierarchy

- Object
  - dw.io.XMLStreamReader

## Description

The XMLStreamReader allows forward, read-only access to XML. It is designed to be the lowest level and most efficient way to read XML data. The XMLStreamReader is designed to iterate over XML using next() and hasNext(). The data can be accessed using methods such as getEventType(), getNamespaceURI(), getLocalName() and getText(); The next() method causes the reader to read the next parse event. The next() method returns an integer which identifies the type of event just read. The event type can be determined using getEventType(). Parsing events are defined as the XML Declaration, a DTD, start tag, character data, white space, end tag, comment, or processing instruction. An attribute or namespace event may be encountered at the root level of a document as the result of a query operation. The following table describes which methods are valid in what state. If a method is called in an invalid state the method will throw a java.lang.IllegalStateException. Valid methods for each state Event Type Valid Methods All States getProperty(), hasNext(), require(), close(), getNamespaceURI(), isStartElement(), isEndElement(), isCharacters(), isWhiteSpace(), getNamespaceContext(), getEventType(),getLocation(), hasText(), hasName() START_ELEMENT next(), getName(), getLocalName(), hasName(), getPrefix(), getAttributeXXX(), isAttributeSpecified(), getNamespaceXXX(), getElementText(), nextTag(), getXMLObject() ATTRIBUTE next(), nextTag() getAttributeXXX(), isAttributeSpecified(), NAMESPACE next(), nextTag() getNamespaceXXX() END_ELEMENT next(), getName(), getLocalName(), hasName(), getPrefix(), getNamespaceXXX(), nextTag() CHARACTERS next(), getTextXXX(), nextTag() CDATA next(), getTextXXX(), nextTag() COMMENT next(), getTextXXX(), nextTag() SPACE next(), getTextXXX(), nextTag() START_DOCUMENT next(), getEncoding(), getVersion(), isStandalone(), standaloneSet(), getCharacterEncodingScheme(), nextTag() END_DOCUMENT close() PROCESSING_INSTRUCTION next(), getPITarget(), getPIData(), nextTag() ENTITY_REFERENCE next(), getLocalName(), getText(), nextTag() DTD next(), getText(), nextTag() The following is a code sample to read an XML file containing multiple "myobject" sub-elements. Only one myObject instance is kept in memory at any given time to keep memory consumption low: var fileReader : FileReader = new FileReader(file, "UTF-8"); var xmlStreamReader : XMLStreamReader = new XMLStreamReader(fileReader); while (xmlStreamReader.hasNext()) { if (xmlStreamReader.next() == XMLStreamConstants.START_ELEMENT) { var localElementName : String = xmlStreamReader.getLocalName(); if (localElementName == "myobject") { // read single "myobject" as XML var myObject : XML = xmlStreamReader.getXMLObject(); // process myObject } } } xmlStreamReader.close(); fileReader.close();

## Properties

### attributeCount

**Type:** Number (Read Only)

The count of attributes on this START_ELEMENT,
 this method is only valid on a START_ELEMENT or ATTRIBUTE.  This
 count excludes namespace definitions.  Attribute indices are
 zero-based.

### characterEncodingScheme

**Type:** String (Read Only)

The character encoding declared on the XML declaration
 Returns null if none was declared.

### characters

**Type:** boolean (Read Only)

Identifies if the cursor points to a character data event.

### columnNumber

**Type:** Number (Read Only)

The column number where the current event ends or -1 if none is
 available.

### elementText

**Type:** String (Read Only)

Reads the content of a text-only element, an exception is thrown if this is not a text-only element. This method
 always returns coalesced content. 
 Precondition: the current event is START_ELEMENT. 
 Postcondition: the current event is the corresponding END_ELEMENT. 
 The method does the following (implementations are free to be optimized but must do equivalent processing):

  if ( getEventType() != XMLStreamConstants.START_ELEMENT )
 {
     throw new XMLStreamException( "parser must be on START_ELEMENT to read next text", getLocation() );
 }
 int eventType = next();
 StringBuffer content = new StringBuffer();
 while ( eventType != XMLStreamConstants.END_ELEMENT )
 {
     if ( eventType == XMLStreamConstants.CHARACTERS || eventType == XMLStreamConstants.CDATA
         || eventType == XMLStreamConstants.SPACE || eventType == XMLStreamConstants.ENTITY_REFERENCE )
     {
         buf.append( getText() );
     }
     else if ( eventType == XMLStreamConstants.PROCESSING_INSTRUCTION || eventType == XMLStreamConstants.COMMENT )
     {
         // skipping
     }
     else if ( eventType == XMLStreamConstants.END_DOCUMENT )
     {
         throw new XMLStreamException( "unexpected end of document when reading element text content", this );
     }
     else if ( eventType == XMLStreamConstants.START_ELEMENT )
     {
         throw new XMLStreamException( "element text content may not contain START_ELEMENT", getLocation() );
     }
     else
     {
         throw new XMLStreamException( "Unexpected event type " + eventType, getLocation() );
     }
     eventType = next();
 }
 return buf.toString();

### encoding

**Type:** String (Read Only)

Return input encoding if known or null if unknown.

### endElement

**Type:** boolean (Read Only)

Identifies if the cursor points to an end tag.

### eventType

**Type:** Number (Read Only)

An integer code that indicates the type
 of the event the cursor is pointing to.

### lineNumber

**Type:** Number (Read Only)

The line number where the current event ends or -1 if none is
 available.

### localName

**Type:** String (Read Only)

The (local) name of the current event.
 For START_ELEMENT or END_ELEMENT returns the (local) name of the current element.
 For ENTITY_REFERENCE it returns entity name.
 The current event must be START_ELEMENT or END_ELEMENT,
 or ENTITY_REFERENCE.

### namespaceCount

**Type:** Number (Read Only)

The count of namespaces declared on this START_ELEMENT or END_ELEMENT,
 this method is only valid on a START_ELEMENT, END_ELEMENT or NAMESPACE. On
 an END_ELEMENT the count is of the namespaces that are about to go
 out of scope.  This is the equivalent of the information reported
 by SAX callback for an end element event.

### namespaceURI

**Type:** String (Read Only)

If the current event is a START_ELEMENT or END_ELEMENT  this method
 returns the URI of the prefix or the default namespace.
 Returns null if the event does not have a prefix.

### PIData

**Type:** String (Read Only)

Get the data section of a processing instruction.

### PITarget

**Type:** String (Read Only)

Get the target of a processing instruction.

### prefix

**Type:** String (Read Only)

The prefix of the current event or null if the event does not have a prefix

### standalone

**Type:** boolean (Read Only)

Get the standalone declaration from the xml declaration.

### startElement

**Type:** boolean (Read Only)

Identifies if the cursor points to a start tag.

### text

**Type:** String (Read Only)

The current value of the parse event as a string,
 this returns the string value of a CHARACTERS event,
 returns the value of a COMMENT, the replacement value
 for an ENTITY_REFERENCE, the string value of a CDATA section,
 the string value for a SPACE event,
 or the String value of the internal subset of the DTD.
 If an ENTITY_REFERENCE has been resolved, any character data
 will be reported as CHARACTERS events.

### textLength

**Type:** Number (Read Only)

The length of the sequence of characters for this
 Text event within the text character array.

### textStart

**Type:** Number (Read Only)

The offset into the text character array where the first
 character (of this text event) is stored.

### version

**Type:** String (Read Only)

Get the xml version declared on the xml declaration.
 Returns null if none was declared.

### whiteSpace

**Type:** boolean (Read Only)

Identifies if the cursor points to a character data event
 that consists of all whitespace.

### XMLObject

**Type:** Object (Read Only)

Reads a sub-tree of the XML document and parses it as XML object.
 
 The stream must be positioned on a START_ELEMENT. Do not call the method
 when the stream is positioned at document's root element. This would
 cause the whole document to be parsed into a single XML what may lead to
 an out-of-memory condition. Instead use #next() to navigate to
 sub-elements and invoke getXMLObject() there. Do not keep references to
 more than the currently processed XML to keep memory consumption low. The
 method reads the stream up to the matching END_ELEMENT. When the method
 returns the current event is the END_ELEMENT event.

## Constructor Summary

XMLStreamReader(reader : Reader) Constructs the stream readon on behalf of the reader.

## Method Summary

### close

**Signature:** `close() : void`

Frees any resources associated with this Reader.

### getAttributeCount

**Signature:** `getAttributeCount() : Number`

Returns the count of attributes on this START_ELEMENT, this method is only valid on a START_ELEMENT or ATTRIBUTE.

### getAttributeLocalName

**Signature:** `getAttributeLocalName(index : Number) : String`

Returns the localName of the attribute at the provided index.

### getAttributeNamespace

**Signature:** `getAttributeNamespace(index : Number) : String`

Returns the namespace of the attribute at the provided index.

### getAttributePrefix

**Signature:** `getAttributePrefix(index : Number) : String`

Returns the prefix of this attribute at the provided index.

### getAttributeType

**Signature:** `getAttributeType(index : Number) : String`

Returns the XML type of the attribute at the provided index.

### getAttributeValue

**Signature:** `getAttributeValue(namespaceURI : String, localName : String) : String`

Returns the normalized attribute value of the attribute with the namespace and localName If the namespaceURI is null the namespace is not checked for equality

### getAttributeValue

**Signature:** `getAttributeValue(index : Number) : String`

Returns the value of the attribute at the index.

### getCharacterEncodingScheme

**Signature:** `getCharacterEncodingScheme() : String`

Returns the character encoding declared on the XML declaration Returns null if none was declared.

### getColumnNumber

**Signature:** `getColumnNumber() : Number`

Returns the column number where the current event ends or -1 if none is available.

### getElementText

**Signature:** `getElementText() : String`

Reads the content of a text-only element, an exception is thrown if this is not a text-only element.

### getEncoding

**Signature:** `getEncoding() : String`

Return input encoding if known or null if unknown.

### getEventType

**Signature:** `getEventType() : Number`

Returns an integer code that indicates the type of the event the cursor is pointing to.

### getLineNumber

**Signature:** `getLineNumber() : Number`

Returns the line number where the current event ends or -1 if none is available.

### getLocalName

**Signature:** `getLocalName() : String`

Returns the (local) name of the current event.

### getNamespaceCount

**Signature:** `getNamespaceCount() : Number`

Returns the count of namespaces declared on this START_ELEMENT or END_ELEMENT, this method is only valid on a START_ELEMENT, END_ELEMENT or NAMESPACE.

### getNamespacePrefix

**Signature:** `getNamespacePrefix(index : Number) : String`

Returns the prefix for the namespace declared at the index.

### getNamespaceURI

**Signature:** `getNamespaceURI(prefix : String) : String`

Return the uri for the given prefix.

### getNamespaceURI

**Signature:** `getNamespaceURI(index : Number) : String`

Returns the uri for the namespace declared at the index.

### getNamespaceURI

**Signature:** `getNamespaceURI() : String`

If the current event is a START_ELEMENT or END_ELEMENT this method returns the URI of the prefix or the default namespace.

### getPIData

**Signature:** `getPIData() : String`

Get the data section of a processing instruction.

### getPITarget

**Signature:** `getPITarget() : String`

Get the target of a processing instruction.

### getPrefix

**Signature:** `getPrefix() : String`

Returns the prefix of the current event or null if the event does not have a prefix

### getText

**Signature:** `getText() : String`

Returns the current value of the parse event as a string, this returns the string value of a CHARACTERS event, returns the value of a COMMENT, the replacement value for an ENTITY_REFERENCE, the string value of a CDATA section, the string value for a SPACE event, or the String value of the internal subset of the DTD.

### getTextLength

**Signature:** `getTextLength() : Number`

Returns the length of the sequence of characters for this Text event within the text character array.

### getTextStart

**Signature:** `getTextStart() : Number`

Returns the offset into the text character array where the first character (of this text event) is stored.

### getVersion

**Signature:** `getVersion() : String`

Get the xml version declared on the xml declaration.

### getXMLObject

**Signature:** `getXMLObject() : Object`

Reads a sub-tree of the XML document and parses it as XML object.

### hasName

**Signature:** `hasName() : boolean`

Identifies if the current event has a name (is a START_ELEMENT or END_ELEMENT)

### hasNext

**Signature:** `hasNext() : boolean`

Returns true if there are more parsing events and false if there are no more events.

### hasText

**Signature:** `hasText() : boolean`

Indicates if the current event has text.

### isAttributeSpecified

**Signature:** `isAttributeSpecified(index : Number) : boolean`

Identifies if this attribute was created by default.

### isCharacters

**Signature:** `isCharacters() : boolean`

Identifies if the cursor points to a character data event.

### isEndElement

**Signature:** `isEndElement() : boolean`

Identifies if the cursor points to an end tag.

### isStandalone

**Signature:** `isStandalone() : boolean`

Get the standalone declaration from the xml declaration.

### isStartElement

**Signature:** `isStartElement() : boolean`

Identifies if the cursor points to a start tag.

### isWhiteSpace

**Signature:** `isWhiteSpace() : boolean`

Identifies if the cursor points to a character data event that consists of all whitespace.

### next

**Signature:** `next() : Number`

Get next parsing event - a processor may return all contiguous character data in a single chunk, or it may split it into several chunks.

### nextTag

**Signature:** `nextTag() : Number`

Skips any white space (isWhiteSpace() returns true), COMMENT, or PROCESSING_INSTRUCTION, until a START_ELEMENT or END_ELEMENT is reached.

### readElementText

**Signature:** `readElementText() : String`

Reads the content of a text-only element, an exception is thrown if this is not a text-only element.

### readXMLObject

**Signature:** `readXMLObject() : Object`

Reads a sub-tree of the XML document and parses it as XML object.

### require

**Signature:** `require(type : Number, namespaceURI : String, localName : String) : void`

Test if the current event is of the given type and if the namespace and name match the current namespace and name of the current event.

### standaloneSet

**Signature:** `standaloneSet() : boolean`

Identifies if standalone was set in the document.

## Constructor Detail

## Method Detail

## Method Details

### close

**Signature:** `close() : void`

**Description:** Frees any resources associated with this Reader. This method does not close the underlying reader.

---

### getAttributeCount

**Signature:** `getAttributeCount() : Number`

**Description:** Returns the count of attributes on this START_ELEMENT, this method is only valid on a START_ELEMENT or ATTRIBUTE. This count excludes namespace definitions. Attribute indices are zero-based.

**Returns:**

returns the number of attributes.

---

### getAttributeLocalName

**Signature:** `getAttributeLocalName(index : Number) : String`

**Description:** Returns the localName of the attribute at the provided index.

**Parameters:**

- `index`: the position of the attribute.

**Returns:**

the local name of the attribute.

---

### getAttributeNamespace

**Signature:** `getAttributeNamespace(index : Number) : String`

**Description:** Returns the namespace of the attribute at the provided index.

**Parameters:**

- `index`: the position of the attribute

**Returns:**

the namespace URI (can be null)

---

### getAttributePrefix

**Signature:** `getAttributePrefix(index : Number) : String`

**Description:** Returns the prefix of this attribute at the provided index.

**Parameters:**

- `index`: the position of the attribute.

**Returns:**

the prefix of the attribute.

---

### getAttributeType

**Signature:** `getAttributeType(index : Number) : String`

**Description:** Returns the XML type of the attribute at the provided index.

**Parameters:**

- `index`: the position of the attribute.

**Returns:**

the XML type of the attribute.

---

### getAttributeValue

**Signature:** `getAttributeValue(namespaceURI : String, localName : String) : String`

**Description:** Returns the normalized attribute value of the attribute with the namespace and localName If the namespaceURI is null the namespace is not checked for equality

**Parameters:**

- `namespaceURI`: the namespace of the attribute
- `localName`: the local name of the attribute, cannot be null

**Returns:**

returns the value of the attribute or null if not found.

---

### getAttributeValue

**Signature:** `getAttributeValue(index : Number) : String`

**Description:** Returns the value of the attribute at the index.

**Parameters:**

- `index`: the position of the attribute.

**Returns:**

the attribute value.

---

### getCharacterEncodingScheme

**Signature:** `getCharacterEncodingScheme() : String`

**Description:** Returns the character encoding declared on the XML declaration Returns null if none was declared.

**Returns:**

the encoding declared in the document or null.

---

### getColumnNumber

**Signature:** `getColumnNumber() : Number`

**Description:** Returns the column number where the current event ends or -1 if none is available.

**Returns:**

the column number or -1.

---

### getElementText

**Signature:** `getElementText() : String`

**Description:** Reads the content of a text-only element, an exception is thrown if this is not a text-only element. This method always returns coalesced content. Precondition: the current event is START_ELEMENT. Postcondition: the current event is the corresponding END_ELEMENT. The method does the following (implementations are free to be optimized but must do equivalent processing): if ( getEventType() != XMLStreamConstants.START_ELEMENT ) { throw new XMLStreamException( "parser must be on START_ELEMENT to read next text", getLocation() ); } int eventType = next(); StringBuffer content = new StringBuffer(); while ( eventType != XMLStreamConstants.END_ELEMENT ) { if ( eventType == XMLStreamConstants.CHARACTERS || eventType == XMLStreamConstants.CDATA || eventType == XMLStreamConstants.SPACE || eventType == XMLStreamConstants.ENTITY_REFERENCE ) { buf.append( getText() ); } else if ( eventType == XMLStreamConstants.PROCESSING_INSTRUCTION || eventType == XMLStreamConstants.COMMENT ) { // skipping } else if ( eventType == XMLStreamConstants.END_DOCUMENT ) { throw new XMLStreamException( "unexpected end of document when reading element text content", this ); } else if ( eventType == XMLStreamConstants.START_ELEMENT ) { throw new XMLStreamException( "element text content may not contain START_ELEMENT", getLocation() ); } else { throw new XMLStreamException( "Unexpected event type " + eventType, getLocation() ); } eventType = next(); } return buf.toString();

**Deprecated:**

Use readElementText()

---

### getEncoding

**Signature:** `getEncoding() : String`

**Description:** Return input encoding if known or null if unknown.

**Returns:**

the encoding of this instance or null

---

### getEventType

**Signature:** `getEventType() : Number`

**Description:** Returns an integer code that indicates the type of the event the cursor is pointing to.

**Returns:**

an integer code that indicates the type of the event the cursor is pointing to.

---

### getLineNumber

**Signature:** `getLineNumber() : Number`

**Description:** Returns the line number where the current event ends or -1 if none is available.

**Returns:**

the line number or -1.

---

### getLocalName

**Signature:** `getLocalName() : String`

**Description:** Returns the (local) name of the current event. For START_ELEMENT or END_ELEMENT returns the (local) name of the current element. For ENTITY_REFERENCE it returns entity name. The current event must be START_ELEMENT or END_ELEMENT, or ENTITY_REFERENCE.

**Returns:**

the local name.

---

### getNamespaceCount

**Signature:** `getNamespaceCount() : Number`

**Description:** Returns the count of namespaces declared on this START_ELEMENT or END_ELEMENT, this method is only valid on a START_ELEMENT, END_ELEMENT or NAMESPACE. On an END_ELEMENT the count is of the namespaces that are about to go out of scope. This is the equivalent of the information reported by SAX callback for an end element event.

**Returns:**

returns the number of namespace declarations on this specific element.

---

### getNamespacePrefix

**Signature:** `getNamespacePrefix(index : Number) : String`

**Description:** Returns the prefix for the namespace declared at the index. Returns null if this is the default namespace declaration.

**Parameters:**

- `index`: the position of the namespace declaration.

**Returns:**

returns the namespace prefix.

---

### getNamespaceURI

**Signature:** `getNamespaceURI(prefix : String) : String`

**Description:** Return the uri for the given prefix. The uri returned depends on the current state of the processor. NOTE:The 'xml' prefix is bound as defined in Namespaces in XML specification to "http://www.w3.org/XML/1998/namespace". NOTE: The 'xmlns' prefix must be resolved to following namespace http://www.w3.org/2000/xmlns/

**Parameters:**

- `prefix`: The prefix to lookup, may not be null

**Returns:**

the uri bound to the given prefix or null if it is not bound

---

### getNamespaceURI

**Signature:** `getNamespaceURI(index : Number) : String`

**Description:** Returns the uri for the namespace declared at the index.

**Parameters:**

- `index`: the position of the namespace declaration.

**Returns:**

returns the namespace uri.

---

### getNamespaceURI

**Signature:** `getNamespaceURI() : String`

**Description:** If the current event is a START_ELEMENT or END_ELEMENT this method returns the URI of the prefix or the default namespace. Returns null if the event does not have a prefix.

**Returns:**

the URI bound to this elements prefix, the default namespace, or null.

---

### getPIData

**Signature:** `getPIData() : String`

**Description:** Get the data section of a processing instruction.

**Returns:**

the data or null.

---

### getPITarget

**Signature:** `getPITarget() : String`

**Description:** Get the target of a processing instruction.

**Returns:**

the target or null.

---

### getPrefix

**Signature:** `getPrefix() : String`

**Description:** Returns the prefix of the current event or null if the event does not have a prefix

**Returns:**

the prefix or null.

---

### getText

**Signature:** `getText() : String`

**Description:** Returns the current value of the parse event as a string, this returns the string value of a CHARACTERS event, returns the value of a COMMENT, the replacement value for an ENTITY_REFERENCE, the string value of a CDATA section, the string value for a SPACE event, or the String value of the internal subset of the DTD. If an ENTITY_REFERENCE has been resolved, any character data will be reported as CHARACTERS events.

**Returns:**

the current text or null.

---

### getTextLength

**Signature:** `getTextLength() : Number`

**Description:** Returns the length of the sequence of characters for this Text event within the text character array.

**Returns:**

the length of the sequence of characters for this Text event within the text character array.

---

### getTextStart

**Signature:** `getTextStart() : Number`

**Description:** Returns the offset into the text character array where the first character (of this text event) is stored.

**Returns:**

the offset into the text character array where the first character (of this text event) is stored.

---

### getVersion

**Signature:** `getVersion() : String`

**Description:** Get the xml version declared on the xml declaration. Returns null if none was declared.

**Returns:**

the XML version or null.

---

### getXMLObject

**Signature:** `getXMLObject() : Object`

**Description:** Reads a sub-tree of the XML document and parses it as XML object. The stream must be positioned on a START_ELEMENT. Do not call the method when the stream is positioned at document's root element. This would cause the whole document to be parsed into a single XML what may lead to an out-of-memory condition. Instead use #next() to navigate to sub-elements and invoke getXMLObject() there. Do not keep references to more than the currently processed XML to keep memory consumption low. The method reads the stream up to the matching END_ELEMENT. When the method returns the current event is the END_ELEMENT event.

**Deprecated:**

Use readXMLObject()

---

### hasName

**Signature:** `hasName() : boolean`

**Description:** Identifies if the current event has a name (is a START_ELEMENT or END_ELEMENT)

**Returns:**

true if the current event has a name, false otherwise.

---

### hasNext

**Signature:** `hasNext() : boolean`

**Description:** Returns true if there are more parsing events and false if there are no more events. This method will return false if the current state of the XMLStreamReader is END_DOCUMENT

**Returns:**

true if there are more events, false otherwise

---

### hasText

**Signature:** `hasText() : boolean`

**Description:** Indicates if the current event has text. The following events have text: CHARACTERS,DTD ,ENTITY_REFERENCE, COMMENT, SPACE.

**Returns:**

true if the current event has text, false otherwise.

---

### isAttributeSpecified

**Signature:** `isAttributeSpecified(index : Number) : boolean`

**Description:** Identifies if this attribute was created by default.

**Parameters:**

- `index`: the position of the attribute.

**Returns:**

true if this is a default attribute, false otherwise.

---

### isCharacters

**Signature:** `isCharacters() : boolean`

**Description:** Identifies if the cursor points to a character data event.

**Returns:**

true if the cursor points to character data, false otherwise.

---

### isEndElement

**Signature:** `isEndElement() : boolean`

**Description:** Identifies if the cursor points to an end tag.

**Returns:**

true if the cursor points to an end tag, false otherwise.

---

### isStandalone

**Signature:** `isStandalone() : boolean`

**Description:** Get the standalone declaration from the xml declaration.

**Returns:**

true if this is standalone, or false otherwise.

---

### isStartElement

**Signature:** `isStartElement() : boolean`

**Description:** Identifies if the cursor points to a start tag.

**Returns:**

true if the cursor points to a start tag, false otherwise.

---

### isWhiteSpace

**Signature:** `isWhiteSpace() : boolean`

**Description:** Identifies if the cursor points to a character data event that consists of all whitespace.

**Returns:**

true if the cursor points to all whitespace, false otherwise.

---

### next

**Signature:** `next() : Number`

**Description:** Get next parsing event - a processor may return all contiguous character data in a single chunk, or it may split it into several chunks. If the property javax.xml.stream.isCoalescing is set to true element content must be coalesced and only one CHARACTERS event must be returned for contiguous element content or CDATA Sections. By default entity references must be expanded and reported transparently to the application. An exception will be thrown if an entity reference cannot be expanded. If element content is empty (i.e. content is "") then no CHARACTERS event will be reported. Given the following XML: <foo><!--description-->content text<![CDATA[<greeting>Hello</greeting>]]>other content</foo> The behavior of calling next() when being on foo will be: 1- the comment (COMMENT) 2- then the characters section (CHARACTERS) 3- then the CDATA section (another CHARACTERS) 4- then the next characters section (another CHARACTERS) 5- then the END_ELEMENT NOTE: empty element (such as <tag/>) will be reported with two separate events: START_ELEMENT, END_ELEMENT - This preserves parsing equivalency of empty element to <tag></tag>. This method will throw an IllegalStateException if it is called after hasNext() returns false.

**Returns:**

the integer code corresponding to the current parse event

---

### nextTag

**Signature:** `nextTag() : Number`

**Description:** Skips any white space (isWhiteSpace() returns true), COMMENT, or PROCESSING_INSTRUCTION, until a START_ELEMENT or END_ELEMENT is reached. If other than white space characters, COMMENT, PROCESSING_INSTRUCTION, START_ELEMENT, END_ELEMENT are encountered, an exception is thrown. This method should be used when processing element-only content separated by white space. Precondition: none Postcondition: the current event is START_ELEMENT or END_ELEMENT and cursor may have moved over any whitespace event. Essentially it does the following (implementations are free to optimized but must do equivalent processing): int eventType = next(); while ( (eventType == XMLStreamConstants.CHARACTERS && isWhiteSpace() ) || (eventType == XMLStreamConstants.CDATA && isWhiteSpace()) || eventType == XMLStreamConstants.SPACE || eventType == XMLStreamConstants.PROCESSING_INSTRUCTION || eventType == XMLStreamConstants.COMMENT ) { eventType = next(); } if ( eventType != XMLStreamConstants.START_ELEMENT && eventType != XMLStreamConstants.END_ELEMENT ) { throw new String XMLStreamException( "expected start or end tag", getLocation() ); } return eventType;

**Returns:**

the event type of the element read (START_ELEMENT or END_ELEMENT)

---

### readElementText

**Signature:** `readElementText() : String`

**Description:** Reads the content of a text-only element, an exception is thrown if this is not a text-only element. This method always returns coalesced content. Precondition: the current event is START_ELEMENT. Postcondition: the current event is the corresponding END_ELEMENT. The method does the following (implementations are free to be optimized but must do equivalent processing): if ( getEventType() != XMLStreamConstants.START_ELEMENT ) { throw new XMLStreamException( "parser must be on START_ELEMENT to read next text", getLocation() ); } int eventType = next(); StringBuffer content = new StringBuffer(); while ( eventType != XMLStreamConstants.END_ELEMENT ) { if ( eventType == XMLStreamConstants.CHARACTERS || eventType == XMLStreamConstants.CDATA || eventType == XMLStreamConstants.SPACE || eventType == XMLStreamConstants.ENTITY_REFERENCE ) { buf.append( getText() ); } else if ( eventType == XMLStreamConstants.PROCESSING_INSTRUCTION || eventType == XMLStreamConstants.COMMENT ) { // skipping } else if ( eventType == XMLStreamConstants.END_DOCUMENT ) { throw new XMLStreamException( "unexpected end of document when reading element text content", this ); } else if ( eventType == XMLStreamConstants.START_ELEMENT ) { throw new XMLStreamException( "element text content may not contain START_ELEMENT", getLocation() ); } else { throw new XMLStreamException( "Unexpected event type " + eventType, getLocation() ); } eventType = next(); } return buf.toString();

---

### readXMLObject

**Signature:** `readXMLObject() : Object`

**Description:** Reads a sub-tree of the XML document and parses it as XML object. The stream must be positioned on a START_ELEMENT. Do not call the method when the stream is positioned at document's root element. This would cause the whole document to be parsed into a single XML what may lead to an out-of-memory condition. Instead use #next() to navigate to sub-elements and invoke getXMLObject() there. Do not keep references to more than the currently processed XML to keep memory consumption low. The method reads the stream up to the matching END_ELEMENT. When the method returns the current event is the END_ELEMENT event.

---

### require

**Signature:** `require(type : Number, namespaceURI : String, localName : String) : void`

**Description:** Test if the current event is of the given type and if the namespace and name match the current namespace and name of the current event. If the namespaceURI is null it is not checked for equality, if the localName is null it is not checked for equality.

**Parameters:**

- `type`: the event type
- `namespaceURI`: the uri of the event, may be null
- `localName`: the localName of the event, may be null

---

### standaloneSet

**Signature:** `standaloneSet() : boolean`

**Description:** Identifies if standalone was set in the document.

**Returns:**

true if standalone was set in the document, false otherwise.

---
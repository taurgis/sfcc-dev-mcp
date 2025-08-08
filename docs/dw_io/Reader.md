## Package: dw.io

# Class Reader

## Inheritance Hierarchy

- Object
  - dw.io.Reader

## Description

The class supports reading characters from a stream.

## Properties

### lines

**Type:** List (Read Only)

The method reads the whole input stream, parses it and returns a list of strings.
 
 Using this method on large feeds is inherently unsafe and may lead to an out-of-memory condition. Instead use
 method readLine() and process one line at a time.

### string

**Type:** String (Read Only)

The method reads the whole input stream as one string and returns it.
 
 Using this method is unsafe if the length of the input stream is not known and may lead to an out-of-memory
 condition. Instead use method readN(Number).

## Constructor Summary

Reader(source : String) Creates a reader from a string.

Reader(stream : InputStream) Create a reader from a stream using UTF-8 character encoding.

Reader(stream : InputStream, encoding : String) Create a reader from a stream using the specified character encoding.

## Method Summary

### close

**Signature:** `close() : void`

Closes the reader.

### getLines

**Signature:** `getLines() : List`

The method reads the whole input stream, parses it and returns a list of strings.

### getString

**Signature:** `getString() : String`

The method reads the whole input stream as one string and returns it.

### read

**Signature:** `read() : String`

Reads a single character from the stream.

### read

**Signature:** `read(length : Number) : String`

Reads multiple characters from the stream as string.

### readLine

**Signature:** `readLine() : String`

Reads the next line.

### readLines

**Signature:** `readLines() : List`

The method reads the whole input stream, parses it and returns a list of strings.

### readN

**Signature:** `readN(n : Number) : String`

Reads n characters from the stream as string.

### readString

**Signature:** `readString() : String`

The method reads the whole input stream as one string and returns it.

### ready

**Signature:** `ready() : boolean`

Identifies if this stream is ready to be read.

### skip

**Signature:** `skip(n : Number) : void`

Skips the specified number of characters in the stream.

## Constructor Detail

## Method Detail

## Method Details

### close

**Signature:** `close() : void`

**Description:** Closes the reader.

---

### getLines

**Signature:** `getLines() : List`

**Description:** The method reads the whole input stream, parses it and returns a list of strings. Using this method on large feeds is inherently unsafe and may lead to an out-of-memory condition. Instead use method readLine() and process one line at a time.

**Deprecated:**

Use readLines()

**Returns:**

a list of strings

---

### getString

**Signature:** `getString() : String`

**Description:** The method reads the whole input stream as one string and returns it. Using this method is unsafe if the length of the input stream is not known and may lead to an out-of-memory condition. Instead use method readN(Number).

**Deprecated:**

Use readString()

**Returns:**

a string, which represents the whole content of the InputStream

**Throws:**

IOException - if something went wrong while reading from the underlying stream

---

### read

**Signature:** `read() : String`

**Description:** Reads a single character from the stream. The method returns null if the end of the stream is reached.

**Returns:**

a single character in a string, or null if the end of the stream is reached

---

### read

**Signature:** `read(length : Number) : String`

**Description:** Reads multiple characters from the stream as string. The actual number of characters that were read can be determined from the length of the returned string. If the end of the stream is reached and no more characters can be read, the method exits with an exception.

**Deprecated:**

use readN(Number) instead which does not throw an exception if the stream is exhausted

**Parameters:**

- `length`: the number of characters to read.

**Returns:**

a string whose length is controlled by the length parameter. The actual number of characters that were read can be determined from the length of the returned string.

**Throws:**

an - exception if the stream is exhausted

---

### readLine

**Signature:** `readLine() : String`

**Description:** Reads the next line.

**Returns:**

A String containing the contents of the line, not including any line termination characters, or null if the end of the stream has been reached.

---

### readLines

**Signature:** `readLines() : List`

**Description:** The method reads the whole input stream, parses it and returns a list of strings. Using this method on large feeds is inherently unsafe and may lead to an out-of-memory condition. Instead use method readLine() and process one line at a time.

**Returns:**

a list of strings

---

### readN

**Signature:** `readN(n : Number) : String`

**Description:** Reads n characters from the stream as string. The actual number of characters that were read can be determined from the length of the returned string. If the end of the stream is reached and no more characters can be read, the method returns null.

**Parameters:**

- `n`: the number of characters to read

**Returns:**

a string whose maximum length is controlled by the n parameter, or null if the end of the stream is reached and no more characters can be read

---

### readString

**Signature:** `readString() : String`

**Description:** The method reads the whole input stream as one string and returns it. Using this method is unsafe if the length of the input stream is not known and may lead to an out-of-memory condition. Instead use method readN(Number).

**Returns:**

a string, which represents the whole content of the InputStream

**Throws:**

IOException - if something went wrong while reading from the underlying stream

---

### ready

**Signature:** `ready() : boolean`

**Description:** Identifies if this stream is ready to be read.

**Returns:**

true guarantees that the stream is ready to read without waiting for input. A false response means that the stream may or may not block to wait for input. Note that returning false does not guarantee that the next read() will block.

---

### skip

**Signature:** `skip(n : Number) : void`

**Description:** Skips the specified number of characters in the stream.

**Parameters:**

- `n`: the number of characters to skip.

---
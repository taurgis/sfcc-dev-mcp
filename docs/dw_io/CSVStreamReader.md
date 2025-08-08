## Package: dw.io

# Class CSVStreamReader

## Inheritance Hierarchy

- Object
  - dw.io.CSVStreamReader

## Description

The class supports reading a CSV file. The reader supports handling CSV entries where the separator is contained in quotes and also CSV entries where a quoted entry contains newline characters.

## Constructor Summary

CSVStreamReader(ioreader : Reader) Creates a new CSVReader with a ',' as separator character and a '"' as quote character.

CSVStreamReader(ioreader : Reader, separator : String) Creates a new CSVReader with the specified separator character and a '"' as quote character.

CSVStreamReader(ioreader : Reader, separator : String, quote : String) Creates a new CSVReader with the specified separator character and the specified quote character.

CSVStreamReader(ioreader : Reader, separator : String, quote : String, skip : Number) Creates a new CSVReader.

## Method Summary

### close

**Signature:** `close() : void`

Closes the underlying reader.

### readAll

**Signature:** `readAll() : List`

Returns a list of lines representing the entire CSV file.

### readNext

**Signature:** `readNext() : String[]`

Returns the next line from the input stream.

## Constructor Detail

## Method Detail

## Method Details

### close

**Signature:** `close() : void`

**Description:** Closes the underlying reader.

---

### readAll

**Signature:** `readAll() : List`

**Description:** Returns a list of lines representing the entire CSV file. Each line is a array of strings. Using this method on large feeds is inherently unsafe and may lead to an out-of-memory condition. Instead use method readNext() and process entries line by line.

**Returns:**

a list of lines representing the entire CSV file.

---

### readNext

**Signature:** `readNext() : String[]`

**Description:** Returns the next line from the input stream. The line is returned as an array of strings. The method returns null if the end of the stream is reached.

**Returns:**

the next line from the input stream as an array of strings.

---
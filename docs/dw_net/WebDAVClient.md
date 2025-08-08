## Package: dw.net

# Class WebDAVClient

## Inheritance Hierarchy

- Object
  - dw.net.WebDAVClient

## Description

The WebDAVClient class supports the WebDAV methods GET, PUT, MKCOL, MOVE, COPY, PROPFIND,OPTIONS and DELETE. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk. The client can be used as shown in the following example: var webdavClient : WebDAVClient = new WebDAVClient("http://mywebdav.server.com","myusername", "mypassword"); var getString : String = webdavClient.get("myData.xml","UTF-8"); var message : String; if (webdavClient.succeeded()) { message = webDavClient.statusText; } else { // error handling message="An error occurred with status code "+webdavClient.statusCode; } var data : XML = new XML(getString); The WebDAV client supports the following authentication schemes: Basic authentication Digest authentication The methods of this class do not generally throw exceptions if the underlying WebDAV operation do not succeed.The result of a WebDAV operation can be checked using the methods succeeded(), getStatusCode(), and getStatusText(). Important note: This WebDAV client cannot be used to access the Commerce Cloud Digital server via WebDAV protocol.

## Constants

## Properties

### allResponseHeaders

**Type:** HashMap (Read Only)

A HashMap of all response headers.

### statusCode

**Type:** Number (Read Only)

The status code after the execution of a method.

### statusText

**Type:** String (Read Only)

The status text after the execution of a method.

## Constructor Summary

WebDAVClient(rootUrl : String, username : String, password : String) Creates a new client for the use at a server which requires authentication.

WebDAVClient(rootUrl : String) Creates a new client for the use at a server which does not require authentication.

## Method Summary

### addRequestHeader

**Signature:** `addRequestHeader(headerName : String, headerValue : String) : void`

Adds a request header to the next WebDAV call.

### close

**Signature:** `close() : void`

Closes the current connection to the server.

### copy

**Signature:** `copy(origin : String, destination : String) : boolean`

Copies a file on the server from one place rootUrl/origin to the other rootUrl/destination.

### copy

**Signature:** `copy(origin : String, destination : String, overwrite : boolean) : boolean`

Copies a file on the server from one place rootUrl/origin to the other rootUrl/destination.

### copy

**Signature:** `copy(origin : String, destination : String, overwrite : boolean, shallow : boolean) : boolean`

Copies a file on the server from one place rootUrl/origin to the other rootUrl/destination.

### del

**Signature:** `del(path : String) : boolean`

Deletes a file or directory from the remote server that can be found under rootUrl/path.

### get

**Signature:** `get(path : String) : String`

Reads the content of a remote file or directory that can be found under rootUrl/path and returns a string representation of the data found in the DEFAULT_ENCODING encoding.

### get

**Signature:** `get(path : String, encoding : String) : String`

Reads the content of a remote file or directory that can be found under rootUrl/path and returns a string representation of the data found in the given encoding.

### get

**Signature:** `get(path : String, encoding : String, maxGetSize : Number) : String`

Reads the content of a remote file or directory that can be found under rootUrl/path and returns a string representation of the data found in the given encoding.

### get

**Signature:** `get(path : String, file : File) : boolean`

Reads the content of a remote file or directory that can be found under rootUrl/path in DEFAULT_ENCODING encoding and writes a File in the system's standard encoding, which is "UTF-8".

### get

**Signature:** `get(path : String, file : File, maxFileSize : Number) : boolean`

Reads the content of a remote file or directory that can be found under rootUrl/path in DEFAULT_ENCODING encoding and writes a File in the system's standard encoding, which is "UTF-8".

### get

**Signature:** `get(path : String, file : File, encoding : String, maxFileSize : Number) : boolean`

Reads the content of a remote file or directory that can be found under rootUrl/path in the passed encoding and writes a File in the system standard encoding, which is "UTF-8".

### getAllResponseHeaders

**Signature:** `getAllResponseHeaders() : HashMap`

Returns a HashMap of all response headers.

### getBinary

**Signature:** `getBinary(path : String, file : File) : boolean`

Reads the content of a remote binary file that can be found under rootUrl/path and creates a local copy in File.

### getBinary

**Signature:** `getBinary(path : String, file : File, maxFileSize : Number) : boolean`

Reads the content of a remote binary file that can be found under rootUrl/path and creates a local copy in File.

### getResponseHeader

**Signature:** `getResponseHeader(header : String) : String`

Returns a specified response header - multiple headers are separated by CRLF.

### getStatusCode

**Signature:** `getStatusCode() : Number`

Returns the status code after the execution of a method.

### getStatusText

**Signature:** `getStatusText() : String`

Returns the status text after the execution of a method.

### mkcol

**Signature:** `mkcol(path : String) : boolean`

Creates a directory on the remote server on the location rootUrl/path.

### move

**Signature:** `move(origin : String, destination : String) : boolean`

Moves a file on the server from one place rootUrl + "/" +origin to the other rootUrl/destination.

### move

**Signature:** `move(origin : String, destination : String, overwrite : boolean) : boolean`

Moves a file on the server from one place rootUrl/origin to the other rootUrl/destination Can also be used to rename a remote file.

### options

**Signature:** `options(path : String) : String[]`

Returns a list of methods which can be executed on the server location rootUrl/path.

### propfind

**Signature:** `propfind(path : String) : WebDAVFileInfo[]`

Get file listing of a remote location.

### propfind

**Signature:** `propfind(path : String, depth : Number) : WebDAVFileInfo[]`

Get file listing of a remote location.

### put

**Signature:** `put(path : String, content : String) : boolean`

Puts content encoded with DEFAULT_ENCODING into a remote located file at rootUrl/path.

### put

**Signature:** `put(path : String, content : String, encoding : String) : boolean`

Puts content encoded with the passed encoding into a remote located file at rootUrl/path.

### put

**Signature:** `put(path : String, file : File) : boolean`

Puts content out of a passed local file into a remote located file at rootUrl/path.

### succeeded

**Signature:** `succeeded() : boolean`

Returns true if the last executed WebDAV method was executed successfully - otherwise false.

## Constructor Detail

## Method Detail

## Method Details

### addRequestHeader

**Signature:** `addRequestHeader(headerName : String, headerValue : String) : void`

**Description:** Adds a request header to the next WebDAV call.

**Parameters:**

- `headerName`: name of the header.
- `headerValue`: value of the header.

---

### close

**Signature:** `close() : void`

**Description:** Closes the current connection to the server.

---

### copy

**Signature:** `copy(origin : String, destination : String) : boolean`

**Description:** Copies a file on the server from one place rootUrl/origin to the other rootUrl/destination. If destination already exists it gets overwritten. Returns true if succeeded, otherwise false.

**Parameters:**

- `origin`: The origin where a file is located, relative to the rootUrl stated when instantiating the client.
- `destination`: The destination where the file should be copied to, relative to the rootUrl stated when instantiating the client.

**Returns:**

true if succeeded, otherwise false.

---

### copy

**Signature:** `copy(origin : String, destination : String, overwrite : boolean) : boolean`

**Description:** Copies a file on the server from one place rootUrl/origin to the other rootUrl/destination. If the passed parameter overwrite is true and destination already exists it gets overwritten. Returns true if succeeded, otherwise false.

**Parameters:**

- `origin`: The origin where a file is located, relative to the rootUrl stated when instantiating the client.
- `destination`: The destination where the file should be copied to, relative to the rootUrl stated when instantiating the client.
- `overwrite`: A flag which determines whether the destination gets overwritten if it exists before copying.

**Returns:**

true if succeeded, otherwise false.

---

### copy

**Signature:** `copy(origin : String, destination : String, overwrite : boolean, shallow : boolean) : boolean`

**Description:** Copies a file on the server from one place rootUrl/origin to the other rootUrl/destination. If the passed parameter overwrite is true and destination already exists it gets overwritten. If the passed parameter shallow is true a flat copy mechanism is used. Returns true if succeeded, otherwise false.

**Parameters:**

- `origin`: The origin where a file is located, relative to the rootUrl stated when instantiating the client.
- `destination`: The destination where the file should be copied to, relative to the rootUrl stated when instantiating the client.
- `overwrite`: A flag which determines whether the destination gets overwritten if it exits before copying
- `shallow`: A flag which determines how to copy the given data.

**Returns:**

true if succeeded, otherwise false.

---

### del

**Signature:** `del(path : String) : boolean`

**Description:** Deletes a file or directory from the remote server that can be found under rootUrl/path. Returns true if succeeded, otherwise false.

**Parameters:**

- `path`: The path of the file or collection to delete, relative to the rootUrl stated when instantiating the client.

**Returns:**

true if succeeded, otherwise false.

---

### get

**Signature:** `get(path : String) : String`

**Description:** Reads the content of a remote file or directory that can be found under rootUrl/path and returns a string representation of the data found in the DEFAULT_ENCODING encoding. If the remote location is a directory the result depends on the server configuration, some return an HTML formatted directory listing. Returns at most DEFAULT_GET_STRING_SIZE bytes.

**Parameters:**

- `path`: The path of the collection or file one wants to get, relative to the rootUrl stated when instantiating the client.

**Returns:**

returns the String representation of the data found on the given path.

---

### get

**Signature:** `get(path : String, encoding : String) : String`

**Description:** Reads the content of a remote file or directory that can be found under rootUrl/path and returns a string representation of the data found in the given encoding. If the remote location is a directory the result depends on the server configuration, some return an HTML formatted directory listing. Returns at most DEFAULT_GET_STRING_SIZE bytes.

**Parameters:**

- `path`: The path of the collection or file one wants to get - relative to the rootUrl stated when instantiating the client.
- `encoding`: The encoding of the resulting String.

**Returns:**

returns the String representation of the data found on the given path in the given encoding.

---

### get

**Signature:** `get(path : String, encoding : String, maxGetSize : Number) : String`

**Description:** Reads the content of a remote file or directory that can be found under rootUrl/path and returns a string representation of the data found in the given encoding. If the remote location is a directory the result depends on the server configuration, some return an HTML formatted directory listing. Returns at most maxGetSize bytes.

**Parameters:**

- `path`: The path of the collection or file one wants to get - relative to the rootUrl stated when instantiating the client.
- `encoding`: The encoding of the resulting String.
- `maxGetSize`: The maximum size of data in bytes. Not to exceed MAX_GET_STRING_SIZE.

**Returns:**

returns the String representation of the data found on the given path in the given encoding.

---

### get

**Signature:** `get(path : String, file : File) : boolean`

**Description:** Reads the content of a remote file or directory that can be found under rootUrl/path in DEFAULT_ENCODING encoding and writes a File in the system's standard encoding, which is "UTF-8". If the remote location is a directory the result depends on the server configuration, some return an HTML formatted directory listing. Receives at most DEFAULT_GET_FILE_SIZE bytes which determines the file size of the local file. Returns true if succeeded otherwise false.

**Parameters:**

- `path`: The path of the collection or file one wants to get - relative to the rootUrl stated when instantiating the client.
- `file`: The file to save the received data in.

**Returns:**

returns true if succeeded, otherwise false.

---

### get

**Signature:** `get(path : String, file : File, maxFileSize : Number) : boolean`

**Description:** Reads the content of a remote file or directory that can be found under rootUrl/path in DEFAULT_ENCODING encoding and writes a File in the system's standard encoding, which is "UTF-8". If the remote location is a directory the result depends on the server configuration, some return an HTML formatted directory listing. Receives at most maxFileSize bytes which determines the file size of the local file. Returns true if succeeded, otherwise false.

**Parameters:**

- `path`: The path of the collection or file one wants to get - relative to the rootUrl stated when instantiating the client.
- `file`: The file to save the received data in.
- `maxFileSize`: The maximum size of bytes to stream into the file. Not to exceed MAX_GET_FILE_SIZE.

**Returns:**

returns true if succeeded, otherwise false.

---

### get

**Signature:** `get(path : String, file : File, encoding : String, maxFileSize : Number) : boolean`

**Description:** Reads the content of a remote file or directory that can be found under rootUrl/path in the passed encoding and writes a File in the system standard encoding, which is "UTF-8". If the remote location is a directory the result depends on the server configuration, some return an HTML formatted directory listing. Receives at most maxFileSize bytes which determines the file size of the local file. Returns true if succeeded, otherwise false.

**Parameters:**

- `path`: The path of the collection or file one wants to get - relative to the rootUrl stated when instantiating the client.
- `file`: The file to save the received data in.
- `encoding`: The encoding to use when reading the remote file.
- `maxFileSize`: The maximum number of bytes to stream into the file. Not to exceed MAX_GET_FILE_SIZE.

**Returns:**

returns true if succeeded, otherwise false.

---

### getAllResponseHeaders

**Signature:** `getAllResponseHeaders() : HashMap`

**Description:** Returns a HashMap of all response headers.

**Returns:**

all headers in a HashMap.

---

### getBinary

**Signature:** `getBinary(path : String, file : File) : boolean`

**Description:** Reads the content of a remote binary file that can be found under rootUrl/path and creates a local copy in File. If the remote location is a directory the result depends on the server configuration, some return an HTML formatted directory listing. Copies at most DEFAULT_GET_FILE_SIZE bytes. Returns true if succeeded, otherwise false.

**Parameters:**

- `path`: The path relative to rootUrl on the remote server including the file name.
- `file`: The local file where the received binary data should be stored.

**Returns:**

true if succeeded, otherwise false.

---

### getBinary

**Signature:** `getBinary(path : String, file : File, maxFileSize : Number) : boolean`

**Description:** Reads the content of a remote binary file that can be found under rootUrl/path and creates a local copy in File. If the remote location is a directory the result depends on the server configuration, some return an HTML formatted directory listing. Copies at most maxFileSize bytes. Returns true if succeeded, otherwise false.

**Parameters:**

- `path`: The path relative to rootUrl on the remote server including the file name.
- `file`: The file local file where the received binary data should be stored.
- `maxFileSize`: The maximum number of bytes to stream into the file. Not to exceed MAX_GET_FILE_SIZE.

**Returns:**

true if succeeded, otherwise false.

---

### getResponseHeader

**Signature:** `getResponseHeader(header : String) : String`

**Description:** Returns a specified response header - multiple headers are separated by CRLF.

**Parameters:**

- `header`: The name of the header.

**Returns:**

The header - in case of multiple headers separated by CRLF.

---

### getStatusCode

**Signature:** `getStatusCode() : Number`

**Description:** Returns the status code after the execution of a method.

**Returns:**

the statusCode.

---

### getStatusText

**Signature:** `getStatusText() : String`

**Description:** Returns the status text after the execution of a method.

**Returns:**

the statusText.

---

### mkcol

**Signature:** `mkcol(path : String) : boolean`

**Description:** Creates a directory on the remote server on the location rootUrl/path.

**Parameters:**

- `path`: The path relative to the rootUrl stated when instantiating the client where the new collection should be created.

**Returns:**

true if succeeded, otherwise false.

---

### move

**Signature:** `move(origin : String, destination : String) : boolean`

**Description:** Moves a file on the server from one place rootUrl + "/" +origin to the other rootUrl/destination. If destination already exists it gets overwritten. Can also be used to rename a remote file. Returns true if succeeded, otherwise false.

**Parameters:**

- `origin`: The origin where a file is located, relative to the rootUrl stated when instantiating the client.
- `destination`: The destination where the file should be moved to, relative to the rootUrl stated when instantiating the client.

**Returns:**

true if succeeded, otherwise false.

---

### move

**Signature:** `move(origin : String, destination : String, overwrite : boolean) : boolean`

**Description:** Moves a file on the server from one place rootUrl/origin to the other rootUrl/destination Can also be used to rename a remote file. If overwrite is true and destination already exists it gets overwritten. Returns true if succeeded, otherwise false.

**Parameters:**

- `origin`: The origin where a file is located, relative to the rootUrl stated when instantiating the client.
- `destination`: The destination where the file should be moved to, relative to the rootUrl stated when instantiating the client.
- `overwrite`: A flag which determines whether the destination gets overwritten if it exists before moving.

**Returns:**

true if succeeded, otherwise false.

---

### options

**Signature:** `options(path : String) : String[]`

**Description:** Returns a list of methods which can be executed on the server location rootUrl/path.

**Parameters:**

- `path`: The path relative to the rootUrl stated when instantiating the client one wants to get the options for.

**Returns:**

list of WebDav methods which can be executed on the given path.

---

### propfind

**Signature:** `propfind(path : String) : WebDAVFileInfo[]`

**Description:** Get file listing of a remote location. Returns a list of WebDAVFileInfo objects which contain information about the files and directories located on rootUrl/path and DEPTH_1 (1) level underneath.

**Parameters:**

- `path`: The path relative to the rootUrl stated when instantiating the client where to get information about the containing files from.

**Returns:**

an Array of WebDAVFileInfo objects which hold information about the files located on the server at the location.

---

### propfind

**Signature:** `propfind(path : String, depth : Number) : WebDAVFileInfo[]`

**Description:** Get file listing of a remote location. Returns a list of WebDAVFileInfo objects which contain information about the files and directories located on rootUrl/path and the passed depth underneath.

**Parameters:**

- `path`: The path relative to the rootUrl stated when instantiating the client where to get information about the containing files from.
- `depth`: The level starting from rootUrl down to which the file information gets collected.

**Returns:**

an Array of WebDAVFileInfo objects which hold information about the files located on the server at the location.

---

### put

**Signature:** `put(path : String, content : String) : boolean`

**Description:** Puts content encoded with DEFAULT_ENCODING into a remote located file at rootUrl/path. Returns true if succeeded, otherwise false. If the content of a local file is to be uploaded, please use method put(String, File) instead.

**Parameters:**

- `path`: The path to put given content up to, relative to the rootUrl stated when instantiating the client.
- `content`: The content that has to be pushed on to the server.

**Returns:**

true if succeeded, otherwise false.

---

### put

**Signature:** `put(path : String, content : String, encoding : String) : boolean`

**Description:** Puts content encoded with the passed encoding into a remote located file at rootUrl/path. Returns true if succeeded, otherwise false. If the content of a local file is to be uploaded, please use method put(String, File) instead.

**Parameters:**

- `path`: The path to put a given content up to, relative to the rootUrl stated when instantiating the client.
- `content`: The content that has to be pushed on to a remote location.
- `encoding`: The encoding in which the data should be stored on the server.

**Returns:**

true if succeeded, otherwise false.

---

### put

**Signature:** `put(path : String, file : File) : boolean`

**Description:** Puts content out of a passed local file into a remote located file at rootUrl/path. This method performs a binary file transfer. Returns true if succeeded, otherwise false.

**Parameters:**

- `path`: The path to put given content up to, relative to the rootUrl stated when instantiating the client.
- `file`: The file to push up to the server.

**Returns:**

true if succeeded, otherwise false.

---

### succeeded

**Signature:** `succeeded() : boolean`

**Description:** Returns true if the last executed WebDAV method was executed successfully - otherwise false. See the code snippet above for an example how to use the succeed() method.

**Returns:**

true if the last executed WebDAV method was successful - otherwise false.

**See Also:**

WebDAVClient

---
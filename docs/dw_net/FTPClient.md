## Package: dw.net

# Class FTPClient

## Inheritance Hierarchy

- Object
  - dw.net.FTPClient

## Description

The FTPClient class supports the FTP commands CD, GET, PUT, DEL, MKDIR, RENAME, and LIST. The FTP connection is established using passive transfer mode (PASV). The transfer of files can be text or binary. Note: when this class is used with sensitive data, be careful in persisting sensitive information to disk. An example usage is as follows: var ftp : FTPClient = new dw.net.FTPClient(); ftp.connect("my.ftp-server.com", "username", "password"); var data : String = ftp.get("simple.txt"); ftp.disconnect(); The default connection timeout depends on the script context timeout and will be set to a maximum of 30 seconds (default script context timeout is 10 seconds within storefront requests and 15 minutes within jobs). IMPORTANT NOTE: Before you can make an outbound FTP connection, the FTP server IP address must be enabled for outbound traffic at the Commerce Cloud Digital firewall for your POD. Please file a support request to request a new firewall rule.

## Constants

### DEFAULT_GET_FILE_SIZE

**Type:** Number = 5242880

The default size for get() returning a File is 5MB

### DEFAULT_GET_STRING_SIZE

**Type:** Number = 2097152

The default size for get() returning a String is 2MB

### MAX_GET_FILE_SIZE

**Type:** Number = 209715200

The maximum size for get() returning a File is forty times the default size for getting a file. The largest file allowed is 200MB.

### MAX_GET_STRING_SIZE

**Type:** Number = 10485760

The maximum size for get() returning a String is five times the default size for getting a String. The largest String allowed is 10MB.

## Properties

### connected

**Type:** boolean (Read Only)

Identifies if the FTP client is currently connected to the FTP server.

### replyCode

**Type:** Number (Read Only)

The reply code from the last FTP action.

### replyMessage

**Type:** String (Read Only)

The string message from the last FTP action.

### timeout

**Type:** Number

The timeout for this client, in milliseconds.

## Constructor Summary

FTPClient() Constructs the FTPClient instance.

## Method Summary

### cd

**Signature:** `cd(path : String) : boolean`

Changes the current directory on the remote server to the given path.

### connect

**Signature:** `connect(host : String) : boolean`

Connects and logs on to an FTP Server as "anonymous" and returns a boolean indicating success or failure.

### connect

**Signature:** `connect(host : String, user : String, password : String) : boolean`

Connects and logs on to an FTP server and returns a boolean indicating success or failure.

### connect

**Signature:** `connect(host : String, port : Number) : boolean`

Connects and logs on to an FTP Server as "anonymous" and returns a boolean indicating success or failure.

### connect

**Signature:** `connect(host : String, port : Number, user : String, password : String) : boolean`

Connects and logs on to an FTP server and returns a boolean indicating success or failure.

### del

**Signature:** `del(path : String) : boolean`

Deletes the remote file on the server identified by the path parameter.

### disconnect

**Signature:** `disconnect() : void`

The method first logs the current user out from the server and then disconnects from the server.

### get

**Signature:** `get(path : String) : String`

Reads the content of a remote file and returns it as a string using "ISO-8859-1" encoding to read it.

### get

**Signature:** `get(path : String, encoding : String) : String`

Reads the content of a remote file and returns it as string using the passed encoding.

### get

**Signature:** `get(path : String, maxGetSize : Number) : String`

Reads the content of a remote file and returns it as a string using "ISO-8859-1" encoding to read it.

### get

**Signature:** `get(path : String, encoding : String, maxGetSize : Number) : String`

Reads the content of a remote file and returns it as a string using the specified encoding.

### get

**Signature:** `get(path : String, encoding : String, file : File) : boolean`

Reads the content of a remote file and creates a local copy in the given file using the passed string encoding to read the file content and using the system standard encoding "UTF-8" to write the file.

### get

**Signature:** `get(path : String, encoding : String, file : File, maxGetSize : Number) : boolean`

Reads the content of a remote file and creates a local copy in the given file using the passed string encoding to read the file content and using the system standard encoding "UTF-8" to write the file.

### getBinary

**Signature:** `getBinary(path : String, file : File) : boolean`

Reads the content of a remote file and creates a local copy in the given file.

### getBinary

**Signature:** `getBinary(path : String, file : File, maxGetSize : Number) : boolean`

Reads the content of a remote file and creates a local copy in the given file.

### getConnected

**Signature:** `getConnected() : boolean`

Identifies if the FTP client is currently connected to the FTP server.

### getReplyCode

**Signature:** `getReplyCode() : Number`

Returns the reply code from the last FTP action.

### getReplyMessage

**Signature:** `getReplyMessage() : String`

Returns the string message from the last FTP action.

### getTimeout

**Signature:** `getTimeout() : Number`

Returns the timeout for this client, in milliseconds.

### list

**Signature:** `list() : FTPFileInfo[]`

Returns a list of FTPFileInfo objects containing information about the files in the current directory.

### list

**Signature:** `list(path : String) : FTPFileInfo[]`

Returns a list of FTPFileInfo objects containing information about the files in the remote directory defined by the given path.

### mkdir

**Signature:** `mkdir(path : String) : boolean`

Creates a directory

### put

**Signature:** `put(path : String, content : String) : boolean`

Puts the specified content to the specified full path using "ISO-8859-1" encoding.

### put

**Signature:** `put(path : String, content : String, encoding : String) : boolean`

Put the given content to a file on the given full path on the FTP server.

### putBinary

**Signature:** `putBinary(path : String, file : File) : boolean`

Put the content of the given file into a file on the remote FTP server with the given full path.

### removeDirectory

**Signature:** `removeDirectory(path : String) : boolean`

Deletes the remote directory on the server identified by the path parameter.

### rename

**Signature:** `rename(from : String, to : String) : boolean`

Renames an existing file.

### setTimeout

**Signature:** `setTimeout(timeoutMillis : Number) : void`

Sets the timeout for connections made with the FTP client to the given number of milliseconds.

## Constructor Detail

## Method Detail

## Method Details

### cd

**Signature:** `cd(path : String) : boolean`

**Description:** Changes the current directory on the remote server to the given path.

**Parameters:**

- `path`: the new current directory

**Returns:**

true if the directory change was okay

---

### connect

**Signature:** `connect(host : String) : boolean`

**Description:** Connects and logs on to an FTP Server as "anonymous" and returns a boolean indicating success or failure.

**Parameters:**

- `host`: Name of the FTP sever

**Returns:**

true when connection is successful, false otherwise.

---

### connect

**Signature:** `connect(host : String, user : String, password : String) : boolean`

**Description:** Connects and logs on to an FTP server and returns a boolean indicating success or failure.

**Parameters:**

- `host`: Name of the FTP sever
- `user`: Username for the login
- `password`: Password for the login

**Returns:**

true when connection is successful, false otherwise.

---

### connect

**Signature:** `connect(host : String, port : Number) : boolean`

**Description:** Connects and logs on to an FTP Server as "anonymous" and returns a boolean indicating success or failure.

**Parameters:**

- `host`: Name of the FTP sever
- `port`: Port for FTP server

**Returns:**

true when connection is successful, false otherwise.

---

### connect

**Signature:** `connect(host : String, port : Number, user : String, password : String) : boolean`

**Description:** Connects and logs on to an FTP server and returns a boolean indicating success or failure.

**Parameters:**

- `host`: Name of the FTP sever
- `port`: Port for FTP server
- `user`: Username for the login
- `password`: Password for the login

**Returns:**

true when connection is successful, false otherwise.

---

### del

**Signature:** `del(path : String) : boolean`

**Description:** Deletes the remote file on the server identified by the path parameter.

**Parameters:**

- `path`: the path to the file.

**Returns:**

true if the file was successfully deleted, false otherwise.

---

### disconnect

**Signature:** `disconnect() : void`

**Description:** The method first logs the current user out from the server and then disconnects from the server.

---

### get

**Signature:** `get(path : String) : String`

**Description:** Reads the content of a remote file and returns it as a string using "ISO-8859-1" encoding to read it. Read at most MAX_GET_STRING_SIZE bytes.

**Parameters:**

- `path`: remote path of the file to be read.

**Returns:**

the contents of the file or null if an error occurred while reading the file.

---

### get

**Signature:** `get(path : String, encoding : String) : String`

**Description:** Reads the content of a remote file and returns it as string using the passed encoding. Read at most MAX_GET_STRING_SIZE characters.

**Parameters:**

- `path`: remote path of the file to be read.
- `encoding`: an ISO 8859 character encoding labeled as a string, e.g. "ISO-8859-1"

**Returns:**

the contents of the file or null if an error occurred while reading the file.

---

### get

**Signature:** `get(path : String, maxGetSize : Number) : String`

**Description:** Reads the content of a remote file and returns it as a string using "ISO-8859-1" encoding to read it. Read at most maxGetSize characters.

**Deprecated:**

The maxGetSize attribute is not supported anymore. Use the method get(String) instead.

**Parameters:**

- `path`: remote path of the file to be read.
- `maxGetSize`: the maximum bytes fetched from the remote file.

**Returns:**

the contents of the file or null if an error occurred while reading the file.

---

### get

**Signature:** `get(path : String, encoding : String, maxGetSize : Number) : String`

**Description:** Reads the content of a remote file and returns it as a string using the specified encoding. Returns at most maxGetSize characters.

**Deprecated:**

The maxGetSize attribute is not supported anymore. Use the method get(String, String) instead.

**Parameters:**

- `path`: remote path of the file to be read.
- `encoding`: the encoding to use.
- `maxGetSize`: the maximum bytes fetched from the remote file.

**Returns:**

the contents of the file or null if an error occurred while reading the file.

---

### get

**Signature:** `get(path : String, encoding : String, file : File) : boolean`

**Description:** Reads the content of a remote file and creates a local copy in the given file using the passed string encoding to read the file content and using the system standard encoding "UTF-8" to write the file. Copies at most MAX_GET_FILE_SIZE bytes.

**Parameters:**

- `path`: remote path of the file to be read.
- `encoding`: the encoding to use.
- `file`: the local file name

**Returns:**

true if remote file is fetched and copied into local file.

---

### get

**Signature:** `get(path : String, encoding : String, file : File, maxGetSize : Number) : boolean`

**Description:** Reads the content of a remote file and creates a local copy in the given file using the passed string encoding to read the file content and using the system standard encoding "UTF-8" to write the file. Copies at most maxGetSize bytes.

**Deprecated:**

The maxGetSize attribute is not supported anymore. Use the method get(String, String, File) instead.

**Parameters:**

- `path`: remote path of the file to be read.
- `encoding`: the encoding to use.
- `file`: the local file name
- `maxGetSize`: the maximum number of bytes to fetch

**Returns:**

true if remote file is fetched and copied into local file.

---

### getBinary

**Signature:** `getBinary(path : String, file : File) : boolean`

**Description:** Reads the content of a remote file and creates a local copy in the given file. Copies at most MAX_GET_FILE_SIZE bytes. The FTP transfer is done in Binary mode.

**Parameters:**

- `path`: remote path of the file to be read.
- `file`: the local file name

**Returns:**

true if remote file is fetched and copied into local file.

---

### getBinary

**Signature:** `getBinary(path : String, file : File, maxGetSize : Number) : boolean`

**Description:** Reads the content of a remote file and creates a local copy in the given file. Copies at most maxGetSize bytes. The FTP transfer is done in Binary mode.

**Deprecated:**

The maxGetSize attribute is not supported anymore. Use the method getBinary(String, File) instead.

**Parameters:**

- `path`: remote path of the file to be read.
- `file`: the local file name
- `maxGetSize`: the maximum number of bytes to fetch

**Returns:**

true if remote file is fetched and copied into local file.

---

### getConnected

**Signature:** `getConnected() : boolean`

**Description:** Identifies if the FTP client is currently connected to the FTP server.

**Returns:**

true if the client is currently connected.

---

### getReplyCode

**Signature:** `getReplyCode() : Number`

**Description:** Returns the reply code from the last FTP action.

**Returns:**

the reply code from the last FTP action.

---

### getReplyMessage

**Signature:** `getReplyMessage() : String`

**Description:** Returns the string message from the last FTP action.

**Returns:**

the string message from the last FTP action.

---

### getTimeout

**Signature:** `getTimeout() : Number`

**Description:** Returns the timeout for this client, in milliseconds.

**Returns:**

the timeout in milliseconds

---

### list

**Signature:** `list() : FTPFileInfo[]`

**Description:** Returns a list of FTPFileInfo objects containing information about the files in the current directory.

**Returns:**

list of objects with remote file information.

---

### list

**Signature:** `list(path : String) : FTPFileInfo[]`

**Description:** Returns a list of FTPFileInfo objects containing information about the files in the remote directory defined by the given path.

**Parameters:**

- `path`: the remote path from which the file info is listed.

**Returns:**

list of objects with remote file information.

---

### mkdir

**Signature:** `mkdir(path : String) : boolean`

**Description:** Creates a directory

**Parameters:**

- `path`: the path to the directory to create.

**Returns:**

true if the directory was successfully created, false otherwise.

---

### put

**Signature:** `put(path : String, content : String) : boolean`

**Description:** Puts the specified content to the specified full path using "ISO-8859-1" encoding. The full path must include the path and the file name. If the content of a local file is to be uploaded, please use method putBinary(String, File) instead.

**Parameters:**

- `path`: full path on the remote FTP server where the file will be stored.
- `content`: the content to put.

**Returns:**

true or false indicating success or failure.

---

### put

**Signature:** `put(path : String, content : String, encoding : String) : boolean`

**Description:** Put the given content to a file on the given full path on the FTP server. The full path must include the path and the file name. The transformation from String into binary data is done via the encoding provided with the method call. If the content of a local file is to be uploaded, please use method putBinary(String, File) instead.

**Parameters:**

- `path`: the full path on the remote FTP server where the file will be stored.
- `content`: the content to put.
- `encoding`: the encoding to use.

**Returns:**

true or false indicating success or failure.

---

### putBinary

**Signature:** `putBinary(path : String, file : File) : boolean`

**Description:** Put the content of the given file into a file on the remote FTP server with the given full path. The full path must include the path and the file name.

**Parameters:**

- `path`: the full path on the remote FTP server where the file will be stored.
- `file`: the file on the local system, which content is send to the remote FTP server.

**Returns:**

true or false indicating success or failure.

---

### removeDirectory

**Signature:** `removeDirectory(path : String) : boolean`

**Description:** Deletes the remote directory on the server identified by the path parameter. In order to delete the directory successfully the directory needs to be empty, otherwise the removeDirectory() method will return false.

**Parameters:**

- `path`: the path to the directory.

**Returns:**

true if the directory was successfully deleted, false otherwise.

---

### rename

**Signature:** `rename(from : String, to : String) : boolean`

**Description:** Renames an existing file.

**Parameters:**

- `from`: the file that will be renamed.
- `to`: the name of the new file.

**Returns:**

true if the file was successfully renamed, false otherwise.

---

### setTimeout

**Signature:** `setTimeout(timeoutMillis : Number) : void`

**Description:** Sets the timeout for connections made with the FTP client to the given number of milliseconds. If the given timeout is less than or equal to zero, the timeout is set to the same value as the script context timeout but will only be set to a maximum of 30 seconds. The maximum and default timeout depend on the script context timeout. The maximum timeout is set to a maximum of 2 minutes. The default timeout for a new client is set to a maximum of 30 seconds. This method can be called at any time, and will affect the next connection made with this client. It is not possible to set the timeout for an open connection.

**Parameters:**

- `timeoutMillis`: timeout, in milliseconds, up to a maximum of 2 minutes.

---
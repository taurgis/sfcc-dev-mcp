## Package: dw.net

# Class SFTPClient

## Inheritance Hierarchy

- Object
  - dw.net.SFTPClient

## Description

The SFTPClient class supports the SFTP commands GET, PUT, DEL, MKDIR, RENAME, and LIST. The transfer of files can be text or binary. Note: when this class is used with sensitive data, be careful in persisting sensitive information. An example usage is as follows: var sftp : SFTPClient = new dw.net.SFTPClient(); sftp.connect("my.sftp-server.com", "username", "password"); var data : String = sftp.get("simple.txt"); sftp.disconnect(); The default connection timeout depends on the script context timeout and will be set to a maximum of 30 seconds (default script context timeout is 10 seconds within storefront requests and 15 minutes within jobs). IMPORTANT NOTE: Before you can make an outbound SFTP connection to a port other than 22, the SFTP server IP address must be enabled for outbound traffic at the Commerce Cloud Digital firewall for your POD. Please file a support request to request a new firewall rule. SSH Version 2 is supported with the following algorithms: TypeAlgorithms Host Keyssh-ed25519, ecdsa-sha2-nistp256, ecdsa-sha2-nistp384, ecdsa-sha2-nistp521, rsa-sha2-512, rsa-sha2-256, ssh-rsa, ssh-dss Key Exchange (KEX)curve25519-sha256, curve25519-sha256@libssh.org, ecdh-sha2-nistp256, ecdh-sha2-nistp384, ecdh-sha2-nistp521, diffie-hellman-group-exchange-sha256, diffie-hellman-group16-sha512, diffie-hellman-group18-sha512, diffie-hellman-group14-sha256, diffie-hellman-group14-sha1, diffie-hellman-group-exchange-sha1, diffie-hellman-group1-sha1 Cipheraes128-ctr, aes192-ctr, aes256-ctr, aes128-gcm@openssh.com, aes256-gcm@openssh.com, aes128-cbc, 3des-ctr, 3des-cbc, blowfish-cbc, aes192-cbc, aes256-cbc Message Authentication Code (MAC)hmac-sha2-256-etm@openssh.com, hmac-sha2-512-etm@openssh.com, hmac-sha1-etm@openssh.com, hmac-sha2-256, hmac-sha2-512, hmac-sha1, hmac-md5, hmac-sha1-96, hmac-md5-96 Public Key Authenticationrsa-sha2-512, rsa-sha2-256, ssh-rsa

## Constants

## Properties

### connected

**Type:** boolean (Read Only)

Identifies if the SFTP client is currently connected to the SFTP server.

### errorMessage

**Type:** String (Read Only)

The error message from the last SFTP action.

### identity

**Type:** KeyRef

Gets the identity (private key) used for the connection.
 
 The key is only associated to this instance of the SFTP client.

### timeout

**Type:** Number

The timeout for this client, in milliseconds.

## Constructor Summary

SFTPClient() Constructor.

## Method Summary

### addKnownHostKey

**Signature:** `addKnownHostKey(type : String, key : String) : void`

Adds a known public host key for the next connection attempt.

### cd

**Signature:** `cd(path : String) : boolean`

Changes the current directory on the remote server to the given path.

### connect

**Signature:** `connect(host : String, user : String, password : String) : boolean`

Connects and logs on to a SFTP server and returns a boolean indicating success or failure.

### connect

**Signature:** `connect(host : String, port : Number, user : String, password : String) : boolean`

Connects and logs on to a SFTP server and returns a boolean indicating success or failure.

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

Reads the content of a remote file and returns it as a string using the specified encoding.

### get

**Signature:** `get(path : String, encoding : String, file : File) : boolean`

Reads the content of a remote file and creates a local copy in the given file using the passed string encoding to read the file content and using the system standard encoding "UTF-8" to write the file.

### getBinary

**Signature:** `getBinary(path : String, file : File) : boolean`

Reads the content of a remote file and creates a local copy in the given file.

### getConnected

**Signature:** `getConnected() : boolean`

Identifies if the SFTP client is currently connected to the SFTP server.

### getErrorMessage

**Signature:** `getErrorMessage() : String`

Returns the error message from the last SFTP action.

### getFileInfo

**Signature:** `getFileInfo(path : String) : SFTPFileInfo`

Returns a SFTPFileInfo objects containing information about the given file/directory path.

### getIdentity

**Signature:** `getIdentity() : KeyRef`

Gets the identity (private key) used for the connection.

### getTimeout

**Signature:** `getTimeout() : Number`

Returns the timeout for this client, in milliseconds.

### list

**Signature:** `list() : SFTPFileInfo[]`

Returns a list of SFTPFileInfo objects containing information about the files in the current directory.

### list

**Signature:** `list(path : String) : SFTPFileInfo[]`

Returns a list of SFTPFileInfo objects containing information about the files in the remote directory defined by the given path.

### mkdir

**Signature:** `mkdir(path : String) : boolean`

Creates a directory

### put

**Signature:** `put(path : String, content : String) : boolean`

Puts the specified content to the specified path using "ISO-8859-1" encoding.

### put

**Signature:** `put(path : String, content : String, encoding : String) : boolean`

Put the given content to a file on the given path on the SFTP server.

### putBinary

**Signature:** `putBinary(path : String, file : File) : boolean`

Put the content of the given file into a file on the remote SFTP server with the given absolute path.

### removeDirectory

**Signature:** `removeDirectory(path : String) : boolean`

Deletes the remote directory on the server identified by the path parameter.

### rename

**Signature:** `rename(from : String, to : String) : boolean`

Renames an existing file.

### setIdentity

**Signature:** `setIdentity(keyRef : KeyRef) : void`

Sets the identity (private key) to use for the next connection attempt.

### setTimeout

**Signature:** `setTimeout(timeoutMillis : Number) : void`

Sets the timeout for connections made with the SFTP client to the given number of milliseconds.

## Constructor Detail

## Method Detail

## Method Details

### addKnownHostKey

**Signature:** `addKnownHostKey(type : String, key : String) : void`

**Description:** Adds a known public host key for the next connection attempt. This method associates the key to the host used in the subsequent connect method, and must be called prior to connect. The key is not persisted, and is only associated to this instance of the SFTP client. Multiple keys may be added, and the validation will succeed if the remote host matches any of them. The default behavior is to persist and trust an unknown host key if there are no known host keys available. If addKnownHostKey is later used to trust specific a specific key or keys, then any previously persisted keys will be ignored.

**Parameters:**

- `type`: Type of the host key, such as ssh-rsa
- `key`: Public host key, in the same format as OpenSSH.

---

### cd

**Signature:** `cd(path : String) : boolean`

**Description:** Changes the current directory on the remote server to the given path.

**Parameters:**

- `path`: the new current directory

**Returns:**

true if the directory change was okay

---

### connect

**Signature:** `connect(host : String, user : String, password : String) : boolean`

**Description:** Connects and logs on to a SFTP server and returns a boolean indicating success or failure.

**Parameters:**

- `host`: Name of the SFTP sever
- `user`: Username for the login
- `password`: Password for the login

**Returns:**

true when connection is successful, false otherwise.

---

### connect

**Signature:** `connect(host : String, port : Number, user : String, password : String) : boolean`

**Description:** Connects and logs on to a SFTP server and returns a boolean indicating success or failure.

**Parameters:**

- `host`: Name of the SFTP sever
- `port`: Port for SFTP server
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

**Description:** Reads the content of a remote file and returns it as a string using "ISO-8859-1" encoding to read it. Files with at most MAX_GET_STRING_SIZE bytes are read.

**Parameters:**

- `path`: remote path of the file to be read.

**Returns:**

the contents of the file or null if an error occurred while reading the file.

---

### get

**Signature:** `get(path : String, encoding : String) : String`

**Description:** Reads the content of a remote file and returns it as a string using the specified encoding. Files with at most MAX_GET_STRING_SIZE bytes are read.

**Parameters:**

- `path`: the remote path of the file to be read.
- `encoding`: the encoding to use.

**Returns:**

the contents of the file or null if an error occurred while reading the file.

---

### get

**Signature:** `get(path : String, encoding : String, file : File) : boolean`

**Description:** Reads the content of a remote file and creates a local copy in the given file using the passed string encoding to read the file content and using the system standard encoding "UTF-8" to write the file. Copies at most MAX_GET_FILE_SIZE bytes.

**Parameters:**

- `path`: the remote path of the file to be read.
- `encoding`: the encoding to use.
- `file`: the local file name

**Returns:**

true if complete remote file is fetched and copied into local file. false, otherwise.

---

### getBinary

**Signature:** `getBinary(path : String, file : File) : boolean`

**Description:** Reads the content of a remote file and creates a local copy in the given file. Copies at most MAX_GET_FILE_SIZE bytes. The SFTP transfer is done in binary mode.

**Parameters:**

- `path`: the remote path of the file to be read.
- `file`: the local file name

**Returns:**

true if complete remote file is fetched and copied into local file. false otherwise

---

### getConnected

**Signature:** `getConnected() : boolean`

**Description:** Identifies if the SFTP client is currently connected to the SFTP server.

**Returns:**

true if the client is currently connected.

---

### getErrorMessage

**Signature:** `getErrorMessage() : String`

**Description:** Returns the error message from the last SFTP action.

**Returns:**

the error message from the last SFTP action

---

### getFileInfo

**Signature:** `getFileInfo(path : String) : SFTPFileInfo`

**Description:** Returns a SFTPFileInfo objects containing information about the given file/directory path.

**Parameters:**

- `path`: the remote path from which the file info should be listed.

**Returns:**

the remote file information or null if not present.

---

### getIdentity

**Signature:** `getIdentity() : KeyRef`

**Description:** Gets the identity (private key) used for the connection. The key is only associated to this instance of the SFTP client.

**Returns:**

Reference to the private key, or null if not configured

---

### getTimeout

**Signature:** `getTimeout() : Number`

**Description:** Returns the timeout for this client, in milliseconds.

**Returns:**

the timeout in milliseconds

---

### list

**Signature:** `list() : SFTPFileInfo[]`

**Description:** Returns a list of SFTPFileInfo objects containing information about the files in the current directory.

**Returns:**

list of objects with remote file information or null if not present.

---

### list

**Signature:** `list(path : String) : SFTPFileInfo[]`

**Description:** Returns a list of SFTPFileInfo objects containing information about the files in the remote directory defined by the given path.

**Parameters:**

- `path`: the remote path from which the file info should be listed.

**Returns:**

list of objects with remote file information or null if not present.

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

**Description:** Puts the specified content to the specified path using "ISO-8859-1" encoding. If the content of a local file is to be uploaded, please use method putBinary(String,File) instead. NOTE: If the remote file already exists, it is overwritten.

**Parameters:**

- `path`: the path on the remote SFTP server, where the file will be stored.
- `content`: the content to put.

**Returns:**

true or false indicating success or failure.

---

### put

**Signature:** `put(path : String, content : String, encoding : String) : boolean`

**Description:** Put the given content to a file on the given path on the SFTP server. The transformation from String into binary data is done via the encoding provided with the method call. If the content of a local file is to be uploaded, please use method putBinary(String,File) instead. NOTE: If the remote file already exists, it is overwritten.

**Parameters:**

- `path`: the path on the remote SFTP server, where the file will be stored.
- `content`: the content to put.
- `encoding`: the encoding to use.

**Returns:**

true or false indicating success or failure.

---

### putBinary

**Signature:** `putBinary(path : String, file : File) : boolean`

**Description:** Put the content of the given file into a file on the remote SFTP server with the given absolute path. NOTE: If the remote file already exists, it is overwritten.

**Parameters:**

- `path`: the path on the remote SFTP server where the file will be stored.
- `file`: the file on the local system, which content is send to the remote SFTP server.

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

### setIdentity

**Signature:** `setIdentity(keyRef : KeyRef) : void`

**Description:** Sets the identity (private key) to use for the next connection attempt. The key is only associated to this instance of the SFTP client.

**Parameters:**

- `keyRef`: Reference to the private key

---

### setTimeout

**Signature:** `setTimeout(timeoutMillis : Number) : void`

**Description:** Sets the timeout for connections made with the SFTP client to the given number of milliseconds. If the given timeout is less than or equal to zero, the timeout is set to the same value as the script context timeout but will only be set to a maximum of 30 seconds. The maximum and default timeout depend on the script context timeout. The maximum timeout is set to a maximum of 2 minutes. The default timeout for a new client is set to a maximum of 30 seconds. This method can be called at any time, and will affect the next connection made with this client. It is not possible to set the timeout for an open connection.

**Parameters:**

- `timeoutMillis`: timeout, in milliseconds, up to a maximum of 2 minutes.

---
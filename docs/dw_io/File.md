## Package: dw.io

# Class File

## Inheritance Hierarchy

- Object
  - dw.io.File

## Description

Represents a file resource accessible from scripting. As with java.io.File, a File is essentially an "abstract pathname" which may or may not denote an actual file on the file system. Methods createNewFile, mkdir, mkdirs, and remove are provided to actually manipulate physical files. File access is limited to certain virtual directories. These directories are a subset of those accessible through WebDAV. As a result of this restriction, pathnames must be one of the following forms: /TEMP(/...) /IMPEX(/...) /REALMDATA(/...) /CATALOGS/[Catalog Name](/...) /LIBRARIES/[Library Name](/...) Note, that these paths are analogous to the WebDAV URIs used to access the same directories. The files are stored in a shared file system where multiple processes could access the same file. The programmer has to make sure no more than one process writes to a file at a given time. This class provides other useful methods for listing the children of a directory and for working with zip files. Note: when this class is used with sensitive data, be careful in persisting sensitive information. For performance reasons no more than 100,000 files (regular files and directories) should be stored in a directory.

## Constants

### CATALOGS

**Type:** String = "CATALOGS"

Catalogs root directory.

### CUSTOMER_SNAPSHOTS

**Type:** String = "CUSTOMERSNAPSHOTS"

Customer snapshots root directory.

### CUSTOMERPI

**Type:** String = "CUSTOMERPI"

Customer Payment Instrument root directory.

### DYNAMIC

**Type:** String = "DYNAMIC"

Reserved for future use.

### IMPEX

**Type:** String = "IMPEX"

Import/export root directory.

### LIBRARIES

**Type:** String = "LIBRARIES"

Libraries root directory.

### REALMDATA

**Type:** String = "REALMDATA"

RealmData root directory.

### SEPARATOR

**Type:** String = "/"

The UNIX style '/' path separator, which must be used for files paths.

### STATIC

**Type:** String = "STATIC"

Static content root directory.

### TEMP

**Type:** String = "TEMP"

Temp root directory.

## Properties

### directory

**Type:** boolean (Read Only)

Indicates that this file is a directory.

### file

**Type:** boolean (Read Only)

Indicates if this file is a file.

### fullPath

**Type:** String (Read Only)

Return the full file path denoted by this File.
 This value will be the same regardless of which constructor was
 used to create this File.

### name

**Type:** String (Read Only)

The name of the file or directory denoted by this object. This is
 just the last name in the pathname's name sequence. If the pathname's
 name sequence is empty, then the empty string is returned.

### path

**Type:** String (Read Only)

The portion of the path relative to the root directory.

### rootDirectoryType

**Type:** String (Read Only)

The root directory type, e.g. "IMPEX" represented by this
 File.

## Constructor Summary

File(absPath : String) Creates a File from the given absolute file path in the file namespace.

File(rootDir : File, relPath : String) Creates a File given a root directory and a relative path.

## Method Summary

### copyTo

**Signature:** `copyTo(file : File) : File`

Copy a file.

### createNewFile

**Signature:** `createNewFile() : boolean`

Create file.

### exists

**Signature:** `exists() : boolean`

Indicates if the file exists.

### getFullPath

**Signature:** `getFullPath() : String`

Return the full file path denoted by this File.

### getName

**Signature:** `getName() : String`

Returns the name of the file or directory denoted by this object.

### getPath

**Signature:** `getPath() : String`

Returns the portion of the path relative to the root directory.

### getRootDirectory

**Signature:** `static getRootDirectory(rootDir : String, args : String...) : File`

Returns a File representing a directory for the specified root directory type.

### getRootDirectoryType

**Signature:** `getRootDirectoryType() : String`

Returns the root directory type, e.g.

### gunzip

**Signature:** `gunzip(root : File) : void`

Assumes this instance is a gzip file.

### gzip

**Signature:** `gzip(outputZipFile : File) : void`

GZip this instance into a new gzip file.

### isDirectory

**Signature:** `isDirectory() : boolean`

Indicates that this file is a directory.

### isFile

**Signature:** `isFile() : boolean`

Indicates if this file is a file.

### lastModified

**Signature:** `lastModified() : Number`

Return the time, in milliseconds, that this file was last modified.

### length

**Signature:** `length() : Number`

Return the length of the file in bytes.

### list

**Signature:** `list() : String[]`

Returns an array of strings naming the files and directories in the directory denoted by this object.

### listFiles

**Signature:** `listFiles() : List`

Returns an array of File objects in the directory denoted by this File.

### listFiles

**Signature:** `listFiles(filter : Function) : List`

Returns an array of File objects denoting the files and directories in the directory denoted by this object that satisfy the specified filter.

### md5

**Signature:** `md5() : String`

Returns an MD5 hash of the content of the file of this instance.

### mkdir

**Signature:** `mkdir() : boolean`

Creates a directory.

### mkdirs

**Signature:** `mkdirs() : boolean`

Creates a directory, including, its parent directories, as needed.

### remove

**Signature:** `remove() : boolean`

Deletes the file or directory denoted by this object.

### renameTo

**Signature:** `renameTo(file : File) : boolean`

Rename file.

### unzip

**Signature:** `unzip(root : File) : void`

Assumes this instance is a zip file.

### zip

**Signature:** `zip(outputZipFile : File) : void`

Zip this instance into a new zip file.

## Constructor Detail

## Method Detail

## Method Details

### copyTo

**Signature:** `copyTo(file : File) : File`

**Description:** Copy a file. Directories cannot be copied. This method cannot be used from storefront requests.

**Parameters:**

- `file`: the File object to copy to

**Returns:**

a reference to the copied file.

**Throws:**

IOException - if there is an interruption during file copy.
FileAlreadyExistsException - if the file to copy to already exists
UnsupportedOperationException - if invoked from a storefront request

---

### createNewFile

**Signature:** `createNewFile() : boolean`

**Description:** Create file.

**Returns:**

boolean, true - if file has been created, false - file already exists

**Throws:**

- Exception

---

### exists

**Signature:** `exists() : boolean`

**Description:** Indicates if the file exists.

**Returns:**

true if file exists, false otherwise.

---

### getFullPath

**Signature:** `getFullPath() : String`

**Description:** Return the full file path denoted by this File. This value will be the same regardless of which constructor was used to create this File.

**Returns:**

the full file path.

---

### getName

**Signature:** `getName() : String`

**Description:** Returns the name of the file or directory denoted by this object. This is just the last name in the pathname's name sequence. If the pathname's name sequence is empty, then the empty string is returned.

**Returns:**

The name of the file or directory denoted by this object.

---

### getPath

**Signature:** `getPath() : String`

**Description:** Returns the portion of the path relative to the root directory.

**Deprecated:**

Use getFullPath() to access the full path. This method does not return the correct path for files in the CATALOGS or LIBRARIES virtual directories.

**Returns:**

the relative file path, possibly blank but not null.

---

### getRootDirectory

**Signature:** `static getRootDirectory(rootDir : String, args : String...) : File`

**Description:** Returns a File representing a directory for the specified root directory type. If the root directory type is CATALOGS or LIBRARIES, then an additional argument representing the specific catalog or library must be provided. Otherwise, no additional arguments are needed.

**Parameters:**

- `rootDir`: root directory type (see the constants defined in this class)
- `args`: root directory specific arguments

**Returns:**

File object representing the directory

---

### getRootDirectoryType

**Signature:** `getRootDirectoryType() : String`

**Description:** Returns the root directory type, e.g. "IMPEX" represented by this File.

**Returns:**

root directory type

---

### gunzip

**Signature:** `gunzip(root : File) : void`

**Description:** Assumes this instance is a gzip file. Unzipping it will explode the contents in the directory passed in (root).

**Parameters:**

- `root`: a File indicating root. root must be a directory.

**Throws:**

Exception - if the zip files contents can't be exploded.

---

### gzip

**Signature:** `gzip(outputZipFile : File) : void`

**Description:** GZip this instance into a new gzip file. If you're zipping a file, then a single entry, the instance, is included in the output gzip file. Note that a new File is created. GZipping directories is not supported. This file is never modified.

**Parameters:**

- `outputZipFile`: the zip file created.

**Throws:**

IOException - if the zip file can't be created.

---

### isDirectory

**Signature:** `isDirectory() : boolean`

**Description:** Indicates that this file is a directory.

**Returns:**

true if the file is a directory, false otherwise.

---

### isFile

**Signature:** `isFile() : boolean`

**Description:** Indicates if this file is a file.

**Returns:**

true if the file is a file, false otherwise.

---

### lastModified

**Signature:** `lastModified() : Number`

**Description:** Return the time, in milliseconds, that this file was last modified.

**Returns:**

the time, in milliseconds, that this file was last modified.

---

### length

**Signature:** `length() : Number`

**Description:** Return the length of the file in bytes.

**Returns:**

the file length in bytes.

---

### list

**Signature:** `list() : String[]`

**Description:** Returns an array of strings naming the files and directories in the directory denoted by this object. If this object does not denote a directory, then this method returns null. Otherwise an array of strings is returned, one for each file or directory in the directory. Names denoting the directory itself and the directory's parent directory are not included in the result. Each string is a file name rather than a complete path. There is no guarantee that the name strings in the resulting array will appear in any specific order; they are not, in particular, guaranteed to appear in alphabetical order.

**Returns:**

An array of strings naming the files and directories in the directory denoted by this File. The array will be empty if the directory is empty. Returns null if this File does not denote a directory.

---

### listFiles

**Signature:** `listFiles() : List`

**Description:** Returns an array of File objects in the directory denoted by this File. If this File does not denote a directory, then this method returns null. Otherwise an array of File objects is returned, one for each file or directory in the directory. Files denoting the directory itself and the directory's parent directory are not included in the result. There is no guarantee that the files in the resulting array will appear in any specific order; they are not, in particular, guaranteed to appear in alphabetical order. Example usage: // Assume "foo" is an accessible directory. var this_directory : dw.io.File = new File("foo"); // Find all files in directory foo, one level "down". // listFiles() will not traverse subdirectories. var folder : dw.util.List = this_directory.listFiles(); var first_element : dw.io.File = folder[0]; function modification_comparison(lhs : File, rhs : File) { return lhs.lastModified() < rhs.lastModified(); } function lexigraphic_comparison(lhs: File, rhs : File) { return lhs.getName() < rhs.getName(); } var time_ordered_folder : dw.util.ArrayList = folder.sort(modification_comparison); var alphabetic_folder : dw.util.ArrayList = folder.sort(lexigraphic_comparison);

**Returns:**

a list of File objects or null if this is not a directory.

---

### listFiles

**Signature:** `listFiles(filter : Function) : List`

**Description:** Returns an array of File objects denoting the files and directories in the directory denoted by this object that satisfy the specified filter. The behavior of this method is the same as that of the listFiles() method, except that the files in the returned array must satisfy the filter. The filter is a Javascript function which accepts one argument, a File, and returns true or false depending on whether the file meets the filter conditions. If the given filter is null then all files are accepted. Otherwise, a file satisfies the filter if and only if the filter returns true. Example usage: // Assume "foo" is an accessible directory. var this_directory : dw.io.File = new File("foo"); function longer_than_3(candidate : dw.io.File) { return candidate.getName().length > 3; } // Find all files in directory foo, one level "down", // such that the filename is longer than 3 characters. var folder_long_names : dw.util.List = this_directory.listFiles(longer_than_3);

**Parameters:**

- `filter`: a Javascript function which accepts a File argument and returns true or false.

**Returns:**

list of File objects or null if this is not a directory

---

### md5

**Signature:** `md5() : String`

**Description:** Returns an MD5 hash of the content of the file of this instance.

**Returns:**

The MD5 hash of the file's content.

**Throws:**

Exception - if the file could not be read or is a directory.

---

### mkdir

**Signature:** `mkdir() : boolean`

**Description:** Creates a directory.

**Returns:**

true if file creation succeeded, false otherwise.

---

### mkdirs

**Signature:** `mkdirs() : boolean`

**Description:** Creates a directory, including, its parent directories, as needed.

**Returns:**

true if file creation succeeded, false otherwise.

---

### remove

**Signature:** `remove() : boolean`

**Description:** Deletes the file or directory denoted by this object. If this File represents a directory, then the directory must be empty in order to be deleted.

**Returns:**

true if file deletion succeeded, false otherwise

---

### renameTo

**Signature:** `renameTo(file : File) : boolean`

**Description:** Rename file.

**Parameters:**

- `file`: the File object to rename to

**Returns:**

boolean, true - if file rename succeeded, false - failed

---

### unzip

**Signature:** `unzip(root : File) : void`

**Description:** Assumes this instance is a zip file. Unzipping it will explode the contents in the directory passed in (root).

**Parameters:**

- `root`: a File indicating root. root must be a directory.

**Throws:**

Exception - if the zip files contents can't be exploded.

---

### zip

**Signature:** `zip(outputZipFile : File) : void`

**Description:** Zip this instance into a new zip file. If you're zipping a directory, the directory itself and all its children files to any level (any number of subdirectories) are included in the zip file. The directory will be the only entry in the archive (single root). If you're zipping a file, then a single entry, the instance, is included in the output zip file. Note that a new File is created. This file is never modified.

**Parameters:**

- `outputZipFile`: the zip file created.

**Throws:**

IOException - if the zip file can't be created.

---
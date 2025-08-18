## Package: dw.rpc

# Class SOAPUtil

## Inheritance Hierarchy

- Object
  - dw.rpc.SOAPUtil

## Description

Utility class for working with SOAP web services. This class provides methods for setting SOAP headers and a set of constants representing the supported header names. If you want to use ws-security features, such as signing and encryption, with your RPC-style SOAP web service, use this class to construct a HashMap with security constants and values. Note: this method handles sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12. The following example configures the ws-security actions taken for the request and response to a web service. importPackage( dw.system ); importPackage( dw.util ); importPackage( dw.rpc ); function execute( args : PipelineDictionary ) : Number { var WSU_NS : String = "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"; try { // define a map with all the secrets var secretsMap : Map = new HashMap(); secretsMap.put("myclientkey", "ckpass"); secretsMap.put("myservicekey", "ckpass"); secretsMap.put("username", "password"); var requestCfg : Map = new HashMap(); // define the ws actions to be performed requestCfg.put(SOAPUtil.WS_ACTION, SOAPUtil.WS_USERNAME_TOKEN + " " + SOAPUtil.WS_TIMESTAMP + " " + SOAPUtil.WS_SIGNATURE + " " + SOAPUtil.WS_ENCRYPT); requestCfg.put(SOAPUtil.WS_USER, "username"); requestCfg.put(SOAPUtil.WS_PASSWORD_TYPE, SOAPUtil.WS_PW_DIGEST ); requestCfg.put(SOAPUtil.WS_SIG_DIGEST_ALGO, "http://www.w3.org/2001/04/xmlenc#sha256" ); // define signature properties // the keystore file has the basename of the WSDL file and the // file extension based on the keystore type (e.g. HelloWorld.jks). // The keystore file has to be placed beside the WSDL file. requestCfg.put(SOAPUtil.WS_SIG_PROP_KEYSTORE_TYPE, "jks"); requestCfg.put(SOAPUtil.WS_SIG_PROP_KEYSTORE_PW, "cspass"); requestCfg.put(SOAPUtil.WS_SIG_PROP_KEYSTORE_ALIAS, "myclientkey"); requestCfg.put(SOAPUtil.WS_SIGNATURE_USER, "myclientkey"); // define enrcryption properties requestCfg.put(SOAPUtil.WS_ENC_PROP_KEYSTORE_TYPE, "jks"); requestCfg.put(SOAPUtil.WS_ENC_PROP_KEYSTORE_PW, "cspass"); requestCfg.put(SOAPUtil.WS_ENC_PROP_KEYSTORE_ALIAS, "myservicekey"); requestCfg.put(SOAPUtil.WS_ENCRYPTION_USER, "myservicekey"); requestCfg.put(SOAPUtil.WS_SIGNATURE_PARTS, "{Element}{http://schemas.xmlsoap.org/soap/envelope/}Body"); requestCfg.put(SOAPUtil.WS_ENCRYPTION_PARTS,"{Element}{" + WSU_NS + "} Timestamp;"+"{Content}{http://schemas.xmlsoap.org/soap/envelope/}Body"); // set the secrets for the callback requestCfg.put(SOAPUtil.WS_SECRETS_MAP, secretsMap); var responseCfg : Map = new HashMap(); // define the ws actions to be performed for the response responseCfg.put(SOAPUtil.WS_ACTION, SOAPUtil.WS_TIMESTAMP + " " + SOAPUtil.WS_SIGNATURE + " " + SOAPUtil.WS_ENCRYPT); // define signature properties responseCfg.put(SOAPUtil.WS_SIG_PROP_KEYSTORE_TYPE, "jks"); responseCfg.put(SOAPUtil.WS_SIG_PROP_KEYSTORE_PW, "cspass"); responseCfg.put(SOAPUtil.WS_SIG_PROP_KEYSTORE_ALIAS, "myservicekey"); responseCfg.put(SOAPUtil.WS_SIGNATURE_USER, "myservicekey"); // define decryption properties responseCfg.put(SOAPUtil.WS_ENC_PROP_KEYSTORE_TYPE, "jks"); responseCfg.put(SOAPUtil.WS_ENC_PROP_KEYSTORE_PW, "cspass"); responseCfg.put(SOAPUtil.WS_ENC_PROP_KEYSTORE_ALIAS, "myclientkey"); responseCfg.put(SOAPUtil.WS_ENCRYPTION_USER, "myclientkey"); // set the secrets for the callback responseCfg.put(SOAPUtil.WS_SECRETS_MAP, secretsMap); // get the service and stub var helloWorldService : WebReference = webreferences.HelloWorld; var stub : Stub = helloWorldService.defaultService; // set the security SOAPUtil.setWSSecurityConfig(stub, requestCfg, responseCfg); //var h : Hello = new helloWorldService.Hello(); var h = new helloWorldService.com.support.ws.security.test.Hello2(); h.setName('Send Text from client Axis ...'); // call the web service var response = stub.hello2(h); //var response = stub.hello(h); var result = response.getHello2Return(); args.OutStr = result; Logger.error("Hello World We Are SIGNED old version Send Text from client ...", result); return PIPELET_NEXT; } catch (e) { Logger.error("Error in helloWorldRpc.ds is: " + e); return PIPELET_ERROR; } }

## Constants

### WS_ACTION

**Type:** String = "action"

WS-Security action property name. Allowed property values are WS_NO_SECURITY, WS_TIMESTAMP, WS_ENCRYPT, WS_SIGNATURE, WS_USERNAME_TOKEN or a space separated String with multiple values.

### WS_ENC_PROP_KEYSTORE_ALIAS

**Type:** String = "__EncryptionPropKeystoreAlias"

WS-Security encryption: the encryption/decryption keystore alias name

### WS_ENC_PROP_KEYSTORE_PW

**Type:** String = "__EncryptionPropKeystorePassword"

WS-Security encryption: the encryption/decryption keystore password

### WS_ENC_PROP_KEYSTORE_TYPE

**Type:** String = "__EncryptionPropKeystoreType"

WS-Security encryption: the encryption/decryption keystore type ( jks or pkcs12 ), default is jks. Note: the keystore file must have the basename of the WSDL file and the file extension based on the keystore type. For example: MyService.jks. The keystore file must be placed in the same cartridge directory as the WSDL file.

### WS_ENCRYPT

**Type:** String = "Encrypt"

WS-Security action: encrypt the message. The encryption-specific parameters define how to encrypt, which keys to use, and other parameters.

### WS_ENCRYPTION_PARTS

**Type:** String = "encryptionParts"

WS-Security encryption: defines which parts of the request are encrypted.

### WS_ENCRYPTION_USER

**Type:** String = "encryptionUser"

WS-Security encryption: the user's name for encryption.

### WS_NO_SECURITY

**Type:** String = "NoSecurity"

WS-Security action: no security

### WS_PASSWORD_TYPE

**Type:** String = "passwordType"

WS-Security password type: parameter for UsernameToken action to define the encoding of the password. Allowed values are PW_DIGEST or PW_TEXT.

### WS_PW_DIGEST

**Type:** String = "PasswordDigest"

WS-Security password of type digest: use a password digest to send the password information.

### WS_PW_TEXT

**Type:** String = "PasswordText"

WS-Security password of type text: send the password information in clear text.

### WS_SECRETS_MAP

**Type:** String = "__SecretsMap"

A secrets map with the username/password entries is needed to create the password callback object.

### WS_SIG_DIGEST_ALGO

**Type:** String = "signatureDigestAlgorithm"

WS-Security signature: sets the signature digest algorithm to use.

### WS_SIG_PROP_KEYSTORE_ALIAS

**Type:** String = "__SignaturePropKeystoreAlias"

WS-Security signature: the signature keystore alias name

### WS_SIG_PROP_KEYSTORE_PW

**Type:** String = "__SignaturePropKeystorePassword"

WS-Security signature: the signature keystore password.

### WS_SIG_PROP_KEYSTORE_TYPE

**Type:** String = "__SignaturePropKeystoreType"

WS-Security: the signature keystore type ( jks or pkcs12 ). The default is jks. Note: The keystore file must have the basename of the WSDL file and the file extension of the keystore type. For example: MyService.jks. The keystore file must be placed in the same cartridge directory as the WSDL file.

### WS_SIGNATURE

**Type:** String = "Signature"

WS-Security action: sign the message. The signature-specific parameters define how to sign, which keys to use, and other parameters.

### WS_SIGNATURE_PARTS

**Type:** String = "signatureParts"

WS-Security signature: defines which parts of the request are signed.

### WS_SIGNATURE_USER

**Type:** String = "signatureUser"

WS-Security signature: the user's name for signature.

### WS_TIMESTAMP

**Type:** String = "Timestamp"

WS-Security action: add a timestamp to the security header.

### WS_USER

**Type:** String = "user"

WS-Security user name.

### WS_USERNAME_TOKEN

**Type:** String = "UsernameToken"

WS-Security action: add a UsernameToken identification.

## Properties

## Constructor Summary

SOAPUtil()

## Method Summary

### getHTTPRequestHeader

**Signature:** `static getHTTPRequestHeader(svc : Object, key : String) : String`

Returns an HTTP request header property value using the specified key.

### getHTTPResponseHeader

**Signature:** `static getHTTPResponseHeader(svc : Object, key : String) : String`

Returns an HTTP response header property value using the specified key.

### setHeader

**Signature:** `static setHeader(svc : Object, xml : String) : void`

Sets a new SOAPHeaderElement in the SOAP request with the namespace of the XML content.

### setHeader

**Signature:** `static setHeader(svc : Object, xml : String, mustUnderstand : boolean) : void`

Sets a new SOAPHeaderElement in the SOAP request with the namespace of the XML content.

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : String) : void`

Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : String, mustUnderstand : boolean) : void`

Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : String, mustUnderstand : boolean, actor : String) : void`

Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : Object) : void`

Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : Object, mustUnderstand : boolean) : void`

Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : Object, mustUnderstand : boolean, actor : String) : void`

Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

### setHTTPRequestHeader

**Signature:** `static setHTTPRequestHeader(svc : Object, key : String, value : String) : void`

Sets an HTTP request header property using the specified key and value.

### setWSSecurityConfig

**Signature:** `static setWSSecurityConfig(svc : Object, requestConfigMap : Object, responseConfigMap : Object) : void`

Sets the WS-Security configuration for the request and response based on the constants defined.

## Constructor Detail

## Method Detail

## Method Details

### getHTTPRequestHeader

**Signature:** `static getHTTPRequestHeader(svc : Object, key : String) : String`

**Description:** Returns an HTTP request header property value using the specified key. Null is returned if the key does not represent an HTTP header property.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService().
- `key`: the header property key.

**Returns:**

an HTTP request header property value using the specified key or null.

---

### getHTTPResponseHeader

**Signature:** `static getHTTPResponseHeader(svc : Object, key : String) : String`

**Description:** Returns an HTTP response header property value using the specified key. Null is returned if the key does not represent an HTTP response header property.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService().
- `key`: the header property key.

**Returns:**

an HTTP response header property value using the specified key or null.

---

### setHeader

**Signature:** `static setHeader(svc : Object, xml : String) : void`

**Description:** Sets a new SOAPHeaderElement in the SOAP request with the namespace of the XML content.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService()
- `xml`: a string with arbitrary XML content

---

### setHeader

**Signature:** `static setHeader(svc : Object, xml : String, mustUnderstand : boolean) : void`

**Description:** Sets a new SOAPHeaderElement in the SOAP request with the namespace of the XML content.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService()
- `xml`: a string with arbitrary XML content
- `mustUnderstand`: sets the SOAP header attribute 'mustUnderstand'

---

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : String) : void`

**Description:** Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService()
- `namespace`: the namespace of the header element
- `name`: the element name for the header element
- `xml`: a string with arbitrary XML content

---

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : String, mustUnderstand : boolean) : void`

**Description:** Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService()
- `namespace`: the namespace of the header element
- `name`: the element name for the header element
- `xml`: a string with arbitrary XML content
- `mustUnderstand`: sets the SOAP header attribute mustUnderstand

---

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : String, mustUnderstand : boolean, actor : String) : void`

**Description:** Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService()
- `namespace`: the namespace of the header element
- `name`: the element name for the header element
- `xml`: a string with arbitrary XML content
- `mustUnderstand`: sets the SOAP header attribute mustUnderstand
- `actor`: the SOAP actor, which should be set for this header element. null removes any actor.

---

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : Object) : void`

**Description:** Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService()
- `namespace`: the namespace of the header element
- `name`: the element name for the header element
- `xml`: a E4X XML object

---

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : Object, mustUnderstand : boolean) : void`

**Description:** Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService()
- `namespace`: the namespace of the header element
- `name`: the element name for the header element
- `xml`: a E4X XML object
- `mustUnderstand`: sets the SOAP header attribute mustUnderstand

---

### setHeader

**Signature:** `static setHeader(svc : Object, namespace : String, name : String, xml : Object, mustUnderstand : boolean, actor : String) : void`

**Description:** Creates a new SOAPHeaderElement with the name and namespace and places the given XML into it. var usernameToken : XML = <wsse:UsernameToken xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"> <wsse:Username>{merchantID}</wsse:Username> <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText"> {merchantPassword} </wsse:Password> </wsse:UsernameToken> SOAPUtil.setHeader( service, "http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd", "Security", usernameToken, true, null

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService()
- `namespace`: the namespace of the header element
- `name`: the element name for the header element
- `xml`: a E4X XML object
- `mustUnderstand`: sets the SOAP header attribute 'mustUnderstand'
- `actor`: the SOAP actor, which should be set for this header element. null removes any actor.

---

### setHTTPRequestHeader

**Signature:** `static setHTTPRequestHeader(svc : Object, key : String, value : String) : void`

**Description:** Sets an HTTP request header property using the specified key and value.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService().
- `key`: the header property key.
- `value`: the header property value. If the value is null, the property identified by the key is removed from the HTTP request header.

---

### setWSSecurityConfig

**Signature:** `static setWSSecurityConfig(svc : Object, requestConfigMap : Object, responseConfigMap : Object) : void`

**Description:** Sets the WS-Security configuration for the request and response based on the constants defined.

**Deprecated:**

use webreferences2 instead

**Parameters:**

- `svc`: a service stub returned from getService()
- `requestConfigMap`: the WS-Security request config
- `responseConfigMap`: the WS-Security response config

---
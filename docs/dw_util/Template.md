## Package: dw.util

# Class Template

## Inheritance Hierarchy

- Object
  - dw.util.Template

## Description

Reads an ISML template from the file system and renders it into a MimeEncodedText object. Optional substitution values can be passed to the isml template via the render(Map) method. Substitution parameters can be accessed within the template through <isprint value="${param.parameter}"> or for backward compatibility through <isprint value="${pdict.parameter}"> The access through pdict only gives access to the parameter map provided at rendering time and doesn't offer access to the system PipelineDictionary. The pdict access to the property map is only considered to ease the transition from SendMail pipelet API based templates. If the PipelineDictionary or properties of the PipelineDictionary are needed, they need to be included in the Property map passed to the render method.

## Constructor Summary

Template(templateName : String) Creates a new template.

Template(templateName : String, localeID : String) Creates a new template with the locale being set to the given localeID.

## Method Summary

### render

**Signature:** `render() : MimeEncodedText`

Renders the template specified at instantiation time, without any substitution parameters.

### render

**Signature:** `render(params : Map) : MimeEncodedText`

Renders the template specified at instantiation time with the given substitution parameters.

### setLocale

**Signature:** `setLocale(localeID : String) : Template`

Sets an optional localeID which is used instead of the current requests localeID.

## Constructor Detail

## Method Detail

## Method Details

### render

**Signature:** `render() : MimeEncodedText`

**Description:** Renders the template specified at instantiation time, without any substitution parameters. Any isprint tags referring to param/pdict will be unresolved and will be replaced with empty strings. If there's an explicit localeID set through setLocale(String), it takes precedence over the localeID associated with the current request.

**Returns:**

MimeEncodedText with isprint tags referring to param/pdict replaced with an empty String

---

### render

**Signature:** `render(params : Map) : MimeEncodedText`

**Description:** Renders the template specified at instantiation time with the given substitution parameters. These parameters are available to ISML templates through variables named 'param' and 'pdict'. Note that in this context, pdict is not referring to the system PipelineDictionary, as the System Pipeline Dictionary is not accessible from this script API. If there's an explicit localeID set through setLocale(String), it takes precedence over the localeID associated with the current request.

**Parameters:**

- `params`: Map of substitution parameters which are specified within the ISML template. Access is available from within the ISML template through named variables param or pdict.

**Returns:**

MimeEncodedText containing the rendered template. Variables in the template referring to param/pdict are replaced with the value from the params map or empty if the value isn't found in the map

---

### setLocale

**Signature:** `setLocale(localeID : String) : Template`

**Description:** Sets an optional localeID which is used instead of the current requests localeID.

**Parameters:**

- `localeID`: to be used for processing this template. Throws an exception if localeID is blank

**Returns:**

this Template object

---
## Package: dw.system

# Class SitePreferences

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.system.SitePreferences

## Description

SitePreferences is a container for custom site-level attributes. The object corresponds with system object type "SitePreferences". It has no system attributes and exists only as a place for merchants to define custom attributes which need to be available for each site. Logically there is only one SitePreferences instance per site. The instance is obtained by calling Site.getPreferences(). Once an instance of the container is obtained, it is possible to read/write site preference values by using the usual syntax for ExtensibleObject instances. For example: var sitePrefs : SitePreferences = dw.system.Site.getCurrent().getPreferences(); var mySitePrefValue : String = sitePrefs.getCustom()["mySitePref"]; Note: this class allows access to sensitive security-related data. Pay special attention to PCI DSS v3. requirements 2, 4, and 12. Commerce Cloud Digital defines many site-level preferences, relating to baskets, timezone, locales, customers, etc, which can be managed within the "Site Preferences" module of the Business Manager, but these preferences are not accessible through this object. (SourceCodeURLParameterName is the one exception to this rule.)

## Properties

### sourceCodeURLParameterName

**Type:** String (Read Only)

The name of the source code url paremeter configured for the
 site.

## Constructor Summary

## Method Summary

### getSourceCodeURLParameterName

**Signature:** `getSourceCodeURLParameterName() : String`

Returns the name of the source code url paremeter configured for the site.

## Method Detail

## Method Details

### getSourceCodeURLParameterName

**Signature:** `getSourceCodeURLParameterName() : String`

**Description:** Returns the name of the source code url paremeter configured for the site.

**Returns:**

source code url parameter name

---
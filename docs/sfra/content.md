# SFRA Content Model

## Overview

The Content model represents a content asset in SFRA applications. It provides structured access to content information including body text, metadata, and rendering template information for content management and display.

## Constructor

```javascript
function content(contentValue, renderingTemplate)
```

Creates a Content model instance from a content asset.

### Parameters

- `contentValue` (dw.content.Content) - Result of ContentMgr.getContent call
- `renderingTemplate` (string) - Optional rendering template for the content

### Returns

Object - Content model instance, or null if content is not online

## Properties

### body
**Type:** string | null

The main content body text from the content asset's custom.body attribute.

### UUID
**Type:** string

Unique identifier for the content asset.

### ID
**Type:** string

Content asset ID for referencing and linking.

### name
**Type:** string

Display name of the content asset.

### template
**Type:** string

Rendering template path for the content. Uses either:
- Content asset's specified template
- Provided renderingTemplate parameter
- Default: 'components/content/contentAssetInc'

### pageTitle
**Type:** string

SEO page title for the content asset.

### pageDescription
**Type:** string

SEO meta description for the content asset.

### pageKeywords
**Type:** string

SEO meta keywords for the content asset.

### pageMetaTags
**Type:** Array

Additional SEO meta tags for the content asset.

## Content Availability

The model only processes online content assets. If `contentValue.online` is false, the constructor returns null instead of a content object.

## Template Resolution

Template selection follows this priority:
1. Content asset's own template property
2. Provided renderingTemplate parameter
3. Default template: 'components/content/contentAssetInc'

## Usage Example

```javascript
var ContentModel = require('*/cartridge/models/content');
var ContentMgr = require('dw/content/ContentMgr');

// Get content asset
var contentAsset = ContentMgr.getContent('privacy-policy');
var customTemplate = 'pages/content/contentPage';

var content = new ContentModel(contentAsset, customTemplate);

if (content) {
    // Access content properties
    console.log(content.name);           // "Privacy Policy"
    console.log(content.ID);             // "privacy-policy"
    console.log(content.body);           // Content body HTML
    console.log(content.template);       // Template path
    
    // Access SEO properties
    console.log(content.pageTitle);      // SEO title
    console.log(content.pageDescription); // SEO description
} else {
    console.log('Content is offline or not found');
}
```

## SEO Support

The model provides comprehensive SEO metadata:
- **pageTitle** - For HTML title tag
- **pageDescription** - For meta description
- **pageKeywords** - For meta keywords
- **pageMetaTags** - For additional custom meta tags

## Notes

- Only processes online content assets
- Provides flexible template resolution
- Includes comprehensive SEO metadata
- Handles missing content gracefully (returns null)
- Body content comes from custom.body attribute
- Template fallback ensures content can always be rendered

## Related Models

- **Page Models** - May include content assets
- **Search Models** - May return content in search results
- **Category Models** - May reference related content

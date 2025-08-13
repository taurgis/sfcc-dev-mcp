# Module render

## Description

The SFRA render module is the core rendering engine that processes and outputs different types of response content in Salesforce Commerce Cloud's Storefront Reference Architecture (SFRA). This module handles the execution of rendering operations that have been queued in the Response object's renderings array during the request lifecycle. It supports multiple output formats including ISML templates, JSON responses, XML output, Page Designer pages, and direct text output. The render module serves as the final step in the SFRA request processing pipeline, converting accumulated view data and rendering instructions into the actual HTTP response content.

## Functions

### template

**Signature:** `template(view, viewData) : void`

Renders an ISML template with the provided data.

### json

**Signature:** `json(data, response) : void`

Renders an object as JSON output.

### xml

**Signature:** `xml(viewData, response) : void`

Renders an object as XML output with proper escaping.

### page

**Signature:** `page(pageID, aspectAttributes, data, response) : void`

Renders a Page Designer page with optional aspect attributes.

### applyRenderings

**Signature:** `applyRenderings(res) : void`

Processes all rendering instructions in the response object.

## Function Detail

### template

**Signature:** `template(view, viewData) : void`

**Description:** Renders an ISML template using the provided view data. Creates a shallow copy of the view data for isolation and uses SFCC's ISML rendering engine to process the template.

**Parameters:**
- `view` (String) - Path to the ISML template file
- `viewData` (Object) - Data object to be passed as pdict to the template

**Returns:**
void

**Throws:**
Error with enhanced message including Java stack trace, file name, and line number information.

**Processing:**
1. Creates shallow copy of view data to prevent modification
2. Calls `isml.renderTemplate()` with view path and data
3. Wraps any rendering errors with enhanced error information

### json

**Signature:** `json(data, response) : void`

**Description:** Renders the provided data as JSON output with proper content type headers and formatting.

**Parameters:**
- `data` (Object) - Object to be serialized as JSON
- `response` (Response) - SFRA Response object

**Returns:**
void

**Processing:**
1. Sets content type to `application/json`
2. Serializes data with JSON.stringify using 2-space indentation
3. Writes formatted JSON to response writer

### xml

**Signature:** `xml(viewData, response) : void`

**Description:** Renders the provided view data as XML output with proper character escaping and root element wrapping.

**Parameters:**
- `viewData` (Object) - Object containing data to be rendered as XML
- `response` (Response) - SFRA Response object

**Returns:**
void

**Throws:**
Error with enhanced message including stack trace, file name, and line number information.

**XML Character Escaping:**
- `<` → `&lt;`
- `>` → `&gt;`
- `&` → `&amp;`
- `"` → `&quot;`
- `'` → `&apos;`

**Processing:**
1. Creates root `<response>` element
2. Processes each key in viewData:
   - If key is 'xml', includes raw XML content
   - Otherwise, creates element with escaped content
3. Closes root element
4. Sets content type to `application/xml`
5. Creates XML object and writes to response

### page

**Signature:** `page(pageID, aspectAttributes, data, response) : void`

**Description:** Renders a Page Designer page using SFCC's PageMgr with optional aspect attributes for advanced page management.

**Parameters:**
- `pageID` (String) - ID of the Page Designer page to render
- `aspectAttributes` (dw.util.HashMap) - Optional aspect attributes for PageMgr
- `data` (Object) - Data to be passed to the page
- `response` (Response) - SFRA Response object

**Returns:**
void

**Processing:**
1. Checks if aspect attributes exist and are not empty
2. Calls appropriate PageMgr.renderPage() method:
   - With aspect attributes: `PageMgr.renderPage(pageID, aspectAttributes, JSON.stringify(data))`
   - Without aspect attributes: `PageMgr.renderPage(pageID, JSON.stringify(data))`
3. Writes rendered page content to response writer

### applyRenderings

**Signature:** `applyRenderings(res) : void`

**Description:** Processes all queued rendering instructions in the response object's renderings array. This is the main entry point called by the Server during route completion.

**Parameters:**
- `res` (Response) - SFRA Response object containing renderings array

**Returns:**
void

**Throws:**
Error if no renderings are present or if invalid rendering type is encountered.

**Rendering Types Processed:**

**Render Instructions (`type: 'render'`):**
- `subType: 'isml'` - Calls `template()` with view and viewData
- `subType: 'json'` - Calls `json()` with viewData and response
- `subType: 'xml'` - Calls `xml()` with viewData and response
- `subType: 'page'` - Calls `page()` with page, aspectAttributes, viewData, and response

**Print Instructions (`type: 'print'`):**
- Directly writes message to response writer

**Validation:**
- Throws error if renderings array is empty
- Throws error for unknown rendering types
- Throws error for render instructions without valid subType

## Rendering Pipeline Integration

### Response Object Integration

The render module works closely with the SFRA Response object:

**Rendering Queue:**
```javascript
res.renderings = [
  { type: 'render', subType: 'isml', view: 'template/path' },
  { type: 'print', message: 'Debug output' },
  { type: 'render', subType: 'json' }
];
```

**View Data Accumulation:**
```javascript
res.viewData = {
  title: 'Page Title',
  products: [...],
  customer: {...}
};
```

### Server Integration

The Server class calls `applyRenderings()` during route completion:

```javascript
route.on('route:Complete', function onRouteCompleteHandler(req, res) {
    // Cache and personalization handling
    if (res.redirectUrl) {
        // Handle redirects
        return;
    }
    render.applyRenderings(res); // Execute rendering pipeline
});
```

## Content Type Management

### Automatic Content Types

**JSON Responses:**
- Sets `application/json` content type
- Formats output with 2-space indentation

**XML Responses:**
- Sets `application/xml` content type
- Automatically escapes special characters
- Wraps content in root `<response>` element

**ISML Templates:**
- Content type determined by template output
- Typically `text/html` for web pages

**Page Designer:**
- Content type managed by PageMgr
- Usually `text/html` for rendered pages

## Error Handling

### Template Rendering Errors

**ISML Template Errors:**
- Catches Java exceptions from template engine
- Enhances error with file name and line number
- Includes original Java stack trace

**XML Rendering Errors:**
- Catches XML parsing/creation errors
- Provides enhanced error messaging
- Includes stack trace information

### Validation Errors

**Missing Renderings:**
- Throws error if renderings array is empty
- Prevents silent failures in rendering pipeline

**Invalid Rendering Types:**
- Validates rendering instruction format
- Throws descriptive errors for unknown types

## Usage Examples

### Basic Template Rendering
```javascript
// In controller middleware
res.render('product/productDetail', {
    product: productModel,
    breadcrumbs: breadcrumbsModel
});

// Results in rendering instruction:
{
    type: 'render',
    subType: 'isml',
    view: 'product/productDetail'
}
```

### JSON API Response
```javascript
// In API controller
res.json({
    success: true,
    data: responseData,
    message: 'Operation completed'
});

// Results in JSON output with proper headers
```

### XML Response
```javascript
// In XML endpoint
res.xml({
    status: 'success',
    xml: '<customData>...</customData>',
    timestamp: new Date().toISOString()
});

// Results in properly escaped XML with root element
```

### Page Designer Integration
```javascript
// In Page Designer controller
res.page('homepage', aspectAttributes, {
    banners: bannerData,
    featured: featuredProducts
});

// Results in Page Designer page rendering
```

### Mixed Output
```javascript
// Debug output followed by template
res.print('Debug: Processing complete');
res.render('checkout/confirmation', orderData);

// Results in multiple rendering instructions executed in order
```

## Performance Considerations

### Data Copying

**Template Rendering:**
- Creates shallow copy of view data for isolation
- Prevents template modifications from affecting response object
- Minimal performance impact for typical data sizes

### Memory Management

**Large Data Sets:**
- JSON serialization with formatting may increase memory usage
- XML escaping creates additional string copies
- Consider streaming for very large responses

### Caching Integration

**Template Caching:**
- ISML templates are cached by SFCC platform
- View data is not cached at render level
- Page Designer pages benefit from platform caching

## Security Considerations

### XML Security

**Character Escaping:**
- Prevents XML injection attacks
- Escapes all potentially dangerous characters
- Safe handling of user-generated content

**Content Validation:**
- XML content must be well-formed
- Error handling prevents partial output

### Template Security

**Data Isolation:**
- Shallow copy prevents template-induced data corruption
- Original response data remains unchanged
- Safe passing of sensitive data to templates

---

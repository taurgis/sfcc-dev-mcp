# SCAPI URL Structure & Endpoint Mapping Reference

Complete reference for understanding how OpenAPI schemas translate to SCAPI endpoint URLs.

## URL Structure

All custom SCAPI endpoints follow this standardized pattern:

```
https://{shortcode}.api.commercecloud.salesforce.com/custom/{api-name}/v{major-version}/organizations/{organization-id}{path}?{query-parameters}
```

**Components:**
- `{shortcode}`: Your SFCC instance shortcode (e.g., `zzrf-001`)
- `{api-name}`: Directory name under `cartridge/rest-apis/`
- `v{major-version}`: From `info.version` in schema.yaml (e.g., "1.0.0" → "v1")
- `{organization-id}`: Your SFCC organization ID (typically `f_ecom_*`)
- `{path}`: Path defined in your OpenAPI schema
- `{query-parameters}`: Query string parameters from schema

## Version Management

| Schema Version | URL Version |
|----------------|-------------|
| "1.0.0" | v1 |
| "1.2.5" | v1 |
| "2.0.0" | v2 |
| "2.1.3" | v2 |
| "3.0.0-beta" | v3 |

**Best Practice**: Use semantic versioning; introduce breaking changes only in new major versions.

## Schema-to-URL Examples

### Simple Query Parameters

**Schema:**
```yaml
# rest-apis/product-info/schema.yaml
openapi: 3.0.0
info:
  title: Product Information API
  version: "1.0.0"
paths:
  /products/{sku}:
    get:
      operationId: getProductInfo
      parameters:
        - name: siteId
          in: query
          required: true
          schema:
            type: string
            minLength: 1
        - name: sku
          in: path
          required: true
          schema:
            type: string
```

**Resulting URL:**
```
https://zzrf-001.api.commercecloud.salesforce.com/custom/product-info/v1/organizations/f_ecom_zzrf_001/products/682875540326M?siteId=RefArchGlobal
```

### Custom Query Parameters

**Schema:**
```yaml
# rest-apis/pricing-api/schema.yaml
openapi: 3.0.0
info:
  title: Pricing API
  version: "1.2.0"  # → v1 URL
paths:
  /product-pricing/{productId}:
    get:
      operationId: getProductPricing
      parameters:
        - name: siteId
          in: query
          required: true
          schema:
            type: string
            minLength: 1
        - name: productId
          in: path
          required: true
          schema:
            type: string
        - name: c_quantity
          in: query
          required: false
          schema:
            type: number
            minimum: 1
            default: 1
        - name: c_include_promotions
          in: query
          required: false
          schema:
            type: boolean
            default: false
```

**Resulting URL:**
```
https://shortcode.api.commercecloud.salesforce.com/custom/pricing-api/v1/organizations/org_id/product-pricing/ABC123?siteId=MySite&c_quantity=2&c_include_promotions=true
```

### Nested Resource Paths

**Schema:**
```yaml
# rest-apis/customer-management/schema.yaml
openapi: 3.0.0
info:
  title: Customer Management API
  version: "2.0.0"  # → v2 URL
paths:
  /customers/{customerId}/orders/{orderId}/tracking:
    get:
      operationId: getOrderTracking
      parameters:
        - name: siteId
          in: query
          required: true
          schema:
            type: string
        - name: customerId
          in: path
          required: true
          schema:
            type: string
        - name: orderId
          in: path
          required: true
          schema:
            type: string
```

**Resulting URL:**
```
https://shortcode.api.commercecloud.salesforce.com/custom/customer-management/v2/organizations/org_id/customers/12345/orders/ORD-001234/tracking?siteId=SiteGenesis
```

## Parameter Access in Scripts

### Path Parameters

Use `request.getSCAPIPathParameters()` for `in: path` parameters:

```javascript
var productId = request.getSCAPIPathParameters().get('productId');
var customerId = request.getSCAPIPathParameters().get('customerId');
var orderId = request.getSCAPIPathParameters().get('orderId');
```

### Query Parameters

Use `request.getHttpParameterMap()` for `in: query` parameters:

```javascript
var siteId = request.getHttpParameterMap().get('siteId').getStringValue();
var quantity = request.getHttpParameterMap().get('c_quantity').getIntValue() || 1;
var includePromos = request.getHttpParameterMap().get('c_include_promotions').getBooleanValue();
```

### Request Body (POST/PUT/PATCH)

```javascript
var requestBody = JSON.parse(request.httpParameterMap.requestBodyAsString);
```

## Complete Script Example

```javascript
'use strict';

var RESTResponseMgr = require('dw/system/RESTResponseMgr');

exports.getProductPricing = function () {
    // Path parameters
    var productId = request.getSCAPIPathParameters().get('productId');
    
    // Query parameters
    var siteId = request.getHttpParameterMap().get('siteId').getStringValue();
    var quantity = request.getHttpParameterMap().get('c_quantity').getIntValue() || 1;
    var includePromos = request.getHttpParameterMap().get('c_include_promotions').getBooleanValue();
    
    // Validation
    if (!productId) {
        RESTResponseMgr.createError(400, "missing-product-id", 
            "Missing Product ID", "Product ID is required").render();
        return;
    }
    
    // Business logic...
    var pricingData = {
        productId: productId,
        basePrice: 29.99,
        salePrice: 24.99,
        quantity: quantity
    };
    
    RESTResponseMgr.createSuccess(pricingData).render();
};

exports.getProductPricing.public = true;
```

## Testing URLs

```bash
curl -X GET \
  'https://shortcode.api.commercecloud.salesforce.com/custom/pricing-api/v1/organizations/org_id/product-pricing/ABC123?siteId=MySite&c_quantity=2' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json'
```

## Common Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| 404 Not Found | Endpoint not accessible | Check cartridge registration, API directory name, schema syntax |
| Version mismatch | Wrong version in URL | Verify `info.version` in schema.yaml |
| Parameter not found | Script can't access params | Ensure names match schema, use correct access method |
| Invalid path structure | URL doesn't match | Verify path definition in schema |

## Client Documentation Template

```markdown
## Get Product Pricing

Retrieves pricing information for a product.

### Endpoint
`GET /custom/pricing-api/v1/organizations/{organizationId}/product-pricing/{productId}`

### Full URL
```
https://shortcode.api.commercecloud.salesforce.com/custom/pricing-api/v1/organizations/f_ecom_org/product-pricing/ABC123?siteId=RefArchGlobal&c_quantity=2
```

### Parameters
- `productId` (path, required): Product SKU or ID
- `siteId` (query, required): Site identifier
- `c_quantity` (query, optional): Quantity for tiered pricing (default: 1)

### Authentication
Requires SLAS Shopper Token with scope: `c_read_pricing`
```

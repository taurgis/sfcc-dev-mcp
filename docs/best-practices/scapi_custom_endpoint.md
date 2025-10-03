# Salesforce B2C Commerce: Custom SCAPI Endpoint Best Practices

This guide provides a concise overview of best practices and examples for creating custom Salesforce Commerce API (SCAPI) endpoints in B2C Commerce Cloud.

**IMPORTANT**: Before implementing custom SCAPI endpoints, consult the **Performance and Stability Best Practices** guide from this MCP server. Pay special attention to the external system integration guidelines, timeout requirements, and caching strategies for optimal endpoint performance.

## 1. Authentication Methodologies for Custom SCAPI Endpoints

Custom SCAPI endpoints leverage the Shopper Login and API Access Service (SLAS) for authentication and authorization. Understanding SLAS authentication flows is critical for secure endpoint implementation.

### 1.1 Client Architecture Decision: Public vs. Private

The most critical architectural decision is determining your client type, which dictates the entire authentication flow:

#### Private Clients
- **Capability**: Can securely store a `client_secret` on a server-side component
- **Use Cases**: Backend-for-Frontend (BFF), full-stack web applications, server-to-server integrations
- **Security Model**: Uses `client_secret` in Basic Authorization header for client authentication
- **OAuth Grant Types**: 
  - `client_credentials` (guest users, system operations)
  - `authorization_code` (registered user authentication)

#### Public Clients
- **Capability**: Cannot securely store secrets (operates in untrusted environments)
- **Use Cases**: PWA Kit storefronts, Single-Page Applications (SPAs), native mobile apps
- **Security Model**: Uses Proof Key for Code Exchange (PKCE) for dynamic security
- **OAuth Grant Types**: 
  - `authorization_code_pkce` (all authentication scenarios)

### 1.2 Security Best Practices

#### Scope-Based Authorization in Custom Endpoints

Always implement fine-grained authorization checks in your endpoint scripts:

```javascript
// In your custom endpoint script
exports.getLoyaltyInfo = function () {
    var customerId = request.getHttpParameterMap().get('c_customer_id').getStringValue();
    
    // CRITICAL: Verify the authenticated user can access this customer's data
    if (request.user && request.user.profile) {
        var authenticatedCustomerId = request.user.profile.customerNo;
        
        // Prevent privilege escalation
        if (authenticatedCustomerId !== customerId) {
            RESTResponseMgr.createError(403, "insufficient-privileges", 
                "Access Denied", "Cannot access another customer's data").render();
            return;
        }
    }
    
    // Continue with business logic...
};
```

### 1.3 Client Configuration and Scope Management

#### SLAS Client Configuration

Configure clients using the SLAS Admin API or UI:

```javascript
// Example API call to create/update a SLAS client
const clientConfig = {
    "clientId": "your-client-id",
    "name": "My Custom API Client",
    "isPrivateClient": true, // or false for public clients
    "secret": "secure-client-secret", // Only for private clients
    "channels": ["your-site-id"],
    "scopes": [
        "sfcc.shopper-baskets-orders.rw",
        "sfcc.shopper-myaccount.rw", 
        "sfcc.shopper-products",
        "c_read_loyalty", // Your custom scope
        "c_write_loyalty"
    ],
    "redirectUri": [
        "https://your-app.com/callback"
    ]
};
```

#### Custom Object Scopes

For accessing custom objects via SCAPI, configure both the object and scope:

1. **Define Custom Object** in Business Manager: `Administration > Site Development > Custom Object Types`
2. **Add Scope** to SLAS client: `sfcc.shopper-custom-objects.{object-type-id}`

```yaml
# In your schema.yaml
security:
  - ShopperToken: [sfcc.shopper-custom-objects.StoreReview]
```

### 1.4 Authentication Flow Examples & Testing

#### Private Client: Guest Token Flow (Client Credentials)

For server-side applications using private clients:

```bash
# Get Guest Token
wget --post-data="grant_type=client_credentials" \
     --header="Authorization: Basic $(echo -n 'your-private-client-id:your-client-secret' | base64)" \
     --header="Content-Type: application/x-www-form-urlencoded" \
     -O token_response.json \
     "https://your-shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/f_ecom_your_org/oauth2/token"

# Extract Token and Test API Call
TOKEN=$(cat token_response.json | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
wget --header="Authorization: Bearer $TOKEN" \
     -O categories.json \
     "https://your-shortcode.api.commercecloud.salesforce.com/product/shopper-products/v1/organizations/f_ecom_your_org/categories/root?siteId=your-site-id"
```

#### Public Client: PKCE Authentication Flow

For browser-based applications using PKCE:

```bash
# Generate PKCE Challenge
VERIFIER=$(openssl rand -base64 96 | tr -d '\n' | tr '/+' '_-' | tr -d '=')
CHALLENGE=$(echo -n $VERIFIER | openssl dgst -binary -sha256 | openssl base64 -A | tr '/' '_' | tr '+' '-' | tr -d '=')

# Get Authorization Code (returns redirect with usid and code)
wget --server-response --spider \
     "https://your-shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/f_ecom_your_org/oauth2/authorize?redirect_uri=http://localhost:3000/callback&response_type=code&hint=guest&client_id=your-public-client-id&code_challenge=$CHALLENGE" \
     2>&1 | grep -i location

# Exchange Code for Token (extract usid and code from Location header)
wget --post-data="client_id=your-public-client-id&channel_id=your-site-id&code_verifier=$VERIFIER&usid=your-usid&code=your-code&grant_type=authorization_code_pkce&redirect_uri=http://localhost:3000/callback" \
     --header="Content-Type: application/x-www-form-urlencoded" \
     -O pkce_token_response.json \
     "https://your-shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/f_ecom_your_org/oauth2/token"
```

### 1.5 Error Handling and Troubleshooting

#### Common Authentication Errors

| Error Code | Cause | Solution |
|------------|-------|----------|
| 401 Unauthorized | Invalid or expired token | Refresh token or re-authenticate |
| 403 Forbidden | Valid token, missing scope | Check client scope configuration |
| 400 Bad Request | Invalid PKCE parameters | Verify code_verifier/code_challenge |
| 404 Not Found | Incorrect endpoint URL | Verify API registration and URL structure |

#### Token Validation in Scripts

```javascript
// Validate token and extract user information
function validateAndExtractUser() {
    if (!request.user) {
        RESTResponseMgr.createError(401, "unauthorized", 
            "Authentication Required", "Valid token required").render();
        return null;
    }
    
    // For registered users
    if (request.user.profile && request.user.profile.customerNo) {
        return {
            type: 'registered',
            customerId: request.user.profile.customerNo,
            email: request.user.profile.email
        };
    }
    
    // For guest users
    return {
        type: 'guest',
        customerId: request.user.ID // Guest customer ID
    };
}
```

#### Accessing Customer Context in Headless APIs

Even though SCAPI endpoints use JWT-based authentication without traditional sessions, you can still access the authenticated customer:

```javascript
// Access the current customer (works for both registered and guest users)
exports.getCustomerInfo = function () {
    var session = request.getSession();
    var customer = session.getCustomer();
    
    if (!customer) {
        RESTResponseMgr.createError(401, "unauthorized", 
            "No Customer", "No authenticated customer found").render();
        return;
    }
    
    var customerData = {
        isRegistered: customer.isRegistered(),
        isAuthenticated: customer.isAuthenticated()
    };
    
    // For registered customers, access profile information
    if (customer.isRegistered() && customer.getProfile()) {
        var profile = customer.getProfile();
        customerData.customerId = profile.getCustomerNo();
        customerData.email = profile.getEmail();
        customerData.firstName = profile.getFirstName();
        customerData.lastName = profile.getLastName();
    } else {
        // For guest customers
        customerData.customerId = customer.getID();
        customerData.isGuest = true;
    }
    
    RESTResponseMgr.createSuccess(customerData).render();
};

exports.getCustomerInfo.public = true;
```

## 2. URL Structure and Endpoint Mapping

Understanding how your OpenAPI schema translates to actual SCAPI endpoint URLs is crucial for both development and client integration.

### 2.1 SCAPI URL Structure

All custom SCAPI endpoints follow this standardized URL pattern:

```
https://{shortcode}.api.commercecloud.salesforce.com/custom/{api-name}/v{major-version}/organizations/{organization-id}{path}?{query-parameters}
```

**URL Components:**
- **`{shortcode}`**: Your SFCC instance shortcode (e.g., `zzrf-001`, `my-company-dev`)
- **`{api-name}`**: The directory name under `cartridge/rest-apis/` in your cartridge
- **`v{major-version}`**: Automatically derived from `info.version` in your `schema.yaml` (e.g., "1.0.0" → "v1", "2.3.1" → "v2")
- **`{organization-id}`**: Your SFCC organization ID (typically starts with `f_ecom_`)
- **`{path}`**: The path defined in your OpenAPI schema
- **`{query-parameters}`**: Query string parameters from your schema

### 2.2 Schema-to-URL Mapping Examples

#### Example 1: Simple Query Parameters

**OpenAPI Schema Definition:**
```yaml
# File: int_product_api/cartridge/rest-apis/product-info/schema.yaml
openapi: 3.0.0
info:
  title: Product Information API
  version: "1.0.0"
paths:
  /products/{sku}:
    get:
      summary: Retrieves basic product information by SKU
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
            minLength: 1
```

**Resulting Endpoint URL:**
```
https://{{shortcode}}.api.commercecloud.salesforce.com/custom/product-info/v1/organizations/{{organizationId}}/products/682875540326M?siteId=RefArchGlobal
```

**Complete Example:**
```
https://zzrf-001.api.commercecloud.salesforce.com/custom/product-info/v1/organizations/f_ecom_zzrf_001/products/682875540326M?siteId=RefArchGlobal
```

#### Example 2: Complex Query Parameters with Custom Attributes

**OpenAPI Schema Definition:**
```yaml
# File: int_pricing_api/cartridge/rest-apis/pricing-api/schema.yaml
openapi: 3.0.0
info:
  title: Advanced Pricing API
  version: "1.2.0"  # Results in v1 URL
paths:
  /product-pricing/{productId}:
    get:
      summary: Retrieves comprehensive pricing information for a product SKU
      description: |
        Returns detailed pricing information for a given product including:
        - Base price and promotional prices
        - Available coupon-based promotions (without requiring coupon codes)
        - Price ranges for master products
        - Quantity-based pricing tiers
      operationId: getProductPricing
      parameters:
        - name: siteId
          in: query
          required: true
          description: Site identifier for the pricing context
          schema:
            type: string
            minLength: 1
        - name: productId
          in: path
          required: true
          description: Product ID or SKU to get pricing for
          schema:
            type: string
            minLength: 1
        - name: c_quantity
          in: query
          required: false
          description: Quantity for tiered pricing calculation (defaults to 1)
          schema:
            type: number
            minimum: 1
            default: 1
        - name: c_currency
          in: query
          required: false
          description: Currency code for price display (defaults to session currency)
          schema:
            type: string
            pattern: '^[A-Z]{3}$'
        - name: c_include_upcoming_promotions
          in: query
          required: false
          description: Include upcoming promotions within next 24 hours
          schema:
            type: boolean
            default: false
```

**Resulting Endpoint URL:**
```
https://{{shortcode}}.api.commercecloud.salesforce.com/custom/pricing-api/v1/organizations/{{organizationId}}/product-pricing/product-123?siteId=your-site-id&c_quantity=2&c_include_upcoming_promotions=true
```

**Complete Example:**
```
https://your-shortcode.api.commercecloud.salesforce.com/custom/pricing-api/v1/organizations/your-org-id/product-pricing/product-123?siteId=your-site-id&c_quantity=2&c_include_upcoming_promotions=true
```

#### Example 3: Nested Resource Paths

**OpenAPI Schema Definition:**
```yaml
# File: int_customer_api/cartridge/rest-apis/customer-management/schema.yaml
openapi: 3.0.0
info:
  title: Customer Management API
  version: "2.0.0"  # Results in v2 URL
paths:
  /customers/{customerId}/orders/{orderId}/tracking:
    get:
      summary: Get order tracking information
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
        - name: c_include_delivery_details
          in: query
          required: false
          schema:
            type: boolean
            default: false
```

**Resulting Endpoint URL:**
```
https://{{shortcode}}.api.commercecloud.salesforce.com/custom/customer-management/v2/organizations/{{organizationId}}/customers/12345/orders/ORD-001234/tracking?siteId=SiteGenesis&c_include_delivery_details=true
```

### 2.3 Parameter Access in Scripts

Understanding how to access different parameter types in your script implementation:

```javascript
'use strict';

var RESTResponseMgr = require('dw/system/RESTResponseMgr');

exports.getProductPricing = function () {
    // Path parameters: use getSCAPIPathParameters()
    var productId = request.getSCAPIPathParameters().get('productId');
    
    // Query parameters: use getHttpParameterMap()
    var siteId = request.getHttpParameterMap().get('siteId').getStringValue();
    var quantity = request.getHttpParameterMap().get('c_quantity').getIntValue() || 1;
    var currency = request.getHttpParameterMap().get('c_currency').getStringValue();
    var includeUpcoming = request.getHttpParameterMap().get('c_include_upcoming_promotions').getBooleanValue();
    
    // Parameter validation
    if (!productId) {
        RESTResponseMgr.createError(400, "missing-product-id", 
            "Missing Product ID", "Product ID is required in the path").render();
        return;
    }
    
    // Business logic implementation...
    var pricingData = {
        productId: productId,
        basePrice: 29.99,
        salePrice: 24.99,
        currency: currency || "USD",
        quantity: quantity,
        upcomingPromotions: includeUpcoming ? [] : undefined
    };
    
    RESTResponseMgr.createSuccess(pricingData).render();
};

exports.getProductPricing.public = true;
```

### 2.4 Version Management in URLs

The version segment in your URL is automatically determined by the major version number in your OpenAPI schema:

| Schema Version | URL Version | Example URL |
|----------------|-------------|-------------|
| "1.0.0" | v1 | `/custom/my-api/v1/organizations/...` |
| "1.2.5" | v1 | `/custom/my-api/v1/organizations/...` |
| "2.0.0" | v2 | `/custom/my-api/v2/organizations/...` |
| "2.1.3" | v2 | `/custom/my-api/v2/organizations/...` |
| "3.0.0-beta" | v3 | `/custom/my-api/v3/organizations/...` |

**Best Practice**: Use semantic versioning in your schema and introduce breaking changes only in new major versions to maintain backward compatibility.

### 2.5 Testing Your URL Mappings

#### Using Postman/cURL

```bash
# Test the product pricing endpoint
curl -X GET \
  'https://your-shortcode.api.commercecloud.salesforce.com/custom/pricing-api/v1/organizations/your-org-id/product-pricing/product-123?siteId=your-site-id&c_quantity=2&c_include_upcoming_promotions=true' \
  -H 'Authorization: Bearer YOUR_SLAS_TOKEN' \
  -H 'Content-Type: application/json'
```

### 2.6 Common Issues and Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| 404 Not Found | Endpoint not accessible | Check cartridge registration, API directory name, and schema syntax |
| Version mismatch | Wrong version in URL | Verify `info.version` in schema.yaml matches expected URL |
| Parameter not found | Script can't access parameters | Ensure parameter names match schema exactly, use correct access method |
| Invalid path structure | URL doesn't match expected pattern | Verify path definition in schema matches your intended URL structure |

### 2.7 Documentation for Client Developers

When documenting your custom endpoints for client developers, always provide:

1. **Complete URL Examples**: Show the full URL with real values
2. **Parameter Descriptions**: Explain what each parameter does and its format requirements
3. **Authentication Requirements**: Specify required scopes and token types
4. **Response Examples**: Include sample JSON responses
5. **Error Scenarios**: Document common error codes and their meanings

**Example Documentation:**

```markdown
## Get Product Pricing

Retrieves comprehensive pricing information for a product.

### Endpoint
`GET /custom/pricing-api/v1/organizations/{organizationId}/product-pricing/{productId}`

### Full URL Example
```
https://your-shortcode.api.commercecloud.salesforce.com/custom/pricing-api/v1/organizations/f_ecom_your_org/product-pricing/ABC123?siteId=RefArchGlobal&c_quantity=2
```

### Parameters
- `productId` (path, required): Product SKU or ID
- `siteId` (query, required): Site identifier
- `c_quantity` (query, optional): Quantity for tiered pricing (default: 1)
- `c_currency` (query, optional): Currency code (default: session currency)

### Authentication
Requires SLAS Shopper Token with scope: `c_read_pricing`
```

This URL structure understanding is essential for both endpoint development and client integration, ensuring your custom SCAPI endpoints are accessible and properly documented.

## 3. Securing Endpoints

Endpoints must be associated with a security scheme in the API contract. SCAPI supports two primary security schemes for custom endpoints:

- **ShopperToken**: For Shopper APIs and storefront use cases. Use Shopper Login and API Access to obtain tokens.
- **AmOAuth2**: For SCAPI Admin APIs to be used with backoffice apps. Use Account Manager to obtain tokens.

Association is either per operation or global, with the operation scheme taking precedence. The schemes are the same as those used for non-custom B2C Commerce APIs (SCAPI).

The scheme must set exactly one custom scope.

### 3.1 Security Scheme Configuration

Schemes used in the contract must be defined in the components section, for example:

```yaml
components:
  securitySchemes:
    ShopperToken: {}
    AmOAuth2:
      type: oauth2

# 👇 A global scheme applies to all operations in this file.
security:
  - AmOAuth2: ["c_loyalty_rw"]

paths:
  /customer:
    get:
      operationId: getLoyaltyInfo
      parameters:
        - in: query
          name: siteId
          required: true
          schema:
            type: string
            minLength: 1
      responses:
        200:
          description: OK
      # 👇 An operation scheme applies only to this operation and takes precedence over the global scheme.
      security:
        - ShopperToken: ["c_loyalty"]
```

### 3.2 Custom Scope Requirements

Custom scopes must meet the following requirements:

- The name must begin with `c_`.
- The name must not contain characters other than alphanumeric, period, hyphen and underscore.
- The name must not be more than 25 characters.

Endpoints without correct scheme or scope assignments are not registered.

### 3.3 Requesting Endpoints

#### ShopperLogin

Scopes for ShopperLogin can be assigned to a client in the SLAS Admin UI. For example:

> Custom API SLAS scope configuration and permissions

To obtain a SLAS token, follow the steps in the Shopper Login overview.

#### AmOAuth2

Custom scopes for AmOAuth2 can be assigned to a client in Account Manager. For example:

> Account Manager OAuth2 scopes configuration for Custom APIs

To obtain an Account Manager token follow the steps in the Authorization for Admin APIs guide.

Unauthorized requests receive a 401 Unauthorized response.

### 3.4 Complete Security Scheme Definition

While endpoint registration does not require the complete definition of the security schemes, it can be useful to have a complete and valid scheme to enable the creation of documentation, tests and code stubs, and mock requests. The following code provides a complete example:

```yaml
components:
  securitySchemes:
    ShopperToken:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://my-shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/{organizationId}/oauth2/authorize
          tokenUrl: https://my-shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/{organizationId}/oauth2/token
          scopes:
            c_my-scopes: description of my-scopes
        clientCredentials:
          tokenUrl: https://my-shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/{organizationId}/oauth2/token
          scopes:
            c_my-scopes: description of my-scopes
    AmOAuth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://account.demandware.com/dwsso/oauth2/authorize
          tokenUrl: https://account.demandware.com/dwsso/oauth2/access_token
          scopes:
            c_my-scopes: description of my-scopes
        clientCredentials:
          tokenUrl: https://account.demandware.com/dwsso/oauth2/access_token
          scopes:
            c_my-scopes: description of my-scopes
```

## 4. Core Concept: The Three Pillars of a Custom API

Every Custom SCAPI Endpoint is built from three mandatory files, located within a dedicated cartridge directory: `your_cartridge/cartridge/rest-apis/{api-name}/`.

- **`schema.yaml` (The Contract)**: An OpenAPI 3.0 specification that defines the endpoint's URL path, HTTP method, parameters, security requirements, and response models. SCAPI uses this for automated request validation.

- **`script.js` (The Logic)**: A server-side B2C Commerce script (`dw.*` packages) that contains the business logic. It must export a public function with a name that exactly matches the `operationId` in the schema.

- **`api.json` (The Mapping)**: A simple JSON file that links the `operationId` from the schema to the correct implementation script.

## 5. Quick Start Example: A "Loyalty Info" Endpoint

Here is a complete example for a custom Shopper API endpoint `GET /custom/loyalty-api/v1/.../loyalty-info?c_customer_id={id}`.

### Directory Structure

```
int_loyalty_api/
└── cartridge/
    └── rest-apis/
        └── loyalty-api/
            ├── schema.yaml
            ├── loyalty.js
            └── api.json
```

### `schema.yaml`

```yaml
openapi: 3.0.0
info:
  title: Loyalty Information API
  version: "1.0.0" # Becomes /v1/ in the URL
paths:
  /loyalty-info:
    get:
      summary: Retrieves loyalty points for a customer.
      operationId: getLoyaltyInfo # Must match the exported function name
      parameters:
        - name: siteId # Required for Shopper APIs
          in: query
          required: true
          schema:
            type: string
            minLength: 1
        - name: c_customer_id # Custom parameters must be prefixed with 'c_'
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful retrieval of loyalty information.
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoyaltyInfo'
        '404':
          description: Customer not found.
      security:
        - ShopperToken: [c_read_loyalty] # Apply security scheme and custom scope
components:
  schemas:
    LoyaltyInfo:
      type: object
      properties:
        tier:
          type: string
        points:
          type: integer
  securitySchemes:
    ShopperToken: # Define the security scheme for Shopper APIs
      type: oauth2
      flows:
        clientCredentials:
          tokenUrl: https://my-shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/my-org-id/oauth2/token
          scopes:
            c_read_loyalty: "Read access to loyalty data." # Define custom scope
```

### `loyalty.js`

```javascript
'use strict';

var RESTResponseMgr = require('dw/system/RESTResponseMgr');
var CustomerMgr = require('dw/customer/CustomerMgr');

/**
 * Implements the getLoyaltyInfo operationId.
 */
exports.getLoyaltyInfo = function () {
    var customerId = request.getHttpParameterMap().get('c_customer_id').getStringValue();
    var customer = CustomerMgr.getCustomerByCustomerNumber(customerId);

    // IMPORTANT: Add fine-grained authorization check here.
    // e.g., verify request.user.profile.customerNo === customerId

    if (customer) {
        var loyaltyData = {
            tier: 'Gold',
            points: 25800
        };
        RESTResponseMgr.createSuccess(loyaltyData).render();
    } else {
        RESTResponseMgr.createError(404, "customer-not-found", "Customer Not Found", "Customer ID is unknown.").render();
    }
};

// Function must be public to be exposed as an endpoint
exports.getLoyaltyInfo.public = true;
```

### `api.json`

```json
{
  "endpoints": [
    {
      "endpoint": "getLoyaltyInfo",
      "schema": "schema.yaml",
      "implementation": "loyalty"
    }
  ]
}
```

## 5.1 Working with Path Parameters

When your OpenAPI schema defines parameters with `in: path`, you must use the `getSCAPIPathParameters()` method to access them in your script implementation.

### Path Parameter Example

**schema.yaml with path parameter:**
```yaml
openapi: 3.0.0
info:
  title: Product Reviews API
  version: "1.0.0"
paths:
  /products/{productId}/reviews:
    get:
      summary: Get reviews for a specific product
      operationId: getProductReviews
      parameters:
        - name: productId
          in: path  # This is a path parameter
          required: true
          schema:
            type: string
        - name: siteId
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Product reviews retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Review'
components:
  schemas:
    Review:
      type: object
      properties:
        id:
          type: string
        rating:
          type: integer
        comment:
          type: string
```

**script.js accessing path parameter:**
```javascript
'use strict';

var RESTResponseMgr = require('dw/system/RESTResponseMgr');
var ProductMgr = require('dw/catalog/ProductMgr');

/**
 * Implements the getProductReviews operationId.
 */
exports.getProductReviews = function () {
    // Access path parameters using getSCAPIPathParameters()
    var productId = request.getSCAPIPathParameters().get('productId');
    
    // Access query parameters using getHttpParameterMap()
    var siteId = request.getHttpParameterMap().get('siteId').getStringValue();
    
    // Validate required path parameter
    if (!productId) {
        RESTResponseMgr.createError(400, "missing-product-id", 
            "Missing Product ID", "Product ID is required in the path").render();
        return;
    }
    
    var product = ProductMgr.getProduct(productId);
    if (!product) {
        RESTResponseMgr.createError(404, "product-not-found", 
            "Product Not Found", "Product with ID " + productId + " was not found").render();
        return;
    }
    
    // Business logic to fetch reviews
    var reviews = [
        {
            id: "review-1",
            rating: 5,
            comment: "Excellent product!"
        },
        {
            id: "review-2", 
            rating: 4,
            comment: "Good quality, fast shipping"
        }
    ];
    
    RESTResponseMgr.createSuccess(reviews).render();
};

exports.getProductReviews.public = true;
```

### Key Points for Path Parameters

1. **Path Parameter Access**: Always use `request.getSCAPIPathParameters().get('parameterName')` for parameters defined with `in: path` in your OpenAPI schema.

2. **Query Parameter Access**: Continue using `request.getHttpParameterMap().get('parameterName')` for parameters defined with `in: query`.

3. **Parameter Validation**: Path parameters are automatically validated by SCAPI based on your schema, but you should still add business logic validation in your script.

4. **URL Structure**: Path parameters become part of the URL structure. For example, `/products/{productId}/reviews` with `productId: "ABC123"` becomes `/products/ABC123/reviews`.

5. **Multiple Path Parameters**: You can have multiple path parameters in a single endpoint:
   ```yaml
   paths:
     /customers/{customerId}/orders/{orderId}:
       get:
         parameters:
           - name: customerId
             in: path
             required: true
           - name: orderId
             in: path
             required: true
   ```

   Access them individually:
   ```javascript
   var customerId = request.getSCAPIPathParameters().get('customerId');
   var orderId = request.getSCAPIPathParameters().get('orderId');
   ```


## 5.2 Caching Strategies for Custom Endpoints

### Platform Web-Tier Behavior

- Commerce Cloud's application layer performs web-tier caching for **GET** requests across SCAPI API families. Custom endpoints participate automatically once a request reaches the platform.
- Client-side caches (browser storage, SPA state, CDN/edge caches) continue to operate independently. Model your architecture with layered caches in mind so one layer's miss does not surprise you at runtime.

### Personalized Cache Variants

When personalization is enabled, the cache key is expanded with:

- The complete set of active promotions
- Active product sorting rules
- Applicable price books
- All active AB test groups

That means two shoppers requesting the same URL can receive different cache entries if they fall into different promotional contexts (for example, promotion X vs. promotion Y). This is valuable for targeted experiences but increases cache cardinality. Use personalization only for well-sized shopper cohorts and monitor cache pressure.

`response.setVaryBy('price_promotion')` is the only supported personalization flag. Product detail responses that expand prices or promotions—and product search responses with the `prices` expand—are already personalized by default.

### Programmatic Cache Controls

- `response.setExpires(Date.now() + ttlInMs)`: Sets the cache expiration timestamp. The TTL must be at least **1 second (1,000 ms)** and no more than **86,400 seconds (86,400,000 ms)**.
- `response.setVaryBy('price_promotion')`: Opts into price/promotion-aware personalization for the response variant.

```javascript
// Example snippet within your endpoint script
exports.getLoyaltyInfo = function (params) {
  var loyaltyData = { id: params.c_customer_id, points: 1234 };

  // Cache for five minutes and personalize by price/promotion eligibility when needed
  response.setExpires(Date.now() + 5 * 60 * 1000);
  // response.setVaryBy('price_promotion');

  RESTResponseMgr.createSuccess(loyaltyData).render();
};
exports.getLoyaltyInfo.public = true;
```

### Cache-Key Design Tips

- Introduce explicit query parameters (for example, `c_view=light`) when you need multiple cacheable variants from the same controller logic.
- Avoid combining expansions with drastically different TTLs. The response inherits the **shortest** TTL from the set of requested expands, so pairing a 24-hour asset expand with a 60-second availability expand collapses the lifespan to 60 seconds.
- Pair web-tier caching with application-tier caching (`CacheMgr.getCache().get(key, loader)`) to shield downstream services. See the Performance Best Practices guide for the full two-tier pattern.

## 6. Core Best Practices

### Design & Architecture

**Shopper vs. Admin APIs**: Choose the correct type for your use case. This choice is critical and dictates security, required parameters, and performance limits.

- **Shopper API**: For customer-facing applications. Requires `siteId` parameter. Secured by ShopperToken (SLAS). 10-second timeout.
- **Admin API**: For merchant tools. Must not have `siteId`. Secured by AmOAuth2 (Account Manager). 60-second timeout.

**BFF Pattern**: Create endpoints that aggregate data for specific UI components to reduce the number of client-side calls and improve performance.

### Security

- **Custom Scopes**: Every endpoint must be secured by exactly one custom scope defined in the `schema.yaml`. Scope names must start with `c_` (e.g., `c_read_loyalty`).
- **Client Permissions**: The API client in SLAS (for Shopper) or Account Manager (for Admin) must be granted permission to use your custom scope.
- **In-Script Authorization**: The platform validates the token and scope. You must validate that the authenticated user has permission to access the specific data they are requesting. This prevents privilege escalation attacks.

### Performance

- **Timeouts**: Respect the hard timeouts: 10 seconds for Shopper APIs and 60 seconds for Admin APIs.
- **Efficient Scripting**: Avoid expensive API calls (e.g., `ProductMgr.getProduct()`) inside loops. Fetch data in bulk where possible.
- **External Calls**: Use the Service Framework (`dw.svc.*`) for any third-party callouts. Set aggressive timeouts and enable the circuit breaker to prevent cascading failures.
- **Caching**: Use Custom Caches (`dw.system.CacheMgr`) for data that is expensive to compute but doesn't change often.

### Versioning

- The URL version (e.g., `/v1/`) is automatically derived from the major version number in your `schema.yaml`'s `info.version` field (e.g., "1.0.0" or "1.2.5" both map to v1).
- Introduce breaking changes (e.g., removing a field, changing a data type) in a new major version (e.g., 2.0.0 -> `/v2/`) to avoid disrupting existing clients.

### Troubleshooting

- **404 Not Found**: This almost always means the API failed to register. Systematically check your cartridge structure, file names, `operationId` matching, and `api.json` syntax.
- **403 Forbidden**: The client's token is valid but is missing the required custom scope. Check the scope assignments in SLAS or Account Manager.
- **504 Gateway Timeout**: Your script exceeded the performance limit. Use the Code Profiler to find and optimize the bottleneck in your code.


## 7. Custom APIs vs. Hooks

This is a critical architectural decision.

- **Use Hooks to...** modify or augment the behavior of an existing, out-of-the-box SCAPI endpoint. For example, adding a custom attribute to the standard `/baskets` response.

- **Use Custom APIs to...** create entirely new functionality that has no OOTB equivalent. For example, a store locator, a loyalty points service, or a newsletter signup endpoint.

> **Note**: Choosing the wrong tool leads to technical debt. Do not use hooks to create net-new functionality.

---

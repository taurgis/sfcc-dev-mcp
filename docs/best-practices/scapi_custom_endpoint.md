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

### 1.2 Authentication Flow Examples

#### Private Client: Guest Token Flow (Client Credentials)

```javascript
// Server-side implementation for obtaining a guest token
const axios = require('axios');

async function getGuestToken() {
    const clientId = 'your-private-client-id';
    const clientSecret = 'your-client-secret';
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    try {
        const response = await axios.post(
            'https://your-shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/your-org-id/oauth2/token',
            new URLSearchParams({
                'grant_type': 'client_credentials',
                'channel_id': 'your-site-id',
                'redirect_uri': 'https://your-app.com/callback'
            }),
            {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        
        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            customerId: response.data.customer_id,
            usid: response.data.usid
        };
    } catch (error) {
        throw new Error(`Failed to obtain guest token: ${error.message}`);
    }
}
```

#### Public Client: PKCE Authentication Flow

```javascript
// Browser-side implementation using PKCE
import { createHash, randomBytes } from 'crypto';

class PKCEAuthClient {
    constructor(clientId, redirectUri, baseUrl) {
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.baseUrl = baseUrl;
    }
    
    // Step 1: Generate PKCE parameters
    generatePKCEChallenge() {
        const codeVerifier = randomBytes(32).toString('base64url');
        const codeChallenge = createHash('sha256')
            .update(codeVerifier)
            .digest('base64url');
        
        return { codeVerifier, codeChallenge };
    }
    
    // Step 2: Redirect to authorization endpoint
    initiateLogin(hint = 'guest') {
        const { codeVerifier, codeChallenge } = this.generatePKCEChallenge();
        
        // Store code_verifier securely (sessionStorage for SPAs)
        sessionStorage.setItem('pkce_code_verifier', codeVerifier);
        
        const authUrl = new URL(`${this.baseUrl}/shopper/auth/v1/organizations/your-org-id/oauth2/authorize`);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('client_id', this.clientId);
        authUrl.searchParams.set('redirect_uri', this.redirectUri);
        authUrl.searchParams.set('code_challenge', codeChallenge);
        authUrl.searchParams.set('hint', hint);
        
        window.location.href = authUrl.toString(); // GET redirect to authorization server
    }
    
    // Step 3: Exchange authorization code for tokens
    async exchangeCodeForToken(authorizationCode) {
        const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
        if (!codeVerifier) {
            throw new Error('Code verifier not found');
        }
        
        try {
            const response = await fetch(
                `${this.baseUrl}/shopper/auth/v1/organizations/your-org-id/oauth2/token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        'grant_type': 'authorization_code_pkce',
                        'code': authorizationCode,
                        'redirect_uri': this.redirectUri,
                        'client_id': this.clientId,
                        'code_verifier': codeVerifier,
                        'channel_id': 'your-site-id',
                        'usid': 'your-usid' // optional
                    })
                }
            );
            
            if (!response.ok) {
                throw new Error(`Token exchange failed: ${response.statusText}`);
            }
            
            const tokens = await response.json();
            
            // Clean up
            sessionStorage.removeItem('pkce_code_verifier');
            
            return tokens;
        } catch (error) {
            throw new Error(`Token exchange error: ${error.message}`);
        }
    }
}
```

### 1.3 Advanced Authentication Patterns

#### Trusted System on Behalf of (TSOB)

For server-to-server integrations where a trusted system acts on behalf of a shopper:

```javascript
// Private client only - requires special scope: sfcc.ts_ext_on_behalf_of
async function getTSOBToken(shopperLoginId, idpOrigin = 'ecom') {
    const response = await axios.post(
        'https://your-shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/your-org-id/oauth2/trusted-system/token',
        new URLSearchParams({
            'grant_type': 'client_credentials',
            'hint': 'ts_ext_on_behalf_of',
            'login_id': shopperLoginId,
            'idp_origin': idpOrigin,
            'channel_id': 'your-site-id'
        }),
        {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    
    return response.data;
}
```

#### Session Bridge for Hybrid Architectures

For transitioning between headless (SLAS JWT) and traditional SFRA (dwsid cookie):

```javascript
// Exchange SLAS token for SFRA session
async function bridgeToSFRA(slasAccessToken) {
    const response = await fetch('/s/your-site/dw/shop/v20_4/sessions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${slasAccessToken}`,
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Important: allows cookie setting
    });
    
    // dwsid cookie is automatically set by the response
    return response.json();
}
```

### 1.4 Security Best Practices

#### Refresh Token Rotation (Public Clients)

SLAS enforces refresh token rotation for security. Each refresh token is single-use:

```javascript
class TokenManager {
    async refreshToken(currentRefreshToken) {
        try {
            const response = await fetch(
                `${this.baseUrl}/shopper/auth/v1/organizations/your-org-id/oauth2/token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        'grant_type': 'refresh_token',
                        'refresh_token': currentRefreshToken,
                        'client_id': this.clientId
                    })
                }
            );
            
            const newTokens = await response.json();
            
            // CRITICAL: Store new refresh token, old one is invalidated
            this.storeTokens(newTokens);
            
            return newTokens;
        } catch (error) {
            // Token may be compromised, clear all stored tokens
            this.clearTokens();
            throw error;
        }
    }
}
```

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

### 1.5 Client Configuration and Scope Management

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

### 1.6 Error Handling and Troubleshooting

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

## 2. Core Concept: The Three Pillars of a Custom API

Every Custom SCAPI Endpoint is built from three mandatory files, located within a dedicated cartridge directory: `your_cartridge/cartridge/rest-apis/{api-name}/`.

- **`schema.yaml` (The Contract)**: An OpenAPI 3.0 specification that defines the endpoint's URL path, HTTP method, parameters, security requirements, and response models. SCAPI uses this for automated request validation.

- **`script.js` (The Logic)**: A server-side B2C Commerce script (`dw.*` packages) that contains the business logic. It must export a public function with a name that exactly matches the `operationId` in the schema.

- **`api.json` (The Mapping)**: A simple JSON file that links the `operationId` from the schema to the correct implementation script.

## 2. Quick Start Example: A "Loyalty Info" Endpoint

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

## 2.1 Working with Path Parameters

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


## 3. Core Best Practices

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
- **Log Center**: Use the Log Center with the query `CustomApiRegistry` to find detailed error messages about registration failures.
- **403 Forbidden**: The client's token is valid but is missing the required custom scope. Check the scope assignments in SLAS or Account Manager.
- **504 Gateway Timeout**: Your script exceeded the performance limit. Use the Code Profiler to find and optimize the bottleneck in your code.

## 4. Custom APIs vs. Hooks

This is a critical architectural decision.

- **Use Hooks to...** modify or augment the behavior of an existing, out-of-the-box SCAPI endpoint. For example, adding a custom attribute to the standard `/baskets` response.

- **Use Custom APIs to...** create entirely new functionality that has no OOTB equivalent. For example, a store locator, a loyalty points service, or a newsletter signup endpoint.

> **Note**: Choosing the wrong tool leads to technical debt. Do not use hooks to create net-new functionality.

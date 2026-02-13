# SCAPI Authentication Reference

Complete reference for SLAS authentication flows, client configuration, and token management.

## Client Architecture: Public vs Private

The most critical architectural decision is determining your client type:

### Private Clients

- **Capability**: Can securely store a `client_secret` on server-side
- **Use Cases**: Backend-for-Frontend (BFF), full-stack web apps, server-to-server integrations
- **Security Model**: Uses `client_secret` in Basic Authorization header
- **OAuth Grant Types**: 
  - `client_credentials` (guest users, system operations)
  - `authorization_code` (registered user authentication)

### Public Clients

- **Capability**: Cannot securely store secrets (operates in untrusted environments)
- **Use Cases**: PWA Kit storefronts, Single-Page Applications (SPAs), native mobile apps
- **Security Model**: Uses Proof Key for Code Exchange (PKCE)
- **OAuth Grant Types**: 
  - `authorization_code_pkce` (all authentication scenarios)

## SLAS Client Configuration

Configure clients using the SLAS Admin API or UI:

```javascript
const clientConfig = {
    "clientId": "your-client-id",
    "name": "My Custom API Client",
    "isPrivateClient": true,
    "secret": "secure-client-secret", // Only for private clients
    "channels": ["your-site-id"],
    "scopes": [
        "sfcc.shopper-baskets-orders.rw",
        "sfcc.shopper-myaccount.rw", 
        "sfcc.shopper-products",
        "c_read_loyalty", // Custom scopes
        "c_write_loyalty"
    ],
    "redirectUri": [
        "https://your-app.com/callback"
    ]
};
```

## Custom Object Scopes

For accessing custom objects via SCAPI:

1. **Define Custom Object** in Business Manager: `Administration > Site Development > Custom Object Types`
2. **Add Scope** to SLAS client: `sfcc.shopper-custom-objects.{object-type-id}`

```yaml
# In schema.yaml
security:
  - ShopperToken: [sfcc.shopper-custom-objects.StoreReview]
```

## Private Client: Guest Token Flow

```bash
# Get Guest Token
wget --post-data="grant_type=client_credentials" \
     --header="Authorization: Basic $(echo -n 'client-id:client-secret' | base64)" \
     --header="Content-Type: application/x-www-form-urlencoded" \
     -O token_response.json \
     "https://shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/org_id/oauth2/token"

# Extract Token
TOKEN=$(cat token_response.json | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

# Test API Call
wget --header="Authorization: Bearer $TOKEN" \
     -O result.json \
     "https://shortcode.api.commercecloud.salesforce.com/custom/my-api/v1/organizations/org_id/endpoint?siteId=MySite"
```

## Public Client: PKCE Flow

```bash
# Generate PKCE Challenge
VERIFIER=$(openssl rand -base64 96 | tr -d '\n' | tr '/+' '_-' | tr -d '=')
CHALLENGE=$(echo -n $VERIFIER | openssl dgst -binary -sha256 | openssl base64 -A | tr '/' '_' | tr '+' '-' | tr -d '=')

# Get Authorization Code
wget --server-response --spider \
     "https://shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/org_id/oauth2/authorize?redirect_uri=http://localhost:3000/callback&response_type=code&hint=guest&client_id=public-client-id&code_challenge=$CHALLENGE" \
     2>&1 | grep -i location

# Exchange Code for Token (extract usid and code from Location header)
wget --post-data="client_id=public-client-id&channel_id=site-id&code_verifier=$VERIFIER&usid=your-usid&code=your-code&grant_type=authorization_code_pkce&redirect_uri=http://localhost:3000/callback" \
     --header="Content-Type: application/x-www-form-urlencoded" \
     -O token_response.json \
     "https://shortcode.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/org_id/oauth2/token"
```

## In-Script Authorization

Always validate the authenticated user can access the requested data:

```javascript
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

## Token Validation Helper

```javascript
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
        customerId: request.user.ID
    };
}
```

## Accessing Customer Context

Even in headless JWT-based SCAPI, you can access the authenticated customer:

```javascript
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
    
    if (customer.isRegistered() && customer.getProfile()) {
        var profile = customer.getProfile();
        customerData.customerId = profile.getCustomerNo();
        customerData.email = profile.getEmail();
        customerData.firstName = profile.getFirstName();
        customerData.lastName = profile.getLastName();
    } else {
        customerData.customerId = customer.getID();
        customerData.isGuest = true;
    }
    
    RESTResponseMgr.createSuccess(customerData).render();
};

exports.getCustomerInfo.public = true;
```

## Common Authentication Errors

| Error Code | Cause | Solution |
|------------|-------|----------|
| 401 Unauthorized | Invalid or expired token | Refresh token or re-authenticate |
| 403 Forbidden | Valid token, missing scope | Check client scope configuration |
| 400 Bad Request | Invalid PKCE parameters | Verify code_verifier/code_challenge |
| 404 Not Found | Incorrect endpoint URL | Verify API registration and URL structure |

## Security Scheme Configuration

For Shopper APIs:
1. Configure custom scope in SLAS Admin UI
2. Obtain token via Shopper Login (SLAS)
3. Include `siteId` in requests

For Admin APIs:
1. Configure custom scope in Account Manager
2. Obtain token via Account Manager OAuth
3. Omit `siteId` from requests

## Custom API Status Report Access

To query the Custom API status report, use an Account Manager token with scope:
- `sfcc.custom-apis` (read-only)
- `sfcc.custom-apis.rw` (read-write)

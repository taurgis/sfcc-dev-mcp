## Standard SFRA Controllers

SFRA provides a comprehensive set of base controllers that handle core ecommerce functionality. Understanding these controllers is essential for customization and extension. Each controller returns specific model structures that provide data to templates and AJAX responses.

**Note**: The following documentation is based on actual SFRA controller implementations found in the base cartridge.

### Core Page Controllers

#### **Home Controller** (`Home.js`)
Handles homepage rendering with Page Designer integration.

**Key Routes:**

##### `Home-Show`: Main homepage endpoint
- **Returns**: Homepage view with Page Designer content or fallback template
- **Models Returned**:
  - Uses Page Designer page 'homepage' if available and visible
  - Falls back to `home/homePage.isml` template with no explicit model data
  - Page metadata is set via `pageMetaHelper.setPageMetaTags()`
- **Template**: Page Designer 'homepage' or `home/homePage.isml`
- **Middlewares**: `consentTracking.consent`, `cache.applyDefaultCache`, `pageMetaData.computedPageMetaData`

##### `Home-ErrorNotFound`: 404 error handling
- **Returns**: 404 error page with status code 404
- **Models Returned**: No explicit model data passed
- **Template**: `error/notFound.isml`

#### **Product Controller** (`Product.js`)
Manages product detail pages, variations, and product-related functionality.

**Key Routes:**

##### `Product-Show`: Main product detail page
- **Returns**: Complete product detail information with Page Designer support
- **Models Returned**:
  - `pdict.product` - Complete product model from `productHelper.showProductPage()`
  - `pdict.addToCartUrl` - URL for adding product to cart
  - `pdict.resources` - Localized resource strings from `productHelper.getResources()`
  - `pdict.breadcrumbs` - Navigation breadcrumb array
  - `pdict.canonicalUrl` - SEO canonical URL
  - `pdict.schemaData` - Schema.org structured data
  - Uses Page Designer product page if available, otherwise falls back to standard template
- **Template**: Page Designer page or `product/productDetails.isml`
- **Middlewares**: `cache.applyPromotionSensitiveCache`, `consentTracking.consent`, `pageMetaData.computedPageMetaData`
- **Notes**: Sets `res.cachePeriod = 0` for pages with visibility rules; returns 404 for offline products (except sets/bundles)

##### `Product-ShowInCategory`: Product detail within category context
- **Returns**: Product detail with category navigation context
- **Models Returned**: Same as `Product-Show` plus:
  - Category-aware breadcrumbs from `productHelper.showProductPage()`
- **Template**: Standard product template (no Page Designer support)

##### `Product-Variation`: AJAX endpoint for product variation selection
- **Returns**: JSON response with updated product data and rendered HTML components
- **Models Returned**:
```javascript
{
    "product": {
        // Full product model with updated variation data
        "price": {...}, // With rendered HTML via priceHelper
        "attributesHtml": "...", // Rendered attributes template
        "promotionsHtml": "...", // Rendered promotions template  
        "optionsHtml": "..." // Rendered options template
    },
    "resources": {...} // Localized strings from productHelper.getResources()
}
```

### Shopping Cart & Checkout Controllers

#### **Cart Controller** (`Cart.js`)
Manages shopping cart functionality and basket operations.

**Key Routes:**

##### `Cart-Show`: Shopping cart page display
- **Returns**: Complete shopping cart page
- **Models Returned**:
  - Returns the entire `CartModel(currentBasket)` object directly to template
  - Includes automatic currency update and shipping method validation
  - `reportingURLs` set in viewData for analytics
- **Template**: `cart/cart.isml`
- **Middlewares**: `server.middleware.https`, `consentTracking.consent`, `csrfProtection.generateToken`

##### `Cart-MiniCart`: Header mini-cart component
- **Returns**: Mini-cart icon with quantity
- **Models Returned**:
  - `pdict.quantityTotal` - Total quantity of items in basket
- **Template**: `/components/header/miniCart.isml`
- **Middlewares**: `server.middleware.include`

##### `Cart-AddProduct`: Add products to cart (POST)
- **Returns**: JSON response with comprehensive cart update information
- **Models Returned**:
```javascript
{
    "reportingURL": "...", // Analytics reporting URL
    "quantityTotal": 5, // Total quantity in cart
    "message": "Product added to cart", // Success/error message
    "cart": {...}, // Complete CartModel object
    "newBonusDiscountLineItem": {...}, // Bonus product info if applicable
    "error": false, // Boolean error flag
    "pliUUID": "uuid-string", // Product line item UUID
    "minicartCountOfItems": "5 Items" // Localized item count string
}
```

##### `Cart-Get`: Get current cart data
- **Returns**: JSON response with current cart state
- **Models Returned**: Complete `CartModel(currentBasket)` object as JSON

##### `Cart-RemoveProductLineItem`: Remove items from cart
- **Returns**: JSON response with updated cart data
- **Models Returned**: Similar structure to `Cart-AddProduct` with updated cart state

#### **Checkout Controller** (`Checkout.js`)
Manages the complete checkout process including shipping, billing, and payment.

**Key Routes:**

##### `Checkout-Begin`: Main checkout entry point
- **Returns**: Checkout page with customer, shipping, and billing forms
- **Models Returned**:
  - `pdict.order` - Complete `OrderModel` with basket data, customer info, and shipping/billing forms
  - `pdict.customer` - `AccountModel` with customer profile and address book
  - `pdict.forms` - Form objects for guest customer, registered customer, shipping, and billing
  - `pdict.expirationYears` - Array of credit card expiration years (current + 10 years)
  - `pdict.currentStage` - Current checkout stage ('customer', 'shipping', 'payment', 'placeOrder')
  - `pdict.reportingURLs` - Analytics reporting URLs
  - `pdict.oAuthReentryEndpoint` - OAuth reentry point identifier
- **Template**: `checkout/checkout.isml`
- **Middlewares**: `server.middleware.https`, `consentTracking.consent`, `csrfProtection.generateToken`
- **Notes**: Validates basket, handles multi-shipping, updates currency, calculates totals, and determines appropriate checkout stage

#### **CheckoutServices Controller** (`CheckoutServices.js`)
Provides AJAX services for checkout process steps including customer information, payment processing, and order placement.

**Key Routes:**

##### `CheckoutServices-Get`: Get current checkout state for multi-shipping
- **Returns**: JSON response with current basket and customer state
- **Models Returned**:
    - `order` - Complete `OrderModel` with basket data for multi-shipping context
    - `customer` - `AccountModel` with customer profile information
    - `error` - Boolean indicating validation status
    - `message` - Error message if shipping addresses are invalid
- **Middlewares**: `server.middleware.https`
- **Notes**: Only used in multi-ship checkout when clicking "Next: Payment"

##### `CheckoutServices-SubmitCustomer`: Submit guest customer information (POST)
- **Returns**: JSON response with customer submission result
- **Models Returned**:
```javascript
// Success
{
    "customer": {...}, // AccountModel
    "error": false,
    "order": {...}, // OrderModel with updated customer email
    "csrfToken": "...", // New CSRF token
    "redirectUrl": null
}

// Error
{
    "form": {...}, // Customer form with validation state
    "fieldErrors": [...], // Array of field-specific errors
    "serverErrors": [],
    "error": true
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Notes**: Validates guest customer form and sets customer email in basket

##### `CheckoutServices-LoginCustomer`: Submit registered customer login (POST)
- **Returns**: JSON response with login result
- **Models Returned**:
```javascript
// Success
{
    "customer": {...}, // AccountModel for authenticated customer
    "error": false,
    "order": {...}, // OrderModel
    "csrfToken": "...", // Refreshed CSRF token after login
    "redirectUrl": "https://checkout-begin-shipping-url"
}

// Error - Invalid credentials
{
    "form": {...}, // Customer form
    "fieldErrors": [...],
    "serverErrors": [],
    "customerErrorMessage": "Invalid login credentials",
    "error": true
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Notes**: Authenticates customer and refreshes session tokens

##### `CheckoutServices-SubmitPayment`: Submit payment and billing information (POST)
- **Returns**: JSON response with payment processing result
- **Models Returned**:
```javascript
// Success
{
    "renderedPaymentInstruments": "...", // HTML for stored payment instruments
    "customer": {...}, // AccountModel
    "order": {...}, // OrderModel with updated totals and payment
    "form": {...}, // Billing form (with sensitive data cleared)
    "error": false
}

// Error - Form validation
{
    "form": {...}, // Billing form with validation state
    "fieldErrors": [...], // Array of form field errors
    "serverErrors": [...], // Array of payment processing errors
    "error": true
}

// Error - Cart issues
{
    "error": true,
    "cartError": true,
    "fieldErrors": [],
    "serverErrors": [],
    "redirectUrl": "cart-show-url"
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Form Parameters**: Complete billing address, contact info, and credit card fields
- **Notes**: Validates billing form, processes payment via hooks, calculates totals, and handles payment instrument storage

##### `CheckoutServices-PlaceOrder`: Place the final order (POST)
- **Returns**: JSON response with order placement result
- **Models Returned**:
```javascript
// Success
{
    "error": false,
    "orderID": "order-number",
    "orderToken": "order-token",
    "continueUrl": "order-confirmation-url"
}

// Error - Validation failure
{
    "error": true,
    "errorStage": {
        "stage": "shipping|payment",
        "step": "address|paymentInstrument"
    },
    "errorMessage": "Specific error message"
}

// Error - Fraud detection
{
    "error": true,
    "cartError": true,
    "redirectUrl": "fraud-error-url",
    "errorMessage": "Technical error message"
}
```
- **Middlewares**: `server.middleware.https`
- **Notes**: Comprehensive order validation, fraud detection, payment authorization, and order creation

#### **CheckoutAddressServices Controller** (`CheckoutAddressServices.js`)
Handles address-related AJAX services during checkout, specifically for multi-shipping scenarios.

**Key Routes:**

##### `CheckoutAddressServices-CreateNewAddress`: Create new shipment for multi-shipping (POST)
- **Returns**: JSON response with new shipment information
- **Models Returned**:
```javascript
// Success
{
    "uuid": "new-shipment-uuid", // UUID of created shipment
    "customer": {...}, // AccountModel
    "order": {...} // OrderModel with new shipment structure
}

// Error - No basket
{
    "redirectUrl": "cart-show-url",
    "error": true
}

// Error - Shipment creation failed
{
    "redirectUrl": "checkout-begin-url",
    "error": true
}
```
- **Middlewares**: `server.middleware.https`
- **Parameters**: `productLineItemUUID` - Product line item to move to new shipment
- **Notes**: Creates new shipment and moves specified product line item to it

##### `CheckoutAddressServices-AddNewAddress`: Save shipping address in multi-shipping (POST)
- **Returns**: JSON response with address save result
- **Models Returned**:
```javascript
// Success
{
    "customer": {...}, // AccountModel
    "order": {...}, // OrderModel with updated shipping addresses
    "error": false
}

// Error - Form validation
{
    "form": {...}, // Shipping form with validation state
    "fieldErrors": [...], // Array of address validation errors
    "serverErrors": [],
    "error": true
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Form Parameters**: Complete shipping address fields, shipping method, gift options
- **Notes**: Validates shipping form and applies address to appropriate shipment in multi-shipping context

##### `CheckoutAddressServices-SelectShippingAddress`: Select existing address (POST)
- **Returns**: JSON response with address selection result
- **Models Returned**:
```javascript
{
    "customer": {...}, // AccountModel
    "order": {...}, // OrderModel with selected address applied
    "error": false
}
```
- **Notes**: Applies selected address from customer's address book to shipment

#### **CheckoutShippingServices Controller** (`CheckoutShippingServices.js`)
Manages shipping method selection and calculation during checkout.

**Key Routes:**

##### `CheckoutShippingServices-ToggleMultiShip`: Toggle multi-shipping mode (POST)
- **Returns**: JSON response with multi-shipping toggle result
- **Models Returned**:
```javascript
// Success
{
    "customer": {...}, // AccountModel
    "order": {...}, // OrderModel with updated shipment structure
    "error": false
}

// Error - No basket
{
    "error": true,
    "cartError": true,
    "fieldErrors": [],
    "serverErrors": [],
    "redirectUrl": "cart-show-url"
}
```
- **Middlewares**: `server.middleware.https`
- **Parameters**: `usingMultiShip` - Boolean flag to enable/disable multi-shipping
- **Notes**: Either splits line items into separate shipments or consolidates them into single shipment

##### `CheckoutShippingServices-UpdateShippingMethodsList`: Get available shipping methods (POST)
- **Returns**: JSON response with shipping methods for specific shipment
- **Models Returned**:
```javascript
{
    "order": {...}, // OrderModel with updated shipping options
    "customer": {...}, // AccountModel
    "error": false
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Notes**: Updates available shipping methods based on shipment address

##### `CheckoutShippingServices-SelectShippingMethod`: Select shipping method (POST)
- **Returns**: JSON response with shipping method selection result
- **Models Returned**:
```javascript
{
    "order": {...}, // OrderModel with updated shipping costs and totals
    "customer": {...}, // AccountModel
    "error": false
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Parameters**: `shipmentUUID`, `shippingMethodID`
- **Notes**: Applies selected shipping method to specified shipment and recalculates totals

##### `CheckoutShippingServices-SubmitShipping`: Submit shipping information (POST)
- **Returns**: JSON response with shipping submission result
- **Models Returned**:
```javascript
// Success
{
    "order": {...}, // OrderModel with finalized shipping information
    "customer": {...}, // AccountModel
    "error": false,
    "csrfToken": "..." // Refreshed CSRF token
}

// Error
{
    "form": {...}, // Shipping form with validation errors
    "fieldErrors": [...],
    "serverErrors": [],
    "error": true
}
```
- **Middlewares**: `server.middleware.https`, `csrfProtection.validateAjaxRequest`
- **Notes**: Final shipping step validation and preparation for payment stage

### Order Management Controllers

#### **Order Controller** (`Order.js`)
Manages order confirmation, history, and details.

**Key Routes:**

##### `Order-Confirm`: Order confirmation page (POST)
- **Returns**: Order confirmation page with order details
- **Models Returned**:
  - `pdict.order` - Complete `OrderModel` with all order details, line items, and totals
  - `pdict.returningCustomer` - Boolean indicating if customer is registered
  - `pdict.passwordForm` - Password creation form for guest customers (optional)
  - `pdict.reportingURLs` - Analytics URLs for order tracking
  - `pdict.orderUUID` - Order UUID for tracking
- **Template**: `checkout/confirmation/confirmation.isml`
- **Middlewares**: `consentTracking.consent`, `server.middleware.https`, `csrfProtection.generateToken`
- **Notes**: Validates order ID and token, prevents duplicate confirmations, handles both guest and registered customer confirmations

##### `Order-History`: Customer order history
- **Returns**: List of customer's past orders
- **Models Returned**:
  - `pdict.orders` - Paginated list of customer orders
  - `pdict.orderPagination` - Pagination information
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/orderHistory.isml`
- **Middlewares**: `userLoggedIn.validateLoggedIn`, `consentTracking.consent`

##### `Order-Details`: Individual order details
- **Returns**: Detailed view of specific order
- **Models Returned**:
  - `pdict.order` - Complete `OrderModel` with full order details
  - `pdict.exitLinkUrl` - URL to return to order history
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/orderDetails.isml`
- **Middlewares**: `userLoggedIn.validateLoggedIn`, `consentTracking.consent`

### Account Management Controllers

#### **Account Controller** (`Account.js`)
Manages customer account functionality and authentication.

**Key Routes:**

##### `Account-Show`: Account dashboard
- **Returns**: Complete customer account dashboard
- **Models Returned**:
  - `pdict.account` - Account model from `accountHelpers.getAccountModel(req)`
  - `pdict.accountlanding` - Boolean flag set to true
  - `pdict.breadcrumbs` - Navigation breadcrumbs array
  - `pdict.reportingURLs` - Analytics URLs (if registration completion)
  - `pdict.payment` - Payment information from account model
  - `pdict.viewSavedPaymentsUrl` - URL to payment instruments list
  - `pdict.addPaymentUrl` - URL to add new payment method
- **Template**: `account/accountDashboard.isml`
- **Middlewares**: `server.middleware.https`, `userLoggedIn.validateLoggedIn`, `consentTracking.consent`

##### `Account-Login`: Customer login (POST)
- **Returns**: JSON response with authentication result
- **Models Returned**:
```javascript
// Success
{
    "success": true,
    "redirectUrl": "redirect-url-from-accountHelpers.getLoginRedirectURL()"
}

// Failure (various error scenarios)
{
    "error": ["Error message from Resource bundle or custom message"]
}
```
- **Special Handling**: Account lockout triggers email notification via hooks

##### `Account-SubmitRegistration`: New customer registration
- **Returns**: JSON response with registration result
- **Models Returned**: Uses form validation with `server.forms.getForm('profile')`
```javascript
// Success response structure varies based on form validation
// Error responses include field-specific validation errors
{
    // Form validation errors for specific fields
    "fieldErrors": {...},
    // General registration errors
    "error": [...]
}
```

#### **Address Controller** (`Address.js`)
Manages customer address book functionality.

**Key Routes:**

##### `Address-List`: Display customer's address book
- **Returns**: List of customer's saved addresses
- **Models Returned**:
  - `pdict.addressBook` - Array of `AddressModel` objects from customer's address book
  - `pdict.actionUrls` - URLs for delete and list actions
  - `pdict.breadcrumbs` - Navigation breadcrumbs array
- **Template**: `account/addressBook.isml`
- **Middlewares**: `userLoggedIn.validateLoggedIn`, `consentTracking.consent`

##### `Address-AddAddress`: Add new address form (GET)
- **Returns**: New address creation form
- **Models Returned**:
  - `pdict.addressForm` - Empty address form for new address creation
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/addEditAddress.isml`
- **Middlewares**: `csrfProtection.generateToken`, `consentTracking.consent`, `userLoggedIn.validateLoggedIn`

##### `Address-EditAddress`: Edit existing address form (GET)
- **Returns**: Pre-populated address edit form
- **Models Returned**:
  - `pdict.addressForm` - Address form populated with existing address data
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/addEditAddress.isml`

##### `Address-SaveAddress`: Save address (POST)
- **Returns**: JSON response with save result
- **Models Returned**: Form validation results and success/error status

##### `Address-DeleteAddress`: Delete address (POST)
- **Returns**: JSON response with deletion result
- **Models Returned**: Success/error status for address deletion

#### **PaymentInstruments Controller** (`PaymentInstruments.js`)
Manages customer's saved payment methods.

**Key Routes:**

##### `PaymentInstruments-List`: Display saved payment methods
- **Returns**: List of customer's saved payment instruments
- **Models Returned**:
  - `pdict.paymentInstruments` - Array of customer's saved payment methods
  - `pdict.actionUrls` - URLs for payment instrument management
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/payment/paymentMethods.isml`
- **Middlewares**: `userLoggedIn.validateLoggedIn`, `consentTracking.consent`

##### `PaymentInstruments-AddPayment`: Add new payment method form
- **Returns**: New payment method creation form
- **Models Returned**:
  - `pdict.paymentForm` - Payment instrument form
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `account/payment/addPayment.isml`

##### `PaymentInstruments-SavePayment`: Save payment method (POST)
- **Returns**: JSON response with save result
- **Models Returned**: Form validation and success/error status

### Search & Navigation Controllers

#### **Search Controller** (`Search.js`)
Handles product search, category navigation, and refinements.

**Key Routes:**

##### `Search-Show`: Main search/category listing page
- **Returns**: Product listing page with search results or category products
- **Models Returned**:
  - `pdict.productSearch` - Complete `ProductSearchModel` with search results, refinements, and pagination
  - `pdict.maxSlots` - Maximum recommendation slots
  - `pdict.reportingURLs` - Analytics reporting URLs
  - `pdict.refineurl` - Base URL for refinements
  - `pdict.breadcrumbs` - Category/search breadcrumbs
  - `pdict.apiProductSearch` - Raw search API results for analytics
- **Template**: `search/searchResults.isml`
- **Middlewares**: `cache.applyPromotionSensitiveCache`, `consentTracking.consent`, `pageMetaData.computedPageMetaData`

##### `Search-UpdateGrid`: AJAX grid update for sorting/pagination
- **Returns**: Updated product grid HTML
- **Models Returned**:
  - `pdict.productSearch` - Updated search results with new sorting/pagination
- **Template**: `/search/productGrid.isml`
- **Notes**: Called when shopper changes sort order or requests more results

##### `Search-Refinebar`: Refinement sidebar component
- **Returns**: Refinement filters sidebar
- **Models Returned**:
  - `pdict.productSearch` - Search model with available refinements
- **Template**: `/search/refinementBar.isml`
- **Middlewares**: `cache.applyDefaultCache`

##### `Search-GetSuggestions`: Search suggestions for autocomplete
- **Returns**: JSON search suggestions
- **Models Returned**:
```javascript
{
    "suggestions": [...], // Array of search term suggestions
    "productSuggestions": [...], // Array of product suggestions
    "categorySuggestions": [...] // Array of category suggestions
}
```

#### **SearchServices Controller** (`SearchServices.js`)
Provides AJAX services for search functionality including autocomplete and refinements.

### Content & Utility Controllers

#### **Page Controller** (`Page.js`)
Handles content pages and Page Designer content.

**Key Routes:**

##### `Page-Show`: Display content pages
- **Returns**: Content page with Page Designer or static content
- **Models Returned**:
  - `pdict.page` - Page model with content and metadata
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: Page Designer page or content template
- **Middlewares**: `cache.applyDefaultCache`, `consentTracking.consent`, `pageMetaData.computedPageMetaData`

#### **PageDesigner Controller** (`PageDesigner.js`)
Handles Page Designer specific functionality and components.

#### **ContactUs Controller** (`ContactUs.js`)
Manages contact forms and customer inquiries.

**Key Routes:**

##### `ContactUs-Show`: Display contact form
- **Returns**: Contact us form page
- **Models Returned**:
  - `pdict.contactUsForm` - Contact form object
  - `pdict.breadcrumbs` - Navigation breadcrumbs
- **Template**: `contactUs/contactUs.isml`
- **Middlewares**: `csrfProtection.generateToken`, `consentTracking.consent`

##### `ContactUs-Submit`: Process contact form submission (POST)
- **Returns**: JSON response with submission result
- **Models Returned**: Form validation results and success/error status

### Authentication & Security Controllers

#### **Login Controller** (`Login.js`)
Handles customer authentication flows.

**Key Routes:**

##### `Login-Show`: Display login form
- **Returns**: Login page with forms
- **Models Returned**:
  - `pdict.loginForm` - Customer login form
  - `pdict.profileForm` - New customer registration form
  - `pdict.breadcrumbs` - Navigation breadcrumbs
  - `pdict.oAuthReentryEndpoint` - OAuth reentry point
- **Template**: `account/login.isml`
- **Middlewares**: `csrfProtection.generateToken`, `consentTracking.consent`

##### `Login-Logout`: Customer logout
- **Returns**: Redirect to home page after logout
- **Models Returned**: No models (redirect response)

##### `Login-OAuthReentry`: Handle OAuth authentication reentry
- **Returns**: Continues checkout or redirects based on context
- **Models Returned**: Varies based on OAuth flow context

#### **CSRF Controller** (`CSRF.js`)
Provides CSRF token management services.

**Key Routes:**

##### `CSRF-Generate`: Generate new CSRF token
- **Returns**: JSON response with new CSRF token
- **Models Returned**:
```javascript
{
    "csrf": {
        "tokenName": "csrf_token",
        "token": "generated-token-value"
    }
}
```

### Privacy & Compliance Controllers

#### **ConsentTracking Controller** (`ConsentTracking.js`)
Manages privacy consent and tracking preferences.

**Key Routes:**

##### `ConsentTracking-SetSession`: Set tracking consent preference
- **Returns**: JSON response with consent status
- **Models Returned**: Consent preference status and updates

##### `ConsentTracking-GetContent`: Get consent banner content
- **Returns**: HTML content for consent banner
- **Models Returned**:
  - `pdict.consentContent` - Localized consent text and options

### Communication Controllers

#### **EmailSubscribe Controller** (`EmailSubscribe.js`)
Manages email subscription functionality.

**Key Routes:**

##### `EmailSubscribe-Subscribe`: Newsletter subscription (POST)
- **Returns**: JSON response with subscription result
- **Models Returned**: Subscription status and validation results

### Store Locator Controllers

#### **Stores Controller** (`Stores.js`)
Handles store locator functionality.

**Key Routes:**

##### `Stores-Find`: Store locator search
- **Returns**: Store search results page
- **Models Returned**:
  - `pdict.stores` - Array of store locations
  - `pdict.searchKey` - Current search terms
  - `pdict.googleMapsApi` - Google Maps API configuration
- **Template**: `storeLocator/storeLocator.isml`

##### `Stores-Details`: Individual store details
- **Returns**: Detailed store information
- **Models Returned**:
  - `pdict.store` - Complete store model with details
  - `pdict.breadcrumbs` - Navigation breadcrumbs

### Error Handling Controllers

#### **Error Controller** (`Error.js`)
Provides centralized error handling for the application.

**Key Routes:**

##### `Error-ErrorHandling`: Global error handler
- **Returns**: Error page or JSON error response based on request type
- **Models Returned**:
  - `pdict.error` - Error information and message
  - `pdict.message` - User-friendly error message
- **Template**: `error/error.isml`
- **Notes**: Handles both page requests and AJAX requests appropriately

##### `Error-Start`: Application startup error handling
- **Returns**: Startup error page
- **Models Returned**: Application startup error information

### Recommendation Controllers

#### **EinsteinCarousel Controller** (`EinsteinCarousel.js`)
Handles Einstein product recommendations and carousels.

**Key Routes:**

##### `EinsteinCarousel-GetRecommendations`: Get product recommendations
- **Returns**: JSON response with recommended products
- **Models Returned**:
```javascript
{
    "recommendations": [...], // Array of recommended products
    "errorMessage": "...", // Error message if recommendations fail
    "product": {...} // Context product for recommendations
}
```

### Reporting & Analytics Controllers

#### **ReportingEvent Controller** (`ReportingEvent.js`)
Handles analytics event tracking.

**Key Routes:**

##### `ReportingEvent-Track`: Track analytics events
- **Returns**: JSON response confirming event tracking
- **Models Returned**: Event tracking confirmation and status

### URL Management Controllers

#### **RedirectURL Controller** (`RedirectURL.js`)
Manages URL redirects and rewrites.

#### **Link Controller** (`Link.js`)
Handles dynamic link generation and routing.

#### **SourceCodeRedirect Controller** (`SourceCodeRedirect.js`)
Manages source code-based redirects for campaign tracking.

### Component Controllers

#### **Tile Controller** (`Tile.js`)
Handles tile components for product grids and carousels.

#### **Default Controller** (`Default.js`)
Provides fallback functionality and default route handling.

### Model Integration Notes from Actual Implementation

Based on examination of the actual controller code:

1. **Product Controllers**: Use `productHelper.showProductPage()` which returns a comprehensive result object with product, template, URLs, and metadata
2. **Cart Controllers**: Extensively use `CartModel` class and include transaction wrapping for basket modifications
3. **Account Controllers**: Use `accountHelpers.getAccountModel()` and form validation through `server.forms.getForm()`
4. **Template vs Page Designer**: Many controllers check for Page Designer pages first, then fall back to standard ISML templates
5. **Analytics Integration**: Controllers frequently include `reportingURLs` for analytics tracking
6. **Error Handling**: Controllers return appropriate HTTP status codes (404, etc.) and error templates
7. **Middleware Patterns**: Consistent use of HTTPS, CSRF protection, consent tracking, and caching middlewares
8. **Transaction Management**: Cart operations wrapped in `Transaction.wrap()` for data integrity

**Important**: The actual SFRA implementations include more complex logic for basket calculations, Page Designer integration, form validation, and error handling than initially documented. Controllers frequently delegate to helper modules for business logic implementation.

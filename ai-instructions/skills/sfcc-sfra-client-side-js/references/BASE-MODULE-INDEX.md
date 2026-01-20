# Base Cartridge Module Index

Complete index of SFRA base cartridge client-side modules available for extension via `paths` alias.

**Total modules: 56**

## Full File Listing

```
addressBook.js
addressBook/addressBook.js
campaignBanner.js
carousel.js
cart.js
cart/cart.js
checkout.js
checkout/address.js
checkout/billing.js
checkout/checkout.js
checkout/customer.js
checkout/formErrors.js
checkout/shipping.js
checkout/summary.js
checkoutRegistration.js
components/cleave.js
components/clientSideValidation.js
components/collapsibleItem.js
components/consentTracking.js
components/cookie.js
components/countrySelector.js
components/errorNotification.js
components/focus.js
components/footer.js
components/formValidation.js
components/keyboardAccessibility.js
components/menu.js
components/miniCart.js
components/scrollAnimate.js
components/search.js
components/spinner.js
components/toolTip.js
contactUs.js
contactUs/contactUs.js
einsteinCarousel.js
login.js
login/login.js
main.js
mobileGridLookBook.js
orderHistory.js
orderHistory/orderHistory.js
paymentInstruments.js
paymentInstruments/paymentInstruments.js
product/base.js
product/detail.js
product/quickView.js
productDetail.js
productTile.js
profile.js
profile/profile.js
search.js
search/search.js
storeLocator.js
storeLocator/storeLocator.js
thirdParty/bootstrap.js
util.js
```

## By Category

### Core Components (`components/`)
| Module | Purpose |
|--------|---------|
| `cleave.js` | Input formatting (credit cards, phone) |
| `clientSideValidation.js` | Form validation styling |
| `collapsibleItem.js` | Accordion/collapsible UI |
| `consentTracking.js` | Cookie consent |
| `cookie.js` | Cookie utilities |
| `countrySelector.js` | Country dropdown |
| `errorNotification.js` | Error display |
| `focus.js` | Focus management |
| `footer.js` | Footer interactions |
| `formValidation.js` | Form validation logic |
| `keyboardAccessibility.js` | Keyboard navigation |
| `menu.js` | Navigation menu |
| `miniCart.js` | Mini cart interactions |
| `scrollAnimate.js` | Scroll animations |
| `search.js` | Search functionality |
| `spinner.js` | Loading spinner |
| `toolTip.js` | Tooltips |

### Checkout (`checkout/`)
| Module | Purpose |
|--------|---------|
| `address.js` | Address handling |
| `billing.js` | Billing step |
| `checkout.js` | Main checkout orchestrator |
| `customer.js` | Customer info step |
| `formErrors.js` | Checkout form errors |
| `shipping.js` | Shipping step |
| `summary.js` | Order summary |

### Product (`product/`)
| Module | Purpose |
|--------|---------|
| `base.js` | Shared product utilities |
| `detail.js` | PDP interactions |
| `quickView.js` | Quick view modal |

### Account
| Module | Purpose |
|--------|---------|
| `addressBook.js` / `addressBook/addressBook.js` | Address book management |
| `login.js` / `login/login.js` | Login functionality |
| `orderHistory.js` / `orderHistory/orderHistory.js` | Order history |
| `paymentInstruments.js` / `paymentInstruments/paymentInstruments.js` | Saved payments |
| `profile.js` / `profile/profile.js` | Profile management |

### Search & Store
| Module | Purpose |
|--------|---------|
| `search.js` / `search/search.js` | Search results page |
| `storeLocator.js` / `storeLocator/storeLocator.js` | Store finder |

### Cart
| Module | Purpose |
|--------|---------|
| `cart.js` / `cart/cart.js` | Cart page |
| `miniCart.js` | Mini cart dropdown |

### Other
| Module | Purpose |
|--------|---------|
| `campaignBanner.js` | Campaign banners |
| `carousel.js` | Image carousels |
| `checkoutRegistration.js` | Post-checkout registration |
| `contactUs.js` / `contactUs/contactUs.js` | Contact form |
| `einsteinCarousel.js` | Einstein recommendations |
| `main.js` | Main entry point |
| `mobileGridLookBook.js` | Mobile grid layout |
| `productDetail.js` | PDP page orchestrator |
| `productTile.js` | Product tile interactions |
| `util.js` | Shared utilities |
| `thirdParty/bootstrap.js` | Bootstrap integration |

## Extension Examples

### Extending a Component

```javascript
// custom/components/menu.js
'use strict';
var base = require('base/components/menu');

var originalToggle = base.toggle;

base.toggle = function () {
    originalToggle.apply(this, arguments);
    window.dispatchEvent(new CustomEvent('menu:toggled'));
};

module.exports = base;
```

### Extending PDP

```javascript
// custom/product/detail.js
'use strict';
var base = require('base/product/detail');

base.customFeature = function () {
    // New functionality
};

module.exports = base;
```

### Extending Checkout

```javascript
// custom/checkout/shipping.js
'use strict';
var base = require('base/checkout/shipping');

var originalUpdateShippingMethod = base.updateShippingMethod;

base.updateShippingMethod = function () {
    originalUpdateShippingMethod.apply(this, arguments);
    // Custom tracking
};

module.exports = base;
```

## Module Dependency Notes

- `main.js` imports most components as the primary entry point
- Checkout modules often import from each other
- `product/base.js` provides shared utilities for all product modules
- `util.js` contains helpers used across multiple modules

## When NOT to Override

- **Vendored code** (`thirdParty/bootstrap.js`): Wrap or extend via event hooks instead
- **Minor changes**: Decorate after require instead of full file override
- **Large function changes**: Extract to helper module rather than duplicating

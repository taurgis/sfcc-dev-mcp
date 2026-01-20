# Localization Patterns Reference

Complete patterns for B2C Commerce localization.

## Resource Bundle Organization

### Recommended Structure

```
/templates
    /resources
        # Page-specific bundles
        account.properties
        cart.properties
        checkout.properties
        product.properties
        search.properties

        # Feature bundles
        forms.properties
        error.properties
        email.properties

        # Shared bundles
        common.properties
        navigation.properties

        # Locale overrides
        /fr
            account.properties
            cart.properties
            ...
        /de
            account.properties
            cart.properties
            ...
```

### Bundle Content Patterns

**common.properties:**
```properties
##############################################
# Common UI Elements
##############################################
button.submit=Submit
button.cancel=Cancel
button.save=Save
button.delete=Delete
button.edit=Edit
button.close=Close
button.back=Back
button.continue=Continue
button.addtocart=Add to Cart
button.checkout=Checkout

# Labels
label.required=Required
label.optional=Optional
label.loading=Loading...
label.search=Search
label.filter=Filter
label.sort=Sort by
label.showing=Showing {0} of {1}

# Messages
message.success=Success!
message.error=An error occurred
message.saved=Changes saved successfully
message.deleted=Item deleted
message.confirm=Are you sure?

# Currency
currency.symbol=$
currency.code=USD

# Dates
date.format.short=MM/dd/yyyy
date.format.long=MMMM d, yyyy
```

**error.properties:**
```properties
##############################################
# Error Messages
##############################################
error.general=Something went wrong. Please try again.
error.notfound=Page not found
error.unauthorized=Please sign in to continue
error.forbidden=You don''t have permission to access this page
error.server=Server error. Please try again later.

# Validation errors
error.required={0} is required
error.invalid={0} is invalid
error.email.invalid=Please enter a valid email address
error.password.short=Password must be at least {0} characters
error.password.mismatch=Passwords don''t match

# Cart errors
error.cart.empty=Your cart is empty
error.cart.outofstock={0} is out of stock
error.cart.quantity=Maximum quantity is {0}

# Checkout errors
error.checkout.payment=Payment failed. Please try again.
error.checkout.address=Please enter a valid shipping address
```

**navigation.properties:**
```properties
##############################################
# Navigation
##############################################
nav.home=Home
nav.shop=Shop
nav.categories=Categories
nav.account=My Account
nav.cart=Cart
nav.wishlist=Wishlist
nav.help=Help
nav.contact=Contact Us

# Footer
footer.about=About Us
footer.privacy=Privacy Policy
footer.terms=Terms & Conditions
footer.shipping=Shipping Info
footer.returns=Returns & Exchanges
```

## Template Patterns

### Page Layout

```html
<isdecorate template="common/layout/page">
    <isset name="pageTitle" value="${Resource.msg('account.title', 'account', 'My Account')}" scope="pdict"/>

    <div class="page-content">
        <h1>${pdict.pageTitle}</h1>

        <isif condition="${pdict.successMessage}">
            <div class="alert alert-success">
                ${Resource.msg(pdict.successMessage, 'common', pdict.successMessage)}
            </div>
        </isif>

        <isif condition="${pdict.errorMessage}">
            <div class="alert alert-error">
                ${Resource.msg(pdict.errorMessage, 'error', pdict.errorMessage)}
            </div>
        </isif>

        <!-- Page content -->
    </div>
</isdecorate>
```

### Form Labels

```html
<div class="form-group ${pdict.form.email.mandatory ? 'required' : ''}">
    <label for="email">
        ${Resource.msg('form.email.label', 'forms', 'Email')}
        <isif condition="${pdict.form.email.mandatory}">
            <span class="required-indicator">*</span>
        </isif>
    </label>
    <input type="email"
           id="email"
           name="email"
           placeholder="${Resource.msg('form.email.placeholder', 'forms', '')}"
           value="${pdict.form.email.value || ''}"/>
    <isif condition="${pdict.form.email.error}">
        <span class="error-message">${pdict.form.email.error}</span>
    </isif>
</div>
```

### Pluralization

**Property file:**
```properties
cart.item.singular=item
cart.item.plural=items
cart.summary=Your cart contains {0} {1}
```

**Template:**
```html
<isscript>
    var itemWord = itemCount === 1
        ? Resource.msg('cart.item.singular', 'cart', 'item')
        : Resource.msg('cart.item.plural', 'cart', 'items');
</isscript>
<p>${Resource.msgf('cart.summary', 'cart', null, itemCount, itemWord)}</p>
```

### Date Formatting

```html
<isscript>
    var StringUtils = require('dw/util/StringUtils');
    var Calendar = require('dw/util/Calendar');

    var orderDate = new Calendar(pdict.order.creationDate);
    var dateFormat = Resource.msg('date.format.long', 'common', 'MMMM d, yyyy');
    var formattedDate = StringUtils.formatCalendar(orderDate, dateFormat);
</isscript>
<p>${Resource.msgf('order.placed', 'order', null, formattedDate)}</p>
```

### Number Formatting

```html
<isscript>
    var StringUtils = require('dw/util/StringUtils');
    var numberFormat = Resource.msg('number.format', 'common', '#,##0.00');
    var formattedNumber = StringUtils.formatNumber(pdict.quantity, numberFormat);
</isscript>
<span>${formattedNumber}</span>
```

### Conditional Locale Content

```html
<isscript>
    var locale = request.locale;
    var isUSLocale = locale && locale.startsWith('en_US');
</isscript>

<isif condition="${isUSLocale}">
    <!-- US-specific content -->
    <p>${Resource.msg('shipping.domestic', 'checkout', null)}</p>
<iselse>
    <!-- International content -->
    <p>${Resource.msg('shipping.international', 'checkout', null)}</p>
</isif>
```

## Controller Patterns

### Locale-Aware Controller

```javascript
'use strict';

var server = require('server');
var Resource = require('dw/web/Resource');
var Locale = require('dw/util/Locale');

server.get('Show', function (req, res, next) {
    var currentLocale = Locale.getLocale(req.locale.id);
    var isUSLocale = currentLocale.country === 'US';

    // Get locale-specific content
    var contentAssetId = 'terms-' + req.locale.id.toLowerCase().replace('_', '-');

    // Locale-specific business logic
    var phoneFormat = isUSLocale ? '(XXX) XXX-XXXX' : '+XX XXX XXX XXXX';

    res.render('page', {
        locale: req.locale.id,
        language: currentLocale.displayLanguage,
        phoneFormat: phoneFormat,
        contentAssetId: contentAssetId
    });
    next();
});

// Error messages in controllers
server.post('Submit', function (req, res, next) {
    var form = server.forms.getForm('profile');

    if (!form.valid) {
        res.json({
            success: false,
            message: Resource.msg('error.form.invalid', 'error', 'Please correct the errors')
        });
        return next();
    }

    try {
        // Process form
        res.json({
            success: true,
            message: Resource.msg('message.saved', 'common', 'Saved successfully')
        });
    } catch (e) {
        res.json({
            success: false,
            message: Resource.msg('error.general', 'error', 'An error occurred')
        });
    }
    next();
});

module.exports = server.exports();
```

### Multi-Locale Email

```javascript
var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var Mail = require('dw/net/Mail');
var Resource = require('dw/web/Resource');

function sendWelcomeEmail(customer, locale) {
    var model = new HashMap();
    model.put('customer', customer);
    model.put('storeName', Resource.msg('store.name', 'common', 'Our Store'));

    // Render template with specific locale
    var template = new Template('mail/welcome', locale);
    var htmlContent = template.render(model).text;

    // Get localized subject
    var subject = getLocalizedString('email.welcome.subject', 'email', locale);

    var mail = new Mail();
    mail.addTo(customer.profile.email);
    mail.setFrom('welcome@example.com');
    mail.setSubject(subject);
    mail.setContent(htmlContent, 'text/html', 'UTF-8');
    mail.send();
}

// Helper for getting strings in specific locale
function getLocalizedString(key, bundle, locale) {
    var ResourceBundle = require('dw/web/ResourceBundle');
    var rb = ResourceBundle.getBundle(bundle, locale);
    return rb.getString(key);
}
```

### Locale Detection and Redirect

```javascript
server.get('DetectLocale', function (req, res, next) {
    var Locale = require('dw/util/Locale');
    var Site = require('dw/system/Site');
    var URLUtils = require('dw/web/URLUtils');

    // Get browser's preferred language
    var acceptLanguage = req.httpHeaders.get('accept-language');
    var preferredLocale = parseAcceptLanguage(acceptLanguage);

    // Check if locale is supported
    var allowedLocales = Site.current.allowedLocales;
    var targetLocale = allowedLocales.contains(preferredLocale)
        ? preferredLocale
        : Site.current.defaultLocale;

    // Redirect to localized homepage
    var redirectUrl = URLUtils.url('Home-Show');
    res.redirect(redirectUrl);
    next();
});

function parseAcceptLanguage(header) {
    if (!header) return null;
    // Parse Accept-Language header (e.g., "en-US,en;q=0.9,fr;q=0.8")
    var parts = header.split(',');
    if (parts.length > 0) {
        var primary = parts[0].split(';')[0].trim();
        return primary.replace('-', '_');
    }
    return null;
}
```

## JavaScript Client-Side Patterns

### Passing Messages to JS

```html
<script>
window.resources = {
    cart: {
        addSuccess: '${Resource.msg('cart.add.success', 'cart', 'Added to cart')}',
        addError: '${Resource.msg('cart.add.error', 'cart', 'Error adding to cart')}',
        removeConfirm: '${Resource.msg('cart.remove.confirm', 'cart', 'Remove this item?')}',
        updating: '${Resource.msg('cart.updating', 'cart', 'Updating cart...')}'
    },
    common: {
        loading: '${Resource.msg('label.loading', 'common', 'Loading...')}',
        error: '${Resource.msg('error.general', 'error', 'An error occurred')}',
        confirm: '${Resource.msg('message.confirm', 'common', 'Are you sure?')}'
    },
    validation: {
        required: '${Resource.msg('error.required', 'error', 'This field is required')}',
        email: '${Resource.msg('error.email.invalid', 'error', 'Please enter a valid email')}'
    }
};

// Locale info for JS date/number formatting
window.localeInfo = {
    locale: '${request.locale}',
    currency: '${session.currency.currencyCode}',
    dateFormat: '${Resource.msg('date.format.short', 'common', 'MM/dd/yyyy')}'
};
</script>
```

### Using in JavaScript

```javascript
// Cart functionality with localized messages
function addToCart(productId) {
    showLoading(window.resources.common.loading);

    $.ajax({
        url: '/Cart-AddProduct',
        data: { pid: productId },
        success: function(response) {
            if (response.success) {
                showMessage(window.resources.cart.addSuccess, 'success');
                updateCartCount(response.cartCount);
            } else {
                showMessage(response.message || window.resources.cart.addError, 'error');
            }
        },
        error: function() {
            showMessage(window.resources.common.error, 'error');
        },
        complete: function() {
            hideLoading();
        }
    });
}

// Confirmation dialogs
function removeFromCart(itemId) {
    if (confirm(window.resources.cart.removeConfirm)) {
        // Proceed with removal
    }
}

// Form validation messages
function validateForm(form) {
    var email = form.querySelector('[name="email"]');
    if (!email.value) {
        showFieldError(email, window.resources.validation.required);
        return false;
    }
    if (!isValidEmail(email.value)) {
        showFieldError(email, window.resources.validation.email);
        return false;
    }
    return true;
}
```

### Locale-Aware Date Formatting in JS

```javascript
// Format date according to locale
function formatDate(dateString) {
    var date = new Date(dateString);
    var format = window.localeInfo.dateFormat;

    // Simple format replacement
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();

    return format
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', year);
}

// Format currency according to locale
function formatCurrency(amount) {
    return new Intl.NumberFormat(window.localeInfo.locale, {
        style: 'currency',
        currency: window.localeInfo.currency
    }).format(amount);
}
```

## Special Characters

### Escaping in Properties

```properties
# Apostrophe - use two single quotes
message.welcome=It''s a great day!
error.cant=You can''t do that
dont.forget=Don''t forget to save!

# Newlines
message.multiline=Line one\nLine two\nLine three

# Unicode characters (save file as UTF-8)
store.name=Café du Nord
currency.symbol.euro=€
currency.symbol.pound=£
currency.symbol.yen=¥

# HTML entities (if needed in properties)
message.copyright=Copyright \u00A9 2024
```

### UTF-8 Encoding Examples

```properties
# German
button.close=Schließen
greeting=Grüß Gott!
umlauts=äöüÄÖÜß

# French
account.title=Mon Compte
message.success=Réussi!
special=éèêëàâùûîïôç

# Spanish
greeting=¡Hola!
question=¿Cómo estás?
special=ñáéíóú

# Portuguese
greeting=Olá!
special=ãõçáéíóú

# Japanese
store.name=店舗名
greeting=こんにちは

# Chinese
store.name=商店名称
greeting=你好

# Russian
greeting=Привет!
store.name=Название магазина
```

## Form Localization Patterns

### Complete Form Definition

```xml
<?xml version="1.0" encoding="UTF-8"?>
<form xmlns="http://www.demandware.com/xml/form/2008-04-19">
    <field formid="firstName" label="form.firstName.label" type="string"
           mandatory="true" max-length="50"
           missing-error="form.firstName.required"/>

    <field formid="lastName" label="form.lastName.label" type="string"
           mandatory="true" max-length="50"
           missing-error="form.lastName.required"/>

    <field formid="email" label="form.email.label" type="string"
           mandatory="true"
           regexp="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
           missing-error="form.email.required"
           parse-error="form.email.invalid"/>

    <field formid="phone" label="form.phone.label" type="string"
           mandatory="false"
           parse-error="form.phone.invalid"/>

    <action formid="submit" label="form.submit.label" valid-form="true"/>
</form>
```

### Form Resource Bundle

**forms.properties:**
```properties
##############################################
# Form Labels
##############################################
form.firstName.label=First Name
form.firstName.required=First name is required
form.firstName.placeholder=Enter your first name

form.lastName.label=Last Name
form.lastName.required=Last name is required
form.lastName.placeholder=Enter your last name

form.email.label=Email Address
form.email.required=Email address is required
form.email.invalid=Please enter a valid email address
form.email.placeholder=example@domain.com

form.phone.label=Phone Number
form.phone.invalid=Please enter a valid phone number
form.phone.placeholder=(555) 123-4567

form.submit.label=Submit

##############################################
# Form Messages
##############################################
form.success=Your information has been saved
form.error=Please correct the errors below
```

**forms_de.properties:**
```properties
form.firstName.label=Vorname
form.firstName.required=Vorname ist erforderlich
form.firstName.placeholder=Geben Sie Ihren Vornamen ein

form.lastName.label=Nachname
form.lastName.required=Nachname ist erforderlich
form.lastName.placeholder=Geben Sie Ihren Nachnamen ein

form.email.label=E-Mail-Adresse
form.email.required=E-Mail-Adresse ist erforderlich
form.email.invalid=Bitte geben Sie eine gültige E-Mail-Adresse ein
form.email.placeholder=beispiel@domain.de

form.phone.label=Telefonnummer
form.phone.invalid=Bitte geben Sie eine gültige Telefonnummer ein
form.phone.placeholder=+49 123 456789

form.submit.label=Absenden

form.success=Ihre Informationen wurden gespeichert
form.error=Bitte korrigieren Sie die Fehler unten
```

## Testing Localization

### Pseudo-Localization

Add a test locale with wrapped strings to find hardcoded text:

```properties
# pseudo.properties - Use [brackets] to identify localized strings
button.submit=[Submit]
button.cancel=[Cancel]
account.title=[My Account]
nav.home=[Home]
error.general=[Something went wrong]
```

### Testing Checklist

1. **Text Content**
   - [ ] All visible text comes from resource bundles
   - [ ] No hardcoded strings in templates
   - [ ] No hardcoded strings in JavaScript
   - [ ] Error messages are localized

2. **Formatting**
   - [ ] Date formats use locale settings
   - [ ] Time formats use locale settings
   - [ ] Currency displays correctly (symbol, position, decimals)
   - [ ] Number formatting (decimal separators, thousands)

3. **Content**
   - [ ] Images with text have locale versions
   - [ ] Email templates render in correct language
   - [ ] PDF documents are localized
   - [ ] Content assets have locale variants

4. **Fallback**
   - [ ] Missing translations fall back gracefully
   - [ ] Default locale works when specific locale missing
   - [ ] No broken keys displayed to users

5. **URLs**
   - [ ] Locale switching preserves page context
   - [ ] SEO URLs work for all locales
   - [ ] Canonical URLs are correct

### Automated Testing

```javascript
// Unit test for resource bundle coverage
describe('Localization', function() {
    it('should have French translations for all keys', function() {
        var defaultBundle = loadBundle('account.properties');
        var frenchBundle = loadBundle('fr/account.properties');

        Object.keys(defaultBundle).forEach(function(key) {
            expect(frenchBundle[key]).toBeDefined(
                'Missing French translation for: ' + key
            );
        });
    });

    it('should not have hardcoded text in templates', function() {
        var templates = findAllTemplates();
        templates.forEach(function(template) {
            var content = readFile(template);
            // Check for common hardcoded patterns
            expect(content).not.toMatch(/>Add to Cart</);
            expect(content).not.toMatch(/>Submit</);
            expect(content).not.toMatch(/>Loading\.\.\.</);
        });
    });
});
```

## Performance Considerations

### Resource Bundle Caching

Resource bundles are cached by B2C Commerce. Best practices:

1. **Keep bundles small** - Split by page/feature
2. **Avoid dynamic keys** - Use static key names
3. **Minimize lookups** - Cache repeated values in ISML variables

```html
<!-- Cache repeated lookups -->
<isscript>
    var btnAddToCart = Resource.msg('button.addtocart', 'common', 'Add to Cart');
    var btnCheckout = Resource.msg('button.checkout', 'common', 'Checkout');
</isscript>

<isloop items="${products}" var="product">
    <button>${btnAddToCart}</button>
</isloop>
```

### Lazy Loading Translations

For large JavaScript applications:

```javascript
// Load translations on demand
async function loadTranslations(locale, namespace) {
    const response = await fetch(`/Resources-Get?locale=${locale}&ns=${namespace}`);
    const translations = await response.json();
    window.resources[namespace] = translations;
}

// Usage
await loadTranslations('fr', 'checkout');
showMessage(window.resources.checkout.success);
```

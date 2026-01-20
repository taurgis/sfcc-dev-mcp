````skill
---
name: sfcc-localization
description: Guide for localizing templates, forms, and content in Salesforce B2C Commerce. Use this when asked to implement multi-language support, resource bundles, locale-specific content, or internationalization features.
---

# Localization Skill

This skill guides you through localizing B2C Commerce storefronts for multiple languages and regions.

## Quick Checklist

```text
[ ] All visible text comes from resource bundles (no hardcoded strings)
[ ] Resource bundles organized by page/feature, not by language
[ ] Property files saved as UTF-8 encoding
[ ] Parameters used for dynamic values (no string concatenation)
[ ] Locale fallback chain tested and working
[ ] Date/currency/number formatting uses locale settings
[ ] Form labels and error messages localized via resource keys
[ ] JavaScript strings passed from server via window.resources pattern
```

## Overview

B2C Commerce supports localization through:

| Component | Approach |
|-----------|----------|
| **Templates** | Single template set + resource bundles |
| **Forms** | Shared definitions + locale-specific labels |
| **Static content** | Locale-specific folders |
| **Product data** | Localizable attributes |

## Locale Format

Locales follow ISO standards: `{language}_{country}`

| Format | Example | Description |
|--------|---------|-------------|
| `en` | English | Language only |
| `en_US` | English/USA | Language + country |
| `fr_CA` | French/Canada | Language + country |
| `de_DE` | German/Germany | Language + country |

## Resource Bundles

### Directory Structure

```
/cartridge
    /templates
        /resources
            account.properties          # Default (English)
            checkout.properties
            /fr
                account.properties      # French
                checkout.properties
            /de
                account.properties      # German
                checkout.properties
            /fr_CA
                account.properties      # French Canadian
```

### Property File Format

**account.properties (default):**
```properties
##############################################
# Account Pages
##############################################
account.title=My Account
account.greeting=Welcome back
account.logout=Sign Out

# Account Dashboard
dashboard.title=Dashboard
dashboard.orders=Order History
dashboard.addresses=Address Book
dashboard.wishlist=Wishlist

# Profile
profile.title=Profile
profile.firstName=First Name
profile.lastName=Last Name
profile.email=Email Address
profile.save=Save Changes
```

**account_fr.properties (French):**
```properties
account.title=Mon compte
account.greeting=Bon retour
account.logout=Se déconnecter

dashboard.title=Tableau de bord
dashboard.orders=Historique des commandes
dashboard.addresses=Carnet d'adresses
dashboard.wishlist=Liste de souhaits

profile.title=Profil
profile.firstName=Prénom
profile.lastName=Nom
profile.email=Adresse e-mail
profile.save=Enregistrer les modifications
```

### Using Resources in Templates

```html
<!-- Simple message -->
<h1>${Resource.msg('account.title', 'account', null)}</h1>

<!-- With fallback -->
<p>${Resource.msg('account.greeting', 'account', 'Welcome')}</p>

<!-- With parameters -->
<p>${Resource.msgf('cart.items', 'cart', null, cartCount)}</p>
```

**Resource.msg() parameters:**
1. Key name
2. Bundle name (filename without extension)
3. Default value (null = use key if not found)

### Parameterized Messages

**Property:**
```properties
cart.itemCount=You have {0} items in your cart
greeting.personalized=Hello, {0} {1}!
order.confirmation=Order #{0} placed on {1}
```

**Template:**
```html
${Resource.msgf('cart.itemCount', 'cart', null, itemCount)}
${Resource.msgf('greeting.personalized', 'common', null, firstName, lastName)}
```

## Locale Fallback

B2C Commerce uses a fallback chain: `fr_CA` → `fr` → `default`

**Example:** Requesting `fr_CA`:
1. Look in `/resources/fr_CA/account.properties`
2. If not found, look in `/resources/fr/account.properties`
3. If not found, look in `/resources/account.properties`

## Static Files

### Directory Structure

```
/cartridge
    /static
        /default
            /css
                style.css
            /images
                logo.png
                buttons/
                    submit.png
            /js
                main.js
        /fr
            /images
                buttons/
                    submit.png      # French text on button
        /de
            /images
                buttons/
                    submit.png      # German text on button
```

### Referencing Static Files

```html
<!-- Uses locale-specific version if available -->
<img src="${URLUtils.staticURL('/images/buttons/submit.png')}" alt="Submit"/>

<!-- CSS (usually not localized) -->
<link rel="stylesheet" href="${URLUtils.staticURL('/css/style.css')}"/>
```

## Forms Localization

### Form Definition

```xml
<?xml version="1.0" encoding="UTF-8"?>
<form xmlns="http://www.demandware.com/xml/form/2008-04-19">
    <field formid="email" label="form.email.label" type="string"
           mandatory="true"
           missing-error="form.email.required"
           parse-error="form.email.invalid"/>
</form>
```

### Resource Bundle

**forms.properties:**
```properties
form.email.label=Email Address
form.email.required=Email is required
form.email.invalid=Please enter a valid email address
```

**forms_fr.properties:**
```properties
form.email.label=Adresse e-mail
form.email.required=L'email est requis
form.email.invalid=Veuillez entrer une adresse e-mail valide
```

## URL Localization

### Locale-Aware URLs

```html
<!-- Current locale URL -->
<a href="${URLUtils.url('Product-Show', 'pid', 'ABC123')}">View Product</a>

<!-- Specific locale URL -->
<a href="${URLUtils.url(new URLAction('Product-Show', 'MySite', 'fr'))}">
    Voir le produit
</a>
```

### Language Switcher

```html
<isscript>
    var Site = require('dw/system/Site');
    var URLAction = require('dw/web/URLAction');
    var URLUtils = require('dw/web/URLUtils');
    var Locale = require('dw/util/Locale');
</isscript>

<ul class="language-switcher">
    <isloop items="${Site.current.allowedLocales}" var="localeId">
        <isscript>
            var locale = new Locale(localeId);
            var url = URLUtils.url(new URLAction('Home-Show', Site.current.ID, localeId));
        </isscript>
        <li class="${request.locale == localeId ? 'active' : ''}">
            <a href="${url}">${locale.displayLanguage}</a>
        </li>
    </isloop>
</ul>
```

## Controller Localization

### Accessing Current Locale

```javascript
'use strict';

var server = require('server');
var Locale = require('dw/util/Locale');

server.get('Show', function (req, res, next) {
    var currentLocale = Locale.getLocale(req.locale.id);

    res.render('mytemplate', {
        locale: req.locale.id,
        language: currentLocale.language,
        country: currentLocale.country,
        displayLanguage: currentLocale.displayLanguage,
        displayCountry: currentLocale.displayCountry
    });
    next();
});

module.exports = server.exports();
```

### Locale-Specific Logic

```javascript
server.get('Checkout', function (req, res, next) {
    var locale = req.locale.id;

    // Locale-specific date format
    var dateFormat = locale.startsWith('en_US') ? 'MM/dd/yyyy' : 'dd/MM/yyyy';

    // Locale-specific content
    var termsContentId = 'terms-' + locale.replace('_', '-').toLowerCase();

    res.render('checkout', {
        dateFormat: dateFormat,
        termsContentId: termsContentId
    });
    next();
});
```

### Localized Error Messages in Controllers

```javascript
var Resource = require('dw/web/Resource');

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
```

## Email Templates

### Setting Locale

```javascript
var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var Mail = require('dw/net/Mail');
var Resource = require('dw/web/Resource');

function sendOrderConfirmation(order, locale) {
    var template = new Template('mail/orderconfirmation', locale);
    var model = new HashMap();
    model.put('order', order);

    var content = template.render(model).text;

    var mail = new Mail();
    mail.addTo(order.customerEmail);
    mail.setFrom('orders@example.com');
    mail.setSubject(Resource.msg('email.order.subject', 'email', null));
    mail.setContent(content, 'text/html', 'UTF-8');
    mail.send();
}
```

## Currency Formatting

Currency is tied to locale:

```javascript
var Money = require('dw/value/Money');
var StringUtils = require('dw/util/StringUtils');

// Format with locale
var price = new Money(99.99, 'USD');
var formatted = StringUtils.formatMoney(price);  // Uses current locale
```

**In template:**
```html
<isprint value="${product.priceModel.price}" style="CURRENCY"/>
```

## Date Formatting

```javascript
var StringUtils = require('dw/util/StringUtils');
var Calendar = require('dw/util/Calendar');

var date = new Calendar();
var formatted = StringUtils.formatCalendar(date, 'yyyy-MM-dd');  // ISO format
var localized = StringUtils.formatCalendar(date, 'MMMM d, yyyy');  // Locale-aware
```

## JavaScript Client-Side Localization

### Passing Messages to JavaScript

```html
<script>
window.resources = {
    cart: {
        addSuccess: '${Resource.msg('cart.add.success', 'cart', 'Added to cart')}',
        addError: '${Resource.msg('cart.add.error', 'cart', 'Error adding to cart')}',
        removeConfirm: '${Resource.msg('cart.remove.confirm', 'cart', 'Remove this item?')}'
    },
    common: {
        loading: '${Resource.msg('label.loading', 'common', 'Loading...')}',
        error: '${Resource.msg('error.general', 'error', 'An error occurred')}'
    }
};
</script>
```

### Using in JavaScript

```javascript
function addToCart(productId) {
    showLoading(window.resources.common.loading);

    $.ajax({
        url: '/Cart-AddProduct',
        data: { pid: productId },
        success: function(response) {
            if (response.success) {
                showMessage(window.resources.cart.addSuccess, 'success');
            } else {
                showMessage(response.message || window.resources.cart.addError, 'error');
            }
        },
        error: function() {
            showMessage(window.resources.common.error, 'error');
        }
    });
}
```

## Special Characters

### Escaping in Properties

```properties
# Apostrophe - use two single quotes
message.welcome=It''s a great day!
error.cant=You can''t do that

# Newlines
message.multiline=Line one\nLine two\nLine three

# Unicode
store.name=Café du Nord
currency.symbol.euro=€
```

### UTF-8 Encoding

Always save property files as UTF-8 for proper character support:

```properties
# German
button.close=Schließen
greeting=Grüß Gott!

# French
account.title=Mon Compte
message.success=Réussi!

# Japanese
store.name=店舗名
```

## Best Practices

1. **Use UTF-8** for all property files (required for non-ASCII characters)
2. **Organize bundles by page/feature** not by language
3. **Keep keys descriptive** - `account.profile.firstName` not `label1`
4. **Use parameters** for dynamic values - don't concatenate strings
5. **Test all locales** - ensure fallback works correctly
6. **Don't hardcode text** in templates or scripts
7. **Prefix custom keys** consistently (e.g., `acme.custom.label`)
8. **Document translations** - include context comments for translators

## Common Mistakes to Avoid

❌ **Wrong: Hardcoded text**
```html
<h1>My Account</h1>
```

✅ **Correct: Resource bundle**
```html
<h1>${Resource.msg('account.title', 'account', null)}</h1>
```

❌ **Wrong: String concatenation**
```javascript
var message = 'Hello, ' + firstName + '!';
```

✅ **Correct: Parameters**
```javascript
var message = Resource.msgf('greeting.hello', 'common', null, firstName);
```

❌ **Wrong: Assuming date format**
```javascript
var dateStr = month + '/' + day + '/' + year;
```

✅ **Correct: Locale-aware formatting**
```javascript
var dateStr = StringUtils.formatCalendar(date, dateFormat);
```

## Testing Localization

### Pseudo-Localization

Add a test locale with wrapped strings to find hardcoded text:

```properties
# pseudo.properties
button.submit=[Submit]
button.cancel=[Cancel]
account.title=[My Account]
```

### Checklist

1. All visible text comes from resource bundles
2. Date/time formats use locale settings
3. Currency displays correctly
4. Number formatting (decimal separators)
5. Images with text have locale versions
6. Email templates render in correct language
7. Error messages are localized
8. JavaScript strings are localized

## MCP Documentation Tools

```javascript
// Search SFCC classes for locale handling
search_sfcc_classes("Locale")

// Get Locale class documentation
get_sfcc_class_info("dw.util.Locale")

// Get Resource bundle documentation  
get_sfcc_class_info("dw.web.Resource")

// Get StringUtils for formatting
get_sfcc_class_info("dw.util.StringUtils")
```

## Detailed Reference

- [Localization Patterns](references/PATTERNS.md) - Complete patterns and examples for resource bundles, templates, controllers, and JavaScript

````

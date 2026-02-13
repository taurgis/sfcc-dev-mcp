# ISML isselect Element

## Overview

The `<isselect>` element generates HTML drop-down list boxes (select elements) in forms. It provides a convenient way to create select lists from iterators or collections, automatically handling the generation of `<select>` and `<option>` HTML tags with proper encoding and preselection support.

**Key Features:** Automatic HTML select/option generation, iterator-based list population, conditional preselection, automatic encoding, separation of display text from submitted values.

**Note:** `<isselect>` replaces the HTML `<select>` tag and its supporting `<option>` tags, providing ISML-specific enhancements.

## Syntax

```isml
<isselect
  name        = simple_name        // required
  iterator    = loop_var           // required
  description = box_text           // required
  value       = text_value         // required
  condition   = "true" | "false"   // optional
  encoding    = "on" | "off"       // optional (default: "on")
/>
```

## Required Attributes

### name

**Type:** String or Expression  
**Required:** Yes

Specifies the name for the list box. This name is used when the browser sends the user's selection as a key-value pair to the server.

**Important:** The specified name must match the input parameter required by the controller or pipeline that processes the form values.

**Examples:**
```isml
<!-- Fixed name -->
<isselect name="country" ... />

<!-- Expression-based name -->
<isselect name="${pdict.fieldName}" ... />

<!-- Common names -->
<isselect name="paymentMethod" ... />
<isselect name="shippingMethod" ... />
<isselect name="stateCode" ... />
```

### iterator

**Type:** Expression (Iterator or Collection)  
**Required:** Yes

Specifies the iterator or collection whose elements will be added to the list box. Each element in the iterator becomes an option in the select list.

**Data Types:**
- Iterator
- Array
- Collection
- List

**Examples:**
```isml
<!-- Iterator -->
<isselect iterator="${pdict.countries}" ... />

<!-- Array -->
<isselect iterator="${pdict.stateList}" ... />

<!-- Collection from API -->
<isselect iterator="${pdict.shippingMethods}" ... />
```

### description

**Type:** Expression  
**Required:** Yes

Specifies the text that is displayed in the drop-down list box for each option. This is the user-visible text.

**Examples:**
```isml
<!-- Display country name -->
<isselect description="${iterator.displayValue}" ... />

<!-- Display formatted text -->
<isselect description="${iterator.name + ' (' + iterator.code + ')'}" ... />

<!-- Display localized text -->
<isselect description="${Resource.msg(iterator.id, 'forms', null)}" ... />
```

### value

**Type:** Expression  
**Required:** Yes

Specifies the value sent back by the browser to the server as the value of the key-value pair when the form is submitted. This allows you to use internal identifiers (like IDs or codes) while displaying user-friendly text.

**Purpose:** Separate internal value from display text (e.g., return product ID instead of product name).

**Storage:** The string specified by `value` is stored in the pipeline dictionary with the key determined by the `name` attribute.

**Examples:**
```isml
<!-- Return country code instead of country name -->
<isselect 
  value="${iterator.countryCode}"
  description="${iterator.displayValue}"
  ... />

<!-- Return payment method ID -->
<isselect 
  value="${iterator.ID}"
  description="${iterator.name}"
  ... />

<!-- Return UUID -->
<isselect 
  value="${iterator.UUID}"
  description="${iterator.description}"
  ... />
```

## Optional Attributes

### condition

**Type:** Expression (Boolean)  
**Allowed Data Type:** Expression only (string literals not allowed)  
**Optional:** Yes

Determines which list element is preselected when the form loads. If the condition evaluates to `true` for an element, that element is marked as selected.

**Important:** Ensure only **one** list element matches the condition to avoid undefined browser behavior.

**HTML Equivalent:** This corresponds to the `selected` attribute of the HTML `<option>` tag.

**Examples:**
```isml
<!-- Preselect current country -->
<isselect 
  condition="${iterator.countryCode == pdict.currentCountry}"
  ... />

<!-- Preselect default payment method -->
<isselect 
  condition="${iterator.ID == pdict.defaultPaymentMethod}"
  ... />

<!-- Preselect based on session data -->
<isselect 
  condition="${iterator.value == session.custom.selectedValue}"
  ... />
```

### encoding

**Type:** String or Expression  
**Allowed Values:** `"on"`, `"off"`  
**Default:** `"on"`  
**Optional:** Yes

Controls automatic HTML encoding of the output. When enabled, special characters are converted to their HTML entity equivalents.

**Encoding Behavior:**
- `"on"` (default): Converts special characters (`<`, `>`, `&`, `"`) and HTML 3.2 named characters (Unicode 160-255) to HTML entities
- `"off"`: Disables automatic encoding (use with caution)

**Example Conversions:**
- `>` → `&gt;`
- `<` → `&lt;`
- `&` → `&amp;`
- `"` → `&quot;`

**Examples:**
```isml
<!-- Default: Encoding enabled -->
<isselect encoding="on" ... />

<!-- Disable encoding (if content is already encoded) -->
<isselect encoding="off" ... />
```

## Purpose

The `<isselect>` element serves to:

1. **Simplify Form Creation:** Replace verbose HTML `<select>` and `<option>` tags with a single ISML tag
2. **Iterator Integration:** Automatically generate options from collections and iterators
3. **Automatic Encoding:** Protect against XSS attacks with automatic HTML encoding
4. **Value Separation:** Display user-friendly text while submitting internal values
5. **Preselection:** Easily preselect options based on conditions
6. **Form Processing:** Ensure proper integration with B2C Commerce form processing

## How It Works

### ISML to HTML Conversion

```isml
<!-- ISML Code -->
<isselect 
  name="country"
  iterator="${pdict.countries}"
  description="${iterator.displayValue}"
  value="${iterator.countryCode}"
  condition="${iterator.countryCode == 'US'}"
/>

<!-- Generated HTML -->
<select name="country">
  <option value="US" selected>United States</option>
  <option value="CA">Canada</option>
  <option value="MX">Mexico</option>
  <option value="UK">United Kingdom</option>
</select>
```

### Form Submission

When the user selects an option and submits the form:

1. **Browser sends:** `country=CA` (if user selects Canada)
2. **Server receives:** Key-value pair in request parameters
3. **Access in controller:** `request.httpParameterMap.country.stringValue` → `"CA"`
4. **Access in template:** `pdict.CurrentForms.form.country.value` → `"CA"`

## Common Use Cases

### Country Selection

```isml
<form action="${URLUtils.url('Address-Save')}" method="post">
  <label for="country">Country:</label>
  <isselect 
    name="country"
    iterator="${pdict.countries}"
    description="${iterator.displayValue}"
    value="${iterator.countryCode}"
    condition="${iterator.countryCode == pdict.currentAddress.countryCode}"
  />
  
  <button type="submit">Save Address</button>
</form>
```

### State/Province Selection

```isml
<form action="${URLUtils.url('Address-Save')}" method="post">
  <label for="state">State:</label>
  <isselect 
    name="state"
    iterator="${pdict.states}"
    description="${iterator.displayValue}"
    value="${iterator.code}"
    condition="${iterator.code == pdict.currentAddress.stateCode}"
  />
</form>
```

### Payment Method Selection

```isml
<form action="${URLUtils.url('Checkout-SubmitPayment')}" method="post">
  <label for="paymentMethod">Payment Method:</label>
  <isselect 
    name="paymentMethod"
    iterator="${pdict.applicablePaymentMethods}"
    description="${iterator.name}"
    value="${iterator.ID}"
    condition="${iterator.ID == pdict.selectedPaymentMethodID}"
  />
  
  <button type="submit">Continue to Review</button>
</form>
```

### Shipping Method Selection

```isml
<form action="${URLUtils.url('Checkout-SelectShippingMethod')}" method="post">
  <label for="shippingMethod">Shipping Method:</label>
  <isselect 
    name="shippingMethodID"
    iterator="${pdict.applicableShippingMethods}"
    description="${iterator.displayName + ' - ' + iterator.shippingCost.formatted}"
    value="${iterator.ID}"
    condition="${iterator.ID == pdict.basket.defaultShipment.shippingMethodID}"
  />
  
  <button type="submit">Select Shipping</button>
</form>
```

### Product Variant Selection (Size)

```isml
<form action="${URLUtils.url('Product-Variation')}" method="post">
  <label for="size">Size:</label>
  <isselect 
    name="dwvar_${pdict.product.ID}_size"
    iterator="${pdict.product.variationModel.getProductVariationAttribute('size').values}"
    description="${iterator.displayValue}"
    value="${iterator.value}"
    condition="${iterator.value == pdict.product.variationModel.getSelectedValue('size').value}"
  />
</form>
```

### Sort Order Selection

```isml
<form action="${URLUtils.url('Search-Show')}" method="get">
  <label for="sort">Sort By:</label>
  <isselect 
    name="srule"
    iterator="${pdict.sortingRules}"
    description="${iterator.displayName}"
    value="${iterator.ID}"
    condition="${iterator.ID == pdict.currentSortingRule}"
  />
  
  <button type="submit">Apply</button>
</form>
```

### Quantity Selection

```isml
<form action="${URLUtils.url('Cart-UpdateQuantity')}" method="post">
  <label for="quantity">Quantity:</label>
  <isselect 
    name="quantity"
    iterator="${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}"
    description="${iterator}"
    value="${iterator}"
    condition="${iterator == pdict.lineItem.quantity}"
  />
  
  <button type="submit">Update</button>
</form>
```

### Year Selection (Credit Card Expiry)

```isml
<isscript>
    var currentYear = new Date().getFullYear();
    var years = [];
    for (var i = 0; i < 10; i++) {
        years.push(currentYear + i);
    }
</isscript>

<form action="${URLUtils.url('PaymentInstruments-SaveCard')}" method="post">
  <label for="expiryYear">Expiry Year:</label>
  <isselect 
    name="expirationYear"
    iterator="${years}"
    description="${iterator}"
    value="${iterator}"
    condition="${iterator == pdict.currentCard.expirationYear}"
  />
</form>
```

### Month Selection

```isml
<isscript>
    var months = [
        {value: '01', name: 'January'},
        {value: '02', name: 'February'},
        {value: '03', name: 'March'},
        {value: '04', name: 'April'},
        {value: '05', name: 'May'},
        {value: '06', name: 'June'},
        {value: '07', name: 'July'},
        {value: '08', name: 'August'},
        {value: '09', name: 'September'},
        {value: '10', name: 'October'},
        {value: '11', name: 'November'},
        {value: '12', name: 'December'}
    ];
</isscript>

<label for="expiryMonth">Expiry Month:</label>
<isselect 
  name="expirationMonth"
  iterator="${months}"
  description="${iterator.name}"
  value="${iterator.value}"
  condition="${iterator.value == pdict.currentCard.expirationMonth}"
/>
```

### Locale/Language Selection

```isml
<form action="${URLUtils.url('Page-SetLocale')}" method="post">
  <label for="locale">Language:</label>
  <isselect 
    name="locale"
    iterator="${pdict.availableLocales}"
    description="${iterator.displayName}"
    value="${iterator.ID}"
    condition="${iterator.ID == request.locale}"
  />
  
  <button type="submit">Change Language</button>
</form>
```

### Currency Selection

```isml
<form action="${URLUtils.url('Page-SetCurrency')}" method="post">
  <label for="currency">Currency:</label>
  <isselect 
    name="currencyCode"
    iterator="${pdict.currencies}"
    description="${iterator.currencyCode + ' - ' + iterator.name}"
    value="${iterator.currencyCode}"
    condition="${iterator.currencyCode == session.currency.currencyCode}"
  />
  
  <button type="submit">Change Currency</button>
</form>
```

### Advanced: Formatted Description

```isml
<form action="${URLUtils.url('Product-Show')}" method="get">
  <label for="product">Select Product:</label>
  <isselect 
    name="pid"
    iterator="${pdict.products}"
    description="${iterator.name + ' - ' + iterator.price.sales.formatted + (iterator.available ? ' (In Stock)' : ' (Out of Stock)')}"
    value="${iterator.ID}"
    condition="${iterator.ID == pdict.currentProductID}"
  />
</form>
```

## Best Practices

### 1. Match Name to Form Field

Ensure the `name` attribute matches the expected form field in your controller:

```javascript
// Controller expects 'shippingMethodID'
server.post('SelectShipping', function (req, res, next) {
    var shippingMethodID = req.form.shippingMethodID;  // Must match isselect name
    // Process shipping method...
});
```

```isml
<!-- Template: name matches controller expectation -->
<isselect name="shippingMethodID" ... />
```

### 2. Use Clear, Descriptive Text

Make descriptions user-friendly and informative:

```isml
<!-- Good: Clear, helpful descriptions -->
<isselect 
  description="${iterator.name + ' - ' + iterator.estimatedDelivery + ' - ' + iterator.cost}"
  ... />

<!-- Less helpful: Minimal description -->
<isselect 
  description="${iterator.name}"
  ... />
```

### 3. Ensure Unique Condition Matches

Only one option should match the condition:

```isml
<!-- Good: Unique match -->
<isselect 
  condition="${iterator.ID == pdict.selectedID}"
  ... />

<!-- Bad: Multiple matches possible -->
<isselect 
  condition="${iterator.available == true}"  <!-- Many items could match -->
  ... />
```

### 4. Provide Default Selection

Always preselect a sensible default option:

```isml
<!-- Good: Default selection -->
<isselect 
  condition="${iterator.isDefault || (iterator.code == pdict.currentCountry)}"
  ... />

<!-- Less user-friendly: No default selection -->
<isselect 
  <!-- No condition - user must select -->
  ... />
```

### 5. Use Value for Internal IDs

Use `value` for internal identifiers, `description` for display:

```isml
<!-- Good: Separate value and description -->
<isselect 
  value="${iterator.ID}"              <!-- Internal ID -->
  description="${iterator.name}"       <!-- Display text -->
  ... />

<!-- Avoid: Same for both -->
<isselect 
  value="${iterator.name}"
  description="${iterator.name}"
  ... />
```

### 6. Add Accessibility Attributes

Wrap in proper form structure with labels:

```isml
<!-- Good: Accessible form structure -->
<div class="form-group">
  <label for="country" class="form-label">Country: <span class="required">*</span></label>
  <isselect 
    name="country"
    iterator="${pdict.countries}"
    description="${iterator.displayValue}"
    value="${iterator.countryCode}"
    condition="${iterator.countryCode == pdict.currentCountry}"
  />
  <small class="form-text">Select your country</small>
</div>
```

### 7. Handle Empty Iterators

Check for empty collections before rendering:

```isml
<isif condition="${pdict.countries && pdict.countries.length > 0}">
  <isselect 
    name="country"
    iterator="${pdict.countries}"
    description="${iterator.displayValue}"
    value="${iterator.countryCode}"
  />
<iselse>
  <p class="error">No countries available</p>
</isif>
```

### 8. Use Encoding by Default

Keep encoding enabled unless you have a specific reason to disable it:

```isml
<!-- Good: Encoding enabled (default) -->
<isselect 
  description="${iterator.name}"
  encoding="on"
  ... />

<!-- Only disable if content is pre-encoded -->
<isselect 
  description="${iterator.preEncodedHTML}"
  encoding="off"
  ... />
```

## Form Integration Patterns

### Pattern 1: Simple Selection Form

```isml
<form action="${URLUtils.url('Account-SaveProfile')}" method="post">
  <fieldset>
    <legend>Personal Information</legend>
    
    <div class="form-group">
      <label for="country">Country</label>
      <isselect 
        name="country"
        iterator="${pdict.countries}"
        description="${iterator.displayValue}"
        value="${iterator.countryCode}"
        condition="${iterator.countryCode == pdict.profile.countryCode}"
      />
    </div>
    
    <button type="submit">Save</button>
  </fieldset>
</form>
```

### Pattern 2: Dependent Selects (Country → State)

```isml
<form action="${URLUtils.url('Address-Save')}" method="post">
  <!-- Country selection -->
  <div class="form-group">
    <label for="country">Country</label>
    <isselect 
      name="country"
      iterator="${pdict.countries}"
      description="${iterator.displayValue}"
      value="${iterator.countryCode}"
      condition="${iterator.countryCode == pdict.address.countryCode}"
    />
  </div>
  
  <!-- State selection (dependent on country) -->
  <div class="form-group" data-country-dependent="true">
    <label for="state">State/Province</label>
    <isselect 
      name="state"
      iterator="${pdict.states}"
      description="${iterator.displayValue}"
      value="${iterator.code}"
      condition="${iterator.code == pdict.address.stateCode}"
    />
  </div>
  
  <button type="submit">Save Address</button>
</form>

<script>
  // JavaScript to update states when country changes
  document.querySelector('[name="country"]').addEventListener('change', function() {
    // AJAX call to update state list
  });
</script>
```

### Pattern 3: Multi-Select Form

```isml
<form action="${URLUtils.url('Checkout-Submit')}" method="post">
  <!-- Shipping method -->
  <div class="form-group">
    <label for="shippingMethod">Shipping Method</label>
    <isselect 
      name="shippingMethodID"
      iterator="${pdict.shippingMethods}"
      description="${iterator.displayName + ' - ' + iterator.shippingCost.formatted}"
      value="${iterator.ID}"
      condition="${iterator.ID == pdict.currentShippingMethodID}"
    />
  </div>
  
  <!-- Payment method -->
  <div class="form-group">
    <label for="paymentMethod">Payment Method</label>
    <isselect 
      name="paymentMethodID"
      iterator="${pdict.paymentMethods}"
      description="${iterator.name}"
      value="${iterator.ID}"
      condition="${iterator.ID == pdict.currentPaymentMethodID}"
    />
  </div>
  
  <button type="submit">Place Order</button>
</form>
```

## Comparison with HTML Select

| Feature | `<isselect>` | HTML `<select>` |
|---------|--------------|-----------------|
| Syntax | Single self-closing tag | Multiple tags (select + options) |
| Options | Auto-generated from iterator | Manual option tags |
| Encoding | Automatic (default on) | Manual |
| Preselection | Via condition attribute | Via selected attribute on option |
| ISML Integration | Native | Requires loops and conditions |

**Example Comparison:**

```isml
<!-- isselect: Concise -->
<isselect 
  name="country"
  iterator="${pdict.countries}"
  description="${iterator.name}"
  value="${iterator.code}"
  condition="${iterator.code == 'US'}"
/>

<!-- HTML select: Verbose -->
<select name="country">
  <isloop items="${pdict.countries}" var="country">
    <option value="${country.code}" <isif condition="${country.code == 'US'}">selected</isif>>
      ${country.name}
    </option>
  </isloop>
</select>
```

## Common Errors and Troubleshooting

### No Options Appearing

**Symptom:** Select box is empty.

**Causes:**
1. Iterator is empty or null
2. Iterator attribute has wrong path
3. Description or value expressions are invalid

**Solution:**
```isml
<!-- Check iterator exists and has items -->
<isif condition="${pdict.countries && pdict.countries.length > 0}">
  <isselect 
    name="country"
    iterator="${pdict.countries}"
    description="${iterator.displayValue}"
    value="${iterator.countryCode}"
  />
<iselse>
  <p>No countries available</p>
</isif>
```

### Multiple Options Selected

**Symptom:** Multiple options appear selected in browser.

**Cause:** Condition matches multiple items.

**Solution:**
```isml
<!-- Bad: Condition matches multiple items -->
<isselect 
  condition="${iterator.available == true}"  <!-- Many could be true -->
  ... />

<!-- Good: Unique identifier -->
<isselect 
  condition="${iterator.ID == pdict.selectedID}"  <!-- Only one match -->
  ... />
```

### Form Value Not Received

**Symptom:** Controller doesn't receive selected value.

**Causes:**
1. Name attribute doesn't match controller expectation
2. Form not submitted properly
3. Form method (GET/POST) mismatch

**Solution:**
```isml
<!-- Ensure name matches controller -->
<form action="${URLUtils.url('Controller-Action')}" method="post">
  <isselect name="expectedFieldName" ... />  <!-- Must match controller -->
  <button type="submit">Submit</button>
</form>
```

```javascript
// Controller
server.post('Action', function (req, res, next) {
    var value = req.form.expectedFieldName;  // Must match isselect name
});
```

### Special Characters Not Displaying

**Symptom:** Special characters appear as HTML entities in select options.

**Cause:** Double encoding (encoding enabled when content already encoded).

**Solution:**
```isml
<!-- If content is already encoded, disable encoding -->
<isselect 
  description="${iterator.alreadyEncodedText}"
  encoding="off"
  ... />
```

## Performance Considerations

### 1. Minimize Iterator Size

Large iterators can slow rendering:

```isml
<!-- Good: Reasonable number of options -->
<isselect iterator="${pdict.countries}" ... />  <!-- ~200 countries -->

<!-- Avoid: Thousands of options -->
<isselect iterator="${pdict.allProducts}" ... />  <!-- Could be 10,000+ -->
```

### 2. Use Efficient Conditions

Keep condition expressions simple:

```isml
<!-- Good: Simple comparison -->
<isselect 
  condition="${iterator.ID == pdict.selectedID}"
  ... />

<!-- Avoid: Complex calculation in condition -->
<isselect 
  condition="${calculateComplexLogic(iterator, pdict.data)}"
  ... />
```

## Security Considerations

### 1. Keep Encoding Enabled

Always use encoding unless absolutely necessary to disable:

```isml
<!-- Good: Encoding enabled (default) -->
<isselect 
  description="${iterator.userProvidedName}"
  encoding="on"
  ... />

<!-- Dangerous: User content without encoding -->
<isselect 
  description="${iterator.userProvidedName}"
  encoding="off"  <!-- Potential XSS -->
  ... />
```

### 2. Validate Selected Values Server-Side

Never trust client-submitted values:

```javascript
// Controller: Always validate
server.post('Process', function (req, res, next) {
    var selectedValue = req.form.fieldName;
    
    // Validate against allowed values
    var validValues = ['option1', 'option2', 'option3'];
    if (validValues.indexOf(selectedValue) === -1) {
        // Invalid value submitted
        res.json({error: 'Invalid selection'});
        return next();
    }
    
    // Process valid value
});
```

### 3. Use Internal IDs for Values

Don't expose sensitive information in option values:

```isml
<!-- Good: Use internal ID -->
<isselect 
  value="${iterator.ID}"
  description="${iterator.name}"
  ... />

<!-- Avoid: Sensitive data in value -->
<isselect 
  value="${iterator.secretKey}"  <!-- Don't expose secrets -->
  description="${iterator.name}"
  ... />
```

## Related Elements

- **`<isloop>`** - Alternative for creating custom select lists with more control
- **`<isset>`** - Set default values for preselection
- **`<isif>`** - Conditional select box rendering
- **`<isprint>`** - Output selected values with formatting

## Related APIs

- **`dw.web.FormElement`** - Form element handling
- **`dw.web.FormField`** - Form field access
- **`request.httpParameterMap`** - Access form submission values
- **`session.forms`** - Session form data

## See Also

- [SFCC Forms Development Skill](../../ai-instructions/skills/sfcc-forms-development/SKILL.md)
- [SFRA Controllers Skill](../../ai-instructions/skills/sfcc-sfra-controllers/SKILL.md)
- [Security Skill](../../ai-instructions/skills/sfcc-security/SKILL.md)
- [isloop Element](./isloop.md)
- [isset Element](./isset.md)

# Locale-Aware Formatting

## Currency

```javascript
var Money = require('dw/value/Money');
var StringUtils = require('dw/util/StringUtils');
var price = new Money(99.99, 'USD');
var formatted = StringUtils.formatMoney(price); // Uses current locale
```

```html
<isprint value="${product.priceModel.price}" style="CURRENCY"/>
```

## Dates

```javascript
var StringUtils = require('dw/util/StringUtils');
var Calendar = require('dw/util/Calendar');
var date = new Calendar();
StringUtils.formatCalendar(date, 'yyyy-MM-dd'); // ISO
StringUtils.formatCalendar(date, 'MMMM d, yyyy'); // Locale-aware
```

## Guidelines

- Drive date/number formats from locale, not assumptions.
- Keep currency tied to site/currency settings; avoid manual symbols.

# Locale Switching

## Locale-Aware URLs

```html
<a href="${URLUtils.url('Product-Show', 'pid', 'ABC123')}">View Product</a>
<a href="${URLUtils.url(new URLAction('Product-Show', 'MySite', 'fr'))}">Voir le produit</a>
```

## Language Switcher Snippet

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

## Notes

- Allowed locales come from Business Manager (Sites > Manage Sites > Locale Settings).
- Ensure navigation/stateful URLs include the locale segment or parameter consistently.

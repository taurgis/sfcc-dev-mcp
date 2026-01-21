# Static Files Localization

Localize static assets when they contain text (images, PDFs); CSS/JS usually stay default.

## Directory Structure

```
/cartridge/static
  /default/images/buttons/submit.png
  /fr/images/buttons/submit.png
  /de/images/buttons/submit.png
  /default/css/style.css
  /default/js/main.js
```

## Usage

```html
<img src="${URLUtils.staticURL('/images/buttons/submit.png')}" alt="Submit"/>
<link rel="stylesheet" href="${URLUtils.staticURL('/css/style.css')}"/>
```

SFCC resolves the locale-specific asset automatically when present.

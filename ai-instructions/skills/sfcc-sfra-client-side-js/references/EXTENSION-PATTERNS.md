# Client-Side Extension Patterns

Detailed guide for extending SFRA client-side JavaScript modules using build-time composition.

## The Extension Mechanism

Client-side extension uses **build-time aliases**, not runtime inheritance. The `paths` configuration in `package.json` enables cross-cartridge module resolution during the webpack/sgmf-scripts build.

### Critical Misconception: `module.superModule`

`module.superModule` exists only on the **server** (Rhino engine) for controllers/scripts. It does **NOT** exist in browser bundles. Using it client-side throws an undefined reference error.

## Extension Steps

### 1. Configure `paths` Alias

```jsonc
// app_custom_mybrand/package.json
{
    "name": "app_custom_mybrand",
    "scripts": {
        "compile:js": "sgmf-scripts --compile js",
        "compile:scss": "sgmf-scripts --compile css"
    },
    "paths": {
        "base": "../storefront-reference-architecture/cartridges/app_storefront_base/"
    }
}
```

### 2. Require Base Module

```javascript
'use strict';
var base = require('base/product/detail');
```

### 3. Decorate or Override

Modify the `base` object by adding or replacing functions. If you need original logic, copy/refactor it—there is no automatic super call.

### 4. Re-export

```javascript
module.exports = base;
```

## Full PDP Extension Example

**Base (`app_storefront_base/.../product/detail.js`)**
```javascript
'use strict';
function updateAddToCartButton(update) {
    $('button.add-to-cart').attr('disabled', !update.readyToOrder || !update.available);
}
module.exports = { updateAddToCartButton: updateAddToCartButton };
```

**Custom (`app_custom_mybrand/.../product/detail.js`)**
```javascript
'use strict';
var base = require('base/product/detail');

function handleNotifyMe() {
    console.log('Notify Me button clicked!');
}

function updateNotifyMeButton(update) {
    if (!update.available && update.readyToOrder) {
        $('.notify-me').show();
    } else {
        $('.notify-me').hide();
    }
}

// Override base function
base.updateAddToCartButton = function (update) {
    $('button.add-to-cart').attr('disabled', !update.readyToOrder || !update.available);
    updateNotifyMeButton(update);
};

// Add new function
base.initializeNotifyMeEvent = function () {
    $('body').on('click', '.notify-me', handleNotifyMe);
};

module.exports = base;
```

## `require()` Path Syntax Reference

| Syntax       | Context                  | Purpose / Behavior                                              | Example |
|--------------|--------------------------|------------------------------------------------------------------|---------|
| `./` / `../` | Client & Server          | Relative to current file                                        | `require('./utils')` |
| `~/`         | Server only (runtime)    | Current cartridge root in runtime path. Not for client build    | `require('~/cartridge/scripts/assets.js')` |
| `*/`         | Server only (runtime)    | Searches entire cartridge path (left→right)                     | `require('*/cartridge/scripts/middleware/consentTracking')` |
| `[alias]/`   | Client only (build-time) | Resolves via `package.json` `paths` mapping across cartridges   | `require('base/product/detail')` |

## Module Design Pattern

Design modules with a predictable lifecycle for clean composition:

```javascript
// product/favorites.js
'use strict';
var selectors = { container: '.favorites-container' };

function bindEvents($root) {
    $root.on('click.favoritesAdd', '.favorite-add', onAdd);
}

function unbindEvents($root) { 
    $root.off('.favoritesAdd'); 
}

function onAdd(e) { 
    /* feature logic */ 
}

module.exports = {
    init: function () { bindEvents($(selectors.container)); },
    destroy: function () { unbindEvents($(selectors.container)); }
};
```

### Guidelines

- Namespace every delegated event (`.featureNameAction`)
- Export `init()` + optional `destroy()`; page orchestrator calls these
- Keep pure logic (parsing, transforms) in separate files for unit tests
- Avoid circular requires: one orchestrator imports leaf modules; leaves only export functions

## Quick Start Template

```javascript
'use strict';
var base = require('base/components/menu');

// Preserve reference if you need original
var originalToggle = base.toggle;

base.toggle = function () {
    originalToggle.apply(this, arguments);
    // Custom enhancement
    window.dispatchEvent(new CustomEvent('menu:toggled'));
};

module.exports = base;
```

## Extension Strategy by Module Type

| Type | Recommended Strategy | Example |
|------|----------------------|---------|
| UI component (`components/*`) | Add feature then re-export base object | Override `base.open = customOpen` |
| Page orchestrator (e.g. `product/detail.js`) | Override specific functions; add init hooks | Override `updateAddToCartButton` |
| Form logic (`checkout/*.js`) | Split complex logic into helper modules first | Extract validation helper |
| Accessibility (`keyboardAccessibility.js`) | Patch by progressive enhancement | Add new key handlers before export |
| Bootstrap / vendor (`thirdParty/*`) | Avoid direct override; extend via event hooks | Wrap after requiring |

## When NOT to Override

- If a base module only needs minor event binding, prefer **decorating after require** instead of rewriting
- Avoid duplicating large functions just to change a selector—refactor into a helper
- Do not modify vendored third-party code directly—wrap or extend

---
name: sfcc-sfra-scss
description: Best practices for styling and theming SFRA storefronts using SCSS. Use when asked to create style overrides, theming, responsive layouts, or CSS customizations in SFCC.
---

## SFRA SCSS Best Practices (AI-Agent Optimized)

Purpose: Provide a concise, implementation‑ready reference for styling and theming Salesforce B2C Commerce SFRA storefronts using SCSS. Optimized for automated reasoning, safe overrides, upgrade resilience, and performant output.

---
## 1. Core Principles (Never Skip)
| Principle | Rule | Why It Exists | Action Pattern |
|-----------|------|---------------|----------------|
| Cartridge Overlay | Never edit `app_storefront_base` | Preserve upgrade path | Create mirror path in custom cartridge + import base first |
| Import First, Then Override | Always `@import '~base/...';` at top | Keeps base layout + utilities | File header snippet template |
| Single Source of Truth | Centralize tokens in `abstracts/_variables.scss` | Global theming + diffable changes | Import base → redefine only changed vars |
| Shallow Specificity | Max selector depth 2–3 | Predictable cascade | Use BEM instead of nested HTML chains |
| Mobile‑First | Base = smallest viewport | Less override churn | Add enhancements with `min-width` media mixin |
| Immutable Generated CSS | Never hand edit `/static/default/css` | Prevent drift | Recompile via build scripts only |
| Deterministic Build | Same inputs ⇒ same CSS | Debug + CI parity | Lock dependency versions |

Red flag triggers for re‑evaluation: deep nesting (>3), repeated hardcoded colors, `!important`, duplicated breakpoint literals, editing compiled CSS, or missing initial `@import`.

AI Guardrail (fast reject): If asked to "change base SCSS" directly, respond with an override strategy instead of editing base source.

---
## 2. Minimal Override Workflow (Algorithm)
1. Inspect element in browser → capture compiled CSS filename (e.g. `product/detail.css`) & selector(s).
2. Locate source in base: `app_storefront_base/cartridge/client/default/scss/<path>.scss`.
3. Recreate identical relative path in custom cartridge under `cartridge/client/default/scss/`.
4. Add header: `@import '~base/<path>';` (must be line 1; no preceding BOM/comment).
5. Append scoped overrides (BEM, tokens, mixins only—no raw hex unless introducing new token).
6. Run `npm run compile:scss` (or project alias) → deploy → verify cascade diff.
7. If change is global (color, spacing, radius) prefer variable override in `_variables.scss` before component override.

Decision Tree:
| Goal | Location to Change First | Fallback If Not Available |
|------|--------------------------|---------------------------|
| Color / Font / Spacing shift | `_variables.scss` | Component partial override |
| Layout structure | ISML + classes | New component partial |
| Responsive tweak | Mixin breakpoints | Local media query (still via mixin) |
| Reusable visual pattern | New mixin | Placeholder + `@extend` |
| Plugin override | `vendors/` override partial | Scoped component patch |

Plugin Extension Nuances (Observed from `plugin_wishlists`):
* Keep plugin additions minimal: import base global first inside plugin `global.scss` (`@import "~base/global";`) then only plugin-specific partials.
* Do NOT re-import `variables` inside multiple plugin partials unless you need local compilation context—prefer central import in the entry file to avoid duplication.
* Avoid redefining spacing tokens mid-file (e.g. `$spacer` inside a feature file) unless intentionally creating a component-scoped token; document with a comment `// local token`.
* Consolidate repeated keyframes: If multiple alerts use identical fade animation, define it once in a shared partial (e.g. `components/_animations.scss`) instead of inline per component.
* When plugin needs base mixins (e.g. Bootstrap breakpoints) prefer `@import "~base/global";` rather than directly importing bootstrap again to reduce risk of version drift.

---
## 3. Canonical SCSS Directory (7‑1 Adapted)
```
scss/
  abstracts/  (_variables.scss, _mixins.scss, _functions.scss)
  base/       (_reset.scss, _typography.scss, _base.scss)
  layout/     (_header.scss, _footer.scss, _navigation.scss, _grid.scss)
  components/ (_buttons.scss, _product-tile.scss, _carousel.scss, ...)
  pages/      (_home.scss, _checkout.scss, _pdp.scss, ...)
  vendors/    (_bootstrap-overrides.scss, _plugin-X.scss)
  global.scss  (imports only – no rules)
```

Import Order (global.scss):
1. abstracts (variables → mixins → functions)
2. vendors
3. base
4. layout
5. components
6. pages

SFRA Reality Snapshot:
The core `global.scss` in `app_storefront_base` imports: `variables`, `skin/skinVariables`, bootstrap custom, overrides, utilities, icon libraries, then individual component partials. AI agents should treat this as the authoritative ordering when composing custom `global.scss` overlays: always import base `global` first in plugin/global contexts, then plugin additions.

Rule: No CSS selectors in `global.scss`; only `@import`.

---
## 4. Naming & Specificity Strategy (BEM + SFRA Conventions)
| Aspect | Rule | Example |
|--------|------|---------|
| Block | Semantic, domain concept | `.product-tile` |
| Element | `__` double underscore | `.product-tile__price` |
| Modifier | `--` double hyphen | `.product-tile--featured` |
| State (JS) | `is-` prefix (transient) | `.is-loading` |
| Utility | `u-` + purpose | `.u-hidden` |

Guidelines:
* Avoid HTML element chaining: prefer `.mini-cart__count` not `header .mini-cart span.count`.
* Never exceed 3 levels of specificity (block + element + modifier/state).
* Do not style IDs; reserve for scripting anchor only if necessary.
* Existing SFRA partials sometimes nest deeper (e.g. `.product-tile .tile-body .price .tiered .value`). When extending these, do NOT replicate entire nesting; extract just the block root with a modifier class you control (e.g. `.product-tile--compact`).
* For legacy classes not following BEM (e.g. `.wishlistTile`), retain original naming but annotate exception with justification comment to aid future refactor and silence lint selectively—in code: `/* stylelint-disable-line */`.

---
## 5. Token & Theme Management
Override pattern (`abstracts/_variables.scss`):
```scss
@import '~base/variables'; // must stay first
// Theme – Colors
$primary: #0B5FFF; // Brand blue
$secondary: #00A676;
$body-bg: #F8F9FA;
$body-color: #212529;
// Typography
$font-family-sans-serif: 'Inter', 'Helvetica Neue', Arial, sans-serif;
$font-family-serif: 'Merriweather', Georgia, serif;
// Radii / Spacing
$border-radius: 2px;
$btn-padding-y: 0.5rem;
$btn-padding-x: 1.125rem;
```
Rules:
* Only override variables you intentionally change.
* Introduce new tokens with consistent naming (`$color-*`, `$space-*`, `$z-*`).
* Never redefine variables in component partials—centralize.
* If a plugin must create a small local scalar (e.g. `$spacer` for a one-off layout tweak), prefix with component context when possible (`$wishlist-spacer`) to avoid collision with global tokens.
* Avoid re-importing base variables in each partial—imports are concatenated; repeated imports increase compile time and risk inconsistent overrides if order diverges.

---
## 6. Reuse Mechanisms (Decision Matrix)
| Need | Use | Why | Avoid If |
|------|-----|-----|----------|
| Static property bundle reused widely | `%placeholder` + `@extend` | Single output selector group | Needs argumentization |
| Dynamic pattern w/ params | `@mixin` | Flexible + readable | Output duplication causes bloat |
| Global theming value | `$variable` | Single update point | Represents multi-rule semantic block |
| Conditional computed value | `@function` | Returns scalar for calc chains | Can be plain variable |

Responsive Mixin:
```scss
$breakpoints: (
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px
) !default;

@mixin mq($bp) {
  @if map-has-key($breakpoints, $bp) {
    @media (min-width: map-get($breakpoints, $bp)) { @content; }
  } @else { @warn 'Unknown breakpoint: #{$bp}'; }
}
```

Usage:
```scss
.product-tile { width: 100%; @include mq(md) { width: 50%; } }
```
Bootstrap Breakpoints Interop:
SFRA base uses Bootstrap's `media-breakpoint-*` mixins. When generating code referencing base breakpoints, prefer those existing mixins (`@include media-breakpoint-down(md) { ... }`) if the base already depends on Bootstrap, instead of introducing a parallel custom map to avoid divergence. Use the custom `$breakpoints` + `mq()` pattern only if project intentionally decouples from Bootstrap.

---
## 7. Example Override (PDP Title)
File: `product/detail.scss`
```scss
@import '~base/product/detail'; // inherit base

.product-detail__name {
  font-family: $font-family-serif;
  font-size: 2.4rem;
  color: $primary;
}
```
Compiled file resolved via `assets.addCss('/css/product/detail.css')` with cartridge path precedence—no ISML changes needed.
AI Validation Step: After generation, assert snippet begins with base import and contains only new selectors or modified declarations—no duplication of entire base blocks.

---
## 8. Component Patterns Library (Sample Snippets)
Buttons (`components/_buttons.scss`):
```scss
@import '~base/components/buttons';

.btn--pill { border-radius: 999rem; }
.btn--outline-secondary {
  color: $secondary; background: transparent; border: 1px solid $secondary;
  &:hover { background: $secondary; color: #fff; }
}
```

Product Tile (`components/_product-tile.scss`):
```scss
@import '~base/components/product-tile';

.product-tile {
  border: 1px solid transparent; transition: box-shadow .2s;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,.1); border-color: $gray-300; }
  &__price--sale { color: $danger; font-weight: 600; }
}

Refactor Tip: Instead of deeply nested overrides inside `.product-tile .tile-body .price .tiered .value`, target a purposeful modifier class (`.product-tile__price--tiered-value`) you add in ISML for long-term maintainability.
```

Checkout (`pages/_checkout.scss`):
```scss
@import '~base/pages/checkout';
.checkout-nav .nav-link { background:$gray-200; color:$gray-600;
  &.active { background:$primary; color:#fff; }
}
```

---
## 9. Responsive Strategy
| Rule | Implementation |
|------|----------------|
| Mobile‑first | Base styles = small viewport |
| Progressive enhancement | `@include mq(md){...}` not `max-width` overrides |
| Centralized breakpoints | `$breakpoints` map only |
| Avoid pixel drift | Use tokens, not ad‑hoc numbers |

Anti‑Pattern: Desktop CSS first + mobile overrides via `@media (max-width)` – leads to override churn.
Plugin Reality: Wishlist plugin currently mixes `media-breakpoint-up` and `media-breakpoint-down` usage; maintain consistency—choose mobile-first pattern (prefer `-up` for enhancements) and refactor legacy `-down` only when safe.

---
## 10. Accessibility & Inclusive Styling
| Concern | Checklist |
|---------|-----------|
| Color Contrast | Ensure WCAG AA (> 4.5:1 body, 3:1 large text). Token review before merge. |
| Focus States | Visible focus ring; never remove outline without replacement. |
| Reduced Motion | Gate large transitions with `@media (prefers-reduced-motion: reduce)` |
| Hidden Content | Use utility `.u-visually-hidden` for screen-reader only text; avoid `display:none` for needed ARIA live content. |
| Touch Targets | Minimum 44px height for interactive elements (buttons, filters). |

Utility Example:
```scss
.u-visually-hidden { position:absolute!important; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0; }
```
Animation Respect:
Provide a reduced-motion alternative when introducing keyframe animations (e.g. fading alerts). Centralize keyframes and wrap any large movement inside `@media (prefers-reduced-motion: no-preference)`; fallback: immediate end state.

---
## 11. Performance Practices
| Optimization | Action | Tooling |
|--------------|--------|---------|
| Critical CSS | Generate subset for key templates → inline via `store-skin` asset | `npm i critical` |
| Prune Unused CSS | Integrate PurgeCSS scanning ISML & JS | PurgeCSS plugin |
| Minification | Ensure prod build via `sgmf-scripts` produces minified bundle | CI check size |
| Source Maps (dev only) | Enable for DX; disable prod | Sass compiler flag |
| Font Strategy | Use WOFF2 + subsetting + `font-display: swap` | Font tooling |

Suggested CI Budget: Global CSS ≤ 250KB uncompressed (enterprise baseline) – fail build if regression > +15% week‑over‑week.
Duplicate Import Scan: Add a CI grep step to detect repeated `@import "~base/variables";` inside plugin component partials—emit warning to consolidate.

---
## 12. Linting & Quality Automation
Install:
```
npm i -D stylelint stylelint-config-standard-scss stylelint-declaration-strict-value
```
Config (`.stylelintrc.json`):
```json
{
  "extends": "stylelint-config-standard-scss",
  "plugins": ["stylelint-declaration-strict-value"],
  "rules": {
    "selector-class-pattern": ["^([a-z][a-z0-9]*)(__(?:[a-z0-9]+))?(--[a-z0-9-]+)?$", {"message": "Use BEM: block__element--modifier"}],
    "max-nesting-depth": 2,
    "declaration-no-important": true,
    "scale-unlimited/declaration-strict-value": [["color", "background-color", "border-color", "font-size"], {"ignoreValues": ["inherit", "transparent", "currentColor"]}]
  }
}
```
Script:
```json
"scripts": { "lint:scss": "stylelint 'cartridges/**/*.scss' --cache" }
```
Optional: pre‑commit hook with Husky + lint-staged.

AI Generation Rule Set:
When asked to produce SCSS:
1. Always start with required base import (unless file is `abstracts/_variables.scss`).
2. Do not inline raw colors already expressible as existing tokens—prefer token reference.
3. Replace any suggested `!important` with a cascade adjustment strategy comment.
4. Provide at most one new local token; advise moving to global if reused >2 times.
5. Add a 2-line header comment with PURPOSE + SAFE REMOVE classification.

---
## 13. Anti‑Patterns (Refactor Immediately)
| Smell | Why Dangerous | Fix |
|-------|---------------|-----|
| Editing compiled CSS | Lost on next build | Modify SCSS source |
| Missing base import | Breaks structural inheritance | Add `@import '~base/...';` line 1 |
| Deep selector chains | Specificity lock-in | Convert to BEM blocks/elements |
| Repeated hex codes | Inconsistent theming | Promote to variable |
| `!important` usage | Overrides cascade discipline | Reduce specificity / re-order imports |
| Inline media queries w/ literals | Hard to refactor | Use `mq()` mixin |
| Component partial modifies unrelated block | Hidden coupling | Create new partial / utility |
| Re-importing base variables in every plugin partial | Build bloat / risk inconsistent overrides | Import once at entry (e.g. plugin `global.scss`) |
| Inline duplicated keyframes | Larger bundle & maintenance overhead | Centralize in shared `components/_animations.scss` |

---
## 14. Troubleshooting Matrix
| Symptom | Likely Cause | Diagnostic | Resolution |
|---------|--------------|-----------|-----------|
| Style not applied | Not in compiled CSS | Search compiled file for selector | Check import order / rebuild |
| Base style lost | Missing base import | Inspect diff of partial | Add import + revert overrides |
| Wrong theme color persisting | Variable shadowed locally | Grep for variable redefinition | Centralize in `_variables.scss` |
| Breakpoint shift inconsistent | Hardcoded px values | `grep -R "992px"` | Replace with token map |
| Layout jumps FOUC | Critical CSS missing | Lighthouse trace | Implement store-skin inline CSS |
| Repeated variable override ignored | Later import overrides earlier | Trace import graph order | Consolidate variable overrides at earliest import point |

---
## 15. Promptable Action Snippets (For AI Agents)
| Intent | Prompt Template |
|--------|-----------------|
| Create component override | "Generate SFRA SCSS override for `<component>` (base path `<path>`). Include base import and BEM modifiers for states: loading, error." |
| Introduce new theme color | "Add semantic token for highlight color with accessible contrast against `$body-bg` and update button hover style." |
| Refactor deep selectors | "Refactor selector `<selector>` into BEM with max depth 2; preserve semantics." |
| Add responsive variant | "Extend `.product-tile` to show 2 columns at md, 4 at lg via existing breakpoint mixin." |
| Performance audit | "List top 10 heaviest SCSS partials by compiled size estimate and suggest consolidation." |
| Plugin extension | "Generate wishlist plugin SCSS override importing '~base/global' then add toast animation using existing base token palette; avoid duplicating keyframes if fade already exists." |

---
## 16. Migration Checklist (Before Deploy)
[] All overrides start with base import
[] No direct edits to `app_storefront_base`
[] Variables overridden centrally only
[] Lint passes (no warnings in CI)
[] No `!important` (or justified + documented)
[] CSS bundle size budget respected
[] Critical CSS updated for homepage + PDP
[] Source maps disabled for production
[] New utilities documented (inline comment header)
[] No duplicate keyframe blocks with identical declarations
[] Plugin global includes base global exactly once

---
## 17. Reference Quick Commands
```
# Compile SCSS
npm run compile:scss

# Lint SCSS
npm run lint:scss

# Find hardcoded colors (non-variable)
// in app_custom/cartridge/client/default/scss/abstracts/_variables.scss

# Estimate partial usage (appearance in compiled)
@import '~base/variables';
```

CI Grep Helpers (Optional):
```
grep -R "@import \"~base/variables\"" cartridges/plugin_* | sort
grep -R "@keyframes fade" cartridges/ | wc -l
```

---
## 18. Secure & Maintainable Patterns
| Concern | Guidance |
|---------|----------|
| Multi-brand scaling | Abstract brand diffs to dedicated `_brand-<id>.scss` imported conditionally via build flag |
| A/B testing CSS | Isolate experiment layer in `components/experiments/` with clear removal date comment |
| Plugin overrides | Keep each plugin override in `vendors/_<plugin>-overrides.scss` with upstream version tag |
| Future SFRA upgrade | Diff only variable + override partials; never fork base files wholesale |

Header Annotation Block (optional for generated partial):
```scss
// PURPOSE: Override of base product tile for brand visual refinement
// DEPENDS: ~base/components/product-tile
// SAFE REMOVE: Yes (reverts to base visual style)
```
Classification Legend:
* SAFE REMOVE: Removing file reverts to acceptable base styling.
* CONDITIONAL: Removal affects brand contract (document impact).
* CRITICAL: Provides accessibility or functional styling (never remove without replacement).

---
## 19. When NOT to Override
| Scenario | Better Option |
|----------|---------------|
| Structural HTML limitation | Adjust ISML markup first |
| Repeated spacing hacks | Introduce spacing scale utility classes |
| Overriding grid internals | Use flexbox utilities / custom wrapper |
| One-off promotional layout | Page partial (`pages/_promo-<slug>.scss`) + sunset note |
| Behavior actually JS-driven (e.g. show/hide) | Adjust JS or data attributes; keep CSS purely presentational |

---

## 20. AI Generation Quick Checklist (Inline in Responses)
Provide along with any generated SCSS so humans can validate rapidly:
1. Base Import Present? (Yes/No)
2. Variable Overrides? (List or None)
3. New Tokens Introduced? (List or None)
4. Max Nesting Depth (#)
5. Uses Existing Breakpoint Mixins? (Yes/No)
6. Any Raw Hex Values? (List or None + justification)
7. Keyframes Added? (Name or None; already exists?)
8. Accessibility Considerations? (Focus/contrast/motion)
9. Removable Classification (SAFE REMOVE / CONDITIONAL / CRITICAL)
10. Lint‑Sensitive Areas (Exceptions with reason)

If any answer violates a stated rule, propose an auto-correction diff, not just a warning.

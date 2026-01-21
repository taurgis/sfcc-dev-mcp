# SFRA Page Patterns (Cart, Account, Auth)

These patterns are common in SFRA for stateful and account-related pages.

## Cart

Typical traits:

- Decorated with `common/layout/page`
- Uses Bootstrap alerts for errors
- Renders line items via includes by product type
- Renders totals + promo/coupon UX in a right-side column on desktop

Common includes:

- `cart/productCard/cartProductCard`
- `cart/productCard/cartBundleCard`
- `cart/cartTotals`
- `cart/cartPromoCode`
- `cart/checkoutButtons`

Keep cart-specific fragments local unless you have a strong cache boundary reason.

## Account (Dashboard + Subpages)

Typical traits:

- Decorated with `common/layout/page`
- Left-side navigation include: `account/accountNav`
- Card layout for subpages and content areas

Avoid putting “which subpage is active” logic in ISML beyond simple conditionals. Prefer controller flags (`pdict.profile`, `pdict.orderHistory`, etc.).

## Login / Registration

Typical traits:

- Decorated with `common/layout/page`
- CSRF hidden fields required
- Bootstrap 4 validation patterns:
  - input adds `is-invalid` when field invalid
  - error text rendered in `invalid-feedback`
- Uses `autocomplete` attributes for UX and accessibility

Reminder: do not output raw form attributes with `encoding="off"` unless the source is trusted.

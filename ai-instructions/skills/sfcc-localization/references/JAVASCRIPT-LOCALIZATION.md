# JavaScript Localization

## Passing Strings to the Client

```html
<script>
window.resources = {
  cart: {
    addSuccess: '${Resource.msg('cart.add.success', 'cart', 'Added to cart')}',
    addError: '${Resource.msg('cart.add.error', 'cart', 'Error adding to cart')}'
  },
  common: {
    loading: '${Resource.msg('label.loading', 'common', 'Loading...')}',
    error: '${Resource.msg('error.general', 'error', 'An error occurred')}'
  }
};
</script>
```

## Using in JS

```javascript
function addToCart(productId) {
  showLoading(window.resources.common.loading);
  $.ajax({
    url: '/Cart-AddProduct',
    data: { pid: productId },
    success: function (response) {
      showMessage(response.success ? window.resources.cart.addSuccess : (response.message || window.resources.cart.addError));
    },
    error: function () {
      showMessage(window.resources.common.error);
    }
  });
}
```

## Guidelines

- Never hardcode UI strings in client JS; source them from server bundles.
- Keep the client payload minimal—send only strings that are actually used.

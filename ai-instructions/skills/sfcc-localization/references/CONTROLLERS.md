# Controller Localization

## Accessing Current Locale

```javascript
var Locale = require('dw/util/Locale');
server.get('Show', function (req, res, next) {
  var current = Locale.getLocale(req.locale.id);
  res.render('mytemplate', {
    locale: req.locale.id,
    language: current.language,
    country: current.country
  });
  next();
});
```

## Locale-Specific Logic

```javascript
server.get('Checkout', function (req, res, next) {
  var locale = req.locale.id;
  var dateFormat = locale.startsWith('en_US') ? 'MM/dd/yyyy' : 'dd/MM/yyyy';
  res.render('checkout', { dateFormat: dateFormat });
  next();
});
```

## Localized Errors / JSON Responses

```javascript
var Resource = require('dw/web/Resource');
server.post('Submit', function (req, res, next) {
  if (!server.forms.getForm('profile').valid) {
    res.json({ success: false, message: Resource.msg('error.form.invalid', 'error', 'Please correct the errors') });
    return next();
  }
  res.json({ success: true, message: Resource.msg('message.saved', 'common', 'Saved successfully') });
  next();
});
```

## Email Templates

```javascript
var Template = require('dw/util/Template');
var Mail = require('dw/net/Mail');
var HashMap = require('dw/util/HashMap');
var Resource = require('dw/web/Resource');

function sendOrderConfirmation(order, locale) {
  var template = new Template('mail/orderconfirmation', locale);
  var model = new HashMap();
  model.put('order', order);

  var content = template.render(model).text;
  var mail = new Mail();
  mail.addTo(order.customerEmail);
  mail.setSubject(Resource.msg('email.order.subject', 'email', null));
  mail.setContent(content, 'text/html', 'UTF-8');
  mail.send();
}
```

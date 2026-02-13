# AJAX, CSRF & Form Validation

Comprehensive guide for AJAX patterns, CSRF token handling, and form validation in SFRA client-side JavaScript.

## AJAX Architecture

### Core Components

1. **Controller route** (`server.post('Route', ...)`) returns JSON via `res.json()`
2. **Client module** uses `$.ajax()` (or `fetch`) with serialized form data
3. **URL generation** via `URLUtils.url('Controller-Route')` passed through `data-*` attributes
4. **CSRF token** injected as hidden inputs; included automatically when using `form.serialize()`
5. **Error handling**: differentiate transport errors vs. business validation (`success: false`)

### Controller Example

```javascript
'use strict';
var server = require('server');
var Resource = require('dw/web/Resource');

server.post('Subscribe', function (req, res, next) {
    var email = req.form.email;
    var success = !!email;
    var message = success
        ? Resource.msg('subscribe.success.message', 'newsletter', null)
        : Resource.msg('subscribe.error.invalidemail', 'newsletter', null);

    res.json({ success: success, message: message, submittedEmail: email });
    return next();
});

module.exports = server.exports();
```

### ISML Form Template

```html
<form id="newsletter-form"
      action="${URLUtils.url('Newsletter-Subscribe')}"
      method="POST"
      data-action-url="${URLUtils.url('Newsletter-Subscribe')}">
    <div class="form-group">
        <label for="newsletter-email">${Resource.msg('label.input.email', 'forms', null)}</label>
        <input type="email" id="newsletter-email" name="email" required>
        <div class="invalid-feedback"></div>
    </div>
    <input type="hidden" name="${pdict.csrf.tokenName}" value="${pdict.csrf.tokenValue}" />
    <button type="submit" class="btn btn-primary">${Resource.msg('button.subscribe', 'newsletter', null)}</button>
</form>
<div class="newsletter-message" role="alert"></div>
```

### Client Module

```javascript
'use strict';
module.exports = function () {
    $('#newsletter-form').on('submit', function (e) {
        e.preventDefault();
        var $form = $(this);
        var url = $form.data('action-url');
        var $msg = $('.newsletter-message');
        var $email = $('#newsletter-email');
        
        $form.spinner().start();
        
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            data: $form.serialize(),
            success: function (data) {
                $form.spinner().stop();
                $msg.removeClass('alert-danger')
                    .addClass('alert-success')
                    .text(data.message)
                    .show();
                $email.val('');
            },
            error: function (err) {
                $form.spinner().stop();
                var text = (err.responseJSON && err.responseJSON.message) || 'An unexpected error occurred.';
                $msg.removeClass('alert-success')
                    .addClass('alert-danger')
                    .text(text)
                    .show();
            }
        });
    });
};
```

## Concurrency & Abort

Maintain reference to last in-flight XHR to avoid race conditions:

```javascript
var lastXhr = null;

function fetchSuggestions(query) {
    if (lastXhr) {
        lastXhr.abort();
    }
    
    lastXhr = $.ajax({
        url: suggestUrl,
        data: { q: query },
        success: function (data) {
            renderSuggestions(data);
        }
    });
}
```

For libraries that swallow abort errors, use request tokens:

```javascript
var requestId = 0;

function fetchData() {
    var currentRequest = ++requestId;
    
    $.ajax({
        url: endpoint,
        success: function (data) {
            if (currentRequest !== requestId) return; // Stale response
            handleData(data);
        }
    });
}
```

## Double-Click Prevention

```javascript
$('.add-to-cart').on('click', function (e) {
    var $btn = $(this);
    if ($btn.data('processing')) return;
    
    $btn.data('processing', true);
    
    $.ajax({
        url: addToCartUrl,
        // ...
        complete: function () {
            $btn.data('processing', false);
        }
    });
});
```

## Standardized AJAX Wrapper

```javascript
function requestJSON(opts) {
    var d = $.Deferred();
    var xhr = $.ajax(opts);
    
    xhr.done(function (data) { 
        d.resolve(normalize(data)); 
    })
    .fail(function (xhr) { 
        d.reject(normalizeError(xhr)); 
    });
    
    d.abort = function () { 
        if (xhr && xhr.readyState !== 4) { 
            xhr.abort(); 
        } 
    };
    
    return d;
}

function normalize(data) {
    return {
        success: data.success !== false,
        payload: data,
        msg: data.message || data.msg || ''
    };
}

function normalizeError(xhr) {
    var msg = (xhr.responseJSON && (xhr.responseJSON.msg || xhr.responseJSON.message)) 
              || 'Unexpected error';
    return { success: false, msg: msg };
}
```

## Retry Decision Matrix

| Failure | Retry? | Strategy |
|---------|--------|----------|
| Network timeout | Yes (1-2x) | Exponential backoff (300ms, 900ms) |
| 5xx server error | Optional | Single retry; log event for monitoring |
| 4xx validation | No | Surface messages; focus first invalid field |
| 403 CSRF | Yes (once) | Refresh token then replay |

## Form Framework & Validation

### Server XML Definitions

Forms are defined in `forms/default/` as the single source of truth:

```xml
<form formid="newsletter">
    <field formid="email" 
           type="string" 
           mandatory="true" 
           max-length="120" 
           regexp="^[^@]+@[^@]+\.[^@]+$"
           parse-error="error.parse.email" 
           missing-error="error.missing.email" />
</form>
```

### Validation Flow

```text
Load → User Input → HTML5 check → (If fail) prevent submit + style
→ If pass: AJAX submit → Server re-validate → Success OR Error JSON
→ On error: map messages → show per-field + global feedback
```

### Client & Server Synergy

1. Controller: `server.forms.getForm('newsletter')` loads + binds definition
2. Template: injects metadata (often via `data-*`)
3. Browser: native HTML5 validation (type / required / maxlength)
4. `clientSideValidation.js`: intercepts invalid events, adds `is-invalid` styling
5. `form-validation.js`: enforces XML-derived rules client-side
6. AJAX submit → server re-validates
7. Failure: JSON payload enumerates field errors; client maps & displays

### Error Display Pattern

```javascript
function displayErrors(errors, $form) {
    // Clear previous errors
    $form.find('.is-invalid').removeClass('is-invalid');
    $form.find('.invalid-feedback').empty();
    
    // Display new errors
    Object.keys(errors).forEach(function (fieldId) {
        var $field = $form.find('[name="' + fieldId + '"]');
        var $feedback = $field.siblings('.invalid-feedback');
        
        $field.addClass('is-invalid');
        $feedback.text(errors[fieldId]);
    });
    
    // Focus first invalid field
    $form.find('.is-invalid:first').focus();
}
```

## CSRF Token Handling

CSRF tokens are typically injected as hidden inputs. When using `form.serialize()`, they're included automatically.

For manual AJAX requests:

```javascript
var csrfToken = $('input[name="csrf_token"]').val();

$.ajax({
    url: endpoint,
    type: 'POST',
    data: {
        csrf_token: csrfToken,
        // other data
    }
});
```

Or fetch fresh token:

```javascript
function refreshCsrfToken() {
    return $.get('/CSRF-Generate').then(function (data) {
        return data.csrf;
    });
}
```

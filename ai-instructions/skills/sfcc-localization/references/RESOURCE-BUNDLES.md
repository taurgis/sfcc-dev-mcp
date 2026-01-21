# Resource Bundles

Core patterns for localization in SFCC.

## Directory Structure

```
/cartridge
  /templates/resources
    account.properties
    checkout.properties
    /fr/account.properties
    /fr/checkout.properties
    /fr_CA/account.properties
```

## Property Format (UTF-8)

```properties
# Account (default)
account.title=My Account
account.greeting=Welcome back
account.logout=Sign Out
profile.firstName=First Name
profile.save=Save Changes
```

```properties
# Account (fr)
account.title=Mon compte
account.greeting=Bon retour
account.logout=Se déconnecter
profile.firstName=Prénom
profile.save=Enregistrer les modifications
```

## Using Resources in Templates

```html
<h1>${Resource.msg('account.title', 'account', null)}</h1>
<p>${Resource.msg('account.greeting', 'account', 'Welcome')}</p>
<p>${Resource.msgf('cart.itemCount', 'cart', null, itemCount)}</p>
```

`Resource.msg(key, bundle, default)` uses key if missing and default is null.

## Parameterized Messages

```properties
greeting.personalized=Hello, {0} {1}!
order.confirmation=Order #{0} placed on {1}
```

```html
${Resource.msgf('greeting.personalized', 'common', null, firstName, lastName)}
```

## Fallback Chain

`fr_CA` → `fr` → default bundle. Place language-wide values in the language folder, country-specific in the locale folder.

## Tips

- Organize bundles by page/feature (account, checkout), not by language.
- Keep keys descriptive: `account.profile.firstName` not `label1`.
- Avoid string concatenation; use parameters.
- Document context in comments for translators.

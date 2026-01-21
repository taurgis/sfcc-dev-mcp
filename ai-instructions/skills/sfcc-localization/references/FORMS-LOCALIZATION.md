# Forms Localization

## Form Definition

```xml
<form xmlns="http://www.demandware.com/xml/form/2008-04-19">
  <field formid="email" label="form.email.label" type="string"
         mandatory="true"
         missing-error="form.email.required"
         parse-error="form.email.invalid"/>
</form>
```

## Resource Bundles

```properties
# forms.properties
form.email.label=Email Address
form.email.required=Email is required
form.email.invalid=Please enter a valid email address
```

```properties
# forms_fr.properties
form.email.label=Adresse e-mail
form.email.required=L'email est requis
form.email.invalid=Veuillez entrer une adresse e-mail valide
```

## Guidelines

- Form labels/errors must use resource keys; never hardcode text in XML.
- Keep keys grouped by form for clarity.

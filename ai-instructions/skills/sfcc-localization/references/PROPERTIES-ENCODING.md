# Properties Encoding & Special Characters

## Escaping

```properties
message.welcome=It''s a great day!
error.cant=You can''t do that
message.multiline=Line one\nLine two\nLine three
store.name=Cafe1 du Nord
```

## UTF-8

Always save `.properties` files as UTF-8 to preserve non-ASCII characters.

```properties
button.close=Schließen
message.success=Réussi!
store.name=店舗名
```

## Tips

- Avoid `encoding="off"` unless data is trusted.
- Keep translator comments near the keys they describe.

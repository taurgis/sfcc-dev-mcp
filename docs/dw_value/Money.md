## Package: dw.value

# Class Money

## Inheritance Hierarchy

- Object
  - dw.value.Money

## Description

Represents money in Commerce Cloud Digital.

## Constants

### NOT_AVAILABLE

**Type:** Money

Represents that there is no money available.

## Properties

### available

**Type:** boolean (Read Only)

Identifies if the instance contains settings for value and currency.

### currencyCode

**Type:** String (Read Only)

The ISO 4217 currency mnemonic (such as 'USD', 'EUR') of the currency the
 money value relates to.

 Note a money instance may also describe a price that is 'not available'.
 In this case the value of this attribute is N/A.

### decimalValue

**Type:** Decimal (Read Only)

The money as Decimal, null is returned when the money is not available.

### value

**Type:** Number (Read Only)

The value of the money instance.

### valueOrNull

**Type:** Number (Read Only)

Return the value of the money instance or null if the
 Money instance is NOT_AVAILABLE.

## Constructor Summary

Money(value : Number, currencyCode : String) Constructs a new money instance with the specified amount for the specified currency.

## Method Summary

### add

**Signature:** `add(value : Money) : Money`

Returns a Money instance by adding the specified Money object to the current object.

### addPercent

**Signature:** `addPercent(percent : Number) : Money`

Adds a certain percentage to the money object.

### addRate

**Signature:** `addRate(value : Number) : Money`

Adds a rate (e.g.

### compareTo

**Signature:** `compareTo(other : Money) : Number`

Compares two Money values.

### divide

**Signature:** `divide(divisor : Number) : Money`

Divide Money object by specified divisor.

### equals

**Signature:** `equals(other : Object) : boolean`

Compares two money values whether they are equivalent.

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

Returns the ISO 4217 currency mnemonic (such as 'USD', 'EUR') of the currency the money value relates to.

### getDecimalValue

**Signature:** `getDecimalValue() : Decimal`

Returns the money as Decimal, null is returned when the money is not available.

### getValue

**Signature:** `getValue() : Number`

Returns the value of the money instance.

### getValueOrNull

**Signature:** `getValueOrNull() : Number`

Return the value of the money instance or null if the Money instance is NOT_AVAILABLE.

### hashCode

**Signature:** `hashCode() : Number`

Calculates the hash code for a money;

### isAvailable

**Signature:** `isAvailable() : boolean`

Identifies if the instance contains settings for value and currency.

### isOfSameCurrency

**Signature:** `isOfSameCurrency(value : Money) : boolean`

Identifies if two Money value have the same currency.

### multiply

**Signature:** `multiply(factor : Number) : Money`

Multiply Money object by specified factor.

### multiply

**Signature:** `multiply(quantity : Quantity) : Money`

Multiplies the Money object with the given quantity.

### newMoney

**Signature:** `newMoney(value : Decimal) : Money`

Method returns a new instance of Money with the same currency but different value.

### percentLessThan

**Signature:** `percentLessThan(value : Money) : Number`

Convenience method.

### percentOf

**Signature:** `percentOf(value : Money) : Number`

Convenience method.

### prorate

**Signature:** `static prorate(dist : Money, values : Money...) : Money[]`

Prorates the specified values using the specified discount.

### subtract

**Signature:** `subtract(value : Money) : Money`

Returns a new Money instance by substracting the specified Money object from the current object.

### subtractPercent

**Signature:** `subtractPercent(percent : Number) : Money`

Subtracts a certain percentage from the money object.

### subtractRate

**Signature:** `subtractRate(value : Number) : Money`

Subtracts a rate (e.g.

### toFormattedString

**Signature:** `toFormattedString() : String`

Returns a string representation of Money according to the regional settings configured for current request locale, for example '$59.00' or 'USD 59.00'.

### toNumberString

**Signature:** `toNumberString() : String`

Returns a string representation for the numeric value of this money.

### toString

**Signature:** `toString() : String`

Returns a string representation of this Money object.

### valueOf

**Signature:** `valueOf() : Object`

According to the ECMA spec returns the "natural" primitve value.

## Constructor Detail

## Method Detail

## Method Details

### add

**Signature:** `add(value : Money) : Money`

**Description:** Returns a Money instance by adding the specified Money object to the current object. Only objects representing the same currency can be added. If one of the Money values is N/A, the result is N/A.

**Parameters:**

- `value`: the Money object to add to this Money instance.

**Returns:**

the Money object representing the sum of the operands.

---

### addPercent

**Signature:** `addPercent(percent : Number) : Money`

**Description:** Adds a certain percentage to the money object. The percent value is given as true percent value, so for example 10 represent 10%. If this Money is N/A the result is also N/A.

**Parameters:**

- `percent`: the percent value

**Returns:**

new Money object with the result of the calculation

---

### addRate

**Signature:** `addRate(value : Number) : Money`

**Description:** Adds a rate (e.g. 0.05) to the money object. This is typically for example to add a tax rate.

**Parameters:**

- `value`: the rate to add.

**Returns:**

a new Money object with rate added.

---

### compareTo

**Signature:** `compareTo(other : Money) : Number`

**Description:** Compares two Money values. An exception is thrown if the two Money values are of different currency. If one of the Money values represents the N/A value it is treated as 0.0.

**Parameters:**

- `other`: the money instance to comare against this money instance.

**Returns:**

the comparison of 0 if the money instances are equal or non-0 if they are different.

---

### divide

**Signature:** `divide(divisor : Number) : Money`

**Description:** Divide Money object by specified divisor. If this Money is N/A the result is also N/A.

**Parameters:**

- `divisor`: the divisor.

**Returns:**

Money object representing division result

---

### equals

**Signature:** `equals(other : Object) : boolean`

**Description:** Compares two money values whether they are equivalent.

**Parameters:**

- `other`: the object to compare against this money instance.

**Returns:**

true if equal, false otherwise.

---

### getCurrencyCode

**Signature:** `getCurrencyCode() : String`

**Description:** Returns the ISO 4217 currency mnemonic (such as 'USD', 'EUR') of the currency the money value relates to. Note a money instance may also describe a price that is 'not available'. In this case the value of this attribute is N/A.

**Returns:**

the value of the currency code.

---

### getDecimalValue

**Signature:** `getDecimalValue() : Decimal`

**Description:** Returns the money as Decimal, null is returned when the money is not available.

**Returns:**

the money as Decimal

---

### getValue

**Signature:** `getValue() : Number`

**Description:** Returns the value of the money instance.

**Returns:**

the value of the money instance.

**See Also:**

getDecimalValue()

---

### getValueOrNull

**Signature:** `getValueOrNull() : Number`

**Description:** Return the value of the money instance or null if the Money instance is NOT_AVAILABLE.

**Returns:**

Value of money instance or null.

---

### hashCode

**Signature:** `hashCode() : Number`

**Description:** Calculates the hash code for a money;

---

### isAvailable

**Signature:** `isAvailable() : boolean`

**Description:** Identifies if the instance contains settings for value and currency.

**Returns:**

true if the instance is initialized with value and currency, false if the state is 'not available'.

---

### isOfSameCurrency

**Signature:** `isOfSameCurrency(value : Money) : boolean`

**Description:** Identifies if two Money value have the same currency.

**Parameters:**

- `value`: the Money value passed to be tested

**Returns:**

true if both instances have the same currency, false otherwise.

---

### multiply

**Signature:** `multiply(factor : Number) : Money`

**Description:** Multiply Money object by specified factor. If this Money is N/A the result is also N/A.

**Parameters:**

- `factor`: multiplication factor

**Returns:**

Money object representing multiplication result.

---

### multiply

**Signature:** `multiply(quantity : Quantity) : Money`

**Description:** Multiplies the Money object with the given quantity. If this Money is N/A the result is also N/A.

**Parameters:**

- `quantity`: the quantity to multiply the value by

**Returns:**

a new Money representing the multiplication result.

---

### newMoney

**Signature:** `newMoney(value : Decimal) : Money`

**Description:** Method returns a new instance of Money with the same currency but different value. An N/A instance is returned if value is null.

**Parameters:**

- `value`: as a decimal

**Returns:**

new Money instance with same currency

---

### percentLessThan

**Signature:** `percentLessThan(value : Money) : Number`

**Description:** Convenience method. Calculates and returns the percentage off this price represents in relation to the passed base price. The result is generally equal to 100.0 - this.percentOf(value). For example, if this value is $30 and the passed value is $50, then the return value will be 40.0, representing a 40% discount. This method will return null if the compare value is null, this value or the compare value is unavailable, or the compare value equals 0.0.

**Parameters:**

- `value`: The price to compare to this price

**Returns:**

The percentage discount this price represents in relation to the passed base price.

**See Also:**

percentOf(Money)

**Throws:**

IllegalArgumentException - If the currencies are not comparable.

---

### percentOf

**Signature:** `percentOf(value : Money) : Number`

**Description:** Convenience method. Calculates and returns the percentage of the passed value this price represents. For example, if this value is $30 and the passed value is $50, then the return value will be 60.0 (i.e. 60%). This method will return null if the compare value is null, this value or the compare value is unavailable, or the compare value equals 0.0.

**Parameters:**

- `value`: The price to compare to this price

**Returns:**

The percentage of the compare price this price represents, or null.

**Throws:**

IllegalArgumentException - If the currencies are not comparable.

---

### prorate

**Signature:** `static prorate(dist : Money, values : Money...) : Money[]`

**Description:** Prorates the specified values using the specified discount.

**Parameters:**

- `dist`: the proration discount.
- `values`: the values to prorate.

**Returns:**

the prorated values.

---

### subtract

**Signature:** `subtract(value : Money) : Money`

**Description:** Returns a new Money instance by substracting the specified Money object from the current object. Only objects representing the same currency can be subtracted. If one of the Money values is N/A, the result is N/A.

**Parameters:**

- `value`: the Money object to subtract

**Returns:**

the Money object representing the result of subtraction.

---

### subtractPercent

**Signature:** `subtractPercent(percent : Number) : Money`

**Description:** Subtracts a certain percentage from the money object. The percent value is given as true percent value, so for example 10 represent 10%. If this Money is N/A the result is also N/A.

**Parameters:**

- `percent`: the percent value

**Returns:**

new Money object with the result of the calculation

---

### subtractRate

**Signature:** `subtractRate(value : Number) : Money`

**Description:** Subtracts a rate (e.g. 0.05) from the money object. This is typically for example to subtract a tax rates.

**Parameters:**

- `value`: the rate to subtract.

**Returns:**

a new Money object with rate subtracted.

---

### toFormattedString

**Signature:** `toFormattedString() : String`

**Description:** Returns a string representation of Money according to the regional settings configured for current request locale, for example '$59.00' or 'USD 59.00'.

**Returns:**

The formatted String representation of the passed money. In case of an error the string 'N/A' is returned.

---

### toNumberString

**Signature:** `toNumberString() : String`

**Description:** Returns a string representation for the numeric value of this money. The number is formatted with the decimal symbols of the platforms default locale.

**Returns:**

a string representation for the numeric value of this money.

---

### toString

**Signature:** `toString() : String`

**Description:** Returns a string representation of this Money object.

**Returns:**

a string representation of this Money object.

---

### valueOf

**Signature:** `valueOf() : Object`

**Description:** According to the ECMA spec returns the "natural" primitve value. Here the value portion of the Money is returned.

---
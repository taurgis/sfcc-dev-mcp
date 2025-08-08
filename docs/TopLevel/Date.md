## Package: TopLevel

# Class Date

## Inheritance Hierarchy

- Object
  - Date

## Description

A Date object contains a number indicating a particular instant in time to within a millisecond. The number may also be NaN, indicating that the Date object does not represent a specific instant of time.

## Constructor Summary

Date() Constructs the Date instance using the current date and time.

Date(millis : Number) Constructs the Date instance using the specified milliseconds.

Date(year : Number, month : Number, args : Number...) Constructs the Date instance using the specified year and month.

Date(dateString : String) Constructs the Date instance by parsing the specified String.

## Method Summary

### getDate

**Signature:** `getDate() : Number`

Returns the day of the month where the value is a Number from 1 to 31.

### getDay

**Signature:** `getDay() : Number`

Returns the day of the week where the value is a Number from 0 to 6.

### getFullYear

**Signature:** `getFullYear() : Number`

Returns the year of the Date in four-digit format.

### getHours

**Signature:** `getHours() : Number`

Return the hours field of the Date where the value is a Number from 0 (midnight) to 23 (11 PM).

### getMilliseconds

**Signature:** `getMilliseconds() : Number`

Returns the milliseconds field of the Date.

### getMinutes

**Signature:** `getMinutes() : Number`

Return the minutes field of the Date where the value is a Number from 0 to 59.

### getMonth

**Signature:** `getMonth() : Number`

Returns the month of the year as a value between 0 and 11.

### getSeconds

**Signature:** `getSeconds() : Number`

Return the seconds field of the Date where the value is a Number from 0 to 59.

### getTime

**Signature:** `getTime() : Number`

Returns the internal, millisecond representation of the Date object.

### getTimezoneOffset

**Signature:** `getTimezoneOffset() : Number`

Returns the difference between local time and Greenwich Mean Time (GMT) in minutes.

### getUTCDate

**Signature:** `getUTCDate() : Number`

Returns the day of the month where the value is a Number from 1 to 31 when date is expressed in universal time.

### getUTCDay

**Signature:** `getUTCDay() : Number`

Returns the day of the week where the value is a Number from 0 to 6 when date is expressed in universal time.

### getUTCFullYear

**Signature:** `getUTCFullYear() : Number`

Returns the year when the Date is expressed in universal time.

### getUTCHours

**Signature:** `getUTCHours() : Number`

Return the hours field, expressed in universal time, of the Date where the value is a Number from 0 (midnight) to 23 (11 PM).

### getUTCMilliseconds

**Signature:** `getUTCMilliseconds() : Number`

Returns the milliseconds field, expressed in universal time, of the Date.

### getUTCMinutes

**Signature:** `getUTCMinutes() : Number`

Return the minutes field, expressed in universal time, of the Date where the value is a Number from 0 to 59.

### getUTCMonth

**Signature:** `getUTCMonth() : Number`

Returns the month of the year that results when the Date is expressed in universal time.

### getUTCSeconds

**Signature:** `getUTCSeconds() : Number`

Return the seconds field, expressed in universal time, of the Date where the value is a Number from 0 to 59.

### now

**Signature:** `static now() : Number`

Returns the number of milliseconds since midnight of January 1, 1970 up until now.

### parse

**Signature:** `static parse(dateString : String) : Number`

Takes a date string and returns the number of milliseconds since midnight of January 1, 1970.

### setDate

**Signature:** `setDate(date : Number) : Number`

Sets the day of the month where the value is a Number from 1 to 31.

### setFullYear

**Signature:** `setFullYear(year : Number, args : Number...) : Number`

Sets the full year of Date where the value must be a four-digit Number.

### setHours

**Signature:** `setHours(hours : Number, args : Number...) : Number`

Sets the hours field of this Date instance.

### setMilliseconds

**Signature:** `setMilliseconds(millis : Number) : Number`

Sets the milliseconds field of this Date instance.

### setMinutes

**Signature:** `setMinutes(minutes : Number, args : Number...) : Number`

Sets the minutes field of this Date instance.

### setMonth

**Signature:** `setMonth(month : Number, date : Number...) : Number`

Sets the month of the year where the value is a Number from 0 to 11.

### setSeconds

**Signature:** `setSeconds(seconds : Number, millis : Number...) : Number`

Sets the seconds field of this Date instance.

### setTime

**Signature:** `setTime(millis : Number) : Number`

Sets the number of milliseconds between the desired date and time and January 1, 1970.

### setUTCDate

**Signature:** `setUTCDate(date : Number) : Number`

Sets the day of the month, expressed in universal time, where the value is a Number from 1 to 31.

### setUTCFullYear

**Signature:** `setUTCFullYear(year : Number, args : Number...) : Number`

Sets the full year, expressed in universal time, of Date where the value must be a four-digit Number.

### setUTCHours

**Signature:** `setUTCHours(hours : Number, args : Number...) : Number`

Sets the hours field, expressed in universal time, of this Date instance.

### setUTCMilliseconds

**Signature:** `setUTCMilliseconds(millis : Number) : Number`

Sets the milliseconds field, expressed in universal time, of this Date instance.

### setUTCMinutes

**Signature:** `setUTCMinutes(minutes : Number, args : Number...) : Number`

Sets the minutes field, expressed in universal time, of this Date instance.

### setUTCMonth

**Signature:** `setUTCMonth(month : Number, date : Number...) : Number`

Sets the month of the year, expressed in universal time, where the value is a Number from 0 to 11.

### setUTCSeconds

**Signature:** `setUTCSeconds(seconds : Number, millis : Number...) : Number`

Sets the seconds field, expressed in universal time, of this Date instance.

### toDateString

**Signature:** `toDateString() : String`

Returns the Date as a String value where the value represents the date portion of the Date in the default locale (en_US).

### toISOString

**Signature:** `toISOString() : String`

This function returns a string value represent the instance in time represented by this Date object.

### toJSON

**Signature:** `toJSON(key : String) : Object`

This function returns the same string as Date.prototype.toISOString().

### toLocaleDateString

**Signature:** `toLocaleDateString() : String`

Returns the Date as a String value where the value represents the date portion of the Date in the default locale (en_US).

### toLocaleString

**Signature:** `toLocaleString() : String`

Returns the Date as a String using the default locale (en_US).

### toLocaleTimeString

**Signature:** `toLocaleTimeString() : String`

Returns the Date as a String value where the value represents the time portion of the Date in the default locale (en_US).

### toTimeString

**Signature:** `toTimeString() : String`

Returns the Date as a String value where the value represents the time portion of the Date in the default locale (en_US).

### toUTCString

**Signature:** `toUTCString() : String`

Returns a String representation of this Date, expressed in universal time.

### UTC

**Signature:** `static UTC(year : Number, month : Number, args : Number...) : Number`

Returns the number of milliseconds since midnight of January 1, 1970 according to universal time.

### valueOf

**Signature:** `valueOf() : Object`

Returns the value of this Date represented in milliseconds.

## Constructor Detail

## Method Detail

## Method Details

### getDate

**Signature:** `getDate() : Number`

**Description:** Returns the day of the month where the value is a Number from 1 to 31.

**Returns:**

the day of the month where the value is a Number from 1 to 31.

---

### getDay

**Signature:** `getDay() : Number`

**Description:** Returns the day of the week where the value is a Number from 0 to 6.

**Returns:**

the day of the month where the value is a Number from 0 to 6.

---

### getFullYear

**Signature:** `getFullYear() : Number`

**Description:** Returns the year of the Date in four-digit format.

**Returns:**

the year of the Date in four-digit format.

---

### getHours

**Signature:** `getHours() : Number`

**Description:** Return the hours field of the Date where the value is a Number from 0 (midnight) to 23 (11 PM).

**Returns:**

the hours field of the Date where the value is a Number from 0 (midnight) to 23 (11 PM).

---

### getMilliseconds

**Signature:** `getMilliseconds() : Number`

**Description:** Returns the milliseconds field of the Date.

**Returns:**

the milliseconds field of the Date.

---

### getMinutes

**Signature:** `getMinutes() : Number`

**Description:** Return the minutes field of the Date where the value is a Number from 0 to 59.

**Returns:**

the minutes field of the Date where the value is a Number from 0 to 59.

---

### getMonth

**Signature:** `getMonth() : Number`

**Description:** Returns the month of the year as a value between 0 and 11.

**Returns:**

the month of the year as a value between 0 and 11.

---

### getSeconds

**Signature:** `getSeconds() : Number`

**Description:** Return the seconds field of the Date where the value is a Number from 0 to 59.

**Returns:**

the seconds field of the Date where the value is a Number from 0 to 59.

---

### getTime

**Signature:** `getTime() : Number`

**Description:** Returns the internal, millisecond representation of the Date object. This value is independent of time zone.

**Returns:**

the internal, millisecond representation of the Date object.

---

### getTimezoneOffset

**Signature:** `getTimezoneOffset() : Number`

**Description:** Returns the difference between local time and Greenwich Mean Time (GMT) in minutes.

**Returns:**

the difference between local time and Greenwich Mean Time (GMT) in minutes.

---

### getUTCDate

**Signature:** `getUTCDate() : Number`

**Description:** Returns the day of the month where the value is a Number from 1 to 31 when date is expressed in universal time.

**Returns:**

the day of the month where the value is a Number from 1 to 31 when date is expressed in universal time.

---

### getUTCDay

**Signature:** `getUTCDay() : Number`

**Description:** Returns the day of the week where the value is a Number from 0 to 6 when date is expressed in universal time.

**Returns:**

the day of the week where the value is a Number from 0 to 6 when date is expressed in universal time.

---

### getUTCFullYear

**Signature:** `getUTCFullYear() : Number`

**Description:** Returns the year when the Date is expressed in universal time. The return value is a four-digit format.

**Returns:**

the year of the Date in four-digit form.

---

### getUTCHours

**Signature:** `getUTCHours() : Number`

**Description:** Return the hours field, expressed in universal time, of the Date where the value is a Number from 0 (midnight) to 23 (11 PM).

**Returns:**

the hours field, expressed in universal time, of the Date where the value is a Number from 0 (midnight) to 23 (11 PM).

---

### getUTCMilliseconds

**Signature:** `getUTCMilliseconds() : Number`

**Description:** Returns the milliseconds field, expressed in universal time, of the Date.

**Returns:**

the milliseconds field, expressed in universal time, of the Date.

---

### getUTCMinutes

**Signature:** `getUTCMinutes() : Number`

**Description:** Return the minutes field, expressed in universal time, of the Date where the value is a Number from 0 to 59.

**Returns:**

the minutes field, expressed in universal time, of the Date where the value is a Number from 0 to 59.

---

### getUTCMonth

**Signature:** `getUTCMonth() : Number`

**Description:** Returns the month of the year that results when the Date is expressed in universal time. The return value is a Number betwee 0 and 11.

**Returns:**

the month of the year as a value between 0 and 11.

---

### getUTCSeconds

**Signature:** `getUTCSeconds() : Number`

**Description:** Return the seconds field, expressed in universal time, of the Date where the value is a Number from 0 to 59.

**Returns:**

the seconds field, expressed in universal time, of the Date where the value is a Number from 0 to 59.

---

### now

**Signature:** `static now() : Number`

**Description:** Returns the number of milliseconds since midnight of January 1, 1970 up until now.

**Returns:**

the number of milliseconds since midnight of January 1, 1970.

---

### parse

**Signature:** `static parse(dateString : String) : Number`

**Description:** Takes a date string and returns the number of milliseconds since midnight of January 1, 1970. Supports: RFC2822 date strings strings matching the exact ISO 8601 format 'YYYY-MM-DDTHH:mm:ss.sssZ'

**Parameters:**

- `dateString`: represents a Date in a valid date format.

**Returns:**

the number of milliseconds since midnight of January 1, 1970 or NaN if no date could be recognized.

---

### setDate

**Signature:** `setDate(date : Number) : Number`

**Description:** Sets the day of the month where the value is a Number from 1 to 31.

**Parameters:**

- `date`: the day of the month.

**Returns:**

the millisecond representation of the adjusted date.

---

### setFullYear

**Signature:** `setFullYear(year : Number, args : Number...) : Number`

**Description:** Sets the full year of Date where the value must be a four-digit Number. Optionally, you can set the month and date.

**Parameters:**

- `year`: the year as a four-digit Number.
- `args`: the month and day of the month.

**Returns:**

the millisecond representation of the adjusted date.

---

### setHours

**Signature:** `setHours(hours : Number, args : Number...) : Number`

**Description:** Sets the hours field of this Date instance. The minutes value should be a Number from 0 to 23. Optionally, hours, seconds and milliseconds can also be provided.

**Parameters:**

- `hours`: the minutes field of this Date instance.
- `args`: the hours, seconds and milliseconds values for this Date instance.

**Returns:**

the millisecond representation of the adjusted date.

---

### setMilliseconds

**Signature:** `setMilliseconds(millis : Number) : Number`

**Description:** Sets the milliseconds field of this Date instance.

**Parameters:**

- `millis`: the milliseconds field of this Date instance.

**Returns:**

the millisecond representation of the adjusted date.

---

### setMinutes

**Signature:** `setMinutes(minutes : Number, args : Number...) : Number`

**Description:** Sets the minutes field of this Date instance. The minutes value should be a Number from 0 to 59. Optionally, seconds and milliseconds can also be provided.

**Parameters:**

- `minutes`: the minutes field of this Date instance.
- `args`: the seconds and milliseconds value for this Date instance.

**Returns:**

the millisecond representation of the adjusted date.

---

### setMonth

**Signature:** `setMonth(month : Number, date : Number...) : Number`

**Description:** Sets the month of the year where the value is a Number from 0 to 11. Optionally, you can set the day of the month.

**Parameters:**

- `month`: the month of the year.
- `date`: the day of the month.

**Returns:**

the millisecond representation of the adjusted date.

---

### setSeconds

**Signature:** `setSeconds(seconds : Number, millis : Number...) : Number`

**Description:** Sets the seconds field of this Date instance. The seconds value should be a Number from 0 to 59. Optionally, milliseconds can also be provided.

**Parameters:**

- `seconds`: the seconds field of this Date instance.
- `millis`: the milliseconds field of this Date instance.

**Returns:**

the millisecond representation of the adjusted date.

---

### setTime

**Signature:** `setTime(millis : Number) : Number`

**Description:** Sets the number of milliseconds between the desired date and time and January 1, 1970.

**Parameters:**

- `millis`: the number of milliseconds between the desired date and time and January 1, 1970.

**Returns:**

the millisecond representation of the adjusted date.

---

### setUTCDate

**Signature:** `setUTCDate(date : Number) : Number`

**Description:** Sets the day of the month, expressed in universal time, where the value is a Number from 1 to 31.

**Parameters:**

- `date`: the day of the month, expressed in universal time.

**Returns:**

the millisecond representation of the adjusted date.

---

### setUTCFullYear

**Signature:** `setUTCFullYear(year : Number, args : Number...) : Number`

**Description:** Sets the full year, expressed in universal time, of Date where the value must be a four-digit Number. Optionally, you can set the month and date.

**Parameters:**

- `year`: the year as a four-digit Number, expressed in universal time.
- `args`: the month and day of the month.

**Returns:**

the millisecond representation of the adjusted date.

---

### setUTCHours

**Signature:** `setUTCHours(hours : Number, args : Number...) : Number`

**Description:** Sets the hours field, expressed in universal time, of this Date instance. The minutes value should be a Number from 0 to 23. Optionally, seconds and milliseconds can also be provided.

**Parameters:**

- `hours`: the minutes field, expressed in universal time, of this Date instance.
- `args`: the seconds and milliseconds value, expressed in universal time, for this Date instance.

**Returns:**

the millisecond representation of the adjusted date.

---

### setUTCMilliseconds

**Signature:** `setUTCMilliseconds(millis : Number) : Number`

**Description:** Sets the milliseconds field, expressed in universal time, of this Date instance.

**Parameters:**

- `millis`: the milliseconds field, expressed in universal time, of this Date instance.

**Returns:**

the millisecond representation of the adjusted date.

---

### setUTCMinutes

**Signature:** `setUTCMinutes(minutes : Number, args : Number...) : Number`

**Description:** Sets the minutes field, expressed in universal time, of this Date instance. The minutes value should be a Number from 0 to 59. Optionally, seconds and milliseconds can also be provided.

**Parameters:**

- `minutes`: the minutes field, expressed in universal time, of this Date instance.
- `args`: the seconds and milliseconds values, expressed in universal time, for this Date instance.

**Returns:**

the millisecond representation of the adjusted date.

---

### setUTCMonth

**Signature:** `setUTCMonth(month : Number, date : Number...) : Number`

**Description:** Sets the month of the year, expressed in universal time, where the value is a Number from 0 to 11. Optionally, you can set the day of the month.

**Parameters:**

- `month`: the month of the year, expressed in universal time.
- `date`: the day of the month.

**Returns:**

the millisecond representation of the adjusted date.

---

### setUTCSeconds

**Signature:** `setUTCSeconds(seconds : Number, millis : Number...) : Number`

**Description:** Sets the seconds field, expressed in universal time, of this Date instance. The seconds value should be a Number from 0 to 59. Optionally, milliseconds can also be provided.

**Parameters:**

- `seconds`: the seconds field, expressed in universal time, of this Date instance.
- `millis`: the milliseconds field, expressed in universal time, of this Date instance.

**Returns:**

the millisecond representation of the adjusted date.

---

### toDateString

**Signature:** `toDateString() : String`

**Description:** Returns the Date as a String value where the value represents the date portion of the Date in the default locale (en_US). To format a calendar object in an alternate format use the dw.util.StringUtils.formatCalendar() functions instead.

**Returns:**

the Date as a String value.

---

### toISOString

**Signature:** `toISOString() : String`

**Description:** This function returns a string value represent the instance in time represented by this Date object. The date is formatted with the Simplified ISO 8601 format as follows: YYYY-MM-DDTHH:mm:ss.sssTZ. The time zone is always UTC, denoted by the suffix Z.

**Returns:**

string representation of this date

---

### toJSON

**Signature:** `toJSON(key : String) : Object`

**Description:** This function returns the same string as Date.prototype.toISOString(). The method is called when a Date object is stringified.

**Parameters:**

- `key`: the name of the key, which is stringified

**Returns:**

JSON string representation of this date

---

### toLocaleDateString

**Signature:** `toLocaleDateString() : String`

**Description:** Returns the Date as a String value where the value represents the date portion of the Date in the default locale (en_US). To format a calendar object in an alternate format use the dw.util.StringUtils.formatCalendar() functions instead.

**Returns:**

returns the date portion of the Date as a String.

---

### toLocaleString

**Signature:** `toLocaleString() : String`

**Description:** Returns the Date as a String using the default locale (en_US). To format a calendar object in an alternate format use the dw.util.StringUtils.formatCalendar() functions instead.

**Returns:**

the Date as a String using the default locale en_US

---

### toLocaleTimeString

**Signature:** `toLocaleTimeString() : String`

**Description:** Returns the Date as a String value where the value represents the time portion of the Date in the default locale (en_US). To format a calendar object in an alternate format use the dw.util.StringUtils.formatCalendar() functions instead.

**Returns:**

returns the time time's portion of the Date as a String.

---

### toTimeString

**Signature:** `toTimeString() : String`

**Description:** Returns the Date as a String value where the value represents the time portion of the Date in the default locale (en_US). To format a calendar object in an alternate format use the dw.util.StringUtils.formatCalendar() functions instead.

**Returns:**

the Date's time.

---

### toUTCString

**Signature:** `toUTCString() : String`

**Description:** Returns a String representation of this Date, expressed in universal time.

**Returns:**

a String representation of this Date, expressed in universal time.

---

### UTC

**Signature:** `static UTC(year : Number, month : Number, args : Number...) : Number`

**Description:** Returns the number of milliseconds since midnight of January 1, 1970 according to universal time. Optionally, you can pass up to five additional arguments representing date, hours, minutes, seconds, and milliseconds.

**Parameters:**

- `year`: a number representing the year.
- `month`: a number representing the month.
- `args`: a set of numbers representing the date, hours, minutes, seconds, and milliseconds.

**Returns:**

the number of milliseconds since midnight of January 1, 1970 according to universal time.

---

### valueOf

**Signature:** `valueOf() : Object`

**Description:** Returns the value of this Date represented in milliseconds.

**Returns:**

the value of this Date represented in milliseconds.

---
## Package: dw.util

# Class Calendar

## Inheritance Hierarchy

- Object
  - dw.util.Calendar

## Description

Represents a Calendar and is based on the java.util.Calendar class. Refer to the java.util.Calendar documentation for more information. IMPORTANT NOTE: Please use the StringUtils.formatCalendar(Calendar) functions to convert a Calendar object into a String.

## Constants

### AM_PM

**Type:** Number = 9

Indicates whether the HOUR is before or after noon.

### APRIL

**Type:** Number = 3

Value for the month of year field representing April.

### AUGUST

**Type:** Number = 7

Value for the month of year field representing August.

### DATE

**Type:** Number = 5

Represents a date.

### DAY_OF_MONTH

**Type:** Number = 5

Represents a day of the month.

### DAY_OF_WEEK

**Type:** Number = 7

Represents a day of the week.

### DAY_OF_WEEK_IN_MONTH

**Type:** Number = 8

Represents a day of the week in a month.

### DAY_OF_YEAR

**Type:** Number = 6

Represents a day of the year.

### DECEMBER

**Type:** Number = 11

Value for the month of year field representing December.

### DST_OFFSET

**Type:** Number = 16

Indicates the daylight savings offset in milliseconds.

### ERA

**Type:** Number = 0

Indicates the era such as 'AD' or 'BC' in the Julian calendar.

### FEBRUARY

**Type:** Number = 1

Value for the month of year field representing February.

### FRIDAY

**Type:** Number = 6

Value for the day of the week field representing Friday.

### HOUR

**Type:** Number = 10

Represents an hour.

### HOUR_OF_DAY

**Type:** Number = 11

Represents an hour of the day.

### INPUT_DATE_PATTERN

**Type:** Number = 3

The input date pattern, for instance MM/dd/yyyy

### INPUT_DATE_TIME_PATTERN

**Type:** Number = 5

The input date time pattern, for instance MM/dd/yyyy h:mm a

### INPUT_TIME_PATTERN

**Type:** Number = 4

The input time pattern, for instance h:mm a

### JANUARY

**Type:** Number = 0

Value for the month of year field representing January.

### JULY

**Type:** Number = 6

Value for the month of year field representing July.

### JUNE

**Type:** Number = 5

Value for the month of year field representing June.

### LONG_DATE_PATTERN

**Type:** Number = 1

The long date pattern, for instance MMM/d/yyyy

### MARCH

**Type:** Number = 2

Value for the month of year field representing March.

### MAY

**Type:** Number = 4

Value for the month of year field representing May.

### MILLISECOND

**Type:** Number = 14

Represents a millisecond.

### MINUTE

**Type:** Number = 12

Represents a minute.

### MONDAY

**Type:** Number = 2

Value for the day of the week field representing Monday.

### MONTH

**Type:** Number = 2

Represents a month where the first month of the year is 0.

### NOVEMBER

**Type:** Number = 10

Value for the month of year field representing November.

### OCTOBER

**Type:** Number = 9

Value for the month of year field representing October.

### SATURDAY

**Type:** Number = 7

Value for the day of the week field representing Saturday.

### SECOND

**Type:** Number = 13

Represents a second.

### SEPTEMBER

**Type:** Number = 8

Value for the month of year field representing September.

### SHORT_DATE_PATTERN

**Type:** Number = 0

The short date pattern, for instance M/d/yy

### SUNDAY

**Type:** Number = 1

Value for the day of the week field representing Sunday.

### THURSDAY

**Type:** Number = 5

Value for the day of the week field representing Thursday.

### TIME_PATTERN

**Type:** Number = 2

The time pattern, for instance h:mm:ss a

### TUESDAY

**Type:** Number = 3

Value for the day of the week field representing Tuesday.

### WEDNESDAY

**Type:** Number = 4

Value for the day of the week field representing Wednesday.

### WEEK_OF_MONTH

**Type:** Number = 4

Represents a week of the month.

### WEEK_OF_YEAR

**Type:** Number = 3

Represents a week in the year.

### YEAR

**Type:** Number = 1

Represents a year.

### ZONE_OFFSET

**Type:** Number = 15

Indicates the raw offset from GMT in milliseconds.

## Properties

### firstDayOfWeek

**Type:** Number

The first day of the week base on locale context. For example, in the US
 the first day of the week is SUNDAY. However, in France the
 first day of the week is MONDAY.

### time

**Type:** Date

The current time stamp of this calendar. This method
 is also used to convert a Calendar into a Date.
 
 WARNING: Keep in mind that the returned Date object's time is always
          interpreted in the time zone GMT. This means time zone information
          set at the calendar object will not be honored and gets lost.

### timeZone

**Type:** String

The current time zone of this calendar.

## Constructor Summary

Calendar() Creates a new Calendar object that is set to the current time.

Calendar(date : Date) Creates a new Calendar object for the given Date object.

## Method Summary

### add

**Signature:** `add(field : Number, value : Number) : void`

Adds or subtracts the specified amount of time to the given calendar field, based on the calendar's rules.

### after

**Signature:** `after(obj : Object) : boolean`

Indicates if this Calendar represents a time after the time represented by the specified Object.

### before

**Signature:** `before(obj : Object) : boolean`

Indicates if this Calendar represents a time before the time represented by the specified Object.

### clear

**Signature:** `clear() : void`

Sets all the calendar field values and the time value (millisecond offset from the Epoch) of this Calendar undefined.

### clear

**Signature:** `clear(field : Number) : void`

Sets the given calendar field value and the time value (millisecond offset from the Epoch) of this Calendar undefined.

### compareTo

**Signature:** `compareTo(anotherCalendar : Calendar) : Number`

Compares the time values (millisecond offsets from the Epoch) represented by two Calendar objects.

### equals

**Signature:** `equals(other : Object) : boolean`

Compares two calendar values whether they are equivalent.

### get

**Signature:** `get(field : Number) : Number`

Returns the value of the given calendar field.

### getActualMaximum

**Signature:** `getActualMaximum(field : Number) : Number`

Returns the maximum value that the specified calendar field could have.

### getActualMinimum

**Signature:** `getActualMinimum(field : Number) : Number`

Returns the minimum value that the specified calendar field could have.

### getFirstDayOfWeek

**Signature:** `getFirstDayOfWeek() : Number`

Returns the first day of the week base on locale context.

### getMaximum

**Signature:** `getMaximum(field : Number) : Number`

Returns the maximum value for the given calendar field.

### getMinimum

**Signature:** `getMinimum(field : Number) : Number`

Returns the minimum value for the given calendar field.

### getTime

**Signature:** `getTime() : Date`

Returns the current time stamp of this calendar.

### getTimeZone

**Signature:** `getTimeZone() : String`

Returns the current time zone of this calendar.

### hashCode

**Signature:** `hashCode() : Number`

Calculates the hash code for a calendar;

### isLeapYear

**Signature:** `isLeapYear(year : Number) : boolean`

Indicates if the specified year is a leap year.

### isSameDay

**Signature:** `isSameDay(other : Calendar) : boolean`

Checks, whether two calendar dates fall on the same day.

### isSameDayByTimestamp

**Signature:** `isSameDayByTimestamp(other : Calendar) : boolean`

Checks, whether two calendar dates fall on the same day.

### isSet

**Signature:** `isSet(field : Number) : boolean`

Indicates if the field is set.

### parseByFormat

**Signature:** `parseByFormat(timeString : String, format : String) : void`

Parses the string according to the date and time format pattern and set the time at this calendar object.

### parseByLocale

**Signature:** `parseByLocale(timeString : String, locale : String, pattern : Number) : void`

Parses the string according the date format pattern of the given locale.

### roll

**Signature:** `roll(field : Number, up : boolean) : void`

Rolls the specified field up or down one value.

### roll

**Signature:** `roll(field : Number, amount : Number) : void`

Rolls the specified field using the specified value.

### set

**Signature:** `set(field : Number, value : Number) : void`

Sets the given calendar field to the given value.

### set

**Signature:** `set(year : Number, month : Number, date : Number) : void`

Sets the values for the calendar fields YEAR, MONTH, and DAY_OF_MONTH.

### set

**Signature:** `set(year : Number, month : Number, date : Number, hourOfDay : Number, minute : Number) : void`

Sets the values for the calendar fields YEAR, MONTH, DAY_OF_MONTH, HOUR_OF_DAY, and MINUTE.

### set

**Signature:** `set(year : Number, month : Number, date : Number, hourOfDay : Number, minute : Number, second : Number) : void`

Sets the values for the calendar fields YEAR, MONTH, DAY_OF_MONTH, HOUR_OF_DAY, MINUTE and SECOND.

### setFirstDayOfWeek

**Signature:** `setFirstDayOfWeek(value : Number) : void`

Sets what the first day of the week is.

### setTime

**Signature:** `setTime(date : Date) : void`

Sets the current time stamp of this calendar. WARNING: Keep in mind that the set Date object's time is always interpreted in the time zone GMT.

### setTimeZone

**Signature:** `setTimeZone(timeZone : String) : void`

Sets the current time zone of this calendar. WARNING: Keep in mind that the time stamp represented by the calendar is always interpreted in the time zone GMT.

## Constructor Detail

## Method Detail

## Method Details

### add

**Signature:** `add(field : Number, value : Number) : void`

**Description:** Adds or subtracts the specified amount of time to the given calendar field, based on the calendar's rules.

**Parameters:**

- `field`: the calendar field.
- `value`: the amount of date or time to be added to the field

---

### after

**Signature:** `after(obj : Object) : boolean`

**Description:** Indicates if this Calendar represents a time after the time represented by the specified Object.

**Parameters:**

- `obj`: the object to test.

**Returns:**

true if this Calendar represents a time after the time represented by the specified Object, false otherwise.

---

### before

**Signature:** `before(obj : Object) : boolean`

**Description:** Indicates if this Calendar represents a time before the time represented by the specified Object.

**Parameters:**

- `obj`: the object to test.

**Returns:**

true if this Calendar represents a time before the time represented by the specified Object, false otherwise.

---

### clear

**Signature:** `clear() : void`

**Description:** Sets all the calendar field values and the time value (millisecond offset from the Epoch) of this Calendar undefined.

---

### clear

**Signature:** `clear(field : Number) : void`

**Description:** Sets the given calendar field value and the time value (millisecond offset from the Epoch) of this Calendar undefined.

**Parameters:**

- `field`: the calendar field to be cleared.

---

### compareTo

**Signature:** `compareTo(anotherCalendar : Calendar) : Number`

**Description:** Compares the time values (millisecond offsets from the Epoch) represented by two Calendar objects.

**Parameters:**

- `anotherCalendar`: the Calendar to be compared.

**Returns:**

the value 0 if the time represented by the argument is equal to the time represented by this Calendar; a value less than 0 if the time of this Calendar is before the time represented by the argument; and a value greater than 0 if the time of this Calendar is after the time represented by the argument.

---

### equals

**Signature:** `equals(other : Object) : boolean`

**Description:** Compares two calendar values whether they are equivalent.

**Parameters:**

- `other`: the object to compare against this calendar.

---

### get

**Signature:** `get(field : Number) : Number`

**Description:** Returns the value of the given calendar field.

**Parameters:**

- `field`: the calendar field to retrieve.

**Returns:**

the value for the given calendar field.

---

### getActualMaximum

**Signature:** `getActualMaximum(field : Number) : Number`

**Description:** Returns the maximum value that the specified calendar field could have.

**Parameters:**

- `field`: the calendar field.

**Returns:**

the maximum value that the specified calendar field could have.

---

### getActualMinimum

**Signature:** `getActualMinimum(field : Number) : Number`

**Description:** Returns the minimum value that the specified calendar field could have.

**Parameters:**

- `field`: the calendar field.

**Returns:**

the minimum value that the specified calendar field could have.

---

### getFirstDayOfWeek

**Signature:** `getFirstDayOfWeek() : Number`

**Description:** Returns the first day of the week base on locale context. For example, in the US the first day of the week is SUNDAY. However, in France the first day of the week is MONDAY.

**Returns:**

the first day of the week base on locale context. For example, in the US the first day of the week is SUNDAY. However, in France the first day of the week is MONDAY.

---

### getMaximum

**Signature:** `getMaximum(field : Number) : Number`

**Description:** Returns the maximum value for the given calendar field.

**Parameters:**

- `field`: the calendar field.

**Returns:**

the maximum value for the given calendar field.

---

### getMinimum

**Signature:** `getMinimum(field : Number) : Number`

**Description:** Returns the minimum value for the given calendar field.

**Parameters:**

- `field`: the calendar field.

**Returns:**

the minimum value for the given calendar field.

---

### getTime

**Signature:** `getTime() : Date`

**Description:** Returns the current time stamp of this calendar. This method is also used to convert a Calendar into a Date. WARNING: Keep in mind that the returned Date object's time is always interpreted in the time zone GMT. This means time zone information set at the calendar object will not be honored and gets lost.

**Returns:**

the current time stamp of this calendar as a Date.

---

### getTimeZone

**Signature:** `getTimeZone() : String`

**Description:** Returns the current time zone of this calendar.

**Returns:**

the current time zone of this calendar.

---

### hashCode

**Signature:** `hashCode() : Number`

**Description:** Calculates the hash code for a calendar;

---

### isLeapYear

**Signature:** `isLeapYear(year : Number) : boolean`

**Description:** Indicates if the specified year is a leap year.

**Parameters:**

- `year`: the year to test.

**Returns:**

true if the specified year is a leap year.

---

### isSameDay

**Signature:** `isSameDay(other : Calendar) : boolean`

**Description:** Checks, whether two calendar dates fall on the same day. The method performs comparison based on both calendar's field values by honoring the defined time zones. Examples: new Calendar( new Date( "2002/02/28 13:45" ).isSameDay( new Calendar( new Date( "2002/02/28 06:01" ) ) ); would return true. new Calendar( new Date( "2002/02/28 13:45" ).isSameDay( new Calendar( new Date( "2002/02/12 13:45" ) ) ); would return false. new Calendar( new Date( "2002/02/28 13:45" ).isSameDay( new Calendar( new Date( "1970/02/28 13:45" ) ) ); would return false. var cal1 = new Calendar( new Date( "2002/02/28 02:00" ); cal1.setTimeZone( "Etc/GMT+1" ); var cal2 = new Calendar( new Date( "2002/02/28 00:00" ); cal2.setTimeZone( "Etc/GMT+1" ); cal1.isSameDay( cal2 ); would return false since the time zone is applied first which results in comparing 2002/02/28 01:00 for cal1 with 2002/02/27 23:00 for cal2.

**Parameters:**

- `other`: the calendar to compare against this calendar.

---

### isSameDayByTimestamp

**Signature:** `isSameDayByTimestamp(other : Calendar) : boolean`

**Description:** Checks, whether two calendar dates fall on the same day. The method performs comparison based on both calendar's time stamps by ignoring any defined time zones. Examples: new Calendar( new Date( "2002/02/28 13:45" ).isSameDayByTimestamp( new Calendar( new Date( "2002/02/28 06:01" ) ) ); would return true. new Calendar( new Date( "2002/02/28 13:45" ).isSameDayByTimestamp( new Calendar( new Date( "2002/02/12 13:45" ) ) ); would return false. new Calendar( new Date( "2002/02/28 13:45" ).isSameDayByTimestamp( new Calendar( new Date( "1970/02/28 13:45" ) ) ); would return false. var cal1 = new Calendar( new Date( "2002/02/28 02:00" ); cal1.setTimeZone( "Etc/GMT+1" ); var cal2 = new Calendar( new Date( "2002/02/28 00:00" ); cal2.setTimeZone( "Etc/GMT+1" ); cal1.isSameDayByTimestamp( cal2 ); would return true since the time zone is not applied first which results in comparing 2002/02/28 02:00 for cal1 with 2002/02/28 00:00 for cal2.

**Parameters:**

- `other`: the calendar to compare against this calendar.

---

### isSet

**Signature:** `isSet(field : Number) : boolean`

**Description:** Indicates if the field is set.

**Parameters:**

- `field`: the field to test.

**Returns:**

true if the field is set, false otherwise.

---

### parseByFormat

**Signature:** `parseByFormat(timeString : String, format : String) : void`

**Description:** Parses the string according to the date and time format pattern and set the time at this calendar object. For the specification of the date and time format pattern see the javadoc of the JDK class java.text.SimpleDateFormat. If a time zone is included in the format string, this time zone is used to interpet the time. Otherwise the currently set calendar time zone is used to parse the given time string.

**Parameters:**

- `timeString`: the time string to parsed
- `format`: the time format string

---

### parseByLocale

**Signature:** `parseByLocale(timeString : String, locale : String, pattern : Number) : void`

**Description:** Parses the string according the date format pattern of the given locale. If the locale name is invalid, an exception is thrown. The currently set calendar time zone is used to parse the given time string.

**Parameters:**

- `timeString`: the time string to parsed
- `locale`: the locale id, which defines the date format pattern
- `pattern`: the pattern is one of calendar pattern e.g. SHORT_DATE_PATTERN as defined in the regional settings for the locale

---

### roll

**Signature:** `roll(field : Number, up : boolean) : void`

**Description:** Rolls the specified field up or down one value.

**Parameters:**

- `field`: the field to roll.
- `up`: if true rolls the field up, if false rolls the field down.

---

### roll

**Signature:** `roll(field : Number, amount : Number) : void`

**Description:** Rolls the specified field using the specified value.

**Parameters:**

- `field`: the field to roll.
- `amount`: the amount to roll the field.

---

### set

**Signature:** `set(field : Number, value : Number) : void`

**Description:** Sets the given calendar field to the given value.

**Parameters:**

- `field`: the calendar field to set.
- `value`: the value to set in the field.

---

### set

**Signature:** `set(year : Number, month : Number, date : Number) : void`

**Description:** Sets the values for the calendar fields YEAR, MONTH, and DAY_OF_MONTH.

**Parameters:**

- `year`: the value for year.
- `month`: the value for month.
- `date`: the value for date.

---

### set

**Signature:** `set(year : Number, month : Number, date : Number, hourOfDay : Number, minute : Number) : void`

**Description:** Sets the values for the calendar fields YEAR, MONTH, DAY_OF_MONTH, HOUR_OF_DAY, and MINUTE.

**Parameters:**

- `year`: the value for year.
- `month`: the value for month.
- `date`: the value for date.
- `hourOfDay`: the value for hour of day.
- `minute`: the value for minute.

---

### set

**Signature:** `set(year : Number, month : Number, date : Number, hourOfDay : Number, minute : Number, second : Number) : void`

**Description:** Sets the values for the calendar fields YEAR, MONTH, DAY_OF_MONTH, HOUR_OF_DAY, MINUTE and SECOND.

**Parameters:**

- `year`: the value for year.
- `month`: the value for month.
- `date`: the value for date.
- `hourOfDay`: the value for hour of day.
- `minute`: the value for minute.
- `second`: the value for second.

---

### setFirstDayOfWeek

**Signature:** `setFirstDayOfWeek(value : Number) : void`

**Description:** Sets what the first day of the week is.

**Parameters:**

- `value`: the day to set as the first day of the week.

---

### setTime

**Signature:** `setTime(date : Date) : void`

**Description:** Sets the current time stamp of this calendar. WARNING: Keep in mind that the set Date object's time is always interpreted in the time zone GMT. This means that time zone information at the calendar object needs to be set separately by using the setTimeZone(String) method.

**Parameters:**

- `date`: the current time stamp of this calendar.

---

### setTimeZone

**Signature:** `setTimeZone(timeZone : String) : void`

**Description:** Sets the current time zone of this calendar. WARNING: Keep in mind that the time stamp represented by the calendar is always interpreted in the time zone GMT. Changing the time zone will not change the calendar's time stamp.

**Parameters:**

- `timeZone`: the current time zone value to set.

---
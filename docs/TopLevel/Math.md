## Package: TopLevel

# Class Math

## Inheritance Hierarchy

- Object
  - Math

## Description

Mathematical functions and constants.

## Constants

## Properties

## Constructor Summary

Math()

## Method Summary

### abs

**Signature:** `static abs(x : Number) : Number`

Returns the absolute value of x.

### acos

**Signature:** `static acos(x : Number) : Number`

Returns an approximation to the arc cosine of x.

### acosh

**Signature:** `static acosh(x : Number) : Number`

Returns an approximation to the inverse hyperbolic cosine of x.

### asin

**Signature:** `static asin(x : Number) : Number`

Returns an approximation to the arc sine of x.

### asinh

**Signature:** `static asinh(x : Number) : Number`

Returns an approximation to the inverse hyperbolic sine of x.

### atan

**Signature:** `static atan(x : Number) : Number`

Returns an approximation to the arc tangent of x.

### atan2

**Signature:** `static atan2(y : Number, x : Number) : Number`

Returns an approximation to the arc tangent of the quotient y/x of the arguments y and x, where the signs of y and x are used to determine the quadrant of the result.

### atanh

**Signature:** `static atanh(x : Number) : Number`

Returns an approximation to the inverse hyperbolic tangent of x.

### cbrt

**Signature:** `static cbrt(x : Number) : Number`

Returns an approximation to the cube root of x.

### ceil

**Signature:** `static ceil(x : Number) : Number`

Returns the smallest (closest to -∞) number value that is not less than x and is equal to a mathematical integer.

### clz32

**Signature:** `static clz32(x : Number) : Number`

Returns the number of leading zero bits in the 32-bit binary representation of x.

### cos

**Signature:** `static cos(x : Number) : Number`

Returns an approximation to the cosine of x.

### cosh

**Signature:** `static cosh(x : Number) : Number`

Returns an approximation to the hyperbolic cosine of x.

### exp

**Signature:** `static exp(x : Number) : Number`

Returns an approximation to the exponential function of x (e raised to the power of x, where e is the base of the natural logarithms).

### expm1

**Signature:** `static expm1(x : Number) : Number`

Returns an approximation to subtracting 1 from the exponential function of x (e raised to the power of x, where e is the base of the natural logarithms).

### floor

**Signature:** `static floor(x : Number) : Number`

Returns the greatest (closest to +∞) number value that is not greater than x and is equal to a mathematical integer.

### fround

**Signature:** `static fround(x : Number) : Number`

Returns the nearest 32-bit single precision float representation of x.

### hypot

**Signature:** `static hypot(values : Number...) : Number`

Returns an approximation of the square root of the sum of squares of the arguments.

### imul

**Signature:** `static imul(x : Number, y : Number) : Number`

Performs a 32 bit integer multiplication, where the result is always a 32 bit integer value, ignoring any overflows.

### log

**Signature:** `static log(x : Number) : Number`

Returns an approximation to the natural logarithm of x.

### log10

**Signature:** `static log10(x : Number) : Number`

Returns an approximation to the base 10 logarithm of x.

### log1p

**Signature:** `static log1p(x : Number) : Number`

Returns an approximation to the natural logarithm of of 1 + x.

### log2

**Signature:** `static log2(x : Number) : Number`

Returns an approximation to the base 2 logarithm of x.

### max

**Signature:** `static max(values : Number...) : Number`

Returns the largest specified values.

### min

**Signature:** `static min(values : Number...) : Number`

Returns the smallest of the specified values.

### pow

**Signature:** `static pow(x : Number, y : Number) : Number`

Returns an approximation to the result of raising x to the power y.

### random

**Signature:** `static random() : Number`

Returns a number value with positive sign, greater than or equal to 0 but less than 1, chosen randomly or pseudo randomly with approximately uniform distribution over that range, using an implementation-dependent algorithm or strategy.

### round

**Signature:** `static round(x : Number) : Number`

Returns the number value that is closest to x and is equal to a mathematical integer.

### sign

**Signature:** `static sign(x : Number) : Number`

Returns the sign of x, indicating whether x is positive, negative, or zero.

### sin

**Signature:** `static sin(x : Number) : Number`

Returns an approximation to the sine of x.

### sinh

**Signature:** `static sinh(x : Number) : Number`

Returns an approximation to the hyperbolic sine of x.

### sqrt

**Signature:** `static sqrt(x : Number) : Number`

Returns an approximation to the square root of x.

### tan

**Signature:** `static tan(x : Number) : Number`

Returns an approximation to the tangent of x.

### tanh

**Signature:** `static tanh(x : Number) : Number`

Returns an approximation to the hyperbolic tangent of x.

### trunc

**Signature:** `static trunc(x : Number) : Number`

Returns the integral part of the number x, removing any fractional digits.

## Constructor Detail

## Method Detail

## Method Details

### abs

**Signature:** `static abs(x : Number) : Number`

**Description:** Returns the absolute value of x. The result has the same magnitude as x but has positive sign. If x is NaN, the result is NaN. If x is -0, the result is +0. If x is -∞, the result is +∞.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

the absolute value of x.

---

### acos

**Signature:** `static acos(x : Number) : Number`

**Description:** Returns an approximation to the arc cosine of x. The result is expressed in radians and ranges from +0 to +p. If x is NaN, the result is NaN. If x is greater than 1, the result is NaN. If x is less than -1, the result is NaN. If x is exactly 1, the result is +0.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the arc cosine of x.

---

### acosh

**Signature:** `static acosh(x : Number) : Number`

**Description:** Returns an approximation to the inverse hyperbolic cosine of x. If x is NaN, the result is NaN. If x is less than 1, the result is NaN. If x is exactly 1, the result is +0. If x is +∞, the result is +∞.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the inverse hyperbolic cosine of x.

---

### asin

**Signature:** `static asin(x : Number) : Number`

**Description:** Returns an approximation to the arc sine of x. The result is expressed in radians and ranges from -p/2 to +p/2. If x is NaN, the result is NaN If x is greater than 1, the result is NaN. If x is less than -1, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the arc sine of x.

---

### asinh

**Signature:** `static asinh(x : Number) : Number`

**Description:** Returns an approximation to the inverse hyperbolic sine of x. If x is NaN, the result is NaN If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is +∞. If x is -∞, the result is -∞.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the inverse hyperbolic sine of x.

---

### atan

**Signature:** `static atan(x : Number) : Number`

**Description:** Returns an approximation to the arc tangent of x. The result is expressed in radians and ranges from -p/2 to +p/2. If x is NaN, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is an approximation to +p/2. If x is -∞, the result is an approximation to -p/2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the arc tangent of x.

---

### atan2

**Signature:** `static atan2(y : Number, x : Number) : Number`

**Description:** Returns an approximation to the arc tangent of the quotient y/x of the arguments y and x, where the signs of y and x are used to determine the quadrant of the result. Note that it is intentional and traditional for the two-argument arc tangent function that the argument named y be first and the argument named x be second. The result is expressed in radians and ranges from -p to +p. If either x or y is NaN, the result is NaN. If y>0 and x is +0, the result is an implementation-dependent approximation to +p/2. If y>0 and x is -0, the result is an implementation-dependent approximation to +p/2. If y is +0 and x>0, the result is +0. If y is +0 and x is +0, the result is +0. If y is +0 and x is -0, the result is an implementation-dependent approximation to +p. If y is +0 and X<0, the result is an implementation-dependent approximation to +p. If y is -0 and x>0, the result is -0. If y is -0 and x is +0, the result is -0. If y is -0 and x is -0, the result is an implementation-dependent approximation to -p. If y is -0 and X<0, the result is an implementation-dependent approximation to -p. If y<0 and x is +0, the result is an implementation-dependent approximation to -p/2. If y<0 and x is -0, the result is an implementation-dependent approximation to -p/2. If y>0 and y is finite and x is +∞, the result is +0. If y>0 and y is finite and x is -∞, the result if an implementation-dependent approximation to +p. If y<0 and y is finite and x is +∞, the result is -0. If y<0 and y is finite and x is -∞, the result is an implementation-dependent approximation to -p. If y is +∞ and x is finite, the result is an implementation-dependent approximation to +p/2. If y is -∞ and x is finite, the result is an implementation-dependent approximation to -p/2. If y is +∞ and x is +∞, the result is an implementation-dependent approximation to +p/4. If y is +∞ and x is -∞, the result is an implementation-dependent approximation to +3p/4. If y is -∞ and x is +∞, the result is an implementation-dependent approximation to -p/4. If y is -∞ and x is -∞, the result is an implementation-dependent approximation to -3p/4.

**Parameters:**

- `y`: the first argument.
- `x`: the second argument.

**Returns:**

approximation to the arc tangent of the quotient y/x of the arguments y and x, where the signs of y and x are used to determine the quadrant of the result.

---

### atanh

**Signature:** `static atanh(x : Number) : Number`

**Description:** Returns an approximation to the inverse hyperbolic tangent of x. If x is NaN, the result is NaN. If x is less than -1, the result is NaN. If x is greater than 1, the result is NaN. If x is exactly -1, the result is -∞. If x is exactly +1, the result is +∞. If x is +0, the result is +0. If x is -0, the result is -0.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the inverse hyperbolic tangent of x.

---

### cbrt

**Signature:** `static cbrt(x : Number) : Number`

**Description:** Returns an approximation to the cube root of x. If x is NaN, the result is NaN If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is +∞. If x is -∞, the result is -∞.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the cube root of x.

---

### ceil

**Signature:** `static ceil(x : Number) : Number`

**Description:** Returns the smallest (closest to -∞) number value that is not less than x and is equal to a mathematical integer. If x is already an integer, the result is x. If x is NaN, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is +∞. If x is -∞, the result is -∞. If x is less than 0 but greater than -1, the result is -0. The value of Math.ceil(x) is the same as the value of -Math.floor(-x).

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

the smallest (closest to -∞) number value that is not less than x and is equal to a mathematical integer.

---

### clz32

**Signature:** `static clz32(x : Number) : Number`

**Description:** Returns the number of leading zero bits in the 32-bit binary representation of x.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

the number of leading zero bits in the 32-bit binary representation of x.

---

### cos

**Signature:** `static cos(x : Number) : Number`

**Description:** Returns an approximation to the cosine of x. The argument is expressed in radians. If x is NaN, the result is NaN. If x is +0, the result is 1. If x is -0, the result is 1. If x is +∞, the result is NaN. If x is -∞, the result is NaN.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the cosine of x.

---

### cosh

**Signature:** `static cosh(x : Number) : Number`

**Description:** Returns an approximation to the hyperbolic cosine of x. If x is NaN, the result is NaN. If x is +0, the result is 1. If x is -0, the result is 1. If x is +∞, the result is +∞. If x is -∞, the result is +∞.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the hyperbolic cosine of x.

---

### exp

**Signature:** `static exp(x : Number) : Number`

**Description:** Returns an approximation to the exponential function of x (e raised to the power of x, where e is the base of the natural logarithms). If x is NaN, the result is NaN. If x is +0, the result is 1. If x is -0, the result is 1. If x is +∞, the result is +∞. If x is -∞, the result is +0.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the exponential function of x.

---

### expm1

**Signature:** `static expm1(x : Number) : Number`

**Description:** Returns an approximation to subtracting 1 from the exponential function of x (e raised to the power of x, where e is the base of the natural logarithms). The result is computed in a way that is accurate even when the value of x is close 0. If x is NaN, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is +∞. If x is -∞, the result is -1.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to subtracting 1 from the exponential function of x.

---

### floor

**Signature:** `static floor(x : Number) : Number`

**Description:** Returns the greatest (closest to +∞) number value that is not greater than x and is equal to a mathematical integer. If x is already an integer, the result is x. If x is NaN, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is +∞. If x is -∞, the result is -∞. If x is greater than 0 but less than 1, the result is +0. The value of Math.floor(x) is the same as the value of -Math.ceil(-x).

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

the greatest (closest to +∞) number value that is not greater than x and is equal to a mathematical integer.

---

### fround

**Signature:** `static fround(x : Number) : Number`

**Description:** Returns the nearest 32-bit single precision float representation of x.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

the nearest 32-bit single precision float representation of x.

---

### hypot

**Signature:** `static hypot(values : Number...) : Number`

**Description:** Returns an approximation of the square root of the sum of squares of the arguments. If no arguments are passed, the result is +0. If any argument is +∞, the result is +∞. If any argument is -∞, the result is +∞. If no argument is +∞ or -∞ and any argument is NaN, the result is NaN. If all arguments are either +0 or -0, the result is +0.

**API Versioned:**

From version 21.2.

**Parameters:**

- `values`: the Number values to operate on.

**Returns:**

an approximation of the square root of the sum of squares of the arguments.

---

### imul

**Signature:** `static imul(x : Number, y : Number) : Number`

**Description:** Performs a 32 bit integer multiplication, where the result is always a 32 bit integer value, ignoring any overflows.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: The first operand.
- `y`: The second operand.

**Returns:**

Returns the result of the 32 bit multiplication. The result is a 32 bit signed integer value.

---

### log

**Signature:** `static log(x : Number) : Number`

**Description:** Returns an approximation to the natural logarithm of x. If x is NaN, the result is NaN. If x is less than 0, the result is NaN. If x is +0 or -0, the result is -∞. If x is 1, the result is +0. If x is +∞, the result is +∞.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the natural logarithm of x.

---

### log10

**Signature:** `static log10(x : Number) : Number`

**Description:** Returns an approximation to the base 10 logarithm of x. If x is NaN, the result is NaN. If x is less than 0, the result is NaN. If x is +0 or -0, the result is -∞. If x is 1, the result is +0. If x is +∞, the result is +∞.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the base 10 logarithm of x.

---

### log1p

**Signature:** `static log1p(x : Number) : Number`

**Description:** Returns an approximation to the natural logarithm of of 1 + x. If x is NaN, the result is NaN. If x is less than -1, the result is NaN. If x is -1, the result is -∞. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is +∞.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the natural logarithm of of 1 + x.

---

### log2

**Signature:** `static log2(x : Number) : Number`

**Description:** Returns an approximation to the base 2 logarithm of x. If x is NaN, the result is NaN. If x is less than 0, the result is NaN. If x is +0 or -0, the result is -∞. If x is 1, the result is +0. If x is +∞, the result is +∞.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the base 2 logarithm of x.

---

### max

**Signature:** `static max(values : Number...) : Number`

**Description:** Returns the largest specified values. If no arguments are given, the result is -∞. If any value is NaN, the result is NaN.

**Parameters:**

- `values`: zero or more values.

**Returns:**

the largest of the specified values.

---

### min

**Signature:** `static min(values : Number...) : Number`

**Description:** Returns the smallest of the specified values. If no arguments are given, the result is +∞. If any value is NaN, the result is NaN.

**Parameters:**

- `values`: zero or more values.

**Returns:**

the smallest of the specified values.

---

### pow

**Signature:** `static pow(x : Number, y : Number) : Number`

**Description:** Returns an approximation to the result of raising x to the power y. If y is NaN, the result is NaN. If y is +0, the result is 1, even if x is NaN. If y is -0, the result is 1, even if x is NaN. If x is NaN and y is nonzero, the result is NaN. If abs(x)>1 and y is +∞, the result is +∞. If abs(x)>1 and y is -∞, the result is +0. If abs(x)==1 and y is +∞, the result is NaN. If abs(x)==1 and y is -∞, the result is NaN. If abs(x)<1 and y is +∞, the result is +0. If abs(x)<1 and y is -∞, the result is +∞. If x is +∞ and y>0, the result is +∞. If x is +∞ and y<0, the result is +0. If x is -∞ and y>0 and y is an odd integer, the result is -∞. If x is -∞ and y>0 and y is not an odd integer, the result is +∞. If x is -∞ and y<0 and y is an odd integer, the result is -0. If x is -∞ and y<0 and y is not an odd integer, the result is +0. If x is +0 and y>0, the result is +0. If x is +0 and y<0, the result is +∞. If x is -0 and y>0 and y is an odd integer, the result is -0. If x is -0 and y>0 and y is not an odd integer, the result is +0. If x is -0 and y<0 and y is an odd integer, the result is -∞. If x is -0 and y<0 and y is not an odd integer, the result is +∞. If X<0 and x is finite and y is finite and y is not an integer, the result is NaN.

**Parameters:**

- `x`: a Number that will be raised to the power of y.
- `y`: the power by which x will be raised.

**Returns:**

an approximation to the result of raising x to the power y.

---

### random

**Signature:** `static random() : Number`

**Description:** Returns a number value with positive sign, greater than or equal to 0 but less than 1, chosen randomly or pseudo randomly with approximately uniform distribution over that range, using an implementation-dependent algorithm or strategy.

**Returns:**

a Number greater than or equal to 0 but less than 1.

---

### round

**Signature:** `static round(x : Number) : Number`

**Description:** Returns the number value that is closest to x and is equal to a mathematical integer. If two integer number values are equally close to x, then the result is the number value that is closer to +∞. If x is already an integer, the result is x. If x is NaN, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is +∞. If x is -∞, the result is -∞. If x is greater than 0 but less than 0.5, the result is +0. If x is less than 0 but greater than or equal to -0.5, the result is -0. Math.round(3.5) returns 4, but Math.round(-3.5) returns -3. The value of Math.round(x) is the same as the value of Math.floor(x+0.5), except when x is -0 or is less than 0 but greater than or equal to -0.5; for these cases Math.round(x) returns -0, but Math.floor(x+0.5) returns +0.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

the number value that is closest to x and is equal to a mathematical integer.

---

### sign

**Signature:** `static sign(x : Number) : Number`

**Description:** Returns the sign of x, indicating whether x is positive, negative, or zero. If x is NaN, the result is NaN. If x is -0, the result is -0. If x is +0, the result is +0. If x is negative and not -0, the result is -1. If x is positive and not +0, the result is +1.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

the sign of x.

---

### sin

**Signature:** `static sin(x : Number) : Number`

**Description:** Returns an approximation to the sine of x. The argument is expressed in radians. If x is NaN, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞ or -∞, the result is NaN.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the sine of x.

---

### sinh

**Signature:** `static sinh(x : Number) : Number`

**Description:** Returns an approximation to the hyperbolic sine of x. If x is NaN, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is +∞. If x is -∞, the result is +∞.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the hyperbolic sine of x.

---

### sqrt

**Signature:** `static sqrt(x : Number) : Number`

**Description:** Returns an approximation to the square root of x. If x is NaN, the result is NaN. If x isless than 0, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is +∞.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the square root of x.

---

### tan

**Signature:** `static tan(x : Number) : Number`

**Description:** Returns an approximation to the tangent of x. The argument is expressed in radians. If x is NaN, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞ or -∞, the result is NaN.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the tangent of x.

---

### tanh

**Signature:** `static tanh(x : Number) : Number`

**Description:** Returns an approximation to the hyperbolic tangent of x. If x is NaN, the result is NaN. If x is +0, the result is +0. If x is -0, the result is -0. If x is +∞, the result is +1. If x is -∞, the result is -1.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

an approximation to the hyperbolic tangent of x.

---

### trunc

**Signature:** `static trunc(x : Number) : Number`

**Description:** Returns the integral part of the number x, removing any fractional digits. If x is already an integer, the result is x. If x is NaN, the result is NaN. If x is -0, the result is -0. If x is +0, the result is +0. If x is -∞, the result is -∞. If x is +∞, the result is +∞. If x is greater than 0 but less than 1, the result is +0. If x is less than 0 but greater than -1, the result is -0.

**API Versioned:**

From version 21.2.

**Parameters:**

- `x`: the Number to operate on.

**Returns:**

the integral part of the number of x.

---
## Package: dw.svc

# Class ServiceProfile

## Inheritance Hierarchy

- Object
  - dw.object.PersistentObject
  - dw.object.ExtensibleObject
    - dw.svc.ServiceProfile

## Description

Configuration object for Service Profiles.

## Properties

### cbCalls

**Type:** Number (Read Only)

The maximum number of errors in an interval allowed by the circuit breaker.

### cbMillis

**Type:** Number (Read Only)

The interval of the circuit breaker in milliseconds.

### ID

**Type:** String (Read Only)

The unique Service ID.

### rateLimitCalls

**Type:** Number (Read Only)

The maximum number of calls in an interval allowed by the rate limiter.

### rateLimitMillis

**Type:** Number (Read Only)

The interval of the rate limiter in milliseconds.

### timeoutMillis

**Type:** Number (Read Only)

The service call timeout in milliseconds.

## Constructor Summary

## Method Summary

### getCbCalls

**Signature:** `getCbCalls() : Number`

Returns the maximum number of errors in an interval allowed by the circuit breaker.

### getCbMillis

**Signature:** `getCbMillis() : Number`

Returns the interval of the circuit breaker in milliseconds.

### getID

**Signature:** `getID() : String`

Returns the unique Service ID.

### getRateLimitCalls

**Signature:** `getRateLimitCalls() : Number`

Returns the maximum number of calls in an interval allowed by the rate limiter.

### getRateLimitMillis

**Signature:** `getRateLimitMillis() : Number`

Returns the interval of the rate limiter in milliseconds.

### getTimeoutMillis

**Signature:** `getTimeoutMillis() : Number`

Returns the service call timeout in milliseconds.

## Method Detail

## Method Details

### getCbCalls

**Signature:** `getCbCalls() : Number`

**Description:** Returns the maximum number of errors in an interval allowed by the circuit breaker.

**Returns:**

Maximum number of errors in an interval allowed by the circuit breaker.

---

### getCbMillis

**Signature:** `getCbMillis() : Number`

**Description:** Returns the interval of the circuit breaker in milliseconds.

**Returns:**

Circuit breaker interval in milliseconds.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the unique Service ID.

**Returns:**

unique Service ID

---

### getRateLimitCalls

**Signature:** `getRateLimitCalls() : Number`

**Description:** Returns the maximum number of calls in an interval allowed by the rate limiter.

**Returns:**

Maximum number of calls in an interval allowed by the rate limiter.

---

### getRateLimitMillis

**Signature:** `getRateLimitMillis() : Number`

**Description:** Returns the interval of the rate limiter in milliseconds.

**Returns:**

Interval of the rate limiter in milliseconds.

---

### getTimeoutMillis

**Signature:** `getTimeoutMillis() : Number`

**Description:** Returns the service call timeout in milliseconds.

**Returns:**

Service call timeout in milliseconds.

---
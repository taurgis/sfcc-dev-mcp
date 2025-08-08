## Package: dw.crypto

# Class SecureRandom

## Inheritance Hierarchy

- Object
  - dw.crypto.SecureRandom

## Description

The SecureRandom class provides a cryptographically strong random number generator (RNG). See the Internet Engineering Task Force (IETF) RFC 1750: Randomness Recommendations for Security for more information. Typical callers of SecureRandom invoke the following methods to retrieve random bytes: Bytes bytes... SecureRandom random = new SecureRandom(); Bytes nextBytes = random.nextBytes(bytes); or more convenient to get a Bytes with the demanded length int length = 32; SecureRandom random = new SecureRandom(); Bytes nextBytes = random.nextBytes(length); dw.crypto.SecureRandom is intentionally an adapter for generating cryptographic hard random numbers.

## Constructor Summary

SecureRandom() Instantiates a new secure random.

## Method Summary

### generateSeed

**Signature:** `generateSeed(numBytes : Number) : Bytes`

Returns the given number of seed bytes, computed using the seed generation algorithm that this class uses to seed itself.

### nextBytes

**Signature:** `nextBytes(numBits : Number) : Bytes`

Generates a user-specified number of random bytes.

### nextInt

**Signature:** `nextInt() : Number`

Returns the next pseudorandom, uniformly distributed int value from this random number generator's sequence.

### nextInt

**Signature:** `nextInt(upperBound : Number) : Number`

Returns a pseudorandom, uniformly distributed int value between 0 (inclusive) and the specified value (exclusive), drawn from this random number generator's sequence.

### nextNumber

**Signature:** `nextNumber() : Number`

Returns the next pseudorandom, uniformly distributed Number value between 0.0 (inclusive) and 1.0 (exclusive) from this random number generator's sequence.

### setSeed

**Signature:** `setSeed(seed : Bytes) : void`

Reseeds this random object.

## Constructor Detail

## Method Detail

## Method Details

### generateSeed

**Signature:** `generateSeed(numBytes : Number) : Bytes`

**Description:** Returns the given number of seed bytes, computed using the seed generation algorithm that this class uses to seed itself. This call may be used to seed other random number generators.

**Parameters:**

- `numBytes`: the number of seed bytes to generate.

**Returns:**

the seed bytes.

---

### nextBytes

**Signature:** `nextBytes(numBits : Number) : Bytes`

**Description:** Generates a user-specified number of random bytes. If a call to setSeed had not occurred previously, the first call to this method forces this SecureRandom object to seed itself. This self-seeding will not occur if setSeed was previously called.

**Parameters:**

- `numBits`: the demanded number of bits

**Returns:**

a randomly filled Bytes

---

### nextInt

**Signature:** `nextInt() : Number`

**Description:** Returns the next pseudorandom, uniformly distributed int value from this random number generator's sequence. The general contract of nextInt is that one int value is pseudorandomly generated and returned. All 232 possible int values are produced with (approximately) equal probability.

**Returns:**

the next pseudorandom, uniformly distributed int value from this random number generator's sequence

---

### nextInt

**Signature:** `nextInt(upperBound : Number) : Number`

**Description:** Returns a pseudorandom, uniformly distributed int value between 0 (inclusive) and the specified value (exclusive), drawn from this random number generator's sequence.

**Parameters:**

- `upperBound`: the bound on the random number to be returned. Must be positive.

**Returns:**

the next pseudorandom, uniformly distributed int value between 0 (inclusive) and upperBound (exclusive) from this random number generator's sequence

**Throws:**

IllegalArgumentException - if n is not positive

---

### nextNumber

**Signature:** `nextNumber() : Number`

**Description:** Returns the next pseudorandom, uniformly distributed Number value between 0.0 (inclusive) and 1.0 (exclusive) from this random number generator's sequence.

**Returns:**

the next pseudorandom, uniformly distributed Number value between 0.0 and 1.0 from this random number generator's sequence

---

### setSeed

**Signature:** `setSeed(seed : Bytes) : void`

**Description:** Reseeds this random object. The given seed supplements, rather than replaces, the existing seed. Thus, repeated calls are guaranteed never to reduce randomness.

**Parameters:**

- `seed`: the seed.

---
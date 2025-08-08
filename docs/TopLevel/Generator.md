## Package: TopLevel

# Class Generator

## Inheritance Hierarchy

- Object
  - Generator

## Description

A generator is a special type of function that works as a factory for iterators and it allows you to define an iterative algorithm by writing a single function which can maintain its own state. A function becomes a generator if it contains one or more yield statements. When a generator function is called, the body of the function does not execute straight away; instead, it returns a generator-iterator object. Each call to the generator-iterator's next() method will execute the body of the function up to the next yield statement and return its result. When either the end of the function or a return statement is reached, a StopIteration exception is thrown. For example, the following fib() function is a Fibonacci number generator, that returns the generator when it encounters the yield statement: function fib() { var fibNum = 0, j = 1; while (true) { yield fibNum; var t = fibNum; fibNum = j; j += t; } } To use the generator, simply call the next() method to access the values returned by the function: var gen = fib(); for (var i = 0; i < 10; i++) { document.write(gen.next() " "); }

## Constructor Summary

Generator()

## Method Summary

### close

**Signature:** `close() : void`

Closes the iteration of the generator.

### next

**Signature:** `next() : Object`

Resumes the iteration of the generator by continuing the function at the statement after the yield statement.

### send

**Signature:** `send(value : Object) : Object`

Allows you to control the resumption of the iterative algorithm.

## Constructor Detail

## Method Detail

## Method Details

### close

**Signature:** `close() : void`

**Description:** Closes the iteration of the generator. Any finally clauses active in the generator function are run. If a finally clause throws any exception other than StopIteration, the exception is propagated to the caller of the close() method.

---

### next

**Signature:** `next() : Object`

**Description:** Resumes the iteration of the generator by continuing the function at the statement after the yield statement. This function throws a StopIterator exception when there are no additional iterative steps.

**Returns:**

the result of resuming the iterative algorithm or a StopIterator exception if the sequence is exhausted.

**See Also:**

StopIteration

---

### send

**Signature:** `send(value : Object) : Object`

**Description:** Allows you to control the resumption of the iterative algorithm. Once a generator has been started by calling its next() method, you can use send() and pass a specific value that will be treated as the result of the last yield. The generator will then return the operand of the subsequent yield. You can't start a generator at an arbitrary point; you must start it with next() before you can send() it a specific value. Note that calling send(undefined) is equivalent to calling next(). However, starting a newborn generator with any value other than 'undefined' when calling send() will result in a TypeError exception.

**Parameters:**

- `value`: the value to use.

---
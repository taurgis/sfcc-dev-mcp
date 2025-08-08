## Package: dw.system

# Class Transaction

## Inheritance Hierarchy

- Object
  - dw.system.Transaction

## Description

Represents the current transaction. A transaction provides a context for performing atomic changes to persistent business objects. Before a business object can be created, changed, or deleted, a transaction must be started using the begin() method. All changes on the touched business objects will only be made durable when the transaction is committed with commit(). If a transaction is rolled back, all changes so far will be reverted and the business object will have their previous state again. It is possible to begin a transaction multiple times in a nested way (like begin-begin-commit-commit). In this case, in order to commit the changes the commit method must be called symmetrically as often as begin. It is also possible to run multiple transactions within a single request, one after another (like begin-commit-begin-commit). In case of any exception while working with business objects inside of a transaction, the transaction cannot be committed anymore, but only be rolled back. Business code may try to take appropriate actions if it expects business-related problems at commit (for example, constraint violations). When a transaction is still open at the end of a pipeline call, controller call, or job step, the remaining changes are committed unless an exception is thrown. The following best practices exist for using transactions: Avoid long running transactions in jobs. Use one transaction for changes that belong together and need a joint rollback. In most cases, one transaction for all changes in a request is better than multiple transactions for each individual object. Don’t begin and commit a huge number of small transactions in a loop. Avoid changing the same objects in parallel transactions. Example 1 - explicit control: var txn = require('dw/system/Transaction'); txn.begin(); // work with business objects here txn.commit(); Example 2 - implicit control: var txn = require('dw/system/Transaction'); txn.wrap(function(){ // work with business objects here });

## Constructor Summary

## Method Summary

### begin

**Signature:** `static begin() : void`

Begins a transaction.

### commit

**Signature:** `static commit() : void`

Commits the current transaction.

### rollback

**Signature:** `static rollback() : void`

Rolls back the current transaction.

### wrap

**Signature:** `static wrap(callback : Function) : Object`

Encloses the provided callback function in a begin-commit transactional context.

## Method Detail

## Method Details

### begin

**Signature:** `static begin() : void`

**Description:** Begins a transaction.

---

### commit

**Signature:** `static commit() : void`

**Description:** Commits the current transaction. The transaction must have been started with begin() before.

---

### rollback

**Signature:** `static rollback() : void`

**Description:** Rolls back the current transaction. The transaction must have been started with begin() before.

---

### wrap

**Signature:** `static wrap(callback : Function) : Object`

**Description:** Encloses the provided callback function in a begin-commit transactional context. If the transaction cannot be committed successfully, it is rolled back instead and an exception is thrown.

**Parameters:**

- `callback`: a function that should be executed within a transactional context

**Returns:**

the result of the callback function, if it returns something

---
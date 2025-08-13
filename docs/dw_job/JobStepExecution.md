## Package: dw.job

# Class JobStepExecution

## Inheritance Hierarchy

- Object
  - dw.job.JobStepExecution

## Description

Represents an execution of a step that belongs to a job. The job execution this step execution belongs to can be accessed via getJobExecution(). If a pipeline is used to implement a step this step execution is available in the pipeline dictionary under the key 'JobStepExecution'. If a script module is used to implement a step this step execution is available as the second parameter of the module's function that is used to execute the step, e.g.:

```javascript
 ...
 exports.execute( parameters, stepExecution)
 {
      ...
      var jobExecution = stepExecution.getJobExecution();
      ...
 }
 ...
```

## Properties

### ID

**Type:** String (Read Only)

The ID of this step execution.

### jobExecution

**Type:** JobExecution (Read Only)

The job execution this step execution belongs to.

### stepID

**Type:** String (Read Only)

The ID of the step this step execution belongs to.

### stepTypeID

**Type:** String (Read Only)

The ID of the step type of the step this step execution belongs to.

## Constructor Summary

This class does not have a constructor, so you cannot create it directly.

## Method Summary

### getID

**Signature:** `getID() : String`

Returns the ID of this step execution.

### getJobExecution

**Signature:** `getJobExecution() : JobExecution`

Returns the job execution this step execution belongs to.

### getParameterValue

**Signature:** `getParameterValue(name : String) : Object`

Returns the value of the parameter of the step this step execution belongs to.

### getStepID

**Signature:** `getStepID() : String`

Returns the ID of the step this step execution belongs to.

### getStepTypeID

**Signature:** `getStepTypeID() : String`

Returns the ID of the step type of the step this step execution belongs to.

## Method Details

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of this step execution.

**Returns:**

the ID of this step execution.

---

### getJobExecution

**Signature:** `getJobExecution() : JobExecution`

**Description:** Returns the job execution this step execution belongs to.

**Returns:**

the job execution this step execution belongs to.

---

### getParameterValue

**Signature:** `getParameterValue(name : String) : Object`

**Description:** Returns the value of the parameter of the step this step execution belongs to.

**Parameters:**

- `name`: The name of the parameter.

**Returns:**

the value of the parameter of the step this step execution belongs to.

---

### getStepID

**Signature:** `getStepID() : String`

**Description:** Returns the ID of the step this step execution belongs to.

**Returns:**

the ID of the step this step execution belongs to.

---

### getStepTypeID

**Signature:** `getStepTypeID() : String`

**Description:** Returns the ID of the step type of the step this step execution belongs to.

**Returns:**

the ID of the step type of the step this step execution belongs to.

---

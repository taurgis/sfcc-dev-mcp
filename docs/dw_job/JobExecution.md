## Package: dw.job

# Class JobExecution

## Inheritance Hierarchy

- Object
  - dw.job.JobExecution

## Description

Represents an execution of a job. The job execution can be accessed from a JobStepExecution via JobStepExecution.getJobExecution(). If a pipeline is used to implement a step the step execution is available in the pipeline dictionary under the key 'JobStepExecution'. If a script module is used to implement a step the step execution is available as the second parameter of the module's function that is used to execute the step, e.g.:

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

### context

**Type:** Map (Read Only)

The job context which can be used to share data between steps. NOTE: Steps should be self-contained, the job context should only be used when necessary and with caution. If two steps which are running in parallel in the same job store data in the job context using the same key the result is undefined. Don't add any complex data to the job context since only simple data types are supported (for example, String and Integer).

### ID

**Type:** String (Read Only)

The ID of this job execution.

### jobID

**Type:** String (Read Only)

The ID of the job this job execution belongs to.

## Constructor Summary

This class does not have a constructor, so you cannot create it directly.

## Method Summary

### getContext

**Signature:** `getContext() : Map`

Returns the job context which can be used to share data between steps.

### getID

**Signature:** `getID() : String`

Returns the ID of this job execution.

### getJobID

**Signature:** `getJobID() : String`

Returns the ID of the job this job execution belongs to.

## Method Detail

## Method Details

### getContext

**Signature:** `getContext() : Map`

**Description:** Returns the job context which can be used to share data between steps. NOTE: Steps should be self-contained, the job context should only be used when necessary and with caution. If two steps which are running in parallel in the same job store data in the job context using the same key the result is undefined. Don't add any complex data to the job context since only simple data types are supported (for example, String and Integer).

**Returns:**

the map that represents the job context.

---

### getID

**Signature:** `getID() : String`

**Description:** Returns the ID of this job execution.

**Returns:**

the ID of this job execution.

---

### getJobID

**Signature:** `getJobID() : String`

**Description:** Returns the ID of the job this job execution belongs to.

**Returns:**

the ID of the job this job execution belongs to.

---

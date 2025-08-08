## Package: dw.system

# Class Pipeline

## Inheritance Hierarchy

- Object
  - dw.system.Pipeline

## Description

A helper for executing pipelines from JavaScript. The main purpose for this API is to invoke process pipelines from JavaScript controllers, e.g. pipelines that return with an end node and that do not perform user interactions. Pipelines that span across multiple requests (e.g. that contain Interaction-Continue-Nodes) are not supported and may not work as expected. The pipeline will be executed within the current request and not by a remote call, so this API works roughly like a Call node in a pipeline. The called pipeline will get its own local pipeline dictionary. The dictionary can be populated with initial values from an argument object. Any results from the pipeline can be read from the pipeline dictionary that is returned by the execute(String) methods. If an exception occurs during the pipeline processing, the Error-branch of the pipeline will be called. If no error handling exists for the pipeline, the exception will be propagated and can be handled by the script code. If the pipeline finishes with an End node, the name of the end node can be obtained from the returned pipeline dictionary under the key 'EndNodeName'. Example: let Pipeline = require('dw/system/Pipeline'); let pdict = Pipeline.execute('MyPipeline-Start', { MyArgString: 'someStringValue', MyArgNumber: 12345, MyArgBoolean: true }); let result = pdict.MyReturnValue; This feature requires an API version >=15.5.

## Constructor Summary

## Method Summary

### execute

**Signature:** `static execute(pipeline : String) : PipelineDictionary`

Executes a pipeline.

### execute

**Signature:** `static execute(pipeline : String, args : Object) : PipelineDictionary`

Executes a pipeline.

## Method Detail

## Method Details

### execute

**Signature:** `static execute(pipeline : String) : PipelineDictionary`

**Description:** Executes a pipeline.

**API Versioned:**

From version 15.5. New convenience method for easier migration of pipeline-based systems to JavaScript controllers.

**Parameters:**

- `pipeline`: the pipeline identifier, must consist of the pipeline name and the start node name, like 'PipelineName-StartNodeName'

**Returns:**

the pipeline dictionary with the pipeline results

---

### execute

**Signature:** `static execute(pipeline : String, args : Object) : PipelineDictionary`

**Description:** Executes a pipeline. The pipeline dictionary will be initialized with the provided arguments.

**API Versioned:**

From version 15.5. New convenience method for easier migration of pipeline-based systems to JavaScript controllers.

**Parameters:**

- `pipeline`: the pipeline identifier, must consist of a pipeline name and a start node name, like 'PipelineName-StartNodeName'
- `args`: an object whose properties represent the initial values of the pipeline dictionary

**Returns:**

the pipeline dictionary with the pipeline results

---
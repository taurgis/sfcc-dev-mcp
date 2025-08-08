## Package: dw.order.hooks

# Class ReturnHooks

## Inheritance Hierarchy

- dw.order.hooks.ReturnHooks

## Description

This interface represents all script hooks that can be registered to customizing the order center return resource. It contains the extension points (hook names), and the functions that are called by each extension point. A function must be defined inside a JavaScript source and must be exported. The script with the exported hook function must be located inside a site cartridge. Inside the site cartridge a 'package.json' file with a 'hooks' entry must exist. "hooks": "./hooks.json" The hooks entry links to a json file, relative to the 'package.json' file. This file lists all registered hooks inside the hooks property: "hooks": [ {"name": "dw.order.return.createReturn", "script": "./returns.ds"}, {"name": "dw.order.return.addReturnItem", "script": "./returns.ds"}, {"name": "dw.order.return.changeStatus", "script": "./returns.ds"}, ] A hook entry has a 'name' and a 'script' property. The 'name' contains the extension point, the hook name. The 'script' contains the script relative to the hooks file, with the exported hook function. Overview Return Functionality Business objects ReturnCase All returns exist in the context of a ReturnCase, each Order can have any number of ReturnCases. A ReturnCase has ReturnCaseItems, each of which is associated with an OrderItem (an extension to either a ProductLineItem or a ShippingLineItem). Each ReturnCaseItem defines an ReturnCaseItem.getAuthorizedQuantity() representing the maximum quantity expected to be returned. A ReturnCaseItem may be associated with 0..n ReturnItems - ReturnItems are added to the ReturnCaseItem when Returns are created. Either - a ReturnCase may be used as an RMA, in which case they are created when a customer first shows a wish to return item(s). The customer then includes the RMA number with the returned item(s). The Return created as a result is then associated with the existing ReturnCase. Or - a ReturnCase is automatically created as part of the return creation, i.e. the customer returns some item(s) leading to a creation of both a Return and an associated ReturnCase. The scripting api allows access to the ReturnCases, whether the ReturnCase is an RMA or not, and the ReturnCase status. Both the ReturnCaseItems and any Returns associated with the ReturnCase can be accessed. A ReturnCase has one of these status values: New - the ReturnCase has been created and can be edited previous to its authorization CONFIRMED - the ReturnCase is CONFIRMED, can no longer be edited, no Returns have been associated with it. Only an New- ReturnCase can be CONFIRMED PARTIAL_RETURNED - the ReturnCase has been associated with at least one Return, but is not yet complete. Only an CONFIRMED- ReturnCase can be set to PARTIAL_RETURNED RETURNED - the ReturnCase has been associated with Returns which match the expected authorized quantity. Only an CONFIRMED- or PARTIAL_RETURNED- return-case can be set to RETURNED Cancelled - the ReturnCase has been cancelled (only a New- or CONFIRMED- ReturnCase can be cancelled) Return A Return represents a physical customer return, and contains 1..n ReturnItems. A Return is associated with one ReturnCase, and each ReturnItem is associated with one ReturnCaseItem and (via the ReturnCaseItem) a single OrderItem usually representing an Order ProductLineItem. A ReturnItem records the quantity returned. A Return can have one of these status values: NEW - the Return is new, i.e. needs to undergo a check before it can be marked as COMPLETED COMPLETED - the return is complete, this is a precondition for refunding the customer for a return. Credit Invoice As a result of making a Return, the customer may be refunded. The refund amount is held in a credit Invoice which may be associated either with one Return or with one ReturnCase. The Invoice is passed to the refund payment hook allowing custom code to handle the payment refund. Process overview Create ReturnCase The creation of ReturnCases is supported using the data-api. The api supports, within the context of an Order, the specification of an (optional) RMA-number and addition of ReturnCaseItems for a given order-item and quantity. Authorize ReturnCase Following its creation, a ReturnCase needs to be CONFIRMED - an CONFIRMED ReturnCase cannot be modified. Cancel ReturnCase Following its creation or authorization, a ReturnCase may be cancelled. Create Return Returns may be imported or created via the data-api. These apis specify an (optional) RMA allowing a Return to be associated with a ReturnCase, and ReturnItems with a quantity and a key allowing them to be associated with an order-item. The process is delegated to custom scripts which control the creation of the Return and the addition of the ReturnItems: Hook extensionPointCreateReturn The creation of the new Return is delegated to the custom script when this hook is called, passing the order, and details of the Return to be created to the script. Typically the script accesses the ReturnCase from the order and creates the return with the provided return-number. It may also update the Order, ReturnCase or Return using custom values passed in the Return details. exports.createReturn = function (order:Order, returnDetails) { var returnNumber=returnDetails.returnNumber; var returnCase = order.getReturnCase(returnDetails.returnCaseNumber); var newReturn = returnCase.createReturn(returnNumber); return newReturn; } Hook extensionPointAddReturnItem This call delegates the creation of individual ReturnItems to a custom script, passing the Order, returnNumber, returnCaseItemId and return-item-details. Typically the script will access the ReturnCaseItem from the order and create a new ReturnItem for it. exports.addReturnItem = function (retrn:Return, returnItemDetails) { var returnCaseItem = order.getReturnCaseItem(returnCaseItemId); var item = returnCaseItem.createReturnItem(returnNr); Hook extensionPointChangeStatus This call delegates the update of the return-status to a custom script, passing the Order, returnNumber and new status. The custom script is responsible for setting the status and taking any other actions necessary, including the possibility of creating a credit invoice: changeStatus = function (retrn:Return, status) { retrn.status=status; Hook extensionPointAfterStatusChange This call delegates the update of the return-status to a custom script, passing the Order, returnNumber and new status. The custom script is responsible for setting the status and taking any other actions necessary, including the possibility of creating a credit invoice: changeStatus = function (retrn:Return, status) { retrn.status=status; Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Constants

## Properties

## Constructor Summary

## Method Summary

### addReturnItem

**Signature:** `addReturnItem(retrn : Return, inputData : ReturnItem) : Status`

The hook provides customization in the process of assigning the returned amount, quantity etc.

### afterStatusChange

**Signature:** `afterStatusChange(retrn : Return) : Status`

Called after method changeStatus(Return, ReturnWO) returns Status.OK.

### changeStatus

**Signature:** `changeStatus(retrn : Return, inputData : Return) : Status`

Responsible to change the status of a Return: the custom script is responsible for setting the new status using Return.setStatus(String).

### createReturn

**Signature:** `createReturn(inputData : Return) : Return`

This hook is responsible for creating a new Return, based on a ReturnCase.

### notifyStatusChange

**Signature:** `notifyStatusChange(retrn : Return) : Status`

Called after method changeStatus(Return, ReturnWO) returns Status.OK (and after method afterStatusChange(Return)) to inform of a successful status change.

## Method Detail

## Method Details

### addReturnItem

**Signature:** `addReturnItem(retrn : Return, inputData : ReturnItem) : Status`

**Description:** The hook provides customization in the process of assigning the returned amount, quantity etc. Here it is possible to refund differently based on the return reason code for example. Also one could correct the inventory based on the return information. Utilize ReturnCaseItem.createReturnItem(String) to create a new ReturnItem.

**Parameters:**

- `retrn`: the return for which an return item should be created
- `inputData`: the return item

**Returns:**

Status.OK return item is successfully added Status.ERROR return item addition failed.

---

### afterStatusChange

**Signature:** `afterStatusChange(retrn : Return) : Status`

**Description:** Called after method changeStatus(Return, ReturnWO) returns Status.OK. The call is made in a separate database transaction allowing the script implementation to make an independent remote call if desired.

**Parameters:**

- `retrn`: the return

**Returns:**

Status.OK status successful Status.ERROR on failure

---

### changeStatus

**Signature:** `changeStatus(retrn : Return, inputData : Return) : Status`

**Description:** Responsible to change the status of a Return: the custom script is responsible for setting the new status using Return.setStatus(String). The invoice handling should be implemented here using Return.createInvoice(String) or ReturnCase.createInvoice(String). For example create an Invoice for a Return moving to status Return.STATUS_COMPLETED.

**Parameters:**

- `retrn`: the return which status should change
- `inputData`: the data in which the new status is included

**Returns:**

Status.OK status successfully changed Status.ERROR status not changed.

---

### createReturn

**Signature:** `createReturn(inputData : Return) : Return`

**Description:** This hook is responsible for creating a new Return, based on a ReturnCase. 2 basic workflows are supported: On-the-fly return: create the parent ReturnCase using Order.createReturnCase(String, Boolean). Return-merchandise-authorization (RMA) workflow: resolve an existing ReturnCase using Order.getReturnCase(String). In both cases use this method to create the Return based on the inputData. Additional functionality like creating history entry, handling the return fees or the shipping cost credit can be implemented in the hook after the Return is created.

**Parameters:**

- `inputData`: the return

**Returns:**

the created return

---

### notifyStatusChange

**Signature:** `notifyStatusChange(retrn : Return) : Status`

**Description:** Called after method changeStatus(Return, ReturnWO) returns Status.OK (and after method afterStatusChange(Return)) to inform of a successful status change. The call is made outside any database transaction. This is the best hook in which to send customer notifications as the status change has already been successfully written to the database

**Parameters:**

- `retrn`: the return

**Returns:**

Status.OK status successful Status.ERROR on failure

---
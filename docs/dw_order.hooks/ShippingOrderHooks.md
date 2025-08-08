## Package: dw.order.hooks

# Class ShippingOrderHooks

## Inheritance Hierarchy

- dw.order.hooks.ShippingOrderHooks

## Description

This interface represents all script hooks that can be registered around shipping order lifecycle. It contains the extension points (hook names), and the functions that are called by each extension point. A function must be defined inside a JavaScript source and must be exported. The script with the exported hook function must be located inside a site cartridge. Inside the site cartridge a 'package.json' file with a 'hooks' entry must exist. "hooks": "./hooks.json" The hooks entry links to a json file, relative to the 'package.json' file. This file lists all registered hooks inside the hooks property: "hooks": [ {"name": "dw.order.shippingorder.updateShippingOrderItem", "script": "./shippingOrderUpdate.ds"}, ] A hook entry has a 'name' and a 'script' property. The 'name' contains the extension point, the hook name. The 'script' contains the script relative to the hooks file, with the exported hook function. Order post-processing APIs (gillian) are now inactive by default and will throw an exception if accessed. Activation needs preliminary approval by Product Management. Please contact support in this case. Existing customers using these APIs are not affected by this change and can use the APIs until further notice.

## Constants

## Properties

## Constructor Summary

## Method Summary

### afterStatusChange

**Signature:** `afterStatusChange(shippingOrder : ShippingOrder) : Status`

After Status change hook.

### changeStatus

**Signature:** `changeStatus(shippingOrder : ShippingOrder, updateData : ShippingOrder) : Status`

Change the status of a shipping order.

### createShippingOrders

**Signature:** `createShippingOrders(order : Order) : Status`

Called during shipping order creation for an order.

### notifyStatusChange

**Signature:** `notifyStatusChange(shippingOrder : ShippingOrder) : Status`

Notify Status change hook.

### prepareCreateShippingOrders

**Signature:** `prepareCreateShippingOrders(order : Order) : Status`

Called before shipping order creation for an order takes place.

### resolveShippingOrder

**Signature:** `resolveShippingOrder(updateData : ShippingOrder) : ShippingOrder`

Resolve the shipping order.

### setShippingOrderCancelled

**Signature:** `setShippingOrderCancelled(updateData : ShippingOrder) : Order`

Change the status of a shipping order to cancelled.

### setShippingOrderShipped

**Signature:** `setShippingOrderShipped(updateData : ShippingOrder) : Order`

Change the status of a shipping order to shipped.

### setShippingOrderWarehouse

**Signature:** `setShippingOrderWarehouse(updateData : ShippingOrder) : Order`

Change the status of a shipping order to warehouse.

### updateShippingOrderItem

**Signature:** `updateShippingOrderItem(shippingOrder : ShippingOrder, updateItem : ShippingOrderItem) : Status`

Updates the status of a shipping order item.

## Method Detail

## Method Details

### afterStatusChange

**Signature:** `afterStatusChange(shippingOrder : ShippingOrder) : Status`

**Description:** After Status change hook. The function is called by extension point extensionPointAfterStatusChange. The implementation of this hook is optional. If defined the hook is called after extensionPointChangeStatus or respectively after extensionPointShippingOrderShipped, extensionPointShippingOrderCancelled or extensionPointShippingOrderWarehouse Runs inside of a transaction.

**Parameters:**

- `shippingOrder`: the shipping order to be updated

**Returns:**

the resulting status

---

### changeStatus

**Signature:** `changeStatus(shippingOrder : ShippingOrder, updateData : ShippingOrder) : Status`

**Description:** Change the status of a shipping order. The function is called by extension point extensionPointChangeStatus. Runs inside a transaction together with the hooks extensionPointResolveShippingOrder extensionPointUpdateShippingOrderItem. Runs after the iteration over the input's items collection as the last step in this transaction. The implementation of this hook is mandatory.

**Parameters:**

- `shippingOrder`: the shipping order to be updated
- `updateData`: the input data

**Returns:**

the resulting status

---

### createShippingOrders

**Signature:** `createShippingOrders(order : Order) : Status`

**Description:** Called during shipping order creation for an order. The function is called by extension point extensionPointCreateShippingOrders. It is responsible for creating shipping orders and its items for the order. Preparations for shipping order creation can be done before in hook extensionPointPrepareCreateShippingOrders. Runs inside of a transaction. The implementation of this hook is mandatory.

**Parameters:**

- `order`: the order to create shipping orders for

**Returns:**

the resulting status

---

### notifyStatusChange

**Signature:** `notifyStatusChange(shippingOrder : ShippingOrder) : Status`

**Description:** Notify Status change hook. The function is called by extension point extensionPointNotifyStatusChange. The implementation of this hook is optional. If defined the hook is called after extensionPointAfterStatusChange as the last step in the shipping order update process. Runs outside of a transaction.

**Parameters:**

- `shippingOrder`: the shipping order to be updated

**Returns:**

the resulting status

---

### prepareCreateShippingOrders

**Signature:** `prepareCreateShippingOrders(order : Order) : Status`

**Description:** Called before shipping order creation for an order takes place. Typically the hook is used to check the payment authorization status of the order. The function is called by extension point extensionPointPrepareCreateShippingOrders. Runs inside its own transaction. The value of the return status is used to control whether hook createShippingOrders(Order) is called for the order or not. The implementation of this hook is mandatory.

**Parameters:**

- `order`: the order to create shipping orders for

**Returns:**

Status.OK successful preparation - continue with shipping order creation for this order. Status.ERROR failed preparation - skip shipping order creation for this order.

---

### resolveShippingOrder

**Signature:** `resolveShippingOrder(updateData : ShippingOrder) : ShippingOrder`

**Description:** Resolve the shipping order. Will be called as first step of the update. The function is called by extension point extensionPointResolveShippingOrder. Runs inside a transaction together with the hooks extensionPointUpdateShippingOrderItem extensionPointChangeStatus. The implementation of this hook is mandatory.

**Parameters:**

- `updateData`: the input data

**Returns:**

the shipping order to update

---

### setShippingOrderCancelled

**Signature:** `setShippingOrderCancelled(updateData : ShippingOrder) : Order`

**Description:** Change the status of a shipping order to cancelled. The function is called by extension point extensionPointShippingOrderCancelled. This is an optional hook that can be implemented to have full control over status change to destination status Cancelled. The following hooks will be skipped if an implementation for this hook is registered: extensionPointResolveShippingOrder, extensionPointUpdateShippingOrderItem, extensionPointChangeStatus. Runs inside of a transaction.

**Parameters:**

- `updateData`: the input data

**Returns:**

the changed order or {code}null{code}

---

### setShippingOrderShipped

**Signature:** `setShippingOrderShipped(updateData : ShippingOrder) : Order`

**Description:** Change the status of a shipping order to shipped. The function is called by extension point extensionPointShippingOrderShipped. This is an optional hook that can be implemented to have full control over status change to destination status Shipped. The following hooks will be skipped if an implementation for this hook is registered: extensionPointResolveShippingOrder extensionPointUpdateShippingOrderItem, extensionPointChangeStatus. Runs inside of a transaction.

**Parameters:**

- `updateData`: the input data

**Returns:**

the changed order or {code}null{code}

---

### setShippingOrderWarehouse

**Signature:** `setShippingOrderWarehouse(updateData : ShippingOrder) : Order`

**Description:** Change the status of a shipping order to warehouse. The function is called by extension point extensionPointShippingOrderWarehouse. This is an optional hook that can be implemented to have full control over status change to destination status Warehouse. The following hooks will be skipped if an implementation for this hook is registered: extensionPointResolveShippingOrder, extensionPointUpdateShippingOrderItem, extensionPointChangeStatus. Runs inside of a transaction.

**Parameters:**

- `updateData`: the input data

**Returns:**

the changed order or {code}null{code}

---

### updateShippingOrderItem

**Signature:** `updateShippingOrderItem(shippingOrder : ShippingOrder, updateItem : ShippingOrderItem) : Status`

**Description:** Updates the status of a shipping order item. The function is called by extension point extensionPointUpdateShippingOrderItem. Runs inside a transaction together with the hooks extensionPointResolveShippingOrder extensionPointChangeStatus. The implementation of this hook is mandatory.

**Parameters:**

- `shippingOrder`: the shipping order
- `updateItem`: the input data

**Returns:**

the resulting status

---
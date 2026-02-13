## Package: dw.order

# Class BasketMgr

## Inheritance Hierarchy

- Object
  - dw.order.BasketMgr

## Description

Provides static helper methods for managing baskets.

## Properties

### baskets

**Type:** List (Read Only)

Retrieve all open baskets for the logged in customer including the temporary baskets.
 
 
 Restricted to agent scenario use cases: The returned list contains all agent baskets created with
 createAgentBasket() and the current storefront basket which can also be retrieved with
 getCurrentBasket(). This method will result in an exception if called by a user without permission
 Create_Order_On_Behalf_Of or if no customer is logged in the session.
 
 
 Please notice that baskets are invalidated after a certain amount of time and may not be returned anymore.

### currentBasket

**Type:** Basket (Read Only)

This method returns the current valid basket of the session customer or null if no current valid
 basket exists.
 
 The methods getCurrentBasket() and getCurrentOrNewBasket() work based on the selected basket
 persistence, which can be configured in the Business Manager site preferences / baskets section. A basket is
 valid for the configured basket lifetime.
 
 
 In hybrid storefront scenarios (Phased Launch sites that utilize SFRA/SiteGenesis for some part while also
 utilizing PWA Kit or other custom headless solution for another part of the same site), this method must
 NOT be used. Instead, retrieve baskets via GET baskets/{basketId} or
 GET customers/{customerId}/baskets. Do not use getCurrentOrNewBasket() for basket creation
 in any scenario.
 
 
 The current basket, if one exists, is usually updated by the method. In particular the last-modified date is
 updated. No update is done when method getCurrentBasket() is used within a read-only hook
 implementation (such as a beforeGet or a modifyResponse hook). The lifetime of a basket can be extended
 in 2 ways:
 
 The basket is modified in some way, e.g. a product is added resulting in the basket total being newly
 calculated. This results in the basket lifetime being reset.
 The basket has not been modified for 60 minutes, then using this method to access the basket will also reset
 the basket lifetime.
 
 
 
 What happens when a customer logs in? Personal data held inside the basket such as addresses, email addresses and
 payment settings is associated with the customer to whom the basket belongs. If the basket being updated belongs
 to a different customer this data is removed. This happens when a guest customer that has a basket logs in and
 hence identifies as a registered customer. In this case the basket which was previously created by the guest
 customer gets transferred to the (now logged in) registered customer. Should the registered customer already have
 a basket, this basket is effectively invalidated, but made available using getStoredBasket() allowing
 the script to merge content from it if desired.
 
 
 What happens when a customer logs out or when the customer session times out? After the customer logs out, a
 basket belonging to the registered customer (now logged out) is stored (where applicable) and this method 
 returns null. Personal data is also cleared when the session times out for a guest customer.
 
 
 The following personal data is cleared:
 
 product line items that were added from a wish list
 shipping method
 coupon line items
 gift certificate line items
 billing and shipping addresses
 payment instruments
 buyer email
 
 If the session currency no longer matches the basket currency, the basket currency should be updated with
 Basket.updateCurrency().
 
 
 Typical usage:

  var basket : Basket = BasketMgr.getCurrentBasket();
 if (basket) {
     // do something with basket
 }
 
 
 
 Constraints:
 
 The method only accesses the basket for the session customer, an exception is thrown when the session
 customer is null.
 Method getCurrentOrNewBasket() only creates a basket when method getCurrentBasket() returns
 null.

### currentOrNewBasket

**Type:** Basket (Read Only)

This method returns the current valid basket of the session customer or creates a new one if no current valid
 basket exists. See getCurrentBasket() for more details.
 
 
 In hybrid storefront scenarios (Phased Launch sites that utilize SFRA/SiteGenesis for some part while also
 utilizing PWA Kit or other custom headless solution for another part of the same site), this method must
 NOT be used. For these scenarios, create baskets via POST baskets REST calls.

### storedBasket

**Type:** Basket (Read Only)

This method returns the stored basket of the session customer or null if none is found. A stored
 basket is returned in the following situation:
 
 During one visit, a customer-Q logs in and creates a basket-A by adding products to it.
 During a subsequent visit, a second basket-B is created for a guest customer who then logs in as
 customer-Q.
 
 In this case, basket-B is reassigned to customer-Q and basket-A is accessible as the stored basket using this
 method. It is now possible to merge the information from the stored basket (basket-A) to the active basket
 (basket-B). If this method returns null in the previous scenario, verify that:
 
 The session handling between the two visits is correct - the first visit and second visit must be in
 different sessions. Furthermore, the second session must contain both basket creations: as guest and the customer
 login.
 The stored basket is not expired.
 Basket persistence settings are configured correctly in the Business Manager.
 
 
 
 A stored basket exists only if the corresponding setting is selected in Business Manager. preferences' baskets
 section. A basket is valid for the configured basket lifetime.
 
 
 Typical usage:

  var currentBasket : Basket = BasketMgr.getCurrentOrNewBasket();
 var storedBasket : Basket = BasketMgr.getStoredBasket();
 if (storedBasket) {
     // transfer all the data needed from the stored to the active basket
 }
 

 A exhaustive example on how to use this method in the context of the Merge Basket functionality can be found
 here: Merge Basket utility
 functions using Script API

### temporaryBaskets

**Type:** List (Read Only)

Retrieve all open temporary baskets for the logged in customer.
 
 Please notice that baskets are invalidated after a certain amount of time and may not be returned anymore.

## Constructor Summary

## Method Summary

### createAgentBasket

**Signature:** `static createAgentBasket() : Basket`

Creates a new agent basket for the current session customer.

### createBasketFromOrder

**Signature:** `static createBasketFromOrder(order : Order) : Basket`

Creates a Basket from an existing Order for the purposes of changing an Order.

### createTemporaryBasket

**Signature:** `static createTemporaryBasket() : Basket`

Creates a new temporary basket for the current session customer.

### deleteBasket

**Signature:** `static deleteBasket(basket : Basket) : void`

Remove a customer basket including a temporary basket.

### deleteTemporaryBasket

**Signature:** `static deleteTemporaryBasket(basket : Basket) : void`

Remove a customer temporary basket.

### getBasket

**Signature:** `static getBasket(uuid : String) : Basket`

This method returns a valid basket of the session customer or null if none is found.

### getBaskets

**Signature:** `static getBaskets() : List`

Retrieve all open baskets for the logged in customer including the temporary baskets.

### getCurrentBasket

**Signature:** `static getCurrentBasket() : Basket`

This method returns the current valid basket of the session customer or null if no current valid basket exists.

### getCurrentOrNewBasket

**Signature:** `static getCurrentOrNewBasket() : Basket`

This method returns the current valid basket of the session customer or creates a new one if no current valid basket exists.

### getStoredBasket

**Signature:** `static getStoredBasket() : Basket`

This method returns the stored basket of the session customer or null if none is found.

### getTemporaryBasket

**Signature:** `static getTemporaryBasket(uuid : String) : Basket`

This method returns a valid temporary basket of the session customer or null if none is found.

### getTemporaryBaskets

**Signature:** `static getTemporaryBaskets() : List`

Retrieve all open temporary baskets for the logged in customer.

## Method Detail

## Method Details

### createAgentBasket

**Signature:** `static createAgentBasket() : Basket`

**Description:** Creates a new agent basket for the current session customer. By default only 4 open agent baskets are allowed per customer. If this is exceeded a CreateAgentBasketLimitExceededException will be thrown. This method will result in an exception if called by a user without permission Create_Order_On_Behalf_Of or if no customer is logged in the session.

**Returns:**

the newly created basket for the customer which is logged in

**Throws:**

CreateAgentBasketLimitExceededException - indicates that no agent basket could be created because the agent basket limit is already exceeded

---

### createBasketFromOrder

**Signature:** `static createBasketFromOrder(order : Order) : Basket`

**Description:** Creates a Basket from an existing Order for the purposes of changing an Order. When an Order is later created from the Basket, the original Order is changed to status Order.ORDER_STATUS_REPLACED. Restricted to agent scenario use cases. In case a storefront customer is using it the created storefront basket cannot be retrieved via getCurrentBasket() (ScriptAPI), GET /baskets/<basketid> (REST APIs) or DELETE /baskets/<basketid> (REST APIs) or GetBasket (Pipelet) or Basket-related CSC Operations from BM (these also use OCAPI REST API). Baskets containing an "orderNumberBeingEdited" are explicitly excluded from the list of baskets that can be retrieved. Responsible for this behavior (this kind of basket cannot be used as general purpose shopping baskets) - see Basket.getOrderNoBeingEdited() / Basket.getOrderBeingEdited(). In case a Business Manager user is logged in into the session the basket will be marked as an agent basket. See Basket.isAgentBasket(). Any inventory reservation associated with the order will be canceled either early when Basket.reserveInventory() is called for the new basket or (later) when a new replacement order is created from the basket. Consider reserving the basket following its creation. The method only succeeds for an Order without gift certificates, status is not cancelled, was not previously replaced and was not previously exported. Failures are indicated by throwing an APIException of type CreateBasketFromOrderException which provides one of these errorCodes: Code OrderProcessStatusCodes.ORDER_CONTAINS_GC - the Order contains a gift certificate and cannot be replaced. Code OrderProcessStatusCodes.ORDER_ALREADY_REPLACED - the Order was already replaced. Code OrderProcessStatusCodes.ORDER_ALREADY_CANCELLED - the Order was cancelled. Code OrderProcessStatusCodes.ORDER_ALREADY_EXPORTED - the Order has already been exported. Usage: var order : Order; // known try { var basket : Basket = BasketMgr.createBasketFromOrder(order); } catch (e) { if (e instanceof APIException && e.type === 'CreateBasketFromOrderException') { // handle e.errorCode } }

**Parameters:**

- `order`: Order to create a Basket for

**Returns:**

a new Basket

**See Also:**

AgentUserMgr.loginAgentUser(String, String)
AgentUserMgr.loginOnBehalfOfCustomer(Customer)

**Throws:**

- `CreateBasketFromOrderException`: indicates the Order is in an invalid state.

---

### createTemporaryBasket

**Signature:** `static createTemporaryBasket() : Basket`

**Description:** Creates a new temporary basket for the current session customer. Temporary baskets are separate from shopper storefront and agent baskets, and are intended for use to perform calculations or create an order without disturbing a shopper's open storefront basket. Temporary baskets are automatically deleted after a time duration of 15 minutes. By default only 4 open temporary baskets are allowed per customer. If this is exceeded a CreateTemporaryBasketLimitExceededException will be thrown.

**Returns:**

the newly created basket for the current session customer

---

### deleteBasket

**Signature:** `static deleteBasket(basket : Basket) : void`

**Description:** Remove a customer basket including a temporary basket. This method will result in an exception if called by a user without permission Create_Order_On_Behalf_Of or if no customer is logged in the session.

**Parameters:**

- `basket`: the basket to be removed

**See Also:**

AgentUserMgr.loginAgentUser(String, String)
AgentUserMgr.loginOnBehalfOfCustomer(Customer)

---

### deleteTemporaryBasket

**Signature:** `static deleteTemporaryBasket(basket : Basket) : void`

**Description:** Remove a customer temporary basket.

**Parameters:**

- `basket`: the temporary basket to be removed

---

### getBasket

**Signature:** `static getBasket(uuid : String) : Basket`

**Description:** This method returns a valid basket of the session customer or null if none is found. This method can also be used to get a temporary basket for the session customer. If the basket does not belong to the session customer, the method returns null. If the registered customer is not logged in, the method returns null. Restricted to agent scenario use cases: This method will result in an exception if called by a user without permission Create_Order_On_Behalf_Of or if no customer is logged in the session. The basket, if accessible, is usually updated in the same way as getCurrentBasket(). If the session currency no longer matches the basket currency, the basket currency should be updated with Basket.updateCurrency().

**Parameters:**

- `uuid`: the id of the requested basket.

**Returns:**

the basket or null

---

### getBaskets

**Signature:** `static getBaskets() : List`

**Description:** Retrieve all open baskets for the logged in customer including the temporary baskets. Restricted to agent scenario use cases: The returned list contains all agent baskets created with createAgentBasket() and the current storefront basket which can also be retrieved with getCurrentBasket(). This method will result in an exception if called by a user without permission Create_Order_On_Behalf_Of or if no customer is logged in the session. Please notice that baskets are invalidated after a certain amount of time and may not be returned anymore.

**Returns:**

all open baskets

---

### getCurrentBasket

**Signature:** `static getCurrentBasket() : Basket`

**Description:** This method returns the current valid basket of the session customer or null if no current valid basket exists. The methods getCurrentBasket() and getCurrentOrNewBasket() work based on the selected basket persistence, which can be configured in the Business Manager site preferences / baskets section. A basket is valid for the configured basket lifetime. In hybrid storefront scenarios (Phased Launch sites that utilize SFRA/SiteGenesis for some part while also utilizing PWA Kit or other custom headless solution for another part of the same site), this method must NOT be used. Instead, retrieve baskets via GET baskets/{basketId} or GET customers/{customerId}/baskets. Do not use getCurrentOrNewBasket() for basket creation in any scenario. The current basket, if one exists, is usually updated by the method. In particular the last-modified date is updated. No update is done when method getCurrentBasket() is used within a read-only hook implementation (such as a beforeGet or a modifyResponse hook). The lifetime of a basket can be extended in 2 ways: The basket is modified in some way, e.g. a product is added resulting in the basket total being newly calculated. This results in the basket lifetime being reset. The basket has not been modified for 60 minutes, then using this method to access the basket will also reset the basket lifetime. What happens when a customer logs in? Personal data held inside the basket such as addresses, email addresses and payment settings is associated with the customer to whom the basket belongs. If the basket being updated belongs to a different customer this data is removed. This happens when a guest customer that has a basket logs in and hence identifies as a registered customer. In this case the basket which was previously created by the guest customer gets transferred to the (now logged in) registered customer. Should the registered customer already have a basket, this basket is effectively invalidated, but made available using getStoredBasket() allowing the script to merge content from it if desired. What happens when a customer logs out or when the customer session times out? After the customer logs out, a basket belonging to the registered customer (now logged out) is stored (where applicable) and this method returns null. Personal data is also cleared when the session times out for a guest customer. The following personal data is cleared: product line items that were added from a wish list shipping method coupon line items gift certificate line items billing and shipping addresses payment instruments buyer email If the session currency no longer matches the basket currency, the basket currency should be updated with Basket.updateCurrency(). Typical usage: var basket : Basket = BasketMgr.getCurrentBasket(); if (basket) { // do something with basket } Constraints: The method only accesses the basket for the session customer, an exception is thrown when the session customer is null. Method getCurrentOrNewBasket() only creates a basket when method getCurrentBasket() returns null.

**Returns:**

the current basket or null if no valid current basket exists.

---

### getCurrentOrNewBasket

**Signature:** `static getCurrentOrNewBasket() : Basket`

**Description:** This method returns the current valid basket of the session customer or creates a new one if no current valid basket exists. See getCurrentBasket() for more details. In hybrid storefront scenarios (Phased Launch sites that utilize SFRA/SiteGenesis for some part while also utilizing PWA Kit or other custom headless solution for another part of the same site), this method must NOT be used. For these scenarios, create baskets via POST baskets REST calls.

**Returns:**

the basket, existing or newly created

---

### getStoredBasket

**Signature:** `static getStoredBasket() : Basket`

**Description:** This method returns the stored basket of the session customer or null if none is found. A stored basket is returned in the following situation: During one visit, a customer-Q logs in and creates a basket-A by adding products to it. During a subsequent visit, a second basket-B is created for a guest customer who then logs in as customer-Q. In this case, basket-B is reassigned to customer-Q and basket-A is accessible as the stored basket using this method. It is now possible to merge the information from the stored basket (basket-A) to the active basket (basket-B). If this method returns null in the previous scenario, verify that: The session handling between the two visits is correct - the first visit and second visit must be in different sessions. Furthermore, the second session must contain both basket creations: as guest and the customer login. The stored basket is not expired. Basket persistence settings are configured correctly in the Business Manager. A stored basket exists only if the corresponding setting is selected in Business Manager. preferences' baskets section. A basket is valid for the configured basket lifetime. Typical usage: var currentBasket : Basket = BasketMgr.getCurrentOrNewBasket(); var storedBasket : Basket = BasketMgr.getStoredBasket(); if (storedBasket) { // transfer all the data needed from the stored to the active basket } A exhaustive example on how to use this method in the context of the Merge Basket functionality can be found here: Merge Basket utility functions using Script API

**Returns:**

the stored basket or null if no valid stored basket exists.

---

### getTemporaryBasket

**Signature:** `static getTemporaryBasket(uuid : String) : Basket`

**Description:** This method returns a valid temporary basket of the session customer or null if none is found. If the basket does not belong to the session customer, the method returns null. If the basket is not a temporary basket, the method returns null. The basket, if accessible, is usually updated in the same way as getCurrentBasket(). If the session currency no longer matches the basket currency, the basket currency should be updated with Basket.updateCurrency().

**Parameters:**

- `uuid`: the id of the requested temporary basket.

**Returns:**

the temporary basket or null

---

### getTemporaryBaskets

**Signature:** `static getTemporaryBaskets() : List`

**Description:** Retrieve all open temporary baskets for the logged in customer. Please notice that baskets are invalidated after a certain amount of time and may not be returned anymore.

**Returns:**

all open temporary baskets

---
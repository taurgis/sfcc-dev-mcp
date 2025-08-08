## Package: dw.web

# Class URLAction

## Inheritance Hierarchy

- Object
  - dw.web.URLAction

## Description

The class is needed for the URL creation within template processing. It represents a reference to a pipeline name and start node, usually used in a HREF or a FORM action. URLAction instances are usually passed to one of the methods in URLUtils in order to generate an appropriately constructed Commerce Cloud Digital URL. For example: var urlAction : URLAction = new URLAction("SimplePipeline-Start", "SampleSite"); var url : URL = URLUtils.abs(false, urlAction1); // url.toString() equals "http://" + request.httpHost + "/on/demandware.store/Sites-SampleSite-Site/default/SimplePipeline-Start"

## Constructor Summary

URLAction(action : String) Constructs an action for the current site and locale.

URLAction(action : String, siteName : String) Constructs an action for the specified site and the current locale.

URLAction(action : String, siteName : String, locale : String) Constructs an action for the specified site and locale.

URLAction(action : String, siteName : String, locale : String, hostName : String) Constructs an URL action for the specified site, locale and hostname.

## Method Summary

## Constructor Detail
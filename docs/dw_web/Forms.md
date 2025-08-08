## Package: dw.web

# Class Forms

## Inheritance Hierarchy

- Object
  - dw.web.Forms

## Description

The Forms object provides access to all current forms in the session. The individual forms are retrieved as a dynamic property, for example 'forms.searchform'. It is typically retrieved from the session via Session.getForms(). But it is also available in the PipelineDictionary and can be accessed via 'pdict.CurrentForms'. Note that values stored with a form on the session are deleted if the request locale is changed during the session.

## Constructor Summary

## Method Summary
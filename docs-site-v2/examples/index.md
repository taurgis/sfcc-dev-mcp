---
title: Example Prompts
description: Use tested SFCC Dev MCP prompt examples for docs lookup, log triage, system object analysis, and cartridge generation.
---

# Examples

Short, focused prompts that map to common workflows. Each section shows a prompt, the typical tool calls, and the expected outcome.

## Docs mode examples

### Explore an SFCC class quickly

Prompt:

```
Show me the most important methods on dw.catalog.Product for pricing and variation handling.
```

Typical tools:

- `search_sfcc_classes`
- `get_sfcc_class_info`

Expected output:

```markdown
Focused summary of dw.catalog.Product with pricing, availability, and variation methods.
```

### Focused class exploration

Prompt:

```
I need only price and availability related getters on dw.catalog.Product. No other methods.
```

Typical tools:

- `get_sfcc_class_info` with `search` and `includeProperties=false`

### SFRA lookup

Prompt:

```
Find SFRA docs for middleware and summarize how to use it in a controller.
```

Typical tools:

- `search_sfra_documentation`
- `get_sfra_document`

### Generate a controller from documentation context

Prompt:

```
Using SFRA patterns, create a Product-Show controller that handles missing products, logs errors, and renders price and availability.
```

Typical tools:

- `get_sfcc_class_info` (Product and PriceModel)
- `get_sfra_document` (server)

### Generate a cartridge

Prompt:

```
Generate a cartridge named int_tracking with controller, hook, and service placeholders.
```

Typical tools:

- `generate_cartridge_structure`

Expected output:

```text
int_tracking/
	cartridge/
		controllers/
		scripts/
		templates/
```

### Scaffold a feature cartridge (with next steps)

Prompt:

```
Generate a cartridge structure for a shipment tracking integration using hooks + a service layer and note follow-up tasks.
```

Typical tools:

- `generate_cartridge_structure`
- `sync_agent_instructions` (optional guidance)

Expected output:

```markdown
Generated tree (excerpt):

int_tracking/
	cartridge/
		controllers/Tracking.js
		scripts/hooks/shipment.js
		scripts/services/TrackingService.js
		templates/default/tracking/trackingstatus.isml
		static/default/js/tracking/

Assistant adds next steps:
1) Configure LocalServiceRegistry service: tracking.api
2) Implement hooks: updateShippingInfo, exportStatus
3) Add ISML partial to PDP for shipment ETA
4) Add logging category: TrackingIntegration
5) Write integration test harness for mocked API responses
```

## Full mode examples

### Log triage

Prompt:

```
Summarize errors from the last day and call out the most common patterns.
```

Typical tools:

- `summarize_logs`
- `get_latest_error`
- `search_logs`

Expected output:

```markdown
1) summarize_logs → Errors: 0, Warnings: 27 (no error file today)
2) search_logs (pattern=cookie_hint, level=warn) → repeated offline content asset warnings

Assessment:
- Warning noise masks future issues; no payment/auth errors detected.

Recommended actions:
- Restore or remove cookie_hint asset, or gate include by site preference.
- Re-run summarize_logs after remediation to confirm warning reduction.
```

### Job log analysis

Prompt:

```
Analyze the latest ProductFeed job log and summarize failures and slow steps.
```

Typical tools:

- `search_job_logs_by_name`
- `get_job_log_entries`
- `get_job_execution_summary`

Expected output:

```markdown
Flow:
1) search_job_logs_by_name → confirm job log filenames
2) get_job_log_entries (limit 50) → capture recent step activity
3) get_job_execution_summary → aggregate timings and status

Findings:
- Duration +18% vs rolling average
- EXPORT step shows retries (socket timeouts)

Recommendations:
- Reduce batch size and add exponential backoff with jitter
- Track step_duration_ms and retry_count metrics
```

### Script evaluation

Prompt:

```
Check if product 25518704M exists and return name plus current price.
```

Typical tools:

- `evaluate_script`

Example script:

```javascript
(function() {
	var ProductMgr = require('dw/catalog/ProductMgr');
	var p = ProductMgr.getProduct('25518704M');
	if (!p) return 'Not found';
	return JSON.stringify({ id: p.ID, name: p.name, price: p.getPriceModel().getPrice().value });
})()
```

### System object attributes

Prompt:

```
List custom Product attributes that impact pricing or display and show access examples.
```

Typical tools:

- `search_system_object_attribute_definitions`

Expected output:

```markdown
Curated Product attributes (custom only):
- brandDisplayName (Disp) → p.custom.brandDisplayName
- shippingClass (Ship) → p.custom.shippingClass
- careInstructions (Content) → p.custom.careInstructions

Notes:
- Excluded system attributes unless required for pricing/availability.
- Provide access snippets for each custom attribute.
```

### Site preference search

Prompt:

```
Find checkout site preferences related to tax and shipping.
```

Typical tools:

- `search_site_preferences`

Expected output:

```markdown
Group: checkout
- enableTaxCalculation (boolean)
- enableShippingMethodSelector (boolean)

Usage:
Site.current.getCustomPreferenceValue('enableTaxCalculation')
```

### Custom object attributes

Prompt:

```
For custom object type Global_String, list searchable attributes and show a script access snippet.
```

Typical tools:

- `search_custom_object_attribute_definitions`

Expected output:

```markdown
Custom object type: Global_String
- searchable: altValueMapping, sourceKey

Script access:
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var co = CustomObjectMgr.getCustomObject('Global_String', key);
var mapped = co && co.custom.altValueMapping;
```

### Micro job log triage

Prompt:

```
Give me a 3-step health read for the nightly InventorySync job and only call tools you truly need.
```

Typical tools:

- `search_job_logs_by_name`
- `get_job_log_entries`
- `get_job_execution_summary`

Expected output:

```markdown
Outcome: SUCCESS (duration 2m14s, 0 errors, 3 warnings)
Warnings:
- 2x External API 429 backoffs (within threshold)
- 1x Deprecated attribute reference

Next actions (only if persistent):
1) Track retry ratio vs baseline
2) Replace deprecated attribute before Q4 freeze
```

## Prompt patterns

Good prompts are specific about scope and expected output:

- "Only include pricing-related methods."
- "Use live logs before suggesting fixes."
- "Provide the final code block only."

Avoid prompts that are too broad:

- "Explain everything about SFCC."
- "Fix checkout." (no context)

### Prompt refinement example

Weak:

```
Help with product page.
```

Improved:

```
Generate an SFRA controller extension to enrich Product-Show with cached ATS and a badge if sustainabilityRating >= 3. Provide only changed code + the template snippet.
```

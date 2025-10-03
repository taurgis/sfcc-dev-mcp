# ISML isanalyticsoff Element

## Overview

The `<isanalyticsoff>` element disables the automatic JavaScript analytics and active merchandising tracking snippet that Commerce Cloud normally includes on every HTML page. This is an emergency-use element that should only be used in specific problem scenarios where analytics tracking causes critical issues with page functionality.

⚠️ **CRITICAL WARNING:** This element prevents proper analytics and active merchandising data collection. Use only as a last resort for specific pages in emergency situations.

## Syntax

```isml
<isanalyticsoff/>
```

## Attributes

**None** - This is a self-closing tag with no attributes.

## Purpose

Commerce Cloud automatically injects a JavaScript tracking snippet into every HTML page for:

1. **Analytics Tracking:** Customer behavior, page views, conversions
2. **Active Merchandising:** Product performance and merchandising effectiveness
3. **Einstein AI:** Data collection for recommendations and personalization
4. **Business Intelligence:** Sales and customer insights

The `<isanalyticsoff>` element **disables** this automatic injection for the specific page where it appears.

### Default Analytics Behavior

By default, every page includes a snippet similar to:

```html
<!-- B2C Commerce Analytics code -->
<script type="text/javascript" src="/on/demandware.static/.../dwanalytics.js"></script>
<script type="text/javascript">
  var trackingUrl = "https://.../__Analytics-Tracking";
  var dwAnalytics = dw.__dwAnalytics.getTracker(trackingUrl);
  if (typeof dw.ac == "undefined") {
    dwAnalytics.trackPageView();
  } else {
    dw.ac.setDWAnalytics(dwAnalytics);
  }
</script>
```

Using `<isanalyticsoff/>` **prevents** this code from being injected.

## When to Use (Emergency Only)

### Valid Use Cases

Use `<isanalyticsoff/>` **only** in these rare scenarios:

1. **Cross-Site Scripting (XSS) Concerns:**
   - HTTPS iframe scenarios where analytics code is flagged as a security threat
   - Content Security Policy (CSP) violations caused by analytics scripts
   - Third-party security scanning tools flagging the analytics code

2. **JavaScript Conflicts:**
   - Critical page functionality breaks due to analytics script conflicts
   - Third-party integration incompatibilities with dwanalytics.js
   - Testing or debugging scenarios where analytics must be isolated

3. **Technical Requirements:**
   - Pages served in restricted contexts (iframes, embeds)
   - Internal tools or administrative pages
   - Special rendering contexts where analytics is inappropriate

4. **Performance Critical Pages:**
   - Extreme performance requirements where every millisecond counts
   - High-frequency polling endpoints
   - Real-time data delivery pages

### When NOT to Use

❌ **Do NOT use** for:
- General performance optimization (minimal impact)
- Personal preference or convenience
- Avoiding analytics in development (use site preferences instead)
- Production pages without a specific technical reason
- Customer-facing commerce pages (severely impacts business intelligence)

## Placement

Place the tag at the **end of the template**, after all content:

```isml
<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    <!-- Page content -->
</body>
</html>

<isanalyticsoff/>
```

**Why at the end?**
- Ensures all page content is processed first
- Prevents interference with page rendering
- Matches the position where analytics code would normally be injected

## Common Use Cases

### HTTPS Iframe Scenario

```isml
<!-- iframe-content.isml -->
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<!DOCTYPE html>
<html>
<head>
    <title>Embedded Content</title>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
</head>
<body>
    <div class="embedded-widget">
        <!-- Widget content that will be displayed in HTTPS iframe -->
        <h2>Secure Embedded Content</h2>
        <p>This content is served in an iframe with strict CSP.</p>
    </div>
</body>
</html>

<!-- Disable analytics to prevent cross-site scripting concerns in iframe -->
<isanalyticsoff/>
```

### Third-Party Integration Page

```isml
<!-- payment-provider-frame.isml -->
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<!DOCTYPE html>
<html>
<head>
    <title>Payment Processing</title>
</head>
<body>
    <!-- Third-party payment widget -->
    <div id="payment-widget">
        <isinclude template="payment/thirdPartyWidget" />
    </div>
</body>
</html>

<!-- Disable analytics to prevent conflicts with payment provider scripts -->
<isanalyticsoff/>
```

### Internal Tool or Admin Page

```isml
<!-- admin/reports-export.isml -->
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<!DOCTYPE html>
<html>
<head>
    <title>Export Report</title>
</head>
<body>
    <div class="admin-tool">
        <!-- Internal reporting tool -->
        <h1>Data Export Utility</h1>
        <isinclude template="admin/exportForm" />
    </div>
</body>
</html>

<!-- Disable analytics - internal tool, not customer-facing -->
<isanalyticsoff/>
```

### AJAX Endpoint Response

```isml
<!-- ajax/product-quickview.isml -->
<iscontent type="text/html" charset="UTF-8" compact="true"/>

<div class="quickview-content">
    <h2>${pdict.Product.name}</h2>
    <p>${pdict.Product.shortDescription}</p>
    <span class="price">${pdict.Product.price}</span>
</div>

<!-- Disable analytics - this is a fragment loaded via AJAX -->
<isanalyticsoff/>
```

### Content Security Policy Page

```isml
<!-- secure-checkout-step.isml -->
<iscontent type="text/html" charset="UTF-8" compact="true"/>
<!DOCTYPE html>
<html>
<head>
    <title>Secure Checkout</title>
    <meta http-equiv="Content-Security-Policy" 
          content="default-src 'self'; script-src 'self' https://trusted-cdn.com;">
</head>
<body>
    <!-- Checkout form with strict CSP -->
    <isinclude template="checkout/secureForm" />
</body>
</html>

<!-- Disable analytics if it violates CSP -->
<isanalyticsoff/>
```

## Impact and Consequences

### Data Loss

When you use `<isanalyticsoff/>`, you lose:

| Lost Data | Impact |
|-----------|--------|
| **Page Views** | No record of customer visiting the page |
| **Product Views** | Product performance metrics incomplete |
| **Conversion Tracking** | Funnel analysis breaks for this page |
| **User Journey** | Customer path tracking has gaps |
| **Einstein Data** | Recommendations less accurate |
| **A/B Testing** | Test results incomplete or invalid |
| **Active Merchandising** | Merchandising effectiveness unknown |
| **Business Intelligence** | Reports and dashboards show incomplete data |

### Business Impact

- ❌ **Marketing:** Cannot measure campaign effectiveness for affected pages
- ❌ **Merchandising:** Cannot optimize product placement or promotions
- ❌ **Analytics:** Incomplete funnel analysis and conversion metrics
- ❌ **Einstein AI:** Reduced data for personalization and recommendations
- ❌ **Reporting:** Gaps in business intelligence dashboards

## Alternative Solutions

Before using `<isanalyticsoff/>`, consider these alternatives:

### 1. Site-Wide Disable via Customer Support

For broader issues, contact Salesforce Customer Support to disable analytics site-wide:

**Advantages:**
- Controlled and documented
- Can be reversed easily
- Affects all pages consistently

**When to use:**
- Analytics causing widespread issues
- Need coordinated solution across all pages
- Temporary disable during troubleshooting

### 2. Content Security Policy Adjustments

Instead of disabling analytics, adjust your CSP:

```html
<!-- Allow analytics scripts in CSP -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://*.demandware.net;">
```

### 3. Conditional Analytics in Templates

Use ISML conditions to control analytics inclusion:

```isml
<isset name="disableAnalytics" value="${pdict.isInternalPage}" scope="page" />

<!-- Analytics will be disabled if disableAnalytics is true -->
<isif condition="${disableAnalytics}">
    <isanalyticsoff/>
</isif>
```

### 4. Fragment Templates Without Full HTML

Create fragment templates that don't generate full HTML pages:

```isml
<!-- No <html>, <head>, or <body> tags -->
<div class="ajax-content">
    ${pdict.content}
</div>
<!-- Analytics code not injected in fragments by default -->
```

### 5. AJAX Response Format

Return JSON or XML instead of HTML:

```isml
<iscontent type="application/json" charset="UTF-8"/>
${JSON.stringify(pdict.data)}
```

## Best Practices

1. **Document Usage:**
   ```isml
   <!-- 
       ANALYTICS DISABLED
       Reason: CSP violation in HTTPS iframe
       Date: 2025-10-03
       Ticket: SUPPORT-12345
   -->
   <isanalyticsoff/>
   ```

2. **Use Sparingly:**
   - Only on specific problem pages
   - Not on main customer journey pages
   - Document every usage

3. **Monitor Impact:**
   - Track which pages have analytics disabled
   - Review periodically to see if still necessary
   - Monitor for business intelligence gaps

4. **Consider Page Type:**
   ```isml
   <!-- Good: Internal tool page -->
   <isif condition="${pdict.isInternalTool}">
       <isanalyticsoff/>
   </isif>
   
   <!-- Bad: Product detail page -->
   <!-- Never disable on main commerce pages -->
   ```

5. **Test Alternatives First:**
   - Try CSP adjustments
   - Test script load order changes
   - Contact support for guidance
   - Use `<isanalyticsoff/>` as last resort

6. **Review Regularly:**
   ```isml
   <!-- 
       TODO: Review if still needed
       Added: 2025-10-03
       Next review: 2025-11-03
   -->
   <isanalyticsoff/>
   ```

## Testing and Validation

### Verify Analytics is Disabled

1. **View Page Source:**
   ```html
   <!-- Should NOT see this if isanalyticsoff is working -->
   <script type="text/javascript" src="/.../dwanalytics.js"></script>
   ```

2. **Browser DevTools:**
   - Check Network tab for absence of analytics requests
   - Verify no `dwanalytics.js` loaded
   - Check for no `__Analytics-Tracking` calls

3. **Console Check:**
   ```javascript
   // Should return undefined if analytics is off
   console.log(typeof dw.__dwAnalytics);
   ```

### Validate Proper Placement

```isml
<!-- Correct: At end of template -->
</body>
</html>
<isanalyticsoff/>

<!-- Incorrect: In middle of template -->
<body>
    <isanalyticsoff/>  <!-- Too early -->
    <div>Content</div>
</body>
```

## Troubleshooting

### Analytics Still Appearing

**Check:**
1. Tag is at the end of the template
2. Template is actually being rendered (not cached)
3. No parent template is overriding the setting

### Page Behavior Changed

**Check:**
1. Scripts that depended on analytics framework
2. Third-party integrations expecting analytics data
3. Custom code referencing `dw.__dwAnalytics`

### Business Reports Show Gaps

**Expected:**
- Pages with `<isanalyticsoff/>` won't appear in reports
- User journeys will have gaps
- Conversion funnels may be incomplete

**Solution:**
- Document affected pages
- Adjust reporting queries to account for gaps
- Consider alternative tracking methods

## Compliance and Governance

### Documentation Requirements

When using `<isanalyticsoff/>`:

1. **Create Ticket:** Document why analytics is disabled
2. **Code Comments:** Add clear comments explaining usage
3. **Team Communication:** Inform analytics and business teams
4. **Review Schedule:** Set up periodic reviews
5. **Alternative Tracking:** Implement alternative data collection if possible

### Approval Process

Consider requiring approval for:
- Using `<isanalyticsoff/>` on production pages
- Disabling analytics on customer-facing pages
- Long-term analytics disabling

## Migration and Maintenance

### SiteGenesis to SFRA

```isml
<!-- SiteGenesis -->
<isanalyticsoff/>

<!-- SFRA (same syntax, evaluate if still needed) -->
<isanalyticsoff/>
```

When migrating, **review all usages**:
- Are they still necessary?
- Can SFRA's architecture solve the original problem?
- Should they be replaced with alternative solutions?

### Regular Audit

Periodically audit all `<isanalyticsoff/>` usages:

```bash
# Find all usages
grep -r "isanalyticsoff" cartridges/
```

Review each occurrence:
- Is it still needed?
- Can it be removed?
- Should alternative solution be used?

## Related Elements

- `<isactivedatahead>` - Initializes analytics (opposite function)
- `<isactivedatacontext>` - Sets category context (disabled when analytics is off)
- `<iscomment>` - For documenting why analytics is disabled

## Security Considerations

### CSP and XSS

The element was designed to address:
- Cross-Site Scripting (XSS) concerns in iframes
- Content Security Policy violations
- Third-party security scanner warnings

### Privacy Compliance

Disabling analytics may affect:
- GDPR compliance tracking
- Cookie consent tracking
- Privacy preference enforcement

Ensure alternative compliance mechanisms are in place.

## Notes

- This element is part of the official ISML API but strongly discouraged
- Commerce Cloud recommends contacting support for site-wide disabling
- Use only for single pages in emergency situations
- Prevents ALL automatic analytics tracking for the page
- Has no visual impact; only affects tracking code injection
- Cannot be conditionally applied (it's always active when present)
- Does not affect custom analytics implementations
- Should be thoroughly documented when used

## Emergency Use Checklist

Before using `<isanalyticsoff/>`:

- [ ] Tried all alternative solutions
- [ ] Documented the specific problem
- [ ] Identified affected business metrics
- [ ] Informed stakeholders (analytics, business, merchandising teams)
- [ ] Created support ticket if appropriate
- [ ] Added code comments explaining usage
- [ ] Set up review schedule
- [ ] Confirmed page type is appropriate (not main commerce page)
- [ ] Tested that analytics is actually disabled
- [ ] Documented data loss impact

## Support and Escalation

If you need to disable analytics:

1. **Contact Salesforce Support** for site-wide disabling
2. **Document the issue** with specific error messages
3. **Provide reproduction steps** for the problem
4. **Consider temporary page disable** while support investigates
5. **Request guidance** on proper solution

**Support Ticket Template:**
```
Issue: Analytics tracking causing [specific problem]
Page(s) Affected: [template names]
Error Messages: [specific errors]
CSP Violations: [yes/no, details]
Business Impact: [describe]
Requested Action: [site-wide disable / guidance / etc.]
```
---
name: salesforce-help-site-scraper
description: 'Scrape Salesforce Help articles into clean Markdown with consent handling and content cleanup. Use when you need an internal, readable snapshot of Help content for research or documentation support.'
license: Forward Proprietary
compatibility: VS Code 1.x+, Node.js 18+
---

# Salesforce Help Site Scraper

Use this skill to extract Salesforce Help article content into clean Markdown when pages render dynamically or are blocked by consent banners.

## When to Use This Skill

- You need a readable Markdown snapshot of a Help article for internal research.
- OneTrust cookie banners block access to the main content.
- You want to remove headers, footers, or navigation chrome before extraction.
- NOT for: high-volume crawling, bypassing access controls, or republishing Salesforce content.

## Prerequisites

- Node.js 18+
- Scraper script at `skills/salesforce-help-site-scraper/scripts/scrape-help-to-markdown.js`

## How to Use

### Basic Usage

```bash
node skills/salesforce-help-site-scraper/scripts/scrape-help-to-markdown.js \
  --url "https://help.salesforce.com/s/articleView?id=sf.flow.htm&type=5" \
  --out "./artifacts/online-research/help_flow_overview.md" \
  --consent-selector "#onetrust-accept-btn-handler" \
  --remove-selectors "header,footer,nav,aside" \
  --wait 2500
```

### Script Options

| Option | Required | Description |
| --- | --- | --- |
| `--url` | Yes | Target Help article URL. |
| `--out` | Yes | Output Markdown file path. |
| `--consent-selector` | No | Selector for cookie/consent accept button (OneTrust). |
| `--remove-selectors` | No | Comma-separated selectors to remove before extraction. |
| `--wait` | No | Milliseconds to wait after navigation or consent click. |

## Compliance Notes

- Prefer the Salesforce Knowledge APIs for structured, supported access where possible.
- Check and respect `robots.txt` before scraping.
- Do not republish or redistribute Salesforce Help content.
- Attribute content to Salesforce when used internally.

## Examples

### Example: Capture a Flow Help article

```bash
node skills/salesforce-help-site-scraper/scripts/scrape-help-to-markdown.js \
  --url "https://help.salesforce.com/s/articleView?id=sf.flow_build.htm&type=5" \
  --out "./artifacts/online-research/help_flow_build.md" \
  --consent-selector "#onetrust-accept-btn-handler" \
  --remove-selectors "header,footer,nav,aside" \
  --wait 2500
```

## Troubleshooting

### Issue: Output is empty or too short

**Solution**: Increase `--wait` or refine `--remove-selectors` to avoid removing the main content container.

### Issue: Consent banner blocks content

**Solution**: Provide `--consent-selector` for the OneTrust accept button.

## References

- Salesforce Help: https://help.salesforce.com/
- Salesforce Knowledge Developer Guide: https://developer.salesforce.com/docs/atlas.en-us.knowledge_dev.meta/knowledge_dev/
- Salesforce REST API - Knowledge Resources: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_knowledge.htm
- Salesforce Master Subscription Agreement: https://www.salesforce.com/company/legal/agreements/
- Salesforce Intellectual Property and Trademarks: https://www.salesforce.com/company/legal/intellectual/
- Robots Exclusion Protocol (RFC 9309): https://www.rfc-editor.org/rfc/rfc9309

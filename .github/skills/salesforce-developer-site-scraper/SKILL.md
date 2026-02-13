---
name: salesforce-developer-site-scraper
description: 'Scrape Salesforce Developer documentation into clean Markdown using headless Chromium, Readability, and the docs content API fallback. Use when content is async or blocked by OneTrust cookie banners.'
license: Forward Proprietary
compatibility: VS Code 1.x+, Node.js 18+
---

# Salesforce Developer Site Scraper

Use this skill to capture Salesforce Developer documentation pages as clean Markdown even when content loads asynchronously or is blocked by OneTrust cookie banners.

## When to Use This Skill

- A Salesforce Developer doc page renders key content after async requests.
- A OneTrust cookie banner hides content until consent is accepted.
- You need a readable Markdown snapshot for Apex, LWC, or platform docs.
- NOT for: high-volume crawling or scraping behind access restrictions.

## Prerequisites

- Node.js 18+
- npm dependencies for the script (see below)

## How to Use

### 1) Install script dependencies (if not done already)

```bash
npm install playwright @mozilla/readability jsdom turndown
```

### 2) Run the script

```bash
node skills/salesforce-developer-site-scraper/scripts/scrape-to-markdown.js \
  --url "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_intro.htm" \
  --out "./artifacts/online-research/apex_intro.md" \
  --consent-selector "#onetrust-accept-btn-handler" \
  --wait 2000
```

## Script Options

| Option | Required | Description |
| --- | --- | --- |
| `--url` | Yes | Target URL to fetch and extract. |
| `--out` | Yes | Output Markdown file path. |
| `--consent-selector` | No | CSS or text selector for a cookie banner accept button. |
| `--wait` | No | Milliseconds to wait after navigation or consent click. |
| `--content-selector` | No | Extract only this element instead of Readability parsing. |
| `--remove-selectors` | No | Comma-separated selectors to remove before extraction. |
| `--cookie` | No | Consent/session cookie, e.g. `name=value;domain=example.com;path=/`. |
| `--storage-state` | No | Playwright storage state JSON file to reuse consent/session. |
| `--timeout` | No | Navigation timeout in ms (default 45000). |
| `--no-default-removals` | No | Disable default cookie/consent element removals. |

## Compliance Notes

- Respect robots.txt and site terms before scraping.
- Use consent cookies or storage state only when you have permission.
- Avoid collecting personal data unless you have a legal basis.

## Examples

### Example: Reuse a consent state

```bash
node skills/salesforce-developer-site-scraper/scripts/scrape-to-markdown.js \
  --url "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_intro.htm" \
  --out "./artifacts/online-research/apex_intro.md" \
  --storage-state "./artifacts/online-research/consent-state.json"
```

### Example: Extract a specific content container

```bash
node skills/salesforce-developer-site-scraper/scripts/scrape-to-markdown.js \
  --url "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_intro.htm" \
  --out "./artifacts/online-research/apex_intro.md" \
  --content-selector "main article"
```

## Troubleshooting

### Issue: Output is empty or too short

**Solution**: Add `--wait` or provide a `--content-selector` for the primary content node.

### Issue: Cookie banner blocks content

**Solution**: Provide `--consent-selector` (OneTrust) or reuse a `--storage-state` with consent already saved.

## References

- Playwright Docs: https://playwright.dev/docs/intro
- Playwright Cookies: https://playwright.dev/docs/api/class-browsercontext#browser-context-add-cookies
- Playwright Storage State: https://playwright.dev/docs/auth#reuse-authentication-state
- Readability (Mozilla): https://github.com/mozilla/readability
- DOMParser (MDN): https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
- Robots Exclusion Protocol (RFC 9309): https://www.rfc-editor.org/rfc/rfc9309
- GDPR: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- ePrivacy Directive: https://eur-lex.europa.eu/eli/dir/2002/58/oj

#!/usr/bin/env node

'use strict';

const fs = require('fs/promises');
const path = require('path');
const { chromium } = require('playwright');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');
const TurndownService = require('turndown');

const DEFAULT_TIMEOUT_MS = 45000;
const DEFAULT_REMOVE_SELECTORS = [
  '#onetrust-consent-sdk',
  '#onetrust-banner-sdk',
  '.onetrust-pc-sdk',
  '.ot-sdk-container',
  '.ot-sdk-row',
  '#ot-sdk-btn',
  '.ot-sdk-show-settings',
  'iframe[id*="onetrust"]',
  'iframe[src*="onetrust"]',
  '[id*="onetrust"]',
  '[class*="onetrust"]',
];

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function parseCookie(cookieStr) {
  if (!cookieStr) return null;
  const parts = cookieStr.split(';').map((part) => part.trim());
  const [nameValue, ...attrs] = parts;
  const eqIndex = nameValue.indexOf('=');
  if (eqIndex === -1) return null;
  const cookie = {
    name: nameValue.slice(0, eqIndex),
    value: nameValue.slice(eqIndex + 1),
  };
  for (const attr of attrs) {
    const [key, value] = attr.split('=');
    if (!key) continue;
    const normalized = key.toLowerCase();
    if (normalized === 'domain') cookie.domain = value;
    if (normalized === 'path') cookie.path = value;
    if (normalized === 'secure') cookie.secure = true;
    if (normalized === 'samesite') cookie.sameSite = value;
  }
  return cookie;
}

function parseList(listStr) {
  if (!listStr) return [];
  return listStr
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function requireArg(flag, value) {
  if (!value) {
    console.error(`Missing required argument: ${flag}`);
    process.exit(1);
  }
}

async function main() {
  const url = getArg('--url');
  const outPath = getArg('--out');
  const consentSelector = getArg('--consent-selector');
  const waitMs = Number(getArg('--wait') || 0);
  const contentSelector = getArg('--content-selector');
  const removeSelectorsArg = getArg('--remove-selectors');
  const cookieStr = getArg('--cookie');
  const storageState = getArg('--storage-state');
  const timeoutMs = Number(getArg('--timeout') || DEFAULT_TIMEOUT_MS);
  const disableDefaultRemovals = hasFlag('--no-default-removals');

  requireArg('--url', url);
  requireArg('--out', outPath);

  const browser = await chromium.launch({ headless: !hasFlag('--headed') });
  const contextOptions = storageState ? { storageState } : {};
  const context = await browser.newContext(contextOptions);

  let docsApiContent = null;
  let docsApiTitle = null;

  const cookie = parseCookie(cookieStr);
  if (cookie && cookie.domain) {
    await context.addCookies([cookie]);
  }

  const page = await context.newPage();
  page.on('response', async (response) => {
    const responseUrl = response.url();
    if (!responseUrl.includes('/docs/get_document_content/')) return;
    try {
      const payload = await response.json();
      if (payload && payload.content) {
        docsApiContent = payload.content;
        docsApiTitle = payload.title || payload.id || docsApiTitle;
      }
    } catch (error) {
      // Ignore non-JSON responses.
    }
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: timeoutMs });

  if (consentSelector) {
    try {
      await page.locator(consentSelector).first().click({ timeout: 3000 });
      await page.waitForLoadState('networkidle', { timeout: timeoutMs });
    } catch (error) {
      console.warn('Consent selector not found or not clickable. Continuing.');
    }
  }

  if (waitMs > 0) {
    await page.waitForTimeout(waitMs);
  }

  const removeSelectors = [
    ...(disableDefaultRemovals ? [] : DEFAULT_REMOVE_SELECTORS),
    ...parseList(removeSelectorsArg),
  ];
  if (removeSelectors.length > 0) {
    await page.evaluate((selectors) => {
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((node) => node.remove());
      });
    }, removeSelectors);
  }

  let html = null;
  let title = null;

  if (contentSelector) {
    try {
      html = await page.locator(contentSelector).first().evaluate((el) => el.outerHTML);
      title = await page.title();
    } catch (error) {
      console.warn('Content selector not found. Falling back to Readability.');
    }
  }

  if (!html && !contentSelector) {
    try {
      html = await page.locator('main, article').first().evaluate((el) => el.outerHTML);
      title = await page.title();
    } catch (error) {
      // Fall through to Readability.
    }
  }

  if (!html) {
    const pageContent = await page.content();
    const dom = new JSDOM(pageContent, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (article && article.content) {
      html = article.content;
      title = article.title || await page.title();
    } else {
      html = dom.window.document.body ? dom.window.document.body.innerHTML : pageContent;
      title = await page.title();
    }
  }

  const turndown = new TurndownService({ headingStyle: 'atx' });
  let markdownBody = turndown.turndown(html || '');

  if (markdownBody.trim().length < 80 && docsApiContent) {
    markdownBody = turndown.turndown(docsApiContent);
    title = docsApiTitle || title;
  }
  const isoStamp = new Date().toISOString();
  const markdown = [
    `# ${title || 'Documentation Snapshot'}`,
    '',
    `Source: ${url}`,
    `Fetched: ${isoStamp}`,
    '',
    markdownBody.trim(),
    '',
  ].join('\n');

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, markdown, 'utf8');

  await browser.close();
  console.log(`Saved Markdown to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

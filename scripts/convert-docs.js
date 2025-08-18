#!/usr/bin/env node

import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://salesforcecommercecloud.github.io/b2c-dev-doc/docs/current/scriptapi/html/api';
const OUTPUT_DIR = path.join(__dirname, '..', 'docs');

// Configuration options
const CONFIG = {
    // Limit number of classes per package (0 = no limit)
    maxClassesPerPackage: 0,
    // Limit number of packages (0 = no limit)
    maxPackages: 0,
    // Enable debug logging
    debug: false,
    // Rate limiting settings
    rateLimit: {
        // Delay between requests in milliseconds
        requestDelay: 1000,
        // Maximum requests per minute
        maxRequestsPerMinute: 30,
        // Delay between processing packages in milliseconds
        packageDelay: 2000,
        // Random jitter to add (0-1 multiplier)
        jitter: 0.3
    }
};

// Override config from command line args
if (process.argv.includes('--test')) {
    CONFIG.maxClassesPerPackage = 3;
    CONFIG.maxPackages = 2;
    CONFIG.debug = true;
}

if (process.argv.includes('--limit')) {
    const limitIndex = process.argv.indexOf('--limit');
    if (limitIndex >= 0 && process.argv[limitIndex + 1]) {
        CONFIG.maxClassesPerPackage = parseInt(process.argv[limitIndex + 1]) || 5;
    }
}

if (process.argv.includes('--fast')) {
    CONFIG.rateLimit.requestDelay = 500;
    CONFIG.rateLimit.maxRequestsPerMinute = 45;
    CONFIG.rateLimit.packageDelay = 1000;
    console.log('Using fast mode (less conservative rate limiting)');
}

if (process.argv.includes('--slow')) {
    CONFIG.rateLimit.requestDelay = 2000;
    CONFIG.rateLimit.maxRequestsPerMinute = 15;
    CONFIG.rateLimit.packageDelay = 5000;
    console.log('Using slow mode (very conservative rate limiting)');
}

// Ensure output directory exists
async function ensureDir(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

// Fetch HTML content from URL with rate limiting
async function fetchHTML(url) {
    // Apply rate limiting before making request
    await rateLimiter.waitForRateLimit();

    try {
        console.log(`Fetching: ${url}`);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': rateLimiter.getRandomUserAgent(),
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Cache-Control': 'max-age=0'
            },
            timeout: 30000, // 30 second timeout
            validateStatus: function (status) {
                return status >= 200 && status < 300; // Accept only 2xx status codes
            }
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.warn(`Rate limited by server. Waiting 60 seconds before retry...`);
            // eslint-disable-next-line no-undef
            await new Promise(resolve => setTimeout(resolve, 60000));
            // Retry once after rate limit
            try {
                const retryResponse = await axios.get(url, {
                    headers: {
                        'User-Agent': rateLimiter.getRandomUserAgent(),
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.5',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Connection': 'keep-alive',
                        'Upgrade-Insecure-Requests': '1',
                        'Cache-Control': 'max-age=0'
                    },
                    timeout: 30000
                });
                return retryResponse.data;
            } catch (retryError) {
                console.error(`Retry failed for ${url}:`, retryError.message);
                return null;
            }
        }

        console.error(`Error fetching ${url}:`, error.message);
        return null;
    }
}

// Helper function to clean and normalize text
function cleanText(text) {
    return text
        .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
        .replace(/\n\s*\n/g, '\n') // Remove empty lines
        .replace(/\t/g, ' ') // Replace tabs with spaces
        .trim();
}

// Helper function to extract method signature cleanly
function cleanMethodSignature(htmlContent) {
    const $ = cheerio.load(`<div>${htmlContent}</div>`);

    // Extract static keyword if present
    let signature = '';
    if (htmlContent.includes('static')) {
        signature += 'static ';
    }

    // Extract method name from emphasis span
    const methodName = $('.emphasis').text().trim();
    if (methodName) {
        signature += methodName;
    }

    // Get the full text and clean it up
    const fullText = $.text().replace(/\s+/g, ' ').trim();

    // Extract parameters and return type using regex
    const methodPattern = /(\w+)\s*\(\s*([^)]*)\s*\)\s*:\s*(.+?)$/;
    const match = fullText.match(methodPattern);

    if (match) {
        const params = match[2].trim();
        const returnType = match[3].trim();

        // Clean up parameters - remove excessive whitespace and normalize format
        let cleanParams = '';
        if (params) {
            cleanParams = params
                .replace(/\s*:\s*/g, ' : ')  // Normalize colons
                .replace(/,\s+/g, ', ')      // Normalize commas
                .replace(/\s+/g, ' ')        // Single spaces
                .trim();
        }

        signature += `(${cleanParams}) : ${returnType}`;
    } else {
        // Fallback - try to extract just the method call part
        const simpleMatch = fullText.match(/(\w+\s*\([^)]*\))/);
        if (simpleMatch) {
            const methodCall = simpleMatch[1].replace(/\s+/g, ' ').trim();
            signature += methodCall;
        }
    }

    return signature.replace(/\s+/g, ' ').trim();
}

// Convert HTML to Markdown
function htmlToMarkdown(html) {
    const $ = cheerio.load(html);

    // Remove script tags and other unwanted elements
    $('script, style, .banner, .site-footer, header').remove();

    let markdown = '';

    // Find the main class content
    const classDiv = $('[id^="class_"]').first();

    if (classDiv.length === 0) {
        console.warn('No class content found');
        return '';
    }

    // Extract package name
    const packageName = classDiv.find('.packageName').text().trim();
    if (packageName) {
        markdown += `## Package: ${packageName}\n\n`;
    }

    // Extract class name
    const className = cleanText(classDiv.find('.className').text());
    if (className) {
        markdown += `# ${className}\n\n`;
    }

    // Extract inheritance hierarchy
    const hierarchy = classDiv.find('.hierarchy');
    if (hierarchy.length > 0) {
        markdown += '## Inheritance Hierarchy\n\n';
        hierarchy.find('div').each((i, div) => {
            const $div = $(div);
            const text = cleanText($div.text());
            if (text) {
                // Calculate indentation based on left position
                const leftStyle = $div.attr('style') || '';
                const leftMatch = leftStyle.match(/left:\s*(\d+)%/);
                const level = leftMatch ? Math.floor(parseInt(leftMatch[1]) / 3) : 0;
                const indent = '  '.repeat(level);
                markdown += `${indent}- ${text}\n`;
            }
        });
        markdown += '\n';
    }

    // Extract class description
    const description = cleanText(classDiv.find('.classSummary .description').text());
    if (description) {
        markdown += '## Description\n\n';
        markdown += `${description}\n\n`;
    }

    // Process sections (Properties, Methods, etc.)
    classDiv.find('.section').each((i, section) => {
        const $section = $(section);
        const header = cleanText($section.find('.header').first().text());

        if (!header) return;

        markdown += `## ${header}\n\n`;

        // Handle different section types
        if (header === 'Constants') {
            $section.find('.summaryItem').each((j, item) => {
                const $item = $(item);

                // Extract constant name from the text content before the colon
                const spanContent = $item.find('span').first();
                const fullText = spanContent.text();
                
                // Parse the constant line: "CONSTANT_NAME : Type = value"
                const constMatch = fullText.match(/^([A-Z_][A-Z0-9_]*)\s*:/);
                const constName = constMatch ? constMatch[1].trim() : '';

                // Extract type - look for the type link after the colon
                const typeLink = spanContent.find('a span').first();
                const constType = typeLink.text().trim();

                // Extract value if present (after the = sign)
                const valueMatch = fullText.match(/=\s*([^]+?)(?=\s|$)/);
                const constValue = valueMatch ? valueMatch[1].trim() : '';

                const desc = cleanText($item.find('.description').text());

                if (constName) {
                    markdown += `### ${constName}\n\n`;
                    if (constType) {
                        let typeInfo = `**Type:** ${constType}`;
                        if (constValue) {
                            typeInfo += ` = ${constValue}`;
                        }
                        markdown += `${typeInfo}\n\n`;
                    }
                    if (desc) {
                        markdown += `${desc}\n\n`;
                    }
                }
            });
        } else if (header === 'Properties') {
            $section.find('.summaryItem').each((j, item) => {
                const $item = $(item);

                // For properties, parse the span content more carefully
                const spanContent = $item.find('span').first();
                const fullText = spanContent.text();

                // Extract property name (text before the first colon)
                const nameMatch = fullText.match(/^([^\s:]+)\s*:/);
                const propName = nameMatch ? nameMatch[1].trim() : '';

                // Extract type - look for linked type names
                const typeLinks = spanContent.find('a');
                let propType = '';
                typeLinks.each((idx, link) => {
                    const $link = $(link);
                    const linkText = $link.text().trim();
                    // Skip if it's an anchor link (starts with #)
                    if (!$link.attr('href')?.startsWith('#') && linkText) {
                        propType = linkText;
                        return false; // break the loop
                    }
                });

                // If no type found in links, try to extract from text pattern
                if (!propType) {
                    const typeMatch = fullText.match(/:\s*([A-Za-z][A-Za-z0-9]*)/);
                    if (typeMatch) {
                        propType = typeMatch[1];
                    }
                }

                // Check for modifiers
                const isStatic = fullText.includes('static');
                const isReadOnly = fullText.includes('(Read Only)');

                const desc = $item.find('.description').text().trim();

                if (propName) {
                    markdown += `### ${propName}\n\n`;
                    if (propType) {
                        let typeInfo = `**Type:** ${propType}`;
                        if (isStatic) typeInfo += ' (Static)';
                        if (isReadOnly) typeInfo += ' (Read Only)';
                        markdown += `${typeInfo}\n\n`;
                    }
                    if (desc) {
                        markdown += `${desc}\n\n`;
                    }
                }
            });
        } else if (header === 'Method Summary' || header.includes('Method')) {
            $section.find('.summaryItem').each((j, item) => {
                const $item = $(item);

                // Extract method name from emphasis link
                const methodLink = $item.find('.emphasis a').first();
                const methodName = methodLink.text().trim();

                // Get clean signature
                const signature = cleanMethodSignature($item.find('span').first().html());

                const desc = cleanText($item.find('.description').text());

                if (methodName && !desc.startsWith('This class does not have')) {
                    markdown += `### ${methodName}\n\n`;
                    if (signature) {
                        markdown += `**Signature:** \`${signature}\`\n\n`;
                    }
                    if (desc) {
                        markdown += `${desc}\n\n`;
                    }
                }
            });
        } else if (header === 'Constructor Summary') {
            $section.find('.summaryItem').each((j, item) => {
                const $item = $(item);
                const constructorText = cleanText($item.text());
                if (constructorText && !constructorText.includes('This class does not have')) {
                    markdown += `${constructorText}\n\n`;
                }
            });
        } else {
            // Handle inherited methods and other sections
            const content = cleanText($section.find('.summaryItem').text());
            if (content && !content.includes('This class does not have')) {
                markdown += `${content}\n\n`;
            }
        }
    });

    // Process detailed method descriptions
    const methodDetails = classDiv.find('.section').filter((i, el) => {
        return $(el).find('.header').text().trim() === 'Method Detail';
    });

    if (methodDetails.length > 0) {
        markdown += '## Method Details\n\n';

        methodDetails.find('.detailItem').each((i, item) => {
            const $item = $(item);

            const methodName = cleanText($item.find('.detailName').text());
            const signature = cleanText($item.find('.detailSignature').text());
            const description = cleanText($item.find('.description').first().text());

            if (methodName) {
                markdown += `### ${methodName}\n\n`;

                if (signature) {
                    markdown += `**Signature:** \`${signature}\`\n\n`;
                }

                if (description) {
                    markdown += `**Description:** ${description}\n\n`;
                }

                // Process parameters
                $item.find('.parameters').each((j, param) => {
                    const $param = $(param);
                    const title = cleanText($param.find('.parameterTitle').text());

                    if (title) {
                        markdown += `**${title}**\n\n`;

                        $param.find('.parameterDetail').each((k, detail) => {
                            const $detail = $(detail);
                            const paramName = cleanText($detail.find('.parameterName').text());
                            const paramDesc = cleanText($detail.find('.parameterDesc').text());

                            if (paramName && paramDesc) {
                                markdown += `- \`${paramName}\`: ${paramDesc}\n`;
                            } else {
                                const detailText = cleanText($detail.text());
                                if (detailText) {
                                    markdown += `${detailText}\n`;
                                }
                            }
                        });

                        markdown += '\n';
                    }
                });

                markdown += '---\n\n';
            }
        });
    }

    // Clean up the final markdown
    return markdown
        .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
        .trim();
}

// Rate limiting utilities
class RateLimiter {
    constructor(config) {
        this.config = config;
        this.requestTimes = [];
        this.userAgents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
        ];
        this.currentUserAgentIndex = 0;
    }

    async waitForRateLimit() {
        const now = Date.now();

        // Remove requests older than 1 minute
        this.requestTimes = this.requestTimes.filter(time => now - time < 60000);

        // Check if we're at the rate limit
        if (this.requestTimes.length >= this.config.maxRequestsPerMinute) {
            const oldestRequest = Math.min(...this.requestTimes);
            const waitTime = 60000 - (now - oldestRequest) + 1000; // Add 1 second buffer

            if (waitTime > 0) {
                console.log(`Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)} seconds...`);
                // eslint-disable-next-line no-undef
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }

        // Apply base delay with jitter
        const baseDelay = this.config.requestDelay;
        const jitter = Math.random() * this.config.jitter * baseDelay;
        const totalDelay = baseDelay + jitter;

        if (CONFIG.debug) {
            console.log(`Applying delay: ${Math.ceil(totalDelay)}ms`);
        }

        // eslint-disable-next-line no-undef
        await new Promise(resolve => setTimeout(resolve, totalDelay));

        // Record this request
        this.requestTimes.push(Date.now());
    }

    getRandomUserAgent() {
        const userAgent = this.userAgents[this.currentUserAgentIndex];
        this.currentUserAgentIndex = (this.currentUserAgentIndex + 1) % this.userAgents.length;
        return userAgent;
    }
}

// Initialize rate limiter
const rateLimiter = new RateLimiter(CONFIG.rateLimit);

// Get all packages from overview page
async function getPackages() {
    const overviewHTML = await fetchHTML(`${BASE_URL}/overview.html`);
    if (!overviewHTML) return [];

    const $ = cheerio.load(overviewHTML);
    const packages = [];

    $('.summaryItem a').each((i, element) => {
        const href = $(element).attr('href');
        const name = $(element).text().trim();
        if (href && href.startsWith('package_')) {
            packages.push({
                name,
                href,
                id: href.replace('.html', '').replace('package_', '')
            });
        }
    });

    return packages;
}

// Get all classes from a package page
async function getClassesFromPackage(packageHref) {
    const packageHTML = await fetchHTML(`${BASE_URL}/${packageHref}`);
    if (!packageHTML) return [];

    const $ = cheerio.load(packageHTML);
    const classes = [];

    $('.classesName a').each((i, element) => {
        const href = $(element).attr('href');
        const name = $(element).text().trim();
        if (href && href.startsWith('class_')) {
            classes.push({
                name,
                href,
                id: href.replace('.html', '').replace('class_', '')
            });
        }
    });

    return classes;
}

// Convert a single class to markdown
async function convertClass(classInfo, packageName) {
    const classHTML = await fetchHTML(`${BASE_URL}/${classInfo.href}`);
    if (!classHTML) return;

    const markdown = htmlToMarkdown(classHTML);
    if (!markdown.trim()) {
        console.warn(`No content generated for ${classInfo.name}`);
        return;
    }

    // Create package directory
    const packageDir = path.join(OUTPUT_DIR, packageName.replace('.', '_'));
    await ensureDir(packageDir);

    // Write markdown file
    const filename = `${classInfo.name}.md`;
    const filepath = path.join(packageDir, filename);

    await fs.writeFile(filepath, markdown, 'utf8');
    console.log(`✓ Converted: ${packageName}.${classInfo.name} -> ${filepath}`);
}

// Main function
async function main() {
    console.log('Starting SFCC documentation conversion...');

    if (CONFIG.maxPackages > 0 || CONFIG.maxClassesPerPackage > 0) {
        console.log('Running in limited mode:');
        if (CONFIG.maxPackages > 0) console.log(`- Max packages: ${CONFIG.maxPackages}`);
        if (CONFIG.maxClassesPerPackage > 0) console.log(`- Max classes per package: ${CONFIG.maxClassesPerPackage}`);
    }

    await ensureDir(OUTPUT_DIR);

    // Get all packages
    const packages = await getPackages();
    console.log(`Found ${packages.length} packages`);

    // Limit packages if configured
    const packageLimit = CONFIG.maxPackages > 0 ? CONFIG.maxPackages : packages.length;
    const packagesToProcess = packages.slice(0, packageLimit);

    for (const pkg of packagesToProcess) {
        console.log(`\nProcessing package: ${pkg.name}`);

        // Get classes in this package
        const classes = await getClassesFromPackage(pkg.href);
        console.log(`Found ${classes.length} classes in ${pkg.name}`);

        // Limit classes if configured
        const classLimit = CONFIG.maxClassesPerPackage > 0 ? CONFIG.maxClassesPerPackage : classes.length;
        const classesToProcess = classes.slice(0, classLimit);

        if (classLimit < classes.length) {
            console.log(`Processing first ${classLimit} classes only...`);
        }

        // Convert each class
        for (const cls of classesToProcess) {
            await convertClass(cls, pkg.name);
        }

        // Delay between processing packages
        if (pkg !== packagesToProcess[packagesToProcess.length - 1]) {
            const packageDelay = CONFIG.rateLimit.packageDelay;
            const jitter = Math.random() * CONFIG.rateLimit.jitter * packageDelay;
            console.log(`Waiting ${Math.ceil((packageDelay + jitter) / 1000)}s before next package...`);
            // eslint-disable-next-line no-undef
            await new Promise(resolve => setTimeout(resolve, packageDelay + jitter));
        }
    }

    console.log('\n✓ Documentation conversion completed!');
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { main, convertClass, getPackages, getClassesFromPackage };

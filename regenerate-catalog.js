#!/usr/bin/env node

import * as cheerio from 'cheerio';
import fs from 'fs/promises';

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

// Convert HTML to Markdown with fixed Properties parsing
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
        if (header === 'Properties') {
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
                if (constructorText) {
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

async function main() {
    const html = await fs.readFile('./bin/examples/class_dw_catalog_Catalog.html', 'utf8');
    const markdown = htmlToMarkdown(html);
    await fs.writeFile('./docs/dw_catalog/Catalog.md', markdown);
    console.log('✓ Updated Catalog.md with fixed Properties parsing');
}

main().catch(console.error);

#!/usr/bin/env node

import * as cheerio from 'cheerio';
import fs from 'fs/promises';

// Simplified version of the htmlToMarkdown function to test Properties parsing
function testPropertiesParsing(html) {
    const $ = cheerio.load(html);

    // Find the main class content
    const classDiv = $('[id^="class_"]').first();

    let markdown = '';

    // Process sections (Properties, Methods, etc.)
    classDiv.find('.section').each((i, section) => {
        const $section = $(section);
        const header = $section.find('.header').first().text().trim();

        if (header === 'Properties') {
            markdown += `## ${header}\n\n`;

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
        }
    });

    return markdown;
}

async function main() {
    const html = await fs.readFile('./bin/examples/class_dw_catalog_Catalog.html', 'utf8');
    const result = testPropertiesParsing(html);
    console.log('=== PROPERTIES SECTION TEST ===');
    console.log(result);
}

main().catch(console.error);

/**
 * WebDAV XML Response Utilities
 * 
 * Handles generation of WebDAV XML responses for PROPFIND and other operations.
 * Provides clean, reusable functions for XML generation.
 */

const path = require('path');

/**
 * Generate WebDAV XML response for a single file
 */
function generateFileXmlResponse(urlPath, stats) {
    const filename = path.basename(urlPath);
    
    return `<?xml version="1.0" encoding="utf-8"?>
<D:multistatus xmlns:D="DAV:">
    <D:response>
        <D:href>${urlPath}</D:href>
        <D:propstat>
            <D:prop>
                <D:displayname>${filename}</D:displayname>
                <D:getcontentlength>${stats.size}</D:getcontentlength>
                <D:getlastmodified>${stats.mtime.toUTCString()}</D:getlastmodified>
                <D:resourcetype></D:resourcetype>
                <D:getcontenttype>text/plain</D:getcontenttype>
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>
</D:multistatus>`;
}

/**
 * Generate WebDAV XML response for directory listing
 */
function generateDirectoryXmlResponse(urlPath, items, stats) {
    const directoryName = path.basename(urlPath) || 'Logs';
    
    // Generate individual item entries
    const xmlItems = items.map(item => {
        const isDirectory = item.stats.isDirectory();
        const itemUrl = urlPath.endsWith('/') ? `${urlPath}${item.name}` : `${urlPath}/${item.name}`;

        return `
    <D:response>
        <D:href>${itemUrl}${isDirectory ? '/' : ''}</D:href>
        <D:propstat>
            <D:prop>
                <D:displayname>${item.name}</D:displayname>
                <D:getcontentlength>${isDirectory ? '' : item.stats.size}</D:getcontentlength>
                <D:getlastmodified>${item.stats.mtime.toUTCString()}</D:getlastmodified>
                <D:resourcetype>${isDirectory ? '<D:collection/>' : ''}</D:resourcetype>
                ${!isDirectory ? '<D:getcontenttype>text/plain</D:getcontenttype>' : ''}
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>`;
    }).join('');

    return `<?xml version="1.0" encoding="utf-8"?>
<D:multistatus xmlns:D="DAV:">
    <D:response>
        <D:href>${urlPath}</D:href>
        <D:propstat>
            <D:prop>
                <D:displayname>${directoryName}</D:displayname>
                <D:resourcetype><D:collection/></D:resourcetype>
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>${xmlItems}
</D:multistatus>`;
}

/**
 * Generate WebDAV error response
 */
function generateErrorXmlResponse(urlPath, statusCode, message) {
    return `<?xml version="1.0" encoding="utf-8"?>
<D:multistatus xmlns:D="DAV:">
    <D:response>
        <D:href>${urlPath}</D:href>
        <D:propstat>
            <D:status>HTTP/1.1 ${statusCode} ${message}</D:status>
        </D:propstat>
    </D:response>
</D:multistatus>`;
}

/**
 * Parse WebDAV depth header
 */
function parseDepthHeader(depthHeader) {
    if (!depthHeader) return 'infinity';
    
    const depth = depthHeader.toLowerCase();
    if (depth === '0') return 0;
    if (depth === '1') return 1;
    return 'infinity';
}

/**
 * Escape XML special characters
 */
function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

module.exports = {
    generateFileXmlResponse,
    generateDirectoryXmlResponse,
    generateErrorXmlResponse,
    parseDepthHeader,
    escapeXml
};
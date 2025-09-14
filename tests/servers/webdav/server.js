const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

/**
 * Simple Mock WebDAV Server for SFCC Log Testing
 * 
 * This server mimics basic WebDAV functionality needed for testing
 * SFCC log tools without requiring complex WebDAV libraries.
 * 
 * Supports:
 * - GET requests for file content
 * - PROPFIND requests for directory listings
 * - Basic CORS headers for browser testing
 */

class SFCCMockWebDAVServer {
    constructor(options = {}) {
        this.port = options.port || 3000;
        this.host = options.host || 'localhost';
        this.logDirectory = options.logDirectory || path.join(__dirname, 'mock-logs');
        this.server = null;
        this.isDevMode = options.dev || false;
        
        // SFCC WebDAV base path
        this.webdavBasePath = '/on/demandware.servlet/webdav/Sites';
    }

    async start() {
        try {
            this.server = http.createServer((req, res) => {
                this.handleRequest(req, res);
            });

            return new Promise((resolve) => {
                this.server.listen(this.port, this.host, () => {
                    console.log(`🚀 Mock SFCC WebDAV Server started on http://${this.host}:${this.port}`);
                    console.log(`📁 Serving logs from: ${this.logDirectory}`);
                    console.log('📋 Available endpoints:');
                    console.log(`   - http://${this.host}:${this.port}${this.webdavBasePath}/Logs/ (SFCC WebDAV path)`);
                    console.log(`   - http://${this.host}:${this.port}/Logs/ (direct logs directory)`);
                    console.log(`   - http://${this.host}:${this.port}/Logs/jobs/ (job logs directory)`);
                    
                    if (this.isDevMode) {
                        console.log('🔧 Development mode: Request logging enabled');
                    }
                    
                    resolve(this.server);
                });
            });
        } catch (error) {
            console.error('❌ Failed to start WebDAV server:', error);
            throw error;
        }
    }

    async stop() {
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(() => {
                    console.log('🛑 Mock SFCC WebDAV Server stopped');
                    resolve();
                });
            });
        }
    }

    handleRequest(req, res) {
        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, PROPFIND');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Depth');

        if (this.isDevMode) {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        }

        // Handle OPTIONS requests for CORS
        if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const urlPath = decodeURIComponent(url.pathname);

        // Map URL path to file system path
        const fsPath = this.mapUrlToFilePath(urlPath);

        if (req.method === 'GET') {
            this.handleGet(req, res, fsPath);
        } else if (req.method === 'PROPFIND') {
            this.handlePropfind(req, res, fsPath, urlPath);
        } else {
            res.statusCode = 405;
            res.setHeader('Allow', 'GET, PROPFIND, OPTIONS');
            res.end('Method Not Allowed');
        }
    }

    mapUrlToFilePath(urlPath) {
        // Handle SFCC WebDAV path structure
        if (urlPath.startsWith(this.webdavBasePath)) {
            // Remove the WebDAV base path and map to our mock structure
            const relativePath = urlPath.replace(this.webdavBasePath, '');
            return path.join(this.logDirectory, relativePath);
        }
        
        // Fallback: treat as direct path to logs (for backward compatibility)
        const relativePath = urlPath.replace(/^\/+/, '');
        return path.join(this.logDirectory, relativePath);
    }

    handleGet(req, res, fsPath) {
        try {
            if (!fs.existsSync(fsPath)) {
                res.statusCode = 404;
                res.end('Not Found');
                return;
            }

            const stats = fs.statSync(fsPath);
            if (stats.isDirectory()) {
                res.statusCode = 404;
                res.end('Not Found');
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.setHeader('Content-Length', stats.size);
            
            const stream = fs.createReadStream(fsPath);
            stream.pipe(res);
        } catch (error) {
            console.error('Error handling GET request:', error);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    }

    handlePropfind(req, res, fsPath, urlPath) {
        try {
            if (!fs.existsSync(fsPath)) {
                res.statusCode = 404;
                res.end('Not Found');
                return;
            }

            const stats = fs.statSync(fsPath);
            if (!stats.isDirectory()) {
                res.statusCode = 404;
                res.end('Not Found');
                return;
            }

            // Generate WebDAV XML response
            const items = fs.readdirSync(fsPath);
            const xmlItems = items.map(item => {
                const itemPath = path.join(fsPath, item);
                const itemStats = fs.statSync(itemPath);
                const isDirectory = itemStats.isDirectory();
                const itemUrl = urlPath.endsWith('/') ? `${urlPath}${item}` : `${urlPath}/${item}`;

                return `
    <D:response>
        <D:href>${itemUrl}${isDirectory ? '/' : ''}</D:href>
        <D:propstat>
            <D:prop>
                <D:displayname>${item}</D:displayname>
                <D:getcontentlength>${isDirectory ? '' : itemStats.size}</D:getcontentlength>
                <D:getlastmodified>${itemStats.mtime.toUTCString()}</D:getlastmodified>
                <D:resourcetype>${isDirectory ? '<D:collection/>' : ''}</D:resourcetype>
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>`;
            }).join('');

            const xml = `<?xml version="1.0" encoding="utf-8"?>
<D:multistatus xmlns:D="DAV:">
    <D:response>
        <D:href>${urlPath}</D:href>
        <D:propstat>
            <D:prop>
                <D:displayname>${path.basename(urlPath) || 'Logs'}</D:displayname>
                <D:resourcetype><D:collection/></D:resourcetype>
            </D:prop>
            <D:status>HTTP/1.1 200 OK</D:status>
        </D:propstat>
    </D:response>${xmlItems}
</D:multistatus>`;

            res.statusCode = 207; // Multi-Status
            res.setHeader('Content-Type', 'application/xml');
            res.end(xml);
        } catch (error) {
            console.error('Error handling PROPFIND request:', error);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    }

    getUrl() {
        return `http://${this.host}:${this.port}`;
    }

    getLogsUrl() {
        return `${this.getUrl()}${this.webdavBasePath}/Logs/`;
    }

    getDirectLogsUrl() {
        return `${this.getUrl()}/Logs/`;
    }
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const isDevMode = args.includes('--dev');
    const portArg = args.find(arg => arg.startsWith('--port='));
    const port = portArg ? parseInt(portArg.split('=')[1]) : 3000;

    const server = new SFCCMockWebDAVServer({ 
        port, 
        dev: isDevMode 
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🔄 Shutting down gracefully...');
        await server.stop();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('\n🔄 Shutting down gracefully...');
        await server.stop();
        process.exit(0);
    });

    // Start server
    server.start().catch((error) => {
        console.error('💥 Failed to start server:', error);
        process.exit(1);
    });
}

module.exports = SFCCMockWebDAVServer;

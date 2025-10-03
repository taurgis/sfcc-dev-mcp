/**
 * WebDAV Route Handler
 * 
 * Handles WebDAV requests including PROPFIND for directory listings 
 * and GET requests for file content with range support.
 * Modular implementation following single responsibility principle.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const {
    generateFileXmlResponse,
    generateDirectoryXmlResponse,
    generateErrorXmlResponse,
    parseDepthHeader
} = require('../utils/webdav-xml');

class WebDAVRouteHandler {
    constructor(config) {
        this.config = config;
        this.webdavConfig = config.getWebdavConfig();
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // Handle PROPFIND method (custom method support)
        this.router.use((req, res, next) => {
            if (req.method === 'PROPFIND') {
                this.handlePropfind(req, res);
            } else {
                next();
            }
        });

        // WebDAV base path routes
        this.router.get(`${this.webdavConfig.basePath}/Logs/*`, (req, res) => {
            this.handleGet(req, res);
        });

        // Direct logs path routes (for backward compatibility)
        this.router.get('/Logs/*', (req, res) => {
            this.handleGet(req, res);
        });

        // Root logs directory
        this.router.get('/Logs', (req, res) => {
            this.handleGet(req, res);
        });
    }

    /**
     * Map URL path to file system path
     */
    mapUrlToFilePath(urlPath) {
        // Handle SFCC WebDAV path structure
        if (urlPath.startsWith(this.webdavConfig.basePath)) {
            // Remove the WebDAV base path and map to our mock structure
            let relativePath = urlPath.replace(this.webdavConfig.basePath, '');
            // Convert uppercase Logs to lowercase logs for file system, but remove the leading /Logs since it's already in logsPath
            relativePath = relativePath.replace(/^\/Logs/, '');
            return path.join(this.webdavConfig.logsPath, relativePath);
        }
        
        // Fallback: treat as direct path to logs (for backward compatibility)
        let relativePath = urlPath.replace(/^\/+/, '');
        // Convert uppercase Logs to lowercase logs for file system, but remove the leading Logs since it's already in logsPath
        relativePath = relativePath.replace(/^Logs/, '');
        return path.join(this.webdavConfig.logsPath, relativePath);
    }

    /**
     * Handle GET requests for file content
     */
    handleGet(req, res) {
        try {
            const urlPath = decodeURIComponent(req.path);
            const fsPath = this.mapUrlToFilePath(urlPath);

            if (this.config.isDevMode) {
                console.log(`[WebDAV] GET ${urlPath} -> ${fsPath}`);
            }

            if (!fs.existsSync(fsPath)) {
                return res.status(404).send('Not Found');
            }

            const stats = fs.statSync(fsPath);
            if (stats.isDirectory()) {
                return res.status(404).send('Not Found');
            }

            // Handle range requests for partial content
            const rangeHeader = req.headers.range;
            if (rangeHeader) {
                return this.handleRangeRequest(req, res, fsPath, stats);
            }

            // Normal full file request
            res.set({
                'Content-Type': 'text/plain',
                'Content-Length': stats.size,
                'Accept-Ranges': 'bytes'
            });
            
            const stream = fs.createReadStream(fsPath);
            stream.pipe(res);

        } catch (error) {
            console.error('[WebDAV] Error handling GET request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Handle range requests for partial content
     */
    handleRangeRequest(req, res, fsPath, stats) {
        try {
            const rangeHeader = req.headers.range;
            const fileSize = stats.size;
            
            if (this.config.isDevMode) {
                console.log(`[WebDAV] Range request: ${rangeHeader} for file ${fsPath} (size: ${fileSize})`);
            }

            // Parse range header (e.g., "bytes=0-499" or "bytes=500-999")
            const rangeMatch = rangeHeader.match(/bytes=(\d+)-(\d*)/);
            if (!rangeMatch) {
                res.set('Content-Range', `bytes */${fileSize}`);
                return res.status(416).send('Range Not Satisfiable');
            }

            const start = parseInt(rangeMatch[1], 10);
            const end = rangeMatch[2] ? parseInt(rangeMatch[2], 10) : fileSize - 1;

            // Validate range
            if (start >= fileSize || end >= fileSize || start > end) {
                res.set('Content-Range', `bytes */${fileSize}`);
                return res.status(416).send('Range Not Satisfiable');
            }

            const contentLength = end - start + 1;

            if (this.config.isDevMode) {
                console.log(`[WebDAV] Range: ${start}-${end}, Content-Length: ${contentLength}`);
            }

            // Send partial content response
            res.set({
                'Content-Type': 'text/plain',
                'Content-Length': contentLength,
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes'
            });

            res.status(206); // Partial Content
            const stream = fs.createReadStream(fsPath, { start, end });
            stream.pipe(res);

        } catch (error) {
            console.error('[WebDAV] Error handling range request:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Handle PROPFIND requests for directory listings
     */
    handlePropfind(req, res) {
        try {
            const urlPath = decodeURIComponent(req.path);
            const fsPath = this.mapUrlToFilePath(urlPath);

            if (this.config.isDevMode) {
                console.log(`[WebDAV] PROPFIND ${urlPath} -> ${fsPath}`);
            }

            if (!fs.existsSync(fsPath)) {
                if (this.config.isDevMode) {
                    console.log(`[WebDAV] File not found: ${fsPath}`);
                }
                return res.status(404).send('Not Found');
            }

            const stats = fs.statSync(fsPath);
            
            if (this.config.isDevMode) {
                console.log(`[WebDAV] File stats: size=${stats.size}, isFile=${stats.isFile()}, isDirectory=${stats.isDirectory()}`);
            }
            
            // Handle PROPFIND for individual files
            if (stats.isFile()) {
                const xml = generateFileXmlResponse(urlPath, stats);

                if (this.config.isDevMode) {
                    console.log(`[WebDAV] Returning file PROPFIND response for ${urlPath}`);
                }

                res.set('Content-Type', 'application/xml');
                return res.status(207).send(xml);
            }

            // Handle PROPFIND for directories
            if (!stats.isDirectory()) {
                return res.status(404).send('Not Found');
            }

            // Read directory contents
            const itemNames = fs.readdirSync(fsPath);
            const items = itemNames.map(name => {
                const itemPath = path.join(fsPath, name);
                const itemStats = fs.statSync(itemPath);
                return { name, stats: itemStats };
            });

            const xml = generateDirectoryXmlResponse(urlPath, items, stats);

            res.set('Content-Type', 'application/xml');
            res.status(207).send(xml);

        } catch (error) {
            console.error(`[WebDAV] Error handling PROPFIND request for ${req.path}:`, error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = WebDAVRouteHandler;
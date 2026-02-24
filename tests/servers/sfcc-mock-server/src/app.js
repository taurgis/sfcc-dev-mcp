/**
 * Express Application Setup
 * 
 * Main Express application configuration with middleware setup and route registration.
 * Follows modular architecture with clean separation of concerns.
 */

const express = require('express');
const { createCorsMiddleware } = require('./middleware/cors');
const { createRequestLogger, createResponseLogger, createErrorLogger } = require('./middleware/logging');
const AuthenticationManager = require('./middleware/auth');
const WebDAVRouteHandler = require('./routes/webdav');
const CartridgeWebDAVHandler = require('./routes/cartridge-webdav');
const StorefrontHandler = require('./routes/storefront');
const OCAPIRouteHandler = require('./routes/ocapi');

class SFCCMockApp {
    constructor(config) {
        this.config = config;
        this.app = express();
        this.authManager = new AuthenticationManager(config);
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        // CORS middleware (if enabled)
        if (this.config.features.cors) {
            this.app.use(createCorsMiddleware());
        }

        // Body parsing middleware
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Logging middleware (if enabled)
        if (this.config.features.logging) {
            this.app.use(createRequestLogger(this.config.isDevMode));
            this.app.use(createResponseLogger(this.config.isDevMode));
        }

        // Custom method support for WebDAV
        this.app.use((req, res, next) => {
            // Add support for PROPFIND method
            if (req.headers['content-length'] === '0' && req.method === 'POST') {
                // Check if this might be a PROPFIND disguised as POST
                const contentType = req.headers['content-type'];
                if (!contentType || contentType.includes('application/xml')) {
                    req.method = 'PROPFIND';
                }
            }
            next();
        });
    }

    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            const summary = this.config.getSummary();
            res.json({ 
                status: 'ok', 
                message: 'SFCC Mock Server is running',
                timestamp: new Date().toISOString(),
                config: summary
            });
        });

        // Server info endpoint
        this.app.get('/info', (req, res) => {
            const summary = this.config.getSummary();
            res.json({
                name: 'SFCC Mock Server',
                version: '1.0.0',
                description: 'Unified WebDAV and OCAPI mock server for SFCC development',
                config: summary
            });
        });

        // WebDAV routes (if enabled)
        if (this.config.features.webdav) {
            const webdavHandler = new WebDAVRouteHandler(this.config);
            this.app.use(webdavHandler.getRouter());
            
            // Cartridge WebDAV routes for script debugger controller verification
            const cartridgeWebdavHandler = new CartridgeWebDAVHandler(this.config);
            this.app.use(cartridgeWebdavHandler.getRouter());
            
            if (this.config.isDevMode) {
                console.log('✅ WebDAV routes enabled');
                console.log('✅ Cartridge WebDAV routes enabled');
            }
        }

        // Storefront routes (for debugger trigger)
        const storefrontHandler = new StorefrontHandler(this.config);
        this.app.use(storefrontHandler.getRouter());
        
        if (this.config.isDevMode) {
            console.log('✅ Storefront routes enabled');
        }

        // OCAPI routes (if enabled)
        if (this.config.features.ocapi) {
            const ocapiHandler = new OCAPIRouteHandler(this.config, this.authManager);
            this.app.use(ocapiHandler.getRouter());
            
            if (this.config.isDevMode) {
                console.log('✅ OCAPI routes enabled');
            }
        }

        // Catch-all for undefined routes
        this.app.use((req, res) => {
            res.status(404).json({
                error: 'Not Found',
                message: `Route ${req.method} ${req.originalUrl} not found`,
                timestamp: new Date().toISOString(),
                availableEndpoints: this.getAvailableEndpoints()
            });
        });
    }

    setupErrorHandling() {
        // Error logging middleware
        this.app.use(createErrorLogger());

        // Final error handler
        this.app.use((err, req, res, next) => {
            // Prevent header already sent errors
            if (res.headersSent) {
                return next(err);
            }

            const statusCode = err.statusCode || err.status || 500;
            const message = err.message || 'Internal Server Error';
            
            res.status(statusCode).json({
                error: 'Server Error',
                message: message,
                timestamp: new Date().toISOString(),
                ...(this.config.isDevMode && { stack: err.stack })
            });
        });
    }

    getAvailableEndpoints() {
        const baseUrl = this.config.getServerUrl();
        const endpoints = {
            health: `${baseUrl}/health`,
            info: `${baseUrl}/info`
        };

        if (this.config.features.webdav) {
            endpoints.webdav = {
                logs: this.config.getWebdavLogsUrl(),
                directLogs: `${baseUrl}/Logs/`
            };
        }

        if (this.config.features.ocapi) {
            const ocapiBase = this.config.getOcapiBaseUrl();
            endpoints.ocapi = {
                oauth: `${baseUrl}/dw/oauth2/access_token`,
                systemObjects: `${ocapiBase}/system_object_definitions`,
                codeVersions: `${ocapiBase}/code_versions`
            };
        }

        return endpoints;
    }

    getExpressApp() {
        return this.app;
    }

    getAuthManager() {
        return this.authManager;
    }
}

module.exports = SFCCMockApp;
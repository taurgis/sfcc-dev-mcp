/**
 * OCAPI Route Handler
 * 
 * Lightweight orchestrator that delegates OCAPI requests to specialized handlers.
 * Follows single responsibility principle with modular handler architecture.
 */

const express = require('express');
const MockDataLoader = require('../utils/mock-data-loader');

// Import modular handlers
const OAuthHandler = require('./ocapi/oauth-handler');
const SystemObjectsHandler = require('./ocapi/system-objects-handler');
const SitePreferencesHandler = require('./ocapi/site-preferences-handler');
const CodeVersionsHandler = require('./ocapi/code-versions-handler');
const DebuggerHandler = require('./ocapi/debugger-handler');

class OCAPIRouteHandler {
    constructor(config, authManager) {
        this.config = config;
        this.authManager = authManager;
        this.dataLoader = new MockDataLoader(config.mockDataPath);
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // Initialize modular handlers
        const oAuthHandler = new OAuthHandler(this.authManager);
        const systemObjectsHandler = new SystemObjectsHandler(this.config, this.dataLoader);
        const sitePreferencesHandler = new SitePreferencesHandler(this.config, this.dataLoader);
        const codeVersionsHandler = new CodeVersionsHandler(this.config, this.dataLoader);
        const debuggerHandler = new DebuggerHandler(this.config);

        // OAuth routes (no authentication required)
        this.router.use('/', oAuthHandler.getRouter());

        // Debugger routes (uses Basic auth, handled separately)
        this.router.use('/', debuggerHandler.getRouter());

        // Apply authentication middleware to all OCAPI data endpoints
        const requireAuth = this.authManager.requireAuth();
        
        // Mount authenticated handlers
        this.router.use('/', requireAuth, systemObjectsHandler.getRouter());
        this.router.use('/', requireAuth, sitePreferencesHandler.getRouter());
        this.router.use('/', requireAuth, codeVersionsHandler.getRouter());
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = OCAPIRouteHandler;
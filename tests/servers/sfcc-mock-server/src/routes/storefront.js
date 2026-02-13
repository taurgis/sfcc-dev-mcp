/**
 * Storefront Handler
 * 
 * Handles storefront trigger requests that are used to hit breakpoints.
 * Simulates /s/{siteId}/default-start and similar endpoints.
 */

const express = require('express');

class StorefrontHandler {
    constructor(config) {
        this.config = config;
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // Default-Start endpoint for various site IDs
        this.router.get('/s/:siteId/default-start', this.handleDefaultStart.bind(this));
        
        // Also handle the full Sites format
        this.router.get('/s/Sites-:siteId-Site/default-start', this.handleDefaultStart.bind(this));
        
        // Catch-all for any storefront controller endpoint
        this.router.get('/s/:siteId/:controller-:action', this.handleGenericController.bind(this));
    }

    /**
     * Handle Default-Start requests
     * This triggers the breakpoint hit in the debugger
     */
    handleDefaultStart(req, res) {
        const { siteId } = req.params;

        if (this.config.isDevMode) {
            console.log(`[Storefront] Default-Start triggered for site: ${siteId}`);
        }

        // Simulate a small delay to mimic real behavior
        setTimeout(() => {
            // Return a minimal HTML response
            res.set('Content-Type', 'text/html');
            res.send(`<!DOCTYPE html>
<html>
<head><title>Mock SFCC Storefront</title></head>
<body>
<h1>SFCC Mock Server - Default Start</h1>
<p>Site: ${siteId}</p>
<p>This is a mock response for testing the script debugger.</p>
</body>
</html>`);
        }, 100);
    }

    /**
     * Handle generic controller requests
     */
    handleGenericController(req, res) {
        const { siteId, controller, action } = req.params;

        if (this.config.isDevMode) {
            console.log(`[Storefront] Controller triggered: ${controller}-${action} for site: ${siteId}`);
        }

        res.set('Content-Type', 'text/html');
        res.send(`<!DOCTYPE html>
<html>
<head><title>Mock SFCC Storefront</title></head>
<body>
<h1>SFCC Mock Server</h1>
<p>Controller: ${controller}</p>
<p>Action: ${action}</p>
<p>Site: ${siteId}</p>
</body>
</html>`);
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = StorefrontHandler;

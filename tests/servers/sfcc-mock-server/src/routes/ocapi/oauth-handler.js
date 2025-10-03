/**
 * OAuth Handler
 * 
 * Handles OAuth2 token endpoints for OCAPI authentication.
 * Provides a clean interface for token-related operations.
 */

const express = require('express');

class OAuthHandler {
    constructor(authManager) {
        this.authManager = authManager;
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // OAuth2 token endpoints
        this.router.post('/dw/oauth2/access_token', (req, res) => {
            this.authManager.handleOAuthToken(req, res);
        });
        
        this.router.post('/dwsso/oauth2/access_token', (req, res) => {
            this.authManager.handleOAuthToken(req, res);
        });
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = OAuthHandler;
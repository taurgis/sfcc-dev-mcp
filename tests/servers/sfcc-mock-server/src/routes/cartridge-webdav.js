/**
 * Cartridge WebDAV Handler
 * 
 * Handles WebDAV requests for cartridge verification.
 * Simulates the /on/demandware.servlet/webdav/Sites/Cartridges/ path.
 */

const express = require('express');
const path = require('path');

class CartridgeWebDAVHandler {
    constructor(config) {
        this.config = config;
        this.router = express.Router();
        
        // Mock cartridges that "exist" in the code version
        this.mockCartridges = {
            'version1': [
                'app_storefront_base',
                'app_storefront_controllers',
                'bm_app_storefront_base',
                'modules'
            ],
            'test_version': [
                'app_storefront_base',
                'app_storefront_controllers'
            ],
            'test-version': [
                'app_storefront_base',
                'app_storefront_controllers'
            ]
        };
        
        this.setupRoutes();
    }

    setupRoutes() {
        const cartridgePath = '/on/demandware.servlet/webdav/Sites/Cartridges';

        // Handle all methods for cartridge path - PROPFIND is used by webdav.exists()
        this.router.all(`${cartridgePath}/*path`, (req, res, next) => {
            if (req.method === 'HEAD') {
                return this.handleExists(req, res);
            }
            if (req.method === 'PROPFIND') {
                return this.handlePropfind(req, res);
            }
            if (req.method === 'GET') {
                return this.handleGet(req, res);
            }
            next();
        });
    }

    /**
     * Parse the path to extract code version, cartridge name, and file path
     */
    parsePath(urlPath) {
        // Path format: /on/demandware.servlet/webdav/Sites/Cartridges/{codeVersion}/{cartridge}/cartridge/controllers/Default.js
        const match = urlPath.match(/\/Cartridges\/([^\/]+)\/([^\/]+)(.*)/);
        if (!match) {
            return null;
        }
        return {
            codeVersion: match[1],
            cartridge: match[2],
            filePath: match[3] || ''
        };
    }

    /**
     * Check if a controller file exists
     */
    controllerExists(codeVersion, cartridge, controllerPath) {
        // Check if the code version exists
        const cartridges = this.mockCartridges[codeVersion];
        if (!cartridges) {
            return false;
        }

        // Check if the cartridge exists
        if (!cartridges.includes(cartridge)) {
            return false;
        }

        // For simplicity, assume Default.js controller exists in supported cartridges
        if (controllerPath.includes('/cartridge/controllers/Default.js')) {
            return true;
        }

        // Allow any controller path in the cartridge (for custom breakpoint testing)
        if (controllerPath.includes('/cartridge/controllers/')) {
            return true;
        }

        return false;
    }

    /**
     * Handle HEAD requests for file existence checks
     */
    handleExists(req, res) {
        const parsed = this.parsePath(req.path);
        
        if (!parsed) {
            if (this.config.isDevMode) {
                console.log(`[Cartridge WebDAV] Invalid path: ${req.path}`);
            }
            return res.status(404).send();
        }

        const { codeVersion, cartridge, filePath } = parsed;
        const exists = this.controllerExists(codeVersion, cartridge, filePath);

        if (this.config.isDevMode) {
            console.log(`[Cartridge WebDAV] HEAD ${req.path} => ${exists ? 'exists' : 'not found'}`);
        }

        if (exists) {
            res.status(200).send();
        } else {
            res.status(404).send();
        }
    }

    /**
     * Handle GET requests for controller content
     */
    handleGet(req, res) {
        const parsed = this.parsePath(req.path);
        
        if (!parsed) {
            return res.status(404).send('Not Found');
        }

        const { codeVersion, cartridge, filePath } = parsed;
        const exists = this.controllerExists(codeVersion, cartridge, filePath);

        if (!exists) {
            return res.status(404).send('Not Found');
        }

        // Return mock controller content
        const mockContent = this.getMockControllerContent(cartridge, filePath);
        res.set('Content-Type', 'application/javascript');
        res.send(mockContent);
    }

    /**
     * Handle PROPFIND requests
     */
    handlePropfind(req, res) {
        const parsed = this.parsePath(req.path);
        
        if (!parsed) {
            return res.status(404).send('Not Found');
        }

        const { codeVersion, cartridge, filePath } = parsed;
        const exists = this.controllerExists(codeVersion, cartridge, filePath);

        if (!exists) {
            return res.status(404).send('Not Found');
        }

        // Return minimal PROPFIND response
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<D:multistatus xmlns:D="DAV:">
  <D:response>
    <D:href>${req.path}</D:href>
    <D:propstat>
      <D:prop>
        <D:getcontentlength>1000</D:getcontentlength>
        <D:getlastmodified>${new Date().toUTCString()}</D:getlastmodified>
        <D:resourcetype/>
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>
</D:multistatus>`;

        res.set('Content-Type', 'application/xml');
        res.status(207).send(xml);
    }

    /**
     * Generate mock controller content
     */
    getMockControllerContent(cartridge, filePath) {
        if (cartridge === 'app_storefront_base') {
            return `'use strict';

var server = require('server');

server.get('Start', function (req, res, next) {
    res.render('home/homePage');
    next();
});

module.exports = server.exports();
`;
        }

        if (cartridge === 'app_storefront_controllers') {
            return `'use strict';

var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

function start() {
    app.getView().render('content/home/homepage');
}

exports.Start = guard.ensure(['get'], start);
`;
        }

        // Generic mock controller
        return `'use strict';

module.exports = {
    Start: function() {
        // Mock controller
    }
};
`;
    }

    /**
     * Add a mock cartridge to a code version (for testing)
     */
    addMockCartridge(codeVersion, cartridgeName) {
        if (!this.mockCartridges[codeVersion]) {
            this.mockCartridges[codeVersion] = [];
        }
        if (!this.mockCartridges[codeVersion].includes(cartridgeName)) {
            this.mockCartridges[codeVersion].push(cartridgeName);
        }
    }

    /**
     * Remove a mock cartridge from a code version (for testing)
     */
    removeMockCartridge(codeVersion, cartridgeName) {
        if (this.mockCartridges[codeVersion]) {
            this.mockCartridges[codeVersion] = this.mockCartridges[codeVersion].filter(c => c !== cartridgeName);
        }
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = CartridgeWebDAVHandler;

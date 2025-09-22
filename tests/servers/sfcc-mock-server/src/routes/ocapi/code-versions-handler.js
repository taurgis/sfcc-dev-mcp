/**
 * Code Versions Handler
 * 
 * Handles code version listing and activation operations for OCAPI endpoints.
 */

const express = require('express');

class CodeVersionsHandler {
    constructor(config, dataLoader) {
        this.config = config;
        this.ocapiConfig = config.getOcapiConfig();
        this.dataLoader = dataLoader;
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // Code Versions API
        this.router.get(`/s/-/dw/data/${this.ocapiConfig.version}/code_versions`, 
            this.handleGetCodeVersions.bind(this)
        );
        
        this.router.patch(`/s/-/dw/data/${this.ocapiConfig.version}/code_versions/:versionId`, 
            this.handleActivateCodeVersion.bind(this)
        );
    }

    /**
     * Handle get code versions
     */
    async handleGetCodeVersions(req, res) {
        let mockData = this.dataLoader.loadOcapiData('code-versions.json');
        
        if (!mockData) {
            // Create fallback data with proper SFCC format
            mockData = {
                "_v": "23.2",
                "_type": "code_version_result",
                "count": 1,
                "data": [
                    {
                        "_type": "code_version",
                        "id": "SFRA_FALLBACK_VERSION",
                        "active": true,
                        "activation_time": new Date().toISOString(),
                        "last_modification_time": new Date().toISOString(),
                        "rollback": false,
                        "compatibility_mode": "22.7",
                        "cartridges": [
                            "app_storefront_base",
                            "bm_app_storefront_base",
                            "modules"
                        ],
                        "web_dav_url": "https://development-na01-sandbox.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Cartridges/SFRA_FALLBACK_VERSION"
                    }
                ],
                "total": 1
            };
        }

        res.json(mockData);
    }

    /**
     * Handle activate code version
     */
    async handleActivateCodeVersion(req, res) {
        const { versionId } = req.params;
        
        // Simulate activation
        res.json({
            id: versionId,
            active: true,
            last_activation_time: new Date().toISOString(),
            rollout_percentage: 100
        });
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = CodeVersionsHandler;
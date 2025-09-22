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
                "_v": "24.4",
                "_type": "code_versions",
                "count": 2,
                "data": [
                    {
                        "_type": "code_version",
                        "id": "version1",
                        "active": true,
                        "activation_time": new Date().toISOString(),
                        "last_modification_time": new Date().toISOString(),
                        "total_size": 12345678,
                        "cartridges": [
                            { "name": "app_storefront_base" }
                        ],
                        "_links": {
                            "self": {
                                "href": "https://{{hostname}}/s/-/dw/data/v24_4/code_versions/version1"
                            }
                        }
                    }
                ],
                "next": null,
                "previous": null,
                "start": 0,
                "total": 2
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
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
        
        // Load current mock data to find the version being activated
        let mockData = this.dataLoader.loadOcapiData('code-versions.json');
        
        if (!mockData) {
            return res.status(404).json({
                "_v": "23.2",
                "_type": "fault",
                "fault": {
                    "type": "InvalidParameterException",
                    "message": `Code version '${versionId}' not found`
                }
            });
        }

        // Find the code version being activated
        const versionToActivate = mockData.data.find(cv => cv.id === versionId);
        if (!versionToActivate) {
            return res.status(404).json({
                "_v": "23.2",
                "_type": "fault",
                "fault": {
                    "type": "InvalidParameterException",
                    "message": `Code version '${versionId}' not found`
                }
            });
        }

        if (versionToActivate.active) {
            // For the reset version, return the current version data instead of an error
            // This allows tests to "activate" it reliably regardless of current state
            if (versionId === 'reset_version') {
                const activationTime = versionToActivate.activation_time || new Date().toISOString();
                const activatedVersion = {
                    "_v": "23.2",
                    "_type": "code_version",
                    "_resource_state": this.generateResourceState(),
                    "activation_time": activationTime,
                    "active": true,
                    "cartridges": versionToActivate.cartridges || [],
                    "compatibility_mode": versionToActivate.compatibility_mode || "22.7",
                    "id": versionId,
                    "last_modification_time": versionToActivate.last_modification_time || activationTime,
                    "rollback": false,
                    "web_dav_url": versionToActivate.web_dav_url || `https://development-na01-sandbox.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Cartridges/${versionId}`
                };
                return res.json(activatedVersion);
            }
            
            return res.status(400).json({
                "_v": "23.2",
                "_type": "fault",
                "fault": {
                    "type": "InvalidParameterException",
                    "message": `Code version '${versionId}' is already active`
                }
            });
        }

        // Create response matching real SFCC API behavior
        const activationTime = new Date().toISOString();
        const activatedVersion = {
            "_v": "23.2",
            "_type": "code_version",
            "_resource_state": this.generateResourceState(),
            "activation_time": activationTime,
            "active": true,
            "cartridges": versionToActivate.cartridges || [],
            "compatibility_mode": versionToActivate.compatibility_mode || "22.7",
            "id": versionId,
            "last_modification_time": versionToActivate.last_modification_time || activationTime,
            "rollback": false, // Real API sets this to false when activating
            "web_dav_url": versionToActivate.web_dav_url || `https://development-na01-sandbox.dx.commercecloud.salesforce.com/on/demandware.servlet/webdav/Sites/Cartridges/${versionId}`
        };

        // Update the mock data state (deactivate others, activate target)
        mockData.data.forEach(cv => {
            if (cv.id === versionId) {
                cv.active = true;
                cv.activation_time = activationTime;
                cv.rollback = false;
            } else if (cv.active) {
                cv.active = false;
                delete cv.activation_time; // Remove activation_time from deactivated versions
            }
        });

        // Save updated state back to file (in a real scenario)
        // For now, just return the response

        res.json(activatedVersion);
    }

    /**
     * Generate a mock resource state hash
     */
    generateResourceState() {
        // Generate a 64-character hex string similar to SFCC's resource state
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < 64; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = CodeVersionsHandler;
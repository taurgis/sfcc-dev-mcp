/**
 * Site Preferences Handler
 * 
 * Handles site preferences search operations for OCAPI endpoints.
 */

const express = require('express');

class SitePreferencesHandler {
    constructor(config, dataLoader) {
        this.config = config;
        this.ocapiConfig = config.getOcapiConfig();
        this.dataLoader = dataLoader;
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // Site Preferences Search - proper SFCC route pattern
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/site_preferences/preference_groups/:groupId/:instanceType/preference_search`, 
            this.handleSearchSitePreferences.bind(this)
        );
    }

    /**
     * Handle site preferences search
     */
    async handleSearchSitePreferences(req, res) {
        const { groupId, instanceType } = req.params;
        const searchRequest = req.body;
        
        // Try to load specific site preferences
        let mockData = this.dataLoader.loadOcapiData(`site-preferences-${groupId.toLowerCase()}.json`);
        
        if (!mockData) {
            // Create fallback data with proper SFCC format
            mockData = {
                "_v": "24.4",
                "_type": "site_preferences",
                "count": 0,
                "data": [],
                "next": null,
                "previous": null,
                "start": 0,
                "total": 0
            };
        }

        // Apply search and pagination
        let results = mockData.data || [];
        
        // Apply pagination
        const start = searchRequest.start || 0;
        const count = searchRequest.count || 200;
        const paginatedResults = results.slice(start, start + count);

        res.json({
            ...mockData,
            count: paginatedResults.length,
            start,
            data: paginatedResults
        });
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = SitePreferencesHandler;
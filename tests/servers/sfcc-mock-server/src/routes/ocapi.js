/**
 * OCAPI Route Handler
 * 
 * Handles SFCC Open Commerce API (OCAPI) requests including OAuth, system objects,
 * site preferences, and code versions. Modular implementation with proper authentication.
 */

const express = require('express');
const MockDataLoader = require('../utils/mock-data-loader');

class OCAPIRouteHandler {
    constructor(config, authManager) {
        this.config = config;
        this.ocapiConfig = config.getOcapiConfig();
        this.authManager = authManager;
        this.dataLoader = new MockDataLoader(config.mockDataPath);
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

        // Apply authentication middleware to all OCAPI data endpoints
        const requireAuth = this.authManager.requireAuth();

        // System Object Definitions - List all
        this.router.get(`/s/-/dw/data/${this.ocapiConfig.version}/system_object_definitions`, 
            requireAuth, 
            this.handleGetSystemObjectDefinitions.bind(this)
        );
        
        // System Object Definition - Get specific
        this.router.get(`/s/-/dw/data/${this.ocapiConfig.version}/system_object_definitions/:objectType`, 
            requireAuth, 
            this.handleGetSystemObjectDefinition.bind(this)
        );
        
        // System Object Definition Search
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/system_object_definition_search`, 
            requireAuth, 
            this.handleSearchSystemObjectDefinitions.bind(this)
        );
        
        // System Object Attribute Definition Search
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/system_object_definitions/:objectType/attribute_definition_search`, 
            requireAuth, 
            this.handleSearchSystemObjectAttributeDefinitions.bind(this)
        );
        
        // System Object Attribute Group Search
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/system_object_definitions/:objectType/attribute_group_search`, 
            requireAuth, 
            this.handleSearchSystemObjectAttributeGroups.bind(this)
        );
        
        // Custom Object Attribute Definition Search  
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/custom_object_definitions/:objectType/attribute_definition_search`, 
            requireAuth, 
            this.handleSearchCustomObjectAttributeDefinitions.bind(this)
        );
        
        // Site Preferences Search
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/site_preferences/:groupId/search`, 
            requireAuth, 
            this.handleSearchSitePreferences.bind(this)
        );
        
        // Code Versions API
        this.router.get(`/s/-/dw/data/${this.ocapiConfig.version}/code_versions`, 
            requireAuth, 
            this.handleGetCodeVersions.bind(this)
        );
        
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/code_versions/:versionId/activate`, 
            requireAuth, 
            this.handleActivateCodeVersion.bind(this)
        );
    }

    /**
     * Handle GET system object definitions
     */
    async handleGetSystemObjectDefinitions(req, res) {
        const { start = 0, count = 200, select = '(**)' } = req.query;
        
        let mockData = this.dataLoader.loadOcapiData('system-object-definitions.json');
        
        if (!mockData) {
            // Fallback mock data
            mockData = this.getDefaultSystemObjectDefinitions();
        }

        // Apply pagination
        const startInt = parseInt(start);
        const countInt = parseInt(count);
        const paginatedHits = mockData.hits.slice(startInt, startInt + countInt);

        res.json({
            ...mockData,
            start: startInt,
            count: paginatedHits.length,
            hits: paginatedHits
        });
    }

    /**
     * Handle GET specific system object definition
     */
    async handleGetSystemObjectDefinition(req, res) {
        const { objectType } = req.params;
        
        // Try to load specific object definition
        let mockData = this.dataLoader.loadOcapiData(`system-object-definition-${objectType.toLowerCase()}.json`);
        
        if (!mockData) {
            // Create a basic fallback
            mockData = {
                _type: 'object_type_definition',
                object_type: objectType,
                display_name: { default: objectType },
                description: { default: `SFCC ${objectType} object` },
                attribute_definition_count: 0,
                attribute_group_count: 0,
                key_attribute_id: 'id',
                content_object: false,
                queryable: true,
                read_only: false,
                creation_date: new Date().toISOString(),
                last_modified: new Date().toISOString()
            };
        }

        res.json(mockData);
    }

    /**
     * Handle system object definition search
     */
    async handleSearchSystemObjectDefinitions(req, res) {
        const searchRequest = req.body;
        
        // Load base data
        let mockData = this.dataLoader.loadOcapiData('system-object-definitions.json');
        if (!mockData) {
            mockData = this.getDefaultSystemObjectDefinitions();
        }

        // Simple search implementation (in real SFCC this would be more complex)
        let results = mockData.hits;

        // Apply basic filtering if search criteria provided
        if (searchRequest.query && searchRequest.query.text_query) {
            const searchTerm = searchRequest.query.text_query.search_phrase.toLowerCase();
            results = results.filter(item => 
                item.object_type.toLowerCase().includes(searchTerm) ||
                (item.display_name && item.display_name.default.toLowerCase().includes(searchTerm))
            );
        }

        // Apply pagination
        const start = searchRequest.start || 0;
        const count = searchRequest.count || 200;
        const paginatedResults = results.slice(start, start + count);

        res.json({
            count: paginatedResults.length,
            total: results.length,
            start,
            hits: paginatedResults
        });
    }

    /**
     * Handle system object attribute definition search
     */
    async handleSearchSystemObjectAttributeDefinitions(req, res) {
        const { objectType } = req.params;
        const searchRequest = req.body;
        
        // Try to load specific attribute definitions
        let mockData = this.dataLoader.loadOcapiData(`system-object-attributes-${objectType.toLowerCase()}.json`);
        
        if (!mockData) {
            // Create fallback data
            mockData = {
                count: 0,
                hits: []
            };
        }

        // Apply search and pagination
        let results = mockData.hits || [];
        
        // Apply pagination
        const start = searchRequest.start || 0;
        const count = searchRequest.count || 200;
        const paginatedResults = results.slice(start, start + count);

        res.json({
            count: paginatedResults.length,
            total: results.length,
            start,
            hits: paginatedResults
        });
    }

    /**
     * Handle system object attribute group search
     */
    async handleSearchSystemObjectAttributeGroups(req, res) {
        const { objectType } = req.params;
        const searchRequest = req.body;
        
        // Try to load specific attribute groups
        let mockData = this.dataLoader.loadOcapiData(`system-object-groups-${objectType.toLowerCase()}.json`);
        
        if (!mockData) {
            // Create fallback data
            mockData = {
                count: 0,
                hits: []
            };
        }

        // Apply search and pagination
        let results = mockData.hits || [];
        
        // Apply pagination
        const start = searchRequest.start || 0;
        const count = searchRequest.count || 200;
        const paginatedResults = results.slice(start, start + count);

        res.json({
            count: paginatedResults.length,
            total: results.length,
            start,
            hits: paginatedResults
        });
    }

    /**
     * Handle custom object attribute definition search
     */
    async handleSearchCustomObjectAttributeDefinitions(req, res) {
        const { objectType } = req.params;
        const searchRequest = req.body;
        
        // Try to load specific custom object attribute definitions
        let mockData = this.dataLoader.loadOcapiData(`custom-object-attributes-${objectType.toLowerCase()}.json`);
        
        if (!mockData) {
            // Create fallback data
            mockData = {
                count: 0,
                hits: []
            };
        }

        // Apply search and pagination
        let results = mockData.hits || [];
        
        // Apply pagination
        const start = searchRequest.start || 0;
        const count = searchRequest.count || 200;
        const paginatedResults = results.slice(start, start + count);

        res.json({
            count: paginatedResults.length,
            total: results.length,
            start,
            hits: paginatedResults
        });
    }

    /**
     * Handle site preferences search
     */
    async handleSearchSitePreferences(req, res) {
        const { groupId } = req.params;
        const searchRequest = req.body;
        
        // Try to load specific site preferences
        let mockData = this.dataLoader.loadOcapiData(`site-preferences-${groupId.toLowerCase()}.json`);
        
        if (!mockData) {
            // Create fallback data
            mockData = {
                count: 0,
                hits: []
            };
        }

        // Apply search and pagination
        let results = mockData.hits || [];
        
        // Apply pagination
        const start = searchRequest.start || 0;
        const count = searchRequest.count || 200;
        const paginatedResults = results.slice(start, start + count);

        res.json({
            count: paginatedResults.length,
            total: results.length,
            start,
            hits: paginatedResults
        });
    }

    /**
     * Handle get code versions
     */
    async handleGetCodeVersions(req, res) {
        let mockData = this.dataLoader.loadOcapiData('code-versions.json');
        
        if (!mockData) {
            // Create fallback data
            mockData = {
                count: 2,
                data: [
                    {
                        id: 'version1',
                        active: true,
                        last_activation_time: new Date().toISOString(),
                        rollout_percentage: 100
                    },
                    {
                        id: 'version2',
                        active: false,
                        last_activation_time: null,
                        rollout_percentage: 0
                    }
                ]
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
     * Get default system object definitions for fallback
     */
    getDefaultSystemObjectDefinitions() {
        return {
            count: 25,
            hits: [
                {
                    _type: 'object_type_definition',
                    object_type: 'Product',
                    display_name: { default: 'Product' },
                    description: { default: 'SFCC Product object' },
                    attribute_definition_count: 45,
                    attribute_group_count: 8,
                    key_attribute_id: 'id',
                    content_object: false,
                    queryable: true,
                    read_only: false,
                    creation_date: '2021-01-01T00:00:00.000Z',
                    last_modified: '2024-01-01T00:00:00.000Z'
                },
                {
                    _type: 'object_type_definition',
                    object_type: 'Customer',
                    display_name: { default: 'Customer' },
                    description: { default: 'SFCC Customer object' },
                    attribute_definition_count: 32,
                    attribute_group_count: 6,
                    key_attribute_id: 'customer_no',
                    content_object: false,
                    queryable: true,
                    read_only: false,
                    creation_date: '2021-01-01T00:00:00.000Z',
                    last_modified: '2024-01-01T00:00:00.000Z'
                },
                {
                    _type: 'object_type_definition',
                    object_type: 'Order',
                    display_name: { default: 'Order' },
                    description: { default: 'SFCC Order object' },
                    attribute_definition_count: 28,
                    attribute_group_count: 5,
                    key_attribute_id: 'order_no',
                    content_object: false,
                    queryable: true,
                    read_only: false,
                    creation_date: '2021-01-01T00:00:00.000Z',
                    last_modified: '2024-01-01T00:00:00.000Z'
                }
            ]
        };
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = OCAPIRouteHandler;
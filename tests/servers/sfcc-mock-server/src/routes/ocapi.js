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
        
        // Site Preferences Search - proper SFCC route pattern
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/site_preferences/preference_groups/:groupId/:instanceType/preference_search`, 
            requireAuth, 
            this.handleSearchSitePreferences.bind(this)
        );
        
        // Code Versions API
        this.router.get(`/s/-/dw/data/${this.ocapiConfig.version}/code_versions`, 
            requireAuth, 
            this.handleGetCodeVersions.bind(this)
        );
        
        this.router.patch(`/s/-/dw/data/${this.ocapiConfig.version}/code_versions/:versionId`, 
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
            // Fallback mock data with proper SFCC format
            mockData = {
                "_v": "24.4",
                "_type": "system_object_definitions",
                "count": 0,
                "data": [],
                "next": null,
                "previous": null,
                "start": 0,
                "total": 0
            };
        }

        // Apply pagination
        const startInt = parseInt(start);
        const countInt = parseInt(count);
        const paginatedData = mockData.data.slice(startInt, startInt + countInt);
        
        // Calculate pagination URLs
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
        let nextUrl = null;
        let previousUrl = null;
        
        // Generate next URL if there are more items
        const hasMore = (startInt + paginatedData.length) < mockData.total;
        if (hasMore) {
            const nextStart = startInt + countInt;
            nextUrl = `${baseUrl}?start=${nextStart}&count=${countInt}`;
            if (select !== '(**)') {
                nextUrl += `&select=${encodeURIComponent(select)}`;
            }
        }
        
        // Generate previous URL if not at the beginning
        if (startInt > 0) {
            const prevStart = Math.max(0, startInt - countInt);
            previousUrl = `${baseUrl}?start=${prevStart}&count=${countInt}`;
            if (select !== '(**)') {
                previousUrl += `&select=${encodeURIComponent(select)}`;
            }
        }

        res.json({
            "_v": mockData._v,
            "_type": mockData._type,
            "count": paginatedData.length,
            "data": paginatedData,
            "next": nextUrl,
            "previous": previousUrl,
            "start": startInt,
            "total": mockData.total
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
            // Create fallback data with realistic SFCC format
            mockData = {
                "_v": "23.2",
                "_type": "object_attribute_definition_search_result",
                "count": 0,
                "hits": [],
                "query": searchRequest.query || {"match_all_query": {}},
                "start": 0,
                "total": 0
            };
        }

        // Apply search and pagination
        let results = mockData.hits || [];
        
        // Apply text search if provided
        if (searchRequest.query && searchRequest.query.text_query) {
            const searchTerm = searchRequest.query.text_query.search_phrase.toLowerCase();
            results = results.filter(item => 
                item.id.toLowerCase().includes(searchTerm)
            );
        }
        
        // Store total filtered results count
        const totalFiltered = results.length;
        
        // Apply pagination
        const start = searchRequest.start || 0;
        const count = searchRequest.count || 200;
        const paginatedResults = results.slice(start, start + count);

        // Build response in SFCC format
        const response = {
            "_v": mockData._v || "23.2",
            "_type": "object_attribute_definition_search_result",
            "count": paginatedResults.length,
            "hits": paginatedResults,
            "query": searchRequest.query || {"match_all_query": {}},
            "start": start,
            "total": totalFiltered
        };

        // Add next page link if there are more results
        if (start + count < totalFiltered) {
            response.next = {
                "_type": "result_page",
                "count": Math.min(count, totalFiltered - (start + count)),
                "start": start + count
            };
        }

        res.json(response);
    }

    /**
     * Handle system object attribute group search
     */
    async handleSearchSystemObjectAttributeGroups(req, res) {
        const { objectType } = req.params;
        const searchRequest = req.body;
        
        // Try to load specific attribute groups with correct naming
        let mockData = this.dataLoader.loadOcapiData(`system-object-attribute-groups-${objectType.toLowerCase()}.json`);
        
        if (!mockData) {
            // Create fallback data with proper SFCC format
            mockData = {
                "_v": "24.4",
                "_type": "attribute_groups",
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
     * Handle custom object attribute definition search
     */
    async handleSearchCustomObjectAttributeDefinitions(req, res) {
        const { objectType } = req.params;
        const searchRequest = req.body;
        
        // Try to load specific custom object attribute definitions
        let mockData = this.dataLoader.loadOcapiData(`custom-object-attributes-${objectType.toLowerCase()}.json`);
        
        if (!mockData) {
            // Create fallback data with proper SFCC format
            mockData = {
                "_v": "24.4",
                "_type": "object_attribute_definition_search_result",
                "count": 0,
                "data": [],
                "next": null,
                "previous": null,
                "start": 0,
                "total": 0,
                "query": searchRequest.query || {"match_all_query": {}}
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
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

        // Fix total count to match actual data length
        mockData.total = mockData.data.length;

        // Extract data-specific select pattern if present
        let dataSelectPattern = select;
        if (select && select.includes('data.(')) {
            const dataMatch = select.match(/data\.\(([^)]*)\)/);
            if (dataMatch) {
                dataSelectPattern = `(${dataMatch[1]})`;
            }
        }

        // Apply select parameter to modify object structure
        let processedData = mockData.data.map(obj => this.applySelectParameter(obj, dataSelectPattern));

        // Apply pagination
        const startInt = parseInt(start);
        const countInt = parseInt(count);
        const paginatedData = processedData.slice(startInt, startInt + countInt);
        
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

        const fullResponse = {
            "_v": mockData._v,
            "_type": mockData._type,
            "count": paginatedData.length,
            "data": paginatedData,
            "next": nextUrl,
            "previous": previousUrl,
            "start": startInt,
            "total": mockData.total
        };

        // Add select field to response if provided (like real API)
        if (select && select !== '(**)') {
            fullResponse.select = select;
        }

        // Apply root-level select parameter to the entire response
        const response = this.applyRootSelectParameter(fullResponse, select);

        res.json(response);
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
     * Apply select parameter to the root response structure based on SFCC select syntax
     * Examples:
     * - (**) = return full response 
     * - (start, total) = return only start and total fields
     * - (data.(**)) = return only data array with all object properties
     * - (data.(object_type)) = return only data array with specific fields
     * - (start, data.(**)) = return start field plus data array with all properties
     */
    applyRootSelectParameter(response, select) {
        // Default behavior - return full response
        if (!select || select === '(**)') {
            return response;
        }

        // Parse select parameter - remove outer parentheses and split by commas
        const trimmed = select.replace(/^\(|\)$/g, '');
        const parts = this.parseSelectParts(trimmed);
        
        const result = {};
        
        // Always include metadata fields that SFCC includes
        result._v = response._v;
        result._type = response._type;
        
        for (const part of parts) {
            const trimmedPart = part.trim();
            
            if (trimmedPart === 'start') {
                result.start = response.start;
            } else if (trimmedPart === 'total') {
                result.total = response.total;
            } else if (trimmedPart === 'count') {
                result.count = response.count;
            } else if (trimmedPart === 'next') {
                result.next = response.next;
            } else if (trimmedPart === 'previous') {
                result.previous = response.previous;
            } else if (trimmedPart === 'select') {
                result.select = response.select;
            } else if (trimmedPart.startsWith('data.')) {
                // Handle data.(...) patterns
                result.data = response.data;
                // Note: data object filtering is already applied by applySelectParameter
            } else if (trimmedPart === 'data') {
                result.data = response.data;
            }
        }
        
        return result;
    }

    /**
     * Parse select parts handling nested parentheses correctly
     */
    parseSelectParts(selectString) {
        const parts = [];
        let current = '';
        let depth = 0;
        
        for (let i = 0; i < selectString.length; i++) {
            const char = selectString[i];
            
            if (char === '(') {
                depth++;
                current += char;
            } else if (char === ')') {
                depth--;
                current += char;
            } else if (char === ',' && depth === 0) {
                if (current.trim()) {
                    parts.push(current.trim());
                }
                current = '';
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            parts.push(current.trim());
        }
        
        return parts;
    }

    /**
     * Apply select parameter to modify object structure based on SFCC select syntax
     * Examples:
     * - Default (no select) = return basic format (_type, _resource_state, object_type, link)
     * - (**) = return all fields (enhanced detailed format)
     * - (data.(object_type)) = return only object_type field in data objects
     * - (data.(object_type,display_name)) = return specific fields in data objects
     */
    applySelectParameter(obj, select) {
        // Default behavior (no select) - return basic format
        if (!select) {
            return obj; // Keep original basic format
        }

        // Full select - return enhanced detailed format
        if (select === '(**)') {
            return this.enhanceObjectWithDetailedFields(obj);
        }

        // Specific field selection using (...) syntax (after data.() processing)
        if (select.startsWith('(') && select.endsWith(')') && !select.startsWith('(data.(')) {
            // Extract field list from (field1,field2)
            const fieldsMatch = select.match(/\(([^)]+)\)/);
            if (fieldsMatch) {
                const fields = fieldsMatch[1].split(',').map(f => f.trim());
                return this.selectSpecificFields(obj, fields);
            }
        }

        // Specific field selection using data.(...) syntax
        if (select.startsWith('(data.(') && select.endsWith('))')) {
            // Extract field list from (data.(field1,field2))
            const fieldsMatch = select.match(/\(data\.\(([^)]+)\)\)/);
            if (fieldsMatch) {
                const fields = fieldsMatch[1].split(',').map(f => f.trim());
                return this.selectSpecificFields(obj, fields);
            }
        }

        // Other select patterns that don't work properly in real API
        // Return basic format as fallback
        return obj;
    }

    /**
     * Select only specific fields from the object
     */
    selectSpecificFields(obj, fields) {
        const result = {
            "_type": "object_type_definition",
            "_resource_state": obj._resource_state
        };

        // Add requested fields
        fields.forEach(field => {
            if (field === 'object_type') {
                result.object_type = obj.object_type;
            } else if (field === 'display_name') {
                result.display_name = this.getObjectTypeDisplayName(obj.object_type);
            } else if (field === 'description') {
                result.description = this.getObjectTypeDescription(obj.object_type);
            } else if (field === 'link') {
                result.link = obj.link;
            } else if (field === 'read_only') {
                result.read_only = this.getObjectTypeReadOnly(obj.object_type);
            } else if (field === 'queryable') {
                result.queryable = this.getObjectTypeQueryable(obj.object_type);
            } else if (field === 'content_object') {
                result.content_object = this.getObjectTypeContentObject(obj.object_type);
            } else if (field === 'attribute_definition_count') {
                result.attribute_definition_count = this.getObjectTypeAttributeCount(obj.object_type);
            } else if (field === 'attribute_group_count') {
                result.attribute_group_count = this.getObjectTypeAttributeGroupCount(obj.object_type);
            } else if (field === 'creation_date') {
                result.creation_date = "2024-02-19T10:18:31.000Z";
            } else if (field === 'last_modified') {
                result.last_modified = "2024-02-19T10:18:31.000Z";
            }
        });

        return result;
    }

    /**
     * Get display name for object type (with internationalization)
     */
    getObjectTypeDisplayName(objectType) {
        const displayNames = {
            'Appeasement': {
                "de": "Beschwerde",
                "default": "Appeasement",
                "ja": "譲歩",
                "it": "Riconciliazione", 
                "fr": "Geste commercial",
                "zh-CN": "协调",
                "es": "Compensación",
                "nl": "Tegemoetkoming"
            },
            'AppeasementItem': {
                "de": "Beschwerde-Artikel",
                "default": "Appeasement Item",
                "ja": "譲歩項目",
                "it": "Articolo di riconciliazione",
                "fr": "Article du geste commercial", 
                "zh-CN": "协调项目",
                "es": "Artículo de compensación",
                "nl": "Tegemoetkomingsitem"
            },
            'Basket': {
                "de": "Warenkorb",
                "default": "Basket",
                "ja": "買い物カゴ",
                "it": "Carrello",
                "fr": "Panier",
                "zh-CN": "购物车",
                "es": "Canasta",
                "nl": "Mandje"
            }
        };
        
        return displayNames[objectType] || {
            "default": objectType
        };
    }

    /**
     * Get description for object type (with internationalization)
     */
    getObjectTypeDescription(objectType) {
        const descriptions = {
            'Appeasement': { "default": "Object type representing appeasements." },
            'AppeasementItem': { "default": "Object type representing appeasement items." },
            'Basket': { "default": "Object type representing baskets." },
            'Product': { "default": "Object type representing products." },
            'Category': { "default": "Object type representing categories." },
            'Content': { "default": "Object type representing content assets." }
        };
        
        return descriptions[objectType] || {
            "default": `Object type representing ${objectType.toLowerCase()} entities.`
        };
    }

    /**
     * Enhance basic object definition with detailed fields to match real SFCC API response
     */
    enhanceObjectWithDetailedFields(obj) {
        // Return enhanced version with detailed fields (like the real API with select=(**))
        const enhanced = {
            "_type": "object_type_definition",
            "_resource_state": obj._resource_state,
            "attribute_definition_count": this.getObjectTypeAttributeCount(obj.object_type),
            "attribute_group_count": this.getObjectTypeAttributeGroupCount(obj.object_type),
            "content_object": this.getObjectTypeContentObject(obj.object_type),
            "creation_date": "2024-02-19T10:18:31.000Z",
            "description": this.getObjectTypeDescription(obj.object_type),
            "display_name": this.getObjectTypeDisplayName(obj.object_type),
            "last_modified": "2024-02-19T10:18:31.000Z",
            "link": obj.link,
            "object_type": obj.object_type,
            "queryable": this.getObjectTypeQueryable(obj.object_type),
            "read_only": this.getObjectTypeReadOnly(obj.object_type)
        };

        return enhanced;
    }

    /**
     * Get read_only flag for object type
     */
    getObjectTypeReadOnly(objectType) {
        const readOnlyTypes = ['CustomerActiveData', 'CustomerCDPData'];
        return readOnlyTypes.includes(objectType);
    }

    /**
     * Get queryable flag for object type
     */
    getObjectTypeQueryable(objectType) {
        const nonQueryableTypes = ['CustomObject'];
        return !nonQueryableTypes.includes(objectType);
    }

    /**
     * Get content_object flag for object type
     */
    getObjectTypeContentObject(objectType) {
        const contentObjectTypes = ['Content'];
        return contentObjectTypes.includes(objectType);
    }

    /**
     * Get attribute definition count for object type (matching real API data)
     */
    getObjectTypeAttributeCount(objectType) {
        const attributeCounts = {
            'Appeasement': 9,
            'AppeasementItem': 7,
            'Basket': 11,
            'BonusDiscountLineItem': 5,
            'Campaign': 25,
            'Catalog': 12,
            'Category': 45,
            'CategoryAssignment': 8,
            'Content': 60,
            'Coupon': 18,
            'CouponLineItem': 6,
            'CustomObject': 5,
            'CustomerActiveData': 10,
            'CustomerAddress': 15,
            'CustomerCDPData': 10,
            'CustomerGroup': 8,
            'CustomerPaymentInstrument': 10,
            'Customer': 28,
            'Order': 65,
            'Product': 166
        };
        return attributeCounts[objectType] || 10;
    }

    /**
     * Get attribute group count for object type (matching real API data)
     */
    getObjectTypeAttributeGroupCount(objectType) {
        const groupCounts = {
            'Appeasement': 2,
            'AppeasementItem': 1,
            'Basket': 1,
            'BonusDiscountLineItem': 1,
            'Campaign': 2,
            'Catalog': 1,
            'Category': 3,
            'CategoryAssignment': 1,
            'Content': 3,
            'Coupon': 2,
            'CouponLineItem': 1,
            'CustomObject': 1,
            'CustomerActiveData': 2,
            'CustomerAddress': 2,
            'CustomerCDPData': 2,
            'CustomerGroup': 1,
            'CustomerPaymentInstrument': 2,
            'Customer': 4,
            'Order': 6,
            'Product': 5
        };
        return groupCounts[objectType] || 2;
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = OCAPIRouteHandler;
/**
 * System Objects Handler
 * 
 * Handles system object definitions, attribute definitions, attribute groups,
 * and custom object definitions for OCAPI endpoints.
 */

const express = require('express');
const OCAPIUtils = require('./ocapi-utils');
const OCAPIErrorUtils = require('./ocapi-error-utils');

class SystemObjectsHandler {
    constructor(config, dataLoader) {
        this.config = config;
        this.ocapiConfig = config.getOcapiConfig();
        this.dataLoader = dataLoader;
        this.router = express.Router();
        this.setupRoutes();
    }

    setupRoutes() {
        // System Object Definitions - List all
        this.router.get(`/s/-/dw/data/${this.ocapiConfig.version}/system_object_definitions`, 
            this.handleGetSystemObjectDefinitions.bind(this)
        );
        
        // System Object Definition - Get specific
        this.router.get(`/s/-/dw/data/${this.ocapiConfig.version}/system_object_definitions/:objectType`, 
            this.handleGetSystemObjectDefinition.bind(this)
        );
        
        // System Object Definition Search
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/system_object_definition_search`, 
            this.handleSearchSystemObjectDefinitions.bind(this)
        );
        
        // System Object Attribute Definition Search
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/system_object_definitions/:objectType/attribute_definition_search`, 
            this.handleSearchSystemObjectAttributeDefinitions.bind(this)
        );
        
        // System Object Attribute Group Search
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/system_object_definitions/:objectType/attribute_group_search`, 
            this.handleSearchSystemObjectAttributeGroups.bind(this)
        );
        
        // Custom Object Attribute Definition Search  
        this.router.post(`/s/-/dw/data/${this.ocapiConfig.version}/custom_object_definitions/:objectType/attribute_definition_search`, 
            this.handleSearchCustomObjectAttributeDefinitions.bind(this)
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
        let processedData = mockData.data.map(obj => OCAPIUtils.applySelectParameter(obj, dataSelectPattern));

        // Apply pagination
        const startInt = parseInt(start);
        const countInt = parseInt(count);
        const paginatedData = processedData.slice(startInt, startInt + countInt);
        
        // Calculate pagination URLs
        const { nextUrl, previousUrl } = OCAPIUtils.generatePaginationUrls(
            req, startInt, countInt, mockData.total, select
        );

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
        const response = OCAPIUtils.applyRootSelectParameter(fullResponse, select);

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
        results = OCAPIUtils.applyTextSearch(results, searchRequest.query);

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
        
        // Try to load specific attribute definitions based on select parameter
        const isExpandedRequest = searchRequest.select === "(**)";
        const mockDataFile = isExpandedRequest 
            ? `system-object-attributes-${objectType.toLowerCase()}-expanded.json`
            : `system-object-attributes-${objectType.toLowerCase()}.json`;
        
        let mockData = this.dataLoader.loadOcapiData(mockDataFile);
        
        // Fallback to basic data if expanded data doesn't exist
        if (!mockData && isExpandedRequest) {
            mockData = this.dataLoader.loadOcapiData(`system-object-attributes-${objectType.toLowerCase()}.json`);
        }
        
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
        results = OCAPIUtils.applyTextSearch(results, searchRequest.query);
        
        // Handle select parameter for expanded data
        if (isExpandedRequest && mockData.expandedData) {
            results = results.map(item => {
                const expandedItem = mockData.expandedData[item.id];
                return expandedItem || item;
            });
        }
        
        // Store total filtered results count
        const totalFiltered = results.length;
        
        // Apply pagination
        const start = searchRequest.start || 0;
        const count = searchRequest.count || 200;
        const paginatedResults = results.slice(start, start + count);

        // Build query response with proper _type fields to match real API
        const queryResponse = OCAPIUtils.buildQueryResponse(searchRequest.query);

        // Build response in SFCC format
        const response = {
            "_v": mockData._v || "23.2",
            "_type": "object_attribute_definition_search_result",
            "count": paginatedResults.length,
            "hits": paginatedResults,
            "query": queryResponse,
            "start": start,
            "total": totalFiltered
        };

        // Add select parameter to response if it was provided
        if (searchRequest.select) {
            response.select = searchRequest.select;
        }

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
        try {
            const { objectType } = req.params;
            const searchRequest = req.body;

            // 1. Validate object type
            const objectTypeError = OCAPIErrorUtils.validateObjectType(objectType);
            if (objectTypeError) {
                return OCAPIErrorUtils.sendErrorResponse(res, objectTypeError);
            }

            // 2. Check for object types that don't support attribute groups (based on real API testing)
            const unsupportedObjectTypes = ['Customer', 'Site', 'Inventory'];
            if (unsupportedObjectTypes.includes(objectType)) {
                const notFoundError = OCAPIErrorUtils.createObjectTypeNotFound(objectType);
                return OCAPIErrorUtils.sendErrorResponse(res, notFoundError);
            }

            // 3. Validate search request structure
            const searchRequestError = OCAPIErrorUtils.validateSearchRequest(searchRequest);
            if (searchRequestError) {
                return OCAPIErrorUtils.sendErrorResponse(res, searchRequestError);
            }

            // 4. Validate pagination parameters
            const paginationError = OCAPIErrorUtils.validatePagination(searchRequest.start, searchRequest.count);
            if (paginationError) {
                return OCAPIErrorUtils.sendErrorResponse(res, paginationError);
            }

            // 5. Validate specific query types
            if (searchRequest.query.text_query) {
                const textQueryError = OCAPIErrorUtils.validateTextQuery(searchRequest.query.text_query);
                if (textQueryError) {
                    return OCAPIErrorUtils.sendErrorResponse(res, textQueryError);
                }
            }

            if (searchRequest.query.term_query) {
                const termQueryError = OCAPIErrorUtils.validateTermQuery(searchRequest.query.term_query);
                if (termQueryError) {
                    return OCAPIErrorUtils.sendErrorResponse(res, termQueryError);
                }
            }

            // 6. Simulate occasional server errors (1% chance)
            if (Math.random() < 0.01) {
                const serverError = OCAPIErrorUtils.createInternalServerError(
                    "Service temporarily unavailable. Please try again later."
                );
                return OCAPIErrorUtils.sendErrorResponse(res, serverError);
            }

            // Try to load specific attribute groups with correct naming
            let mockData = this.dataLoader.loadOcapiData(`system-object-attribute-groups-${objectType.toLowerCase()}.json`);
            
            if (!mockData) {
                // Create fallback data with proper SFCC format (matching real API structure)
                mockData = {
                    "_v": "23.2",
                    "_type": "object_attribute_group_search_result",
                    "count": 0,
                    "hits": [],
                    "query": {"match_all_query": {"_type": "match_all_query"}},
                    "start": 0,
                    "total": 0
                };
            }

            // Apply search and pagination
            let results = mockData.hits || [];
            
            // Apply pagination
            const start = searchRequest.start || 0;
            const count = searchRequest.count || 200;
            const paginatedResults = results.slice(start, start + count);

            // Build query response to match real API
            const queryResponse = OCAPIUtils.buildQueryResponse(searchRequest.query);

            // Return response matching real SFCC API format
            const response = {
                "_v": mockData._v || "23.2",
                "_type": "object_attribute_group_search_result",
                "count": paginatedResults.length,
                "hits": paginatedResults,
                "query": queryResponse,
                "start": start,
                "total": mockData.total || results.length
            };

            res.json(response);

        } catch (error) {
            // Handle unexpected errors
            console.error('Unexpected error in handleSearchSystemObjectAttributeGroups:', error);
            const serverError = OCAPIErrorUtils.createInternalServerError(
                "An unexpected error occurred while processing the request."
            );
            return OCAPIErrorUtils.sendErrorResponse(res, serverError);
        }
    }

    /**
     * Handle custom object attribute definition search
     */
    async handleSearchCustomObjectAttributeDefinitions(req, res) {
        const { objectType } = req.params;
        const searchRequest = req.body;
        
        // Validate object type parameter
        if (!objectType || objectType.trim() === '') {
            const error = OCAPIErrorUtils.createInvalidRequest(
                "objectType must be a non-empty string",
                "objectType"
            );
            return OCAPIErrorUtils.sendErrorResponse(res, error);
        }

        // Validate search request structure
        const validationError = this.validateSearchRequest(searchRequest);
        if (validationError) {
            return OCAPIErrorUtils.sendErrorResponse(res, validationError);
        }

        // Define known custom object types (case-insensitive)
        const knownCustomObjects = ['customapi', 'versionhistory', 'globalsettings'];
        const objectTypeLower = objectType.toLowerCase();
        
        // Try to load specific custom object attribute definitions
        let mockData = this.dataLoader.loadOcapiData(`custom-object-attributes-${objectTypeLower}.json`);
        
        if (!mockData) {
            // Check if this is a known custom object type with no data vs unknown object type
            if (!knownCustomObjects.includes(objectTypeLower)) {
                // Return 404 for unknown custom object types (like real SFCC API)
                const error = OCAPIErrorUtils.createObjectTypeNotFound(objectType);
                return OCAPIErrorUtils.sendErrorResponse(res, error);
            }
            
            // Create fallback data with proper SFCC format for known objects with no data
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
        
        // Apply pagination
        const start = searchRequest.start || 0;
        const count = searchRequest.count || 200;
        const paginatedResults = results.slice(start, start + count);

        // Build query response to match real API
        const queryResponse = OCAPIUtils.buildQueryResponse(searchRequest.query);

        res.json({
            "_v": mockData._v,
            "_type": mockData._type,
            "count": paginatedResults.length,
            "hits": paginatedResults,
            "query": queryResponse,
            "start": start,
            "total": mockData.total
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
     * Validate search request structure and parameters
     */
    validateSearchRequest(searchRequest) {
        // Must have a query property
        if (!searchRequest.query) {
            return OCAPIErrorUtils.createPropertyConstraintViolation("$.query", "search_request");
        }

        // Validate count parameter
        if (searchRequest.count !== undefined) {
            if (typeof searchRequest.count !== 'number' || searchRequest.count < 0) {
                return OCAPIErrorUtils.createInvalidRequest("count must be a positive number", "count");
            }
        }

        // Validate start parameter  
        if (searchRequest.start !== undefined) {
            if (typeof searchRequest.start !== 'number' || searchRequest.start < 0) {
                return OCAPIErrorUtils.createInvalidRequest("start must be a positive number", "start");
            }
        }

        // Validate query object
        const query = searchRequest.query;
        const queryTypes = ['text_query', 'term_query', 'filtered_query', 'bool_query', 'match_all_query'];
        const hasValidQueryType = queryTypes.some(type => query[type]);
        
        if (!hasValidQueryType) {
            return OCAPIErrorUtils.createInvalidRequest(
                "Search query must contain at least one of: text_query, term_query, filtered_query, bool_query, match_all_query"
            );
        }

        // Validate text_query
        if (query.text_query) {
            const textQuery = query.text_query;
            if (!textQuery.fields || !Array.isArray(textQuery.fields) || textQuery.fields.length === 0) {
                return OCAPIErrorUtils.createInvalidRequest("text_query.fields must be a non-empty array");
            }
            if (!textQuery.search_phrase || typeof textQuery.search_phrase !== 'string' || textQuery.search_phrase.trim() === '') {
                return OCAPIErrorUtils.createInvalidRequest("text_query.search_phrase must be a non-empty string");
            }
        }

        // Validate term_query
        if (query.term_query) {
            const termQuery = query.term_query;
            if (!termQuery.fields || !Array.isArray(termQuery.fields) || termQuery.fields.length === 0) {
                return OCAPIErrorUtils.createInvalidRequest("term_query.fields must be a non-empty array");
            }
            if (!termQuery.values || !Array.isArray(termQuery.values) || termQuery.values.length === 0) {
                return OCAPIErrorUtils.createInvalidRequest("term_query.values must be a non-empty array");
            }
            if (termQuery.operator) {
                const validOperators = ['is', 'one_of', 'not_one_of', 'is_null', 'is_not_null'];
                if (!validOperators.includes(termQuery.operator)) {
                    return OCAPIErrorUtils.createEnumConstraintViolation(termQuery.operator);
                }
            }
        }

        return null; // No validation errors
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = SystemObjectsHandler;
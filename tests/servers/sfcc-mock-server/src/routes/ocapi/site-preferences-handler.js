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
        
        try {
            // Validate input parameters
            const validationError = this.validateSearchRequest(searchRequest, groupId, instanceType);
            if (validationError) {
                return res.status(validationError.status).json(validationError.body);
            }
            
            // Try to load specific site preferences
            let mockData = this.dataLoader.loadOcapiData(`site-preferences-${groupId.toLowerCase()}.json`);
            
            // Check if group exists (simulate 404 for unknown groups that aren't in our known list)
            const knownGroups = ['ccv', 'fastforward', 'system', 'storefront', 'sfra', 'integration'];
            if (!mockData && !knownGroups.includes(groupId.toLowerCase())) {
                return res.status(404).json({
                    "_v": "23.2",
                    "fault": {
                        "arguments": {"preferenceGroupId": groupId},
                        "type": "CustomPreferenceGroupNotFoundException",
                        "message": `No preference group with ID '${groupId}' could be found.`
                    }
                });
            }
            
            if (!mockData) {
                // Create fallback data with proper SFCC format (matching real API)
                mockData = {
                    "_v": "23.2",
                    "_type": "preference_value_search_result",
                    "count": 0,
                    "hits": [],
                    "query": searchRequest.query || {"match_all_query": {"_type": "match_all_query"}},
                    "select": searchRequest.select || "(**)",
                    "start": 0,
                    "total": 0
                };
            }

            // Apply search and pagination
            let results = mockData.hits || [];
            
            // Apply search filtering
            results = this.applySearchFiltering(results, searchRequest.query);
            
            // Apply pagination
            const start = searchRequest.start || 0;
            const count = searchRequest.count || 200;
            const paginatedResults = results.slice(start, start + count);

            // Build response with proper SFCC format
            const response = {
                "_v": mockData._v || "23.2",
                "_type": "preference_value_search_result",
                "count": paginatedResults.length,
                "hits": paginatedResults,
                "query": this.enhanceQueryWithTypes(searchRequest.query || {"match_all_query": {"_type": "match_all_query"}}),
                "select": searchRequest.select || "(**)",
                "start": start,
                "total": results.length
            };

            res.json(response);
        } catch (error) {
            // Handle unexpected errors
            res.status(500).json({
                "_v": "23.2",
                "fault": {
                    "type": "InternalServerError",
                    "message": "An internal server error occurred while processing your request."
                }
            });
        }
    }

    /**
     * Validate search request parameters
     */
    validateSearchRequest(searchRequest, groupId, instanceType) {
        // Validate pagination parameters
        if (searchRequest.start && searchRequest.start < 0) {
            return {
                status: 400,
                body: {
                    "_v": "23.2",
                    "fault": {
                        "arguments": {"path": "$.start", "document": "search_request"},
                        "type": "PropertyConstraintViolationException",
                        "message": "An error occurred while decoding the request. There's a value constraint violation of property '$.start' in document 'search_request'."
                    }
                }
            };
        }

        if (searchRequest.count && (searchRequest.count < 0 || searchRequest.count > 200)) {
            return {
                status: 400,
                body: {
                    "_v": "23.2",
                    "fault": {
                        "arguments": {"path": "$.count", "document": "search_request"},
                        "type": "PropertyConstraintViolationException",
                        "message": "An error occurred while decoding the request. There's a value constraint violation of property '$.count' in document 'search_request'."
                    }
                }
            };
        }

        // Validate query structure
        if (searchRequest.query && !this.isValidQueryStructure(searchRequest.query)) {
            return {
                status: 400,
                body: {
                    "_v": "23.2",
                    "fault": {
                        "type": "InvalidQueryException",
                        "message": "Search query must contain at least one of: text_query, term_query, filtered_query, bool_query, match_all_query"
                    }
                }
            };
        }

        // Validate text query parameters
        if (searchRequest.query?.text_query) {
            const textQuery = searchRequest.query.text_query;
            if (!textQuery.search_phrase || textQuery.search_phrase.trim() === '') {
                return {
                    status: 400,
                    body: {
                        "_v": "23.2",
                        "fault": {
                            "type": "ValidationException",
                            "message": "text_query.search_phrase must be a non-empty string"
                        }
                    }
                };
            }
        }

        return null; // No validation errors
    }

    /**
     * Check if query structure is valid
     */
    isValidQueryStructure(query) {
        const validQueryTypes = ['text_query', 'term_query', 'filtered_query', 'bool_query', 'match_all_query'];
        return validQueryTypes.some(type => query.hasOwnProperty(type));
    }

    /**
     * Apply search filtering based on query
     */
    applySearchFiltering(results, query) {
        if (!query) return results;

        if (query.text_query) {
            return this.applyTextQuery(results, query.text_query);
        }

        if (query.bool_query) {
            return this.applyBoolQuery(results, query.bool_query);
        }

        if (query.term_query) {
            return this.applyTermQuery(results, query.term_query);
        }

        if (query.match_all_query) {
            return results; // Match all returns everything
        }

        return results;
    }

    /**
     * Apply text query filtering
     */
    applyTextQuery(results, textQuery) {
        const searchPhrase = textQuery.search_phrase?.toLowerCase();
        const searchFields = textQuery.fields || ['id', 'display_name'];
        
        if (!searchPhrase) return results;
        
        return results.filter(item => {
            return searchFields.some(field => {
                const fieldValue = field === 'display_name' 
                    ? item.display_name?.default || item.attribute_definition?.display_name?.default
                    : item[field];
                return fieldValue?.toLowerCase().includes(searchPhrase);
            });
        });
    }

    /**
     * Apply boolean query filtering (simplified implementation)
     */
    applyBoolQuery(results, boolQuery) {
        let filteredResults = results;

        // Apply must conditions (AND)
        if (boolQuery.must && boolQuery.must.length > 0) {
            for (const condition of boolQuery.must) {
                filteredResults = this.applySearchFiltering(filteredResults, condition);
            }
        }

        // Apply must_not conditions (exclude)
        if (boolQuery.must_not && boolQuery.must_not.length > 0) {
            for (const condition of boolQuery.must_not) {
                const excludeResults = this.applySearchFiltering(results, condition);
                const excludeIds = new Set(excludeResults.map(item => item.id));
                filteredResults = filteredResults.filter(item => !excludeIds.has(item.id));
            }
        }

        // Apply should conditions (OR) - for now, just return if any match
        if (boolQuery.should && boolQuery.should.length > 0) {
            const shouldResults = [];
            for (const condition of boolQuery.should) {
                const conditionResults = this.applySearchFiltering(results, condition);
                shouldResults.push(...conditionResults);
            }
            // Remove duplicates and combine with must results
            const shouldIds = new Set(shouldResults.map(item => item.id));
            if (boolQuery.must && boolQuery.must.length > 0) {
                // Intersect with must results
                filteredResults = filteredResults.filter(item => shouldIds.has(item.id));
            } else {
                // Use should results if no must conditions
                filteredResults = shouldResults.filter((item, index, self) => 
                    self.findIndex(i => i.id === item.id) === index
                );
            }
        }

        return filteredResults;
    }

    /**
     * Apply term query filtering
     */
    applyTermQuery(results, termQuery) {
        const { fields, operator, values } = termQuery;
        
        return results.filter(item => {
            return fields.some(field => {
                const fieldValue = item[field] || item.attribute_definition?.[field];
                
                switch (operator) {
                    case 'is':
                        return values.includes(fieldValue);
                    case 'one_of':
                        return values.some(value => fieldValue === value);
                    case 'contains':
                        return values.some(value => fieldValue?.includes(value));
                    default:
                        return false;
                }
            });
        });
    }

    /**
     * Enhance query object with proper _type fields for response
     */
    enhanceQueryWithTypes(query) {
        const enhanced = { ...query };
        
        if (enhanced.text_query) {
            enhanced.text_query._type = 'text_query';
        }
        if (enhanced.bool_query) {
            enhanced.bool_query._type = 'bool_query';
            if (enhanced.bool_query.must) {
                enhanced.bool_query.must = enhanced.bool_query.must.map(q => this.enhanceQueryWithTypes(q));
            }
            if (enhanced.bool_query.must_not) {
                enhanced.bool_query.must_not = enhanced.bool_query.must_not.map(q => this.enhanceQueryWithTypes(q));
            }
            if (enhanced.bool_query.should) {
                enhanced.bool_query.should = enhanced.bool_query.should.map(q => this.enhanceQueryWithTypes(q));
            }
        }
        if (enhanced.term_query) {
            enhanced.term_query._type = 'term_query';
        }
        if (enhanced.match_all_query) {
            enhanced.match_all_query._type = 'match_all_query';
        }
        
        return enhanced;
    }

    /**
     * Get the configured router
     */
    getRouter() {
        return this.router;
    }
}

module.exports = SitePreferencesHandler;
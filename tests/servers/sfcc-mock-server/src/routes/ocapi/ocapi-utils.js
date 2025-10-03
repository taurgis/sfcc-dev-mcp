/**
 * OCAPI Utilities
 * 
 * Shared utility functions for OCAPI handlers including select parameter parsing,
 * pagination helpers, and object enhancement functions.
 */

class OCAPIUtils {
    /**
     * Apply select parameter to the root response structure based on SFCC select syntax
     * Examples:
     * - (**) = return full response 
     * - (start, total) = return only start and total fields
     * - (data.(**)) = return only data array with all object properties
     * - (data.(object_type)) = return only data array with specific fields
     * - (start, data.(**)) = return start field plus data array with all properties
     */
    static applyRootSelectParameter(response, select) {
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
    static parseSelectParts(selectString) {
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
    static applySelectParameter(obj, select) {
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
    static selectSpecificFields(obj, fields) {
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
     * Enhance basic object definition with detailed fields to match real SFCC API response
     */
    static enhanceObjectWithDetailedFields(obj) {
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
     * Generate pagination URLs for API responses
     */
    static generatePaginationUrls(req, start, count, total, select) {
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
        let nextUrl = null;
        let previousUrl = null;
        
        // Generate next URL if there are more items
        const hasMore = (start + count) < total;
        if (hasMore) {
            const nextStart = start + count;
            nextUrl = `${baseUrl}?start=${nextStart}&count=${count}`;
            if (select !== '(**)') {
                nextUrl += `&select=${encodeURIComponent(select)}`;
            }
        }
        
        // Generate previous URL if not at the beginning
        if (start > 0) {
            const prevStart = Math.max(0, start - count);
            previousUrl = `${baseUrl}?start=${prevStart}&count=${count}`;
            if (select !== '(**)') {
                previousUrl += `&select=${encodeURIComponent(select)}`;
            }
        }

        return { nextUrl, previousUrl };
    }

    /**
     * Apply basic text search filtering to results
     */
    static applyTextSearch(results, query) {
        if (!query || !query.text_query) {
            return results;
        }

        const searchTerm = query.text_query.search_phrase.toLowerCase();
        const searchFields = query.text_query.fields || ["id"];
        
        return results.filter(item => {
            return searchFields.some(field => {
                if (field === "id" && item.id) {
                    return item.id.toLowerCase().includes(searchTerm);
                }
                if (field === "display_name" && item.display_name) {
                    // Check if any display_name value contains the search term
                    const displayNames = Object.values(item.display_name || {});
                    return displayNames.some(name => 
                        String(name).toLowerCase().includes(searchTerm)
                    );
                }
                if (field === "description" && item.description) {
                    return String(item.description).toLowerCase().includes(searchTerm);
                }
                if (field === "object_type" && item.object_type) {
                    return item.object_type.toLowerCase().includes(searchTerm);
                }
                return false;
            });
        });
    }

    /**
     * Build proper query response with SFCC-compliant _type fields
     */
    static buildQueryResponse(originalQuery) {
        let queryResponse = originalQuery || {"match_all_query": {}};
        
        if (queryResponse.match_all_query && !queryResponse.match_all_query._type) {
            queryResponse = {
                ...queryResponse,
                match_all_query: {
                    ...queryResponse.match_all_query,
                    "_type": "match_all_query"
                }
            };
        }
        
        if (queryResponse.text_query && !queryResponse.text_query._type) {
            queryResponse = {
                ...queryResponse,
                text_query: {
                    ...queryResponse.text_query,
                    "_type": "text_query"
                }
            };
        }

        return queryResponse;
    }

    // Object type metadata helpers
    
    /**
     * Get display name for object type (with internationalization)
     */
    static getObjectTypeDisplayName(objectType) {
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
    static getObjectTypeDescription(objectType) {
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
     * Get read_only flag for object type
     */
    static getObjectTypeReadOnly(objectType) {
        const readOnlyTypes = ['CustomerActiveData', 'CustomerCDPData'];
        return readOnlyTypes.includes(objectType);
    }

    /**
     * Get queryable flag for object type
     */
    static getObjectTypeQueryable(objectType) {
        const nonQueryableTypes = ['CustomObject'];
        return !nonQueryableTypes.includes(objectType);
    }

    /**
     * Get content_object flag for object type
     */
    static getObjectTypeContentObject(objectType) {
        const contentObjectTypes = ['Content'];
        return contentObjectTypes.includes(objectType);
    }

    /**
     * Get attribute definition count for object type (matching real API data)
     */
    static getObjectTypeAttributeCount(objectType) {
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
    static getObjectTypeAttributeGroupCount(objectType) {
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
}

module.exports = OCAPIUtils;
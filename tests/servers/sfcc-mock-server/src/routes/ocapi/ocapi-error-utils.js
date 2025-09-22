/**
 * OCAPI Error Utilities
 * 
 * Utilities for generating SFCC-compliant error responses that match
 * the real OCAPI Data API error format and behavior.
 */

class OCAPIErrorUtils {
    /**
     * Create a standard SFCC fault response
     */
    static createFaultResponse(type, message, args = {}, statusCode = 400, version = "23.2") {
        return {
            response: {
                "_v": version,
                "fault": {
                    "arguments": args,
                    "type": type,
                    "message": message
                }
            },
            statusCode: statusCode
        };
    }

    /**
     * Create ObjectTypeNotFoundException (404)
     */
    static createObjectTypeNotFound(objectType) {
        return this.createFaultResponse(
            "ObjectTypeNotFoundException",
            `No object type with ID '${objectType}' could be found.`,
            { objectType },
            404
        );
    }

    /**
     * Create PropertyConstraintViolationException (400)
     */
    static createPropertyConstraintViolation(path, document = "search_request") {
        return this.createFaultResponse(
            "PropertyConstraintViolationException",
            `An error occurred while decoding the request. There's a value constraint violation of property '${path}' in document '${document}'.`,
            { path, document },
            400
        );
    }

    /**
     * Create InvalidRequestException (400)
     */
    static createInvalidRequest(message, field = null) {
        const args = field ? { field } : {};
        return this.createFaultResponse(
            "InvalidRequestException",
            message,
            args,
            400
        );
    }

    /**
     * Create AuthenticationFailedException (401)
     */
    static createAuthenticationFailed() {
        return this.createFaultResponse(
            "AuthenticationFailedException",
            "Authentication failed. Please check your credentials.",
            {},
            401
        );
    }

    /**
     * Create InsufficientPermissionsException (403)
     */
    static createInsufficientPermissions(permission = "access") {
        return this.createFaultResponse(
            "InsufficientPermissionsException",
            `You are not allowed to ${permission} the requested resource.`,
            { permission },
            403
        );
    }

    /**
     * Create InternalServerException (500)
     */
    static createInternalServerError(details = "An unexpected error occurred.") {
        return this.createFaultResponse(
            "InternalServerException",
            details,
            {},
            500
        );
    }

    /**
     * Validate object type against known system objects
     */
    static validateObjectType(objectType) {
        const validObjectTypes = [
            'Product', 'Customer', 'Order', 'Category', 'Site', 'SitePreferences',
            'CustomerGroup', 'CustomerAddress', 'Profile', 'Basket', 'OrderPaymentInstrument',
            'ProductOption', 'ProductVariationAttribute', 'PriceBook', 'Campaign',
            'Promotion', 'Content', 'ContentSlot', 'Folder', 'Library'
        ];

        if (!validObjectTypes.includes(objectType)) {
            return this.createObjectTypeNotFound(objectType);
        }
        return null;
    }

    /**
     * Validate search request structure
     */
    static validateSearchRequest(searchRequest) {
        // Check if searchRequest exists
        if (!searchRequest || typeof searchRequest !== 'object') {
            return this.createPropertyConstraintViolation("$", "search_request");
        }

        // Check if query exists
        if (!searchRequest.query) {
            return this.createPropertyConstraintViolation("$.query", "search_request");
        }

        // Validate query type
        const validQueryTypes = ['text_query', 'term_query', 'filtered_query', 'bool_query', 'match_all_query'];
        const hasValidQuery = validQueryTypes.some(type => searchRequest.query[type]);
        
        if (!hasValidQuery) {
            return this.createInvalidRequest(
                "Search query must contain at least one of: text_query, term_query, filtered_query, bool_query, match_all_query"
            );
        }

        return null;
    }

    /**
     * Validate pagination parameters
     */
    static validatePagination(start, count) {
        // Validate start parameter
        if (start !== undefined && start !== null) {
            if (typeof start !== 'number' || start < 0) {
                return this.createInvalidRequest("start must be a positive number");
            }
        }

        // Validate count parameter
        if (count !== undefined && count !== null) {
            if (typeof count !== 'number' || count < 0) {
                return this.createPropertyConstraintViolation("$.count", "search_request");
            }
            if (count > 200) {
                return this.createPropertyConstraintViolation("$.count", "search_request");
            }
        }

        return null;
    }

    /**
     * Validate text_query structure
     */
    static validateTextQuery(textQuery) {
        if (!textQuery.fields || !Array.isArray(textQuery.fields) || textQuery.fields.length === 0) {
            return this.createPropertyConstraintViolation("$.query.text_query.fields", "search_request");
        }
        
        if (!textQuery.search_phrase || typeof textQuery.search_phrase !== 'string') {
            return this.createPropertyConstraintViolation("$.query.text_query.search_phrase", "search_request");
        }

        return null;
    }

    /**
     * Validate term_query structure  
     */
    static validateTermQuery(termQuery) {
        if (!termQuery.fields || !Array.isArray(termQuery.fields) || termQuery.fields.length === 0) {
            return this.createPropertyConstraintViolation("$.query.term_query.fields", "search_request");
        }
        
        if (!termQuery.operator || typeof termQuery.operator !== 'string') {
            return this.createPropertyConstraintViolation("$.query.term_query.operator", "search_request");
        }

        if (!termQuery.values || !Array.isArray(termQuery.values)) {
            return this.createPropertyConstraintViolation("$.query.term_query.values", "search_request");
        }

        return null;
    }

    /**
     * Send error response
     */
    static sendErrorResponse(res, errorInfo) {
        res.status(errorInfo.statusCode).json(errorInfo.response);
    }
}

module.exports = OCAPIErrorUtils;
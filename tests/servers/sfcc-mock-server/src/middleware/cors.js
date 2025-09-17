/**
 * CORS Middleware
 * 
 * Handles Cross-Origin Resource Sharing configuration for the unified server.
 * Provides permissive CORS settings suitable for testing environments.
 */

const cors = require('cors');

/**
 * Create CORS middleware with appropriate settings for testing
 */
function createCorsMiddleware() {
    return cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'PROPFIND'],
        allowedHeaders: [
            'Content-Type', 
            'Authorization', 
            'Depth', 
            'Range',
            'X-Requested-With',
            'Cache-Control'
        ],
        exposedHeaders: [
            'Content-Range', 
            'Accept-Ranges',
            'Content-Length',
            'Last-Modified'
        ],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 200
    });
}

module.exports = {
    createCorsMiddleware
};
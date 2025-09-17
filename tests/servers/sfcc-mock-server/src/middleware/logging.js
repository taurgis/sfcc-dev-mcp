/**
 * Logging Middleware
 * 
 * Provides request/response logging functionality for debugging and monitoring.
 * Configurable logging levels and output formatting.
 */

/**
 * Create request logging middleware
 */
function createRequestLogger(isDevMode = false) {
    if (!isDevMode) {
        // Return no-op middleware in production mode
        return (req, res, next) => next();
    }

    return (req, res, next) => {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        const userAgent = req.headers['user-agent'] || 'Unknown';
        
        console.log(`📥 [${timestamp}] ${method} ${url}`, {
            headers: {
                authorization: req.headers.authorization ? '[REDACTED]' : undefined,
                'content-type': req.headers['content-type'],
                'depth': req.headers.depth,
                'range': req.headers.range,
                'user-agent': userAgent
            },
            query: Object.keys(req.query).length > 0 ? req.query : undefined,
            body: req.body && Object.keys(req.body).length > 0 ? req.body : undefined
        });
        
        next();
    };
}

/**
 * Create response logging middleware
 */
function createResponseLogger(isDevMode = false) {
    if (!isDevMode) {
        // Return no-op middleware in production mode
        return (req, res, next) => next();
    }

    return (req, res, next) => {
        const originalSend = res.send;
        const originalJson = res.json;
        
        // Override res.send
        res.send = function(body) {
            logResponse(req, res, body, 'send');
            return originalSend.call(this, body);
        };
        
        // Override res.json
        res.json = function(obj) {
            logResponse(req, res, obj, 'json');
            return originalJson.call(this, obj);
        };
        
        next();
    };
}

/**
 * Log response details
 */
function logResponse(req, res, body, type) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const statusCode = res.statusCode;
    
    let bodyPreview = body;
    
    // Truncate large responses for readability
    if (typeof body === 'string' && body.length > 500) {
        bodyPreview = body.substring(0, 500) + '... [truncated]';
    } else if (typeof body === 'object' && body !== null) {
        const bodyStr = JSON.stringify(body);
        if (bodyStr.length > 500) {
            bodyPreview = JSON.stringify(body, null, 2).substring(0, 500) + '... [truncated]';
        }
    }
    
    console.log(`📤 [${timestamp}] ${method} ${url} -> ${statusCode}`, {
        headers: {
            'content-type': res.getHeader('content-type'),
            'content-length': res.getHeader('content-length'),
            'content-range': res.getHeader('content-range')
        },
        type,
        body: bodyPreview
    });
}

/**
 * Create error logging middleware
 */
function createErrorLogger() {
    return (err, req, res, next) => {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        
        console.error(`❌ [${timestamp}] ERROR ${method} ${url}:`, {
            message: err.message,
            stack: err.stack,
            code: err.code
        });
        
        // Don't handle the error, just log it
        next(err);
    };
}

module.exports = {
    createRequestLogger,
    createResponseLogger,
    createErrorLogger
};
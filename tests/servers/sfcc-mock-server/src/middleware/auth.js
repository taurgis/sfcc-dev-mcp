/**
 * Authentication Middleware
 * 
 * Handles OAuth token generation and validation for OCAPI endpoints.
 * Maintains simple in-memory token storage suitable for testing.
 */

class AuthenticationManager {
    constructor(config) {
        this.config = config;
        this.activeTokens = new Set();
        this.validCredentials = config.validCredentials;
    }

    /**
     * Handle OAuth2 token requests
     */
    handleOAuthToken(req, res) {
        const { grant_type } = req.body;
        
        // Validate grant type
        if (grant_type !== 'client_credentials' && 
            grant_type !== 'urn:demandware:params:oauth:grant-type:client-id:dwsid:dwsecuretoken') {
            return res.status(400).json({
                error: 'unsupported_grant_type',
                error_description: 'The authorization grant type is not supported'
            });
        }
        
        // Extract credentials from Basic Auth header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({
                error: 'invalid_client',
                error_description: 'Client authentication failed - missing Basic auth header'
            });
        }
        
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [client_id, client_secret] = credentials.split(':');
        
        // Validate credentials
        if (client_id !== this.validCredentials.clientId || 
            client_secret !== this.validCredentials.clientSecret) {
            return res.status(401).json({
                error: 'invalid_client',
                error_description: 'Client authentication failed'
            });
        }
        
        // Generate mock access token
        const accessToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.activeTokens.add(accessToken);
        
        res.json({
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 3600,
            scope: 'SFCC_DATA_API'
        });
    }

    /**
     * Middleware to require Bearer token authentication
     */
    requireAuth() {
        return (req, res, next) => {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    error: 'unauthorized',
                    message: 'Missing or invalid authorization header'
                });
            }
            
            const token = authHeader.substring(7);
            
            if (!this.activeTokens.has(token)) {
                return res.status(401).json({
                    error: 'invalid_token',
                    message: 'The access token is invalid or expired'
                });
            }
            
            req.accessToken = token;
            next();
        };
    }

    /**
     * Clear expired tokens (for cleanup)
     */
    clearExpiredTokens() {
        // For testing purposes, we'll keep tokens active
        // In a real implementation, you'd track token expiration
    }
}

module.exports = AuthenticationManager;
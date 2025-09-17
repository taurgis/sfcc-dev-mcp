const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

/**
 * Mock SFCC OCAPI Server for Testing
 * 
 * This server simulates SFCC Open Commerce API (OCAPI) functionality for testing
 * the SFCC Development MCP Server without requiring a real SFCC instance.
 * 
 * Supports:
 * - OAuth token endpoint (/dw/oauth2/access_token)
 * - System Object Definitions API (/s/-/dw/data/v23_2/system_object_definitions)
 * - System Object Search API 
 * - Site Preferences API
 * - Code Versions API
 * - Proper CORS headers for browser testing
 * - Authentication simulation with Bearer tokens
 */

class SFCCMockOCAPIServer {
    constructor(options = {}) {
        this.port = options.port || 4000;
        this.host = options.host || 'localhost';
        this.mockDataPath = options.mockDataPath || path.join(__dirname, 'mock-data');
        this.version = options.version || 'v23_2';
        this.isDevMode = options.dev || false;
        
        // Initialize Express app
        this.app = express();
        this.server = null;
        
        // Valid OAuth credentials for testing
        this.validCredentials = {
            clientId: 'test-client-id',
            clientSecret: 'test-client-secret',
            username: 'test-user',
            password: 'test-password'
        };
        
        // Active tokens storage (simple in-memory store for testing)
        this.activeTokens = new Set();
        
        this.setupMiddleware();
        this.setupRoutes();
    }
    
    setupMiddleware() {
        // CORS middleware
        this.app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }));
        
        // JSON parsing middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        
        // Request logging middleware (in dev mode)
        if (this.isDevMode) {
            this.app.use((req, res, next) => {
                console.log(`📥 ${req.method} ${req.path}`, {
                    headers: req.headers,
                    query: req.query,
                    body: req.body
                });
                next();
            });
        }
        
        // Response logging middleware (in dev mode)  
        if (this.isDevMode) {
            this.app.use((req, res, next) => {
                const originalSend = res.send;
                res.send = function(body) {
                    console.log(`📤 ${req.method} ${req.path} -> ${res.statusCode}`, {
                        body: typeof body === 'string' ? JSON.parse(body) : body
                    });
                    originalSend.call(this, body);
                };
                next();
            });
        }
    }
    
    setupRoutes() {
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'ok', 
                message: 'SFCC Mock OCAPI Server is running',
                version: this.version,
                timestamp: new Date().toISOString()
            });
        });
        
        // OAuth2 token endpoint
        this.app.post('/dw/oauth2/access_token', this.handleOAuthToken.bind(this));
        
        // OAuth2 token endpoint (alternative dwsso path for compatibility)
        this.app.post('/dwsso/oauth2/access_token', this.handleOAuthToken.bind(this));
        
        // System Object Definitions - List all
        this.app.get(`/s/-/dw/data/${this.version}/system_object_definitions`, 
            this.requireAuth.bind(this), 
            this.handleGetSystemObjectDefinitions.bind(this)
        );
        
        // System Object Definition - Get specific
        this.app.get(`/s/-/dw/data/${this.version}/system_object_definitions/:objectType`, 
            this.requireAuth.bind(this), 
            this.handleGetSystemObjectDefinition.bind(this)
        );
        
        // System Object Definition Search
        this.app.post(`/s/-/dw/data/${this.version}/system_object_definition_search`, 
            this.requireAuth.bind(this), 
            this.handleSearchSystemObjectDefinitions.bind(this)
        );
        
        // System Object Attribute Definition Search
        this.app.post(`/s/-/dw/data/${this.version}/system_object_definitions/:objectType/attribute_definition_search`, 
            this.requireAuth.bind(this), 
            this.handleSearchSystemObjectAttributeDefinitions.bind(this)
        );
        
        // System Object Attribute Group Search
        this.app.post(`/s/-/dw/data/${this.version}/system_object_definitions/:objectType/attribute_group_search`, 
            this.requireAuth.bind(this), 
            this.handleSearchSystemObjectAttributeGroups.bind(this)
        );
        
        // Custom Object Attribute Definition Search  
        this.app.post(`/s/-/dw/data/${this.version}/custom_object_definitions/:objectType/attribute_definition_search`, 
            this.requireAuth.bind(this), 
            this.handleSearchCustomObjectAttributeDefinitions.bind(this)
        );
        
        // Site Preferences Search
        this.app.post(`/s/-/dw/data/${this.version}/site_preferences/:groupId/search`, 
            this.requireAuth.bind(this), 
            this.handleSearchSitePreferences.bind(this)
        );
        
        // Code Versions API
        this.app.get(`/s/-/dw/data/${this.version}/code_versions`, 
            this.requireAuth.bind(this), 
            this.handleGetCodeVersions.bind(this)
        );
        
        this.app.post(`/s/-/dw/data/${this.version}/code_versions/:versionId/activate`, 
            this.requireAuth.bind(this), 
            this.handleActivateCodeVersion.bind(this)
        );
        
        // Error handler
        this.app.use(this.errorHandler.bind(this));
    }
    
    // OAuth2 token handling
    async handleOAuthToken(req, res) {
        const { grant_type } = req.body;
        
        if (grant_type !== 'client_credentials' && grant_type !== 'urn:demandware:params:oauth:grant-type:client-id:dwsid:dwsecuretoken') {
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
    
    // Authentication middleware
    requireAuth(req, res, next) {
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
    }
    
    // Load mock data with fallback
    loadMockData(filename) {
        try {
            const filePath = path.join(this.mockDataPath, filename);
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        } catch (error) {
            console.warn(`Warning: Could not load mock data from ${filename}:`, error.message);
        }
        return null;
    }
    
    // System Object Definitions handlers
    async handleGetSystemObjectDefinitions(req, res) {
        const { start = 0, count = 200, select = '(**)' } = req.query;
        
        let mockData = this.loadMockData('system-object-definitions.json');
        
        if (!mockData) {
            // Fallback mock data
            mockData = {
                count: 25,
                hits: [
                    {
                        _type: 'object_type_definition',
                        object_type: 'Product',
                        display_name: {
                            default: 'Product'
                        },
                        description: {
                            default: 'SFCC Product object'
                        },
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
                        display_name: {
                            default: 'Customer'
                        },
                        description: {
                            default: 'SFCC Customer object'
                        },
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
                        display_name: {
                            default: 'Order'
                        },
                        description: {
                            default: 'SFCC Order object'
                        },
                        attribute_definition_count: 28,
                        attribute_group_count: 5,
                        key_attribute_id: 'order_no',
                        content_object: false,
                        queryable: true,
                        read_only: false,
                        creation_date: '2021-01-01T00:00:00.000Z',
                        last_modified: '2024-01-01T00:00:00.000Z'
                    },
                    {
                        _type: 'object_type_definition',
                        object_type: 'Category',
                        display_name: {
                            default: 'Category'
                        },
                        description: {
                            default: 'SFCC Category object'
                        },
                        attribute_definition_count: 20,
                        attribute_group_count: 4,
                        key_attribute_id: 'id',
                        content_object: false,
                        queryable: true,
                        read_only: false,
                        creation_date: '2021-01-01T00:00:00.000Z',
                        last_modified: '2024-01-01T00:00:00.000Z'
                    },
                    {
                        _type: 'object_type_definition',
                        object_type: 'Site',
                        display_name: {
                            default: 'Site'
                        },
                        description: {
                            default: 'SFCC Site object'
                        },
                        attribute_definition_count: 15,
                        attribute_group_count: 3,
                        key_attribute_id: 'id',
                        content_object: false,
                        queryable: true,
                        read_only: false,
                        creation_date: '2021-01-01T00:00:00.000Z',
                        last_modified: '2024-01-01T00:00:00.000Z'
                    }
                ],
                next: null,
                previous: null,
                start: parseInt(start),
                total: 25
            };
        }
        
        // Apply pagination
        const startIndex = parseInt(start);
        const maxCount = parseInt(count);
        const paginatedHits = mockData.hits.slice(startIndex, startIndex + maxCount);
        
        res.json({
            ...mockData,
            hits: paginatedHits,
            start: startIndex,
            count: paginatedHits.length
        });
    }
    
    async handleGetSystemObjectDefinition(req, res) {
        const { objectType } = req.params;
        
        const mockData = this.loadMockData(`system-object-definition-${objectType.toLowerCase()}.json`);
        
        if (mockData) {
            return res.json(mockData);
        }
        
        // Fallback mock data for common object types
        const fallbackData = {
            Product: {
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
            Customer: {
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
            }
        };
        
        if (fallbackData[objectType]) {
            return res.json(fallbackData[objectType]);
        }
        
        res.status(404).json({
            error: 'not_found',
            message: `System object type '${objectType}' not found`
        });
    }
    
    async handleSearchSystemObjectDefinitions(req, res) {
        const searchRequest = req.body;
        
        // Basic mock search response
        res.json({
            count: 3,
            hits: [
                {
                    _type: 'object_type_definition',
                    object_type: 'Product',
                    display_name: { default: 'Product' },
                    description: { default: 'SFCC Product object' }
                },
                {
                    _type: 'object_type_definition', 
                    object_type: 'ProductVariant',
                    display_name: { default: 'Product Variant' },
                    description: { default: 'SFCC Product Variant object' }
                }
            ],
            next: null,
            previous: null,
            start: 0,
            total: 3
        });
    }
    
    async handleSearchSystemObjectAttributeDefinitions(req, res) {
        const { objectType } = req.params;
        const searchRequest = req.body;
        
        // Mock attribute definitions response
        res.json({
            count: 5,
            hits: [
                {
                    _type: 'attribute_definition',
                    id: 'id',
                    display_name: { default: 'ID' },
                    description: { default: 'Product ID' },
                    key: true,
                    localizable: false,
                    mandatory: true,
                    max_value: null,
                    min_value: null,
                    multi_value_type: 'none',
                    searchable: true,
                    site_specific: false,
                    system: true,
                    value_type: 'string'
                },
                {
                    _type: 'attribute_definition',
                    id: 'name',
                    display_name: { default: 'Name' },
                    description: { default: 'Product Name' },
                    key: false,
                    localizable: true,
                    mandatory: false,
                    max_value: null,
                    min_value: null,
                    multi_value_type: 'none',
                    searchable: true,
                    site_specific: false,
                    system: true,
                    value_type: 'string'
                }
            ],
            next: null,
            previous: null,
            start: 0,
            total: 5
        });
    }
    
    async handleSearchSystemObjectAttributeGroups(req, res) {
        const { objectType } = req.params;
        
        res.json({
            count: 3,
            hits: [
                {
                    _type: 'attribute_group',
                    id: 'general',
                    display_name: { default: 'General' },
                    description: { default: 'General attributes' },
                    position: 1.0,
                    internal: false
                },
                {
                    _type: 'attribute_group',
                    id: 'pricing',
                    display_name: { default: 'Pricing' },
                    description: { default: 'Pricing attributes' },
                    position: 2.0,
                    internal: false
                }
            ],
            start: 0,
            total: 3
        });
    }
    
    async handleSearchCustomObjectAttributeDefinitions(req, res) {
        const { objectType } = req.params;
        
        res.json({
            count: 2,
            hits: [
                {
                    _type: 'attribute_definition',
                    id: 'custom_field_1',
                    display_name: { default: 'Custom Field 1' },
                    description: { default: 'Custom attribute for ' + objectType },
                    key: false,
                    localizable: false,
                    mandatory: false,
                    value_type: 'string'
                }
            ],
            start: 0,
            total: 2
        });
    }
    
    async handleSearchSitePreferences(req, res) {
        const { groupId } = req.params;
        
        res.json({
            count: 2,
            hits: [
                {
                    _type: 'site_preference',
                    id: 'enable_feature_x',
                    display_name: { default: 'Enable Feature X' },
                    description: { default: 'Enable or disable feature X' },
                    value_type: 'boolean',
                    default_value: false,
                    group_id: groupId
                }
            ],
            start: 0,
            total: 2
        });
    }
    
    async handleGetCodeVersions(req, res) {
        res.json({
            count: 3,
            data: [
                {
                    id: 'version_1',
                    version_name: 'Current Release',
                    active: true,
                    activation_time: '2024-01-01T00:00:00.000Z',
                    last_modification_time: '2024-01-01T00:00:00.000Z'
                },
                {
                    id: 'version_2', 
                    version_name: 'Previous Release',
                    active: false,
                    activation_time: '2023-12-01T00:00:00.000Z',
                    last_modification_time: '2023-12-01T00:00:00.000Z'
                }
            ],
            start: 0,
            total: 3
        });
    }
    
    async handleActivateCodeVersion(req, res) {
        const { versionId } = req.params;
        
        res.json({
            id: versionId,
            version_name: 'Activated Version',
            active: true,
            activation_time: new Date().toISOString(),
            last_modification_time: new Date().toISOString()
        });
    }
    
    // Error handler
    errorHandler(err, req, res, next) {
        console.error('❌ OCAPI Server Error:', err);
        
        res.status(err.status || 500).json({
            error: 'internal_server_error',
            message: err.message || 'An unexpected error occurred',
            ...(this.isDevMode && { stack: err.stack })
        });
    }
    
    async start() {
        try {
            return new Promise((resolve, reject) => {
                this.server = this.app.listen(this.port, this.host, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    
                    console.log(`🚀 Mock SFCC OCAPI Server started on http://${this.host}:${this.port}`);
                    console.log(`📊 Data API Base URL: http://${this.host}:${this.port}/s/-/dw/data/${this.version}`);
                    console.log(`🔐 OAuth2 Token URL: http://${this.host}:${this.port}/dw/oauth2/access_token`);
                    console.log('📋 Available endpoints:');
                    console.log(`   - GET  /s/-/dw/data/${this.version}/system_object_definitions`);
                    console.log(`   - GET  /s/-/dw/data/${this.version}/system_object_definitions/:objectType`);
                    console.log(`   - POST /s/-/dw/data/${this.version}/system_object_definition_search`);
                    console.log(`   - POST /s/-/dw/data/${this.version}/system_object_definitions/:objectType/attribute_definition_search`);
                    console.log(`   - POST /s/-/dw/data/${this.version}/system_object_definitions/:objectType/attribute_group_search`);
                    console.log(`   - POST /s/-/dw/data/${this.version}/custom_object_definitions/:objectType/attribute_definition_search`);
                    console.log(`   - POST /s/-/dw/data/${this.version}/site_preferences/:groupId/search`);
                    console.log(`   - GET  /s/-/dw/data/${this.version}/code_versions`);
                    console.log(`   - POST /s/-/dw/data/${this.version}/code_versions/:versionId/activate`);
                    console.log(`   - POST /dw/oauth2/access_token`);
                    console.log(`   - GET  /health`);
                    
                    if (this.isDevMode) {
                        console.log('🔧 Development mode: Request/response logging enabled');
                    }
                    
                    console.log('🔑 Test Credentials:');
                    console.log(`   Client ID: ${this.validCredentials.clientId}`);
                    console.log(`   Client Secret: ${this.validCredentials.clientSecret}`);
                    
                    resolve(this.server);
                });
            });
        } catch (error) {
            console.error('❌ Failed to start OCAPI server:', error);
            throw error;
        }
    }
    
    async stop() {
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(() => {
                    console.log('🛑 Mock SFCC OCAPI Server stopped');
                    resolve();
                });
            });
        }
    }
}

// CLI handling for direct execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        port: 4000,
        host: 'localhost',
        dev: args.includes('--dev') || args.includes('-d'),
        version: 'v23_2'
    };
    
    // Parse port
    const portIndex = args.findIndex(arg => arg === '--port' || arg === '-p');
    if (portIndex !== -1 && args[portIndex + 1]) {
        options.port = parseInt(args[portIndex + 1]);
    }
    
    // Parse host
    const hostIndex = args.findIndex(arg => arg === '--host' || arg === '-h');
    if (hostIndex !== -1 && args[hostIndex + 1]) {
        options.host = args[hostIndex + 1];
    }
    
    const server = new SFCCMockOCAPIServer(options);
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n📋 Shutting down gracefully...');
        await server.stop();
        process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
        console.log('\n📋 Shutting down gracefully...');
        await server.stop();
        process.exit(0);
    });
    
    // Start server
    server.start().catch(error => {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    });
}

module.exports = SFCCMockOCAPIServer;
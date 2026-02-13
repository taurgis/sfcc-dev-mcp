/**
 * Server Configuration Management
 * 
 * Handles server configuration with sensible defaults and environment overrides.
 * Follows single responsibility principle for configuration management.
 */

class ServerConfig {
    constructor(options = {}) {
        // Server basics
        this.port = options.port || process.env.PORT || 3000;
        this.host = options.host || process.env.HOST || 'localhost';
        this.isDevMode = options.dev || process.env.NODE_ENV === 'development' || false;
        
        // API versions
        this.ocapiVersion = options.ocapiVersion || 'v23_2';
        
        // Paths
        this.mockDataPath = options.mockDataPath || require('path').join(__dirname, '../../mock-data');
        this.webdavBasePath = '/on/demandware.servlet/webdav/Sites';
        
        // Authentication - Mock credentials for testing
        this.validCredentials = {
            clientId: 'test-client-id',
            clientSecret: 'test-client-secret',
            username: 'test-user',
            password: 'test-password'
        };
        
        // Features toggle
        this.features = {
            webdav: options.enableWebdav !== false, // enabled by default
            ocapi: options.enableOcapi !== false,   // enabled by default
            cors: options.enableCors !== false,     // enabled by default
            logging: options.enableLogging !== false, // enabled by default
            randomErrors: options.enableRandomErrors === true // disabled by default for reliable tests
        };
    }

    /**
     * Get WebDAV configuration
     */
    getWebdavConfig() {
        return {
            basePath: this.webdavBasePath,
            logsPath: require('path').join(this.mockDataPath, 'logs'),
            enabled: this.features.webdav
        };
    }

    /**
     * Get OCAPI configuration
     */
    getOcapiConfig() {
        return {
            version: this.ocapiVersion,
            basePath: `/s/-/dw/data/${this.ocapiVersion}`,
            mockDataPath: require('path').join(this.mockDataPath, 'ocapi'),
            enabled: this.features.ocapi
        };
    }

    /**
     * Get full server URL
     */
    getServerUrl() {
        return `http://${this.host}:${this.port}`;
    }

    /**
     * Get WebDAV logs URL
     */
    getWebdavLogsUrl() {
        return `${this.getServerUrl()}${this.webdavBasePath}/Logs/`;
    }

    /**
     * Get OCAPI base URL
     */
    getOcapiBaseUrl() {
        return `${this.getServerUrl()}/s/-/dw/data/${this.ocapiVersion}`;
    }

    /**
     * Validate configuration
     */
    validate() {
        const errors = [];
        
        if (!this.port || this.port < 1 || this.port > 65535) {
            errors.push('Invalid port number');
        }
        
        if (!this.host || typeof this.host !== 'string') {
            errors.push('Invalid host');
        }
        
        if (!this.features.webdav && !this.features.ocapi) {
            errors.push('At least one feature (WebDAV or OCAPI) must be enabled');
        }
        
        return errors;
    }

    /**
     * Get configuration summary for logging
     */
    getSummary() {
        return {
            server: `${this.host}:${this.port}`,
            mode: this.isDevMode ? 'development' : 'production',
            features: Object.entries(this.features)
                .filter(([_, enabled]) => enabled)
                .map(([feature, _]) => feature),
            endpoints: {
                ...(this.features.webdav && { webdav: this.getWebdavLogsUrl() }),
                ...(this.features.ocapi && { ocapi: this.getOcapiBaseUrl() }),
                health: `${this.getServerUrl()}/health`
            }
        };
    }
}

module.exports = ServerConfig;
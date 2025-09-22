#!/usr/bin/env node

/**
 * SFCC Mock Server
 * 
 * Unified mock server combining WebDAV and OCAPI functionality for SFCC development testing.
 * Provides a single endpoint for both log file access and OCAPI simulation.
 * 
 * Usage:
 *   node server.js [options]
 * 
 * Options:
 *   --port <number>        Server port (default: 3000)
 *   --host <string>        Server host (default: localhost)  
 *   --dev                  Enable development mode with verbose logging
 *   --no-webdav            Disable WebDAV functionality
 *   --no-ocapi             Disable OCAPI functionality
 *   --no-cors              Disable CORS headers
 *   --mock-data <path>     Custom path to mock data directory
 *   --help                 Show this help message
 */

const ServerConfig = require('./src/config/server-config');
const SFCCMockApp = require('./src/app');

class SFCCMockServer {
    constructor(options = {}) {
        this.config = new ServerConfig(options);
        this.app = new SFCCMockApp(this.config);
        this.server = null;
    }

    async start() {
        try {
            // Validate configuration
            const configErrors = this.config.validate();
            if (configErrors.length > 0) {
                throw new Error(`Configuration errors: ${configErrors.join(', ')}`);
            }

            const expressApp = this.app.getExpressApp();

            return new Promise((resolve, reject) => {
                this.server = expressApp.listen(this.config.port, this.config.host, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    this.printStartupMessage();
                    resolve(this.server);
                });

                this.server.on('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        console.error(`❌ Port ${this.config.port} is already in use`);
                        console.error('   Try using a different port with --port <number>');
                    } else {
                        console.error('❌ Server error:', err.message);
                    }
                    reject(err);
                });
            });
        } catch (error) {
            console.error('❌ Failed to start server:', error.message);
            throw error;
        }
    }

    async stop() {
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(() => {
                    console.log('🛑 SFCC Mock Server stopped');
                    resolve();
                });
            });
        }
    }

    printStartupMessage() {
        const summary = this.config.getSummary();
        
        console.log('🚀 SFCC Mock Server started successfully!');
        console.log('');
        console.log(`📊 Server Info:`);
        console.log(`   Host: ${summary.server}`);
        console.log(`   Mode: ${summary.mode}`);
        console.log(`   Features: ${summary.features.join(', ')}`);
        console.log('');
        console.log('📋 Available Endpoints:');
        
        Object.entries(summary.endpoints).forEach(([name, url]) => {
            if (typeof url === 'string') {
                console.log(`   ${name}: ${url}`);
            } else if (typeof url === 'object') {
                console.log(`   ${name}:`);
                Object.entries(url).forEach(([subName, subUrl]) => {
                    console.log(`     ${subName}: ${subUrl}`);
                });
            }
        });

        if (this.config.features.webdav) {
            console.log('');
            console.log('📁 WebDAV Endpoints:');
            console.log(`   Logs (SFCC path): ${this.config.getWebdavLogsUrl()}`);
            console.log(`   Logs (direct): ${this.config.getServerUrl()}/Logs/`);
            console.log(`   Job Logs: ${this.config.getServerUrl()}/Logs/jobs/`);
        }

        if (this.config.features.ocapi) {
            console.log('');
            console.log('🔐 OCAPI Endpoints:');
            console.log(`   OAuth: ${this.config.getServerUrl()}/dw/oauth2/access_token`);
            console.log(`   System Objects: ${this.config.getOcapiBaseUrl()}/system_object_definitions`);
            console.log(`   Code Versions: ${this.config.getOcapiBaseUrl()}/code_versions`);
            console.log('');
            console.log('🔑 Test Credentials:');
            console.log(`   Client ID: ${this.config.validCredentials.clientId}`);
            console.log(`   Client Secret: ${this.config.validCredentials.clientSecret}`);
        }

        if (this.config.isDevMode) {
            console.log('');
            console.log('🔧 Development mode enabled - verbose logging active');
        }
        
        console.log('');
        console.log('✅ Server is ready for connections');
    }

    getConfig() {
        return this.config;
    }

    getApp() {
        return this.app;
    }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {};

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        switch (arg) {
            case '--help':
                printHelp();
                process.exit(0);
                break;
            case '--dev':
                options.dev = true;
                break;
            case '--no-webdav':
                options.enableWebdav = false;
                break;
            case '--no-ocapi':
                options.enableOcapi = false;
                break;
            case '--no-cors':
                options.enableCors = false;
                break;
            case '--enable-random-errors':
                options.enableRandomErrors = true;
                break;
            case '--port':
                if (i + 1 < args.length) {
                    options.port = parseInt(args[i + 1]);
                    i++;
                } else {
                    console.error('❌ --port requires a value');
                    process.exit(1);
                }
                break;
            case '--host':
                if (i + 1 < args.length) {
                    options.host = args[i + 1];
                    i++;
                } else {
                    console.error('❌ --host requires a value');
                    process.exit(1);
                }
                break;
            case '--mock-data':
                if (i + 1 < args.length) {
                    options.mockDataPath = args[i + 1];
                    i++;
                } else {
                    console.error('❌ --mock-data requires a path');
                    process.exit(1);
                }
                break;
            default:
                if (arg.startsWith('--port=')) {
                    options.port = parseInt(arg.split('=')[1]);
                } else if (arg.startsWith('--host=')) {
                    options.host = arg.split('=')[1];
                } else if (arg.startsWith('--mock-data=')) {
                    options.mockDataPath = arg.split('=')[1];
                } else {
                    console.warn(`⚠️  Unknown argument: ${arg}`);
                }
        }
    }

    return options;
}

/**
 * Print help message
 */
function printHelp() {
    console.log('SFCC Mock Server - Unified WebDAV and OCAPI mock server');
    console.log('');
    console.log('Usage:');
    console.log('  node server.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --port <number>        Server port (default: 3000)');
    console.log('  --host <string>        Server host (default: localhost)');
    console.log('  --dev                  Enable development mode with verbose logging');
    console.log('  --no-webdav            Disable WebDAV functionality');
    console.log('  --no-ocapi             Disable OCAPI functionality');
    console.log('  --no-cors              Disable CORS headers');
    console.log('  --enable-random-errors Enable random 500 errors (1% chance) for error handling testing');
    console.log('  --mock-data <path>     Custom path to mock data directory');
    console.log('  --help                 Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  node server.js --dev                    # Start in development mode');
    console.log('  node server.js --port 4000              # Start on port 4000');
    console.log('  node server.js --no-webdav              # Only OCAPI endpoints');
    console.log('  node server.js --host 0.0.0.0 --port 3001  # Bind to all interfaces');
}

// CLI execution
if (require.main === module) {
    const options = parseArgs();
    const server = new SFCCMockServer(options);

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal) => {
        console.log(`\\n🔄 Received ${signal}, shutting down gracefully...`);
        try {
            await server.stop();
            process.exit(0);
        } catch (error) {
            console.error('❌ Error during shutdown:', error);
            process.exit(1);
        }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        console.error('❌ Uncaught Exception:', error);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });

    // Start the server
    server.start().catch((error) => {
        console.error('💥 Failed to start server:', error.message);
        process.exit(1);
    });
}

module.exports = SFCCMockServer;
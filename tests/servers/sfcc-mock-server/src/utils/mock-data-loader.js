/**
 * Mock Data Loader Utility
 * 
 * Handles loading and caching of mock data files with fallback strategies.
 * Provides consistent error handling and logging for data loading operations.
 */

const fs = require('fs');
const path = require('path');

class MockDataLoader {
    constructor(basePath) {
        this.basePath = basePath;
        this.cache = new Map();
    }

    /**
     * Load mock data with caching and fallback
     */
    loadData(filename, fallbackData = null) {
        // Check cache first
        if (this.cache.has(filename)) {
            return this.cache.get(filename);
        }

        try {
            const filePath = path.join(this.basePath, filename);
            
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                this.cache.set(filename, data);
                return data;
            }
        } catch (error) {
            console.warn(`Warning: Could not load mock data from ${filename}:`, error.message);
        }

        // Use fallback data if provided
        if (fallbackData !== null) {
            this.cache.set(filename, fallbackData);
            return fallbackData;
        }

        return null;
    }

    /**
     * Load mock data from OCAPI subdirectory
     */
    loadOcapiData(filename, fallbackData = null) {
        return this.loadData(path.join('ocapi', filename), fallbackData);
    }

    /**
     * Check if a file exists
     */
    fileExists(filename) {
        const filePath = path.join(this.basePath, filename);
        return fs.existsSync(filePath);
    }

    /**
     * Clear cache for a specific file or all files
     */
    clearCache(filename = null) {
        if (filename) {
            this.cache.delete(filename);
        } else {
            this.cache.clear();
        }
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

module.exports = MockDataLoader;
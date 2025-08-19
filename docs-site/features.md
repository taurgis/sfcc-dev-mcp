---
title: Features
layout: page
nav_order: 3
---

# ✨ Features

The SFCC Development MCP Server provides comprehensive tools and documentation access for Salesforce B2C Commerce Cloud development.

## 🚀 Cartridge Generation

**Generate Complete Cartridge Structure** - Create a complete SFCC cartridge directory structure with all necessary files and configurations using the `generate_cartridge_structure` tool. 

**Features:**
- Proper directory organization with controllers, models, templates, and client assets
- Complete package.json with all necessary dependencies
- Webpack configuration for asset bundling
- ESLint setup for code quality
- All standard cartridge subdirectories (controllers, models, templates, static assets)
- Support for both full project setup (new projects) and cartridge-only setup (adding to existing projects)
- Creates files directly in the specified target directory for precise control over cartridge placement

---

## 📚 SFCC Best Practices Guides

**Comprehensive Development Guidelines** - Access curated best practice guides covering all major SFCC development areas.

**Available Guides:**
- **Get Available Guides** - List all available SFCC best practice guides
- **Get Complete Guide** - Retrieve comprehensive guides with structured content  
- **Search Best Practices** - Search across all guides for specific terms and concepts
- **Get Hook Reference** - Access detailed hook reference tables for OCAPI and SCAPI hooks

**Coverage Areas:**
- Cartridge creation and architecture patterns
- ISML templates with security and performance guidelines
- Job framework development (task-oriented and chunk-oriented patterns)
- LocalServiceRegistry service integrations with OAuth flows and reusable patterns
- OCAPI hooks (legacy API extension patterns)
- SCAPI hooks (modern API hooks with transactional integrity)
- SFRA controllers and middleware chains
- SFRA models and JSON object layer design
- Custom SCAPI endpoints with three-pillar architecture
- Performance optimization and scalability best practices
- Security guidelines with OWASP compliance

---

## 🔍 SFCC Documentation Querying

**Complete API Documentation Access** - Search and explore all SFCC API classes and methods with intelligent discovery.

**Capabilities:**
- **Get Class Information** - Retrieve detailed information about any SFCC class including properties, methods, and descriptions
- **Search Classes** - Find SFCC classes by name with partial matching capabilities
- **Search Methods** - Find methods across all SFCC classes by method name
- **List All Classes** - Get a complete list of available SFCC classes for exploration
- **Get Raw Documentation** - Access the complete Markdown documentation for any class with examples and detailed descriptions

**Supported Namespaces:**
- `dw.campaign` - Campaign and promotion management
- `dw.catalog` - Product and catalog management  
- `dw.content` - Content management systems
- `dw.customer` - Customer profile and authentication
- `dw.order` - Order processing and management
- `dw.system` - System utilities and configurations
- `dw.web` - Web framework and request handling
- `dw.util` - Utility functions and helpers
- And many more specialized namespaces...

---

## 🏗️ Enhanced SFRA Documentation Access

**Advanced Storefront Reference Architecture Documentation** - Comprehensive access to all SFRA components with intelligent categorization.

### 📂 SFRA Document Categories (26+ documents total):

**Core SFRA Classes (5 documents)**
- `server` - Main server functionality and routing
- `request` - Request object handling and middleware
- `response` - Response management and rendering
- `querystring` - Query parameter processing
- `render` - Template rendering and view management

**Product Models (5 documents)**
- `product-full` - Complete product model with all attributes
- `product-bundle` - Product bundle handling
- `product-tile` - Product tile display models
- `product-search` - Search result product models
- `product-line-items` - Cart line item product models

**Order & Cart Models (6 documents)**
- `cart` - Shopping cart functionality
- `order` - Order processing models
- `billing` - Billing address and payment models
- `shipping` - Shipping options and calculations
- `payment` - Payment processing models
- `totals` - Order totals and tax calculations

**Customer Management (2 documents)**
- `account` - Customer account management
- `address` - Address management and validation

**Pricing Models (3 documents)**
- `price-default` - Standard pricing models
- `price-range` - Price range calculations
- `price-tiered` - Tiered pricing structures

**Store Management (2 documents)**
- `store` - Individual store information
- `stores` - Multi-store management

**Additional Utilities (3+ documents)**
- `categories` - Category navigation and management
- `content` - Content asset models
- `locale` - Internationalization and localization

### Enhanced SFRA Features:
- **Dynamic Discovery** - Automatically finds all SFRA documentation files
- **Smart Categorization** - Organizes documents into logical functional groups
- **Performance Optimization** - Intelligent caching with lazy loading
- **Advanced Search** - Relevance-scored search results with context highlighting
- **Category Filtering** - Explore documents by functional areas

---

## ⚙️ SFCC System Object Definitions

**Deep System Integration** - Explore and understand SFCC's data model with comprehensive system object access.

**System Object Tools:**
- **Get All System Objects** - Retrieve complete list of all system object definitions with metadata
- **Get System Object Definition** - Detailed information about specific objects (Product, Customer, Order, etc.)
- **Search System Object Attribute Definitions** - Find specific attributes using complex queries
- **Search Site Preferences** - Discover custom site preferences and configurations
- **Search System Object Attribute Groups** - Find attribute groups and preference categories
- **Search Custom Object Attribute Definitions** - Explore custom object structures

**Advanced Query Capabilities:**
- Text search on id/display_name/description
- Filtering by properties (mandatory/searchable/system)
- Sorting and pagination support
- Boolean query combinations (AND/OR/NOT)
- Match-all queries for complete attribute lists

**Use Cases:**
- Discovering custom attributes added to standard SFCC objects
- Understanding site preference configurations
- Exploring custom object definitions
- Finding attributes with specific characteristics
- Mapping data model relationships

*Note: Requires OAuth credentials (clientId and clientSecret) for full functionality*

---

## 📊 Log Analysis & Monitoring

**Real-time Debugging and Monitoring** - Comprehensive log analysis tools for SFCC instance monitoring and debugging.

**Log Analysis Tools:**
- **Get Latest Errors** - Retrieve the most recent error messages from SFCC logs
- **Get Latest Warnings** - Fetch recent warning messages and deprecation notices
- **Get Latest Info** - Access recent info-level log entries for application flow
- **Get Latest Debug** - Detailed debug messages for step-by-step execution tracing
- **Summarize Logs** - Get overview of log activity with error counts and key issues
- **Search Logs** - Search for specific patterns, keywords, or error messages across log files
- **List Log Files** - View available log files with metadata including sizes and modification dates

**Monitoring Capabilities:**
- Real-time error tracking and alerting
- Performance monitoring through log analysis
- Pattern recognition for recurring issues
- System health assessment
- Debugging assistance with detailed execution traces

**Log Types Supported:**
- Application logs (info, warn, error, debug)
- System logs with performance metrics
- Custom log entries from cartridge code
- WebDAV access logs
- OCAPI/SCAPI request logs

---

## 🎯 Operating Modes

### Documentation-Only Mode (15 tools)
Perfect for learning, reference, and development without requiring SFCC instance access:
- Complete SFCC API documentation (5 tools)
- Best practices guides (4 tools)
- SFRA documentation access (5 tools)
- Cartridge generation (1 tool)

### Full Mode (30 tools)
Complete development experience with SFCC instance access:
- All documentation-only features (15 tools)
- Real-time log analysis (7 tools)
- System object definitions (6 tools)
- Code version management (2 tools)

---

## 🔒 Security & Performance

**Built-in Security Features:**
- Secure credential management
- Path traversal protection
- Input validation and sanitization
- Rate limiting and resource management
- Audit logging for all operations

**Performance Optimizations:**
- Intelligent caching systems
- Lazy loading for large datasets
- Connection pooling for SFCC APIs
- Request deduplication
- Background processing for heavy operations

---

## Next Steps

- 🛠️ **[Available Tools](tools)** - Detailed tool documentation
- 💡 **[Examples](examples)** - Real-world usage patterns
- ⚙️ **[Configuration](configuration)** - Setup and credentials

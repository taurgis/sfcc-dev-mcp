import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import { H1, PageSubtitle, H2, H3 } from '../components/Typography';
import useSEO from '../hooks/useSEO';

const ExamplesPage: React.FC = () => {
    useSEO({
        title: 'Examples & Use Cases - SFCC Development MCP Server',
        description: 'Real-world examples of using the SFCC Development MCP Server with AI assistants for common development tasks. Includes controller creation, debugging, architecture planning, and data model exploration.',
        keywords: 'SFCC examples, Commerce Cloud examples, AI-assisted development, SFCC controller examples, debugging examples, architecture planning, cartridge development',
        canonical: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/examples',
        ogTitle: 'SFCC Development Examples - AI-Assisted Commerce Cloud Development',
        ogDescription: 'Real-world examples of AI-assisted SFCC development workflows, debugging scenarios, and architecture planning.',
        ogUrl: 'https://sfcc-mcp-dev.rhino-inquisitor.com/#/examples'
    });

    return (
        <>
            <H1 id="examples">💡 Examples & Use Cases</H1>
            <PageSubtitle>Real-world examples of how to use the SFCC Development MCP Server with AI assistants for common development tasks.</PageSubtitle>

            <H2 id="quick-start-examples">🚀 Quick Start Examples</H2>

            <H3 id="create-sfcc-controller">Create a New SFCC Controller</H3>
            <p><strong>User:</strong> "Create a new SFCC controller for product search with proper error handling"</p>
            <p><strong>AI Assistant Response:</strong></p>
            
            <CodeBlock language="javascript" code={`
// Generated using SFRA best practices
'use strict';

var server = require('server');
var Logger = require('dw/system/Logger');
var ProductSearchModel = require('*/cartridge/models/search');
var ProductFactory = require('*/cartridge/scripts/factories/product');
var cache = require('*/cartridge/scripts/middleware/cache');

server.get('Show', cache.applyDefaultCache, function (req, res, next) {
    var searchPhrase = req.querystring.q;
    var categoryId = req.querystring.cgid;
    
    try {
        var searchModel = new ProductSearchModel(req.querystring, req.locale.id);
        searchModel.search();
        
        if (!searchModel.count) {
            res.setStatusCode(404);
            res.render('error/notfound');
            return next();
        }
        
        var products = ProductFactory.get({
            products: searchModel.productIds,
            viewType: 'tile',
            variationModel: req.querystring.variationModel
        });
        
        res.render('search/searchresults', {
            searchModel: searchModel,
            products: products,
            searchPhrase: searchPhrase
        });
        
    } catch (e) {
        var logger = Logger.getLogger('ProductSearch');
        logger.error('Product search error: ' + e.message);
        res.setStatusCode(500);
        res.render('error/somethingwentwrong');
    }
    
    next();
});

module.exports = server.exports();
            `} />
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                <p className="text-sm text-blue-800"><em>The AI automatically used SFRA patterns, proper error handling, caching middleware, and logging based on the best practices guides.</em></p>
            </div>

            <H2 id="debugging-scenarios">🐛 Debugging Scenarios</H2>

            <H3 id="investigate-checkout-errors">Investigate Checkout Errors</H3>
            <p><strong>User:</strong> "My checkout flow is failing. Can you check the logs and help me debug?"</p>
            
            <p><strong>AI Process:</strong></p>
            <ol className="list-decimal pl-6 space-y-1">
                <li><strong>Get Recent Errors:</strong> <InlineCode>get_latest_error({"{"} limit: 10 {"}"})</InlineCode></li>
                <li><strong>Search for Checkout Issues:</strong> <InlineCode>search_logs({"{"} pattern: "checkout", logLevel: "error" {"}"})</InlineCode></li>
                <li><strong>Analyze Error Patterns:</strong> Identifies common failure points</li>
                <li><strong>Provide Solutions:</strong> Based on error analysis and best practices</li>
            </ol>

            <p><strong>Sample AI Response:</strong></p>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
                <p>I found 3 checkout-related errors in the last hour:</p>
                <br />
                <p><strong>1. Payment Authorization Failed</strong> (5 occurrences)</p>
                <ul className="list-disc pl-6">
                    <li>Error: <InlineCode>Credit card validation failed for order 00001234</InlineCode></li>
                    <li><strong>Solution:</strong> Check payment processor configuration and card validation logic</li>
                </ul>
                <br />
                <p><strong>2. Inventory Check Failed</strong> (2 occurrences)</p>
                <ul className="list-disc pl-6">
                    <li>Error: <InlineCode>Product ABC123 not available in required quantity</InlineCode></li>
                    <li><strong>Solution:</strong> Implement proper inventory validation in basket calculation hooks</li>
                </ul>
                <br />
                <p>Based on SFCC best practices, I recommend adding these validation steps...</p>
            </div>

            <H2 id="architecture-planning">🏗️ Architecture & Planning</H2>

            <H3 id="plan-custom-integration">Plan a Custom Integration</H3>
            <p><strong>User:</strong> "I need to integrate with a third-party shipping service. What's the best approach?"</p>
            
            <p><strong>AI Process:</strong></p>
            <ol className="list-decimal pl-6 space-y-1">
                <li><strong>Get Integration Guide:</strong> <InlineCode>get_best_practice_guide({"{"} guideName: "localserviceregistry" {"}"})</InlineCode></li>
                <li><strong>Review Service Patterns:</strong> Provides OAuth and API integration examples</li>
                <li><strong>Suggest Architecture:</strong> Based on SFCC service integration patterns</li>
            </ol>

            <p><strong>Sample AI Response:</strong></p>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
                <p>For third-party shipping integration, I recommend this architecture:</p>
                <br />
                <p><strong>1. Service Configuration</strong></p>
                <CodeBlock language="javascript" code={`
// Use LocalServiceRegistry for external API calls
var ServiceRegistry = require('dw/svc/LocalServiceRegistry');

var shippingService = ServiceRegistry.createService('shipping.api', {
    createRequest: function(svc, params) {
        svc.setRequestMethod('POST');
        svc.addHeader('Authorization', 'Bearer ' + params.token);
        return JSON.stringify(params.shipment);
    },
    parseResponse: function(svc, response) {
        return JSON.parse(response.text);
    }
});
                `} />
                <br />
                <p><strong>2. Hook Integration Points</strong></p>
                <ul className="list-disc pl-6">
                    <li>Use <InlineCode>dw.order.calculate</InlineCode> hook for rate calculation</li>
                    <li>Use <InlineCode>dw.order.shipmentShipped</InlineCode> for tracking updates</li>
                </ul>
                <br />
                <p><strong>3. Error Handling Strategy</strong></p>
                <ul className="list-disc pl-6">
                    <li>Implement circuit breaker pattern</li>
                    <li>Add fallback shipping options</li>
                    <li>Log all API interactions for debugging</li>
                </ul>
            </div>

            <H2 id="data-model-exploration">📊 Data Model Exploration</H2>

            <H3 id="discover-custom-attributes">Discover Custom Attributes</H3>
            <p><strong>User:</strong> "What custom attributes are available on the Product object in my instance?"</p>
            
            <p><strong>AI Process:</strong></p>
            <ol className="list-decimal pl-6 space-y-1">
                <li><strong>Search Product Attributes:</strong> <InlineCode>search_system_object_attribute_definitions({"{"} objectType: "Product", searchRequest: {"{"} query: {"{"} match_all_query: {"{}"} {"}"} {"}"} {"}"})</InlineCode></li>
                <li><strong>Filter Custom Attributes:</strong> Identifies non-system attributes</li>
                <li><strong>Provide Usage Examples:</strong> Shows how to access attributes in code</li>
            </ol>

            <p><strong>Sample AI Response:</strong></p>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
                <p>Found 12 custom attributes on your Product object:</p>
                <br />
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">Attribute ID</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Required</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>brandName</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">String</td>
                            <td className="border border-gray-300 px-4 py-2">No</td>
                            <td className="border border-gray-300 px-4 py-2">Product brand identifier</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>sustainabilityRating</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Enum</td>
                            <td className="border border-gray-300 px-4 py-2">No</td>
                            <td className="border border-gray-300 px-4 py-2">Eco-friendly rating (1-5)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2"><InlineCode>technicalSpecs</InlineCode></td>
                            <td className="border border-gray-300 px-4 py-2">Text</td>
                            <td className="border border-gray-300 px-4 py-2">No</td>
                            <td className="border border-gray-300 px-4 py-2">Technical specifications</td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <p><strong>Usage in Controllers:</strong></p>
                <CodeBlock language="javascript" code={`
var product = ProductMgr.getProduct('product-id');
var brandName = product.custom.brandName;
var rating = product.custom.sustainabilityRating;
                `} />
                <br />
                <p><strong>Usage in Templates:</strong></p>
                <CodeBlock language="html" code={`
<div class="product-brand">\${product.custom.brandName}</div>
<div class="sustainability-rating" data-rating="\${product.custom.sustainabilityRating}">
                `} />
            </div>

            <H2 id="development-workflow-examples">🔧 Development Workflow Examples</H2>

            <H3 id="set-up-new-cartridge">Set Up New Cartridge</H3>
            <p><strong>User:</strong> "Create a new payment integration cartridge with proper structure"</p>
            
            <p><strong>AI Process:</strong></p>
            <ol className="list-decimal pl-6 space-y-1">
                <li><strong>Generate Cartridge:</strong> <InlineCode>generate_cartridge_structure({"{"} cartridgeName: "int_payment_provider" {"}"})</InlineCode></li>
                <li><strong>Provide Setup Guide:</strong> Based on cartridge creation best practices</li>
                <li><strong>Suggest Next Steps:</strong> Integration patterns and testing approaches</li>
            </ol>

            <p><strong>Generated Structure:</strong></p>
            <CodeBlock language="text" code={`
int_payment_provider/
├── cartridge/
│   ├── controllers/
│   │   └── PaymentProvider.js
│   ├── scripts/
│   │   ├── hooks/
│   │   │   └── payment.js
│   │   └── services/
│   │       └── PaymentProviderService.js
│   ├── templates/
│   │   └── default/
│   │       └── checkout/
│   │           └── paymentmethods.isml
│   ├── static/
│   │   └── default/
│   │       ├── js/
│   │       └── css/
│   └── client/
│       └── default/
│           └── js/
│               └── checkout/
├── package.json
├── webpack.config.js
└── .eslintrc.js
            `} />

            <H2 id="security-review">🔒 Security Review</H2>

            <H3 id="audit-isml-templates">Audit ISML Templates</H3>
            <p><strong>User:</strong> "Review my ISML templates for security vulnerabilities"</p>
            
            <p><strong>AI Process:</strong></p>
            <ol className="list-decimal pl-6 space-y-1">
                <li><strong>Get Security Guide:</strong> <InlineCode>get_best_practice_guide({"{"} guideName: "security" {"}"})</InlineCode></li>
                <li><strong>Review Template Patterns:</strong> Analyzes for XSS and injection risks</li>
                <li><strong>Provide Remediation:</strong> Specific fixes based on SFCC security practices</li>
            </ol>

            <p><strong>Sample Security Review:</strong></p>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
                <p className="font-semibold text-red-800">Security Issues Found:</p>
                <br />
                <p className="text-red-800">❌ <strong>XSS Vulnerability</strong> in <InlineCode>product/productdetails.isml</InlineCode>:</p>
                <CodeBlock language="html" code={`
<!-- VULNERABLE: Unescaped output -->
<div>\${product.custom.description}</div>
                `} />
                <br />
                <p className="text-green-800">✅ <strong>Fixed Version:</strong></p>
                <CodeBlock language="html" code={`
<!-- SECURE: Properly escaped output -->
<isprint value="\${pdict.product.custom.description}" encoding="htmlcontent" />
                `} />
                <br />
                <p className="text-red-800">❌ <strong>Missing CSRF Protection</strong> in form submission:</p>
                <CodeBlock language="html" code={`
<!-- VULNERABLE: No CSRF token -->
<form action="\${URLUtils.url('Cart-AddProduct')}" method="post">
                `} />
                <br />
                <p className="text-green-800">✅ <strong>Fixed Version:</strong></p>
                <CodeBlock language="html" code={`
<!-- SECURE: CSRF token included -->
<form action="\${URLUtils.url('Cart-AddProduct')}" method="post">
    <input type="hidden" name="\${pdict.csrf.tokenName}" value="\${pdict.csrf.token}"/>
                `} />
            </div>

            <H2 id="performance-optimization">📈 Performance Optimization</H2>

            <H3 id="optimize-slow-product-pages">Optimize Slow Product Pages</H3>
            <p><strong>User:</strong> "My product detail pages are loading slowly. Help me optimize them."</p>
            
            <p><strong>AI Process:</strong></p>
            <ol className="list-decimal pl-6 space-y-1">
                <li><strong>Get Performance Guide:</strong> <InlineCode>get_best_practice_guide({"{"} guideName: "performance" {"}"})</InlineCode></li>
                <li><strong>Analyze Logs:</strong> <InlineCode>search_logs({"{"} pattern: "performance", logLevel: "warn" {"}"})</InlineCode></li>
                <li><strong>Provide Optimization Strategy:</strong> Based on SFCC performance patterns</li>
            </ol>

            <p><strong>Sample Performance Analysis:</strong></p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <p className="font-semibold text-yellow-800">Performance Issues Identified:</p>
                <br />
                <p><strong>1. Database Query Optimization</strong></p>
                <ul className="list-disc pl-6">
                    <li>47ms average for product variant lookups</li>
                    <li><strong>Solution:</strong> Implement variant caching in product model</li>
                </ul>
                <br />
                <p><strong>2. Image Loading Optimization</strong></p>
                <ul className="list-disc pl-6">
                    <li>Multiple image service calls per product</li>
                    <li><strong>Solution:</strong> Use lazy loading and image optimization</li>
                </ul>
                <br />
                <p><strong>3. Recommendation Engine Delays</strong></p>
                <ul className="list-disc pl-6">
                    <li>230ms for recommendation API calls</li>
                    <li><strong>Solution:</strong> Implement async loading with fallbacks</li>
                </ul>
                <br />
                <p><strong>Optimization Implementation:</strong></p>
                <CodeBlock language="javascript" code={`
// Optimized product model with caching
var CacheMgr = require('dw/system/CacheMgr');
var cache = CacheMgr.getCache('ProductVariants');

function getProductWithVariants(productID) {
    var cacheKey = 'product_' + productID;
    var product = cache.get(cacheKey);
    
    if (!product) {
        product = ProductMgr.getProduct(productID);
        // Cache for 1 hour
        cache.put(cacheKey, product, 3600);
    }
    
    return product;
}
                `} />
            </div>

            <H2 id="testing-patterns">🧪 Testing Patterns</H2>

            <H3 id="create-unit-tests-for-service">Create Unit Tests for Service</H3>
            <p><strong>User:</strong> "Help me write unit tests for my payment service integration"</p>
            
            <p><strong>AI Process:</strong></p>
            <ol className="list-decimal pl-6 space-y-1">
                <li><strong>Get Security Guide:</strong> <InlineCode>get_best_practice_guide({"{"} guideName: "security" {"}"})</InlineCode></li>
                <li><strong>Get Service Guide:</strong> <InlineCode>get_best_practice_guide({"{"} guideName: "localserviceregistry" {"}"})</InlineCode></li>
                <li><strong>Provide Test Structure:</strong> Based on SFCC security and service best practices</li>
                <li><strong>Generate Test Cases:</strong> Covers success, failure, and edge cases</li>
            </ol>

            <p><strong>Generated Test Suite:</strong></p>
            <CodeBlock language="javascript" code={`
// Test suite for PaymentProviderService
var assert = require('*/cartridge/scripts/util/assert');
var PaymentService = require('*/cartridge/scripts/services/PaymentProviderService');

describe('PaymentProviderService', function() {
    
    beforeEach(function() {
        // Mock service dependencies
        this.mockOrder = {
            totalGrossPrice: { value: 99.99 },
            customerEmail: 'test@example.com'
        };
    });
    
    describe('processPayment', function() {
        
        it('should successfully process valid payment', function() {
            var result = PaymentService.processPayment(this.mockOrder, {
                cardNumber: '4111111111111111',
                expiryDate: '12/25',
                cvv: '123'
            });
            
            assert.isTrue(result.success);
            assert.isNotNull(result.transactionId);
        });
        
        it('should handle invalid card numbers', function() {
            var result = PaymentService.processPayment(this.mockOrder, {
                cardNumber: '1234567890123456',
                expiryDate: '12/25', 
                cvv: '123'
            });
            
            assert.isFalse(result.success);
            assert.equals(result.error, 'INVALID_CARD_NUMBER');
        });
        
        it('should handle service timeouts gracefully', function() {
            // Mock service timeout
            PaymentService.setTimeout(100);
            
            var result = PaymentService.processPayment(this.mockOrder, {
                cardNumber: '4111111111111111',
                expiryDate: '12/25',
                cvv: '123'
            });
            
            assert.isFalse(result.success);
            assert.equals(result.error, 'SERVICE_TIMEOUT');
        });
    });
});
            `} />

            <H2 id="common-use-case-patterns">🎯 Common Use Case Patterns</H2>

            <H3 id="typical-ai-assistant-conversations">Typical AI Assistant Conversations</H3>
            
            <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold">1. "How do I...?" Questions</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>User asks about SFCC functionality</li>
                        <li>AI uses documentation tools to provide accurate answers</li>
                        <li>Includes code examples and best practices</li>
                    </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold">2. "Debug this error" Requests</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>User shares error messages or symptoms</li>
                        <li>AI searches logs and analyzes patterns</li>
                        <li>Provides root cause analysis and solutions</li>
                    </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold">3. "Review my code" Requests</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>User shares code snippets or files</li>
                        <li>AI applies security and performance best practices</li>
                        <li>Suggests improvements and optimizations</li>
                    </ul>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="font-semibold">4. "Plan this feature" Discussions</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>User describes requirements</li>
                        <li>AI provides architecture recommendations</li>
                        <li>Suggests implementation approaches and patterns</li>
                    </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">5. "Generate boilerplate" Tasks</p>
                    <ul className="list-disc pl-6 mt-2">
                        <li>User needs template code or structures</li>
                        <li>AI creates proper SFCC-compliant implementations</li>
                        <li>Includes proper error handling and documentation</li>
                    </ul>
                </div>
            </div>

            <H2 id="integration-with-development-workflow">🔗 Integration with Development Workflow</H2>

            <H3 id="vs-code-github-copilot">VS Code + GitHub Copilot</H3>
            <CodeBlock language="javascript" code={`
// AI suggests SFCC-aware completions
var ProductMgr = require('dw/catalog/ProductMgr');

// Type "product." and get intelligent suggestions
var product = ProductMgr.getProduct(productId);
product.// ← AI suggests: .name, .ID, .custom, .variant, etc.
            `} />

            <H3 id="claude-desktop-for-architecture">Claude Desktop for Architecture</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Multi-turn conversations</strong> for complex planning</li>
                <li><strong>Context-aware suggestions</strong> based on project structure</li>
                <li><strong>Real-time documentation lookup</strong> during discussions</li>
            </ul>

            <H3 id="cursor-for-code-generation">Cursor for Code Generation</H3>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>File-aware completions</strong> based on cartridge structure</li>
                <li><strong>Rule-based suggestions</strong> for security and performance</li>
                <li><strong>Intelligent refactoring</strong> across related files</li>
            </ul>

            <H2 id="next-steps">Next Steps</H2>
            <div className="flex flex-wrap gap-4 mt-4">
                <a href="#/troubleshooting" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    🐛 Troubleshooting
                </a>
                <a href="#/tools" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    🛠️ Available Tools
                </a>
                <a href="#/configuration" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                    ⚙️ Configuration
                </a>
            </div>
        </>
    );
};

export default ExamplesPage;
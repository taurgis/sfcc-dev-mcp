import React, { useState, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import SEO from '../components/SEO';
import BreadcrumbSchema from '../components/BreadcrumbSchema';
import StructuredData from '../components/StructuredData';
import { H1, H2, H3, PageSubtitle } from '../components/Typography';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import LightCodeContainer from '../components/LightCodeContainer';
import NewcomerCTA from '../components/NewcomerCTA';

const HomePage: React.FC = () => {
  const [isWithoutMcpModalOpen, setIsWithoutMcpModalOpen] = useState(false);
  const [isWithMcpModalOpen, setIsWithMcpModalOpen] = useState(false);
  const [zoomPosition1, setZoomPosition1] = useState({ x: 0, y: 0 });
  const [isZooming1, setIsZooming1] = useState(false);
  const [zoomPosition2, setZoomPosition2] = useState({ x: 0, y: 0 });
  const [isZooming2, setIsZooming2] = useState(false);
  const imageRef1 = useRef<HTMLImageElement>(null);
  const imageRef2 = useRef<HTMLImageElement>(null);

  const handleMouseMove1 = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef1.current) return;
    
    const rect = imageRef1.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setZoomPosition1({ x, y });
  }, []);

  const handleMouseEnter1 = useCallback(() => {
    setIsZooming1(true);
  }, []);

  const handleMouseLeave1 = useCallback(() => {
    setIsZooming1(false);
  }, []);

  const handleMouseMove2 = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef2.current) return;
    
    const rect = imageRef2.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setZoomPosition2({ x, y });
  }, []);

  const handleMouseEnter2 = useCallback(() => {
    setIsZooming2(true);
  }, []);

  const handleMouseLeave2 = useCallback(() => {
    setIsZooming2(false);
  }, []);

  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "SFCC Development MCP Server - AI-Powered Commerce Cloud Development Tools",
    "description": "Model Context Protocol server for Salesforce B2C Commerce Cloud development with comprehensive documentation access, log analysis, and development best practices.",
    "url": "https://sfcc-mcp-dev.rhino-inquisitor.com/",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "SFCC Development MCP Server",
      "applicationCategory": "DeveloperApplication",
      "description": "A comprehensive MCP server providing AI assistants with direct access to SFCC development tools, documentation, and debugging capabilities.",
      "operatingSystem": "Node.js",
      "downloadUrl": "https://www.npmjs.com/package/sfcc-dev-mcp",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sfcc-mcp-dev.rhino-inquisitor.com/"
      }]
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <SEO 
        title="SFCC Development MCP Server - AI-Powered Commerce Cloud Development Tools"
        description="Model Context Protocol server for Salesforce B2C Commerce Cloud development. Access comprehensive documentation, analyze logs, explore system objects, and get best practices with AI assistance."
        keywords="SFCC, Salesforce Commerce Cloud, Model Context Protocol, MCP server, AI development tools, SFCC documentation, Commerce Cloud development, SFCC debugging, AI-assisted development, SFCC best practices"
        canonical="/"
        ogType="website"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" }
      ]} />
      <StructuredData structuredData={homePageStructuredData} />
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="bg-white/20 rounded-full p-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </span>
          AI-Powered Development Tools for SFCC
        </div>
        
        <H1 id="sfcc-development-mcp-server" className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
          SFCC Development MCP Server
        </H1>
        
        <PageSubtitle className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Supercharge your Salesforce B2C Commerce Cloud development with AI-powered documentation access, 
          real-time log analysis, and intelligent best practices guidance
        </PageSubtitle>
      </div>
      {/* Quick Start Section */}
      <div className="mb-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-blue-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No Credentials Required
            </div>
            <H2 id="quick-start" className="text-3xl font-bold mb-4">🚀 Zero-Config Quick Start</H2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Jump straight into SFCC development with AI assistance. Get access to comprehensive documentation, 
              best practices, and cartridge generation tools instantly.
            </p>
          </div>
          
          {/* Newcomer CTA */}
          <NewcomerCTA className="mb-8" />
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add to your AI client:</h3>
              <LightCodeContainer>
                <CodeBlock language="json" code={`{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx", 
      "args": ["sfcc-dev-mcp"]
    }
  }
}`} />
              </LightCodeContainer>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 md:mt-24">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mt-0">Instant Access</h4>
                  <p className="text-gray-600 text-sm">Start using SFCC documentation and tools immediately</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mt-0">No Setup Required</h4>
                  <p className="text-gray-600 text-sm">Works out of the box with documentation-only mode</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-2 mt-1">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mt-0">Full Documentation</h4>
                  <p className="text-gray-600 text-sm">Complete SFCC API docs, SFRA guides, and best practices</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              💡 <strong>Want more features?</strong> Open a VS Code workspace with a <InlineCode>dw.json</InlineCode> file (auto-discovered), 
              or use <InlineCode>--dw-json</InlineCode> for real-time log analysis, system & custom object exploration, and advanced debugging tools.
            </p>
          </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 mb-8">
        <NavLink 
          to="/ai-interfaces/" 
          className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 no-underline hover:no-underline focus:no-underline"
        >
          Get Started in 2 Minutes
          <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
        </NavLink>
        <NavLink 
          to="/examples/" 
          className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 no-underline hover:no-underline focus:no-underline"
        >
          See Examples
        </NavLink>
      </div>

      {/* AI Instructions Warning */}
      <div className="mb-16 bg-gradient-to-r from-red-100 to-orange-100 border-l-4 border-red-500 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <H3 id="important-ai-instructions" className="text-red-800 text-xl font-bold mb-3">
                ⚠️ Essential: AI Instructions Required
              </H3>
              <p className="text-red-800 mb-4">
                Your AI needs specific instructions to use the MCP server effectively. We've created ready-to-use 
                instruction files for GitHub Copilot, Claude, and Cursor.
              </p>
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/taurgis/sfcc-dev-mcp/tree/main/ai-instructions" 
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors no-underline hover:no-underline focus:no-underline" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Download AI Instructions
                </a>
                <NavLink 
                  to="/ai-interfaces/" 
                  className="inline-flex no-underline items-center gap-1 text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  📖 Setup Guide
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </NavLink>
              </div>
            </div>
          </div>
      </div>

      {/* Value Proposition Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <H2 id="why-use-this" className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Stop Fighting Documentation
            </span>
          </H2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Transform your SFCC development workflow from manual documentation hunting to AI-powered assistance
          </p>
        </div>
        
        {/* Before/After Comparison */}
        <div className="mb-12 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 rounded-3xl p-8 shadow-2xl border border-gray-200">
            
            {/* Timeline Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium">
                <span className="bg-white/20 rounded-full p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </span>
                Development Timeline Comparison
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 relative">
              {/* Connecting Line */}
              <div className="hidden lg:block absolute left-1/2 top-16 bottom-16 w-px bg-gradient-to-b from-red-300 via-yellow-300 to-green-300 transform -translate-x-1/2"></div>
              
              {/* Before Timeline */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-3 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Traditional</h3>
                    <p className="text-red-600 font-medium">Frustrating & Time-Consuming</p>
                  </div>
                </div>
                
                {/* Timeline Steps */}
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-xl transition-all hover:shadow-md">
                    <div className="bg-red-100 rounded-full p-2 mt-1 flex-shrink-0">
                      <span className="text-red-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Documentation Hunt</h4>
                      <p className="text-sm text-gray-600">Open 10+ browser tabs searching for method signatures</p>
                      <div className="text-xs text-red-600 font-medium mt-1">⏱️ 15-30 minutes</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-xl transition-all hover:shadow-md">
                    <div className="bg-red-100 rounded-full p-2 mt-1 flex-shrink-0">
                      <span className="text-red-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Copy-Paste Engineering</h4>
                      <p className="text-sm text-gray-600">Hunt for code examples across forums and docs</p>
                      <div className="text-xs text-red-600 font-medium mt-1">⏱️ 20-45 minutes</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-xl transition-all hover:shadow-md">
                    <div className="bg-red-100 rounded-full p-2 mt-1 flex-shrink-0">
                      <span className="text-red-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Debug Blindly</h4>
                      <p className="text-sm text-gray-600">Manual log analysis without proper context</p>
                      <div className="text-xs text-red-600 font-medium mt-1">⏱️ 1-3 hours</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-xl transition-all hover:shadow-md">
                    <div className="bg-red-100 rounded-full p-2 mt-1 flex-shrink-0">
                      <span className="text-red-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Feature Scaffolding</h4>
                      <p className="text-sm text-gray-600">Manually create cartridge structures and boilerplate code for new cartridges, new SCAPI endpoints, ...</p>
                      <div className="text-xs text-red-600 font-medium mt-1">⏱️ 30-60 minutes</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-red-50 border border-red-200 rounded-xl transition-all hover:shadow-md">
                    <div className="bg-red-100 rounded-full p-2 mt-1 flex-shrink-0">
                      <span className="text-red-600 font-bold text-sm">5</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Context Switching</h4>
                      <p className="text-sm text-gray-600">Jump between IDE, browser, logs, and documentation</p>
                      <div className="text-xs text-red-600 font-medium mt-1">⏱️ Constant overhead</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-xl">
                  <div className="flex items-center gap-2 text-red-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">Total Time Lost: 2-4 hours daily</span>
                  </div>
                </div>
              </div>

              {/* After Timeline */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">AI-Enhanced</h3>
                    <p className="text-green-600 font-medium">Efficient & Intelligent</p>
                  </div>
                </div>
                
                {/* Timeline Steps */}
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-green-50 border border-green-200 rounded-xl transition-all hover:shadow-md">
                    <div className="bg-green-100 rounded-full p-2 mt-1 flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Ask AI Directly</h4>
                      <p className="text-sm text-gray-600">"Show me Product pricing methods" → instant comprehensive answer</p>
                      <div className="text-xs text-green-600 font-medium mt-1">⏱️ 30 seconds</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-green-50 border border-green-200 rounded-xl transition-all hover:shadow-md">
                    <div className="bg-green-100 rounded-full p-2 mt-1 flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Get Complete Examples</h4>
                      <p className="text-sm text-gray-600">AI generates proper SFCC patterns with best practices</p>
                      <div className="text-xs text-green-600 font-medium mt-1">⏱️ 1-2 minutes</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-green-50 border border-green-200 rounded-xl transition-all hover:shadow-md">
                    <div className="bg-green-100 rounded-full p-2 mt-1 flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Smart Debugging</h4>
                      <p className="text-sm text-gray-600">"Find errors from last 24h" → AI analyzes and filters logs</p>
                      <div className="text-xs text-green-600 font-medium mt-1">⏱️ 2-5 minutes</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-green-50 border border-green-200 rounded-xl transition-all hover:shadow-md">
                    <div className="bg-green-100 rounded-full p-2 mt-1 flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Instant Scaffolding</h4>
                      <p className="text-sm text-gray-600">"Create custom SCAPI endpoint for wishlist" → complete cartridge with routes</p>
                      <div className="text-xs text-green-600 font-medium mt-1">⏱️ 1-2 minutes</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-green-50 border border-green-200 rounded-xl transition-all hover:shadow-md">
                    <div className="bg-green-100 rounded-full p-2 mt-1 flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">5</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Stay in Flow</h4>
                      <p className="text-sm text-gray-600">All SFCC knowledge accessible within your editor</p>
                      <div className="text-xs text-green-600 font-medium mt-1">⏱️ Zero context switching</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-xl">
                  <div className="flex items-center gap-2 text-green-800">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold">Total Time Saved: 2-3 hours daily</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 text-center">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <div className="text-left">
                  <div className="font-bold text-lg">Ready to 10x your SFCC productivity?</div>
                  <div className="text-blue-100 text-sm">Set up in under 2 minutes • No SFCC credentials required to start</div>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* What You Get */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <H2 id="what-you-get" className="text-3xl font-bold mb-4">🎯 What You Get</H2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Two modes to match your needs: start instantly with documentation-only mode, 
            then upgrade to full mode for live data analysis
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Documentation Mode */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-500 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <H3 id="documentation-mode" className="text-2xl font-bold text-green-800">Documentation Mode</H3>
                <p className="text-green-600 font-medium" style={{
                  marginTop: '-12px'
                }}>Zero setup required</p>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Complete SFCC API documentation</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">SFRA guides and best practices</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Cartridge generation tools</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Security and performance guidance</span>
              </li>
            </ul>
          </div>

          {/* Full Mode */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <H3 id="full-mode" className="text-2xl font-bold text-blue-800 mb-">Full Mode</H3>
                <p className="text-blue-600 font-medium" style={{
                  marginTop: '-12px'
                }}>Everything + live data</p>
              </div>
            </div>
            
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">All documentation features</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Real-time log analysis</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">System & custom object exploration</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Code version management</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-blue-100 rounded-lg">
              <p className="text-blue-800 text-sm font-medium">🔐 Requires SFCC credentials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Overview */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <H2 id="key-features" className="text-3xl font-bold mb-4">✨ Everything You Need</H2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            36+ specialized tools for comprehensive SFCC development support
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Documentation</h3>
            <p className="text-sm text-gray-600">Complete API docs</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Log Analysis</h3>
            <p className="text-sm text-gray-600">Real-time monitoring</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clipRule="evenodd" />
                </svg>
            </div>
            <h3 className="font-semibold text-gray-900">System Objects</h3>
            <p className="text-sm text-gray-600">Live exploration</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
              <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Cartridges</h3>
            <p className="text-sm text-gray-600">Auto generation</p>
          </div>
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
              <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3-9a1 1 0 00-1-1H8a1 1 0 100 2h1v3a1 1 0 102 0v-3h1a1 1 0 001-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Job Logs</h3>
            <p className="text-sm text-gray-600">Execution insights</p>
          </div>
        </div>
      </div>

      {/* Quick Test Drive Section */}
      <div className="mb-16 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-8 shadow-xl border border-emerald-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Test Drive
              </div>
              <H2 id="quick-test-drive" className="text-3xl font-bold mb-4">🧪 Try It Right Now</H2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                After setup, ask your AI assistant this question to see the MCP server in action. No SFCC credentials needed.
              </p>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Ask Your AI This</h3>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-blue-900 mb-3">Copy this prompt:</p>
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-base font-mono text-gray-800 leading-relaxed">
                          "Explain how to get the sale price for a product variant in SFCC. Keep it short and a quick example"
                        </p>
                      </div>
                      <div className="mt-3 flex justify-center gap-2 flex-wrap">
                        <button 
                          onClick={() => navigator.clipboard.writeText('Explain how to get the sale price for a product variant in SFCC. Keep it short and a quick example')}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                          Copy Prompt
                        </button>
                        <button 
                          onClick={() => setIsWithoutMcpModalOpen(true)}
                          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          View Without MCP
                        </button>
                        <button 
                          onClick={() => setIsWithMcpModalOpen(true)}
                          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          View With MCP
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">What You Should See</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col h-full">
                    <div className="grid grid-cols-[auto_1fr] gap-2 items-center mb-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="font-medium text-green-800">SFCC Methods</p>
                    </div>
                    <p className="text-sm text-green-700 flex-grow">Lists actual methods like getPriceModel(), getVariationModel()</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col h-full">
                    <div className="grid grid-cols-[auto_1fr] gap-2 items-center mb-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="font-medium text-green-800">Code Examples</p>
                    </div>
                    <p className="text-sm text-green-700 flex-grow">Shows real SFCC code patterns with proper syntax</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col h-full">
                    <div className="grid grid-cols-[auto_1fr] gap-2 items-center mb-3">
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="font-medium text-green-800">Documentation</p>
                    </div>
                    <p className="text-sm text-green-700 flex-grow">References accurate SFCC API information</p>
                  </div>
                </div>
              </div>
            </div>            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 rounded-full p-1 mt-0.5">
                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-yellow-800 mb-1">Without MCP Server</p>
                  <p className="text-sm text-yellow-700">
                    Your AI would give generic responses or outdated information. With MCP, it accesses live SFCC documentation and provides accurate, specific answers.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">✅ Getting SFCC-specific answers? Your setup is working perfectly!</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <NavLink to="/examples/" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-emerald-600 text-white shadow hover:bg-emerald-700 transition group no-underline hover:no-underline focus:no-underline">
                  Try More Examples
                  <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
                </NavLink>
                <NavLink to="/configuration/" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-white text-gray-800 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition no-underline hover:no-underline focus:no-underline">
                  Add Full Mode
                </NavLink>
              </div>
            </div>
      </div>

      {/* Final CTA */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-200 mb-8">
          <p className="text-lg text-gray-700 italic leading-relaxed max-w-4xl mx-auto mb-6">
            "Empower your AI assistant with comprehensive SFCC knowledge for faster, more accurate development assistance."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink 
              to="/ai-interfaces/" 
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 no-underline hover:no-underline focus:no-underline"
            >
              Get Started Now
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </NavLink>
            <NavLink 
              to="/features/" 
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 no-underline hover:no-underline focus:no-underline"
            >
              Explore Features
            </NavLink>
          </div>
        </div>
      </div>

      {/* Modal for WITHOUT MCP screenshot */}
      {isWithoutMcpModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsWithoutMcpModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  AI Response Without MCP Server
                </h3>
                <button
                  onClick={() => setIsWithoutMcpModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6 relative">
                <div className="relative overflow-hidden rounded-lg shadow-lg border border-gray-200">
                  <img
                    ref={imageRef1}
                    src="/explain-product-pricing-methods-no-mcp.png"
                    alt="AI response without MCP server - generic and potentially inaccurate information"
                    className="w-full h-auto cursor-crosshair"
                    onMouseMove={handleMouseMove1}
                    onMouseEnter={handleMouseEnter1}
                    onMouseLeave={handleMouseLeave1}
                  />
                  
                  {/* Zoom circle */}
                  {isZooming1 && (
                    <div
                      className="absolute pointer-events-none border-4 border-white shadow-lg rounded-full overflow-hidden"
                      style={{
                        width: '300px',
                        height: '300px',
                        left: `${zoomPosition1.x - 150}px`,
                        top: `${zoomPosition1.y - 150}px`,
                        backgroundImage: `url('/explain-product-pricing-methods-no-mcp.png')`,
                        backgroundSize: `${imageRef1.current ? imageRef1.current.offsetWidth * 2 : 0}px ${imageRef1.current ? imageRef1.current.offsetHeight * 2 : 0}px`,
                        backgroundPosition: `-${zoomPosition1.x * 2 - 150}px -${zoomPosition1.y * 2 - 150}px`,
                        backgroundRepeat: 'no-repeat',
                        transform: 'translate(0, 0)',
                        zIndex: 1000
                      }}
                    >
                      <div className="absolute inset-0 ring-2 ring-red-500 ring-opacity-50 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Problems with This Response
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-red-300 rounded-lg">
                    <p className="font-semibold text-red-800 mb-2">🎯 Wrong API Usage:</p>
                    <p className="text-sm text-red-700">
                      Suggests non-existent methods like <code className="bg-red-200 px-1 rounded font-mono">product.getVariant('variant-id')</code> 
                      and shows client-side fetch to non-standard endpoints. These approaches don't exist in SFCC 
                      and would cause runtime errors in production.
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-red-300 rounded-lg">
                    <p className="font-semibold text-red-800 mb-2">📚 Outdated Patterns:</p>
                    <p className="text-sm text-red-700">
                      Shows generic client-side fetch patterns to non-standard endpoints like 
                      <code className="bg-red-200 px-1 rounded font-mono">/on/demandware.store/Sites-SiteGenesis-Site/</code> 
                      instead of current SFRA controller patterns. This leads developers down the wrong implementation path.
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-red-300 rounded-lg">
                    <p className="font-semibold text-red-800 mb-2">🤔 Generic Assumptions:</p>
                    <p className="text-sm text-red-700">
                      Makes assumptions about SFCC architecture without understanding the actual API structure. 
                      Provides general e-commerce patterns that don't align with SFCC's specific implementation.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-red-800 mb-2">Other Issues:</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>Non-existent API methods suggested</li>
                        <li>Generic client-side fetch patterns</li>
                        <li>Broken endpoint examples</li>
                        <li>Generic assumptions about SFCC</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-red-800 mb-2">Developer Impact:</h5>
                      <ul className="text-sm text-red-700 space-y-1">
                        <li>Runtime errors from wrong API calls</li>
                        <li>Time wasted on deprecated patterns</li>
                        <li>Following incorrect implementation paths</li>
                        <li>Loss of confidence in AI guidance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for WITH MCP screenshot */}
      {isWithMcpModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsWithMcpModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  AI Response With MCP Server
                </h3>
                <button
                  onClick={() => setIsWithMcpModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6 relative">
                <div className="relative overflow-hidden rounded-lg shadow-lg border border-gray-200">
                  <img
                    ref={imageRef2}
                    src="/explain-product-pricing-methods.png"
                    alt="AI response with MCP server - accurate SFCC-specific information and code examples"
                    className="w-full h-auto cursor-crosshair"
                    onMouseMove={handleMouseMove2}
                    onMouseEnter={handleMouseEnter2}
                    onMouseLeave={handleMouseLeave2}
                  />
                  
                  {/* Zoom circle */}
                  {isZooming2 && (
                    <div
                      className="absolute pointer-events-none border-4 border-white shadow-lg rounded-full overflow-hidden"
                      style={{
                        width: '300px',
                        height: '300px',
                        left: `${zoomPosition2.x - 150}px`,
                        top: `${zoomPosition2.y - 150}px`,
                        backgroundImage: `url('/explain-product-pricing-methods.png')`,
                        backgroundSize: `${imageRef2.current ? imageRef2.current.offsetWidth * 2 : 0}px ${imageRef2.current ? imageRef2.current.offsetHeight * 2 : 0}px`,
                        backgroundPosition: `-${zoomPosition2.x * 2 - 150}px -${zoomPosition2.y * 2 - 150}px`,
                        backgroundRepeat: 'no-repeat',
                        transform: 'translate(0, 0)',
                        zIndex: 1000
                      }}
                    >
                      <div className="absolute inset-0 ring-2 ring-green-500 ring-opacity-50 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Why This Response is Accurate
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-green-300 rounded-lg">
                    <p className="font-semibold text-green-800 mb-2">✅ Accurate SFCC Implementation:</p>
                    <p className="text-sm text-green-700">
                      The AI correctly uses <code className="bg-green-200 px-1 rounded font-mono">ProductMgr.getProduct()</code> 
                      and <code className="bg-green-200 px-1 rounded font-mono">getPriceModel().getPrice()</code> with 
                      proper syntax. It also mentions the correct <code className="bg-green-200 px-1 rounded font-mono">Money</code> 
                      object return type and <code className="bg-green-200 px-1 rounded font-mono">toFormattedString()</code> method.
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-green-300 rounded-lg">
                    <p className="font-semibold text-green-800 mb-2">🔍 Comprehensive Context:</p>
                    <p className="text-sm text-green-700">
                      Explains important details like <code className="bg-green-200 px-1 rounded font-mono">Money.NOT_AVAILABLE</code> 
                      handling, quantity-based pricing options, and <code className="bg-green-200 px-1 rounded font-mono">getPriceInfo()</code> 
                      for additional price book details. Shows understanding of SFCC pricing architecture.
                    </p>
                  </div>
                  <div className="p-4 bg-white border border-green-300 rounded-lg">
                    <p className="font-semibold text-green-800 mb-2">🎯 Real-World Ready:</p>
                    <p className="text-sm text-green-700">
                      Code examples are production-ready and follow current SFRA patterns. The AI shows 
                      MCP server integration by using actual SFCC documentation tools during the response.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-green-800 mb-2">Key Benefits:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>Syntactically correct SFCC code</li>
                        <li>Proper ProductPriceModel usage</li>
                        <li>Current SFRA best practices</li>
                        <li>Real-time documentation access</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-green-800 mb-2">Developer Impact:</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>Copy-paste ready code examples</li>
                        <li>Production-ready implementations</li>
                        <li>Comprehensive error handling info</li>
                        <li>Advanced API usage patterns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
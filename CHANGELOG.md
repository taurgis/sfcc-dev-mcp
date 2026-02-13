# Changelog

All notable changes to this project will be documented in this file.

The format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Release comparison links are provided at the bottom. Earlier patch releases on the same day may represent rapid iterations (e.g. architectural + documentation expansions). Dates are derived from git tag timestamps.

## [1.0.15] - 2025-10-03
### Added
- **SFRA Best Practices Expansion**: 
  - SFRA SCSS best practices guide with theming and override patterns
  - SFRA client-side JavaScript guide covering AJAX flows, validation, and accessibility
- **OCAPI Select Parameter Support**: Comprehensive support for OCAPI select syntax to control response field selection
- **System Object Pagination**: Added pagination support for system object definitions with configurable start/count parameters
- **Chronological Log Sorting**: Enhanced log file sorting by last modification time for accurate recency ordering
- **OCAPI Mock Server**: Complete OCAPI mock server implementation for testing with site preferences and system objects
- **Documentation Site Enhancements**:
  - Vite React SSG migration for improved build performance and SSR capabilities
  - GitHub link integration in sidebar
  - Newcomer CTA component for better onboarding
  - Mobile web app capability with enhanced PWA support
  - Enhanced schema.org metadata for better SEO
- **Performance Best Practices**: Added detailed SCAPI web-tier cache fundamentals, personalized cache keys, and script-level cache controls
- **Custom Endpoint Caching**: Comprehensive caching strategies documentation for custom SCAPI endpoints with two-tier pattern examples

### Changed
- **Testing Framework Migration**: Replaced Conductor with Aegis for MCP testing with improved declarative YAML patterns
- **Documentation Modernization**:
  - Revamped documentation site with improved layout and readability
  - Consolidated agent instructions with enhanced clarity
  - Updated all Aegis usage examples to use `npx` commands
  - Added `-y` flag to npx commands in documentation
- **Code Quality Improvements**:
  - Modularized OCAPI route handling for better maintainability
  - Centralized site date constants
  - Improved code block rendering with LightCodeContainer component
  - Enhanced sidebar header display
- **Node.js Version Updates**: Updated Node.js versions and related documentation
- **URL Structure**: Enforced trailing slashes for routes with consistent URL patterns
- **AI Interface Enhancements**: Improved AI interface and configuration documentation

### Fixed
- **SSR Hydration**: Fixed SSR hydration mismatch in OnThisPage component
- **Hash Navigation**: Resolved hash navigation issues after search operations

### Documentation
- **CSRF Middleware**: Clarified CSRF middleware usage patterns in SFRA
- **Remote Include Architecture**: Added detailed explanation of remote include patterns for dynamic content
- **Aegis Testing**: Comprehensive updates to Aegis testing documentation with best practices
- **Performance Guidance**: Enhanced performance best practices with SCAPI-specific caching strategies

### Testing
- **Comprehensive Test Coverage**:
  - OCAPI error handling and validation tests
  - Site preferences search tool tests
  - System object attribute search tests with complex query support
  - Full mode tests for object definitions and search logs
  - Comprehensive select parameter validation tests
  - MCP tool tests with Aegis framework
- **Test Infrastructure**:
  - OCAPI test server setup integrated into CI/CD pipeline
  - Refactored tests to use centralized SFCC mock server
  - Enhanced test targeting and organization

### Dependencies
- **GitHub Actions Updates**:
  - `actions/checkout` from 4 to 5
  - `actions/configure-pages` from 4 to 5
  - `actions/setup-node` from 4 to 5
  - `actions/upload-pages-artifact` from 3 to 4
  - `codecov/codecov-action` from 5.5.0 to 5.5.1
- **Development Dependencies**:
  - `browserslist` from 4.25.2 to 4.26.2
  - `vite-react-ssg` to v0.8.9
  - Updated ESLint group packages
  - Updated `ts-jest` in Jest group

### Notes
- Major testing infrastructure modernization with Aegis framework adoption
- Significant documentation site improvements with SSG migration and enhanced UX
- Expanded SFRA best practices coverage for complete development lifecycle
- Enhanced OCAPI functionality with select parameter support and comprehensive mocking

## [1.0.14] - 2025-09-16
### Added
- **SFCC Class Information Filtering**: Enhanced `get_sfcc_class_info` tool with comprehensive filtering capabilities including search parameter, inclusion/exclusion of descriptions, constants, properties, methods, and inheritance hierarchy.
- **AI Response Comparison Modals**: Interactive modals on documentation site showing side-by-side comparison of AI responses with and without MCP server, including zoom functionality for detailed inspection.
- **Documentation Site Enhancements**: 
  - Examples page with practical usage scenarios and filtering demonstrations
  - Tools page documenting all available MCP tools
  - Features page highlighting key capabilities
  - Configuration documentation page with setup instructions
  - AI Instruction Files section for different AI platforms
  - LLMs documentation file for AI assistant integration
  - Troubleshooting page for common issues
  - Development and security documentation pages
- **Homepage Value Proposition**: Enhanced homepage with clear value proposition and practical examples.
- **Anchor Link Navigation**: Added IDs to documentation headers for direct linking.

### Changed
- **Project Licensing**: Aligned to MIT License (replaced ISC LICENSE text, updated `package.json` license field).
- **CI/CD Pipeline**: Enhanced with improved linting and security checks.
- **Documentation Structure**: Comprehensive reorganization and expansion of documentation site structure.
- **Code Examples**: Updated with full path references for better clarity.
- **Configuration Examples**: Updated example configurations for better usability.
- **UI/UX Polish**: Improved padding, layout adjustments, and site navigation structure.

### Fixed
- **URL Fragment Handling**: Fixed URL-encoded hash fragment handling in documentation site.
- **Workflow Deployment**: Corrected path issues for page deployment.
- **Log Tool Validation**: Improved argument validation robustness for log analysis tools.

### Documentation
- **AI Interface Setup**: Comprehensive guides for Claude Desktop, Cursor, and GitHub Copilot integration.
- **Security Guidance**: Enhanced security considerations and best practices documentation.
- **Troubleshooting**: Added comprehensive troubleshooting guide for common setup and usage issues.
- **Development Workflow**: Detailed development guidelines and contribution instructions.

### Testing
- **Enhanced Test Coverage**: 
  - Comprehensive programmatic tests for SFCC class info filtering in documentation mode
  - Enhanced YAML-based MCP tests for class information tools
  - Job execution summary tests and job log analysis tests
  - Improved test setup reliability and CI stability

### Notes
- Major documentation site expansion with React/Vite architecture
- Enhanced developer experience with comprehensive filtering and search capabilities
- Improved AI assistant integration with detailed setup guides for multiple platforms

## [1.0.13] - 2025-09-15
### Added
- `engines` field in `package.json` enforcing Node >=18 and npm >=8.
- Comprehensive architectural documentation (handler modularization, capability gating, services layer, log subsystem, tool-configs, caching).
- Initial `CHANGELOG.md` introduction.

### Changed
- Server reported version synchronized with `package.json`.
- Development guide: migrated from legacy Jekyll instructions to Vite workflow; updated tool addition workflow for new handler architecture.

### Fixed
- Removed references to non-existent config files (`config.ts`, `constants.ts`).
- Corrected debug flag examples (`--debug` vs `--debug true`).
- Escaping/format fixes in development guide code blocks.

### Notes
- Pre-1.0.14 license mismatch (ISC vs MIT badge) resolved in 1.0.14.

## [1.0.12] - 2025-08-19
### Added
- Code version management tools (listing & activation) with supporting documentation.
- Cartridge generation enhancements: page layout & styling improvements; prevention of overwriting existing files.
- Security and OCAPI configuration warnings; highlighted AI instruction files.
- Additional SFRA model and best practice documentation (ISML decorators, LocalServiceRegistry, Auth examples, BM configuration guide).

### Changed
- ESLint configuration (global vars, lint fix script), table styling, documentation site theme updates, repository URL in config, branch protection for deploy (restricted to main), improved instance type check.
- Documentation structure reorganized (multiple passes consolidating guides, theme adjustments, layout evolution and subsequent refinements / reverts).

### Fixed
- Removal of `resourceState` from activateCodeVersion request.

### Documentation
- Large expansion of SFRA models, cartridge creation, ISML templates, decorators warnings, URL patterns, customer context, authentication flows, endpoint security guidance.

### Notes
- Multiple rapid doc iterations (additions, reverts, restyles) before stabilization.

## [1.0.11] - 2025-08-15
### Added
- SFCC development rules and SFRA controllers best practices guide.
- AI interface instruction documentation.

### Changed
- Refactored rule configurations; enhanced SFCC debugging workflows; streamlined documentation tools; removed improvement roadmap.

### Fixed
- Log files now sorted by last modification for accurate recency ordering.

### Testing
- Enhanced log client test coverage.

### Notes
- Documentation emphasis on rule context explanation and operational clarity.

## [1.0.10] - 2025-08-15
### Added
- Custom object attribute search capability.
- Progressive development guide (subsequently refined) and job framework best practices.
- Additional documentation: steptypes configuration, ISML templates, SCAPI custom endpoint guide, path parameter & search query usage clarifications, SFRA documentation support expansion.

### Changed
- Auth examples refactored into appendix; logging improvements and build output cleanliness.

### Fixed
- Reversal / clarification cycles for job framework status codes and default values (cleanup of earlier docs ambiguities).

### Notes
- Foundation for expanded SCAPI / SFRA documentation just before rapid rule & controller additions in 1.0.11.

## [1.0.9-2] - 2025-08-13
### Changed
- Enhanced release workflow (iteration on same-day release of 1.0.9).

## [1.0.9] - 2025-08-13
### Added
- Initial modular handler & directory architecture groundwork: secure config loading, debug log support, documentation-only mode, system object exposure, site preferences & attribute search, OCAPI client integration.
- CI workflow, caching layer for documentation, expanded class details, path resolver, pre-commit hooks, NPM publishing & Dependabot configuration, issue templates.

### Changed
- Large-scale codebase reorganization (directory structure, authentication & logging refactors, configuration loading improvements, handler refactors, OAuth token management relocation, package metadata updates, JSON serialization, system object description refinements, server architecture refactor).
- Log tool naming alignment & tool description clarity improvements.

### Fixed
- File path security validation enhancements.

### Documentation
- Extensive expansion: best practices (security, performance, cartridge creation), contributing guidelines, search tool description, quick setup, system object definitions, Copilot instructions, local dev focus clarification.

### Testing
- Added Jest framework and early test coverage (config factory, OAuth token manager, log client, attribute definitions, best practices client).

### Notes
- Represents the foundational public baseline preceding rapid feature layering in 1.0.10+.

## [1.0.8] - 2025-08-13
### Changed
- Package version alignment & metadata updates; project structure and documentation improvements; Node version CI expansions.

### Added
- Security & performance best practices guides, contributing guidelines, AI assistant integration guide, deprecation support, attribute definition search, site preferences search.

### Notes
- Last pre-architecture refactor baseline before major handler and structural reorganization in 1.0.9.

## [1.0.2] - 2025-08-08
### Added
- Debug logging capabilities, caching for documentation, expanded class details, initial SFCC MCP server feature set (system object & attribute tools, OCAPI integration, documentation retrieval).
- Jest testing framework & initial unit tests.

### Changed
- Centralized logging infrastructure; configuration logging & security tightening; authentication config refactors.

### Documentation
- Cartridge creation guide, npx usage instructions, API docs, system object definitions resource.

### Notes
- Early stabilization phase; intermediate patch releases between 1.0.2 and 1.0.8 consolidated here (internal iteration without tags not reconstructed individually).

## [1.0.0] - 2025-08-08
### Added
- Initial commit introducing SFCC Dev MCP Server core (base server, tooling scaffolding, initial documentation framework).

### Notes
- Foundation commit history includes scaffolding, early capability extensions, and initial architectural decisions.

---

---

### Future
- Add automation for changelog validation in CI (ensure categories & links present).
- Add script to generate comparison links automatically when tagging.
- Potential provenance notes for security-impacting changes (e.g., file path validation hardening).

---

### Comparison Links
[1.0.15]: https://github.com/taurgis/sfcc-dev-mcp/compare/v1.0.14...v1.0.15
[1.0.14]: https://github.com/taurgis/sfcc-dev-mcp/compare/v1.0.13...v1.0.14
[1.0.13]: https://github.com/taurgis/sfcc-dev-mcp/compare/v1.0.12...v1.0.13
[1.0.12]: https://github.com/taurgis/sfcc-dev-mcp/compare/v1.0.11...v1.0.12
[1.0.11]: https://github.com/taurgis/sfcc-dev-mcp/compare/v1.0.10...v1.0.11
[1.0.10]: https://github.com/taurgis/sfcc-dev-mcp/compare/v1.0.9-2...v1.0.10
[1.0.9-2]: https://github.com/taurgis/sfcc-dev-mcp/compare/v1.0.9...v1.0.9-2
[1.0.9]: https://github.com/taurgis/sfcc-dev-mcp/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/taurgis/sfcc-dev-mcp/compare/v1.0.2...v1.0.8
[1.0.2]: https://github.com/taurgis/sfcc-dev-mcp/compare/v1.0.0...v1.0.2
[1.0.0]: https://github.com/taurgis/sfcc-dev-mcp/tree/v1.0.0


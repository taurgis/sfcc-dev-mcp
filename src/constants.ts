/**
 * Constants for SFCC MCP Server
 *
 * Centralized location for all magic numbers, default values, and constants
 */

export const DEFAULT_VALUES = {
  LOG_LIMIT: 10,
  SEARCH_LIMIT: 20,
  SYSTEM_OBJECT_COUNT: 200,
  SYSTEM_OBJECT_START: 0,
  OCAPI_VERSION: "v23_2",
} as const;

export const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
} as const;

export const WEBDAV_PATHS = {
  LOGS: "/on/demandware.servlet/webdav/Sites/Logs/",
} as const;

export const SERVER_INFO = {
  NAME: "sfcc-dev-server",
  VERSION: "1.0.0",
} as const;

export const DATE_FORMAT = {
  SFCC_LOG: "YYYYMMDD",
} as const;

export const FILE_EXTENSIONS = {
  LOG: ".log",
  JSON: ".json",
} as const;

export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
} as const;

export const BEST_PRACTICE_GUIDES = [
  "cartridge_creation",
  "ocapi_hooks",
  "scapi_hooks",
  "sfra_controllers",
  "scapi_custom_endpoint"
] as const;

export const HOOK_GUIDES = [
  "ocapi_hooks",
  "scapi_hooks"
] as const;

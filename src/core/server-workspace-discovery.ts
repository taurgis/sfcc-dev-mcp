import type { DwJsonConfig, SFCCConfig } from '../types/types.js';
import { Logger } from '../utils/logger.js';
import { WorkspaceRootsService } from '../config/workspace-roots.js';

export interface DiscoveryFlowContext {
  logger: Logger;
  forceRefresh: boolean;
  hasExplicitConfiguration: boolean;
  currentConfig: SFCCConfig;
  isConfiguredHostname: (hostname: string | undefined) => boolean;
  listRoots: () => Promise<{ roots?: Array<{ uri: string; name?: string }> }>;
  workspaceRootsService: WorkspaceRootsService;
  enqueueReconfigure: (dwConfig: DwJsonConfig) => Promise<void>;
}

export interface ReconfigureFlowContext {
  logger: Logger;
  dwConfig: DwJsonConfig;
  currentConfig: SFCCConfig;
  mapDwJsonToConfig: (dwConfig: DwJsonConfig) => SFCCConfig;
  hasSameConnectionConfig: (current: SFCCConfig, next: SFCCConfig) => boolean;
  disposeHandlers: () => Promise<void>;
  applyConfig: (nextConfig: SFCCConfig) => {
    hostname: string | undefined;
    canAccessLogs: boolean;
    canAccessOCAPI: boolean;
  };
  registerHandlers: () => void;
  sendToolListChanged: () => Promise<void>;
}

export async function discoverWorkspaceRootsFlow(context: DiscoveryFlowContext): Promise<void> {
  const {
    logger,
    forceRefresh,
    hasExplicitConfiguration,
    currentConfig,
    isConfiguredHostname,
    listRoots,
    workspaceRootsService,
    enqueueReconfigure,
  } = context;

  logger.debug('[Server] discoverWorkspaceRoots called');

  if (hasExplicitConfiguration) {
    logger.debug('[Server] Explicit CLI/ENV configuration detected, skipping MCP workspace discovery');
    return;
  }

  if (!forceRefresh && isConfiguredHostname(currentConfig.hostname)) {
    logger.debug(`[Server] Already configured from workspace roots (hostname="${currentConfig.hostname}"), skipping duplicate discovery`);
    return;
  }

  logger.debug('[Server] No hostname from CLI/ENV, attempting MCP workspace roots discovery...');

  try {
    logger.debug('[Server] Calling server.listRoots()...');

    const rootsResponse = await listRoots();

    logger.debug('[Server] listRoots() returned roots payload');

    const discoveryResult = workspaceRootsService.discoverDwJson(rootsResponse?.roots);

    if (!discoveryResult.success || !discoveryResult.config) {
      logger.debug(`[Server] Discovery failed: ${discoveryResult.reason}`);
      return;
    }

    await enqueueReconfigure(discoveryResult.config);

    logger.log('[Server] Successfully reconfigured with credentials from workspace roots');
    if (discoveryResult.dwJsonPath) {
      logger.debug(`[Server] Discovery source: ${discoveryResult.dwJsonPath}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : '';

    logger.debug(`[Server] listRoots() threw an error: ${errorMessage}`);
    if (errorStack) {
      logger.debug(`[Server] Error stack: ${errorStack}`);
    }

    if (errorMessage.includes('not supported') || errorMessage.includes('Method not found')) {
      logger.debug('[Server] Client does not support workspace roots capability');
    } else {
      logger.warn(`[Server] Workspace roots discovery failed unexpectedly: ${errorMessage}`);
    }
  }
}

export async function reconfigureWithCredentialsFlow(context: ReconfigureFlowContext): Promise<{ skipped: boolean }> {
  const {
    logger,
    dwConfig,
    currentConfig,
    mapDwJsonToConfig,
    hasSameConnectionConfig,
    disposeHandlers,
    applyConfig,
    registerHandlers,
    sendToolListChanged,
  } = context;

  const nextConfig = mapDwJsonToConfig(dwConfig);
  if (hasSameConnectionConfig(currentConfig, nextConfig)) {
    logger.log('[Server] Discovered configuration matches active settings, skipping reconfigure');
    return { skipped: true };
  }

  await disposeHandlers();

  const capabilities = applyConfig(nextConfig);

  logger.log('Server reconfigured with discovered credentials');
  logger.log(`  Hostname: ${capabilities.hostname}`);
  logger.log(`  Can access logs: ${capabilities.canAccessLogs}`);
  logger.log(`  Can access OCAPI: ${capabilities.canAccessOCAPI}`);

  registerHandlers();

  try {
    logger.log('[Server] Sending tools/list_changed notification to client...');
    await sendToolListChanged();
    logger.log('[Server] Successfully sent tools/list_changed notification');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.log(`[Server] Failed to send tools/list_changed notification: ${errorMessage}`);
  }

  return { skipped: false };
}

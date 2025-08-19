import { HandlerContext } from './base-handler.js';
import { SFCCLogClient } from '../../clients/log-client.js';
import { OCAPIClient } from '../../clients/ocapi-client.js';
import { OCAPICodeVersionsClient } from '../../clients/ocapi/code-versions-client.js';
import { CartridgeGenerationClient } from '../../clients/cartridge-generation-client.js';
import { Logger } from '../../utils/logger.js';
import { IFileSystemService, IPathService, FileSystemService, PathService } from '../../services/index.js';

/**
 * Centralized client factory that handles complex initialization logic
 * and encapsulates the requirements for different client types.
 */
export class ClientFactory {
  private context: HandlerContext;
  private logger: Logger;

  constructor(context: HandlerContext, logger: Logger) {
    this.context = context;
    this.logger = logger;
  }

  /**
   * Create an SFCC Log Client if log access is available
   */
  createLogClient(): SFCCLogClient | null {
    if (!this.context.capabilities?.canAccessLogs || !this.context.config) {
      this.logger.debug('Log client not created: missing log access capability or config');
      return null;
    }

    this.logger.debug('Creating SFCC Log Client');
    return new SFCCLogClient(this.context.config);
  }

  /**
   * Create an OCAPI Client if OCAPI access is available
   */
  createOCAPIClient(): OCAPIClient | null {
    if (!this.hasOCAPICredentials()) {
      this.logger.debug('OCAPI client not created: missing OCAPI credentials or capability');
      return null;
    }

    this.logger.debug('Creating OCAPI Client');
    return new OCAPIClient({
      hostname: this.context.config!.hostname!,
      clientId: this.context.config!.clientId!,
      clientSecret: this.context.config!.clientSecret!,
      version: 'v23_2',
    });
  }

  /**
   * Create an OCAPI Code Versions Client if OCAPI access is available
   */
  createCodeVersionsClient(): OCAPICodeVersionsClient | null {
    if (!this.hasOCAPICredentials()) {
      this.logger.debug('Code versions client not created: missing OCAPI credentials or capability');
      return null;
    }

    this.logger.debug('Creating OCAPI Code Versions Client');
    return new OCAPICodeVersionsClient({
      hostname: this.context.config!.hostname!,
      clientId: this.context.config!.clientId!,
      clientSecret: this.context.config!.clientSecret!,
      version: 'v23_2',
    });
  }

  /**
   * Check if OCAPI credentials and capability are available
   */
  private hasOCAPICredentials(): boolean {
    return !!(
      this.context.capabilities?.canAccessOCAPI &&
      this.context.config?.hostname &&
      this.context.config?.clientId &&
      this.context.config?.clientSecret
    );
  }

  /**
   * Create a Cartridge Generation Client with injected dependencies
   */
  createCartridgeClient(
    fileSystemService?: IFileSystemService,
    pathService?: IPathService,
  ): CartridgeGenerationClient {
    this.logger.debug('Creating Cartridge Generation Client');
    return new CartridgeGenerationClient(
      fileSystemService ?? new FileSystemService(),
      pathService ?? new PathService(),
    );
  }

  /**
   * Get the required error message for a client type
   */
  static getClientRequiredError(clientType: 'OCAPI' | 'Log'): string {
    switch (clientType) {
      case 'OCAPI':
        return 'OCAPI client not configured - ensure credentials are provided in full mode.';
      case 'Log':
        return 'Log client not configured - ensure log access is enabled.';
      default:
        return 'Required client not configured.';
    }
  }
}

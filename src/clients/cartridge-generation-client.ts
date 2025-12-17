/**
 * SFCC Cartridge Generation Client
 *
 * @deprecated This file is deprecated. Import from './cartridge/index.js' instead.
 * This file is kept for backward compatibility only.
 *
 * Example migration:
 * - Old: import { CartridgeGenerationClient } from './cartridge-generation-client.js';
 * - New: import { CartridgeGenerationClient } from './cartridge/index.js';
 */

// Re-export everything from the new modular location for backward compatibility
export {
  CartridgeGenerationClient,
  type CartridgeGenerationOptions,
  type CartridgeGenerationResult,
} from './cartridge/cartridge-generation-client.js';

export {
  createCartridgeTemplates,
  type CartridgeTemplates,
} from './cartridge/cartridge-templates.js';

export {
  CARTRIDGE_DIRECTORIES,
  ROOT_PROJECT_FILES,
} from './cartridge/cartridge-structure.js';

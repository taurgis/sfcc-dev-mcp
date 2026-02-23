/**
 * CLI option parsing helpers.
 */

export interface CliOptions {
  dwJsonPath?: string;
  debug?: boolean;
}

const TRUE_VALUES = new Set(['true', '1', 'yes']);
const FALSE_VALUES = new Set(['false', '0', 'no']);

function parseBoolean(value: string): boolean {
  const normalized = value.toLowerCase();

  if (TRUE_VALUES.has(normalized)) {
    return true;
  }

  if (FALSE_VALUES.has(normalized)) {
    return false;
  }

  throw new Error(
    `Invalid value for --debug: "${value}". Use true/false, 1/0, or yes/no.`,
  );
}

function isFlagToken(value: string | undefined): boolean {
  return value?.startsWith('-') ?? false;
}

/**
 * Parse command line arguments to extract configuration options.
 */
export function parseCommandLineArgs(argv: string[] = process.argv.slice(2)): CliOptions {
  const options: CliOptions = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--dw-json') {
      const nextToken = argv[i + 1];
      if (!nextToken || isFlagToken(nextToken)) {
        throw new Error('Missing value for --dw-json. Provide a path to dw.json.');
      }

      options.dwJsonPath = nextToken;
      i++;
      continue;
    }

    if (arg !== '--debug') {
      continue;
    }

    const nextToken = argv[i + 1];
    if (!nextToken || isFlagToken(nextToken)) {
      options.debug = true;
      continue;
    }

    options.debug = parseBoolean(nextToken);
    i++;
  }

  return options;
}

/**
 * Check if environment variables provide SFCC credentials.
 */
export function hasEnvironmentCredentials(env: NodeJS.ProcessEnv = process.env): boolean {
  const hasBasicAuth = !!(env.SFCC_USERNAME && env.SFCC_PASSWORD);
  const hasOAuth = !!(env.SFCC_CLIENT_ID && env.SFCC_CLIENT_SECRET);
  return !!(env.SFCC_HOSTNAME && (hasBasicAuth || hasOAuth));
}

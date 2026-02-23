/**
 * Shared credential and hostname validation helpers.
 */

export interface CredentialPresence {
  hasBasicAuth: boolean;
  hasOAuth: boolean;
  hasPartialBasicAuth: boolean;
  hasPartialOAuth: boolean;
}

interface CredentialValidationInput {
  username?: unknown;
  password?: unknown;
  clientId?: unknown;
  clientSecret?: unknown;
}

interface CredentialValidationMessages {
  basicPairMessage?: string;
  oauthPairMessage?: string;
  requireAnyCredentialsMessage?: string;
}

const DEFAULT_BASIC_PAIR_MESSAGE = 'Basic auth credentials must include both username and password';
const DEFAULT_OAUTH_PAIR_MESSAGE = 'OAuth credentials must include both clientId and clientSecret';
const DEFAULT_HOSTNAME_MESSAGE = 'Invalid hostname format in configuration';
const HOSTNAME_PATTERN = /^[a-zA-Z0-9.-]+(?::[0-9]+)?$/;

function hasNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getCredentialPresence(input: CredentialValidationInput): CredentialPresence {
  const hasBasicUser = hasNonEmptyString(input.username);
  const hasBasicPassword = hasNonEmptyString(input.password);
  const hasClientId = hasNonEmptyString(input.clientId);
  const hasClientSecret = hasNonEmptyString(input.clientSecret);

  return {
    hasBasicAuth: hasBasicUser && hasBasicPassword,
    hasOAuth: hasClientId && hasClientSecret,
    hasPartialBasicAuth: hasBasicUser !== hasBasicPassword,
    hasPartialOAuth: hasClientId !== hasClientSecret,
  };
}

export function assertCredentialConsistency(
  input: CredentialValidationInput,
  messages: CredentialValidationMessages = {},
): CredentialPresence {
  const presence = getCredentialPresence(input);

  if (presence.hasPartialBasicAuth) {
    throw new Error(messages.basicPairMessage ?? DEFAULT_BASIC_PAIR_MESSAGE);
  }

  if (presence.hasPartialOAuth) {
    throw new Error(messages.oauthPairMessage ?? DEFAULT_OAUTH_PAIR_MESSAGE);
  }

  if (messages.requireAnyCredentialsMessage && !presence.hasBasicAuth && !presence.hasOAuth) {
    throw new Error(messages.requireAnyCredentialsMessage);
  }

  return presence;
}

export function assertValidHostnameFormat(
  hostname: string,
  message: string = DEFAULT_HOSTNAME_MESSAGE,
): void {
  const trimmedHostname = hostname.trim();
  if (!HOSTNAME_PATTERN.test(trimmedHostname)) {
    throw new Error(message);
  }
}

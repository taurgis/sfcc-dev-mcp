import {
  hasEnvironmentCredentials,
  parseCommandLineArgs,
} from '../src/config/cli-options.js';

describe('CLI option parsing', () => {
  it('treats --debug as a boolean flag when followed by another option', () => {
    const options = parseCommandLineArgs(['--debug', '--dw-json', '/tmp/dw.json']);

    expect(options).toEqual({
      debug: true,
      dwJsonPath: '/tmp/dw.json',
    });
  });

  it('parses explicit debug values', () => {
    expect(parseCommandLineArgs(['--debug', 'false'])).toEqual({ debug: false });
    expect(parseCommandLineArgs(['--debug', 'yes'])).toEqual({ debug: true });
  });

  it('detects environment credentials with hostname and auth pair', () => {
    const env = {
      SFCC_HOSTNAME: 'example.com',
      SFCC_USERNAME: 'user',
      SFCC_PASSWORD: 'pass',
    } as NodeJS.ProcessEnv;

    expect(hasEnvironmentCredentials(env)).toBe(true);
  });

  it('returns false when hostname is missing', () => {
    const env = {
      SFCC_USERNAME: 'user',
      SFCC_PASSWORD: 'pass',
    } as NodeJS.ProcessEnv;

    expect(hasEnvironmentCredentials(env)).toBe(false);
  });
});

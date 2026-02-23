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
    expect(parseCommandLineArgs(['--debug', '0'])).toEqual({ debug: false });
  });

  it('throws when --debug receives an invalid value', () => {
    expect(() => parseCommandLineArgs(['--debug', 'maybe'])).toThrow(
      'Invalid value for --debug: "maybe". Use true/false, 1/0, or yes/no.',
    );
  });

  it('throws when --dw-json is missing a value', () => {
    expect(() => parseCommandLineArgs(['--dw-json'])).toThrow(
      'Missing value for --dw-json. Provide a path to dw.json.',
    );
  });

  it('throws when --dw-json is followed by another flag', () => {
    expect(() => parseCommandLineArgs(['--dw-json', '--debug'])).toThrow(
      'Missing value for --dw-json. Provide a path to dw.json.',
    );
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

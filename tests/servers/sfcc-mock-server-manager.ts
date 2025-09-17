import { spawn, ChildProcess } from 'child_process';
import path from 'path';

/**
 * Manager for the unified SFCC Mock Server for testing purposes
 * 
 * This class provides utilities to start, stop, and interact with the unified
 * SFCC mock server that combines WebDAV and OCAPI functionality.
 */
export class SFCCMockServerManager {
  private serverProcess: ChildProcess | null = null;
  private readonly config: SFCCMockServerConfig;
  private readonly serverPath: string;
  private startupPromise: Promise<void> | null = null;

  constructor(config: Partial<SFCCMockServerConfig> = {}) {
    this.config = {
      port: 3000,
      host: 'localhost',
      dev: false,
      autoSetup: true,
      timeout: 10000,
      webdav: true,
      ocapi: true,
      cors: true,
      ...config,
    };

    this.serverPath = path.join(__dirname, 'sfcc-mock-server');
  }

  /**
   * Check if the SFCC mock server is available for testing
   */
  async isServerAvailable(): Promise<boolean> {
    try {
      const fs = await import('fs');
      const serverJs = path.join(this.serverPath, 'server.js');
      const packageJson = path.join(this.serverPath, 'package.json');
      
      return fs.existsSync(serverJs) && fs.existsSync(packageJson);
    } catch {
      return false;
    }
  }

  /**
   * Start the SFCC mock server
   */
  async start(): Promise<void> {
    if (this.startupPromise) {
      return this.startupPromise;
    }

    this.startupPromise = this._startServer();
    return this.startupPromise;
  }

  private async _startServer(): Promise<void> {
    if (this.serverProcess) {
      throw new Error('Server is already running');
    }

    const isAvailable = await this.isServerAvailable();
    if (!isAvailable) {
      throw new Error('SFCC mock server is not available. Run setup first.');
    }

    // Setup logs if auto-setup is enabled
    if (this.config.autoSetup) {
      await this._runSetup();
    }

    const args = this._buildServerArgs();
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.stop();
        reject(new Error(`Server failed to start within ${this.config.timeout}ms`));
      }, this.config.timeout);

      this.serverProcess = spawn('node', ['server.js', ...args], {
        cwd: this.serverPath,
        stdio: this.config.dev ? 'inherit' : 'pipe',
      });

      this.serverProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      this.serverProcess.on('exit', (code, signal) => {
        if (code !== null && code !== 0) {
          clearTimeout(timeout);
          reject(new Error(`Server exited with code ${code}`));
        }
      });

      // Wait a bit for the server to start up
      setTimeout(async () => {
        try {
          // Test if server is responding using the health endpoint
          const response = await fetch(`${this.getServerUrl()}/health`);
          if (response.ok) {
            clearTimeout(timeout);
            resolve();
          } else {
            clearTimeout(timeout);
            reject(new Error(`Server health check failed with status ${response.status}`));
          }
        } catch (error) {
          clearTimeout(timeout);
          reject(new Error(`Server health check failed: ${error}`));
        }
      }, 2000); // Give server 2 seconds to start
    });
  }

  private async _runSetup(): Promise<void> {
    return new Promise((resolve, reject) => {
      const setupProcess = spawn('npm', ['run', 'setup:logs'], {
        cwd: this.serverPath,
        stdio: 'pipe',
      });

      setupProcess.on('error', reject);
      setupProcess.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Setup failed with code ${code}`));
        }
      });
    });
  }

  private _buildServerArgs(): string[] {
    const args: string[] = [];

    args.push('--port', this.config.port.toString());
    args.push('--host', this.config.host);

    if (this.config.dev) {
      args.push('--dev');
    }

    if (!this.config.webdav) {
      args.push('--no-webdav');
    }

    if (!this.config.ocapi) {
      args.push('--no-ocapi');
    }

    if (!this.config.cors) {
      args.push('--no-cors');
    }

    return args;
  }

  /**
   * Stop the SFCC mock server
   */
  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.serverProcess) {
        resolve();
        return;
      }

      const process = this.serverProcess;
      this.serverProcess = null;
      this.startupPromise = null;

      const timeout = setTimeout(() => {
        process.kill('SIGKILL');
        resolve();
      }, 5000);

      process.on('exit', () => {
        clearTimeout(timeout);
        resolve();
      });

      process.kill('SIGTERM');
    });
  }

  /**
   * Check if the server is currently running
   */
  isRunning(): boolean {
    return this.serverProcess !== null && this.serverProcess.exitCode === null;
  }

  /**
   * Get the base server URL
   */
  getServerUrl(): string {
    return `http://${this.config.host}:${this.config.port}`;
  }

  /**
   * Get the WebDAV logs URL (SFCC path)
   */
  getWebDAVLogsUrl(): string {
    return `${this.getServerUrl()}/on/demandware.servlet/webdav/Sites/Logs/`;
  }

  /**
   * Get the direct logs URL
   */
  getDirectLogsUrl(): string {
    return `${this.getServerUrl()}/Logs/`;
  }

  /**
   * Get the OCAPI base URL
   */
  getOCAPIUrl(): string {
    return `${this.getServerUrl()}/s/-/dw/data/v23_2`;
  }

  /**
   * Get the OCAPI OAuth URL
   */
  getOAuthUrl(): string {
    return `${this.getServerUrl()}/dw/oauth2/access_token`;
  }
}

/**
 * Configuration interface for the SFCC mock server manager
 */
export interface SFCCMockServerConfig {
  port: number;
  host: string;
  dev: boolean;
  autoSetup: boolean;
  timeout: number;
  webdav: boolean;
  ocapi: boolean;
  cors: boolean;
}

/**
 * Utility function to run a test with the SFCC mock server
 * 
 * @param testFn Function to run with server URLs
 * @param config Optional server configuration
 * @returns Promise resolving to the test function result
 */
export async function withSFCCMockServer<T>(
  testFn: (serverUrl: string, webdavLogsUrl: string, directLogsUrl: string, ocapiUrl: string, oauthUrl: string) => Promise<T>,
  config: Partial<SFCCMockServerConfig> = {}
): Promise<T> {
  const manager = new SFCCMockServerManager({
    port: 3004, // Use different port for utility function
    ...config,
  });

  if (!await manager.isServerAvailable()) {
    throw new Error('SFCC mock server is not available');
  }

  try {
    await manager.start();

    return await testFn(
      manager.getServerUrl(),
      manager.getWebDAVLogsUrl(),
      manager.getDirectLogsUrl(),
      manager.getOCAPIUrl(),
      manager.getOAuthUrl()
    );
  } finally {
    await manager.stop();
  }
}
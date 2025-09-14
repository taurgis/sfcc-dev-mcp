import { spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Mock WebDAV Server Manager for Testing
 *
 * This utility helps manage the mock WebDAV server for testing
 * log-related functionality without requiring real SFCC credentials.
 */

export interface MockWebDAVServerConfig {
  port?: number;
  host?: string;
  dev?: boolean;
  autoSetup?: boolean;
}

export class MockWebDAVServerManager {
  private serverProcess: ChildProcess | null = null;
  private config: Required<MockWebDAVServerConfig>;
  private serverDir: string;

  constructor(config: MockWebDAVServerConfig = {}) {
    this.config = {
      port: config.port ?? 3001, // Use different port to avoid conflicts
      host: config.host ?? 'localhost',
      dev: config.dev ?? false,
      autoSetup: config.autoSetup !== false,
    };
    
    this.serverDir = path.join(__dirname, 'webdav');
  }

  /**
   * Check if the WebDAV server directory exists and is properly set up
   */
  async isServerAvailable(): Promise<boolean> {
    try {
      const packageJsonPath = path.join(this.serverDir, 'package.json');
      await fs.access(packageJsonPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Install server dependencies if needed
   */
  async setupServer(): Promise<void> {
    if (!await this.isServerAvailable()) {
      throw new Error(`WebDAV server not found at ${this.serverDir}`);
    }

    const nodeModulesPath = path.join(this.serverDir, 'node_modules');
    try {
      await fs.access(nodeModulesPath);
    } catch {
      console.log('📦 Installing WebDAV server dependencies...');
      await this.runCommand('npm', ['install'], { cwd: this.serverDir });
    }

    // Setup mock logs
    const mockLogsPath = path.join(this.serverDir, 'mock-logs');
    try {
      await fs.access(mockLogsPath);
    } catch {
      console.log('📁 Setting up mock log files...');
      await this.runCommand('npm', ['run', 'setup'], { cwd: this.serverDir });
    }
  }

  /**
   * Start the mock WebDAV server
   */
  async start(): Promise<void> {
    if (this.serverProcess) {
      throw new Error('Server is already running');
    }

    if (this.config.autoSetup) {
      await this.setupServer();
    }

    const args = [`--port=${this.config.port}`];
    if (this.config.dev) {
      args.push('--dev');
    }

    console.log(`🚀 Starting mock WebDAV server on ${this.config.host}:${this.config.port}`);
    
    this.serverProcess = spawn('node', ['server.js', ...args], {
      cwd: this.serverDir,
      stdio: this.config.dev ? 'inherit' : 'pipe',
    });

    // Wait for server to start
    await this.waitForServer();
  }

  /**
   * Stop the mock WebDAV server
   */
  async stop(): Promise<void> {
    if (!this.serverProcess) {
      return;
    }

    console.log('🛑 Stopping mock WebDAV server...');
    
    return new Promise((resolve) => {
      if (this.serverProcess) {
        this.serverProcess.on('exit', () => {
          this.serverProcess = null;
          resolve();
        });
        
        this.serverProcess.kill('SIGTERM');
        
        // Force kill after 5 seconds
        setTimeout(() => {
          if (this.serverProcess) {
            this.serverProcess.kill('SIGKILL');
            this.serverProcess = null;
            resolve();
          }
        }, 5000);
      } else {
        resolve();
      }
    });
  }

  /**
   * Get the WebDAV server URL
   */
  getServerUrl(): string {
    return `http://${this.config.host}:${this.config.port}`;
  }

  /**
   * Get the WebDAV logs endpoint URL (SFCC format)
   */
  getLogsUrl(): string {
    return `${this.getServerUrl()}/on/demandware.servlet/webdav/Sites/Logs/`;
  }

  /**
   * Get the direct logs endpoint URL (simplified format for testing)
   */
  getDirectLogsUrl(): string {
    return `${this.getServerUrl()}/Logs/`;
  }

  /**
   * Check if the server is running
   */
  isRunning(): boolean {
    return this.serverProcess !== null && !this.serverProcess.killed;
  }

  /**
   * Wait for the server to be ready
   */
  private async waitForServer(timeoutMs: number = 15000): Promise<void> {
    const start = Date.now();
    
    while (Date.now() - start < timeoutMs) {
      try {
        // Try to connect to the server
        const response = await fetch(this.getServerUrl());
        if (response.status === 200 || response.status === 404) {
          console.log('✅ Mock WebDAV server is ready');
          return;
        }
      } catch {
        // Server not ready yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    throw new Error(`Server failed to start within ${timeoutMs}ms`);
  }

  /**
   * Run a command and wait for completion
   */
  private async runCommand(command: string, args: string[], options: { cwd: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, {
        ...options,
        stdio: 'pipe',
      });

      process.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });

      process.on('error', reject);
    });
  }
}

/**
 * Convenience function for tests
 */
export async function withMockWebDAVServer<T>(
  testFn: (serverUrl: string, logsUrl: string, directLogsUrl: string) => Promise<T>,
  config?: MockWebDAVServerConfig,
): Promise<T> {
  const manager = new MockWebDAVServerManager(config);
  
  try {
    await manager.start();
    const result = await testFn(manager.getServerUrl(), manager.getLogsUrl(), manager.getDirectLogsUrl());
    return result;
  } finally {
    await manager.stop();
  }
}

/**
 * Mock for BaseHttpClient
 */

export class BaseHttpClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
  }

  async makeRequest() {
    return { data: 'mocked' };
  }

  async get() {
    return { data: 'mocked' };
  }

  async post() {
    return { data: 'mocked' };
  }

  async put() {
    return { data: 'mocked' };
  }

  async patch() {
    return { data: 'mocked' };
  }

  async delete() {
    return { data: 'mocked' };
  }

  async handleAuthError() {
    // Mock implementation
  }
}

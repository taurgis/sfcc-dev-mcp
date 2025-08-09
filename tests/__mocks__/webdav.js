// Mock implementation of webdav module
const mockWebdavClient = {
  getDirectoryContents: jest.fn(),
  getFileContents: jest.fn(),
};

const createClient = jest.fn(() => mockWebdavClient);

module.exports = {
  createClient,
  __mockWebdavClient: mockWebdavClient,
};

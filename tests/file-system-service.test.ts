import { FileSystemService, MockFileSystemService } from '../src/services/file-system-service.js';

describe('FileSystemService', () => {
  describe('Production FileSystemService', () => {
    let service: FileSystemService;

    beforeEach(() => {
      service = new FileSystemService();
    });

    it('should be instantiable', () => {
      expect(service).toBeInstanceOf(FileSystemService);
    });

    // Note: Testing actual file operations would require integration tests
    // For unit tests, we mainly test the interface compliance
  });

  describe('MockFileSystemService', () => {
    let mockService: MockFileSystemService;

    beforeEach(() => {
      mockService = new MockFileSystemService();
    });

    afterEach(() => {
      mockService.clearMocks();
    });

    it('should be instantiable', () => {
      expect(mockService).toBeInstanceOf(MockFileSystemService);
    });

    it('should handle mock files correctly', async () => {
      const filePath = '/test/file.txt';
      const content = 'test content';

      // Initially file should not exist
      expect(await mockService.exists(filePath)).toBe(false);

      // Set mock file
      mockService.setMockFile(filePath, content);
      expect(await mockService.exists(filePath)).toBe(true);

      // Read mock file
      const readContent = await mockService.readFile(filePath);
      expect(readContent).toBe(content);
    });

    it('should handle mock directories correctly', async () => {
      const dirPath = '/test/dir';

      // Initially directory should not exist
      expect(await mockService.exists(dirPath)).toBe(false);

      // Set mock directory
      mockService.setMockDirectory(dirPath);
      expect(await mockService.exists(dirPath)).toBe(true);
    });

    it('should create directories through mkdir', async () => {
      const dirPath = '/test/new-dir';

      await mockService.mkdir(dirPath, { recursive: true });
      expect(await mockService.exists(dirPath)).toBe(true);
    });

    it('should create files through writeFile', async () => {
      const filePath = '/test/new-file.txt';
      const content = 'new content';

      await mockService.writeFile(filePath, content);
      expect(await mockService.exists(filePath)).toBe(true);

      const readContent = await mockService.readFile(filePath);
      expect(readContent).toBe(content);
    });

    it('should throw error when reading non-existent file', async () => {
      const filePath = '/test/non-existent.txt';

      await expect(mockService.readFile(filePath)).rejects.toThrow('File not found');
    });

    it('should handle access correctly', async () => {
      const existingPath = '/test/existing';
      const nonExistentPath = '/test/non-existent';

      mockService.setMockFile(existingPath, 'content');

      await expect(mockService.access(existingPath)).resolves.not.toThrow();
      await expect(mockService.access(nonExistentPath)).rejects.toThrow('Path not accessible');
    });

    it('should clear mocks correctly', async () => {
      const filePath = '/test/file.txt';
      const dirPath = '/test/dir';

      mockService.setMockFile(filePath, 'content');
      mockService.setMockDirectory(dirPath);

      expect(await mockService.exists(filePath)).toBe(true);
      expect(await mockService.exists(dirPath)).toBe(true);

      mockService.clearMocks();

      expect(await mockService.exists(filePath)).toBe(false);
      expect(await mockService.exists(dirPath)).toBe(false);
    });
  });
});

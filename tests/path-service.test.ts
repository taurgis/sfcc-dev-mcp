import { PathService, MockPathService } from '../src/services/path-service.js';

describe('PathService', () => {
  describe('Production PathService', () => {
    let service: PathService;

    beforeEach(() => {
      service = new PathService();
    });

    it('should be instantiable', () => {
      expect(service).toBeInstanceOf(PathService);
    });

    it('should join paths correctly', () => {
      expect(service.join('a', 'b', 'c')).toMatch(/a.b.c/);
    });

    it('should resolve paths correctly', () => {
      const resolved = service.resolve('test', 'path');
      expect(service.isAbsolute(resolved)).toBe(true);
    });

    it('should get dirname correctly', () => {
      const result = service.dirname('/path/to/file.txt');
      expect(result).toMatch(/.*path.to/);
    });

    it('should get basename correctly', () => {
      expect(service.basename('/path/to/file.txt')).toBe('file.txt');
      expect(service.basename('/path/to/file.txt', '.txt')).toBe('file');
    });

    it('should get extension correctly', () => {
      expect(service.extname('/path/to/file.txt')).toBe('.txt');
      expect(service.extname('/path/to/file')).toBe('');
    });

    it('should normalize paths correctly', () => {
      const normalized = service.normalize('/path//to///file.txt');
      expect(normalized).not.toMatch(/\/\/+/);
    });

    it('should detect absolute paths correctly', () => {
      expect(service.isAbsolute('/absolute/path')).toBe(true);
      expect(service.isAbsolute('relative/path')).toBe(false);
    });
  });

  describe('MockPathService', () => {
    let mockService: MockPathService;

    beforeEach(() => {
      mockService = new MockPathService();
    });

    it('should be instantiable', () => {
      expect(mockService).toBeInstanceOf(MockPathService);
    });

    it('should join paths with forward slashes', () => {
      expect(mockService.join('a', 'b', 'c')).toBe('a/b/c');
    });

    it('should resolve paths with mock root', () => {
      expect(mockService.resolve('test', 'path')).toBe('/mock/root/test/path');
      expect(mockService.resolve('/absolute', 'path')).toBe('/absolute/path');
    });

    it('should get dirname correctly', () => {
      expect(mockService.dirname('/path/to/file.txt')).toBe('/path/to');
      expect(mockService.dirname('/file.txt')).toBe('/');
    });

    it('should get basename correctly', () => {
      expect(mockService.basename('/path/to/file.txt')).toBe('file.txt');
      expect(mockService.basename('/path/to/file.txt', '.txt')).toBe('file');
      expect(mockService.basename('/path/to/file.txt', '.js')).toBe('file.txt');
    });

    it('should get extension correctly', () => {
      expect(mockService.extname('/path/to/file.txt')).toBe('.txt');
      expect(mockService.extname('/path/to/file.min.js')).toBe('.js');
      expect(mockService.extname('/path/to/file')).toBe('');
    });

    it('should normalize paths correctly', () => {
      expect(mockService.normalize('/path//to///file.txt')).toBe('/path/to/file.txt');
    });

    it('should detect absolute paths correctly', () => {
      expect(mockService.isAbsolute('/absolute/path')).toBe(true);
      expect(mockService.isAbsolute('relative/path')).toBe(false);
    });
  });
});

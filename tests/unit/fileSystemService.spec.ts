/**
 * File System Service Unit Tests
 * Tests file operations with security validation
 */

import { FileSystemService } from '../../services/fileSystemService';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

describe('FileSystemService', () => {
  let service: FileSystemService;
  let testDir: string;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vectorforge-test-'));
    service = new FileSystemService(testDir);
  });

  afterEach(async () => {
    // Cleanup test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('readFile', () => {
    it('should read file content', async () => {
      const testFile = path.join(testDir, 'test.txt');
      await fs.writeFile(testFile, 'hello world', 'utf-8');

      const content = await service.readFile('test.txt');
      expect(content).toBe('hello world');
    });

    it('should reject files outside project root', async () => {
      await expect(service.readFile('../../etc/passwd')).rejects.toThrow('Path traversal attempt blocked');
    });

    it('should reject absolute paths', async () => {
      await expect(service.readFile('/etc/passwd')).rejects.toThrow('Path traversal attempt blocked');
    });

    // TODO: Re-enable when maxSize parameter is added to readFile
    // it('should reject files larger than max size', async () => {
    //   const testFile = path.join(testDir, 'large.txt');
    //   const largeContent = 'x'.repeat(11 * 1024 * 1024); // 11MB
    //   await fs.writeFile(testFile, largeContent, 'utf-8');
    //
    //   await expect(service.readFile('large.txt', 10 * 1024 * 1024)).rejects.toThrow('File too large');
    // });
  });

  describe('writeFile', () => {
    it('should write file content', async () => {
      await service.writeFile('tmp/test.txt', 'hello world');

      const content = await fs.readFile(path.join(testDir, 'tmp/test.txt'), 'utf-8');
      expect(content).toBe('hello world');
    });

    it('should create directory if needed', async () => {
      await service.writeFile('tmp/nested/file.txt', 'content');

      const content = await fs.readFile(path.join(testDir, 'tmp/nested/file.txt'), 'utf-8');
      expect(content).toBe('content');
    });

    it('should reject writes outside allowed paths', async () => {
      await expect(service.writeFile('forbidden/file.txt', 'content')).rejects.toThrow('Write not allowed');
    });

    it('should reject overwriting critical files', async () => {
      // Create a package.json in project root
      await fs.writeFile(path.join(testDir, 'package.json'), '{}', 'utf-8');

      await expect(service.writeFile('package.json', '{}')).rejects.toThrow('Cannot overwrite critical file');
    });

    it('should allow overwriting critical files in tmp/', async () => {
      await service.writeFile('tmp/package.json', '{}');
      const content = await fs.readFile(path.join(testDir, 'tmp/package.json'), 'utf-8');
      expect(content).toBe('{}');
    });
  });

  describe('listDirectory', () => {
    it('should list directory contents', async () => {
      await fs.writeFile(path.join(testDir, 'file1.txt'), 'content1', 'utf-8');
      await fs.writeFile(path.join(testDir, 'file2.txt'), 'content2', 'utf-8');
      await fs.mkdir(path.join(testDir, 'subdir'), { recursive: true });

      const entries = await service.listDirectory('.');
      
      expect(entries.length).toBeGreaterThan(0);
      const fileNames = entries.map(e => e.name);
      expect(fileNames).toContain('file1.txt');
      expect(fileNames).toContain('file2.txt');
      expect(fileNames).toContain('subdir');
    });

    it('should return file metadata', async () => {
      await fs.writeFile(path.join(testDir, 'test.txt'), 'content', 'utf-8');

      const entries = await service.listDirectory('.');
      const testFile = entries.find(e => e.name === 'test.txt');
      
      expect(testFile).toBeDefined();
      expect(testFile?.type).toBe('file');
      expect(testFile?.size).toBe(7); // 'content' length
    });
  });

  describe('searchFiles', () => {
    it('should find files matching pattern', async () => {
      await fs.writeFile(path.join(testDir, 'test1.txt'), 'content', 'utf-8');
      await fs.writeFile(path.join(testDir, 'test2.txt'), 'content', 'utf-8');
      await fs.writeFile(path.join(testDir, 'other.txt'), 'content', 'utf-8');

      const results = await service.searchFiles('test');
      
      expect(results.length).toBe(2);
      expect(results).toContain('test1.txt');
      expect(results).toContain('test2.txt');
    });
  });

  describe('path validation', () => {
    it('should normalize paths', async () => {
      await fs.writeFile(path.join(testDir, 'test.txt'), 'content', 'utf-8');

      // Should handle ./test.txt
      const content1 = await service.readFile('./test.txt');
      expect(content1).toBe('content');

      // Should handle nested paths
      await fs.mkdir(path.join(testDir, 'a', 'b'), { recursive: true });
      await fs.writeFile(path.join(testDir, 'a', 'b', 'file.txt'), 'content', 'utf-8');
      
      const content2 = await service.readFile('a/b/file.txt');
      expect(content2).toBe('content');
    });

    it('should block path traversal with ..', async () => {
      await expect(service.readFile('../test.txt')).rejects.toThrow('Path traversal attempt blocked');
      await expect(service.readFile('a/../../test.txt')).rejects.toThrow('Path traversal attempt blocked');
    });
  });
});


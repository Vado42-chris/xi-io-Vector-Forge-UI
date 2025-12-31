/**
 * File System API Routes Integration Tests
 * Tests HTTP endpoints with security validation
 */

import request from 'supertest';
import { createTestApp } from './testApp';

// Create test app
const app = createTestApp();

describe('Filesystem API Routes', () => {
  describe('POST /api/filesystem/read', () => {
    it('should read package.json', async () => {
      const res = await request(app)
        .post('/api/filesystem/read')
        .send({ path: 'package.json' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.content).toBeTruthy();
      expect(res.body.content).toContain('"name"');
    });

    it('should require path parameter', async () => {
      const res = await request(app)
        .post('/api/filesystem/read')
        .send({})
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Path is required');
    });

    it('should reject path traversal attempts', async () => {
      const res = await request(app)
        .post('/api/filesystem/read')
        .send({ path: '../../etc/passwd' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Path traversal attempt blocked');
    });

    it('should reject absolute paths', async () => {
      const res = await request(app)
        .post('/api/filesystem/read')
        .send({ path: '/etc/passwd' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Path traversal attempt blocked');
    });
  });

  describe('POST /api/filesystem/write', () => {
    it('should write file to allowed path', async () => {
      const res = await request(app)
        .post('/api/filesystem/write')
        .send({ path: 'tmp/test-write.txt', content: 'test content' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should require path parameter', async () => {
      const res = await request(app)
        .post('/api/filesystem/write')
        .send({ content: 'test' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Path is required');
    });

    it('should require content parameter', async () => {
      const res = await request(app)
        .post('/api/filesystem/write')
        .send({ path: 'tmp/test.txt' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Content is required');
    });

    it('should reject writes to forbidden paths', async () => {
      const res = await request(app)
        .post('/api/filesystem/write')
        .send({ path: 'forbidden/file.txt', content: 'test' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Write not allowed');
    });

    it('should reject overwriting critical files', async () => {
      const res = await request(app)
        .post('/api/filesystem/write')
        .send({ path: 'package.json', content: '{}' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Cannot overwrite critical file');
    });
  });

  describe('POST /api/filesystem/list', () => {
    it('should list directory contents', async () => {
      const res = await request(app)
        .post('/api/filesystem/list')
        .send({ path: '.' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.entries)).toBe(true);
      expect(res.body.entries.length).toBeGreaterThan(0);
    });

    it('should return file metadata', async () => {
      const res = await request(app)
        .post('/api/filesystem/list')
        .send({ path: '.' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      const entry = res.body.entries[0];
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('path');
      expect(entry).toHaveProperty('type');
      expect(['file', 'directory']).toContain(entry.type);
    });
  });

  describe('POST /api/filesystem/search', () => {
    it('should search for files matching pattern', async () => {
      const res = await request(app)
        .post('/api/filesystem/search')
        .send({ pattern: 'package' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.results)).toBe(true);
      expect(res.body.results.length).toBeGreaterThan(0);
    });

    it('should require pattern parameter', async () => {
      const res = await request(app)
        .post('/api/filesystem/search')
        .send({})
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Search pattern is required');
    });
  });

  describe('GET /api/filesystem/stats', () => {
    it('should return file stats', async () => {
      const res = await request(app)
        .get('/api/filesystem/stats')
        .query({ path: 'package.json' })
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toHaveProperty('size');
      expect(res.body.stats).toHaveProperty('modified');
      expect(res.body.stats).toHaveProperty('created');
      expect(res.body.stats).toHaveProperty('isDirectory');
    });

    it('should require path parameter', async () => {
      const res = await request(app)
        .get('/api/filesystem/stats')
        .set('Accept', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('Path is required');
    });
  });
});


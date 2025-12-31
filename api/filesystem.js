/**
 * File System API Routes
 * Exposes file system operations via HTTP API
 * Reuses patterns from api/tasks.js
 */

import { FileSystemService } from '../services/fileSystemService.js';

const fileSystemService = new FileSystemService();

export async function fileSystemRoutes(app) {
  // POST /api/filesystem/read - Read file
  app.post('/api/filesystem/read', async (req, res) => {
    try {
      const { path } = req.body;
      if (!path) {
        return res.status(400).json({ success: false, error: 'Path is required' });
      }

      const content = await fileSystemService.readFile(path);
      res.json({ success: true, content });
    } catch (error) {
      console.error('Error reading file:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/filesystem/write - Write file
  app.post('/api/filesystem/write', async (req, res) => {
    try {
      const { path, content } = req.body;
      if (!path) {
        return res.status(400).json({ success: false, error: 'Path is required' });
      }
      if (content === undefined) {
        return res.status(400).json({ success: false, error: 'Content is required' });
      }

      await fileSystemService.writeFile(path, content);
      res.json({ success: true });
    } catch (error) {
      console.error('Error writing file:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/filesystem/list - List directory
  app.post('/api/filesystem/list', async (req, res) => {
    try {
      const { path } = req.body;
      const dirPath = path || '.';

      const entries = await fileSystemService.listDirectory(dirPath);
      res.json({ success: true, entries });
    } catch (error) {
      console.error('Error listing directory:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/filesystem/search - Search files
  app.post('/api/filesystem/search', async (req, res) => {
    try {
      const { pattern, path } = req.body;
      if (!pattern) {
        return res.status(400).json({ success: false, error: 'Search pattern is required' });
      }

      const results = await fileSystemService.searchFiles(pattern, path);
      res.json({ success: true, results });
    } catch (error) {
      console.error('Error searching files:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET /api/filesystem/stats - Get file stats
  app.get('/api/filesystem/stats', async (req, res) => {
    try {
      const { path } = req.query;
      if (!path) {
        return res.status(400).json({ success: false, error: 'Path is required' });
      }

      const stats = await fileSystemService.getFileStats(path);
      res.json({ success: true, stats });
    } catch (error) {
      console.error('Error getting file stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/filesystem/create-directory - Create directory
  app.post('/api/filesystem/create-directory', async (req, res) => {
    try {
      const { path: dirPath } = req.body;
      if (!dirPath) {
        return res.status(400).json({ success: false, error: 'Path is required' });
      }

      await fileSystemService.ensureDirectory(dirPath);
      res.json({ success: true });
    } catch (error) {
      console.error('Error creating directory:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/filesystem/delete - Delete file or directory
  app.post('/api/filesystem/delete', async (req, res) => {
    try {
      const { path: filePath } = req.body;
      if (!filePath) {
        return res.status(400).json({ success: false, error: 'Path is required' });
      }

      await fileSystemService.deleteFile(filePath);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/filesystem/move - Move file or directory
  app.post('/api/filesystem/move', async (req, res) => {
    try {
      const { source, destination } = req.body;
      if (!source || !destination) {
        return res
          .status(400)
          .json({ success: false, error: 'Source and destination are required' });
      }

      await fileSystemService.moveFile(source, destination);
      res.json({ success: true });
    } catch (error) {
      console.error('Error moving file:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

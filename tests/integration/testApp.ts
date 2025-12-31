/**
 * Test Express App
 * Creates a test instance of the Express app for integration tests
 */

import express from 'express';
import { fileSystemRoutes } from '../../api/filesystem';

export function createTestApp() {
  const app = express();
  app.use(express.json());
  
  // Register routes
  fileSystemRoutes(app);
  
  return app;
}


/**
 * Sprints API Route
 * Sprint management endpoints
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const SPRINTS_FILE = path.join(DATA_DIR, 'sprints.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Load sprints from file
async function loadSprints() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(SPRINTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save sprints to file
async function saveSprints(sprints) {
  await ensureDataDir();
  await fs.writeFile(SPRINTS_FILE, JSON.stringify(sprints, null, 2));
}

// Load tasks from file
async function loadTasks() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Sprints API Routes
export async function sprintsRoutes(app) {
  // GET /api/sprints - Get all sprints with optional filters
  app.get('/api/sprints', async (req, res) => {
    try {
      const sprints = await loadSprints();
      let filtered = [...sprints];

      // Apply filters
      if (req.query.status) {
        const statuses = req.query.status.split(',');
        filtered = filtered.filter(s => statuses.includes(s.status));
      }
      if (req.query.projectId) {
        filtered = filtered.filter(s => s.projectId === req.query.projectId);
      }
      if (req.query.departmentId) {
        filtered = filtered.filter(s => s.departmentId === req.query.departmentId);
      }

      res.json(filtered);
    } catch (error) {
      console.error('Error loading sprints:', error);
      res.status(500).json({ error: 'Failed to load sprints' });
    }
  });

  // GET /api/sprints/:id - Get single sprint
  app.get('/api/sprints/:id', async (req, res) => {
    try {
      const sprints = await loadSprints();
      const sprint = sprints.find(s => s.id === req.params.id);
      if (sprint) {
        res.json(sprint);
      } else {
        res.status(404).json({ error: 'Sprint not found' });
      }
    } catch (error) {
      console.error('Error loading sprint:', error);
      res.status(500).json({ error: 'Failed to load sprint' });
    }
  });

  // POST /api/sprints - Create new sprint
  app.post('/api/sprints', async (req, res) => {
    try {
      const sprints = await loadSprints();
      const newSprint = {
        id: `sprint-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        tasks: [],
        velocity: { planned: 0, completed: 0 },
        team: [],
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      sprints.push(newSprint);
      await saveSprints(sprints);
      res.json(newSprint);
    } catch (error) {
      console.error('Error creating sprint:', error);
      res.status(500).json({ error: 'Failed to create sprint' });
    }
  });

  // POST /api/sprints/:id - Update sprint
  app.post('/api/sprints/:id', async (req, res) => {
    try {
      const sprints = await loadSprints();
      const index = sprints.findIndex(s => s.id === req.params.id);
      if (index >= 0) {
        sprints[index] = {
          ...sprints[index],
          ...req.body,
          updatedAt: new Date().toISOString(),
        };
        await saveSprints(sprints);
        res.json(sprints[index]);
      } else {
        res.status(404).json({ error: 'Sprint not found' });
      }
    } catch (error) {
      console.error('Error updating sprint:', error);
      res.status(500).json({ error: 'Failed to update sprint' });
    }
  });

  // POST /api/sprints/:id/delete - Delete sprint
  app.post('/api/sprints/:id/delete', async (req, res) => {
    try {
      const sprints = await loadSprints();
      const filtered = sprints.filter(s => s.id !== req.params.id);
      await saveSprints(filtered);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting sprint:', error);
      res.status(500).json({ error: 'Failed to delete sprint' });
    }
  });

  // GET /api/sprints/:id/tasks - Get tasks for sprint
  app.get('/api/sprints/:id/tasks', async (req, res) => {
    try {
      const tasks = await loadTasks();
      const sprintTasks = tasks.filter(t => t.sprintId === req.params.id);
      res.json(sprintTasks);
    } catch (error) {
      console.error('Error loading sprint tasks:', error);
      res.status(500).json({ error: 'Failed to load sprint tasks' });
    }
  });
}


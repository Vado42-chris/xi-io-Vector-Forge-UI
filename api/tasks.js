/**
 * Tasks API Route
 * Extends existing task management with VectorForge integration
 * Uses file-based storage (can be extended to database)
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const SPRINTS_FILE = path.join(DATA_DIR, 'sprints.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
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

// Save tasks to file
async function saveTasks(tasks) {
  await ensureDataDir();
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
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

// Load projects from file
async function loadProjects() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save projects to file
async function saveProjects(projects) {
  await ensureDataDir();
  await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

// Tasks API Routes
export async function tasksRoutes(app) {
  // GET /api/tasks - Get all tasks with optional filters
  app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await loadTasks();
      let filtered = [...tasks];

      // Apply filters
      if (req.query.status) {
        const statuses = req.query.status.split(',');
        filtered = filtered.filter(t => statuses.includes(t.status));
      }
      if (req.query.assignee) {
        filtered = filtered.filter(t => t.assignee?.id === req.query.assignee);
      }
      if (req.query.priority) {
        const priorities = req.query.priority.split(',');
        filtered = filtered.filter(t => priorities.includes(t.priority));
      }
      if (req.query.sprintId) {
        filtered = filtered.filter(t => t.sprintId === req.query.sprintId);
      }
      if (req.query.projectId) {
        filtered = filtered.filter(t => t.projectId === req.query.projectId);
      }
      if (req.query.search) {
        const search = req.query.search.toLowerCase();
        filtered = filtered.filter(
          t =>
            t.title.toLowerCase().includes(search) || t.description.toLowerCase().includes(search)
        );
      }

      res.json(filtered);
    } catch (error) {
      console.error('Error loading tasks:', error);
      res.status(500).json({ error: 'Failed to load tasks' });
    }
  });

  // GET /api/tasks/:id - Get single task
  app.get('/api/tasks/:id', async (req, res) => {
    try {
      const tasks = await loadTasks();
      const task = tasks.find(t => t.id === req.params.id);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      console.error('Error loading task:', error);
      res.status(500).json({ error: 'Failed to load task' });
    }
  });

  // POST /api/tasks - Create new task
  app.post('/api/tasks', async (req, res) => {
    try {
      const tasks = await loadTasks();
      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tasks.push(newTask);
      await saveTasks(tasks);
      res.json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  // POST /api/tasks/:id - Update task
  app.post('/api/tasks/:id', async (req, res) => {
    try {
      const tasks = await loadTasks();
      const index = tasks.findIndex(t => t.id === req.params.id);
      if (index >= 0) {
        tasks[index] = {
          ...tasks[index],
          ...req.body,
          updatedAt: new Date().toISOString(),
        };
        await saveTasks(tasks);
        res.json(tasks[index]);
      } else {
        res.status(404).json({ error: 'Task not found' });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  // POST /api/tasks/:id/delete - Delete task
  app.post('/api/tasks/:id/delete', async (req, res) => {
    try {
      const tasks = await loadTasks();
      const filtered = tasks.filter(t => t.id !== req.params.id);
      await saveTasks(filtered);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });
}

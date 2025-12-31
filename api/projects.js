/**
 * Projects API Route
 * Project management endpoints
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
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

// Projects API Routes
export async function projectsRoutes(app) {
  // GET /api/projects - Get all projects with optional filters
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = await loadProjects();
      let filtered = [...projects];

      // Apply filters
      if (req.query.status) {
        const statuses = req.query.status.split(',');
        filtered = filtered.filter(p => statuses.includes(p.status));
      }
      if (req.query.owner) {
        filtered = filtered.filter(p => p.owner?.id === req.query.owner);
      }
      if (req.query.departmentId) {
        filtered = filtered.filter(p => p.departments.includes(req.query.departmentId));
      }

      res.json(filtered);
    } catch (error) {
      console.error('Error loading projects:', error);
      res.status(500).json({ error: 'Failed to load projects' });
    }
  });

  // GET /api/projects/:id - Get single project
  app.get('/api/projects/:id', async (req, res) => {
    try {
      const projects = await loadProjects();
      const project = projects.find(p => p.id === req.params.id);
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      console.error('Error loading project:', error);
      res.status(500).json({ error: 'Failed to load project' });
    }
  });

  // POST /api/projects - Create new project
  app.post('/api/projects', async (req, res) => {
    try {
      const projects = await loadProjects();
      const newProject = {
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        team: [],
        departments: [],
        sprints: [],
        milestones: [],
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      projects.push(newProject);
      await saveProjects(projects);
      res.json(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  // POST /api/projects/:id - Update project
  app.post('/api/projects/:id', async (req, res) => {
    try {
      const projects = await loadProjects();
      const index = projects.findIndex(p => p.id === req.params.id);
      if (index >= 0) {
        projects[index] = {
          ...projects[index],
          ...req.body,
          updatedAt: new Date().toISOString(),
        };
        await saveProjects(projects);
        res.json(projects[index]);
      } else {
        res.status(404).json({ error: 'Project not found' });
      }
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  // POST /api/projects/:id/delete - Delete project
  app.post('/api/projects/:id/delete', async (req, res) => {
    try {
      const projects = await loadProjects();
      const filtered = projects.filter(p => p.id !== req.params.id);
      await saveProjects(filtered);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });
}

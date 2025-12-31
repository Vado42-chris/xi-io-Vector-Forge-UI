/**
 * VectorForge Backend Server
 * Express server that serves the React app and provides AI API endpoints
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { promisify } from 'util';
import { exec } from 'child_process';
const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Export app for testing
export { app };

// Security Headers Middleware
app.use((req, res, next) => {
    // Content Security Policy
    const csp = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // 'unsafe-eval' needed for Vite in dev
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https: blob:",
        "font-src 'self' data:",
        "connect-src 'self' https: ws: wss:", // WebSocket for Vite HMR
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests"
    ].join('; ');

    res.setHeader('Content-Security-Policy', csp);
    
    // Other security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Remove server identification
    res.removeHeader('X-Powered-By');
    
    next();
});

// Serve static files from public directory FIRST (before other middleware)
app.use(express.static(join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes (must be before Vite middleware in dev)
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        service: 'VectorForge Backend',
        version: '1.0.0',
        xibalba: {
            mcpUrl: process.env.VITE_XIBALBA_MCP_URL || 'http://localhost:8000',
            connected: false
        }
    });
});

// Task Management API Routes
import { tasksRoutes } from './api/tasks.js';
import { sprintsRoutes } from './api/sprints.js';
import { projectsRoutes } from './api/projects.js';
import { fileSystemRoutes } from './api/filesystem.js';

await tasksRoutes(app);
await sprintsRoutes(app);
await projectsRoutes(app);
await fileSystemRoutes(app);

// Proof/Signing API Routes
import { proofRoutes } from './api/proof.js';
await proofRoutes(app);

// AI Generation Endpoint
app.post('/api/ai/generate', async (req, res) => {
    try {
        const { prompt, style, currentSvg } = req.body;
        const xibalbaModule = await import('./services/xibalbaService.js');
        const { generateVectorData } = xibalbaModule;
        const result = await generateVectorData(prompt, style, currentSvg);
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.status(500).json({ success: false, error: 'Generation failed' });
        }
    } catch (error) {
        console.error('AI Generation Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Smart Suggestions Endpoint
app.post('/api/ai/suggestions', async (req, res) => {
    try {
        const { svg, selectedId } = req.body;
        const xibalbaModule = await import('./services/xibalbaService.js');
        const { getSmartSuggestions } = xibalbaModule;
        const suggestions = await getSmartSuggestions(svg, selectedId);
        res.json({ success: true, suggestions });
    } catch (error) {
        console.error('Suggestions Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Image to Vector Endpoint
app.post('/api/ai/image-to-vector', async (req, res) => {
    try {
        const { imageB64, prompt } = req.body;
        const xibalbaModule = await import('./services/xibalbaService.js');
        const { imageToVectorData } = xibalbaModule;
        const result = await imageToVectorData(imageB64, prompt);
        if (result) {
            res.json({ success: true, data: result });
        } else {
            res.status(500).json({ success: false, error: 'Conversion failed' });
        }
    } catch (error) {
        console.error('Image to Vector Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Terminal Command Execution Endpoint
app.post('/api/terminal/execute', async (req, res) => {
    try {
        const { command, args = [], workingDirectory, environment = {}, timeout = 30000 } = req.body;
        
        // Security: Block dangerous commands
        const dangerousPatterns = [
            /rm\s+-rf/, /rm\s+-\*rf/, /dd\s+if=/, /mkfs/, /fdisk/, /format/,
            />\s*\/dev/, /sudo\s+rm/, /sudo\s+dd/
        ];
        
        if (dangerousPatterns.some(pattern => pattern.test(command))) {
            return res.status(403).json({
                success: false,
                exitCode: -1,
                stdout: '',
                stderr: 'Command blocked by security policy',
                executionTime: 0,
                error: 'Dangerous command blocked'
            });
        }
        
        const startTime = Date.now();
        const cwd = workingDirectory || process.cwd();
        const env = { ...process.env, ...environment };
        
        const { stdout, stderr } = await Promise.race([
            execAsync(command, { cwd, env, timeout }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Command timeout')), timeout)
            )
        ]);
        
        res.json({
            success: true,
            exitCode: 0,
            stdout: stdout || '',
            stderr: stderr || '',
            executionTime: Date.now() - startTime
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            exitCode: -1,
            stdout: '',
            stderr: error.message || 'Command execution failed',
            executionTime: 0,
            error: error.message
        });
    }
});

// Initialize Vite and start server
async function start() {
    if (process.env.NODE_ENV !== 'production') {
        // Development: Use Vite middleware
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
        
        // CRITICAL: Block auth redirects - they're breaking the app
        // This handles browser extensions or service workers trying to redirect to auth
        app.get('/api/auth/*', (req, res) => {
            console.log('🚫 Blocked auth redirect attempt:', req.path);
            // Return 404 with helpful message instead of redirecting
            res.status(404).json({ 
                error: 'Auth endpoint not found',
                message: 'This application does not use authentication. If you see this, a browser extension or service worker may be redirecting you.',
                redirect: false
            });
        });
        
        // Also block POST requests to auth endpoints
        app.post('/api/auth/*', (req, res) => {
            console.log('🚫 Blocked auth POST attempt:', req.path);
            res.status(404).json({ 
                error: 'Auth endpoint not found',
                message: 'This application does not use authentication.',
                redirect: false
            });
        });
        
        // Fallback for SPA routing
        app.get('*', (req, res, next) => {
            // Let Vite handle all routes
            next();
        });
    } else {
        // Production: Serve static files
        app.use(express.static(join(__dirname, 'dist')));
        app.get('*', (req, res) => {
            res.sendFile(join(__dirname, 'dist', 'index.html'));
        });
    }
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`╔═══════════════════════════════════════════════════════════╗`);
        console.log(`║     VectorForge Backend Server                          ║`);
        console.log(`╚═══════════════════════════════════════════════════════════╝`);
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📡 API endpoints available at /api/*`);
        console.log(`🔗 Xibalba MCP: ${process.env.VITE_XIBALBA_MCP_URL || 'http://localhost:8000'}`);
        console.log(``);
    });
}

start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

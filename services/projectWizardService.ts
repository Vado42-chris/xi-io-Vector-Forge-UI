/**
 * Project Wizard Service
 * Backend service for Project Wizard operations
 * 
 * #hashtag: project-wizard service
 */

import { FileSystemClient } from './fileSystemClient';

export interface ProjectConfig {
  name: string;
  type: 'react' | 'node' | 'typescript' | 'vanilla' | 'custom';
  location: string;
  template?: string;
  features: string[];
}

class ProjectWizardService {
  private fileSystem: FileSystemClient;

  constructor() {
    this.fileSystem = new FileSystemClient();
  }

  /**
   * Create project structure
   */
  async createProject(
    config: ProjectConfig,
    onProgress?: (progress: number, message: string) => void
  ): Promise<string> {
    // Ensure project is created in an allowed path (projects/ or test-projects/)
    // If user specified a custom location, validate it's in an allowed path
    let baseLocation = config.location;
    if (baseLocation === '.' || !baseLocation.startsWith('projects/') && !baseLocation.startsWith('test-projects/')) {
      // Default to projects/ directory
      baseLocation = 'projects';
    }
    
    const projectPath = `${baseLocation}/${config.name}`;
    
    try {
      // Create project directory
      onProgress?.(10, 'Creating project directory...');
      await this.fileSystem.createDirectory(projectPath);
      
      // Create subdirectories based on project type
      onProgress?.(20, 'Creating project structure...');
      await this.createProjectStructure(projectPath, config);
      
      // Generate initial files
      onProgress?.(50, 'Generating initial files...');
      await this.generateInitialFiles(projectPath, config);
      
      // Add features
      onProgress?.(80, 'Adding features...');
      await this.addFeatures(projectPath, config.features);
      
      onProgress?.(100, 'Project created successfully!');
      return projectPath;
    } catch (error) {
      throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create project directory structure
   */
  private async createProjectStructure(projectPath: string, config: ProjectConfig): Promise<void> {
    const dirs = ['src'];
    
    if (config.type === 'react') {
      dirs.push('src/components', 'src/hooks', 'src/services', 'public');
    } else if (config.type === 'node') {
      dirs.push('src', 'lib', 'tests');
    } else if (config.type === 'typescript') {
      dirs.push('src', 'dist', 'tests');
    }
    
    for (const dir of dirs) {
      await this.fileSystem.createDirectory(`${projectPath}/${dir}`);
    }
  }

  /**
   * Generate initial files
   */
  private async generateInitialFiles(projectPath: string, config: ProjectConfig): Promise<void> {
    // Generate README.md
    const readme = this.generateReadme(config);
    await this.fileSystem.writeFile(`${projectPath}/README.md`, readme);
    
    // Generate package.json if Node.js project
    if (config.type === 'react' || config.type === 'node' || config.type === 'typescript') {
      const packageJson = this.generatePackageJson(config);
      await this.fileSystem.writeFile(`${projectPath}/package.json`, packageJson);
    }
    
    // Generate .gitignore
    const gitignore = this.generateGitignore(config);
    await this.fileSystem.writeFile(`${projectPath}/.gitignore`, gitignore);
  }

  /**
   * Add features to project
   */
  private async addFeatures(projectPath: string, features: string[]): Promise<void> {
    if (features.includes('typescript')) {
      const tsconfig = this.generateTsConfig();
      await this.fileSystem.writeFile(`${projectPath}/tsconfig.json`, tsconfig);
    }
    
    if (features.includes('testing')) {
      await this.fileSystem.createDirectory(`${projectPath}/tests`);
      const testConfig = this.generateTestConfig();
      await this.fileSystem.writeFile(`${projectPath}/jest.config.js`, testConfig);
    }
    
    if (features.includes('linting')) {
      const eslintConfig = this.generateEslintConfig();
      await this.fileSystem.writeFile(`${projectPath}/.eslintrc.json`, eslintConfig);
    }
  }

  /**
   * Generate README.md content
   */
  private generateReadme(config: ProjectConfig): string {
    return `# ${config.name}

${config.type === 'react' ? 'React' : config.type === 'node' ? 'Node.js' : config.type === 'typescript' ? 'TypeScript' : 'Custom'} project

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

## Features

${config.features.map(f => `- ${f}`).join('\n')}
`;
  }

  /**
   * Generate package.json content
   */
  private generatePackageJson(config: ProjectConfig): string {
    const packageJson: any = {
      name: config.name,
      version: '1.0.0',
      description: '',
      main: config.type === 'react' ? 'src/index.tsx' : 'src/index.js',
      scripts: {
        start: config.type === 'react' ? 'vite' : 'node src/index.js',
        build: config.type === 'react' ? 'vite build' : 'tsc',
      },
    };
    
    if (config.features.includes('testing')) {
      packageJson.scripts.test = 'jest';
    }
    
    return JSON.stringify(packageJson, null, 2);
  }

  /**
   * Generate .gitignore content
   */
  private generateGitignore(config: ProjectConfig): string {
    return `node_modules/
dist/
build/
*.log
.env
.DS_Store
`;
  }

  /**
   * Generate tsconfig.json content
   */
  private generateTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'ESNext',
        lib: ['ES2020', 'DOM'],
        jsx: 'react',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
      },
    }, null, 2);
  }

  /**
   * Generate Jest config
   */
  private generateTestConfig(): string {
    return `module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
};
`;
  }

  /**
   * Generate ESLint config
   */
  private generateEslintConfig(): string {
    return JSON.stringify({
      extends: ['eslint:recommended'],
      env: {
        node: true,
        es2020: true,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    }, null, 2);
  }

  /**
   * Validate project name
   */
  validateProjectName(name: string): { valid: boolean; error?: string } {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Project name is required' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      return { valid: false, error: 'Project name can only contain letters, numbers, hyphens, and underscores' };
    }
    return { valid: true };
  }

  /**
   * Get available project types
   */
  getProjectTypes(): Array<{ value: string; label: string; description: string }> {
    return [
      { value: 'react', label: 'React App', description: 'Create a React application' },
      { value: 'node', label: 'Node.js', description: 'Create a Node.js project' },
      { value: 'typescript', label: 'TypeScript', description: 'Create a TypeScript project' },
      { value: 'vanilla', label: 'Vanilla JS', description: 'Create a vanilla JavaScript project' },
      { value: 'custom', label: 'Custom', description: 'Create a custom project structure' },
    ];
  }

  /**
   * Get available features
   */
  getAvailableFeatures(): Array<{ id: string; label: string; description: string }> {
    return [
      { id: 'typescript', label: 'TypeScript', description: 'Add TypeScript support' },
      { id: 'testing', label: 'Testing', description: 'Add Jest and testing setup' },
      { id: 'linting', label: 'Linting', description: 'Add ESLint and Prettier' },
      { id: 'git', label: 'Git', description: 'Initialize Git repository' },
    ];
  }
}

export const projectWizardService = new ProjectWizardService();


/**
 * Schema Builder Service
 * Schema generation from visual form
 * 
 * #hashtag: schema-builder service
 */

import { FileSystemClient } from './fileSystemClient';

export interface SchemaField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
  defaultValue?: any;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface SchemaConfig {
  name: string;
  fields: SchemaField[];
}

export type ExportFormat = 'json-schema' | 'typescript' | 'zod';

class SchemaBuilderService {
  private fileSystem: FileSystemClient;

  constructor() {
    this.fileSystem = new FileSystemClient();
  }

  /**
   * Generate JSON Schema from config
   */
  generateSchema(config: SchemaConfig): any {
    const schema: any = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      title: config.name,
      properties: {},
      required: [],
    };

    config.fields.forEach((field) => {
      schema.properties[field.name] = {
        type: field.type,
        description: field.description || '',
      };

      if (field.type === 'number') {
        if (field.min !== undefined) {
          schema.properties[field.name].minimum = field.min;
        }
        if (field.max !== undefined) {
          schema.properties[field.name].maximum = field.max;
        }
      }

      if (field.type === 'string' && field.pattern) {
        schema.properties[field.name].pattern = field.pattern;
      }

      if (field.required) {
        schema.required.push(field.name);
      }
    });

    return schema;
  }

  /**
   * Validate schema
   */
  validateSchema(schema: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schema.title) {
      errors.push('Schema title is required');
    }

    if (!schema.properties || Object.keys(schema.properties).length === 0) {
      errors.push('Schema must have at least one property');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convert JSON Schema to TypeScript interface
   */
  private generateTypeScript(schema: any): string {
    const interfaceName = schema.title?.replace(/\s+/g, '') || 'Schema';
    let content = `export interface ${interfaceName} {\n`;

    Object.entries(schema.properties || {}).forEach(([name, prop]: [string, any]) => {
      const isRequired = schema.required?.includes(name);
      const optional = isRequired ? '' : '?';
      const type = this.jsonSchemaTypeToTypeScript(prop.type);
      const description = prop.description ? ` // ${prop.description}` : '';
      content += `  ${name}${optional}: ${type};${description}\n`;
    });

    content += `}\n`;
    return content;
  }

  /**
   * Convert JSON Schema type to TypeScript type
   */
  private jsonSchemaTypeToTypeScript(type: string): string {
    switch (type) {
      case 'string':
        return 'string';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        return 'any[]';
      case 'object':
        return 'Record<string, any>';
      default:
        return 'any';
    }
  }

  /**
   * Convert JSON Schema to Zod schema
   */
  private generateZod(schema: any): string {
    let content = `import { z } from 'zod';\n\n`;
    content += `export const ${schema.title?.replace(/\s+/g, '') || 'schema'}Schema = z.object({\n`;

    Object.entries(schema.properties || {}).forEach(([name, prop]: [string, any]) => {
      const isRequired = schema.required?.includes(name);
      let zodType = this.jsonSchemaTypeToZod(prop);
      if (!isRequired) {
        zodType += '.optional()';
      }
      const description = prop.description ? ` // ${prop.description}` : '';
      content += `  ${name}: ${zodType},${description}\n`;
    });

    content += `});\n\n`;
    content += `export type ${schema.title?.replace(/\s+/g, '') || 'Schema'} = z.infer<typeof ${schema.title?.replace(/\s+/g, '') || 'schema'}Schema>;\n`;
    return content;
  }

  /**
   * Convert JSON Schema property to Zod type
   */
  private jsonSchemaTypeToZod(prop: any): string {
    let zodType = '';
    
    switch (prop.type) {
      case 'string':
        zodType = 'z.string()';
        if (prop.pattern) {
          zodType += `.regex(/${prop.pattern}/)`;
        }
        break;
      case 'number':
        zodType = 'z.number()';
        if (prop.minimum !== undefined) {
          zodType += `.min(${prop.minimum})`;
        }
        if (prop.maximum !== undefined) {
          zodType += `.max(${prop.maximum})`;
        }
        break;
      case 'boolean':
        zodType = 'z.boolean()';
        break;
      case 'array':
        zodType = 'z.array(z.any())';
        break;
      case 'object':
        zodType = 'z.record(z.any())';
        break;
      default:
        zodType = 'z.any()';
    }
    
    return zodType;
  }

  /**
   * Export schema to file in specified format
   */
  async exportSchema(
    schema: any,
    filePath: string,
    format: ExportFormat = 'json-schema',
    onProgress?: (progress: number, message: string) => void
  ): Promise<void> {
    onProgress?.(10, `Generating ${format} schema...`);

    let content = '';
    let extension = '';

    switch (format) {
      case 'json-schema':
        content = JSON.stringify(schema, null, 2);
        extension = '.json';
        break;
      case 'typescript':
        content = this.generateTypeScript(schema);
        extension = '.ts';
        break;
      case 'zod':
        content = this.generateZod(schema);
        extension = '.ts';
        break;
    }

    onProgress?.(50, `Writing schema to file...`);

    // Ensure file path has correct extension
    const finalPath = filePath.endsWith(extension) ? filePath : `${filePath}${extension}`;

    await this.fileSystem.writeFile(finalPath, content);

    onProgress?.(100, `Schema exported successfully: ${finalPath}`);
  }

  /**
   * Export schema in multiple formats
   */
  async exportSchemaMultiple(
    schema: any,
    basePath: string,
    formats: ExportFormat[] = ['json-schema', 'typescript', 'zod'],
    onProgress?: (progress: number, message: string) => void
  ): Promise<string[]> {
    const exportedFiles: string[] = [];
    const total = formats.length;

    for (let i = 0; i < formats.length; i++) {
      const format = formats[i];
      const formatPath = `${basePath}.${format}`;
      
      await this.exportSchema(
        schema,
        formatPath,
        format,
        (progress, message) => {
          const overallProgress = ((i / total) * 100) + (progress / total);
          onProgress?.(overallProgress, message);
        }
      );
      
      exportedFiles.push(formatPath);
    }

    return exportedFiles;
  }
}

export const schemaBuilderService = new SchemaBuilderService();


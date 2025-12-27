// services/reportService.ts

/**
 * @module ReportService
 * @description
 * Generates comprehensive reports that include patent tracking and click tracking
 * as required by project approval.
 * 
 * Date: December 27, 2025
 * Approved By: Chris Hallberg, CEO, Xibalba Mixed Media Studio
 */

import { patentTrackingService } from './patentTrackingService';
import { clickTrackingService } from './clickTrackingService';
import { changeLogService } from './changeLogService';
import { taskManagementService } from './taskManagementService';

export interface ProjectReport {
  date: string;
  version: string;
  summary: string;
  components: Array<{
    name: string;
    status: 'completed' | 'in-progress' | 'pending';
    description: string;
  }>;
  patents: string; // Patent tracking report
  clicks: string; // Click tracking report
  changelog: string;
  tasks: {
    total: number;
    byStatus: Record<string, number>;
  };
  nextSteps: string[];
}

export class ReportService {
  /**
   * Generates a comprehensive project report including all required tracking.
   * @param summary Optional summary text.
   * @returns Complete project report.
   */
  public async generateProjectReport(summary?: string): Promise<ProjectReport> {
    const version = changeLogService.getLatestVersion();
    const allTasks = await taskManagementService.getTasks();
    const tasksByStatus = allTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const changelogEntries = changeLogService.getEntries().slice(0, 20);

    return {
      date: new Date().toISOString(),
      version,
      summary: summary || 'VectorForge UI/UX Implementation Progress Report',
      components: [
        {
          name: 'Action Center',
          status: 'in-progress',
          description: 'Single most actionable item component',
        },
        {
          name: 'SprintBoard',
          status: 'in-progress',
          description: 'Kanban board for sprint management',
        },
        {
          name: 'TaskCard',
          status: 'pending',
          description: 'Task representation component',
        },
        {
          name: 'InspectorPanel',
          status: 'pending',
          description: 'Detailed metadata inspector',
        },
      ],
      patents: patentTrackingService.generatePatentReport(),
      clicks: clickTrackingService.generateClickReport(),
      changelog: `
=== CHANGE LOG (Last 20 Entries) ===
${changelogEntries.map(entry => 
  `[${entry.date}] ${entry.type}: ${entry.description}`
).join('\n')}
=== END CHANGE LOG ===
      `.trim(),
      tasks: {
        total: allTasks.length,
        byStatus: tasksByStatus,
      },
      nextSteps: [
        'Complete Action Center component',
        'Integrate SprintBoard with new API',
        'Implement TaskCard component',
        'Add InspectorPanel component',
      ],
    };
  }

  /**
   * Formats a project report as a readable string.
   * @param report The report to format.
   * @returns Formatted report string.
   */
  public formatReport(report: ProjectReport): string {
    return `
================================================================================
VECTORFORGE PROJECT REPORT
================================================================================
Date: ${new Date(report.date).toLocaleString()}
Version: ${report.version}

SUMMARY
--------------------------------------------------------------------------------
${report.summary}

COMPONENTS STATUS
--------------------------------------------------------------------------------
${report.components.map(c => 
  `[${c.status.toUpperCase()}] ${c.name}: ${c.description}`
).join('\n')}

TASKS STATUS
--------------------------------------------------------------------------------
Total Tasks: ${report.tasks.total}
By Status:
${Object.entries(report.tasks.byStatus).map(([status, count]) => 
  `  ${status}: ${count}`
).join('\n')}

${report.patents}

${report.clicks}

${report.changelog}

NEXT STEPS
--------------------------------------------------------------------------------
${report.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

================================================================================
END REPORT
================================================================================
    `.trim();
  }

  /**
   * Exports a report to a file (for download or storage).
   * @param report The report to export.
   * @returns Blob containing the report.
   */
  public exportReport(report: ProjectReport): Blob {
    const content = this.formatReport(report);
    return new Blob([content], { type: 'text/plain' });
  }
}

export const reportService = new ReportService();


#!/usr/bin/env node
/**
 * Progress tracking for hotfix verification
 * Shows progress bars and status updates
 */

const readline = require('readline');

class ProgressTracker {
  constructor(totalSteps) {
    this.totalSteps = totalSteps;
    this.currentStep = 0;
    this.startTime = Date.now();
  }

  update(message, status = 'working') {
    this.currentStep++;
    const percent = Math.round((this.currentStep / this.totalSteps) * 100);
    const barLength = 30;
    const filled = Math.round((percent / 100) * barLength);
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
    
    const statusIcon = {
      'working': '⏳',
      'success': '✅',
      'error': '❌',
      'info': 'ℹ️'
    }[status] || '⏳';
    
    process.stdout.write(`\r${statusIcon} [${bar}] ${percent}% - ${message}`);
    
    if (this.currentStep >= this.totalSteps) {
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);
      console.log(`\n✅ Complete in ${elapsed}s`);
    }
  }
}

module.exports = { ProgressTracker };


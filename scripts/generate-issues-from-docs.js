#!/usr/bin/env node
/**
 * Auto-Issue Generation Script
 * Reads documentation and creates GitHub issues for tracked items
 * 
 * #hashtag: automation issue-generation documentation
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function parseDocumentationGaps() {
  const filePath = join(projectRoot, 'docs/DOCUMENTATION_GAPS_AND_IMPROVEMENTS.md');
  const content = readFileSync(filePath, 'utf-8');
  
  const issues = [];
  
  // Parse "Missing Critical Docs" section
  const criticalDocsMatch = content.match(/### \d+\. (.*?)\n\*\*Status:\*\* ❌ Missing/g);
  if (criticalDocsMatch) {
    criticalDocsMatch.forEach((match, index) => {
      const title = match.replace(/### \d+\. /, '').replace(/\n\*\*Status:\*\* ❌ Missing/, '');
      issues.push({
        title: `Documentation: ${title}`,
        type: 'documentation',
        priority: 'P0',
        source: 'DOCUMENTATION_GAPS_AND_IMPROVEMENTS.md',
      });
    });
  }
  
  // Parse "Missing Important Docs" section
  const importantDocsMatch = content.match(/### \d+\. (.*?)\n\*\*Status:\*\* ❌ Missing/g);
  if (importantDocsMatch) {
    importantDocsMatch.forEach((match) => {
      const title = match.replace(/### \d+\. /, '').replace(/\n\*\*Status:\*\* ❌ Missing/, '');
      issues.push({
        title: `Documentation: ${title}`,
        type: 'documentation',
        priority: 'P1',
        source: 'DOCUMENTATION_GAPS_AND_IMPROVEMENTS.md',
      });
    });
  }
  
  return issues;
}

function parseToolStandardization() {
  const filePath = join(projectRoot, 'docs/TOOL_STANDARDIZATION.md');
  const content = readFileSync(filePath, 'utf-8');
  
  const issues = [];
  
  // Parse "Standardization Work Required" section
  const workMatch = content.match(/### Priority \d+: (.*?)\n\*\*Work:\*\*\n((?:- \[ \].*?\n)+)/gs);
  if (workMatch) {
    workMatch.forEach((match) => {
      const titleMatch = match.match(/### Priority \d+: (.*?)\n/);
      const workItemsMatch = match.match(/- \[ \] (.*?)\n/g);
      
      if (titleMatch) {
        const title = titleMatch[1];
        const estimateMatch = match.match(/\*\*Estimate:\*\* (.*?)\n/);
        const estimate = estimateMatch ? estimateMatch[1] : 'TBD';
        
        issues.push({
          title: `Tool Standardization: ${title}`,
          type: 'feature',
          priority: title.includes('Priority 1') ? 'P0' : title.includes('Priority 2') ? 'P1' : 'P2',
          estimate,
          source: 'TOOL_STANDARDIZATION.md',
          workItems: workItemsMatch ? workItemsMatch.map(item => item.replace('- [ ] ', '').trim()) : [],
        });
      }
    });
  }
  
  return issues;
}

function generateIssueMarkdown(issue) {
  return `# ${issue.title}

**Type:** ${issue.type}  
**Priority:** ${issue.priority}  
**Source:** ${issue.source}  
${issue.estimate ? `**Estimate:** ${issue.estimate}` : ''}

## Description

Auto-generated from documentation: \`${issue.source}\`

## Acceptance Criteria

${issue.workItems && issue.workItems.length > 0 
  ? issue.workItems.map(item => `- [ ] ${item}`).join('\n')
  : '- [ ] Complete implementation\n- [ ] Add tests\n- [ ] Update documentation'}

## Related Documentation

- See \`docs/${issue.source}\` for full context

## Notes

This issue was auto-generated. Please review and update as needed.

---
**Auto-generated:** ${new Date().toISOString()}
`;
}

function main() {
  console.log('📋 Generating issues from documentation...\n');
  
  const docGaps = parseDocumentationGaps();
  const toolStandardization = parseToolStandardization();
  
  const allIssues = [...docGaps, ...toolStandardization];
  
  console.log(`Found ${allIssues.length} items to track:\n`);
  
  // Create issues directory if it doesn't exist
  const issuesDir = join(projectRoot, 'issues');
  try {
    require('fs').mkdirSync(issuesDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  // Generate issue files
  allIssues.forEach((issue, index) => {
    const fileName = `issue-${issue.type}-${index + 1}.md`;
    const filePath = join(issuesDir, fileName);
    const content = generateIssueMarkdown(issue);
    
    require('fs').writeFileSync(filePath, content);
    console.log(`✅ Created: ${fileName}`);
    console.log(`   ${issue.title} (${issue.priority})`);
  });
  
  console.log(`\n📝 Generated ${allIssues.length} issue files in issues/ directory`);
  console.log('\n💡 Next steps:');
  console.log('   1. Review generated issues');
  console.log('   2. Create GitHub issues from these files');
  console.log('   3. Link issues to project board');
  console.log('   4. Update documentation as issues are completed\n');
}

main();


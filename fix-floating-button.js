// Temporary script to fix FloatingDevChatButton removal
// This will be run manually to fix the issue

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'App.hardened.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Remove FloatingDevChatButton usage
content = content.replace(
  /{\/\* Floating Dev Chat Button - Always Visible \*\/}\s*<ErrorBoundary>\s*<FloatingDevChatButton[\s\S]*?<\/ErrorBoundary>/,
  '{/* Floating Dev Chat Button removed - Dev Chat accessible via Right Sidebar (Ctrl+K) */}'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed FloatingDevChatButton removal');


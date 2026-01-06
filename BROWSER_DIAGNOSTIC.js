// PASTE THIS IN BROWSER CONSOLE (F12 → Console tab)
// This will tell you EXACTLY what's being served

console.log('=== BROWSER DIAGNOSTIC ===\n');

// 1. Check if cache-bust messages exist
console.log('1. Checking for cache-bust messages...');
const logs = [];
const originalLog = console.log;
console.log = function(...args) {
  logs.push(args.join(' '));
  originalLog.apply(console, args);
};

// Wait a moment for app to load
setTimeout(() => {
  const hasMountMessage = logs.some(log => log.includes('MOUNTING APP'));
  const hasRenderMessage = logs.some(log => log.includes('App.hardened RENDERING'));
  
  console.log('   Mount message found:', hasMountMessage);
  console.log('   Render message found:', hasRenderMessage);
  
  if (!hasMountMessage || !hasRenderMessage) {
    console.error('   ❌ CACHE-BUST MESSAGES NOT FOUND - BROWSER IS SERVING CACHED FILES!');
  } else {
    console.log('   ✅ Cache-bust messages found - files are fresh');
  }
  
  // 2. Check service workers
  console.log('\n2. Checking service workers...');
  navigator.serviceWorker.getRegistrations().then(regs => {
    console.log('   Service workers:', regs.length);
    if (regs.length > 0) {
      console.error('   ❌ SERVICE WORKER FOUND - This is caching your files!');
      console.log('   Unregistering...');
      regs.forEach(reg => reg.unregister());
    } else {
      console.log('   ✅ No service workers');
    }
  });
  
  // 3. Check which files loaded
  console.log('\n3. Checking loaded files...');
  const resources = performance.getEntriesByType('resource')
    .filter(r => r.name.includes('App') || r.name.includes('index') || r.name.includes('.js'))
    .slice(0, 10);
  
  resources.forEach(r => {
    const cached = r.transferSize === 0;
    console.log(`   ${r.name.split('/').pop()}: ${cached ? '❌ CACHED' : '✅ FRESH'} (${r.transferSize} bytes)`);
  });
  
  // 4. Check ErrorBoundary count
  console.log('\n4. Checking ErrorBoundary count...');
  const errorBoundaries = document.querySelectorAll('[style*="z-index: 99999"], [style*="zIndex: 99999"]');
  console.log('   ErrorBoundary overlays found:', errorBoundaries.length);
  if (errorBoundaries.length > 0) {
    console.error('   ❌ ERRORBOUNDARY OVERLAYS FOUND - Old code is running!');
  } else {
    console.log('   ✅ No ErrorBoundary overlays');
  }
  
  // 5. Check for StrictMode
  console.log('\n5. Checking React version...');
  const reactVersion = window.React?.version || 'unknown';
  console.log('   React version:', reactVersion);
  
  // 6. Check build timestamp
  console.log('\n6. Summary:');
  console.log('   If you see cache-bust messages → Files are fresh');
  console.log('   If you DON\'T see them → Browser is serving cached files');
  console.log('   Solution: Clear browser cache and hard refresh (Ctrl+Shift+R)');
  
}, 2000);



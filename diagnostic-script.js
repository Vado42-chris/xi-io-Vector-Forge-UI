// Diagnostic script to run in browser console
// Copy and paste this entire script into browser console (F12)

(function() {
  console.log('=== VectorForge Diagnostic Script ===');
  console.log('Timestamp:', new Date().toISOString());
  
  // 1. Check root element
  const root = document.getElementById('root');
  console.log('\n1. Root Element:');
  console.log('  - Exists:', !!root);
  console.log('  - Children count:', root?.children.length || 0);
  console.log('  - innerHTML length:', root?.innerHTML.length || 0);
  console.log('  - Computed display:', root ? getComputedStyle(root).display : 'N/A');
  console.log('  - Computed background:', root ? getComputedStyle(root).backgroundColor : 'N/A');
  
  // 2. Check for React
  console.log('\n2. React Check:');
  console.log('  - React in window:', typeof window.React !== 'undefined');
  console.log('  - ReactDOM in window:', typeof window.ReactDOM !== 'undefined');
  
  // 3. Check for data attributes
  console.log('\n3. Component Data Attributes:');
  console.log('  - Canvas area:', !!document.querySelector('[data-canvas-area="true"]'));
  console.log('  - Power toolbar:', !!document.querySelector('[data-power-toolbar="true"]'));
  console.log('  - Main content:', !!document.querySelector('[data-main-content-area="true"]'));
  console.log('  - Left sidebar:', !!document.querySelector('[data-sidebar-left-visible="true"]'));
  console.log('  - Right sidebar:', !!document.querySelector('[data-sidebar-right-visible="true"]'));
  
  // 4. Check for debug logs in console
  console.log('\n4. Debug Logs Check:');
  const logs = performance.getEntriesByType('resource').filter(r => r.name.includes('index') || r.name.includes('App.hardened'));
  console.log('  - JS files loaded:', logs.map(l => l.name.split('/').pop()));
  
  // 5. Check for errors
  console.log('\n5. Error Check:');
  const errorElements = document.querySelectorAll('.error-display, [class*="error"]');
  console.log('  - Error elements in DOM:', errorElements.length);
  if (errorElements.length > 0) {
    errorElements.forEach((el, i) => {
      console.log(`  - Error ${i + 1}:`, el.textContent.substring(0, 200));
    });
  }
  
  // 6. Check CSS variables
  console.log('\n6. CSS Variables Check:');
  if (root) {
    const styles = getComputedStyle(root);
    console.log('  - --xibalba-grey-000:', styles.getPropertyValue('--xibalba-grey-000'));
    console.log('  - --xibalba-text-000:', styles.getPropertyValue('--xibalba-text-000'));
  }
  
  // 7. Network status
  console.log('\n7. Network Status:');
  const nav = performance.getEntriesByType('navigation')[0];
  console.log('  - Page load type:', nav?.type);
  console.log('  - Load time:', nav?.loadEventEnd - nav?.fetchStart, 'ms');
  
  // 8. Summary
  console.log('\n=== SUMMARY ===');
  const summary = {
    rootExists: !!root,
    rootHasChildren: (root?.children.length || 0) > 0,
    reactLoaded: typeof window.React !== 'undefined',
    canvasAreaExists: !!document.querySelector('[data-canvas-area="true"]'),
    toolbarExists: !!document.querySelector('[data-power-toolbar="true"]'),
    hasErrors: errorElements.length > 0,
  };
  console.log(JSON.stringify(summary, null, 2));
  
  return summary;
})();


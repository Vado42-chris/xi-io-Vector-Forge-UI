/**
 * Black Box Diagnostic Script
 * Run this in browser console to identify what's covering the UI
 */

(function() {
  console.log('=== BLACK BOX DIAGNOSTIC ===\n');
  
  // 1. Find all fixed/absolute elements that cover the screen
  const allElements = Array.from(document.querySelectorAll('*'));
  const fixedElements = allElements.filter(el => {
    const styles = getComputedStyle(el);
    return (styles.position === 'fixed' || styles.position === 'absolute') && 
           el.offsetWidth > 0 && 
           el.offsetHeight > 0;
  });
  
  const screenCovering = fixedElements.map(el => {
    const styles = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const coversWidth = rect.width >= window.innerWidth * 0.9;
    const coversHeight = rect.height >= window.innerHeight * 0.9;
    const zIndex = parseInt(styles.zIndex) || 0;
    
    return {
      element: el,
      tag: el.tagName,
      id: el.id || '(no id)',
      classes: el.className || '(no classes)',
      zIndex: zIndex,
      position: styles.position,
      background: styles.backgroundColor,
      opacity: styles.opacity,
      visibility: styles.visibility,
      display: styles.display,
      dimensions: { width: rect.width, height: rect.height },
      location: { top: rect.top, left: rect.left },
      coversScreen: coversWidth && coversHeight,
      highZIndex: zIndex > 100,
    };
  }).filter(item => item.coversScreen || item.highZIndex);
  
  console.log('📦 Screen-Covering Elements:', screenCovering.length);
  screenCovering.forEach((item, i) => {
    console.log(`\n${i + 1}. ${item.tag}${item.id ? '#' + item.id : ''}${item.classes ? '.' + item.classes.split(' ').join('.') : ''}`);
    console.log(`   z-index: ${item.zIndex}, position: ${item.position}`);
    console.log(`   background: ${item.background}, opacity: ${item.opacity}`);
    console.log(`   dimensions: ${item.dimensions.width}px × ${item.dimensions.height}px`);
    console.log(`   covers screen: ${item.coversScreen}, high z-index: ${item.highZIndex}`);
  });
  
  // 2. Check for ErrorBoundary
  const errorBoundary = document.querySelector('[style*="z-index: 99999"], [style*="zIndex: 99999"]');
  if (errorBoundary) {
    console.log('\n🚨 ERRORBOUNDARY DETECTED - This is covering the UI!');
    console.log('Element:', errorBoundary);
    console.log('Error message:', errorBoundary.textContent?.substring(0, 200));
  } else {
    console.log('\n✅ No ErrorBoundary error screen detected');
  }
  
  // 3. Check canvas visibility
  const canvasArea = document.querySelector('[data-canvas-area="true"]');
  if (canvasArea) {
    const rect = canvasArea.getBoundingClientRect();
    const styles = getComputedStyle(canvasArea);
    console.log('\n🎨 Canvas Area Status:');
    console.log(`   Visible: ${rect.width > 0 && rect.height > 0 ? 'YES' : 'NO'}`);
    console.log(`   Dimensions: ${rect.width}px × ${rect.height}px`);
    console.log(`   z-index: ${styles.zIndex}`);
    console.log(`   position: ${styles.position}`);
    console.log(`   opacity: ${styles.opacity}`);
    console.log(`   visibility: ${styles.visibility}`);
    console.log(`   display: ${styles.display}`);
    console.log(`   background: ${styles.backgroundColor}`);
  } else {
    console.log('\n❌ Canvas area NOT FOUND in DOM');
  }
  
  // 4. Check for WelcomeScreen (should be removed)
  const welcomeScreen = document.querySelector('.welcome-screen-overlay, [class*="welcome"]');
  if (welcomeScreen) {
    console.log('\n⚠️ WELCOME SCREEN DETECTED (should be removed!)');
    console.log('Element:', welcomeScreen);
  } else {
    console.log('\n✅ No WelcomeScreen detected (good)');
  }
  
  // 5. Check texture-substrate
  const textureSubstrate = document.querySelector('.texture-substrate');
  if (textureSubstrate) {
    const styles = getComputedStyle(textureSubstrate);
    console.log('\n🎨 Texture Substrate:');
    console.log(`   z-index: ${styles.zIndex}`);
    console.log(`   position: ${styles.position}`);
    console.log(`   opacity: ${styles.opacity}`);
    if (parseInt(styles.zIndex) >= 0) {
      console.log('   ⚠️ WARNING: z-index is >= 0, should be -1');
    }
  }
  
  // 6. Find the topmost element at screen center
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const topElement = document.elementFromPoint(centerX, centerY);
  if (topElement) {
    const styles = getComputedStyle(topElement);
    console.log('\n🔍 Topmost Element at Screen Center:');
    console.log(`   Tag: ${topElement.tagName}`);
    console.log(`   ID: ${topElement.id || '(no id)'}`);
    console.log(`   Classes: ${topElement.className || '(no classes)'}`);
    console.log(`   z-index: ${styles.zIndex}`);
    console.log(`   background: ${styles.backgroundColor}`);
    console.log(`   Element:`, topElement);
  }
  
  // 7. Summary
  console.log('\n=== SUMMARY ===');
  if (errorBoundary) {
    console.log('❌ ErrorBoundary is covering the UI - check console for errors');
  } else if (screenCovering.length > 0) {
    const highestZ = screenCovering.sort((a, b) => b.zIndex - a.zIndex)[0];
    console.log(`⚠️ ${screenCovering.length} element(s) covering screen`);
    console.log(`   Highest z-index: ${highestZ.zIndex} (${highestZ.tag}${highestZ.id ? '#' + highestZ.id : ''})`);
  } else {
    console.log('✅ No obvious screen-covering elements found');
    console.log('   The black box may be a CSS issue or missing content');
  }
  
  return {
    screenCovering,
    errorBoundary: !!errorBoundary,
    canvasVisible: canvasArea ? (canvasArea.getBoundingClientRect().width > 0) : false,
    topElement: topElement ? {
      tag: topElement.tagName,
      id: topElement.id,
      classes: topElement.className,
      zIndex: getComputedStyle(topElement).zIndex,
    } : null,
  };
})();


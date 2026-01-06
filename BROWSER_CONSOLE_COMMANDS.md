# Browser Console Commands - Run These Now

## Quick DOM Check
Run this in the browser console (F12 → Console tab):

```javascript
(() => {
  const root = document.getElementById('root');
  const canvasArea = document.querySelector('[data-canvas-area="true"]');
  const canvas = canvasArea?.querySelector('.canvas-viewport') || canvasArea?.querySelector('[class*="canvas"]');
  
  const info = {
    rootExists: !!root,
    rootChildren: root?.children.length || 0,
    canvasAreaExists: !!canvasArea,
    canvasAreaStyles: canvasArea ? {
      display: getComputedStyle(canvasArea).display,
      visibility: getComputedStyle(canvasArea).visibility,
      opacity: getComputedStyle(canvasArea).opacity,
      width: getComputedStyle(canvasArea).width,
      height: getComputedStyle(canvasArea).height,
      zIndex: getComputedStyle(canvasArea).zIndex,
      position: getComputedStyle(canvasArea).position,
      backgroundColor: getComputedStyle(canvasArea).backgroundColor,
    } : null,
    canvasExists: !!canvas,
    canvasStyles: canvas ? {
      display: getComputedStyle(canvas).display,
      visibility: getComputedStyle(canvas).visibility,
      opacity: getComputedStyle(canvas).opacity,
      width: getComputedStyle(canvas).width,
      height: getComputedStyle(canvas).height,
      zIndex: getComputedStyle(canvas).zIndex,
      position: getComputedStyle(canvas).position,
      backgroundColor: getComputedStyle(canvas).backgroundColor,
    } : null,
    canvasViewport: !!document.querySelector('.canvas-viewport'),
    canvasGrid: !!document.querySelector('.canvas-grid-pattern'),
  };
  
  console.log('Canvas DOM Check:', JSON.stringify(info, null, 2));
  return info;
})();
```

## Check All Components
```javascript
console.log(JSON.stringify({
  root: !!document.getElementById('root'),
  rootChildren: document.getElementById('root')?.children.length,
  canvasArea: !!document.querySelector('[data-canvas-area="true"]'),
  toolbar: !!document.querySelector('[data-power-toolbar="true"]'),
  leftSidebar: !!document.querySelector('[data-left-sidebar="true"]'),
  rightSidebar: !!document.querySelector('[data-right-sidebar="true"]'),
  canvas: !!document.querySelector('.canvas-viewport'),
  grid: !!document.querySelector('.canvas-grid-pattern'),
  errors: performance.getEntriesByType('navigation')[0]?.type
}, null, 2));
```

## Find Hidden Elements
```javascript
const canvasArea = document.querySelector('[data-canvas-area="true"]');
if (canvasArea) {
  const styles = getComputedStyle(canvasArea);
  console.log('Canvas Area Styles:', {
    display: styles.display,
    visibility: styles.visibility,
    opacity: styles.opacity,
    width: styles.width,
    height: styles.height,
    zIndex: styles.zIndex,
    position: styles.position,
    backgroundColor: styles.backgroundColor,
  });
}
```


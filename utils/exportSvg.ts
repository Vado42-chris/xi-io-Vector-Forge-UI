// Quick export for SVG: finds first visible <svg> in DOM and downloads it
// Emergency implementation - will be replaced with proper export system

export function exportSVG(filename = 'vectorforge-export.svg') {
  const svg = document.querySelector('.canvas-svg-content svg') || document.querySelector('svg');
  
  if (!svg) {
    alert('❌ No SVG found');
    return;
  }

  const clone = svg.cloneNode(true) as SVGElement;
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert('✅ SVG exported');
}

export function exportDOMSvg(filename = 'vectorforge-export.svg'): boolean {
  try {
    // Try to find SVG in canvas area
    const canvasArea = document.querySelector('[data-canvas-area="true"]');
    const svgEl = canvasArea?.querySelector('svg') || document.querySelector('svg');
    
    if (!svgEl) {
      throw new Error('No SVG element found to export');
    }
    
    // Clone and inline styles if needed
    const clone = svgEl.cloneNode(true) as SVGElement;
    
    // Ensure viewBox is set
    if (!clone.getAttribute('viewBox') && clone.getAttribute('width') && clone.getAttribute('height')) {
      clone.setAttribute('viewBox', `0 0 ${clone.getAttribute('width')} ${clone.getAttribute('height')}`);
    }
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    
    // Add XML declaration
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const fullSvg = xmlHeader + svgString;
    
    const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Export SVG error:', error);
    return false;
  }
}

// Alternative: Export from state data
export function exportSvgFromData(svgString: string, filename = 'vectorforge-export.svg'): boolean {
  try {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const fullSvg = xmlHeader + svgString;
    
    const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Export SVG from data error:', error);
    return false;
  }
}


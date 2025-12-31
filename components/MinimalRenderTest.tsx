/**
 * Minimal Render Test Component
 * Used to isolate rendering issues by testing with minimal dependencies
 * 
 * #hashtag: debugging testing minimal-render
 */

import React from 'react';

const MinimalRenderTest: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-darkest text-white flex items-center justify-center text-2xl font-sans z-[99999]">
      <div>
        <h1>✅ React is Rendering</h1>
        <p>If you see this, React is working.</p>
        <p>Check console for errors.</p>
      </div>
    </div>
  );
};

export default MinimalRenderTest;


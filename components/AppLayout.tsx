/**
 * AppLayout - Master Template Component
 * Matches wireframe structure: Header | Left | Center (Canvas) | Right | Footer
 * Bottom drawer is fixed overlay (not in grid flow)
 * NO INLINE STYLES - Component-based platform
 */

import React from 'react';
import './app-layout.css';

interface AppLayoutProps {
  Header: React.ReactNode;
  Left: React.ReactNode;
  Center: React.ReactNode;
  Right: React.ReactNode;
  Footer?: React.ReactNode;
  BottomDrawer?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  Header,
  Left,
  Center,
  Right,
  Footer,
  BottomDrawer,
}) => {
  return (
    <div id="app-simple-root" className="app-layout-grid" data-app-root>
      {/* Header - Grid Row 1 */}
      <header className="app-header" role="banner">
        {Header}
      </header>

      {/* Main Content - Grid Row 2 */}
      <div className="app-main-content">
        {/* Left Sidebar - Grid Column 1 */}
        <aside className="app-left" aria-label="Tool Dock">
          {Left}
        </aside>

        {/* Center Canvas Area - Grid Column 2 */}
        <main className="app-center" aria-label="Canvas">
          <div className="app-canvas-area">
            {Center}
          </div>
        </main>

        {/* Right Sidebar - Grid Column 3 */}
        <aside className="app-right" aria-label="Right Drawer">
          {Right}
        </aside>
      </div>

      {/* Footer - Grid Row 3 */}
      <footer className="app-footer" aria-label="Bottom Toolbar">
        {Footer}
      </footer>

      {/* Bottom Drawer - Fixed Overlay (NOT in grid flow) */}
      {BottomDrawer && (
        <div className="app-bottom-drawer">
          {BottomDrawer}
        </div>
      )}
    </div>
  );
};

export default AppLayout;


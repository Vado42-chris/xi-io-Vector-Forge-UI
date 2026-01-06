/**
 * Library Panel - Flash-style Symbol System
 * Symbol-based workflow for reusable components
 */

import React, { useState } from 'react';
import './Library.css';

export interface Symbol {
  id: string;
  name: string;
  type: 'movieclip' | 'graphic' | 'button';
  svg?: string;
  createdAt: number;
}

export interface LibraryAsset {
  id: string;
  name: string;
  type: 'image' | 'audio' | 'video' | 'font';
  url?: string;
  data?: string;
}

interface LibraryProps {
  symbols: Symbol[];
  assets: LibraryAsset[];
  onConvertToSymbol: (name: string, type: Symbol['type']) => void;
  onEditSymbol: (symbolId: string) => void;
  onDragStart: (e: React.DragEvent, symbol: Symbol) => void;
  onCreateAsset: () => void;
}

const Library: React.FC<LibraryProps> = ({
  symbols,
  assets,
  onConvertToSymbol,
  onEditSymbol,
  onDragStart,
  onCreateAsset,
}) => {
  const [activeTab, setActiveTab] = useState<'symbols' | 'assets' | 'components'>('symbols');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSymbols = symbols.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssets = assets.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="library-panel">
      {/* Library Header */}
      <div className="library-header">
        <h3 className="library-title">Library</h3>
        <div className="library-tabs">
          <button
            className={activeTab === 'symbols' ? 'active' : ''}
            onClick={() => setActiveTab('symbols')}
            title="Symbols (F11)"
          >
            Symbols
          </button>
          <button
            className={activeTab === 'assets' ? 'active' : ''}
            onClick={() => setActiveTab('assets')}
            title="Assets"
          >
            Assets
          </button>
          <button
            className={activeTab === 'components' ? 'active' : ''}
            onClick={() => setActiveTab('components')}
            title="Components"
          >
            Components
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="library-search">
        <input
          type="text"
          placeholder="Search library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="library-search-input"
        />
      </div>

      {/* Library Content */}
      <div className="library-content">
        {activeTab === 'symbols' && (
          <div className="library-tree">
            <div className="library-folder">
              <div className="folder-header">
                <span>📁 Symbols</span>
                <button
                  onClick={() => {
                    const name = prompt('Symbol name:');
                    if (name) onConvertToSymbol(name, 'movieclip');
                  }}
                  title="New Symbol (F8)"
                  className="folder-action"
                >
                  +
                </button>
              </div>
              <div className="folder-content">
                {filteredSymbols.length === 0 ? (
                  <div className="library-empty">
                    No symbols yet. Create one by selecting objects and pressing F8.
                  </div>
                ) : (
                  filteredSymbols.map((symbol) => (
                    <div
                      key={symbol.id}
                      className="library-item"
                      draggable
                      onDragStart={(e) => onDragStart(e, symbol)}
                      onDoubleClick={() => onEditSymbol(symbol.id)}
                      title={`${symbol.name} (${symbol.type}) - Double-click to edit`}
                    >
                      <span className="library-item-icon">
                        {symbol.type === 'movieclip' ? '🎬' : symbol.type === 'button' ? '🔘' : '🖼️'}
                      </span>
                      <span className="library-item-name">{symbol.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="library-folder">
              <div className="folder-header">
                <span>📁 Components</span>
              </div>
              <div className="folder-content">
                <div className="library-empty">
                  Components coming soon
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="library-tree">
            <div className="library-folder">
              <div className="folder-header">
                <span>📁 Images</span>
                <button onClick={onCreateAsset} className="folder-action">+</button>
              </div>
              <div className="folder-content">
                {filteredAssets.filter(a => a.type === 'image').map((asset) => (
                  <div key={asset.id} className="library-item">
                    <span className="library-item-icon">🖼️</span>
                    <span className="library-item-name">{asset.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="library-folder">
              <div className="folder-header">
                <span>📁 Audio</span>
                <button onClick={onCreateAsset} className="folder-action">+</button>
              </div>
              <div className="folder-content">
                {filteredAssets.filter(a => a.type === 'audio').map((asset) => (
                  <div key={asset.id} className="library-item">
                    <span className="library-item-icon">🎵</span>
                    <span className="library-item-name">{asset.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="library-tree">
            <div className="library-empty">
              Component library coming soon
            </div>
          </div>
        )}
      </div>

      {/* Library Footer */}
      <div className="library-footer">
        <button
          onClick={() => {
            const name = prompt('Symbol name:');
            const type = prompt('Type (movieclip/graphic/button):', 'movieclip') as Symbol['type'];
            if (name && type) onConvertToSymbol(name, type);
          }}
          title="Convert to Symbol (F8)"
        >
          New Symbol
        </button>
        <button onClick={onCreateAsset}>Import Asset</button>
      </div>
    </div>
  );
};

export default Library;


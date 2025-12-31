/**
 * Registry Browser Component
 * Displays and searches the product registry
 * Allows users to discover components, services, and tools
 */

import React, { useState, useEffect, useMemo } from 'react';
import { productRegistry } from '../services/productRegistry';
import type { RegistryEntry, RegistrySearchOptions } from '../types/registry';

interface RegistryBrowserProps {
  onSelectEntry?: (entry: RegistryEntry) => void;
}

const RegistryBrowser: React.FC<RegistryBrowserProps> = ({ onSelectEntry }) => {
  const [entries, setEntries] = useState<RegistryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<RegistryEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRegistry = async () => {
      setLoading(true);
      await productRegistry.initialize();
      const allEntries = productRegistry.getAll();
      setEntries(allEntries);
      setLoading(false);
    };

    loadRegistry();
  }, []);

  // Filter entries
  const filteredEntries = useMemo(() => {
    const options: RegistrySearchOptions = {
      query: searchTerm || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      type: selectedType !== 'all' ? selectedType as RegistryEntry['type'] : undefined,
    };

    const result = productRegistry.search(options);
    return result.entries;
  }, [searchTerm, selectedCategory, selectedType]);

  // Get unique categories and types
  const categories = useMemo(() => {
    return productRegistry.getCategories();
  }, [entries]);

  const types = useMemo(() => {
    const typeSet = new Set<string>();
    entries.forEach(e => typeSet.add(e.type));
    return Array.from(typeSet);
  }, [entries]);

  const handleSelectEntry = (entry: RegistryEntry) => {
    setSelectedEntry(entry);
    if (onSelectEntry) {
      onSelectEntry(entry);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-[var(--xibalba-text-100)] text-sm">Loading registry...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--xibalba-bg-secondary)]">
      {/* Header */}
      <div className="xibalba-section-header-professional flex items-center justify-between shrink-0 px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">apps</span>
          <span className="text-xs font-black uppercase tracking-widest">Product Registry</span>
          <span className="text-sm text-[var(--xibalba-text-100)]">({entries.length})</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="shrink-0 p-4 border-b border-white/10 space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search components, services, tools..."
            className="w-full px-4 py-2 bg-[var(--xibalba-bg-tertiary)] border border-white/10 text-[var(--xibalba-text-primary)] text-xs focus:outline-none focus:border-[var(--xibalba-accent)]"
          />
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[var(--xibalba-text-100)] text-[16px] pointer-events-none">
            search
          </span>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-[var(--xibalba-bg-tertiary)] border border-white/10 text-[var(--xibalba-text-primary)] text-sm focus:outline-none focus:border-[var(--xibalba-accent)]"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 bg-[var(--xibalba-bg-tertiary)] border border-white/10 text-[var(--xibalba-text-primary)] text-sm focus:outline-none focus:border-[var(--xibalba-accent)]"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex min-h-0">
        {/* Entry List */}
        <div className="flex-1 overflow-y-auto xibalba-scrollbar border-r border-white/10">
          <div className="p-2 space-y-1">
            {filteredEntries.length === 0 ? (
              <div className="p-4 text-center text-[var(--xibalba-text-100)] text-xs">
                No entries found
              </div>
            ) : (
              filteredEntries.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => handleSelectEntry(entry)}
                  className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                    selectedEntry?.id === entry.id
                      ? 'bg-[var(--xibalba-bg-hover)] border-[var(--xibalba-accent)]'
                      : 'bg-[var(--xibalba-bg-tertiary)] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black text-[var(--xibalba-text-primary)] truncate">
                          {entry.name}
                        </span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          entry.type === 'service' ? 'bg-[var(--xibalba-accent)]/20 text-[var(--xibalba-accent)]' :
                          entry.type === 'component' ? 'bg-[var(--vectorforge-accent)]/20 text-[var(--vectorforge-accent)]' :
                          'bg-[var(--vectorforge-accent)]/20 text-[var(--vectorforge-accent)]'
                        }`}>
                          {entry.type}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--xibalba-text-100)] mb-1">
                        {entry.category}
                      </div>
                      <div className="text-xs text-[var(--xibalba-text-100)] line-clamp-2">
                        {entry.description}
                      </div>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-1.5 py-0.5 bg-[var(--xibalba-bg-secondary)] text-[var(--xibalba-text-100)] rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Entry Details */}
        {selectedEntry && (
          <div className="w-80 overflow-y-auto xibalba-scrollbar p-4 bg-[var(--xibalba-bg-tertiary)]">
            <div className="space-y-4">
              {/* Header */}
              <div>
                <h3 className="text-sm font-black text-[var(--xibalba-text-000)] mb-1">
                  {selectedEntry.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-[var(--xibalba-text-100)]">
                    {selectedEntry.category}
                  </span>
                  <span className="text-sm text-[var(--xibalba-text-100)]">
                    v{selectedEntry.version}
                  </span>
                </div>
                <p className="text-sm text-[var(--xibalba-text-100)] leading-relaxed">
                  {selectedEntry.description}
                </p>
              </div>

              {/* Type */}
              <div>
                <div className="text-xs font-black text-[var(--xibalba-text-100)] uppercase tracking-widest mb-1">
                  Type
                </div>
                <div className="text-sm px-2 py-1 rounded inline-block bg-[var(--xibalba-accent)]/20 text-[var(--xibalba-accent)]">
                  {selectedEntry.type}
                </div>
              </div>

              {/* File Path */}
              <div>
                <div className="text-xs font-black text-[var(--xibalba-text-100)] uppercase tracking-widest mb-1">
                  File Path
                </div>
                <div className="text-sm text-[var(--xibalba-text-primary)] font-mono">
                  {selectedEntry.filePath}
                </div>
              </div>

              {/* Tags */}
              {selectedEntry.tags.length > 0 && (
                <div>
                  <div className="text-xs font-black text-[var(--xibalba-text-100)] uppercase tracking-widest mb-1">
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedEntry.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-[var(--xibalba-bg-secondary)] text-[var(--xibalba-text-primary)] rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dependencies */}
              {selectedEntry.dependencies.length > 0 && (
                <div>
                  <div className="text-xs font-black text-[var(--xibalba-text-100)] uppercase tracking-widest mb-1">
                    Dependencies
                  </div>
                  <div className="space-y-1">
                    {selectedEntry.dependencies.map(depId => {
                      const dep = productRegistry.get(depId);
                      return (
                        <div key={depId} className="text-sm text-[var(--xibalba-text-primary)]">
                          {dep ? dep.name : depId}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Exports */}
              {selectedEntry.exports.length > 0 && (
                <div>
                  <div className="text-xs font-black text-[var(--xibalba-text-100)] uppercase tracking-widest mb-1">
                    Exports
                  </div>
                  <div className="space-y-1">
                    {selectedEntry.exports.map(exp => (
                      <div key={exp} className="text-sm text-[var(--xibalba-text-primary)] font-mono">
                        {exp}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistryBrowser;


/**
 * Marketplace Publisher Dashboard Component
 * Allows users to create, manage, and publish marketplace items
 * 
 * #hashtag: marketplace publisher-dashboard component
 */

import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { marketplacePublisherService, MarketplaceItem, PublishingRequest } from '../services/marketplacePublisherService';
import { userProfileService } from '../services/userProfileService';

interface MarketplacePublisherDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const MarketplacePublisherDashboard: React.FC<MarketplacePublisherDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'drafts' | 'pending' | 'published' | 'create'>('drafts');
  const [drafts, setDrafts] = useState<MarketplaceItem[]>([]);
  const [pending, setPending] = useState<MarketplaceItem[]>([]);
  const [published, setPublished] = useState<MarketplaceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [canPublish, setCanPublish] = useState({ allowed: false, reason: '' });

  // Form state for creating new item
  const [formData, setFormData] = useState({
    type: 'template' as 'template' | 'plugin' | 'asset' | 'tutorial',
    title: '',
    description: '',
    version: '1.0.0',
    price: 0,
    category: '',
    tags: [] as string[],
    tagInput: '',
    license: 'MIT',
    compatibility: [] as string[],
  });

  useEffect(() => {
    if (isOpen) {
      loadItems();
      checkPublishPermission();
    }
  }, [isOpen]);

  const loadItems = () => {
    setDrafts(marketplacePublisherService.getUserDrafts());
    setPending(marketplacePublisherService.getUserPending());
    setPublished(marketplacePublisherService.getUserItems());
  };

  const checkPublishPermission = () => {
    const result = marketplacePublisherService.canPublish();
    setCanPublish({ allowed: result.allowed, reason: result.reason || '' });
  };

  const handleCreateDraft = () => {
    const profile = userProfileService.getProfile();
    
    const request: PublishingRequest = {
      item: {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        author: profile.username,
        authorId: profile.userId,
        version: formData.version,
        price: formData.price,
        category: formData.category,
        tags: formData.tags,
        files: [],
        metadata: {
          license: formData.license,
          compatibility: formData.compatibility,
        },
      },
      files: [], // TODO: Add file selection
    };

    const result = marketplacePublisherService.createDraft(request);
    if (result.success) {
      loadItems();
      setActiveTab('drafts');
      setFormData({
        type: 'template',
        title: '',
        description: '',
        version: '1.0.0',
        price: 0,
        category: '',
        tags: [],
        tagInput: '',
        license: 'MIT',
        compatibility: [],
      });
    } else {
      alert(result.message);
    }
  };

  const handleSubmitForReview = (itemId: string) => {
    const result = marketplacePublisherService.submitForReview(itemId);
    if (result.success) {
      loadItems();
      if (result.errors && result.errors.length > 0) {
        alert(`Validation errors:\n${result.errors.join('\n')}`);
      }
    } else {
      alert(result.message);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const result = marketplacePublisherService.deleteItem(itemId);
      if (result.success) {
        loadItems();
        setSelectedItem(null);
      } else {
        alert(result.message);
      }
    }
  };

  const handleAddTag = () => {
    if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: '',
      }));
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  if (!isOpen) return null;

  return (
    <ErrorBoundary>
      <div
        className="fixed inset-0 zstack-modal-backdrop flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="publisher-dashboard-title"
      >
        <div className="xibalba-panel bg-[var(--xibalba-grey-050)] border border-white/10 rounded-lg w-[90vw] max-w-6xl h-[85vh] max-h-[700px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--xibalba-accent)]" aria-hidden="true">
                store
              </span>
              <h2 id="publisher-dashboard-title" className="text-xl font-bold text-[var(--xibalba-text-000)]">
                Marketplace Publisher
              </h2>
            </div>
            <button
              onClick={onClose}
              className="xibalba-interactive p-2 hover:bg-[var(--xibalba-grey-100)] rounded transition-colors min-w-[44px] min-h-[44px]"
              aria-label="Close publisher dashboard"
            >
              <span className="material-symbols-outlined text-[var(--xibalba-text-100)]">close</span>
            </button>
          </div>

          {/* Permission Check */}
          {!canPublish.allowed && (
            <div className="p-4 bg-[var(--vectorforge-accent)]/20 border border-[var(--vectorforge-accent)]/50 m-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[var(--vectorforge-accent)]" aria-hidden="true">warning</span>
                <span className="font-semibold text-[var(--vectorforge-accent)]">Publishing Locked</span>
              </div>
              <p className="text-sm text-[var(--vectorforge-accent)] opacity-90">{canPublish.reason}</p>
              <p className="text-xs text-[var(--vectorforge-accent)] opacity-80 mt-2">
                Keep using VectorForge to level up and unlock marketplace publishing!
              </p>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-6 py-3 text-lg font-semibold transition-colors ${
                activeTab === 'drafts'
                  ? 'text-[var(--xibalba-accent)] border-b-2 border-[var(--xibalba-accent)]'
                  : 'text-[var(--xibalba-text-100)] hover:text-[var(--xibalba-text-000)]'
              }`}
              aria-selected={activeTab === 'drafts'}
              role="tab"
            >
              Drafts ({drafts.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 text-lg font-semibold transition-colors ${
                activeTab === 'pending'
                  ? 'text-[var(--xibalba-accent)] border-b-2 border-[var(--xibalba-accent)]'
                  : 'text-[var(--xibalba-text-100)] hover:text-[var(--xibalba-text-000)]'
              }`}
              aria-selected={activeTab === 'pending'}
              role="tab"
            >
              Pending ({pending.length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`px-6 py-3 text-lg font-semibold transition-colors ${
                activeTab === 'published'
                  ? 'text-[var(--xibalba-accent)] border-b-2 border-[var(--xibalba-accent)]'
                  : 'text-[var(--xibalba-text-100)] hover:text-[var(--xibalba-text-000)]'
              }`}
              aria-selected={activeTab === 'published'}
              role="tab"
            >
              Published ({published.length})
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 text-lg font-semibold transition-colors ${
                activeTab === 'create'
                  ? 'text-[var(--xibalba-accent)] border-b-2 border-[var(--xibalba-accent)]'
                  : 'text-[var(--xibalba-text-100)] hover:text-[var(--xibalba-text-000)]'
              }`}
              aria-selected={activeTab === 'create'}
              role="tab"
            >
              Create New
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left Panel - Item List */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'create' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Item Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="xibalba-input w-full min-h-[44px]"
                      disabled={!canPublish.allowed}
                    >
                      <option value="template">Template</option>
                      <option value="plugin">Plugin</option>
                      <option value="asset">Asset</option>
                      <option value="tutorial">Tutorial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="xibalba-input w-full min-h-[44px]"
                      placeholder="Enter item title"
                      disabled={!canPublish.allowed}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="xibalba-input w-full min-h-[120px]"
                      placeholder="Describe your item..."
                      disabled={!canPublish.allowed}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                        Version *
                      </label>
                      <input
                        type="text"
                        value={formData.version}
                        onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                        className="xibalba-input w-full min-h-[44px]"
                        placeholder="1.0.0"
                        disabled={!canPublish.allowed}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                        Price (credits)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        className="xibalba-input w-full min-h-[44px]"
                        min="0"
                        step="0.01"
                        disabled={!canPublish.allowed}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="xibalba-input w-full min-h-[44px]"
                      placeholder="e.g., components, services, api-routes"
                      disabled={!canPublish.allowed}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      Tags *
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={formData.tagInput}
                        onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        className="xibalba-input flex-1 min-h-[44px]"
                        placeholder="Add tag and press Enter"
                        disabled={!canPublish.allowed}
                      />
                      <button
                        onClick={handleAddTag}
                        className="xibalba-button-secondary min-w-[100px] min-h-[44px]"
                        disabled={!canPublish.allowed}
                      >
                        Add Tag
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-[var(--xibalba-grey-100)] text-[var(--xibalba-text-000)] rounded-lg flex items-center gap-2"
                        >
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="text-[var(--xibalba-text-100)] hover:text-[var(--xibalba-text-000)]"
                            disabled={!canPublish.allowed}
                          >
                            <span className="material-symbols-outlined text-sm" aria-label={`Remove ${tag}`}>close</span>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[var(--xibalba-text-000)] mb-2">
                      License
                    </label>
                    <select
                      value={formData.license}
                      onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                      className="xibalba-input w-full min-h-[44px]"
                      disabled={!canPublish.allowed}
                    >
                      <option value="MIT">MIT</option>
                      <option value="Apache-2.0">Apache 2.0</option>
                      <option value="GPL-3.0">GPL 3.0</option>
                      <option value="BSD-3-Clause">BSD 3-Clause</option>
                      <option value="Proprietary">Proprietary</option>
                    </select>
                  </div>

                  <button
                    onClick={handleCreateDraft}
                    disabled={!canPublish.allowed || !formData.title || !formData.description || formData.tags.length === 0}
                    className="xibalba-button-primary w-full min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined mr-2" aria-hidden="true">add</span>
                    Create Draft
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-[var(--xibalba-text-100)]" aria-live="polite">
                      {activeTab === 'drafts' && `${drafts.length} draft${drafts.length !== 1 ? 's' : ''}`}
                      {activeTab === 'pending' && `${pending.length} pending item${pending.length !== 1 ? 's' : ''}`}
                      {activeTab === 'published' && `${published.length} published item${published.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {(activeTab === 'drafts' ? drafts : activeTab === 'pending' ? pending : published).map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
                          selectedItem?.id === item.id
                            ? 'border-[var(--xibalba-accent)] bg-[var(--xibalba-grey-100)]'
                            : 'border-[var(--xibalba-grey-100)] hover:border-[var(--xibalba-accent)]'
                        }`}
                        onClick={() => setSelectedItem(item)}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-[var(--xibalba-text-000)] mb-1">{item.title}</h3>
                            <p className="text-sm text-[var(--xibalba-text-100)] mb-2">{item.description}</p>
                            <div className="flex items-center gap-4 text-xs text-[var(--xibalba-text-100)]">
                              <span className="capitalize">{item.type}</span>
                              <span>v{item.version}</span>
                              {item.price > 0 && <span>{item.price} credits</span>}
                              <span className="capitalize">{item.status}</span>
                            </div>
                          </div>
                          {item.status === 'published' && (
                            <div className="text-right text-xs">
                              <div className="text-[var(--xibalba-text-000)] font-semibold">
                                {item.stats.views} views
                              </div>
                              <div className="text-[var(--xibalba-text-100)]">
                                {item.stats.purchases} sales
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {(activeTab === 'drafts' ? drafts : activeTab === 'pending' ? pending : published).length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-[var(--xibalba-text-100)]">No items found</p>
                      {activeTab === 'drafts' && (
                        <button
                          onClick={() => setActiveTab('create')}
                          className="xibalba-button-secondary mt-4 min-h-[44px]"
                        >
                          Create Your First Draft
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Panel - Item Details */}
            {selectedItem && activeTab !== 'create' && (
              <div className="w-1/2 border-l border-white/10 p-6 overflow-y-auto">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[var(--xibalba-text-000)] mb-2">{selectedItem.title}</h3>
                  <p className="text-sm text-[var(--xibalba-text-100)] mb-4">{selectedItem.description}</p>
                  <div className="flex items-center gap-4 text-sm text-[var(--xibalba-text-100)] mb-4">
                    <span className="capitalize">{selectedItem.type}</span>
                    <span>v{selectedItem.version}</span>
                    <span className="capitalize">{selectedItem.status}</span>
                    {selectedItem.price > 0 && <span>{selectedItem.price} credits</span>}
                  </div>
                </div>

                {selectedItem.status === 'draft' && (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleSubmitForReview(selectedItem.id)}
                      className="xibalba-button-primary w-full min-h-[44px]"
                    >
                      <span className="material-symbols-outlined mr-2" aria-hidden="true">send</span>
                      Submit for Review
                    </button>
                    <button
                      onClick={() => handleDeleteItem(selectedItem.id)}
                      className="xibalba-button-secondary w-full min-h-[44px] text-[var(--vectorforge-accent)]"
                    >
                      <span className="material-symbols-outlined mr-2" aria-hidden="true">delete</span>
                      Delete Draft
                    </button>
                  </div>
                )}

                {selectedItem.status === 'published' && (
                  <div className="space-y-4">
                    <div className="bg-[var(--xibalba-grey-100)] p-4 rounded-lg">
                      <h4 className="font-semibold text-[var(--xibalba-text-000)] mb-3">Statistics</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-[var(--xibalba-text-100)]">Views</div>
                          <div className="text-lg font-bold text-[var(--xibalba-text-000)]">{selectedItem.stats.views}</div>
                        </div>
                        <div>
                          <div className="text-[var(--xibalba-text-100)]">Downloads</div>
                          <div className="text-lg font-bold text-[var(--xibalba-text-000)]">{selectedItem.stats.downloads}</div>
                        </div>
                        <div>
                          <div className="text-[var(--xibalba-text-100)]">Sales</div>
                          <div className="text-lg font-bold text-[var(--xibalba-text-000)]">{selectedItem.stats.purchases}</div>
                        </div>
                        <div>
                          <div className="text-[var(--xibalba-text-100)]">Revenue</div>
                          <div className="text-lg font-bold text-[var(--xibalba-text-000)]">{selectedItem.stats.revenue} credits</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MarketplacePublisherDashboard;


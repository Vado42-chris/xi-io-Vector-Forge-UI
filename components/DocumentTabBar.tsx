/**
 * Document Tab Bar Component
 * Shows open documents with tabs, close buttons, and new tab button
 * Matches design concept: Desktop Theme Icon.svg, Untitled-1.svg, New Project.svg
 */

import React from 'react';

export interface Document {
  id: string;
  name: string;
  path?: string;
  icon?: string;
  isDirty?: boolean;
}

interface DocumentTabBarProps {
  documents: Document[];
  activeDocumentId: string | null;
  onDocumentSelect: (id: string) => void;
  onDocumentClose: (id: string) => void;
  onNewDocument: () => void;
}

const DocumentTabBar: React.FC<DocumentTabBarProps> = ({
  documents,
  activeDocumentId,
  onDocumentSelect,
  onDocumentClose,
  onNewDocument,
}) => {
  const getDocumentIcon = (doc: Document) => {
    if (doc.icon) return doc.icon;
    if (doc.name.endsWith('.svg')) return 'description';
    return 'insert_drive_file';
  };

  return (
    <div className="document-tab-bar">
      <div className="document-tabs-container">
        {documents.map(doc => (
          <div
            key={doc.id}
            className={`document-tab ${activeDocumentId === doc.id ? 'document-tab-active' : ''}`}
            onClick={() => onDocumentSelect(doc.id)}
          >
            <span className="material-symbols-outlined document-tab-icon">
              {getDocumentIcon(doc)}
            </span>
            <span className="document-tab-label">{doc.name}</span>
            {doc.isDirty && (
              <span className="document-tab-dirty-indicator" title="Unsaved changes">
                ●
              </span>
            )}
            <button
              className="document-tab-close"
              onClick={e => {
                e.stopPropagation();
                onDocumentClose(doc.id);
              }}
              aria-label={`Close ${doc.name}`}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        ))}
      </div>
      <button
        className="document-tab-new"
        onClick={onNewDocument}
        aria-label="New document"
        title="New document"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
};

export default DocumentTabBar;

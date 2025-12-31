import React from 'react';

interface BatchOperationsPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const BatchOperationsPanel: React.FC<BatchOperationsPanelProps> = () => {
  return (
    <div className="batch-operations-panel">
      <p>Batch Operations Panel - Coming Soon</p>
    </div>
  );
};

export default BatchOperationsPanel;


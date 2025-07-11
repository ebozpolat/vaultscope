import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionsPanel = ({ 
  selectedThresholds, 
  onBulkAction, 
  onClearSelection,
  thresholds 
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const selectedCount = selectedThresholds.length;
  const selectedThresholdData = thresholds.filter(t => selectedThresholds.includes(t.id));

  const bulkActions = [
    {
      id: 'activate',
      label: 'Activate',
      icon: 'Play',
      color: 'text-success',
      description: 'Enable selected thresholds for monitoring',
      confirmMessage: `Are you sure you want to activate ${selectedCount} threshold${selectedCount !== 1 ? 's' : ''}?`
    },
    {
      id: 'pause',
      label: 'Pause',
      icon: 'Pause',
      color: 'text-warning',
      description: 'Temporarily disable selected thresholds',
      confirmMessage: `Are you sure you want to pause ${selectedCount} threshold${selectedCount !== 1 ? 's' : ''}?`
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: 'Trash2',
      color: 'text-error',
      description: 'Permanently remove selected thresholds',
      confirmMessage: `Are you sure you want to delete ${selectedCount} threshold${selectedCount !== 1 ? 's' : ''}? This action cannot be undone.`,
      requiresConfirmation: true
    },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: 'Copy',
      color: 'text-accent',
      description: 'Create copies of selected thresholds',
      confirmMessage: `Create ${selectedCount} duplicate threshold${selectedCount !== 1 ? 's' : ''}?`
    },
    {
      id: 'export',
      label: 'Export',
      icon: 'Download',
      color: 'text-primary',
      description: 'Export selected thresholds to CSV',
      confirmMessage: `Export ${selectedCount} threshold${selectedCount !== 1 ? 's' : ''} to CSV file?`
    }
  ];

  const handleBulkAction = (action) => {
    if (action.requiresConfirmation || selectedCount > 5) {
      setPendingAction(action);
      setIsConfirmModalOpen(true);
    } else {
      executeBulkAction(action);
    }
  };

  const executeBulkAction = (action) => {
    onBulkAction(action.id, selectedThresholds);
    setIsConfirmModalOpen(false);
    setPendingAction(null);
  };

  const getStatusBreakdown = () => {
    const breakdown = selectedThresholdData.reduce((acc, threshold) => {
      acc[threshold.status] = (acc[threshold.status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(breakdown).map(([status, count]) => ({
      status,
      count,
      percentage: ((count / selectedCount) * 100).toFixed(0)
    }));
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Panel */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-surface border border-border rounded-lg shadow-elevation-4 p-4 min-w-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="CheckSquare" size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">
                {selectedCount} threshold{selectedCount !== 1 ? 's' : ''} selected
              </h3>
              <p className="text-sm text-text-secondary">
                Choose an action to apply to selected items
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconSize={16}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        {/* Selection Summary */}
        <div className="mb-4 p-3 bg-background-secondary rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Selection Summary</span>
            <span className="text-xs text-text-secondary">{selectedCount} items</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {getStatusBreakdown().map(({ status, count, percentage }) => (
              <span
                key={status}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface border border-border"
              >
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  status === 'active' ? 'bg-success' :
                  status === 'triggered' ? 'bg-error' :
                  status === 'paused' ? 'bg-warning' : 'bg-secondary'
                }`} />
                {status}: {count} ({percentage}%)
              </span>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {bulkActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              onClick={() => handleBulkAction(action)}
              className={`flex-col space-y-1 h-auto py-3 ${action.color} hover:bg-background-secondary`}
              iconName={action.icon}
              iconSize={18}
            >
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-success">
                {selectedThresholdData.filter(t => t.status === 'active').length}
              </div>
              <div className="text-xs text-text-secondary">Active</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-error">
                {selectedThresholdData.filter(t => t.status === 'triggered').length}
              </div>
              <div className="text-xs text-text-secondary">Triggered</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-warning">
                {selectedThresholdData.filter(t => t.status === 'paused').length}
              </div>
              <div className="text-xs text-text-secondary">Paused</div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmModalOpen && pendingAction && (
        <div className="fixed inset-0 bg-secondary-900/50 flex items-center justify-center z-[1000]">
          <div className="bg-surface rounded-lg border border-border shadow-elevation-4 p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                pendingAction.id === 'delete' ? 'bg-error-100' : 'bg-primary-100'
              }`}>
                <Icon 
                  name={pendingAction.icon} 
                  size={24} 
                  className={pendingAction.id === 'delete' ? 'text-error' : 'text-primary'} 
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Confirm {pendingAction.label}
                </h3>
                <p className="text-sm text-text-secondary">
                  {pendingAction.description}
                </p>
              </div>
            </div>

            <p className="text-text-primary mb-6">
              {pendingAction.confirmMessage}
            </p>

            <div className="flex space-x-3">
              <Button
                variant="ghost"
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant={pendingAction.id === 'delete' ? 'danger' : 'primary'}
                onClick={() => executeBulkAction(pendingAction)}
                className="flex-1"
              >
                {pendingAction.label}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActionsPanel;
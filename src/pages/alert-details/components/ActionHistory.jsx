import React from 'react';
import Icon from '../../../components/AppIcon';

const ActionHistory = ({ actions }) => {
  const getActionIcon = (action) => {
    switch (action.toLowerCase()) {
      case 'acknowledged':
        return 'Check';
      case 'escalated':
        return 'ArrowUp';
      case 'resolved':
        return 'CheckCircle';
      case 'commented':
        return 'MessageCircle';
      case 'assigned':
        return 'UserPlus';
      case 'threshold_updated':
        return 'Settings';
      default:
        return 'Activity';
    }
  };

  const getActionColor = (action) => {
    switch (action.toLowerCase()) {
      case 'acknowledged':
        return 'text-warning';
      case 'escalated':
        return 'text-error';
      case 'resolved':
        return 'text-success';
      case 'commented':
        return 'text-accent';
      case 'assigned':
        return 'text-primary';
      case 'threshold_updated':
        return 'text-secondary';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Activity" size={20} className="text-text-secondary" />
        <h3 className="text-lg font-semibold text-text-primary">Action History</h3>
      </div>

      <div className="space-y-4">
        {actions.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Clock" size={48} className="text-text-quaternary mx-auto mb-4" />
            <p className="text-text-secondary">No actions taken yet</p>
          </div>
        ) : (
          actions.map((action, index) => (
            <div key={action.id} className="flex items-start space-x-4 p-4 bg-background-secondary rounded-lg">
              <div className={`w-8 h-8 rounded-full bg-surface border-2 flex items-center justify-center ${getActionColor(action.action)}`}>
                <Icon name={getActionIcon(action.action)} size={14} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-text-primary capitalize">
                    {action.action.replace('_', ' ')}
                  </h4>
                  <span className="text-sm text-text-secondary">
                    {new Date(action.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-text-secondary text-sm mb-2">
                  {action.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-text-tertiary">
                  <div className="flex items-center space-x-1">
                    <Icon name="User" size={12} />
                    <span>{action.user}</span>
                  </div>
                  {action.duration && (
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={12} />
                      <span>{action.duration}</span>
                    </div>
                  )}
                </div>
                
                {action.notes && (
                  <div className="mt-2 p-2 bg-surface rounded border-l-4 border-primary">
                    <p className="text-sm text-text-secondary italic">
                      "{action.notes}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActionHistory;
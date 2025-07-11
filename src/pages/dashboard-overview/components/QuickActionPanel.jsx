import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionPanel = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions = [
    {
      id: 'new-threshold',
      label: 'Create Threshold',
      description: 'Set up new price or volatility monitoring',
      icon: 'Plus',
      color: 'text-primary',
      bgColor: 'bg-primary-50 hover:bg-primary-100',
      borderColor: 'border-primary-200',
      action: () => navigate('/threshold-configuration'),
      priority: 'high'
    },
    {
      id: 'acknowledge-alerts',
      label: 'Acknowledge Alerts',
      description: 'Review and acknowledge pending alerts',
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success-50 hover:bg-success-100',
      borderColor: 'border-success-200',
      action: () => navigate('/real-time-alerts'),
      priority: 'high'
    },
    {
      id: 'system-health',
      label: 'System Health',
      description: 'Check system status and performance',
      icon: 'Activity',
      color: 'text-accent',
      bgColor: 'bg-accent-50 hover:bg-accent-100',
      borderColor: 'border-accent-200',
      action: () => navigate('/system-settings'),
      priority: 'medium'
    },
    {
      id: 'export-data',
      label: 'Export Data',
      description: 'Download alerts and threshold reports',
      icon: 'Download',
      color: 'text-secondary',
      bgColor: 'bg-secondary-50 hover:bg-secondary-100',
      borderColor: 'border-secondary-200',
      action: () => handleExportData(),
      priority: 'medium'
    },
    {
      id: 'refresh-data',
      label: 'Refresh Data',
      description: 'Force refresh all dashboard data',
      icon: 'RefreshCw',
      color: 'text-warning',
      bgColor: 'bg-warning-50 hover:bg-warning-100',
      borderColor: 'border-warning-200',
      action: () => handleRefreshData(),
      priority: 'low'
    },
    {
      id: 'bulk-operations',
      label: 'Bulk Operations',
      description: 'Manage multiple thresholds at once',
      icon: 'Settings',
      color: 'text-info',
      bgColor: 'bg-info-50 hover:bg-info-100',
      borderColor: 'border-info-200',
      action: () => navigate('/threshold-management'),
      priority: 'low'
    }
  ];

  const handleExportData = () => {
    // Simulate data export
    const exportData = {
      timestamp: new Date().toISOString(),
      alerts: 18,
      thresholds: 45,
      systemHealth: 'healthy'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vaultscope-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRefreshData = () => {
    // Simulate data refresh
    window.location.reload();
  };

  const primaryActions = quickActions.filter(action => action.priority === 'high');
  const secondaryActions = quickActions.filter(action => action.priority !== 'high');

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Icon name="Zap" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
            <p className="text-sm text-text-secondary">Common tasks and operations</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconSize={16}
          className="text-text-secondary hover:text-text-primary"
        >
          {isExpanded ? 'Less' : 'More'}
        </Button>
      </div>

      {/* Primary Actions - Always Visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {primaryActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${action.bgColor} ${action.borderColor} hover:shadow-elevation-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${action.bgColor}`}>
                <Icon name={action.icon} size={18} className={action.color} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-text-primary mb-1">{action.label}</h4>
                <p className="text-sm text-text-secondary">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Secondary Actions - Expandable */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in">
          {secondaryActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${action.bgColor} ${action.borderColor} hover:shadow-elevation-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${action.bgColor}`}>
                  <Icon name={action.icon} size={14} className={action.color} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-text-primary">{action.label}</h4>
                  <p className="text-xs text-text-secondary">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <span>Keyboard shortcuts available</span>
          <div className="flex items-center space-x-2">
            <kbd className="px-2 py-1 bg-background-secondary rounded text-text-secondary">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 bg-background-secondary rounded text-text-secondary">N</kbd>
            <span>New Threshold</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionPanel;
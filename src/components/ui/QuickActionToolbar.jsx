import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionToolbar = ({ 
  position = 'header', 
  className = '' 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Context-aware actions based on current route
  const getContextualActions = () => {
    const currentPath = location.pathname;
    
    const baseActions = [
      {
        id: 'refresh',
        label: 'Refresh Data',
        icon: 'RefreshCw',
        shortcut: 'R',
        action: () => handleQuickAction('refresh-data'),
        priority: 'high'
      },
      {
        id: 'new-threshold',
        label: 'New Threshold',
        icon: 'Plus',
        shortcut: 'N',
        action: () => handleQuickAction('new-threshold'),
        priority: 'medium'
      }
    ];

    // Add context-specific actions
    switch (currentPath) {
      case '/dashboard-overview':
        return [
          ...baseActions,
          {
            id: 'export-report',
            label: 'Export Report',
            icon: 'Download',
            shortcut: 'E',
            action: () => handleQuickAction('export-report'),
            priority: 'medium'
          }
        ];
        
      case '/real-time-alerts':
        return [
          {
            id: 'acknowledge-all',
            label: 'Acknowledge All',
            icon: 'CheckCircle',
            shortcut: 'A',
            action: () => handleQuickAction('acknowledge-all'),
            priority: 'high'
          },
          ...baseActions,
          {
            id: 'filter-alerts',
            label: 'Filter Alerts',
            icon: 'Filter',
            shortcut: 'F',
            action: () => handleQuickAction('filter-alerts'),
            priority: 'medium'
          }
        ];
        
      case '/alert-details':
        return [
          {
            id: 'acknowledge',
            label: 'Acknowledge',
            icon: 'Check',
            shortcut: 'A',
            action: () => handleQuickAction('acknowledge'),
            priority: 'high'
          },
          {
            id: 'escalate',
            label: 'Escalate',
            icon: 'ArrowUp',
            shortcut: 'E',
            action: () => handleQuickAction('escalate'),
            priority: 'high'
          },
          ...baseActions
        ];
        
      case '/threshold-management': case'/threshold-configuration':
        return [
          {
            id: 'save-config',
            label: 'Save Configuration',
            icon: 'Save',
            shortcut: 'S',
            action: () => handleQuickAction('save-config'),
            priority: 'high'
          },
          ...baseActions,
          {
            id: 'test-threshold',
            label: 'Test Threshold',
            icon: 'Play',
            shortcut: 'T',
            action: () => handleQuickAction('test-threshold'),
            priority: 'medium'
          }
        ];
        
      case '/system-settings':
        return [
          {
            id: 'save-settings',
            label: 'Save Settings',
            icon: 'Save',
            shortcut: 'S',
            action: () => handleQuickAction('save-settings'),
            priority: 'high'
          },
          ...baseActions,
          {
            id: 'reset-defaults',
            label: 'Reset to Defaults',
            icon: 'RotateCcw',
            shortcut: 'D',
            action: () => handleQuickAction('reset-defaults'),
            priority: 'low'
          }
        ];
        
      default:
        return baseActions;
    }
  };

  const handleQuickAction = (actionId) => {
    console.log(`Quick action executed: ${actionId}`);
    
    // Implement actual action logic based on actionId
    switch (actionId) {
      case 'refresh-data':
        // Trigger data refresh
        window.location.reload();
        break;
        
      case 'new-threshold': navigate('/threshold-configuration');
        break;
        
      case 'acknowledge-all':
        // Acknowledge all alerts logic
        alert('All alerts acknowledged');
        break;
        
      case 'export-report':
        // Export report logic
        alert('Report export initiated');
        break;
        
      case 'save-config': case'save-settings':
        // Save configuration logic
        alert('Configuration saved');
        break;
        
      case 'escalate':
        // Escalate alert logic
        alert('Alert escalated');
        break;
        
      case 'test-threshold':
        // Test threshold logic
        alert('Threshold test initiated');
        break;
        
      case 'filter-alerts':
        // Open filter modal or sidebar
        alert('Filter panel opened');
        break;
        
      case 'reset-defaults':
        // Reset to defaults logic
        if (confirm('Reset all settings to defaults?')) {
          alert('Settings reset to defaults');
        }
        break;
        
      default:
        console.log(`Unhandled action: ${actionId}`);
    }
    
    // Close expanded menu on mobile
    setIsExpanded(false);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        const actions = getContextualActions();
        const action = actions.find(a => a.shortcut.toLowerCase() === event.key.toLowerCase());
        
        if (action) {
          event.preventDefault();
          action.action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname]);

  const actions = getContextualActions();
  const primaryActions = actions.filter(a => a.priority === 'high').slice(0, 2);
  const secondaryActions = actions.filter(a => a.priority !== 'high');

  if (position === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-[950] ${className}`}>
        <div className="flex flex-col space-y-2">
          {/* Primary floating action */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => primaryActions[0]?.action()}
            className="rounded-full shadow-elevation-4 hover:shadow-elevation-3 transition-all duration-200"
            iconName={primaryActions[0]?.icon || 'Plus'}
            iconSize={20}
          />
          
          {/* Secondary actions (expandable) */}
          {isExpanded && (
            <div className="flex flex-col space-y-2 animate-fade-in">
              {secondaryActions.slice(0, 3).map((action) => (
                <Button
                  key={action.id}
                  variant="secondary"
                  size="md"
                  onClick={action.action}
                  className="rounded-full shadow-elevation-3"
                  iconName={action.icon}
                  iconSize={16}
                />
              ))}
            </div>
          )}
          
          {/* Expand/collapse toggle */}
          {secondaryActions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-full bg-surface shadow-elevation-2"
              iconName={isExpanded ? 'ChevronDown' : 'ChevronUp'}
              iconSize={14}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Desktop: Show primary actions directly */}
      <div className="hidden md:flex items-center space-x-2">
        {primaryActions.map((action) => (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            onClick={action.action}
            className="text-text-secondary hover:text-text-primary transition-colors duration-200"
            iconName={action.icon}
            iconSize={16}
            title={`${action.label} (Ctrl+${action.shortcut})`}
          >
            <span className="hidden lg:inline ml-2">{action.label}</span>
          </Button>
        ))}
        
        {/* More actions dropdown */}
        {secondaryActions.length > 0 && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-text-secondary hover:text-text-primary"
              iconName="MoreHorizontal"
              iconSize={16}
            />
            
            {isExpanded && (
              <div className="absolute top-full right-0 mt-2 bg-surface border border-border rounded-lg shadow-elevation-3 py-2 min-w-48 z-50">
                {secondaryActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors duration-200 flex items-center space-x-3"
                  >
                    <Icon name={action.icon} size={14} />
                    <span>{action.label}</span>
                    <span className="ml-auto text-xs text-text-quaternary">
                      Ctrl+{action.shortcut}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile: Compact menu */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-text-secondary hover:text-text-primary"
          iconName="MoreVertical"
          iconSize={16}
        />
        
        {isExpanded && (
          <div className="absolute top-full right-0 mt-2 bg-surface border border-border rounded-lg shadow-elevation-3 py-2 min-w-48 z-50">
            {actions.slice(0, 4).map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-background-secondary transition-colors duration-200 flex items-center space-x-3"
              >
                <Icon name={action.icon} size={14} />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActionToolbar;
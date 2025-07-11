import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertTimeline = ({ events }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'triggered':
        return 'AlertTriangle';
      case 'acknowledged':
        return 'Check';
      case 'escalated':
        return 'ArrowUp';
      case 'resolved':
        return 'CheckCircle';
      case 'comment':
        return 'MessageCircle';
      case 'threshold_updated':
        return 'Settings';
      default:
        return 'Clock';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'triggered':
        return 'text-error bg-error-50 border-error-200';
      case 'acknowledged':
        return 'text-warning bg-warning-50 border-warning-200';
      case 'escalated':
        return 'text-warning bg-warning-50 border-warning-200';
      case 'resolved':
        return 'text-success bg-success-50 border-success-200';
      case 'comment':
        return 'text-accent bg-accent-50 border-accent-200';
      case 'threshold_updated':
        return 'text-secondary bg-secondary-50 border-secondary-200';
      default:
        return 'text-secondary bg-secondary-50 border-secondary-200';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Clock" size={20} className="text-text-secondary" />
        <h3 className="text-lg font-semibold text-text-primary">Alert Timeline</h3>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex items-start space-x-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${getEventColor(event.type)}`}>
                <Icon name={getEventIcon(event.type)} size={14} />
              </div>
              {index < events.length - 1 && (
                <div className="w-0.5 h-8 bg-border mt-2" />
              )}
            </div>

            {/* Event Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-text-primary capitalize">
                  {event.type.replace('_', ' ')}
                </h4>
                <span className="text-sm text-text-secondary">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>
              
              <p className="text-text-secondary text-sm mb-2">
                {event.description}
              </p>
              
              {event.user && (
                <div className="flex items-center space-x-2 text-xs text-text-tertiary">
                  <Icon name="User" size={12} />
                  <span>by {event.user}</span>
                </div>
              )}
              
              {event.details && (
                <div className="mt-2 p-3 bg-background-secondary rounded-lg">
                  <pre className="text-xs text-text-secondary whitespace-pre-wrap font-mono">
                    {JSON.stringify(event.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertTimeline;
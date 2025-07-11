import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertHeader = ({ alert, onAcknowledge, onEscalate, onResolve, onPrevious, onNext }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-error bg-error-50 border-error-200';
      case 'high':
        return 'text-warning bg-warning-50 border-warning-200';
      case 'medium':
        return 'text-accent bg-accent-50 border-accent-200';
      case 'low':
        return 'text-success bg-success-50 border-success-200';
      default:
        return 'text-secondary bg-secondary-50 border-secondary-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-error bg-error-50 border-error-200';
      case 'acknowledged':
        return 'text-warning bg-warning-50 border-warning-200';
      case 'resolved':
        return 'text-success bg-success-50 border-success-200';
      default:
        return 'text-secondary bg-secondary-50 border-secondary-200';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            iconName="ChevronLeft"
            iconSize={16}
            className="text-text-secondary hover:text-text-primary"
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            iconName="ChevronRight"
            iconSize={16}
            className="text-text-secondary hover:text-text-primary"
          >
            Next
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAcknowledge}
            iconName="Check"
            iconSize={16}
            disabled={alert.status === 'acknowledged' || alert.status === 'resolved'}
          >
            Acknowledge
          </Button>
          <Button
            variant="warning"
            size="sm"
            onClick={onEscalate}
            iconName="ArrowUp"
            iconSize={16}
            disabled={alert.status === 'resolved'}
          >
            Escalate
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={onResolve}
            iconName="CheckCircle"
            iconSize={16}
            disabled={alert.status === 'resolved'}
          >
            Resolve
          </Button>
        </div>
      </div>

      {/* Alert Header Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Alert Info */}
        <div className="lg:col-span-2">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-error-100 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={24} className="text-error" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-text-primary">
                  Alert #{alert.id}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(alert.status)}`}>
                  {alert.status}
                </span>
              </div>
              
              <h2 className="text-lg font-semibold text-text-primary mb-2">
                {alert.title}
              </h2>
              
              <p className="text-text-secondary mb-4">
                {alert.description}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-text-secondary">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} />
                  <span>Triggered: {new Date(alert.triggeredAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={16} />
                  <span>Assigned: {alert.assignedTo || 'Unassigned'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-background-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Current Price</span>
              <Icon name="TrendingUp" size={16} className="text-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary">
              ${alert.currentPrice.toLocaleString()}
            </div>
            <div className="text-sm text-success">
              +{alert.priceChange}% (24h)
            </div>
          </div>
          
          <div className="bg-background-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Threshold</span>
              <Icon name="Target" size={16} className="text-warning" />
            </div>
            <div className="text-2xl font-bold text-text-primary">
              ${alert.thresholdValue.toLocaleString()}
            </div>
            <div className="text-sm text-text-secondary">
              {alert.thresholdType} threshold
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertHeader;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsMobileCards = ({ alerts, onAcknowledge, onResolve, selectedAlerts, onSelectAlert }) => {
  const navigate = useNavigate();

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'border-error bg-error-50';
      case 'high':
        return 'border-warning bg-warning-50';
      case 'medium':
        return 'border-accent bg-accent-50';
      case 'low':
        return 'border-success bg-success-50';
      default:
        return 'border-secondary bg-secondary-50';
    }
  };

  const getSeverityTextColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-error';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-accent';
      case 'low':
        return 'text-success';
      default:
        return 'text-secondary';
    }
  };

  const getAlertTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'price_threshold':
        return 'TrendingUp';
      case 'volume_spike':
        return 'BarChart3';
      case 'volatility':
        return 'Activity';
      case 'liquidity':
        return 'Droplets';
      default:
        return 'AlertTriangle';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return alertTime.toLocaleDateString();
  };

  const handleCardClick = (alert) => {
    navigate('/alert-details', { state: { alertId: alert.id } });
  };

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`
            bg-surface rounded-lg border-2 shadow-elevation-1 overflow-hidden
            transition-all duration-200 cursor-pointer
            ${getSeverityColor(alert.severity)}
            ${alert.severity.toLowerCase() === 'critical' ? 'animate-pulse-subtle' : ''}
            ${selectedAlerts.includes(alert.id) ? 'ring-2 ring-primary' : ''}
          `}
          onClick={() => handleCardClick(alert)}
        >
          {/* Card Header */}
          <div className="p-4 pb-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedAlerts.includes(alert.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectAlert(alert.id);
                  }}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {alert.cryptocurrency.substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {alert.cryptocurrency}
                    </h3>
                    <p className="text-xs text-text-tertiary">{alert.symbol}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${getSeverityColor(alert.severity)} ${getSeverityTextColor(alert.severity)}
                `}>
                  {alert.severity}
                </span>
                <p className="text-xs text-text-tertiary mt-1">
                  {formatTimestamp(alert.timestamp)}
                </p>
              </div>
            </div>

            {/* Alert Type and Icon */}
            <div className="flex items-center space-x-2 mb-3">
              <Icon 
                name={getAlertTypeIcon(alert.alertType)} 
                size={16} 
                className="text-text-secondary" 
              />
              <span className="text-sm text-text-primary capitalize">
                {alert.alertType.replace('_', ' ')}
              </span>
            </div>

            {/* Price Information */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-text-secondary">Current Price</p>
                <p className="text-sm font-semibold text-text-primary">
                  {formatPrice(alert.currentPrice)}
                </p>
                <p className={`text-xs ${
                  alert.priceChange >= 0 ? 'text-success' : 'text-error'
                }`}>
                  {alert.priceChange >= 0 ? '+' : ''}{alert.priceChange.toFixed(2)}%
                </p>
              </div>
              
              <div>
                <p className="text-xs text-text-secondary">Threshold</p>
                <p className="text-sm font-semibold text-text-primary">
                  {formatPrice(alert.thresholdValue)}
                </p>
                <p className="text-xs text-text-tertiary capitalize">
                  {alert.thresholdType}
                </p>
              </div>
            </div>

            {/* Alert Message */}
            <div className="mb-4">
              <p className="text-sm text-text-primary">
                {alert.message || `${alert.cryptocurrency} has ${alert.alertType.replace('_', ' ')} alert triggered`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                {alert.status === 'active' && (
                  <>
                    <Button
                      variant="success"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcknowledge(alert.id);
                      }}
                      iconName="Check"
                      iconSize={12}
                    >
                      Acknowledge
                    </Button>
                    
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onResolve(alert.id);
                      }}
                      iconName="CheckCircle"
                      iconSize={12}
                    >
                      Resolve
                    </Button>
                  </>
                )}
                
                {alert.status === 'acknowledged' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success">
                    <Icon name="Check" size={12} className="mr-1" />
                    Acknowledged
                  </span>
                )}
                
                {alert.status === 'resolved' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary">
                    <Icon name="CheckCircle" size={12} className="mr-1" />
                    Resolved
                  </span>
                )}
              </div>

              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(alert);
                }}
                iconName="ArrowRight"
                iconSize={12}
                className="text-text-tertiary hover:text-text-primary"
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      ))}

      {alerts.length === 0 && (
        <div className="text-center py-12">
          <Icon name="AlertTriangle" size={48} className="text-text-quaternary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No alerts found</h3>
          <p className="text-text-secondary">
            No alerts match your current filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsMobileCards;
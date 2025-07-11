import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedAlerts = ({ alerts, currentAlertId }) => {
  const navigate = useNavigate();

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

  const handleAlertClick = (alertId) => {
    // Navigate to the selected alert details
    navigate(`/alert-details?id=${alertId}`);
  };

  const filteredAlerts = alerts.filter(alert => alert.id !== currentAlertId);

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Link" size={20} className="text-text-secondary" />
        <h3 className="text-lg font-semibold text-text-primary">Related Alerts</h3>
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-text-quaternary mx-auto mb-4" />
            <p className="text-text-secondary">No related alerts found</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className="p-4 bg-background-secondary rounded-lg border border-border hover:bg-background-tertiary transition-colors duration-200 cursor-pointer"
              onClick={() => handleAlertClick(alert.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-error-100 rounded-lg flex items-center justify-center">
                    <Icon name="AlertTriangle" size={16} className="text-error" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">Alert #{alert.id}</h4>
                    <p className="text-sm text-text-secondary">{alert.cryptocurrency}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
              </div>
              
              <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                {alert.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-text-tertiary">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{new Date(alert.triggeredAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="DollarSign" size={12} />
                    <span>${alert.triggerPrice.toLocaleString()}</span>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAlertClick(alert.id);
                  }}
                  iconName="ExternalLink"
                  iconSize={12}
                  className="text-text-tertiary hover:text-text-primary"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {filteredAlerts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/real-time-alerts')}
            iconName="List"
            iconSize={16}
            className="w-full"
          >
            View All Alerts
          </Button>
        </div>
      )}
    </div>
  );
};

export default RelatedAlerts;
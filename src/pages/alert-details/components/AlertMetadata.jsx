import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertMetadata = ({ alert }) => {
  const metadataItems = [
    {
      label: 'Alert ID',
      value: alert.id,
      icon: 'Hash'
    },
    {
      label: 'Cryptocurrency',
      value: alert.cryptocurrency,
      icon: 'Coins'
    },
    {
      label: 'Exchange',
      value: alert.exchange,
      icon: 'Building'
    },
    {
      label: 'Threshold Type',
      value: alert.thresholdType,
      icon: 'Target'
    },
    {
      label: 'Threshold Value',
      value: `$${alert.thresholdValue.toLocaleString()}`,
      icon: 'DollarSign'
    },
    {
      label: 'Trigger Price',
      value: `$${alert.triggerPrice.toLocaleString()}`,
      icon: 'TrendingUp'
    },
    {
      label: 'Current Price',
      value: `$${alert.currentPrice.toLocaleString()}`,
      icon: 'Activity'
    },
    {
      label: 'Price Change',
      value: `${alert.priceChange > 0 ? '+' : ''}${alert.priceChange}%`,
      icon: alert.priceChange > 0 ? 'TrendingUp' : 'TrendingDown'
    },
    {
      label: 'Volume (24h)',
      value: alert.volume24h.toLocaleString(),
      icon: 'BarChart3'
    },
    {
      label: 'Market Cap',
      value: `$${alert.marketCap.toLocaleString()}`,
      icon: 'PieChart'
    }
  ];

  const systemInfo = [
    {
      label: 'Monitoring System',
      value: alert.monitoringSystem,
      icon: 'Monitor'
    },
    {
      label: 'Data Source',
      value: alert.dataSource,
      icon: 'Database'
    },
    {
      label: 'Alert Rule',
      value: alert.alertRule,
      icon: 'Settings'
    },
    {
      label: 'Notification Sent',
      value: alert.notificationSent ? 'Yes' : 'No',
      icon: 'Bell'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alert Metadata */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Info" size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-text-primary">Alert Metadata</h3>
        </div>

        <div className="space-y-4">
          {metadataItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div className="flex items-center space-x-3">
                <Icon name={item.icon} size={16} className="text-text-tertiary" />
                <span className="text-sm font-medium text-text-secondary">{item.label}</span>
              </div>
              <span className="text-sm text-text-primary font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Server" size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-text-primary">System Information</h3>
        </div>

        <div className="space-y-4">
          {systemInfo.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div className="flex items-center space-x-3">
                <Icon name={item.icon} size={16} className="text-text-tertiary" />
                <span className="text-sm font-medium text-text-secondary">{item.label}</span>
              </div>
              <span className="text-sm text-text-primary font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Shield" size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-text-primary">Risk Assessment</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Risk Level</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              alert.riskLevel === 'High' ? 'bg-error-50 text-error border border-error-200' :
              alert.riskLevel === 'Medium'? 'bg-warning-50 text-warning border border-warning-200' : 'bg-success-50 text-success border border-success-200'
            }`}>
              {alert.riskLevel}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Impact Score</span>
            <span className="text-sm text-text-primary font-medium">{alert.impactScore}/10</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Confidence Level</span>
            <span className="text-sm text-text-primary font-medium">{alert.confidenceLevel}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertMetadata;
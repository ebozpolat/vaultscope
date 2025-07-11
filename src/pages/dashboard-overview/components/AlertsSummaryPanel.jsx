import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsSummaryPanel = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [alertCounts, setAlertCounts] = useState({
    critical: 2,
    high: 5,
    medium: 8,
    low: 3
  });

  useEffect(() => {
    // Mock alerts data
    const mockAlerts = [
      {
        id: 1,
        type: 'price_threshold',
        severity: 'critical',
        cryptocurrency: 'Bitcoin',
        symbol: 'BTC',
        message: 'Price dropped below $65,000 threshold',
        timestamp: new Date(Date.now() - 300000),
        isAcknowledged: false
      },
      {
        id: 2,
        type: 'volatility',
        severity: 'high',
        cryptocurrency: 'Ethereum',
        symbol: 'ETH',
        message: 'High volatility detected - 15% swing in 1 hour',
        timestamp: new Date(Date.now() - 600000),
        isAcknowledged: false
      },
      {
        id: 3,
        type: 'volume_spike',
        severity: 'medium',
        cryptocurrency: 'Cardano',
        symbol: 'ADA',
        message: 'Trading volume increased by 300%',
        timestamp: new Date(Date.now() - 900000),
        isAcknowledged: true
      },
      {
        id: 4,
        type: 'price_threshold',
        severity: 'critical',
        cryptocurrency: 'Solana',
        symbol: 'SOL',
        message: 'Price exceeded $180 resistance level',
        timestamp: new Date(Date.now() - 1200000),
        isAcknowledged: false
      }
    ];

    setAlerts(mockAlerts);

    // Simulate real-time alert updates
    const interval = setInterval(() => {
      setAlertCounts(prev => ({
        critical: Math.max(0, prev.critical + Math.floor(Math.random() * 3) - 1),
        high: Math.max(0, prev.high + Math.floor(Math.random() * 3) - 1),
        medium: Math.max(0, prev.medium + Math.floor(Math.random() * 3) - 1),
        low: Math.max(0, prev.low + Math.floor(Math.random() * 3) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getSeverityBgColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-error-50 border-error-200';
      case 'high': return 'bg-warning-50 border-warning-200';
      case 'medium': return 'bg-accent-50 border-accent-200';
      case 'low': return 'bg-success-50 border-success-200';
      default: return 'bg-background-secondary border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertTriangle';
      case 'high': return 'AlertCircle';
      case 'medium': return 'Info';
      case 'low': return 'CheckCircle';
      default: return 'Bell';
    }
  };

  const handleViewAllAlerts = () => {
    navigate('/real-time-alerts');
  };

  const handleAlertClick = (alertId) => {
    navigate(`/alert-details?id=${alertId}`);
  };

  const totalAlerts = Object.values(alertCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Active Alerts</h3>
            <p className="text-sm text-text-secondary">{totalAlerts} total alerts</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewAllAlerts}
          iconName="ExternalLink"
          iconSize={16}
          className="text-text-secondary hover:text-text-primary"
        >
          View All
        </Button>
      </div>

      {/* Alert Severity Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(alertCounts).map(([severity, count]) => (
          <div
            key={severity}
            className={`p-3 rounded-lg border ${getSeverityBgColor(severity)} transition-all duration-200 hover:shadow-elevation-1`}
          >
            <div className="flex items-center space-x-2">
              <Icon name={getSeverityIcon(severity)} size={16} className={getSeverityColor(severity)} />
              <span className="text-sm font-medium text-text-primary capitalize">{severity}</span>
            </div>
            <p className={`text-xl font-bold ${getSeverityColor(severity)} mt-1`}>{count}</p>
          </div>
        ))}
      </div>

      {/* Recent Alerts List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-text-secondary mb-3">Recent Alerts</h4>
        
        {alerts.slice(0, 4).map((alert) => (
          <div
            key={alert.id}
            onClick={() => handleAlertClick(alert.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-elevation-1 ${
              alert.isAcknowledged ? 'bg-background-secondary border-border opacity-75' : getSeverityBgColor(alert.severity)
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <Icon 
                  name={getSeverityIcon(alert.severity)} 
                  size={16} 
                  className={`mt-1 ${getSeverityColor(alert.severity)}`} 
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-text-primary">{alert.cryptocurrency}</span>
                    <span className="text-xs text-text-tertiary">({alert.symbol})</span>
                    {alert.isAcknowledged && (
                      <Icon name="Check" size={12} className="text-success" />
                    )}
                  </div>
                  <p className="text-sm text-text-secondary">{alert.message}</p>
                  <p className="text-xs text-text-tertiary mt-1">
                    {alert.timestamp.toLocaleTimeString()} • {alert.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)} ${getSeverityBgColor(alert.severity)}`}>
                {alert.severity.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
          <p className="text-text-secondary">No active alerts</p>
          <p className="text-sm text-text-tertiary">All systems operating normally</p>
        </div>
      )}
    </div>
  );
};

export default AlertsSummaryPanel;
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KeyPerformanceIndicators = () => {
  const [kpiData, setKpiData] = useState({
    totalThresholds: 45,
    activeAlerts: 18,
    systemUptime: 99.97,
    monitoredAssets: 12,
    alertsToday: 23,
    thresholdsTriggered: 8,
    avgResponseTime: 45,
    dataAccuracy: 99.8
  });

  const [trends, setTrends] = useState({
    totalThresholds: 5.2,
    activeAlerts: -12.3,
    systemUptime: 0.1,
    monitoredAssets: 0,
    alertsToday: 15.6,
    thresholdsTriggered: -8.7,
    avgResponseTime: -23.4,
    dataAccuracy: 0.2
  });

  useEffect(() => {
    // Simulate real-time KPI updates
    const interval = setInterval(() => {
      setKpiData(prev => ({
        ...prev,
        activeAlerts: Math.max(0, prev.activeAlerts + Math.floor(Math.random() * 3) - 1),
        alertsToday: prev.alertsToday + Math.floor(Math.random() * 2),
        avgResponseTime: Math.max(20, prev.avgResponseTime + (Math.random() - 0.5) * 10),
        systemUptime: Math.min(100, prev.systemUptime + (Math.random() - 0.5) * 0.01)
      }));

      setTrends(prev => ({
        ...prev,
        activeAlerts: (Math.random() - 0.5) * 20,
        alertsToday: Math.random() * 30,
        avgResponseTime: (Math.random() - 0.5) * 40,
        systemUptime: (Math.random() - 0.5) * 0.5
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const kpiItems = [
    {
      key: 'totalThresholds',
      label: 'Total Thresholds',
      value: kpiData.totalThresholds,
      icon: 'Settings',
      color: 'text-primary',
      bgColor: 'bg-primary-50',
      format: 'number'
    },
    {
      key: 'activeAlerts',
      label: 'Active Alerts',
      value: kpiData.activeAlerts,
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning-50',
      format: 'number'
    },
    {
      key: 'systemUptime',
      label: 'System Uptime',
      value: kpiData.systemUptime,
      icon: 'Clock',
      color: 'text-success',
      bgColor: 'bg-success-50',
      format: 'percentage'
    },
    {
      key: 'monitoredAssets',
      label: 'Monitored Assets',
      value: kpiData.monitoredAssets,
      icon: 'Eye',
      color: 'text-accent',
      bgColor: 'bg-accent-50',
      format: 'number'
    },
    {
      key: 'alertsToday',
      label: 'Alerts Today',
      value: kpiData.alertsToday,
      icon: 'Bell',
      color: 'text-secondary',
      bgColor: 'bg-secondary-50',
      format: 'number'
    },
    {
      key: 'thresholdsTriggered',
      label: 'Thresholds Triggered',
      value: kpiData.thresholdsTriggered,
      icon: 'Zap',
      color: 'text-error',
      bgColor: 'bg-error-50',
      format: 'number'
    },
    {
      key: 'avgResponseTime',
      label: 'Avg Response Time',
      value: kpiData.avgResponseTime,
      icon: 'Timer',
      color: 'text-info',
      bgColor: 'bg-info-50',
      format: 'milliseconds'
    },
    {
      key: 'dataAccuracy',
      label: 'Data Accuracy',
      value: kpiData.dataAccuracy,
      icon: 'Target',
      color: 'text-success',
      bgColor: 'bg-success-50',
      format: 'percentage'
    }
  ];

  const formatValue = (value, format) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(2)}%`;
      case 'milliseconds':
        return `${Math.round(value)}ms`;
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-text-tertiary';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Icon name="BarChart3" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Key Performance Indicators</h3>
            <p className="text-sm text-text-secondary">System performance metrics</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="RefreshCw"
          iconSize={16}
          className="text-text-secondary hover:text-text-primary"
        >
          Refresh
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiItems.map((item) => (
          <div
            key={item.key}
            className={`p-4 rounded-lg border border-border ${item.bgColor} transition-all duration-200 hover:shadow-elevation-1`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.bgColor}`}>
                <Icon name={item.icon} size={16} className={item.color} />
              </div>
              
              {trends[item.key] !== 0 && (
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getTrendIcon(trends[item.key])} 
                    size={12} 
                    className={getTrendColor(trends[item.key])} 
                  />
                  <span className={`text-xs font-medium ${getTrendColor(trends[item.key])}`}>
                    {Math.abs(trends[item.key]).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-2xl font-bold text-text-primary mb-1">
                {formatValue(item.value, item.format)}
              </p>
              <p className="text-sm text-text-secondary">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-text-secondary">Critical Alerts</p>
            <p className="text-xl font-bold text-error">
              {Math.floor(kpiData.activeAlerts * 0.2)}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-text-secondary">Avg Daily Alerts</p>
            <p className="text-xl font-bold text-text-primary">
              {Math.floor(kpiData.alertsToday * 0.8)}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-text-secondary">Threshold Efficiency</p>
            <p className="text-xl font-bold text-success">
              {((kpiData.totalThresholds - kpiData.thresholdsTriggered) / kpiData.totalThresholds * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-center">
        <p className="text-xs text-text-tertiary">
          Last updated: {new Date().toLocaleTimeString()} • Auto-refresh every 10 seconds
        </p>
      </div>
    </div>
  );
};

export default KeyPerformanceIndicators;
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealthIndicator = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    overallHealth: 'healthy',
    uptime: 99.97,
    dataStreamStatus: 'active',
    apiResponseTime: 45,
    activeConnections: 1247,
    lastUpdate: new Date()
  });

  const [detailedMetrics, setDetailedMetrics] = useState({
    webSocketConnections: 1247,
    databaseConnections: 12,
    cacheHitRate: 94.5,
    memoryUsage: 67.3,
    cpuUsage: 23.8,
    diskUsage: 45.2
  });

  useEffect(() => {
    // Simulate real-time system monitoring
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        apiResponseTime: Math.max(20, prev.apiResponseTime + (Math.random() - 0.5) * 10),
        activeConnections: Math.max(1000, prev.activeConnections + Math.floor((Math.random() - 0.5) * 100)),
        lastUpdate: new Date()
      }));

      setDetailedMetrics(prev => ({
        ...prev,
        webSocketConnections: Math.max(1000, prev.webSocketConnections + Math.floor((Math.random() - 0.5) * 50)),
        cacheHitRate: Math.max(80, Math.min(99, prev.cacheHitRate + (Math.random() - 0.5) * 2)),
        memoryUsage: Math.max(50, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        cpuUsage: Math.max(10, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = () => {
    if (systemMetrics.overallHealth === 'healthy') return 'text-success';
    if (systemMetrics.overallHealth === 'warning') return 'text-warning';
    return 'text-error';
  };

  const getHealthBgColor = () => {
    if (systemMetrics.overallHealth === 'healthy') return 'bg-success-50 border-success-200';
    if (systemMetrics.overallHealth === 'warning') return 'bg-warning-50 border-warning-200';
    return 'bg-error-50 border-error-200';
  };

  const getHealthIcon = () => {
    if (systemMetrics.overallHealth === 'healthy') return 'CheckCircle';
    if (systemMetrics.overallHealth === 'warning') return 'AlertTriangle';
    return 'XCircle';
  };

  const getMetricColor = (value, thresholds) => {
    if (value >= thresholds.danger) return 'text-error';
    if (value >= thresholds.warning) return 'text-warning';
    return 'text-success';
  };

  const getProgressBarColor = (value, thresholds) => {
    if (value >= thresholds.danger) return 'bg-error';
    if (value >= thresholds.warning) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getHealthBgColor()}`}>
            <Icon name={getHealthIcon()} size={20} className={getHealthColor()} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">System Health</h3>
            <p className="text-sm text-text-secondary">Real-time monitoring</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor()} ${getHealthBgColor()}`}>
          {systemMetrics.overallHealth.toUpperCase()}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-background-secondary rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-text-tertiary" />
            <span className="text-sm text-text-secondary">Uptime</span>
          </div>
          <p className="text-xl font-bold text-success">{systemMetrics.uptime}%</p>
        </div>

        <div className="bg-background-secondary rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Zap" size={16} className="text-text-tertiary" />
            <span className="text-sm text-text-secondary">Response Time</span>
          </div>
          <p className={`text-xl font-bold ${getMetricColor(systemMetrics.apiResponseTime, { warning: 100, danger: 200 })}`}>
            {systemMetrics.apiResponseTime}ms
          </p>
        </div>

        <div className="bg-background-secondary rounded-lg p-4 col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Users" size={16} className="text-text-tertiary" />
            <span className="text-sm text-text-secondary">Active Connections</span>
          </div>
          <p className="text-xl font-bold text-text-primary">
            {systemMetrics.activeConnections.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Detailed System Metrics */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-text-secondary">System Resources</h4>
        
        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Memory Usage</span>
            <span className={`text-sm font-medium ${getMetricColor(detailedMetrics.memoryUsage, { warning: 75, danger: 90 })}`}>
              {detailedMetrics.memoryUsage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-background-tertiary rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(detailedMetrics.memoryUsage, { warning: 75, danger: 90 })}`}
              style={{ width: `${detailedMetrics.memoryUsage}%` }}
            />
          </div>
        </div>

        {/* CPU Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">CPU Usage</span>
            <span className={`text-sm font-medium ${getMetricColor(detailedMetrics.cpuUsage, { warning: 70, danger: 85 })}`}>
              {detailedMetrics.cpuUsage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-background-tertiary rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(detailedMetrics.cpuUsage, { warning: 70, danger: 85 })}`}
              style={{ width: `${detailedMetrics.cpuUsage}%` }}
            />
          </div>
        </div>

        {/* Cache Hit Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Cache Hit Rate</span>
            <span className="text-sm font-medium text-success">
              {detailedMetrics.cacheHitRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-background-tertiary rounded-full h-2">
            <div
              className="h-2 rounded-full bg-success transition-all duration-300"
              style={{ width: `${detailedMetrics.cacheHitRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-text-secondary">Data Stream Active</span>
          </div>
          <span className="text-text-tertiary">
            Last update: {systemMetrics.lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthIndicator;
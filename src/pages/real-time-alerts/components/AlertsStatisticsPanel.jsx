import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const AlertsStatisticsPanel = ({ alerts }) => {
  // Calculate severity distribution
  const severityDistribution = React.useMemo(() => {
    const distribution = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(distribution).map(([severity, count]) => ({
      name: severity,
      value: count,
      color: getSeverityColor(severity)
    }));
  }, [alerts]);

  // Calculate hourly alert trend
  const hourlyTrend = React.useMemo(() => {
    const now = new Date();
    const hours = [];
    
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourKey = hour.getHours();
      const alertsInHour = alerts.filter(alert => {
        const alertHour = new Date(alert.timestamp).getHours();
        const alertDate = new Date(alert.timestamp).toDateString();
        const currentDate = hour.toDateString();
        return alertHour === hourKey && alertDate === currentDate;
      }).length;
      
      hours.push({
        hour: hourKey,
        alerts: alertsInHour,
        label: `${hourKey.toString().padStart(2, '0')}:00`
      });
    }
    
    return hours.slice(-12); // Show last 12 hours
  }, [alerts]);

  // Recent activity feed
  const recentActivity = React.useMemo(() => {
    return alerts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  }, [alerts]);

  function getSeverityColor(severity) {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '#DC2626';
      case 'high':
        return '#D97706';
      case 'medium':
        return '#0EA5E9';
      case 'low':
        return '#059669';
      default:
        return '#64748B';
    }
  }

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

  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(alert => alert.status === 'active').length;
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical').length;
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'acknowledged').length;

  return (
    <div className="space-y-6">
      {/* Alert Statistics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Alerts</p>
              <p className="text-2xl font-bold text-text-primary">{totalAlerts}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Active</p>
              <p className="text-2xl font-bold text-error">{activeAlerts}</p>
            </div>
            <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
              <Icon name="AlertCircle" size={20} className="text-error" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Critical</p>
              <p className="text-2xl font-bold text-error">{criticalAlerts}</p>
            </div>
            <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
              <Icon name="AlertOctagon" size={20} className="text-error" />
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Acknowledged</p>
              <p className="text-2xl font-bold text-success">{acknowledgedAlerts}</p>
            </div>
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Severity Distribution Chart */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Severity Distribution</h3>
        {severityDistribution.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, `${name} alerts`]}
                  labelStyle={{ color: '#0F172A' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-text-tertiary">
            <div className="text-center">
              <Icon name="PieChart" size={32} className="mx-auto mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          </div>
        )}
        
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-4">
          {severityDistribution.map((item) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-text-secondary capitalize">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Trend Chart */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Hourly Alert Trend</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <Tooltip 
                formatter={(value) => [value, 'Alerts']}
                labelFormatter={(label) => `Time: ${label}`}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  color: '#0F172A'
                }}
              />
              <Bar dataKey="alerts" fill="#3B82F6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-surface rounded-lg border border-border p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentActivity.length > 0 ? (
            recentActivity.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-background-secondary transition-colors duration-200">
                <div className={`
                  w-2 h-2 rounded-full mt-2 flex-shrink-0
                  ${alert.severity === 'critical' ? 'bg-error animate-pulse' : 
                    alert.severity === 'high' ? 'bg-warning' :
                    alert.severity === 'medium' ? 'bg-accent' : 'bg-success'}
                `} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {alert.cryptocurrency}
                    </p>
                    <span className="text-xs text-text-tertiary flex-shrink-0">
                      {formatTimestamp(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {alert.alertType.replace('_', ' ')} - {alert.severity}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    ${alert.currentPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-text-tertiary">
              <Icon name="Activity" size={32} className="mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsStatisticsPanel;
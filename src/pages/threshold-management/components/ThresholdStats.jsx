import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const ThresholdStats = ({ thresholds }) => {
  // Calculate statistics
  const totalThresholds = thresholds.length;
  const activeThresholds = thresholds.filter(t => t.status === 'active').length;
  const triggeredThresholds = thresholds.filter(t => t.status === 'triggered').length;
  const pausedThresholds = thresholds.filter(t => t.status === 'paused').length;

  // Status distribution data
  const statusData = [
    { name: 'Active', value: activeThresholds, color: '#059669' },
    { name: 'Triggered', value: triggeredThresholds, color: '#DC2626' },
    { name: 'Paused', value: pausedThresholds, color: '#D97706' }
  ].filter(item => item.value > 0);

  // Type distribution data
  const typeDistribution = thresholds.reduce((acc, threshold) => {
    acc[threshold.type] = (acc[threshold.type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.entries(typeDistribution).map(([type, count]) => ({
    type,
    count,
    percentage: ((count / totalThresholds) * 100).toFixed(1)
  }));

  // Cryptocurrency distribution
  const cryptoDistribution = thresholds.reduce((acc, threshold) => {
    acc[threshold.cryptocurrency] = (acc[threshold.cryptocurrency] || 0) + 1;
    return acc;
  }, {});

  const cryptoData = Object.entries(cryptoDistribution)
    .map(([crypto, count]) => ({ crypto, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-xs text-text-tertiary mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color.replace('text-', 'bg-').replace(/\d+$/, '-100')}`}>
          <Icon name={icon} size={24} className={color} />
        </div>
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-3">
          <p className="text-sm font-medium text-text-primary">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4">
        <StatCard
          title="Total Thresholds"
          value={totalThresholds}
          icon="Target"
          color="text-primary"
          subtitle="All configured thresholds"
        />
        
        <StatCard
          title="Active"
          value={activeThresholds}
          icon="CheckCircle"
          color="text-success"
          subtitle={`${((activeThresholds / totalThresholds) * 100).toFixed(1)}% of total`}
        />
        
        <StatCard
          title="Triggered"
          value={triggeredThresholds}
          icon="AlertTriangle"
          color="text-error"
          subtitle="Require attention"
        />
        
        <StatCard
          title="Paused"
          value={pausedThresholds}
          icon="Pause"
          color="text-warning"
          subtitle="Temporarily disabled"
        />
      </div>

      {/* Status Distribution Chart */}
      {statusData.length > 0 && (
        <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Status Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-text-secondary">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Type Distribution */}
      <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Threshold Types</h3>
        <div className="space-y-3">
          {typeData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-sm font-medium text-text-primary">{item.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">{item.count}</span>
                <span className="text-xs text-text-tertiary">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Cryptocurrencies */}
      <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Top Cryptocurrencies</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cryptoData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="crypto" 
                tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                axisLine={{ stroke: 'var(--color-border)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                axisLine={{ stroke: 'var(--color-border)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="TrendingUp" size={16} className="text-success mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {((activeThresholds / totalThresholds) * 100).toFixed(1)}% Active Rate
              </p>
              <p className="text-xs text-text-secondary">
                Most thresholds are actively monitoring
              </p>
            </div>
          </div>
          
          {triggeredThresholds > 0 && (
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {triggeredThresholds} Alert{triggeredThresholds !== 1 ? 's' : ''} Triggered
                </p>
                <p className="text-xs text-text-secondary">
                  Immediate attention required
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start space-x-3">
            <Icon name="BarChart3" size={16} className="text-accent mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {Object.keys(cryptoDistribution).length} Cryptocurrencies
              </p>
              <p className="text-xs text-text-secondary">
                Diversified monitoring coverage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThresholdStats;
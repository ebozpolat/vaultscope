import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsTable = ({ alerts, onAcknowledge, onResolve, selectedAlerts, onSelectAlert, onSelectAll }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

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
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleRowClick = (alert) => {
    navigate('/alert-details', { state: { alertId: alert.id } });
  };

  const sortedAlerts = React.useMemo(() => {
    const sorted = [...alerts].sort((a, b) => {
      if (sortConfig.key === 'timestamp') {
        const aTime = new Date(a.timestamp).getTime();
        const bTime = new Date(b.timestamp).getTime();
        return sortConfig.direction === 'asc' ? aTime - bTime : bTime - aTime;
      }
      
      if (sortConfig.key === 'currentPrice' || sortConfig.key === 'thresholdValue') {
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      }
      
      const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
      const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
      
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
    
    return sorted;
  }, [alerts, sortConfig]);

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-quaternary" />;
    }
    return (
      <Icon 
        name={sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
        size={14} 
        className="text-primary" 
      />
    );
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1 overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-secondary border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedAlerts.length === alerts.length && alerts.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('timestamp')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Timestamp</span>
                  <SortIcon column="timestamp" />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('cryptocurrency')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Cryptocurrency</span>
                  <SortIcon column="cryptocurrency" />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('alertType')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Alert Type</span>
                  <SortIcon column="alertType" />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('severity')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Severity</span>
                  <SortIcon column="severity" />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('currentPrice')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Current Price</span>
                  <SortIcon column="currentPrice" />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('thresholdValue')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Threshold</span>
                  <SortIcon column="thresholdValue" />
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-text-secondary">Actions</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {sortedAlerts.map((alert) => (
              <tr
                key={alert.id}
                className={`
                  hover:bg-background-secondary transition-colors duration-200 cursor-pointer
                  ${alert.severity.toLowerCase() === 'critical' ? 'bg-error-50 animate-pulse-subtle' : ''}
                  ${selectedAlerts.includes(alert.id) ? 'bg-primary-50' : ''}
                `}
                onClick={() => handleRowClick(alert)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedAlerts.includes(alert.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onSelectAlert(alert.id);
                    }}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </td>
                
                <td className="px-4 py-3">
                  <div className="text-sm text-text-primary font-medium">
                    {formatTimestamp(alert.timestamp)}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {alert.cryptocurrency.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">
                        {alert.cryptocurrency}
                      </div>
                      <div className="text-xs text-text-tertiary">
                        {alert.symbol}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getAlertTypeIcon(alert.alertType)} 
                      size={16} 
                      className="text-text-secondary" 
                    />
                    <span className="text-sm text-text-primary capitalize">
                      {alert.alertType.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${getSeverityColor(alert.severity)}
                  `}>
                    {alert.severity}
                  </span>
                </td>
                
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-text-primary">
                    {formatPrice(alert.currentPrice)}
                  </div>
                  <div className={`text-xs ${
                    alert.priceChange >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {alert.priceChange >= 0 ? '+' : ''}{alert.priceChange.toFixed(2)}%
                  </div>
                </td>
                
                <td className="px-4 py-3">
                  <div className="text-sm text-text-primary">
                    {formatPrice(alert.thresholdValue)}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {alert.thresholdType}
                  </div>
                </td>
                
                <td className="px-4 py-3">
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
                          Ack
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
                      <span className="text-xs text-success font-medium">
                        Acknowledged
                      </span>
                    )}
                    
                    {alert.status === 'resolved' && (
                      <span className="text-xs text-text-tertiary font-medium">
                        Resolved
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
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

export default AlertsTable;
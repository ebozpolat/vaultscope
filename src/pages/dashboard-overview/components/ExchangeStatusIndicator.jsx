import React from 'react';
import Icon from '../../../components/AppIcon';

const ExchangeStatusIndicator = ({ connectionStatus, lastUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'disconnected':
        return 'text-text-tertiary';
      case 'error':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'disconnected':
        return 'Circle';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const formatLastUpdate = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffMs = now - updateTime;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 60) {
      return `${diffSecs}s ago`;
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else {
      return updateTime.toLocaleTimeString();
    }
  };

  const exchanges = [
    { key: 'okx', name: 'OKX', color: 'text-blue-500' },
    { key: 'gateio', name: 'Gate.io', color: 'text-green-500' },
    { key: 'binance', name: 'Binance', color: 'text-yellow-500' }
  ];

  const connectedCount = Object.values(connectionStatus || {})
    .filter(status => status === 'connected').length;

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Icon name="Wifi" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Exchange Status</h3>
            <p className="text-sm text-text-secondary">
              {connectedCount} of {exchanges.length} exchanges connected
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectedCount === exchanges.length ? 'bg-success' : 
            connectedCount > 0 ? 'bg-warning' : 'bg-error'
          } ${connectedCount > 0 ? 'animate-pulse' : ''}`}></div>
          <span className="text-sm text-text-secondary">
            {connectedCount === exchanges.length ? 'All Connected' : 
             connectedCount > 0 ? 'Partial' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {exchanges.map((exchange) => {
          const status = connectionStatus?.[exchange.key] || 'disconnected';
          const lastUpd = lastUpdate?.[exchange.key];
          
          return (
            <div key={exchange.key} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getStatusIcon(status)} 
                  size={16} 
                  className={getStatusColor(status)} 
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">{exchange.name}</p>
                  <p className={`text-xs ${getStatusColor(status)}`}>
                    {getStatusText(status)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-text-tertiary">
                  {formatLastUpdate(lastUpd)}
                </p>
                {status === 'connected' && (
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-xs text-success">Live</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Connection Quality Indicator */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Connection Quality</span>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={`w-1 h-3 rounded-full ${
                    bar <= connectedCount ? 'bg-success' : 'bg-background-tertiary'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-text-tertiary">
              {connectedCount === exchanges.length ? 'Excellent' : 
               connectedCount >= 2 ? 'Good' : 
               connectedCount === 1 ? 'Fair' : 'Poor'}
            </span>
          </div>
        </div>
      </div>

      {/* Troubleshooting Info */}
      {connectedCount < exchanges.length && (
        <div className="mt-4 p-3 bg-warning-100 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning">Connection Issues</p>
              <p className="text-xs text-warning-700 mt-1">
                Some exchanges are not connected. Check your internet connection and API credentials.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeStatusIndicator;
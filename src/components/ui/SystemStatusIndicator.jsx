import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const SystemStatusIndicator = ({ 
  position = 'header', 
  showLabel = true, 
  size = 'md',
  className = '' 
}) => {
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [dataStreamStatus, setDataStreamStatus] = useState('active');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Simulate WebSocket connection monitoring
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      const statuses = ['connected', 'disconnected', 'reconnecting'];
      const weights = [0.85, 0.05, 0.1]; // 85% connected, 5% disconnected, 10% reconnecting
      
      const random = Math.random();
      let cumulativeWeight = 0;
      let selectedStatus = 'connected';
      
      for (let i = 0; i < statuses.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
          selectedStatus = statuses[i];
          break;
        }
      }
      
      setConnectionStatus(prev => {
        if (prev !== selectedStatus) {
          setLastUpdate(Date.now());
          if (selectedStatus === 'reconnecting') {
            setReconnectAttempts(prev => prev + 1);
          } else if (selectedStatus === 'connected') {
            setReconnectAttempts(0);
          }
        }
        return selectedStatus;
      });
    }, 30000);

    return () => clearInterval(connectionInterval);
  }, []);

  // Simulate data stream monitoring
  useEffect(() => {
    const streamInterval = setInterval(() => {
      const streamStatuses = ['active', 'slow', 'stalled'];
      const streamWeights = [0.8, 0.15, 0.05];
      
      const random = Math.random();
      let cumulativeWeight = 0;
      let selectedStatus = 'active';
      
      for (let i = 0; i < streamStatuses.length; i++) {
        cumulativeWeight += streamWeights[i];
        if (random <= cumulativeWeight) {
          selectedStatus = streamStatuses[i];
          break;
        }
      }
      
      setDataStreamStatus(selectedStatus);
    }, 10000);

    return () => clearInterval(streamInterval);
  }, []);

  const getOverallStatus = () => {
    if (connectionStatus === 'disconnected') return 'disconnected';
    if (connectionStatus === 'reconnecting') return 'reconnecting';
    if (dataStreamStatus === 'stalled') return 'warning';
    if (dataStreamStatus === 'slow') return 'warning';
    return 'connected';
  };

  const getStatusColor = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'connected':
        return 'text-success';
      case 'disconnected':
        return 'text-error';
      case 'reconnecting':
        return 'text-warning';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-secondary';
    }
  };

  const getStatusIcon = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'connected':
        return 'Wifi';
      case 'disconnected':
        return 'WifiOff';
      case 'reconnecting':
        return 'RotateCw';
      case 'warning':
        return 'AlertTriangle';
      default:
        return 'Wifi';
    }
  };

  const getStatusText = () => {
    const status = getOverallStatus();
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'reconnecting':
        return `Reconnecting${reconnectAttempts > 0 ? ` (${reconnectAttempts})` : ''}`;
      case 'warning':
        return dataStreamStatus === 'slow' ? 'Slow Connection' : 'Data Stalled';
      default:
        return 'Unknown';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'lg': return 20;
      default: return 16;
    }
  };

  const getContainerClasses = () => {
    const baseClasses = 'flex items-center transition-all duration-200 ease-out-smooth';
    
    if (position === 'floating') {
      return `${baseClasses} bg-surface rounded-lg shadow-elevation-2 px-3 py-2`;
    }
    
    return `${baseClasses} px-3 py-1 rounded-lg bg-background-secondary`;
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <Icon
        name={getStatusIcon()}
        size={getIconSize()}
        className={`
          ${getStatusColor()} 
          ${connectionStatus === 'reconnecting' ? 'animate-spin' : ''}
          ${getOverallStatus() === 'warning' ? 'animate-pulse-subtle' : ''}
        `}
      />
      
      {showLabel && (
        <div className="ml-2">
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          
          {position !== 'compact' && (
            <div className="text-xs text-text-tertiary">
              Last: {new Date(lastUpdate).toLocaleTimeString()}
            </div>
          )}
        </div>
      )}

      {/* Status Details Tooltip */}
      {position === 'header' && (
        <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-secondary-800 text-text-inverse text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-elevation-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between space-x-4">
                <span>Connection:</span>
                <span className={getStatusColor()}>{connectionStatus}</span>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <span>Data Stream:</span>
                <span className={dataStreamStatus === 'active' ? 'text-success' : 'text-warning'}>
                  {dataStreamStatus}
                </span>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <span>Last Update:</span>
                <span>{new Date(lastUpdate).toLocaleTimeString()}</span>
              </div>
              {reconnectAttempts > 0 && (
                <div className="flex items-center justify-between space-x-4">
                  <span>Attempts:</span>
                  <span className="text-warning">{reconnectAttempts}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemStatusIndicator;
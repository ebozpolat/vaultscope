import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const AlertNotificationBadge = ({ 
  position = 'header', 
  showLabel = true, 
  size = 'md',
  className = '' 
}) => {
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(3);
  const [criticalAlerts, setCriticalAlerts] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Simulate real-time WebSocket alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlerts = Math.floor(Math.random() * 3);
      const newCritical = Math.floor(Math.random() * 2);
      
      setAlertCount(prev => {
        const newCount = Math.max(0, prev + newAlerts - 1);
        if (newCount !== prev) {
          setIsAnimating(true);
          setLastUpdate(Date.now());
          setTimeout(() => setIsAnimating(false), 1000);
        }
        return newCount;
      });
      
      setCriticalAlerts(prev => Math.max(0, prev + newCritical - 1));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleAlertClick = () => {
    navigate('/real-time-alerts');
  };

  const getBadgeColor = () => {
    if (criticalAlerts > 0) return 'bg-error text-error-foreground';
    if (alertCount > 0) return 'bg-warning text-warning-foreground';
    return 'bg-success text-success-foreground';
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 24;
      default: return 20;
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4 text-xs';
      case 'lg': return 'h-6 w-6 text-sm';
      default: return 'h-5 w-5 text-xs';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'sm';
      case 'lg': return 'lg';
      default: return 'md';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size={getButtonSize()}
        onClick={handleAlertClick}
        className={`
          relative transition-all duration-200 ease-out-smooth
          ${position === 'floating' ? 'shadow-elevation-3 bg-surface' : ''}
          ${isAnimating ? 'scale-110' : 'scale-100'}
          text-text-secondary hover:text-text-primary
        `}
        iconName="Bell"
        iconSize={getIconSize()}
      >
        {showLabel && position !== 'header' && (
          <span className="ml-2 font-medium">Alerts</span>
        )}
      </Button>

      {/* Alert Count Badge */}
      {alertCount > 0 && (
        <span className={`
          absolute -top-1 -right-1 ${getBadgeColor()} ${getBadgeSize()}
          font-medium rounded-full flex items-center justify-center
          transition-all duration-300 ease-out-smooth
          ${isAnimating ? 'animate-pulse-subtle scale-110' : 'scale-100'}
          ${criticalAlerts > 0 ? 'animate-pulse' : ''}
        `}>
          {alertCount > 99 ? '99+' : alertCount}
        </span>
      )}

      {/* Critical Alert Indicator */}
      {criticalAlerts > 0 && (
        <span className="absolute -top-2 -right-2 w-3 h-3 bg-error rounded-full animate-ping" />
      )}

      {/* Tooltip for additional context */}
      {position === 'header' && (
        <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-secondary-800 text-text-inverse text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-elevation-3">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={12} className="text-warning" />
              <span>
                {alertCount} active alert{alertCount !== 1 ? 's' : ''}
                {criticalAlerts > 0 && ` (${criticalAlerts} critical)`}
              </span>
            </div>
            <div className="text-xs text-text-quaternary mt-1">
              Last update: {new Date(lastUpdate).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertNotificationBadge;
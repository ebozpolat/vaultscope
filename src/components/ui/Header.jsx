import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const [alertCount, setAlertCount] = useState(3);
  const [systemStatus, setSystemStatus] = useState('connected');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulate real-time alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAlertCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Simulate system status monitoring
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const statuses = ['connected', 'disconnected', 'reconnecting'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setSystemStatus(randomStatus);
    }, 60000);

    return () => clearInterval(statusInterval);
  }, []);

  const getSystemStatusColor = () => {
    switch (systemStatus) {
      case 'connected':
        return 'text-success';
      case 'disconnected':
        return 'text-error';
      case 'reconnecting':
        return 'text-warning';
      default:
        return 'text-secondary';
    }
  };

  const getSystemStatusIcon = () => {
    switch (systemStatus) {
      case 'connected':
        return 'Wifi';
      case 'disconnected':
        return 'WifiOff';
      case 'reconnecting':
        return 'RotateCw';
      default:
        return 'Wifi';
    }
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
    // Implement quick action logic
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-surface border-b border-border shadow-elevation-1">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-text-primary">VaultScope</h1>
              <p className="text-xs text-text-secondary -mt-1">Crypto Surveillance</p>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={toggleMobileMenu}
            iconName="Menu"
            iconSize={20}
          />
        </div>

        {/* Quick Actions and Status */}
        <div className="flex items-center space-x-4">
          {/* Quick Action Toolbar */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('new-threshold')}
              iconName="Plus"
              iconSize={16}
              className="text-text-secondary hover:text-text-primary"
            >
              <span className="hidden lg:inline ml-1">New Threshold</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('refresh-data')}
              iconName="RefreshCw"
              iconSize={16}
              className="text-text-secondary hover:text-text-primary"
            />
          </div>

          {/* Alert Notification Badge */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('view-alerts')}
              iconName="Bell"
              iconSize={20}
              className="text-text-secondary hover:text-text-primary"
            />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center animate-pulse-subtle">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </div>

          {/* System Status Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-background-secondary">
            <Icon
              name={getSystemStatusIcon()}
              size={16}
              className={`${getSystemStatusColor()} ${systemStatus === 'reconnecting' ? 'animate-spin' : ''}`}
            />
            <span className="hidden sm:inline text-sm font-medium text-text-secondary capitalize">
              {systemStatus}
            </span>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="User" size={16} className="text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-text-primary">Admin</p>
              <p className="text-xs text-text-secondary -mt-1">Risk Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-surface-secondary">
          <div className="flex items-center justify-around py-3 px-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('new-threshold')}
              iconName="Plus"
              iconSize={16}
              className="flex-col space-y-1"
            >
              <span className="text-xs">New</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('refresh-data')}
              iconName="RefreshCw"
              iconSize={16}
              className="flex-col space-y-1"
            >
              <span className="text-xs">Refresh</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction('settings')}
              iconName="Settings"
              iconSize={16}
              className="flex-col space-y-1"
            >
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
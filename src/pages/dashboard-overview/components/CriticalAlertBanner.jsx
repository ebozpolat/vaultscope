import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CriticalAlertBanner = () => {
  const navigate = useNavigate();
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Mock critical alerts data
    const mockCriticalAlerts = [
      {
        id: 1,
        type: 'price_threshold',
        cryptocurrency: 'Bitcoin',
        symbol: 'BTC',
        message: 'Price dropped below critical threshold of $65,000',
        severity: 'critical',
        timestamp: new Date(Date.now() - 180000),
        action: 'immediate_attention',
        impact: 'high'
      },
      {
        id: 2,
        type: 'system_failure',
        cryptocurrency: 'System',
        symbol: 'SYS',
        message: 'WebSocket connection lost - Real-time data unavailable',
        severity: 'critical',
        timestamp: new Date(Date.now() - 300000),
        action: 'system_check',
        impact: 'critical'
      }
    ];

    setCriticalAlerts(mockCriticalAlerts);
    setIsVisible(mockCriticalAlerts.length > 0);

    // Auto-rotate through critical alerts
    if (mockCriticalAlerts.length > 1) {
      const rotationInterval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentAlertIndex(prev => (prev + 1) % mockCriticalAlerts.length);
          setIsAnimating(false);
        }, 200);
      }, 5000);

      return () => clearInterval(rotationInterval);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleViewDetails = () => {
    const currentAlert = criticalAlerts[currentAlertIndex];
    navigate(`/alert-details?id=${currentAlert.id}`);
  };

  const handleAcknowledge = () => {
    const updatedAlerts = criticalAlerts.filter((_, index) => index !== currentAlertIndex);
    setCriticalAlerts(updatedAlerts);
    
    if (updatedAlerts.length === 0) {
      setIsVisible(false);
    } else {
      setCurrentAlertIndex(0);
    }
  };

  const handleViewAllAlerts = () => {
    navigate('/real-time-alerts');
  };

  if (!isVisible || criticalAlerts.length === 0) {
    return null;
  }

  const currentAlert = criticalAlerts[currentAlertIndex];

  const getAlertIcon = () => {
    switch (currentAlert.type) {
      case 'price_threshold':
        return 'TrendingDown';
      case 'system_failure':
        return 'AlertTriangle';
      case 'volatility':
        return 'Activity';
      default:
        return 'AlertCircle';
    }
  };

  const getImpactColor = () => {
    switch (currentAlert.impact) {
      case 'critical':
        return 'text-error';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-accent';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="fixed top-16 left-0 right-0 z-[800] bg-error text-error-foreground shadow-elevation-3 border-b-2 border-error-700">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Alert Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-error-700 rounded-full flex items-center justify-center animate-pulse">
                <Icon name={getAlertIcon()} size={20} className="text-error-foreground" />
              </div>
            </div>

            {/* Alert Content */}
            <div className={`flex-1 transition-all duration-200 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
              <div className="flex items-center space-x-3 mb-1">
                <span className="font-bold text-sm">CRITICAL ALERT</span>
                <span className="text-xs bg-error-700 px-2 py-1 rounded-full">
                  {currentAlert.cryptocurrency}
                </span>
                <span className={`text-xs font-medium ${getImpactColor()}`}>
                  {currentAlert.impact.toUpperCase()} IMPACT
                </span>
              </div>
              
              <p className="text-sm font-medium mb-1">{currentAlert.message}</p>
              
              <div className="flex items-center space-x-4 text-xs opacity-90">
                <span>
                  {currentAlert.timestamp.toLocaleTimeString()} • {currentAlert.timestamp.toLocaleDateString()}
                </span>
                {criticalAlerts.length > 1 && (
                  <span>
                    Alert {currentAlertIndex + 1} of {criticalAlerts.length}
                  </span>
                )}
              </div>
            </div>

            {/* Progress Indicator for Multiple Alerts */}
            {criticalAlerts.length > 1 && (
              <div className="hidden md:flex items-center space-x-1">
                {criticalAlerts.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentAlertIndex ? 'bg-error-foreground' : 'bg-error-700'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAcknowledge}
              className="text-error-foreground hover:bg-error-700 border border-error-700"
            >
              <Icon name="Check" size={16} />
              <span className="hidden sm:inline ml-2">Acknowledge</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className="text-error-foreground hover:bg-error-700 border border-error-700"
            >
              <Icon name="ExternalLink" size={16} />
              <span className="hidden sm:inline ml-2">Details</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewAllAlerts}
              className="text-error-foreground hover:bg-error-700 border border-error-700"
            >
              <Icon name="List" size={16} />
              <span className="hidden lg:inline ml-2">All Alerts</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-error-foreground hover:bg-error-700"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Mobile Action Bar */}
        <div className="md:hidden mt-3 pt-3 border-t border-error-700">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAcknowledge}
              className="text-error-foreground hover:bg-error-700 border border-error-700 flex-1"
            >
              <Icon name="Check" size={16} />
              <span className="ml-2">Acknowledge</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleViewDetails}
              className="text-error-foreground hover:bg-error-700 border border-error-700 flex-1"
            >
              <Icon name="ExternalLink" size={16} />
              <span className="ml-2">View Details</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertBanner;
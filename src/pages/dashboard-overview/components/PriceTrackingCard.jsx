import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PriceTrackingCard = ({ crypto }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    // Store sparkline data if available from static data
    if (crypto?.sparkline && crypto.sparkline.length > 0) {
      const history = crypto.sparkline.map((price, index) => ({
        time: Date.now() - (crypto.sparkline.length - index) * 3600000, // hourly intervals
        price: price
      }));
      setPriceHistory(history);
    }
  }, [crypto?.sparkline]);

  const getRiskColor = () => {
    if (crypto?.riskLevel === 'high') return 'text-error';
    if (crypto?.riskLevel === 'medium') return 'text-warning';
    return 'text-success';
  };

  const getRiskBgColor = () => {
    if (crypto?.riskLevel === 'high') return 'bg-error-50 border-error-200';
    if (crypto?.riskLevel === 'medium') return 'bg-warning-50 border-warning-200';
    return 'bg-success-50 border-success-200';
  };

  const getChangeColor = () => {
    return crypto?.change24h >= 0 ? 'text-success' : 'text-error';
  };

  const getChangeIcon = () => {
    return crypto?.change24h >= 0 ? 'TrendingUp' : 'TrendingDown';
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    
    if (crypto?.symbol === 'ADA' || price < 1) {
      return `$${price.toFixed(4)}`;
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatLargeNumber = (num) => {
    if (!num) return '0';
    
    if (num >= 1e12) {
      return (num / 1e12).toFixed(1) + 'T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  if (!crypto) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-2">
        <div className="flex items-center justify-center h-32">
          <Icon name="RotateCw" size={20} className="text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-lg border-2 ${getRiskBgColor()} p-6 shadow-elevation-2 transition-all duration-300 hover:shadow-elevation-3`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {crypto.image ? (
            <img 
              src={crypto.image} 
              alt={crypto.name} 
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
            style={{ display: crypto.image ? 'none' : 'flex' }}
          >
            <span className="text-primary font-bold text-sm">{crypto.symbol}</span>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{crypto.name}</h3>
            <p className="text-sm text-text-secondary">{crypto.symbol}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor()} ${getRiskBgColor()}`}>
          {crypto.riskLevel?.toUpperCase() || 'LOW'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-text-primary">
              {formatPrice(crypto.price)}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Icon name={getChangeIcon()} size={16} className={getChangeColor()} />
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h?.toFixed(2) || '0.00'}%
              </span>
              <span className="text-text-tertiary text-sm">24h</span>
            </div>
          </div>
          
          {isLoading && (
            <div className="flex items-center space-x-2">
              <Icon name="RotateCw" size={16} className="text-primary animate-spin" />
              <span className="text-xs text-text-secondary">Updating...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-text-tertiary">Volume 24h</p>
            <p className="text-sm font-medium text-text-primary">
              ${formatLargeNumber(crypto.volume24h)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Market Cap</p>
            <p className="text-sm font-medium text-text-primary">
              ${formatLargeNumber(crypto.marketCap)}
            </p>
          </div>
        </div>

        {/* Static data indicator */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-info rounded-full"></div>
            <span className="text-xs text-text-tertiary">Static data</span>
          </div>
          
          {crypto.lastUpdated && (
            <span className="text-xs text-text-tertiary">
              {new Date(crypto.lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="TrendingUp"
            iconSize={14}
            className="text-text-secondary hover:text-text-primary"
          >
            View Chart
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconSize={14}
            className="text-text-secondary hover:text-text-primary"
          >
            Set Alert
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceTrackingCard;
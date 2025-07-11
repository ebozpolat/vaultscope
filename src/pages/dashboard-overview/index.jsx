import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import PriceTrackingCard from './components/PriceTrackingCard';
import AlertsSummaryPanel from './components/AlertsSummaryPanel';
import SystemHealthIndicator from './components/SystemHealthIndicator';
import PriceTrendChart from './components/PriceTrendChart';
import KeyPerformanceIndicators from './components/KeyPerformanceIndicators';
import CriticalAlertBanner from './components/CriticalAlertBanner';
import QuickActionPanel from './components/QuickActionPanel';
import Icon from '../../components/AppIcon';
import { useCryptoPrices, useGlobalMarketData } from '../../hooks/useStaticCryptoData';

const DashboardOverview = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Fetch static cryptocurrency data
  const { 
    data: cryptoData, 
    loading: isLoading, 
    error: apiError,
    lastUpdate: dataLastUpdate 
  } = useCryptoPrices(['bitcoin', 'ethereum', 'cardano', 'solana']);

  // Fetch static global market data
  const { 
    data: globalData, 
    loading: globalLoading 
  } = useGlobalMarketData();

  // Update last update time when data changes
  useEffect(() => {
    if (dataLastUpdate) {
      setLastUpdate(dataLastUpdate);
    }
  }, [dataLastUpdate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <div className="lg:ml-60 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-3">
              <Icon name="RotateCw" size={24} className="text-primary animate-spin" />
              <span className="text-lg text-text-secondary">Loading market data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <CriticalAlertBanner />
      
      <main className="lg:ml-60 pt-16">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <NavigationBreadcrumbs />
              <h1 className="text-2xl font-bold text-text-primary mt-2">Dashboard Overview</h1>
              <p className="text-text-secondary">
                Real-time crypto risk surveillance and monitoring
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-text-tertiary">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              {apiError && (
                <div className="flex items-center space-x-1 text-info">
                  <Icon name="Info" size={14} />
                  <span className="text-xs">Static Data</span>
                </div>
              )}
            </div>
          </div>

          {/* Key Performance Indicators */}
          <KeyPerformanceIndicators />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Price Tracking Cards */}
            <div className="xl:col-span-2 space-y-6">
              {/* Price Tracking Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cryptoData?.map((crypto) => (
                  <PriceTrackingCard key={crypto.id} crypto={crypto} />
                ))}
              </div>

              {/* Price Trend Chart */}
              <PriceTrendChart />
            </div>

            {/* Right Column - Alerts and System Info */}
            <div className="space-y-6">
              <AlertsSummaryPanel />
              <SystemHealthIndicator />
              <QuickActionPanel />
            </div>
          </div>

          {/* Additional Dashboard Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Overview Widget */}
            <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                    <Icon name="Globe" size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Market Overview</h3>
                    <p className="text-sm text-text-secondary">Global crypto market status</p>
                  </div>
                </div>
                {globalLoading && (
                  <Icon name="RotateCw" size={16} className="text-primary animate-spin" />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-background-secondary rounded-lg">
                  <p className="text-sm text-text-secondary">Total Market Cap</p>
                  <p className="text-xl font-bold text-text-primary">
                    ${globalData?.total_market_cap?.usd ? 
                      (globalData.total_market_cap.usd / 1e12).toFixed(1) + 'T' : '2.1T'
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <Icon name={globalData?.market_cap_change_percentage_24h_usd >= 0 ? "TrendingUp" : "TrendingDown"} size={14} className={globalData?.market_cap_change_percentage_24h_usd >= 0 ? "text-success" : "text-error"} />
                    <span className={`text-sm ${globalData?.market_cap_change_percentage_24h_usd >= 0 ? "text-success" : "text-error"}`}>
                      {globalData?.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}{globalData?.market_cap_change_percentage_24h_usd?.toFixed(1) || '2.4'}%
                    </span>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-background-secondary rounded-lg">
                  <p className="text-sm text-text-secondary">24h Volume</p>
                  <p className="text-xl font-bold text-text-primary">
                    ${globalData?.total_volume?.usd ? 
                      (globalData.total_volume.usd / 1e9).toFixed(1) + 'B' : '89.2B'
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <Icon name="TrendingDown" size={14} className="text-error" />
                    <span className="text-sm text-error">-1.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Widget */}
            <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                    <Icon name="Activity" size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
                    <p className="text-sm text-text-secondary">Latest system events</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-background-secondary rounded-lg">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">Static Data Optimized</p>
                    <p className="text-xs text-text-secondary">Performance improvement completed</p>
                  </div>
                  <span className="text-xs text-text-tertiary">Active</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-background-secondary rounded-lg">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">Alert acknowledged</p>
                    <p className="text-xs text-text-secondary">ETH volatility alert resolved</p>
                  </div>
                  <span className="text-xs text-text-tertiary">5m ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-background-secondary rounded-lg">
                  <Icon name="Settings" size={16} className="text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">Performance optimized</p>
                    <p className="text-xs text-text-secondary">System performance improved</p>
                  </div>
                  <span className="text-xs text-text-tertiary">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardOverview;
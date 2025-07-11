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
import { useMultiExchangeData } from '../../hooks/useMultiExchangeData';
import { useCoinGeckoData } from '../../hooks/useCoinGeckoData';
import { useCryptoPrices, useGlobalMarketData } from '../../hooks/useStaticCryptoData';

const DashboardOverview = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [dataSource, setDataSource] = useState('loading');
  
  // Tier 1: Multi-exchange real-time data (best)
  const { 
    data: multiExchangeData, 
    loading: multiExchangeLoading, 
    error: multiExchangeError,
    connectionStatus: multiExchangeConnectionStatus
  } = useMultiExchangeData({
    autoInit: true,
    retryOnError: true,
    maxRetryAttempts: 2,
    retryDelay: 3000
  });

  // Tier 2: CoinGecko real-time data (good fallback)
  const { 
    data: coinGeckoData, 
    loading: coinGeckoLoading, 
    error: coinGeckoError,
    connectionStatus: coinGeckoConnectionStatus
  } = useCoinGeckoData(['bitcoin', 'ethereum', 'cardano', 'solana'], 60000);

  // Tier 3: Static data (last resort)
  const { 
    data: staticCryptoData, 
    loading: staticLoading, 
    error: staticError,
    lastUpdate: staticDataLastUpdate 
  } = useCryptoPrices(['bitcoin', 'ethereum', 'cardano', 'solana']);

  // Fetch global market data
  const { 
    data: globalData, 
    loading: globalLoading 
  } = useGlobalMarketData();

  // Determine the best available data source
  const determineDataSource = () => {
    // Tier 1: Multi-exchange data (if available and working)
    if (multiExchangeConnectionStatus?.activeConnections > 0 && 
        !multiExchangeError && 
        multiExchangeData?.aggregated?.length > 0) {
      return 'multi-exchange';
    }
    
    // Tier 2: CoinGecko data (if available and working)
    if (coinGeckoConnectionStatus === 'connected' && 
        !coinGeckoError && 
        coinGeckoData?.length > 0) {
      return 'coingecko';
    }
    
    // Tier 3: Static data (fallback)
    return 'static';
  };

  const currentDataSource = determineDataSource();
  const isLoading = currentDataSource === 'multi-exchange' ? multiExchangeLoading :
                   currentDataSource === 'coingecko' ? coinGeckoLoading :
                   staticLoading;

  const apiError = currentDataSource === 'multi-exchange' ? multiExchangeError :
                  currentDataSource === 'coingecko' ? coinGeckoError :
                  staticError;

  // Update data source state
  useEffect(() => {
    setDataSource(currentDataSource);
  }, [currentDataSource]);

  // Update last update time when data changes
  useEffect(() => {
    if (currentDataSource === 'multi-exchange' && multiExchangeData?.summary?.lastUpdate) {
      const latestUpdate = Object.values(multiExchangeData.summary.lastUpdate)
        .filter(Boolean)
        .sort((a, b) => new Date(b) - new Date(a))[0];
      if (latestUpdate) {
        setLastUpdate(new Date(latestUpdate));
      }
    } else if (currentDataSource === 'coingecko' && coinGeckoData?.length > 0) {
      setLastUpdate(new Date());
    } else if (staticDataLastUpdate) {
      setLastUpdate(staticDataLastUpdate);
    }
  }, [currentDataSource, multiExchangeData, coinGeckoData, staticDataLastUpdate]);

  // Transform real-time exchange data to match component expectations
  const transformRealTimeData = (exchangeData) => {
    if (!exchangeData?.aggregated || !Array.isArray(exchangeData.aggregated)) {
      return [];
    }

    return exchangeData.aggregated.map(item => {
      // Map common symbols to crypto IDs and names
      const symbolMap = {
        'BTCUSDT': { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
        'ETHUSDT': { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
        'ADAUSDT': { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
        'SOLUSDT': { id: 'solana', name: 'Solana', symbol: 'SOL' },
        'BNBUSDT': { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
        'XRPUSDT': { id: 'xrp', name: 'XRP', symbol: 'XRP' },
        'DOGEUSDT': { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
        'MATICUSDT': { id: 'polygon', name: 'Polygon', symbol: 'MATIC' }
      };

      const cryptoInfo = symbolMap[item.symbol] || {
        id: item.symbol?.toLowerCase(),
        name: item.symbol?.replace('USDT', ''),
        symbol: item.symbol?.replace('USDT', '')
      };

      // Calculate risk level based on price change
      const change24h = parseFloat(item.priceChangePercent || item.change24h || 0);
      let riskLevel = 'low';
      if (Math.abs(change24h) > 10) riskLevel = 'high';
      else if (Math.abs(change24h) > 5) riskLevel = 'medium';

      return {
        id: cryptoInfo.id,
        name: cryptoInfo.name,
        symbol: cryptoInfo.symbol,
        price: parseFloat(item.lastPrice || item.price || 0),
        change24h: change24h,
        volume24h: parseFloat(item.volume || item.baseVolume || 0),
        marketCap: parseFloat(item.marketCap || 0),
        riskLevel: riskLevel,
        image: `https://assets.coingecko.com/coins/images/${getCoinImageId(cryptoInfo.id)}/small/${cryptoInfo.id}.png`,
        sparkline: [], // Real-time sparkline data would need separate API calls
        lastUpdated: item.timestamp || Date.now()
      };
    });
  };

  // Helper function to get CoinGecko image IDs
  const getCoinImageId = (coinId) => {
    const imageMap = {
      'bitcoin': '1',
      'ethereum': '279',
      'cardano': '975',
      'solana': '4128',
      'binancecoin': '825',
      'xrp': '44',
      'dogecoin': '5',
      'polygon': '4713'
    };
    return imageMap[coinId] || '1';
  };

  // Process the data based on source
  const processedCryptoData = currentDataSource === 'multi-exchange' 
    ? transformRealTimeData(multiExchangeData)
    : currentDataSource === 'coingecko' 
    ? coinGeckoData
    : staticCryptoData;

  if (isLoading) {
    const loadingMessage = currentDataSource === 'multi-exchange' 
      ? "Connecting to exchanges for real-time data..." 
      : currentDataSource === 'coingecko'
      ? "Loading real-time data from CoinGecko..."
      : "Loading market data...";
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <div className="lg:ml-60 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-3">
              <Icon name="RotateCw" size={24} className="text-primary animate-spin" />
              <span className="text-lg text-text-secondary">{loadingMessage}</span>
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
              
              {/* Data Source Indicator */}
              {currentDataSource === 'multi-exchange' ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="Wifi" size={14} />
                    <span className="text-xs font-medium">Live Data</span>
                  </div>
                  <div className="text-xs text-text-tertiary">
                    ({multiExchangeConnectionStatus?.activeConnections || 0} exchanges)
                  </div>
                </div>
              ) : currentDataSource === 'coingecko' ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-info rounded-full animate-pulse"></div>
                  <div className="flex items-center space-x-1 text-info">
                    <Icon name="Globe" size={14} />
                    <span className="text-xs font-medium">CoinGecko</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="flex items-center space-x-1 text-warning">
                    <Icon name="Database" size={14} />
                    <span className="text-xs font-medium">Static Data</span>
                  </div>
                </div>
              )}
              
              {/* Manual Refresh Button */}
              <button
                onClick={() => window.location.reload()}
                className="p-1 text-text-secondary hover:text-primary transition-colors"
                title="Refresh data"
              >
                <Icon name="RefreshCw" size={16} />
              </button>
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
                {processedCryptoData?.map((crypto) => (
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
        </div>
      </main>
    </div>
  );
};

export default DashboardOverview;
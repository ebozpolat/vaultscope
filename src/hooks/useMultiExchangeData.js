import { useState, useEffect, useCallback, useRef } from 'react';
import multiExchangeAggregator from '../services/multiExchangeAggregator';

// Custom hook for multi-exchange data integration
export const useMultiExchangeData = (options = {}) => {
  const [data, setData] = useState({
    aggregated: [],
    exchanges: {
      okx: [],
      gateio: [],
      binance: []
    },
    summary: {
      totalSymbols: 0,
      totalVolume: 0,
      exchanges: 0,
      connectionStatus: {
        okx: 'disconnected',
        gateio: 'disconnected',
        binance: 'disconnected'
      },
      lastUpdate: {
        okx: null,
        gateio: null,
        binance: null
      }
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({
    okx: 'disconnected',
    gateio: 'disconnected',
    binance: 'disconnected',
    isInitialized: false,
    activeConnections: 0
  });
  
  const isInitializedRef = useRef(false);
  const retryTimeoutRef = useRef(null);
  const { 
    autoInit = true, 
    retryOnError = true,
    maxRetryAttempts = 3,
    retryDelay = 5000 
  } = options;

  // Data update callback
  const handleDataUpdate = useCallback((newData) => {
    try {
      setData(newData);
      setConnectionStatus(multiExchangeAggregator.getConnectionStatus());
      setError(null);
      
      if (loading) {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error handling data update:', err);
      setError(err.message);
    }
  }, [loading]);

  // Initialize aggregator
  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Initializing multi-exchange data hook...');
      
      // Add listener first
      multiExchangeAggregator.addListener(handleDataUpdate);
      
      // Initialize aggregator if not already initialized
      if (!multiExchangeAggregator.isInitialized) {
        await multiExchangeAggregator.initialize();
      }
      
      // Update connection status
      setConnectionStatus(multiExchangeAggregator.getConnectionStatus());
      isInitializedRef.current = true;
      
      console.log('Multi-exchange data hook initialized successfully');
    } catch (err) {
      console.error('Error initializing multi-exchange data:', err);
      setError(err.message);
      setLoading(false);
      
      if (retryOnError) {
        scheduleRetry();
      }
    }
  }, [handleDataUpdate, retryOnError]);

  // Schedule retry
  const scheduleRetry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    
    console.log(`Scheduling retry in ${retryDelay}ms...`);
    retryTimeoutRef.current = setTimeout(() => {
      initialize();
    }, retryDelay);
  }, [initialize, retryDelay]);

  // Manual retry function
  const retry = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    initialize();
  }, [initialize]);

  // Get specific exchange data
  const getExchangeData = useCallback((exchange) => {
    return data.exchanges[exchange] || [];
  }, [data.exchanges]);

  // Get best price for symbol
  const getBestPrice = useCallback((symbol) => {
    return multiExchangeAggregator.getBestPrice(symbol);
  }, []);

  // Get filtered data by criteria
  const getFilteredData = useCallback((filterFn) => {
    return data.aggregated.filter(filterFn);
  }, [data.aggregated]);

  // Get top volume symbols
  const getTopVolumeSymbols = useCallback((limit = 10) => {
    return data.aggregated
      .sort((a, b) => {
        const aMaxVolume = Math.max(...a.map(item => item.volume24h || 0));
        const bMaxVolume = Math.max(...b.map(item => item.volume24h || 0));
        return bMaxVolume - aMaxVolume;
      })
      .slice(0, limit);
  }, [data.aggregated]);

  // Get symbols with high volatility
  const getHighVolatilitySymbols = useCallback((threshold = 10) => {
    return data.aggregated.filter(symbolData => {
      return symbolData.some(item => Math.abs(item.change24h) > threshold);
    });
  }, [data.aggregated]);

  // Initialize on mount
  useEffect(() => {
    if (autoInit && !isInitializedRef.current) {
      initialize();
    }
    
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      
      // Remove listener on unmount
      multiExchangeAggregator.removeListener(handleDataUpdate);
    };
  }, [autoInit, initialize, handleDataUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Data
    data,
    aggregatedData: data.aggregated,
    exchangeData: data.exchanges,
    summary: data.summary,
    
    // Status
    loading,
    error,
    connectionStatus,
    isInitialized: isInitializedRef.current,
    
    // Actions
    initialize,
    retry,
    
    // Utility functions
    getExchangeData,
    getBestPrice,
    getFilteredData,
    getTopVolumeSymbols,
    getHighVolatilitySymbols
  };
};

// Custom hook for specific exchange data
export const useExchangeData = (exchange) => {
  const { data, loading, error, connectionStatus, getExchangeData } = useMultiExchangeData();
  
  const exchangeData = getExchangeData(exchange);
  const exchangeStatus = connectionStatus[exchange] || 'disconnected';
  
  return {
    data: exchangeData,
    loading,
    error,
    connectionStatus: exchangeStatus,
    isConnected: exchangeStatus === 'connected'
  };
};

// Custom hook for price comparison across exchanges
export const usePriceComparison = (symbol) => {
  const { data, loading, error, getBestPrice } = useMultiExchangeData();
  
  const symbolData = data.aggregated.find(items => 
    items.some(item => item.symbol === symbol)
  ) || [];
  
  const bestPrice = getBestPrice(symbol);
  
  const priceComparison = symbolData.map(item => ({
    exchange: item.exchange,
    price: item.price,
    volume: item.volume24h,
    change24h: item.change24h
  }));
  
  return {
    symbolData,
    priceComparison,
    bestPrice,
    loading,
    error,
    hasData: symbolData.length > 0
  };
};

// Custom hook for market overview
export const useMarketOverview = () => {
  const { 
    data, 
    summary, 
    connectionStatus, 
    loading, 
    error,
    getTopVolumeSymbols,
    getHighVolatilitySymbols 
  } = useMultiExchangeData();
  
  const topVolumeSymbols = getTopVolumeSymbols(10);
  const highVolatilitySymbols = getHighVolatilitySymbols(10);
  
  return {
    summary,
    connectionStatus,
    topVolumeSymbols,
    highVolatilitySymbols,
    totalSymbols: data.aggregated.length,
    loading,
    error
  };
};

export default {
  useMultiExchangeData,
  useExchangeData,
  usePriceComparison,
  useMarketOverview
};
import { useState, useEffect, useCallback } from 'react';
import { getMarketData, getGlobalMarketData, checkConnection } from '../services/coingeckoApi';

// Custom hook for fetching real-time cryptocurrency prices from CoinGecko
export const useCoinGeckoData = (coinIds = ['bitcoin', 'ethereum', 'cardano', 'solana'], refreshInterval = 60000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const fetchData = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      setError(null);
      
      console.log(`Fetching real-time data from CoinGecko for ${coinIds.length} coins...`);
      
      // Check connection first
      const connectionCheck = await checkConnection();
      if (connectionCheck.status === 'error') {
        throw new Error(connectionCheck.message);
      }
      
      const marketData = await getMarketData(coinIds);
      
      setData(marketData);
      setLastUpdate(new Date());
      setConnectionStatus('connected');
      
      console.log(`Successfully loaded CoinGecko data for ${marketData.length} coins`);
    } catch (err) {
      console.error('Error in useCoinGeckoData:', err);
      setError(err.message || 'Failed to load real-time data');
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  }, [coinIds]);

  // Manual retry function
  const retry = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData(true);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return {
    data,
    loading,
    error,
    lastUpdate,
    connectionStatus,
    retry
  };
};

// Custom hook for global market data from CoinGecko
export const useCoinGeckoGlobalData = (refreshInterval = 300000) => { // 5 minutes
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchGlobalData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const globalData = await getGlobalMarketData();
      
      setData(globalData);
      setLastUpdate(new Date());
      
      console.log('Successfully loaded CoinGecko global market data');
    } catch (err) {
      console.error('Error fetching global market data:', err);
      setError(err.message || 'Failed to load global market data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGlobalData();
  }, [fetchGlobalData]);

  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchGlobalData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchGlobalData, refreshInterval]);

  return {
    data,
    loading,
    error,
    lastUpdate,
    retry: fetchGlobalData
  };
};
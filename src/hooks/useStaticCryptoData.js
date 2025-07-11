import { useState, useEffect, useCallback } from 'react';
import { getMarketData, getHistoricalPrices, getGlobalMarketData, transformStaticData } from '../services/staticCryptoData';

// Custom hook for fetching current cryptocurrency prices with static data
export const useCryptoPrices = (coinIds = ['bitcoin', 'ethereum', 'cardano', 'solana'], refreshInterval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  const fetchData = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      setError(null);
      
      console.log(`Fetching static market data for ${coinIds.length} coins...`);
      const marketData = await getMarketData(coinIds);
      const transformedData = marketData.map(transformStaticData);
      
      setData(transformedData);
      setLastUpdate(new Date());
      setRetryCount(0);
      setConnectionStatus('connected');
      
      console.log(`Successfully loaded static data for ${transformedData.length} coins`);
    } catch (err) {
      console.error('Error in useCryptoPrices:', err);
      setError('Failed to load static data');
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  }, [coinIds]);

  // Manual retry function
  const retry = useCallback(() => {
    setRetryCount(0);
    fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up refresh interval with static data updates
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData();
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return { 
    data, 
    loading, 
    error, 
    lastUpdate, 
    retryCount, 
    connectionStatus, 
    refetch: fetchData, 
    retry 
  };
};

// Custom hook for fetching historical price data with static data
export const useHistoricalPrices = (coinId, days = 7) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  const fetchData = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      setError(null);
      
      console.log(`Fetching static historical data for ${coinId} (${days} days)...`);
      const historicalData = await getHistoricalPrices(coinId, days);
      
      // Transform data for chart component
      const transformedData = historicalData.prices?.map(([timestamp, price], index) => ({
        time: formatTimeLabel(timestamp, days, index),
        price: price,
        volume: historicalData.total_volumes?.[index]?.[1] || 0,
        timestamp: timestamp
      })) || [];
      
      setData(transformedData);
      setRetryCount(0);
      setConnectionStatus('connected');
      
      console.log(`Successfully loaded ${transformedData.length} static data points for ${coinId}`);
    } catch (err) {
      console.error(`Error fetching historical prices for ${coinId}:`, err);
      setError('Failed to load static historical data');
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  }, [coinId, days]);

  // Manual retry function
  const retry = useCallback(() => {
    setRetryCount(0);
    fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    retryCount, 
    connectionStatus, 
    refetch: fetchData, 
    retry 
  };
};

// Custom hook for global market data with static data
export const useGlobalMarketData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  const fetchGlobalData = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      setError(null);
      
      console.log('Fetching static global market data...');
      const globalData = await getGlobalMarketData();
      setData(globalData.data);
      setRetryCount(0);
      setConnectionStatus('connected');
      
      console.log('Successfully loaded static global market data');
    } catch (err) {
      console.error('Error fetching global market data:', err);
      setError('Failed to load static global data');
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Manual retry function
  const retry = useCallback(() => {
    setRetryCount(0);
    fetchGlobalData(false);
  }, [fetchGlobalData]);

  useEffect(() => {
    fetchGlobalData();
    
    // Update global data every 5 minutes
    const interval = setInterval(() => {
      fetchGlobalData();
    }, 300000);
    
    return () => clearInterval(interval);
  }, [fetchGlobalData]);

  return { 
    data, 
    loading, 
    error, 
    retryCount, 
    connectionStatus, 
    refetch: fetchGlobalData, 
    retry 
  };
};

// Helper function to format time labels for charts
const formatTimeLabel = (timestamp, days, index) => {
  const date = new Date(timestamp);
  
  if (days <= 1) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } else if (days <= 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export default { useCryptoPrices, useHistoricalPrices, useGlobalMarketData };
import axios from 'axios';

const GATEIO_BASE_URL = import.meta.env.VITE_GATEIO_BASE_URL || 'https://api.gateio.ws';
const GATEIO_API_KEY = import.meta.env.VITE_GATEIO_API_KEY;
const GATEIO_SECRET_KEY = import.meta.env.VITE_GATEIO_SECRET_KEY;

// Enhanced timeout configuration
const DEFAULT_TIMEOUT = 10000;
const REQUEST_CACHE = new Map();
const CACHE_DURATION = 30000; // 30 seconds cache

// Create axios instance for Gate.io API
const gateioApi = axios.create({
  baseURL: GATEIO_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'VaultScope/1.0',
    ...(GATEIO_API_KEY && {
      'KEY': GATEIO_API_KEY,
      'Timestamp': () => Date.now().toString()
    })
  }
});

// Enhanced retry logic with exponential backoff
const retryRequest = async (requestFn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      console.log(`Gate.io API attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      // Don't retry on certain errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error;
      }
      
      // Last attempt - throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 1000;
      const delay = exponentialDelay + jitter;
      
      console.log(`Retrying Gate.io API in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Cache helper functions
const getCacheKey = (url, params) => {
  const paramString = params ? JSON.stringify(params) : '';
  return `gateio:${url}:${paramString}`;
};

const getCachedData = (key) => {
  const cached = REQUEST_CACHE.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  REQUEST_CACHE.set(key, {
    data,
    timestamp: Date.now()
  });
  
  // Clean up old cache entries
  if (REQUEST_CACHE.size > 50) {
    const oldestKey = REQUEST_CACHE.keys().next().value;
    REQUEST_CACHE.delete(oldestKey);
  }
};

// Enhanced request function with caching
const makeRequest = async (url, params = {}, options = {}) => {
  const cacheKey = getCacheKey(url, params);
  
  // Check cache first
  if (!options.skipCache) {
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log(`Gate.io Cache hit for ${url}`);
      return cachedData;
    }
  }
  
  // Make the request with retry logic
  const requestFn = async () => {
    const config = {
      ...options,
      params,
      timeout: options.timeout || DEFAULT_TIMEOUT
    };
    
    const response = await gateioApi.get(url, config);
    return response.data;
  };
  
  const data = await retryRequest(requestFn, 3, 1000);
  
  // Cache the result
  setCachedData(cacheKey, data);
  
  return data;
};

// Request interceptor for logging
gateioApi.interceptors.request.use(
  (config) => {
    console.log(`[${new Date().toISOString()}] Gate.io API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Gate.io API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
gateioApi.interceptors.response.use(
  (response) => {
    console.log(`[${new Date().toISOString()}] Gate.io API response: ${response.status}`);
    return response;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Gate.io API Error:`, {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

// Get all trading pairs
export const getTradingPairs = async () => {
  try {
    const data = await makeRequest('/api/v4/spot/currency_pairs');
    return data;
  } catch (error) {
    console.error('Error fetching Gate.io trading pairs:', error);
    throw error;
  }
};

// Get tickers for all trading pairs
export const getTickers = async () => {
  try {
    const data = await makeRequest('/api/v4/spot/tickers');
    return data;
  } catch (error) {
    console.error('Error fetching Gate.io tickers:', error);
    throw error;
  }
};

// Get ticker for specific currency pair
export const getTickerBySymbol = async (symbol) => {
  try {
    const data = await makeRequest(`/api/v4/spot/tickers`, {
      currency_pair: symbol
    });
    return data;
  } catch (error) {
    console.error(`Error fetching Gate.io ticker for ${symbol}:`, error);
    throw error;
  }
};

// Get order book
export const getOrderBook = async (symbol, limit = 20) => {
  try {
    const data = await makeRequest('/api/v4/spot/order_book', {
      currency_pair: symbol,
      limit: limit
    });
    return data;
  } catch (error) {
    console.error(`Error fetching Gate.io order book for ${symbol}:`, error);
    throw error;
  }
};

// Get market trades
export const getMarketTrades = async (symbol, limit = 100) => {
  try {
    const data = await makeRequest('/api/v4/spot/trades', {
      currency_pair: symbol,
      limit: limit
    });
    return data;
  } catch (error) {
    console.error(`Error fetching Gate.io trades for ${symbol}:`, error);
    throw error;
  }
};

// Get candlestick data
export const getCandlestickData = async (symbol, interval = '1h', limit = 100) => {
  try {
    const data = await makeRequest('/api/v4/spot/candlesticks', {
      currency_pair: symbol,
      interval: interval,
      limit: limit
    });
    return data;
  } catch (error) {
    console.error(`Error fetching Gate.io candlestick data for ${symbol}:`, error);
    throw error;
  }
};

// Transform Gate.io data to match app structure
export const transformGateioData = (tickerData) => {
  if (!tickerData || !Array.isArray(tickerData)) {
    return [];
  }

  return tickerData.map(ticker => ({
    id: ticker.currency_pair?.toLowerCase().replace('_', '-') || 'unknown',
    symbol: ticker.currency_pair || 'UNKNOWN',
    name: ticker.currency_pair?.split('_')[0] || 'Unknown',
    price: parseFloat(ticker.last) || 0,
    change24h: parseFloat(ticker.change_percentage) || 0,
    volume24h: parseFloat(ticker.base_volume) || 0,
    high24h: parseFloat(ticker.high_24h) || 0,
    low24h: parseFloat(ticker.low_24h) || 0,
    openPrice: parseFloat(ticker.open_24h) || 0,
    bidPrice: parseFloat(ticker.highest_bid) || 0,
    askPrice: parseFloat(ticker.lowest_ask) || 0,
    exchange: 'Gate.io',
    timestamp: Date.now(),
    riskLevel: calculateRiskLevel(parseFloat(ticker.change_percentage) || 0)
  }));
};

// Calculate risk level based on 24h change
const calculateRiskLevel = (change24h) => {
  if (Math.abs(change24h) > 15) return 'high';
  if (Math.abs(change24h) > 8) return 'medium';
  return 'low';
};

// Enhanced error handling
export const handleGateioError = (error) => {
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return { 
      error: 'Gate.io API request timeout. Please try again.',
      type: 'timeout',
      retryable: true
    };
  } else if (error.code === 'ERR_NETWORK') {
    return { 
      error: 'Network error connecting to Gate.io. Please check your connection.',
      type: 'network',
      retryable: true
    };
  } else if (error.response?.status === 429) {
    return { 
      error: 'Gate.io API rate limit exceeded. Please wait and try again.',
      type: 'rate_limit',
      retryable: true
    };
  } else if (error.response?.status === 401) {
    return { 
      error: 'Invalid Gate.io API credentials.',
      type: 'auth',
      retryable: false
    };
  } else if (error.response?.status >= 500) {
    return { 
      error: 'Gate.io service is temporarily unavailable.',
      type: 'server',
      retryable: true
    };
  } else {
    return { 
      error: `Gate.io API error: ${error.message}`,
      type: 'unknown',
      retryable: true
    };
  }
};

// Connection status checker
export const checkGateioConnection = async () => {
  try {
    const response = await gateioApi.get('/api/v4/spot/time', { timeout: 5000 });
    return { connected: true, status: response.status };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

// Clear cache utility
export const clearGateioCache = () => {
  REQUEST_CACHE.clear();
  console.log('Gate.io API cache cleared');
};

export default gateioApi;
import axios from 'axios';

const OKX_BASE_URL = import.meta.env.VITE_OKX_BASE_URL || 'https://www.okx.com';
const OKX_API_KEY = import.meta.env.VITE_OKX_API_KEY;
const OKX_SECRET_KEY = import.meta.env.VITE_OKX_SECRET_KEY;
const OKX_PASSPHRASE = import.meta.env.VITE_OKX_PASSPHRASE;

// Enhanced timeout configuration
const DEFAULT_TIMEOUT = 10000;
const REQUEST_CACHE = new Map();
const CACHE_DURATION = 30000; // 30 seconds cache

// Create axios instance for OKX API
const okxApi = axios.create({
  baseURL: OKX_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'VaultScope/1.0',
    ...(OKX_API_KEY && {
      'OK-ACCESS-KEY': OKX_API_KEY,
      'OK-ACCESS-PASSPHRASE': OKX_PASSPHRASE,
      'OK-ACCESS-TIMESTAMP': () => Date.now().toString()
    })
  }
});

// Enhanced retry logic with exponential backoff
const retryRequest = async (requestFn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      console.log(`OKX API attempt ${attempt}/${maxRetries} failed:`, error.message);
      
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
      
      console.log(`Retrying OKX API in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Cache helper functions
const getCacheKey = (url, params) => {
  const paramString = params ? JSON.stringify(params) : '';
  return `okx:${url}:${paramString}`;
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
      console.log(`OKX Cache hit for ${url}`);
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
    
    const response = await okxApi.get(url, config);
    return response.data;
  };
  
  const data = await retryRequest(requestFn, 3, 1000);
  
  // Cache the result
  setCachedData(cacheKey, data);
  
  return data;
};

// Request interceptor for logging
okxApi.interceptors.request.use(
  (config) => {
    console.log(`[${new Date().toISOString()}] OKX API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('OKX API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
okxApi.interceptors.response.use(
  (response) => {
    console.log(`[${new Date().toISOString()}] OKX API response: ${response.status}`);
    return response;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] OKX API Error:`, {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    
    return Promise.reject(error);
  }
);

// Get ticker data for all symbols
export const getTickers = async () => {
  try {
    const data = await makeRequest('/api/v5/market/tickers', {
      instType: 'SPOT'
    });
    return data;
  } catch (error) {
    console.error('Error fetching OKX tickers:', error);
    throw error;
  }
};

// Get ticker data for specific instrument
export const getTickerBySymbol = async (symbol) => {
  try {
    const data = await makeRequest('/api/v5/market/ticker', {
      instId: symbol
    });
    return data;
  } catch (error) {
    console.error(`Error fetching OKX ticker for ${symbol}:`, error);
    throw error;
  }
};

// Get order book data
export const getOrderBook = async (symbol, depth = 20) => {
  try {
    const data = await makeRequest('/api/v5/market/books', {
      instId: symbol,
      sz: depth
    });
    return data;
  } catch (error) {
    console.error(`Error fetching OKX order book for ${symbol}:`, error);
    throw error;
  }
};

// Get 24hr ticker statistics
export const get24hrTicker = async (symbol) => {
  try {
    const data = await makeRequest('/api/v5/market/ticker', {
      instId: symbol
    });
    return data;
  } catch (error) {
    console.error(`Error fetching OKX 24hr ticker for ${symbol}:`, error);
    throw error;
  }
};

// Get trading pairs
export const getTradingPairs = async () => {
  try {
    const data = await makeRequest('/api/v5/public/instruments', {
      instType: 'SPOT'
    });
    return data;
  } catch (error) {
    console.error('Error fetching OKX trading pairs:', error);
    throw error;
  }
};

// Transform OKX data to match app structure
export const transformOKXData = (tickerData) => {
  if (!tickerData || !tickerData.data || !tickerData.data.length) {
    return [];
  }

  return tickerData.data.map(ticker => ({
    id: ticker.instId?.toLowerCase() || 'unknown',
    symbol: ticker.instId || 'UNKNOWN',
    name: ticker.instId?.split('-')[0] || 'Unknown',
    price: parseFloat(ticker.last) || 0,
    change24h: parseFloat(ticker.chgPct) * 100 || 0,
    volume24h: parseFloat(ticker.vol24h) || 0,
    high24h: parseFloat(ticker.high24h) || 0,
    low24h: parseFloat(ticker.low24h) || 0,
    openPrice: parseFloat(ticker.open24h) || 0,
    bidPrice: parseFloat(ticker.bidPx) || 0,
    askPrice: parseFloat(ticker.askPx) || 0,
    exchange: 'OKX',
    timestamp: parseInt(ticker.ts) || Date.now(),
    riskLevel: calculateRiskLevel(parseFloat(ticker.chgPct) * 100 || 0)
  }));
};

// Calculate risk level based on 24h change
const calculateRiskLevel = (change24h) => {
  if (Math.abs(change24h) > 15) return 'high';
  if (Math.abs(change24h) > 8) return 'medium';
  return 'low';
};

// Enhanced error handling
export const handleOKXError = (error) => {
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return { 
      error: 'OKX API request timeout. Please try again.',
      type: 'timeout',
      retryable: true
    };
  } else if (error.code === 'ERR_NETWORK') {
    return { 
      error: 'Network error connecting to OKX. Please check your connection.',
      type: 'network',
      retryable: true
    };
  } else if (error.response?.status === 429) {
    return { 
      error: 'OKX API rate limit exceeded. Please wait and try again.',
      type: 'rate_limit',
      retryable: true
    };
  } else if (error.response?.status === 401) {
    return { 
      error: 'Invalid OKX API credentials.',
      type: 'auth',
      retryable: false
    };
  } else if (error.response?.status >= 500) {
    return { 
      error: 'OKX service is temporarily unavailable.',
      type: 'server',
      retryable: true
    };
  } else {
    return { 
      error: `OKX API error: ${error.message}`,
      type: 'unknown',
      retryable: true
    };
  }
};

// Connection status checker
export const checkOKXConnection = async () => {
  try {
    const response = await okxApi.get('/api/v5/public/time', { timeout: 5000 });
    return { connected: true, status: response.status };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};

// Clear cache utility
export const clearOKXCache = () => {
  REQUEST_CACHE.clear();
  console.log('OKX API cache cleared');
};

export default okxApi;
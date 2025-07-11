import axios from 'axios';

const COINGECKO_BASE_URL = import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
const REQUEST_TIMEOUT = 10000;
const RATE_LIMIT_DELAY = 1000; // 1 second between requests for free tier

// Create axios instance for CoinGecko API
const coingeckoApi = axios.create({
  baseURL: COINGECKO_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'VaultScope/1.0'
  }
});

// Rate limiting helper
let lastRequestTime = 0;
const rateLimitedRequest = async (requestFn) => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
  return await requestFn();
};

// Get current prices for multiple cryptocurrencies
export const getCurrentPrices = async (coinIds = ['bitcoin', 'ethereum', 'cardano', 'solana']) => {
  try {
    const response = await rateLimitedRequest(() =>
      coingeckoApi.get('/simple/price', {
        params: {
          ids: coinIds.join(','),
          vs_currencies: 'usd',
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true,
          include_last_updated_at: true
        }
      })
    );

    const result = {};
    Object.entries(response.data).forEach(([coinId, data]) => {
      result[coinId] = {
        usd: data.usd,
        usd_market_cap: data.usd_market_cap,
        usd_24h_vol: data.usd_24h_vol,
        usd_24h_change: data.usd_24h_change,
        last_updated_at: data.last_updated_at
      };
    });

    return result;
  } catch (error) {
    console.error('CoinGecko API error:', error);
    throw new Error(`Failed to fetch prices: ${error.message}`);
  }
};

// Get detailed coin information
export const getCoinDetails = async (coinId) => {
  try {
    const response = await rateLimitedRequest(() =>
      coingeckoApi.get(`/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true
        }
      })
    );

    return response.data;
  } catch (error) {
    console.error(`CoinGecko API error for ${coinId}:`, error);
    throw new Error(`Failed to fetch coin details: ${error.message}`);
  }
};

// Get market data for multiple coins
export const getMarketData = async (coinIds = ['bitcoin', 'ethereum', 'cardano', 'solana']) => {
  try {
    const response = await rateLimitedRequest(() =>
      coingeckoApi.get('/coins/markets', {
        params: {
          vs_currency: 'usd',
          ids: coinIds.join(','),
          order: 'market_cap_desc',
          per_page: coinIds.length,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h'
        }
      })
    );

    return response.data.map(coin => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap,
      image: coin.image,
      sparkline: coin.sparkline_in_7d?.price || [],
      riskLevel: calculateRiskLevel(coin.price_change_percentage_24h),
      lastUpdated: Date.now()
    }));
  } catch (error) {
    console.error('CoinGecko market data error:', error);
    throw new Error(`Failed to fetch market data: ${error.message}`);
  }
};

// Calculate risk level based on price change
const calculateRiskLevel = (change24h) => {
  if (!change24h) return 'low';
  const absChange = Math.abs(change24h);
  if (absChange > 10) return 'high';
  if (absChange > 5) return 'medium';
  return 'low';
};

// Get global market data
export const getGlobalMarketData = async () => {
  try {
    const response = await rateLimitedRequest(() =>
      coingeckoApi.get('/global')
    );

    const data = response.data.data;
    return {
      totalMarketCap: data.total_market_cap?.usd || 0,
      totalVolume: data.total_volume?.usd || 0,
      marketCapChange24h: data.market_cap_change_percentage_24h_usd || 0,
      activeCryptocurrencies: data.active_cryptocurrencies || 0,
      markets: data.markets || 0,
      btcDominance: data.market_cap_percentage?.btc || 0,
      ethDominance: data.market_cap_percentage?.eth || 0
    };
  } catch (error) {
    console.error('CoinGecko global data error:', error);
    throw new Error(`Failed to fetch global market data: ${error.message}`);
  }
};

// Check API connection
export const checkConnection = async () => {
  try {
    await rateLimitedRequest(() =>
      coingeckoApi.get('/ping', { timeout: 5000 })
    );
    return { status: 'connected', message: 'CoinGecko API is accessible' };
  } catch (error) {
    return { status: 'error', message: `CoinGecko API connection failed: ${error.message}` };
  }
};

export default {
  getCurrentPrices,
  getCoinDetails,
  getMarketData,
  getGlobalMarketData,
  checkConnection
};
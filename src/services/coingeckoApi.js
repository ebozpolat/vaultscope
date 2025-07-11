// CoinGecko API integration removed to improve performance
// This file has been replaced with static mock data to maintain functionality

// Mock data for fallback when CoinGecko API was unavailable
const mockCryptoPrices = {
  bitcoin: { price: 67234.56, change: -2.34, volume: 28500000000, marketCap: 1320000000000 },
  ethereum: { price: 3842.78, change: 1.87, volume: 15200000000, marketCap: 462000000000 },
  cardano: { price: 0.4523, change: -5.67, volume: 890000000, marketCap: 15800000000 },
  solana: { price: 178.92, change: 8.45, volume: 2100000000, marketCap: 82000000000 },
  binancecoin: { price: 602.34, change: 0.87, volume: 1800000000, marketCap: 89000000000 },
  xrp: { price: 0.6234, change: -1.23, volume: 1200000000, marketCap: 35000000000 },
  dogecoin: { price: 0.1567, change: 12.34, volume: 800000000, marketCap: 22000000000 },
  polygon: { price: 0.8901, change: 3.45, volume: 450000000, marketCap: 8700000000 }
};

// Static mock data generator for current prices
export const getCurrentPrices = async (coinIds = ['bitcoin', 'ethereum', 'cardano', 'solana']) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const result = {};
  coinIds.forEach(coinId => {
    const coinData = mockCryptoPrices[coinId] || mockCryptoPrices.bitcoin;
    result[coinId] = {
      usd: coinData.price,
      usd_market_cap: coinData.marketCap,
      usd_24h_vol: coinData.volume,
      usd_24h_change: coinData.change,
      last_updated_at: Date.now()
    };
  });
  
  return result;
};

// Static mock data generator for coin details
export const getCoinDetails = async (coinId) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const coinData = mockCryptoPrices[coinId] || mockCryptoPrices.bitcoin;
  return {
    id: coinId,
    name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
    symbol: coinId.toUpperCase(),
    market_data: {
      current_price: { usd: coinData.price },
      market_cap: { usd: coinData.marketCap },
      total_volume: { usd: coinData.volume },
      price_change_percentage_24h: coinData.change
    },
    image: {
      small: `/assets/images/${coinId}.png`,
      large: `/assets/images/${coinId}.png`
    },
    last_updated: new Date().toISOString()
  };
};

// Static mock data generator for market data
export const getMarketData = async (coinIds = ['bitcoin', 'ethereum', 'cardano', 'solana']) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return coinIds.map(coinId => {
    const coinData = mockCryptoPrices[coinId] || mockCryptoPrices.bitcoin;
    return {
      id: coinId,
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1),
      symbol: coinId.toUpperCase(),
      current_price: coinData.price,
      market_cap: coinData.marketCap,
      total_volume: coinData.volume,
      price_change_percentage_24h: coinData.change,
      sparkline_in_7d: {
        price: generateSparklineData(coinData.price)
      },
      image: `/assets/images/${coinId}.png`,
      last_updated: new Date().toISOString()
    };
  });
};

// Static mock data generator for historical prices
export const getHistoricalPrices = async (coinId, days = 7) => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const baseCoinData = mockCryptoPrices[coinId] || mockCryptoPrices.bitcoin;
  const dataPoints = days <= 1 ? 24 : days;
  const prices = [];
  const volumes = [];
  
  let currentPrice = baseCoinData.price;
  const now = Date.now();
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = now - (dataPoints - i) * (days <= 1 ? 3600000 : 86400000);
    const volatility = (Math.random() - 0.5) * 0.05;
    currentPrice = currentPrice * (1 + volatility);
    
    prices.push([timestamp, currentPrice]);
    volumes.push([timestamp, Math.random() * 1000000 + 500000]);
  }
  
  return {
    prices,
    total_volumes: volumes
  };
};

// Static mock data generator for global market data
export const getGlobalMarketData = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    data: {
      total_market_cap: { usd: 2100000000000 },
      total_volume: { usd: 89200000000 },
      market_cap_change_percentage_24h_usd: 2.4,
      active_cryptocurrencies: 10000,
      markets: 850
    }
  };
};

// Static mock data generator for trending coins
export const getTrendingCoins = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    coins: [
      { item: { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' } },
      { item: { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' } },
      { item: { id: 'solana', name: 'Solana', symbol: 'SOL' } }
    ]
  };
};

// Helper function to generate sparkline data
const generateSparklineData = (basePrice) => {
  const data = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < 7; i++) {
    const volatility = (Math.random() - 0.5) * 0.02;
    currentPrice = currentPrice * (1 + volatility);
    data.push(currentPrice);
  }
  
  return data;
};

// Helper function to transform data to match existing component structure
export const transformCoinGeckoData = (coinData) => {
  return {
    id: coinData.id,
    name: coinData.name,
    symbol: coinData.symbol?.toUpperCase() || coinData.id.toUpperCase(),
    price: coinData.current_price || 0,
    change24h: coinData.price_change_percentage_24h || 0,
    volume24h: coinData.total_volume || 0,
    marketCap: coinData.market_cap || 0,
    riskLevel: calculateRiskLevel(coinData.price_change_percentage_24h || 0),
    image: coinData.image,
    sparkline: coinData.sparkline_in_7d?.price || [],
    lastUpdated: coinData.last_updated || new Date().toISOString()
  };
};

// Helper function to calculate risk level based on 24h change
const calculateRiskLevel = (change24h) => {
  if (Math.abs(change24h) > 10) return 'high';
  if (Math.abs(change24h) > 5) return 'medium';
  return 'low';
};

// Simplified error handling (no longer needed for API errors)
export const handleApiError = (error) => {
  return { 
    error: 'Using static data - no API connection required',
    type: 'static',
    retryable: false
  };
};

// Mock connection status (always returns connected for static data)
export const checkApiConnection = async () => {
  return { connected: true, status: 200 };
};

// No-op cache clear
export const clearCache = () => {
  console.log('Cache cleared (static data mode)');
};

export default {
  getCurrentPrices,
  getCoinDetails,
  getMarketData,
  getHistoricalPrices,
  getGlobalMarketData,
  getTrendingCoins,
  transformCoinGeckoData,
  handleApiError,
  checkApiConnection,
  clearCache
};
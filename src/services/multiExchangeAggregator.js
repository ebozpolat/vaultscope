import { getTickers as getOKXTickers, transformOKXData, handleOKXError, checkOKXConnection } from './okxApi';
import { getTickers as getGateioTickers, transformGateioData, handleGateioError, checkGateioConnection } from './gateioApi';
import { subscribeToTickers, getConnectionStatus, unsubscribeAll } from './binanceWebSocket';

class MultiExchangeAggregator {
  constructor() {
    this.data = new Map();
    this.listeners = new Set();
    this.connectionStatus = {
      okx: 'disconnected',
      gateio: 'disconnected',
      binance: 'disconnected'
    };
    this.lastUpdate = {
      okx: null,
      gateio: null,
      binance: null
    };
    this.updateInterval = null;
    this.isInitialized = false;
    this.retryAttempts = {
      okx: 0,
      gateio: 0,
      binance: 0
    };
    this.maxRetryAttempts = 3;
    this.retryDelay = 5000;
  }

  // Initialize all exchange connections
  async initialize() {
    console.log('Initializing multi-exchange aggregator...');
    
    try {
      // Initialize connections in parallel
      const initPromises = [
        this.initializeOKX(),
        this.initializeGateio(),
        this.initializeBinance()
      ];

      await Promise.allSettled(initPromises);
      
      // Start periodic updates for REST APIs
      this.startPeriodicUpdates();
      this.isInitialized = true;
      
      console.log('Multi-exchange aggregator initialized successfully');
      this.notifyListeners();
      
    } catch (error) {
      console.error('Error initializing multi-exchange aggregator:', error);
      throw error;
    }
  }

  // Initialize OKX connection
  async initializeOKX() {
    try {
      console.log('Initializing OKX connection...');
      const connectionCheck = await checkOKXConnection();
      
      if (connectionCheck.connected) {
        this.connectionStatus.okx = 'connected';
        await this.fetchOKXData();
        this.retryAttempts.okx = 0;
        console.log('OKX connection established successfully');
      } else {
        throw new Error('OKX connection failed');
      }
    } catch (error) {
      console.error('Error initializing OKX:', error);
      this.connectionStatus.okx = 'error';
      this.scheduleRetry('okx');
    }
  }

  // Initialize Gate.io connection
  async initializeGateio() {
    try {
      console.log('Initializing Gate.io connection...');
      const connectionCheck = await checkGateioConnection();
      
      if (connectionCheck.connected) {
        this.connectionStatus.gateio = 'connected';
        await this.fetchGateioData();
        this.retryAttempts.gateio = 0;
        console.log('Gate.io connection established successfully');
      } else {
        throw new Error('Gate.io connection failed');
      }
    } catch (error) {
      console.error('Error initializing Gate.io:', error);
      this.connectionStatus.gateio = 'error';
      this.scheduleRetry('gateio');
    }
  }

  // Initialize Binance WebSocket connection
  async initializeBinance() {
    try {
      console.log('Initializing Binance WebSocket connection...');
      
      subscribeToTickers((data) => {
        this.handleBinanceData(data);
      });
      
      // Check connection status after a delay
      setTimeout(() => {
        const status = getConnectionStatus();
        if (status.connected) {
          this.connectionStatus.binance = 'connected';
          this.retryAttempts.binance = 0;
          console.log('Binance WebSocket connection established successfully');
        } else {
          this.connectionStatus.binance = 'error';
          this.scheduleRetry('binance');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error initializing Binance WebSocket:', error);
      this.connectionStatus.binance = 'error';
      this.scheduleRetry('binance');
    }
  }

  // Fetch OKX data
  async fetchOKXData() {
    try {
      const tickerData = await getOKXTickers();
      const transformedData = transformOKXData(tickerData);
      this.updateExchangeData('okx', transformedData);
      this.lastUpdate.okx = new Date();
      console.log(`Updated OKX data: ${transformedData.length} tickers`);
    } catch (error) {
      console.error('Error fetching OKX data:', error);
      const errorInfo = handleOKXError(error);
      if (errorInfo.retryable) {
        this.scheduleRetry('okx');
      }
    }
  }

  // Fetch Gate.io data
  async fetchGateioData() {
    try {
      const tickerData = await getGateioTickers();
      const transformedData = transformGateioData(tickerData);
      this.updateExchangeData('gateio', transformedData);
      this.lastUpdate.gateio = new Date();
      console.log(`Updated Gate.io data: ${transformedData.length} tickers`);
    } catch (error) {
      console.error('Error fetching Gate.io data:', error);
      const errorInfo = handleGateioError(error);
      if (errorInfo.retryable) {
        this.scheduleRetry('gateio');
      }
    }
  }

  // Handle Binance WebSocket data
  handleBinanceData(data) {
    try {
      const transformedData = Array.isArray(data) ? data : [data];
      this.updateExchangeData('binance', transformedData);
      this.lastUpdate.binance = new Date();
      console.log(`Updated Binance data: ${transformedData.length} tickers`);
    } catch (error) {
      console.error('Error handling Binance data:', error);
    }
  }

  // Update exchange data
  updateExchangeData(exchange, data) {
    if (!this.data.has(exchange)) {
      this.data.set(exchange, new Map());
    }
    
    const exchangeData = this.data.get(exchange);
    
    data.forEach(item => {
      exchangeData.set(item.symbol, item);
    });
    
    this.notifyListeners();
  }

  // Get aggregated data for all exchanges
  getAggregatedData() {
    const aggregated = new Map();
    
    // Combine data from all exchanges
    this.data.forEach((exchangeData, exchange) => {
      exchangeData.forEach((item, symbol) => {
        if (!aggregated.has(symbol)) {
          aggregated.set(symbol, []);
        }
        aggregated.get(symbol).push({
          ...item,
          exchange
        });
      });
    });
    
    return Array.from(aggregated.values());
  }

  // Get data for specific exchange
  getExchangeData(exchange) {
    const exchangeData = this.data.get(exchange);
    if (!exchangeData) return [];
    
    return Array.from(exchangeData.values());
  }

  // Get best price for a symbol across all exchanges
  getBestPrice(symbol) {
    const allData = this.getAggregatedData();
    const symbolData = allData.find(items => 
      items.some(item => item.symbol === symbol)
    );
    
    if (!symbolData) return null;
    
    const prices = symbolData.map(item => ({
      exchange: item.exchange,
      price: item.price,
      volume: item.volume24h
    }));
    
    const bestBid = prices.reduce((max, current) => 
      current.price > max.price ? current : max
    );
    
    const bestAsk = prices.reduce((min, current) => 
      current.price < min.price ? current : min
    );
    
    return {
      symbol,
      bestBid,
      bestAsk,
      priceSpread: bestBid.price - bestAsk.price,
      exchanges: prices.length
    };
  }

  // Get market summary
  getMarketSummary() {
    const allData = this.getAggregatedData();
    const totalSymbols = allData.length;
    const totalVolume = allData.reduce((sum, symbolData) => {
      const maxVolume = Math.max(...symbolData.map(item => item.volume24h || 0));
      return sum + maxVolume;
    }, 0);
    
    return {
      totalSymbols,
      totalVolume,
      exchanges: Array.from(this.data.keys()).length,
      connectionStatus: this.connectionStatus,
      lastUpdate: this.lastUpdate
    };
  }

  // Schedule retry for failed exchange
  scheduleRetry(exchange) {
    if (this.retryAttempts[exchange] >= this.maxRetryAttempts) {
      console.error(`Max retry attempts reached for ${exchange}`);
      return;
    }
    
    const delay = this.retryDelay * Math.pow(2, this.retryAttempts[exchange]);
    console.log(`Scheduling retry for ${exchange} in ${delay}ms`);
    
    setTimeout(() => {
      this.retryAttempts[exchange]++;
      
      switch (exchange) {
        case 'okx':
          this.initializeOKX();
          break;
        case 'gateio':
          this.initializeGateio();
          break;
        case 'binance':
          this.initializeBinance();
          break;
      }
    }, delay);
  }

  // Start periodic updates for REST APIs
  startPeriodicUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.updateInterval = setInterval(() => {
      if (this.connectionStatus.okx === 'connected') {
        this.fetchOKXData();
      }
      
      if (this.connectionStatus.gateio === 'connected') {
        this.fetchGateioData();
      }
    }, 30000); // Update every 30 seconds
  }

  // Stop periodic updates
  stopPeriodicUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Add listener for data updates
  addListener(callback) {
    this.listeners.add(callback);
  }

  // Remove listener
  removeListener(callback) {
    this.listeners.delete(callback);
  }

  // Notify all listeners
  notifyListeners() {
    const data = {
      aggregated: this.getAggregatedData(),
      exchanges: {
        okx: this.getExchangeData('okx'),
        gateio: this.getExchangeData('gateio'),
        binance: this.getExchangeData('binance')
      },
      summary: this.getMarketSummary()
    };
    
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in aggregator listener:', error);
      }
    });
  }

  // Get connection status
  getConnectionStatus() {
    return {
      ...this.connectionStatus,
      isInitialized: this.isInitialized,
      activeConnections: Object.values(this.connectionStatus)
        .filter(status => status === 'connected').length
    };
  }

  // Cleanup and disconnect
  cleanup() {
    console.log('Cleaning up multi-exchange aggregator...');
    this.stopPeriodicUpdates();
    unsubscribeAll();
    this.data.clear();
    this.listeners.clear();
    this.isInitialized = false;
  }
}

// Create singleton instance
const multiExchangeAggregator = new MultiExchangeAggregator();

export default multiExchangeAggregator;
class BinanceWebSocketManager {
  constructor() {
    this.connections = new Map();
    this.reconnectAttempts = new Map();
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.wsBaseUrl = import.meta.env.VITE_BINANCE_WS_URL || 'wss://stream.binance.com:9443/ws';
    this.listeners = new Map();
    this.isConnected = false;
    this.heartbeatInterval = null;
    this.lastPongTime = Date.now();
  }

  // Subscribe to ticker stream for all symbols
  subscribeToTickers(callback) {
    const streamName = '!ticker@arr';
    return this.subscribe(streamName, callback);
  }

  // Subscribe to specific symbol ticker
  subscribeToSymbolTicker(symbol, callback) {
    const streamName = `${symbol.toLowerCase()}@ticker`;
    return this.subscribe(streamName, callback);
  }

  // Subscribe to order book updates
  subscribeToOrderBook(symbol, callback, levels = 20) {
    const streamName = `${symbol.toLowerCase()}@depth${levels}`;
    return this.subscribe(streamName, callback);
  }

  // Subscribe to trade stream
  subscribeToTrades(symbol, callback) {
    const streamName = `${symbol.toLowerCase()}@trade`;
    return this.subscribe(streamName, callback);
  }

  // Subscribe to kline/candlestick stream
  subscribeToKlines(symbol, interval, callback) {
    const streamName = `${symbol.toLowerCase()}@kline_${interval}`;
    return this.subscribe(streamName, callback);
  }

  // Generic subscribe method
  subscribe(streamName, callback) {
    const connectionKey = this.generateConnectionKey(streamName);
    
    if (this.connections.has(connectionKey)) {
      const existingConnection = this.connections.get(connectionKey);
      if (existingConnection.readyState === WebSocket.OPEN) {
        console.log(`Reusing existing connection for ${streamName}`);
        this.addListener(streamName, callback);
        return connectionKey;
      }
    }

    const wsUrl = `${this.wsBaseUrl}/${streamName}`;
    console.log(`Connecting to Binance WebSocket: ${wsUrl}`);

    const ws = new WebSocket(wsUrl);
    this.connections.set(connectionKey, ws);
    this.addListener(streamName, callback);

    ws.onopen = () => {
      console.log(`Connected to Binance stream: ${streamName}`);
      this.isConnected = true;
      this.reconnectAttempts.set(connectionKey, 0);
      this.startHeartbeat();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(streamName, data);
        this.lastPongTime = Date.now();
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for ${streamName}:`, error);
      this.isConnected = false;
    };

    ws.onclose = (event) => {
      console.log(`WebSocket closed for ${streamName}:`, event.code, event.reason);
      this.isConnected = false;
      this.stopHeartbeat();
      
      if (event.code !== 1000 && event.code !== 1001) {
        this.handleReconnect(connectionKey, streamName, callback);
      }
    };

    return connectionKey;
  }

  // Add event listener
  addListener(streamName, callback) {
    if (!this.listeners.has(streamName)) {
      this.listeners.set(streamName, []);
    }
    this.listeners.get(streamName).push(callback);
  }

  // Remove event listener
  removeListener(streamName, callback) {
    if (this.listeners.has(streamName)) {
      const listeners = this.listeners.get(streamName);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      if (listeners.length === 0) {
        this.listeners.delete(streamName);
      }
    }
  }

  // Handle incoming messages
  handleMessage(streamName, data) {
    const listeners = this.listeners.get(streamName) || [];
    const transformedData = this.transformBinanceData(data, streamName);
    
    listeners.forEach(callback => {
      try {
        callback(transformedData);
      } catch (error) {
        console.error('Error in WebSocket callback:', error);
      }
    });
  }

  // Transform Binance data to match app structure
  transformBinanceData(data, streamName) {
    if (streamName.includes('@ticker')) {
      if (Array.isArray(data)) {
        // All tickers stream
        return data.map(ticker => ({
          id: ticker.s?.toLowerCase() || 'unknown',
          symbol: ticker.s || 'UNKNOWN',
          name: ticker.s?.replace('USDT', '') || 'Unknown',
          price: parseFloat(ticker.c) || 0,
          change24h: parseFloat(ticker.P) || 0,
          volume24h: parseFloat(ticker.v) || 0,
          high24h: parseFloat(ticker.h) || 0,
          low24h: parseFloat(ticker.l) || 0,
          openPrice: parseFloat(ticker.o) || 0,
          bidPrice: parseFloat(ticker.b) || 0,
          askPrice: parseFloat(ticker.a) || 0,
          exchange: 'Binance',
          timestamp: parseInt(data.E) || Date.now(),
          riskLevel: this.calculateRiskLevel(parseFloat(ticker.P) || 0)
        }));
      } else {
        // Single ticker stream
        return {
          id: data.s?.toLowerCase() || 'unknown',
          symbol: data.s || 'UNKNOWN',
          name: data.s?.replace('USDT', '') || 'Unknown',
          price: parseFloat(data.c) || 0,
          change24h: parseFloat(data.P) || 0,
          volume24h: parseFloat(data.v) || 0,
          high24h: parseFloat(data.h) || 0,
          low24h: parseFloat(data.l) || 0,
          openPrice: parseFloat(data.o) || 0,
          bidPrice: parseFloat(data.b) || 0,
          askPrice: parseFloat(data.a) || 0,
          exchange: 'Binance',
          timestamp: parseInt(data.E) || Date.now(),
          riskLevel: this.calculateRiskLevel(parseFloat(data.P) || 0)
        };
      }
    } else if (streamName.includes('@depth')) {
      // Order book data
      return {
        symbol: data.s || 'UNKNOWN',
        bids: data.b?.map(([price, quantity]) => ({
          price: parseFloat(price),
          quantity: parseFloat(quantity)
        })) || [],
        asks: data.a?.map(([price, quantity]) => ({
          price: parseFloat(price),
          quantity: parseFloat(quantity)
        })) || [],
        timestamp: parseInt(data.E) || Date.now(),
        exchange: 'Binance'
      };
    } else if (streamName.includes('@trade')) {
      // Trade data
      return {
        symbol: data.s || 'UNKNOWN',
        price: parseFloat(data.p) || 0,
        quantity: parseFloat(data.q) || 0,
        timestamp: parseInt(data.T) || Date.now(),
        isBuyerMaker: data.m || false,
        exchange: 'Binance'
      };
    } else if (streamName.includes('@kline')) {
      // Kline/candlestick data
      const klineData = data.k || {};
      return {
        symbol: klineData.s || 'UNKNOWN',
        openTime: parseInt(klineData.t) || Date.now(),
        closeTime: parseInt(klineData.T) || Date.now(),
        open: parseFloat(klineData.o) || 0,
        high: parseFloat(klineData.h) || 0,
        low: parseFloat(klineData.l) || 0,
        close: parseFloat(klineData.c) || 0,
        volume: parseFloat(klineData.v) || 0,
        trades: parseInt(klineData.n) || 0,
        interval: klineData.i || '1m',
        isFinal: klineData.x || false,
        exchange: 'Binance'
      };
    }
    
    return data;
  }

  // Calculate risk level based on 24h change
  calculateRiskLevel(change24h) {
    if (Math.abs(change24h) > 15) return 'high';
    if (Math.abs(change24h) > 8) return 'medium';
    return 'low';
  }

  // Handle reconnection
  handleReconnect(connectionKey, streamName, callback) {
    const attempts = this.reconnectAttempts.get(connectionKey) || 0;
    
    if (attempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, attempts);
      console.log(`Reconnecting to ${streamName} in ${delay}ms (attempt ${attempts + 1})`);
      
      setTimeout(() => {
        this.reconnectAttempts.set(connectionKey, attempts + 1);
        this.subscribe(streamName, callback);
      }, delay);
    } else {
      console.error(`Max reconnection attempts reached for ${streamName}`);
      this.reconnectAttempts.delete(connectionKey);
    }
  }

  // Start heartbeat to monitor connection
  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      if (now - this.lastPongTime > 60000) { // 1 minute timeout
        console.warn('WebSocket connection appears to be stale, reconnecting...');
        this.reconnectAll();
      }
    }, 30000); // Check every 30 seconds
  }

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Reconnect all connections
  reconnectAll() {
    console.log('Reconnecting all WebSocket connections...');
    this.connections.forEach((ws, connectionKey) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Forced reconnect');
      }
    });
  }

  // Generate connection key
  generateConnectionKey(streamName) {
    return `binance_${streamName}`;
  }

  // Unsubscribe from stream
  unsubscribe(connectionKey) {
    const connection = this.connections.get(connectionKey);
    if (connection) {
      connection.close(1000, 'Unsubscribe');
      this.connections.delete(connectionKey);
    }
  }

  // Unsubscribe from all streams
  unsubscribeAll() {
    console.log('Unsubscribing from all Binance WebSocket streams...');
    this.connections.forEach((ws, connectionKey) => {
      ws.close(1000, 'Unsubscribe all');
    });
    this.connections.clear();
    this.listeners.clear();
    this.reconnectAttempts.clear();
    this.stopHeartbeat();
    this.isConnected = false;
  }

  // Get connection status
  getConnectionStatus() {
    const activeConnections = Array.from(this.connections.values())
      .filter(ws => ws.readyState === WebSocket.OPEN).length;
    
    return {
      connected: this.isConnected,
      activeConnections,
      totalConnections: this.connections.size,
      lastPongTime: this.lastPongTime
    };
  }

  // Check if connected
  isConnectedToStream(streamName) {
    const connectionKey = this.generateConnectionKey(streamName);
    const connection = this.connections.get(connectionKey);
    return connection && connection.readyState === WebSocket.OPEN;
  }
}

// Create singleton instance
const binanceWebSocket = new BinanceWebSocketManager();

// Export individual functions for easier use
export const subscribeToTickers = (callback) => binanceWebSocket.subscribeToTickers(callback);
export const subscribeToSymbolTicker = (symbol, callback) => binanceWebSocket.subscribeToSymbolTicker(symbol, callback);
export const subscribeToOrderBook = (symbol, callback, levels) => binanceWebSocket.subscribeToOrderBook(symbol, callback, levels);
export const subscribeToTrades = (symbol, callback) => binanceWebSocket.subscribeToTrades(symbol, callback);
export const subscribeToKlines = (symbol, interval, callback) => binanceWebSocket.subscribeToKlines(symbol, interval, callback);
export const unsubscribe = (connectionKey) => binanceWebSocket.unsubscribe(connectionKey);
export const unsubscribeAll = () => binanceWebSocket.unsubscribeAll();
export const getConnectionStatus = () => binanceWebSocket.getConnectionStatus();
export const isConnectedToStream = (streamName) => binanceWebSocket.isConnectedToStream(streamName);

export default binanceWebSocket;
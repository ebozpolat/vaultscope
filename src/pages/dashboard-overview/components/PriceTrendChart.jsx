import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useHistoricalPrices } from '../../../hooks/useStaticCryptoData';

const PriceTrendChart = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');

  const { data: chartData, loading: isLoading, error, refetch } = useHistoricalPrices(selectedCrypto, selectedTimeframe === '1h' ? 1 : selectedTimeframe === '24h' ? 1 : selectedTimeframe === '7d' ? 7 : 30);

  const timeframes = [
    { label: '1H', value: '1h' },
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' }
  ];

  const cryptocurrencies = [
    { label: 'Bitcoin', value: 'bitcoin', color: '#F7931A' },
    { label: 'Ethereum', value: 'ethereum', color: '#627EEA' },
    { label: 'Cardano', value: 'cardano', color: '#0033AD' },
    { label: 'Solana', value: 'solana', color: '#9945FF' }
  ];

  const getCurrentCrypto = () => {
    return cryptocurrencies.find(crypto => crypto.value === selectedCrypto);
  };

  const getLatestPrice = () => {
    if (chartData?.length === 0) return 0;
    return chartData[chartData.length - 1]?.price || 0;
  };

  const getPriceChange = () => {
    if (chartData?.length < 2) return 0;
    const latest = chartData[chartData.length - 1]?.price || 0;
    const previous = chartData[0]?.price || 0;
    if (previous === 0) return 0;
    return ((latest - previous) / previous) * 100;
  };

  const formatPrice = (value) => {
    if (!value) return '$0.00';
    if (selectedCrypto === 'cardano' || value < 1) {
      return `$${value.toFixed(4)}`;
    }
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatLargeNumber = (num) => {
    if (!num) return '0';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-elevation-3">
          <p className="text-sm text-text-secondary mb-1">{label}</p>
          <p className="text-lg font-semibold text-text-primary">
            {formatPrice(payload[0].value)}
          </p>
          <p className="text-xs text-text-tertiary">
            Volume: ${formatLargeNumber(payload[0].payload.volume)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Price Trends</h3>
            <p className="text-sm text-text-secondary">Static market data visualization</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isLoading && (
            <>
              <Icon name="RotateCw" size={16} className="text-primary animate-spin" />
              <span className="text-sm text-text-secondary">Loading...</span>
            </>
          )}
          {error && (
            <div className="flex items-center space-x-1 text-info">
              <Icon name="Info" size={14} />
              <span className="text-xs">Static data</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Cryptocurrency Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Asset:</span>
          <div className="flex space-x-1">
            {cryptocurrencies.map((crypto) => (
              <Button
                key={crypto.value}
                variant={selectedCrypto === crypto.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCrypto(crypto.value)}
                className="text-xs"
              >
                {crypto.label.split(' ')[0]}
              </Button>
            ))}
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">Period:</span>
          <div className="flex space-x-1">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe.value}
                variant={selectedTimeframe === timeframe.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className="text-xs"
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="flex items-center justify-between mb-6 p-4 bg-background-secondary rounded-lg">
        <div>
          <p className="text-sm text-text-secondary">{getCurrentCrypto()?.label} Price</p>
          <p className="text-2xl font-bold text-text-primary">
            {formatPrice(getLatestPrice())}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-secondary">{selectedTimeframe.toUpperCase()} Change</p>
          <div className="flex items-center space-x-1">
            <Icon 
              name={getPriceChange() >= 0 ? 'TrendingUp' : 'TrendingDown'} 
              size={16} 
              className={getPriceChange() >= 0 ? 'text-success' : 'text-error'} 
            />
            <span className={`text-lg font-semibold ${getPriceChange() >= 0 ? 'text-success' : 'text-error'}`}>
              {getPriceChange() >= 0 ? '+' : ''}{getPriceChange().toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getCurrentCrypto()?.color || '#3B82F6'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={getCurrentCrypto()?.color || '#3B82F6'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-text-tertiary)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="var(--color-text-tertiary)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => {
                if (selectedCrypto === 'cardano' || value < 1) {
                  return `$${value.toFixed(3)}`;
                }
                return `$${(value/1000).toFixed(0)}k`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={getCurrentCrypto()?.color || '#3B82F6'}
              strokeWidth={2}
              fill="url(#priceGradient)"
              dot={false}
              activeDot={{ r: 4, fill: getCurrentCrypto()?.color || '#3B82F6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={refetch}
            iconName="RefreshCw"
            iconSize={14}
            className="text-text-secondary hover:text-text-primary"
          >
            Refresh
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            iconSize={14}
            className="text-text-secondary hover:text-text-primary"
          >
            Export
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-info rounded-full"></div>
          <div className="text-xs text-text-tertiary">
            Static market data
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceTrendChart;
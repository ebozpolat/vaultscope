import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const PriceVisualizationChart = ({ formData, className = '' }) => {
  const [priceData, setPriceData] = useState([]);
  const [timeRange, setTimeRange] = useState('1h');
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock price data
  useEffect(() => {
    const generatePriceData = () => {
      const basePrice = formData.currentPrice || 43250;
      const dataPoints = timeRange === '1h' ? 60 : timeRange === '4h' ? 240 : 1440;
      const interval = timeRange === '1h' ? 1 : timeRange === '4h' ? 1 : 1;
      
      const data = [];
      let currentPrice = basePrice;
      const now = new Date();
      
      for (let i = dataPoints; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * interval * 60000));
        
        // Add some realistic price movement
        const volatility = 0.002; // 0.2% volatility
        const change = (Math.random() - 0.5) * 2 * volatility;
        currentPrice = currentPrice * (1 + change);
        
        data.push({
          timestamp: timestamp.getTime(),
          time: timestamp.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          price: parseFloat(currentPrice.toFixed(2)),
          volume: Math.random() * 1000000 + 500000
        });
      }
      
      return data.reverse();
    };

    setIsLoading(true);
    setTimeout(() => {
      setPriceData(generatePriceData());
      setIsLoading(false);
    }, 500);
  }, [formData.currentPrice, timeRange]);

  const timeRanges = [
    { value: '1h', label: '1H' },
    { value: '4h', label: '4H' },
    { value: '24h', label: '24H' }
  ];

  const currentPrice = priceData.length > 0 ? priceData[priceData.length - 1].price : formData.currentPrice;
  const priceChange = priceData.length > 1 
    ? ((currentPrice - priceData[0].price) / priceData[0].price) * 100
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-text-primary">
            Time: {label}
          </p>
          <p className="text-sm text-text-secondary">
            Price: <span className="font-medium text-text-primary">
              ${payload[0].value.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className={`bg-surface rounded-lg border border-border p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <Icon name="RotateCw" size={20} className="text-primary animate-spin" />
            <span className="text-text-secondary">Loading price data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface rounded-lg border border-border shadow-elevation-1 ${className}`}>
      {/* Chart Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {formData.cryptocurrency || 'BTC'} Price Chart
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl font-bold text-text-primary">
                  ${currentPrice?.toLocaleString()}
                </span>
                <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-success' : 'text-error'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex space-x-1 bg-background-secondary rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`
                  px-3 py-1 rounded-md text-sm font-medium transition-all duration-200
                  ${timeRange === range.value
                    ? 'bg-surface text-primary shadow-elevation-1'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-text-tertiary)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="var(--color-text-tertiary)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Price Line */}
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'var(--color-primary)' }}
              />

              {/* Upper Threshold Line */}
              {formData.upperPriceThreshold && formData.conditions?.includes('upperPrice') && (
                <ReferenceLine
                  y={parseFloat(formData.upperPriceThreshold)}
                  stroke="var(--color-error)"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{ 
                    value: `Upper: $${parseFloat(formData.upperPriceThreshold).toLocaleString()}`, 
                    position: 'topRight',
                    fill: 'var(--color-error)',
                    fontSize: 12
                  }}
                />
              )}

              {/* Lower Threshold Line */}
              {formData.lowerPriceThreshold && formData.conditions?.includes('lowerPrice') && (
                <ReferenceLine
                  y={parseFloat(formData.lowerPriceThreshold)}
                  stroke="var(--color-warning)"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{ 
                    value: `Lower: $${parseFloat(formData.lowerPriceThreshold).toLocaleString()}`, 
                    position: 'bottomRight',
                    fill: 'var(--color-warning)',
                    fontSize: 12
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Threshold Legend */}
        {(formData.conditions?.includes('upperPrice') || formData.conditions?.includes('lowerPrice')) && (
          <div className="mt-4 flex flex-wrap gap-4">
            {formData.conditions?.includes('upperPrice') && formData.upperPriceThreshold && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-error" style={{ borderTop: '2px dashed var(--color-error)' }} />
                <span className="text-sm text-text-secondary">
                  Upper Threshold: ${parseFloat(formData.upperPriceThreshold).toLocaleString()}
                </span>
              </div>
            )}
            {formData.conditions?.includes('lowerPrice') && formData.lowerPriceThreshold && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-0.5 bg-warning" style={{ borderTop: '2px dashed var(--color-warning)' }} />
                <span className="text-sm text-text-secondary">
                  Lower Threshold: ${parseFloat(formData.lowerPriceThreshold).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Market Status */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-text-secondary">Live Data</span>
            </div>
            <span className="text-text-tertiary">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          <div className="text-text-tertiary">
            {formData.cryptocurrency || 'BTC'}/USD • {timeRange.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceVisualizationChart;
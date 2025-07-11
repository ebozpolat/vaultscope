import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const PriceChart = ({ data, thresholdValue, alertTime, cryptocurrency }) => {
  const formatPrice = (value) => {
    return `$${value.toLocaleString()}`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-text-primary">
            {new Date(label).toLocaleString()}
          </p>
          <p className="text-sm text-text-secondary">
            Price: <span className="font-medium text-text-primary">{formatPrice(data.price)}</span>
          </p>
          <p className="text-sm text-text-secondary">
            Volume: <span className="font-medium text-text-primary">{data.volume.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="TrendingUp" size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-text-primary">
            {cryptocurrency} Price Movement
          </h3>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-text-secondary">Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full" />
            <span className="text-text-secondary">Threshold</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-text-secondary">Alert Trigger</span>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatTime}
              stroke="var(--color-text-secondary)"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatPrice}
              stroke="var(--color-text-secondary)"
              fontSize={12}
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
            
            {/* Threshold Reference Line */}
            <ReferenceLine 
              y={thresholdValue} 
              stroke="var(--color-error)" 
              strokeDasharray="5 5"
              strokeWidth={2}
            />
            
            {/* Alert Trigger Time */}
            <ReferenceLine 
              x={alertTime} 
              stroke="var(--color-warning)" 
              strokeDasharray="3 3"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="mt-4 p-4 bg-background-secondary rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-text-primary">Current Price:</span>
            <span className="ml-2 text-text-secondary">
              {formatPrice(data[data.length - 1]?.price || 0)}
            </span>
          </div>
          <div>
            <span className="font-medium text-text-primary">Threshold:</span>
            <span className="ml-2 text-text-secondary">
              {formatPrice(thresholdValue)}
            </span>
          </div>
          <div>
            <span className="font-medium text-text-primary">Alert Time:</span>
            <span className="ml-2 text-text-secondary">
              {new Date(alertTime).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
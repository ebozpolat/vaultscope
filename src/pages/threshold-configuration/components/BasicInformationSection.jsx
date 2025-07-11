import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const BasicInformationSection = ({ 
  formData, 
  onFormDataChange, 
  isCollapsed, 
  onToggleCollapse,
  errors = {} 
}) => {
  const [selectedCrypto, setSelectedCrypto] = useState(formData.cryptocurrency || '');

  const cryptocurrencies = [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.75, change: 2.34 },
    { symbol: 'ETH', name: 'Ethereum', price: 2580.42, change: -1.23 },
    { symbol: 'ADA', name: 'Cardano', price: 0.485, change: 4.67 },
    { symbol: 'SOL', name: 'Solana', price: 98.34, change: 3.21 },
    { symbol: 'DOT', name: 'Polkadot', price: 7.89, change: -0.89 },
    { symbol: 'MATIC', name: 'Polygon', price: 0.92, change: 1.45 },
    { symbol: 'AVAX', name: 'Avalanche', price: 36.78, change: 2.87 },
    { symbol: 'LINK', name: 'Chainlink', price: 14.56, change: -2.34 }
  ];

  const handleCryptoSelect = (crypto) => {
    setSelectedCrypto(crypto.symbol);
    onFormDataChange({
      ...formData,
      cryptocurrency: crypto.symbol,
      cryptoName: crypto.name,
      currentPrice: crypto.price
    });
  };

  const handleInputChange = (field, value) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-background-secondary transition-colors duration-200"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Info" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Basic Information</h3>
        </div>
        <Icon 
          name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-text-secondary" 
        />
      </div>

      {!isCollapsed && (
        <div className="px-6 pb-6 space-y-6">
          {/* Cryptocurrency Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Cryptocurrency *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {cryptocurrencies.map((crypto) => (
                <button
                  key={crypto.symbol}
                  type="button"
                  onClick={() => handleCryptoSelect(crypto)}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-200 text-left
                    ${selectedCrypto === crypto.symbol
                      ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-200 hover:bg-background-secondary'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{crypto.symbol}</div>
                      <div className="text-xs text-text-secondary truncate">{crypto.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${crypto.price.toLocaleString()}</div>
                      <div className={`text-xs ${crypto.change >= 0 ? 'text-success' : 'text-error'}`}>
                        {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.cryptocurrency && (
              <p className="mt-1 text-sm text-error">{errors.cryptocurrency}</p>
            )}
          </div>

          {/* Selected Crypto Info */}
          {selectedCrypto && (
            <div className="bg-background-secondary rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      {selectedCrypto.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary">
                      {cryptocurrencies.find(c => c.symbol === selectedCrypto)?.name}
                    </h4>
                    <p className="text-sm text-text-secondary">{selectedCrypto}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-text-primary">
                    ${cryptocurrencies.find(c => c.symbol === selectedCrypto)?.price.toLocaleString()}
                  </div>
                  <div className={`text-sm ${
                    cryptocurrencies.find(c => c.symbol === selectedCrypto)?.change >= 0 
                      ? 'text-success' :'text-error'
                  }`}>
                    {cryptocurrencies.find(c => c.symbol === selectedCrypto)?.change >= 0 ? '+' : ''}
                    {cryptocurrencies.find(c => c.symbol === selectedCrypto)?.change}% (24h)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Threshold Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Threshold Name *
            </label>
            <Input
              type="text"
              placeholder="e.g., BTC High Price Alert"
              value={formData.thresholdName || ''}
              onChange={(e) => handleInputChange('thresholdName', e.target.value)}
              className={errors.thresholdName ? 'border-error' : ''}
            />
            {errors.thresholdName && (
              <p className="mt-1 text-sm text-error">{errors.thresholdName}</p>
            )}
            <p className="mt-1 text-xs text-text-tertiary">
              Choose a descriptive name that clearly identifies this threshold
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe the purpose and conditions of this threshold..."
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none text-text-primary bg-surface"
            />
            <p className="mt-1 text-xs text-text-tertiary">
              Optional: Provide additional context for this threshold configuration
            </p>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Use Template (Optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'Price Spike Alert', desc: 'Monitors sudden price increases' },
                { name: 'Price Drop Alert', desc: 'Monitors significant price decreases' },
                { name: 'Volume Surge', desc: 'Tracks unusual trading volume' }
              ].map((template) => (
                <Button
                  key={template.name}
                  variant="outline"
                  onClick={() => {
                    // Apply template logic here
                    console.log(`Applying template: ${template.name}`);
                  }}
                  className="p-4 h-auto text-left justify-start"
                >
                  <div>
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-text-secondary mt-1">{template.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInformationSection;
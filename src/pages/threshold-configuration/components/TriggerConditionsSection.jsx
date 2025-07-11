import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';


const TriggerConditionsSection = ({ 
  formData, 
  onFormDataChange, 
  isCollapsed, 
  onToggleCollapse,
  errors = {} 
}) => {
  const [activeTab, setActiveTab] = useState('price');

  const handleInputChange = (field, value) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const handleConditionToggle = (condition) => {
    const conditions = formData.conditions || [];
    const updatedConditions = conditions.includes(condition)
      ? conditions.filter(c => c !== condition)
      : [...conditions, condition];
    
    onFormDataChange({
      ...formData,
      conditions: updatedConditions
    });
  };

  const tabs = [
    { id: 'price', label: 'Price Thresholds', icon: 'DollarSign' },
    { id: 'percentage', label: 'Percentage Changes', icon: 'Percent' },
    { id: 'volume', label: 'Volume Parameters', icon: 'BarChart3' }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-background-secondary transition-colors duration-200"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Target" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Trigger Conditions</h3>
        </div>
        <Icon 
          name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-text-secondary" 
        />
      </div>

      {!isCollapsed && (
        <div className="px-6 pb-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-background-secondary rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-surface text-primary shadow-elevation-1'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                <Icon name={tab.icon} size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Price Thresholds Tab */}
          {activeTab === 'price' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upper Threshold */}
                <div>
                  <label className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.conditions?.includes('upperPrice') || false}
                      onChange={() => handleConditionToggle('upperPrice')}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text-primary">Upper Price Threshold</span>
                  </label>
                  <div className="space-y-3">
                    <Input
                      type="number"
                      placeholder="Enter maximum price"
                      value={formData.upperPriceThreshold || ''}
                      onChange={(e) => handleInputChange('upperPriceThreshold', e.target.value)}
                      disabled={!formData.conditions?.includes('upperPrice')}
                      className={errors.upperPriceThreshold ? 'border-error' : ''}
                    />
                    <div className="flex items-center space-x-2">
                      <Icon name="TrendingUp" size={16} className="text-success" />
                      <span className="text-xs text-text-secondary">
                        Alert when price exceeds this value
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lower Threshold */}
                <div>
                  <label className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.conditions?.includes('lowerPrice') || false}
                      onChange={() => handleConditionToggle('lowerPrice')}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text-primary">Lower Price Threshold</span>
                  </label>
                  <div className="space-y-3">
                    <Input
                      type="number"
                      placeholder="Enter minimum price"
                      value={formData.lowerPriceThreshold || ''}
                      onChange={(e) => handleInputChange('lowerPriceThreshold', e.target.value)}
                      disabled={!formData.conditions?.includes('lowerPrice')}
                      className={errors.lowerPriceThreshold ? 'border-error' : ''}
                    />
                    <div className="flex items-center space-x-2">
                      <Icon name="TrendingDown" size={16} className="text-error" />
                      <span className="text-xs text-text-secondary">
                        Alert when price falls below this value
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Price Reference */}
              {formData.currentPrice && (
                <div className="bg-background-secondary rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Current {formData.cryptocurrency} Price:</span>
                    <span className="text-lg font-bold text-text-primary">
                      ${formData.currentPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Percentage Changes Tab */}
          {activeTab === 'percentage' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Percentage Increase */}
                <div>
                  <label className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.conditions?.includes('percentageIncrease') || false}
                      onChange={() => handleConditionToggle('percentageIncrease')}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text-primary">Percentage Increase</span>
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="5.0"
                        value={formData.percentageIncrease || ''}
                        onChange={(e) => handleInputChange('percentageIncrease', e.target.value)}
                        disabled={!formData.conditions?.includes('percentageIncrease')}
                        className="flex-1"
                      />
                      <span className="flex items-center px-3 bg-background-secondary rounded-lg text-text-secondary">%</span>
                    </div>
                    <select
                      value={formData.percentageIncreaseTimeframe || '1h'}
                      onChange={(e) => handleInputChange('percentageIncreaseTimeframe', e.target.value)}
                      disabled={!formData.conditions?.includes('percentageIncrease')}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary bg-surface"
                    >
                      <option value="5m">5 minutes</option>
                      <option value="15m">15 minutes</option>
                      <option value="1h">1 hour</option>
                      <option value="4h">4 hours</option>
                      <option value="24h">24 hours</option>
                    </select>
                  </div>
                </div>

                {/* Percentage Decrease */}
                <div>
                  <label className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.conditions?.includes('percentageDecrease') || false}
                      onChange={() => handleConditionToggle('percentageDecrease')}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text-primary">Percentage Decrease</span>
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="5.0"
                        value={formData.percentageDecrease || ''}
                        onChange={(e) => handleInputChange('percentageDecrease', e.target.value)}
                        disabled={!formData.conditions?.includes('percentageDecrease')}
                        className="flex-1"
                      />
                      <span className="flex items-center px-3 bg-background-secondary rounded-lg text-text-secondary">%</span>
                    </div>
                    <select
                      value={formData.percentageDecreaseTimeframe || '1h'}
                      onChange={(e) => handleInputChange('percentageDecreaseTimeframe', e.target.value)}
                      disabled={!formData.conditions?.includes('percentageDecrease')}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary bg-surface"
                    >
                      <option value="5m">5 minutes</option>
                      <option value="15m">15 minutes</option>
                      <option value="1h">1 hour</option>
                      <option value="4h">4 hours</option>
                      <option value="24h">24 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Volume Parameters Tab */}
          {activeTab === 'volume' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Volume Spike */}
                <div>
                  <label className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.conditions?.includes('volumeSpike') || false}
                      onChange={() => handleConditionToggle('volumeSpike')}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text-primary">Volume Spike Detection</span>
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="200"
                        value={formData.volumeSpikeMultiplier || ''}
                        onChange={(e) => handleInputChange('volumeSpikeMultiplier', e.target.value)}
                        disabled={!formData.conditions?.includes('volumeSpike')}
                        className="flex-1"
                      />
                      <span className="flex items-center px-3 bg-background-secondary rounded-lg text-text-secondary">%</span>
                    </div>
                    <p className="text-xs text-text-tertiary">
                      Alert when volume exceeds average by this percentage
                    </p>
                  </div>
                </div>

                {/* Minimum Volume */}
                <div>
                  <label className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      checked={formData.conditions?.includes('minimumVolume') || false}
                      onChange={() => handleConditionToggle('minimumVolume')}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-text-primary">Minimum Volume Threshold</span>
                  </label>
                  <div className="space-y-3">
                    <Input
                      type="number"
                      placeholder="1000000"
                      value={formData.minimumVolume || ''}
                      onChange={(e) => handleInputChange('minimumVolume', e.target.value)}
                      disabled={!formData.conditions?.includes('minimumVolume')}
                    />
                    <p className="text-xs text-text-tertiary">
                      Minimum trading volume required to trigger alert
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Condition Summary */}
          {formData.conditions && formData.conditions.length > 0 && (
            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <h4 className="text-sm font-medium text-primary mb-2">Active Conditions Summary:</h4>
              <div className="flex flex-wrap gap-2">
                {formData.conditions.map((condition) => (
                  <span
                    key={condition}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground"
                  >
                    {condition.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TriggerConditionsSection;
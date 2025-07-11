import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const AdvancedOptionsSection = ({ 
  formData, 
  onFormDataChange, 
  isCollapsed, 
  onToggleCollapse,
  errors = {} 
}) => {
  const [activeTimeConditions, setActiveTimeConditions] = useState(
    formData.timeConditions || []
  );

  const handleInputChange = (field, value) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const handleTimeConditionToggle = (condition) => {
    const updatedConditions = activeTimeConditions.includes(condition)
      ? activeTimeConditions.filter(c => c !== condition)
      : [...activeTimeConditions, condition];
    
    setActiveTimeConditions(updatedConditions);
    onFormDataChange({
      ...formData,
      timeConditions: updatedConditions
    });
  };

  const timeConditions = [
    { id: 'businessHours', label: 'Business Hours Only', desc: 'Only trigger during business hours (9 AM - 5 PM)' },
    { id: 'weekdays', label: 'Weekdays Only', desc: 'Only trigger Monday through Friday' },
    { id: 'marketHours', label: 'Market Hours', desc: 'Only trigger during active trading hours' },
    { id: 'customSchedule', label: 'Custom Schedule', desc: 'Define specific time windows' }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-background-secondary transition-colors duration-200"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Settings2" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Advanced Options</h3>
        </div>
        <Icon 
          name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-text-secondary" 
        />
      </div>

      {!isCollapsed && (
        <div className="px-6 pb-6 space-y-6">
          {/* Time-based Conditions */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Time-based Conditions
            </label>
            <div className="space-y-3">
              {timeConditions.map((condition) => (
                <div
                  key={condition.id}
                  className={`
                    p-4 rounded-lg border cursor-pointer transition-all duration-200
                    ${activeTimeConditions.includes(condition.id)
                      ? 'border-primary bg-primary-50' :'border-border hover:border-primary-200 hover:bg-background-secondary'
                    }
                  `}
                  onClick={() => handleTimeConditionToggle(condition.id)}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={activeTimeConditions.includes(condition.id)}
                      onChange={() => handleTimeConditionToggle(condition.id)}
                      className="mt-1 rounded border-border text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-text-primary">{condition.label}</div>
                      <p className="text-xs text-text-secondary mt-1">{condition.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Schedule Configuration */}
            {activeTimeConditions.includes('customSchedule') && (
              <div className="mt-4 p-4 bg-background-secondary rounded-lg">
                <h4 className="text-sm font-medium text-text-primary mb-3">Custom Schedule Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Start Time</label>
                    <Input
                      type="time"
                      value={formData.customStartTime || '09:00'}
                      onChange={(e) => handleInputChange('customStartTime', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">End Time</label>
                    <Input
                      type="time"
                      value={formData.customEndTime || '17:00'}
                      onChange={(e) => handleInputChange('customEndTime', e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-text-secondary mb-2">Active Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const activeDays = formData.customActiveDays || [];
                          const updatedDays = activeDays.includes(day)
                            ? activeDays.filter(d => d !== day)
                            : [...activeDays, day];
                          handleInputChange('customActiveDays', updatedDays);
                        }}
                        className={`
                          px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                          ${(formData.customActiveDays || []).includes(day)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background-tertiary text-text-secondary hover:bg-primary-100'
                          }
                        `}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cooldown Period */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Cooldown Period
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableCooldown"
                checked={formData.enableCooldown || false}
                onChange={(e) => handleInputChange('enableCooldown', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="enableCooldown" className="text-sm text-text-primary">
                Enable cooldown period between alerts
              </label>
            </div>

            {formData.enableCooldown && (
              <div className="mt-3 p-4 bg-background-secondary rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Cooldown Duration</label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="15"
                        value={formData.cooldownDuration || ''}
                        onChange={(e) => handleInputChange('cooldownDuration', e.target.value)}
                        className="flex-1"
                      />
                      <select
                        value={formData.cooldownUnit || 'minutes'}
                        onChange={(e) => handleInputChange('cooldownUnit', e.target.value)}
                        className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary bg-surface"
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-text-secondary mb-1">Cooldown Type</label>
                    <select
                      value={formData.cooldownType || 'global'}
                      onChange={(e) => handleInputChange('cooldownType', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary bg-surface"
                    >
                      <option value="global">Global (all conditions)</option>
                      <option value="perCondition">Per condition</option>
                      <option value="perAsset">Per cryptocurrency</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-text-tertiary mt-2">
                  Prevents spam alerts by enforcing a minimum time between notifications
                </p>
              </div>
            )}
          </div>

          {/* Auto-resolution Settings */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Auto-resolution Settings
            </label>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableAutoResolution"
                  checked={formData.enableAutoResolution || false}
                  onChange={(e) => handleInputChange('enableAutoResolution', e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="enableAutoResolution" className="text-sm text-text-primary">
                  Automatically resolve alerts when conditions return to normal
                </label>
              </div>

              {formData.enableAutoResolution && (
                <div className="ml-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-text-secondary">Resolution delay:</span>
                    <Input
                      type="number"
                      placeholder="5"
                      value={formData.resolutionDelay || ''}
                      onChange={(e) => handleInputChange('resolutionDelay', e.target.value)}
                      className="w-20"
                    />
                    <span className="text-sm text-text-secondary">minutes after conditions normalize</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="notifyOnResolution"
                      checked={formData.notifyOnResolution || false}
                      onChange={(e) => handleInputChange('notifyOnResolution', e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="notifyOnResolution" className="text-sm text-text-primary">
                      Send notification when alert is auto-resolved
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Data Source Configuration */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Data Source Configuration
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Primary Exchange</label>
                <select
                  value={formData.primaryExchange || 'binance'}
                  onChange={(e) => handleInputChange('primaryExchange', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-text-primary bg-surface"
                >
                  <option value="binance">Binance</option>
                  <option value="coinbase">Coinbase Pro</option>
                  <option value="kraken">Kraken</option>
                  <option value="huobi">Huobi</option>
                  <option value="okx">OKX</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableFallback"
                  checked={formData.enableFallback || false}
                  onChange={(e) => handleInputChange('enableFallback', e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="enableFallback" className="text-sm text-text-primary">
                  Enable fallback data sources
                </label>
              </div>

              {formData.enableFallback && (
                <div className="ml-6">
                  <label className="block text-xs text-text-secondary mb-1">Fallback Exchanges</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['coinbase', 'kraken', 'huobi', 'okx'].map((exchange) => (
                      <label key={exchange} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={(formData.fallbackExchanges || []).includes(exchange)}
                          onChange={(e) => {
                            const fallbacks = formData.fallbackExchanges || [];
                            const updated = e.target.checked
                              ? [...fallbacks, exchange]
                              : fallbacks.filter(ex => ex !== exchange);
                            handleInputChange('fallbackExchanges', updated);
                          }}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-text-primary capitalize">{exchange}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Testing and Validation */}
          <div className="bg-background-secondary rounded-lg p-4">
            <h4 className="text-sm font-medium text-text-primary mb-3">Testing & Validation</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enableTestMode"
                  checked={formData.enableTestMode || false}
                  onChange={(e) => handleInputChange('enableTestMode', e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="enableTestMode" className="text-sm text-text-primary">
                  Enable test mode (alerts won't be sent to external systems)
                </label>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  console.log('Testing threshold configuration...');
                  alert('Threshold test initiated. Check the dashboard for results.');
                }}
                iconName="Play"
                iconSize={16}
                className="w-full"
              >
                Test Threshold Configuration
              </Button>

              <p className="text-xs text-text-tertiary">
                Test mode allows you to validate threshold logic without triggering actual alerts
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedOptionsSection;
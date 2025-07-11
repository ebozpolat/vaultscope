import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GeneralSettingsTab = ({ settings, onSettingsChange, onSave, onReset }) => {
  const [localSettings, setLocalSettings] = useState(settings.general);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
    onSettingsChange('general', updatedSettings);
  };

  const handleSave = () => {
    onSave('general');
    setHasChanges(false);
  };

  const handleReset = () => {
    onReset('general');
    setHasChanges(false);
  };

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Berlin', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' }
  ];

  const refreshIntervalOptions = [
    { value: '1', label: '1 second' },
    { value: '5', label: '5 seconds' },
    { value: '10', label: '10 seconds' },
    { value: '30', label: '30 seconds' },
    { value: '60', label: '1 minute' },
    { value: '300', label: '5 minutes' }
  ];

  const retentionOptions = [
    { value: '7', label: '7 days' },
    { value: '14', label: '14 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
    { value: '180', label: '6 months' },
    { value: '365', label: '1 year' }
  ];

  return (
    <div className="space-y-8">
      {/* System Configuration */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">System Configuration</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Timezone */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              System Timezone
            </label>
            <select
              value={localSettings.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {timezoneOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-text-tertiary">
              All timestamps will be displayed in this timezone
            </p>
          </div>

          {/* Default Currency */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Default Currency Display
            </label>
            <select
              value={localSettings.defaultCurrency}
              onChange={(e) => handleInputChange('defaultCurrency', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-text-tertiary">
              Primary currency for price displays and calculations
            </p>
          </div>

          {/* Data Refresh Interval */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Data Refresh Interval
            </label>
            <select
              value={localSettings.refreshInterval}
              onChange={(e) => handleInputChange('refreshInterval', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {refreshIntervalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-text-tertiary">
              How often to fetch new market data
            </p>
          </div>

          {/* Alert Retention Policy */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Alert Retention Period
            </label>
            <select
              value={localSettings.alertRetention}
              onChange={(e) => handleInputChange('alertRetention', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {retentionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-text-tertiary">
              How long to keep alert history
            </p>
          </div>
        </div>
      </div>

      {/* System Limits */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Gauge" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">System Limits</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Max Concurrent Alerts */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Maximum Concurrent Alerts
            </label>
            <Input
              type="number"
              value={localSettings.maxConcurrentAlerts}
              onChange={(e) => handleInputChange('maxConcurrentAlerts', e.target.value)}
              placeholder="Enter maximum alerts"
              min="1"
              max="1000"
            />
            <p className="text-xs text-text-tertiary">
              Maximum number of active alerts (1-1000)
            </p>
          </div>

          {/* Max Thresholds */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Maximum Thresholds per Asset
            </label>
            <Input
              type="number"
              value={localSettings.maxThresholdsPerAsset}
              onChange={(e) => handleInputChange('maxThresholdsPerAsset', e.target.value)}
              placeholder="Enter maximum thresholds"
              min="1"
              max="50"
            />
            <p className="text-xs text-text-tertiary">
              Maximum thresholds per cryptocurrency (1-50)
            </p>
          </div>

          {/* Data Points Limit */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Chart Data Points Limit
            </label>
            <Input
              type="number"
              value={localSettings.chartDataLimit}
              onChange={(e) => handleInputChange('chartDataLimit', e.target.value)}
              placeholder="Enter data points limit"
              min="100"
              max="10000"
            />
            <p className="text-xs text-text-tertiary">
              Maximum data points to display in charts (100-10000)
            </p>
          </div>

          {/* API Rate Limit */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              API Rate Limit (requests/minute)
            </label>
            <Input
              type="number"
              value={localSettings.apiRateLimit}
              onChange={(e) => handleInputChange('apiRateLimit', e.target.value)}
              placeholder="Enter rate limit"
              min="10"
              max="1000"
            />
            <p className="text-xs text-text-tertiary">
              Maximum API requests per minute (10-1000)
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges}
            iconName="Save"
            iconSize={16}
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
            iconName="RotateCcw"
            iconSize={16}
          >
            Reset to Defaults
          </Button>
        </div>

        {hasChanges && (
          <div className="flex items-center space-x-2 text-warning">
            <Icon name="AlertCircle" size={16} />
            <span className="text-sm font-medium">Unsaved changes</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSettingsTab;
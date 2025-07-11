import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const IntegrationConfigTab = ({ settings, onSettingsChange, onSave, onReset }) => {
  const [localSettings, setLocalSettings] = useState(settings.integrations);
  const [hasChanges, setHasChanges] = useState(false);
  const [testingConnection, setTestingConnection] = useState({});

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
    onSettingsChange('integrations', updatedSettings);
  };

  const handleToggleChange = (field) => {
    const updatedSettings = { ...localSettings, [field]: !localSettings[field] };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
    onSettingsChange('integrations', updatedSettings);
  };

  const handleSave = () => {
    onSave('integrations');
    setHasChanges(false);
  };

  const handleReset = () => {
    onReset('integrations');
    setHasChanges(false);
  };

  const handleTestConnection = async (service) => {
    setTestingConnection(prev => ({ ...prev, [service]: true }));
    
    // Simulate connection test
    setTimeout(() => {
      setTestingConnection(prev => ({ ...prev, [service]: false }));
      const success = Math.random() > 0.3; // 70% success rate
      alert(success ? `${service} connection successful!` : `${service} connection failed. Please check your configuration.`);
    }, 2000);
  };

  const exchangeOptions = [
    { value: 'binance', label: 'Binance', icon: 'TrendingUp' },
    { value: 'coinbase', label: 'Coinbase Pro', icon: 'DollarSign' },
    { value: 'kraken', label: 'Kraken', icon: 'Waves' },
    { value: 'bitfinex', label: 'Bitfinex', icon: 'BarChart3' },
    { value: 'huobi', label: 'Huobi', icon: 'Activity' },
    { value: 'okx', label: 'OKX', icon: 'Zap' }
  ];

  return (
    <div className="space-y-8">
      {/* Exchange Integrations */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Globe" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Exchange Integrations</h3>
        </div>

        <div className="space-y-6">
          {/* Exchange Selection */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Enabled Exchanges</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exchangeOptions.map((exchange) => (
                <div
                  key={exchange.value}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    localSettings.enabledExchanges.includes(exchange.value)
                      ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon name={exchange.icon} size={20} className="text-primary" />
                      <span className="font-medium text-text-primary">{exchange.label}</span>
                    </div>
                    <button
                      onClick={() => {
                        const updatedExchanges = localSettings.enabledExchanges.includes(exchange.value)
                          ? localSettings.enabledExchanges.filter(e => e !== exchange.value)
                          : [...localSettings.enabledExchanges, exchange.value];
                        handleInputChange('enabledExchanges', updatedExchanges);
                      }}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        localSettings.enabledExchanges.includes(exchange.value) ? 'bg-primary' : 'bg-secondary-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          localSettings.enabledExchanges.includes(exchange.value) ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Configuration */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">API Configuration</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Default API Timeout (seconds)
                </label>
                <Input
                  type="number"
                  value={localSettings.apiTimeout}
                  onChange={(e) => handleInputChange('apiTimeout', e.target.value)}
                  placeholder="30"
                  min="5"
                  max="300"
                />
                <p className="text-xs text-text-tertiary">
                  Maximum time to wait for API responses
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Retry Attempts
                </label>
                <Input
                  type="number"
                  value={localSettings.retryAttempts}
                  onChange={(e) => handleInputChange('retryAttempts', e.target.value)}
                  placeholder="3"
                  min="1"
                  max="10"
                />
                <p className="text-xs text-text-tertiary">
                  Number of retry attempts for failed requests
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Rate Limit Buffer (%)
                </label>
                <Input
                  type="number"
                  value={localSettings.rateLimitBuffer}
                  onChange={(e) => handleInputChange('rateLimitBuffer', e.target.value)}
                  placeholder="20"
                  min="0"
                  max="50"
                />
                <p className="text-xs text-text-tertiary">
                  Safety buffer below exchange rate limits
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Connection Pool Size
                </label>
                <Input
                  type="number"
                  value={localSettings.connectionPoolSize}
                  onChange={(e) => handleInputChange('connectionPoolSize', e.target.value)}
                  placeholder="10"
                  min="1"
                  max="50"
                />
                <p className="text-xs text-text-tertiary">
                  Maximum concurrent connections per exchange
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Database" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Data Sources</h3>
        </div>

        <div className="space-y-6">
          {/* Primary Data Source */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Primary Data Source</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Market Data Provider
                </label>
                <select
                  value={localSettings.primaryDataSource}
                  onChange={(e) => handleInputChange('primaryDataSource', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="coinmarketcap">CoinMarketCap</option>
                  <option value="coingecko">CoinGecko</option>
                  <option value="cryptocompare">CryptoCompare</option>
                  <option value="messari">Messari</option>
                  <option value="nomics">Nomics</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Backup Data Source
                </label>
                <select
                  value={localSettings.backupDataSource}
                  onChange={(e) => handleInputChange('backupDataSource', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="coingecko">CoinGecko</option>
                  <option value="coinmarketcap">CoinMarketCap</option>
                  <option value="cryptocompare">CryptoCompare</option>
                  <option value="messari">Messari</option>
                  <option value="nomics">Nomics</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Data Source API Key
                </label>
                <Input
                  type="password"
                  value={localSettings.dataSourceApiKey}
                  onChange={(e) => handleInputChange('dataSourceApiKey', e.target.value)}
                  placeholder="Enter API key"
                />
                <p className="text-xs text-text-tertiary">
                  API key for market data provider
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Update Frequency (seconds)
                </label>
                <Input
                  type="number"
                  value={localSettings.dataUpdateFrequency}
                  onChange={(e) => handleInputChange('dataUpdateFrequency', e.target.value)}
                  placeholder="60"
                  min="10"
                  max="3600"
                />
                <p className="text-xs text-text-tertiary">
                  How often to fetch new market data
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => handleTestConnection('data-source')}
                disabled={testingConnection['data-source']}
                iconName={testingConnection['data-source'] ? "Loader2" : "TestTube"}
                iconSize={16}
                className={testingConnection['data-source'] ? "animate-spin" : ""}
              >
                {testingConnection['data-source'] ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          </div>

          {/* Data Quality Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Data Quality</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-text-primary">
                    Enable Data Validation
                  </label>
                  <p className="text-xs text-text-tertiary">
                    Validate incoming data for anomalies
                  </p>
                </div>
                <button
                  onClick={() => handleToggleChange('enableDataValidation')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.enableDataValidation ? 'bg-primary' : 'bg-secondary-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.enableDataValidation ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-text-primary">
                    Auto-Failover
                  </label>
                  <p className="text-xs text-text-tertiary">
                    Automatically switch to backup data source on failure
                  </p>
                </div>
                <button
                  onClick={() => handleToggleChange('autoFailover')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.autoFailover ? 'bg-primary' : 'bg-secondary-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.autoFailover ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Services */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Cloud" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">External Services</h3>
        </div>

        <div className="space-y-6">
          {/* Monitoring Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Monitoring & Analytics</h4>
            
            {/* Datadog Integration */}
            <div className="p-4 bg-background-secondary rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon name="BarChart3" size={20} className="text-primary" />
                  <div>
                    <span className="font-medium text-text-primary">Datadog</span>
                    <p className="text-xs text-text-tertiary">Application monitoring and metrics</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleChange('datadogEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.datadogEnabled ? 'bg-primary' : 'bg-secondary-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.datadogEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {localSettings.datadogEnabled && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">
                      API Key
                    </label>
                    <Input
                      type="password"
                      value={localSettings.datadogApiKey}
                      onChange={(e) => handleInputChange('datadogApiKey', e.target.value)}
                      placeholder="Enter Datadog API key"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-primary">
                      Application Key
                    </label>
                    <Input
                      type="password"
                      value={localSettings.datadogAppKey}
                      onChange={(e) => handleInputChange('datadogAppKey', e.target.value)}
                      placeholder="Enter Datadog application key"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sentry Integration */}
            <div className="p-4 bg-background-secondary rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon name="Bug" size={20} className="text-primary" />
                  <div>
                    <span className="font-medium text-text-primary">Sentry</span>
                    <p className="text-xs text-text-tertiary">Error tracking and performance monitoring</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleChange('sentryEnabled')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    localSettings.sentryEnabled ? 'bg-primary' : 'bg-secondary-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      localSettings.sentryEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {localSettings.sentryEnabled && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">
                    DSN (Data Source Name)
                  </label>
                  <Input
                    type="text"
                    value={localSettings.sentryDsn}
                    onChange={(e) => handleInputChange('sentryDsn', e.target.value)}
                    placeholder="https://examplePublicKey@o0.ingest.sentry.io/0"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Test Connections */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => handleTestConnection('monitoring')}
              disabled={testingConnection['monitoring']}
              iconName={testingConnection['monitoring'] ? "Loader2" : "TestTube"}
              iconSize={16}
              className={testingConnection['monitoring'] ? "animate-spin" : ""}
            >
              {testingConnection['monitoring'] ? 'Testing...' : 'Test All Connections'}
            </Button>
          </div>
        </div>
      </div>

      {/* Backup & Recovery */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="HardDrive" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Backup & Recovery</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Backup Frequency
              </label>
              <select
                value={localSettings.backupFrequency}
                onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Backup Retention (days)
              </label>
              <Input
                type="number"
                value={localSettings.backupRetention}
                onChange={(e) => handleInputChange('backupRetention', e.target.value)}
                placeholder="30"
                min="1"
                max="365"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Backup Location
              </label>
              <Input
                type="text"
                value={localSettings.backupLocation}
                onChange={(e) => handleInputChange('backupLocation', e.target.value)}
                placeholder="/var/backups/vaultscope"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Compression Level
              </label>
              <select
                value={localSettings.compressionLevel}
                onChange={(e) => handleInputChange('compressionLevel', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Enable Automatic Backups
                </label>
                <p className="text-xs text-text-tertiary">
                  Automatically backup configuration and data
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('autoBackup')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.autoBackup ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Encrypt Backups
                </label>
                <p className="text-xs text-text-tertiary">
                  Encrypt backup files for security
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('encryptBackups')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.encryptBackups ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.encryptBackups ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
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

export default IntegrationConfigTab;
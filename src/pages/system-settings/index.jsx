import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import GeneralSettingsTab from './components/GeneralSettingsTab';
import NotificationPreferencesTab from './components/NotificationPreferencesTab';
import DisplayOptionsTab from './components/DisplayOptionsTab';
import SecuritySettingsTab from './components/SecuritySettingsTab';
import IntegrationConfigTab from './components/IntegrationConfigTab';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      timezone: 'UTC',
      defaultCurrency: 'USD',
      refreshInterval: '10',
      alertRetention: '30',
      maxConcurrentAlerts: '100',
      maxThresholdsPerAsset: '10',
      chartDataLimit: '1000',
      apiRateLimit: '1000'
    },
    notifications: {
      emailEnabled: true,
      emailDigest: false,
      larkWebhookEnabled: true,
      larkWebhookUrl: 'https://open.larksuite.com/open-apis/bot/v2/hook/example',
      larkWebhookSecret: '',
      emailSettings: {
        smtpServer: 'smtp.gmail.com',
        smtpPort: '587',
        fromEmail: 'alerts@vaultscope.com',
        defaultRecipients: 'admin@company.com, team@company.com'
      },
      routingRules: {
        low: { email: false, webhook: true },
        medium: { email: true, webhook: true },
        high: { email: true, webhook: true },
        critical: { email: true, webhook: true }
      },
      escalationDelay: '15',
      escalationRecipients: 'manager@company.com, oncall@company.com'
    },
    display: {
      theme: 'light',
      primaryColor: '#1E40AF',
      successColor: '#059669',
      warningColor: '#D97706',
      errorColor: '#DC2626',
      defaultChartType: 'line',
      chartAnimationDuration: '300',
      gridOpacity: '0.3',
      showTooltips: true,
      enableZoom: true,
      tablePageSize: '25',
      tableDensity: 'comfortable',
      dashboardLayout: 'comfortable'
    },
    security: {
      sessionTimeout: '60',
      passwordPolicy: 'standard',
      maxLoginAttempts: '5',
      lockoutDuration: '30',
      requireTwoFactor: false,
      forcePasswordChange: true,
      rememberSessions: true,
      apiKey: 'vsc_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      apiRateLimit: '1000',
      apiKeyExpiration: '365',
      requireHttps: true,
      enableIpWhitelist: false,
      allowedIps: '',
      logRetention: '90',
      logLevel: 'info',
      logUserActions: true,
      logApiRequests: true,
      logSystemEvents: true
    },
    integrations: {
      enabledExchanges: ['binance', 'coinbase', 'kraken'],
      apiTimeout: '30',
      retryAttempts: '3',
      rateLimitBuffer: '20',
      connectionPoolSize: '10',
      primaryDataSource: 'coinmarketcap',
      backupDataSource: 'coingecko',
      dataSourceApiKey: '',
      dataUpdateFrequency: '60',
      enableDataValidation: true,
      autoFailover: true,
      datadogEnabled: false,
      datadogApiKey: '',
      datadogAppKey: '',
      sentryEnabled: false,
      sentryDsn: '',
      backupFrequency: 'daily',
      backupRetention: '30',
      backupLocation: '/var/backups/vaultscope',
      compressionLevel: 'medium',
      autoBackup: true,
      encryptBackups: true
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Mock default settings for reset functionality
  const defaultSettings = {
    general: {
      timezone: 'UTC',
      defaultCurrency: 'USD',
      refreshInterval: '10',
      alertRetention: '30',
      maxConcurrentAlerts: '100',
      maxThresholdsPerAsset: '10',
      chartDataLimit: '1000',
      apiRateLimit: '1000'
    },
    notifications: {
      emailEnabled: true,
      emailDigest: false,
      larkWebhookEnabled: false,
      larkWebhookUrl: '',
      larkWebhookSecret: '',
      emailSettings: {
        smtpServer: '',
        smtpPort: '587',
        fromEmail: '',
        defaultRecipients: ''
      },
      routingRules: {
        low: { email: false, webhook: false },
        medium: { email: true, webhook: false },
        high: { email: true, webhook: true },
        critical: { email: true, webhook: true }
      },
      escalationDelay: '15',
      escalationRecipients: ''
    },
    display: {
      theme: 'light',
      primaryColor: '#1E40AF',
      successColor: '#059669',
      warningColor: '#D97706',
      errorColor: '#DC2626',
      defaultChartType: 'line',
      chartAnimationDuration: '300',
      gridOpacity: '0.3',
      showTooltips: true,
      enableZoom: true,
      tablePageSize: '25',
      tableDensity: 'comfortable',
      dashboardLayout: 'comfortable'
    },
    security: {
      sessionTimeout: '60',
      passwordPolicy: 'standard',
      maxLoginAttempts: '5',
      lockoutDuration: '30',
      requireTwoFactor: false,
      forcePasswordChange: false,
      rememberSessions: false,
      apiKey: '',
      apiRateLimit: '1000',
      apiKeyExpiration: '365',
      requireHttps: true,
      enableIpWhitelist: false,
      allowedIps: '',
      logRetention: '90',
      logLevel: 'info',
      logUserActions: true,
      logApiRequests: false,
      logSystemEvents: true
    },
    integrations: {
      enabledExchanges: ['binance'],
      apiTimeout: '30',
      retryAttempts: '3',
      rateLimitBuffer: '20',
      connectionPoolSize: '10',
      primaryDataSource: 'coinmarketcap',
      backupDataSource: 'coingecko',
      dataSourceApiKey: '',
      dataUpdateFrequency: '60',
      enableDataValidation: true,
      autoFailover: true,
      datadogEnabled: false,
      datadogApiKey: '',
      datadogAppKey: '',
      sentryEnabled: false,
      sentryDsn: '',
      backupFrequency: 'daily',
      backupRetention: '30',
      backupLocation: '/var/backups/vaultscope',
      compressionLevel: 'medium',
      autoBackup: true,
      encryptBackups: false
    }
  };

  const tabs = [
    {
      id: 'general',
      label: 'General Settings',
      icon: 'Settings',
      description: 'System configuration and basic preferences'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      description: 'Email, webhook, and alert routing settings'
    },
    {
      id: 'display',
      label: 'Display Options',
      icon: 'Palette',
      description: 'Theme, charts, and layout preferences'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      description: 'Authentication, API keys, and audit settings'
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: 'Globe',
      description: 'Exchange connections and external services'
    }
  ];

  const handleSettingsChange = (section, newSettings) => {
    setSettings(prev => ({
      ...prev,
      [section]: newSettings
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = (section) => {
    // Simulate save operation
    console.log(`Saving ${section} settings:`, settings[section]);
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
    
    // Show success message
    const event = new CustomEvent('showNotification', {
      detail: {
        type: 'success',
        message: `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`
      }
    });
    window.dispatchEvent(event);
  };

  const handleReset = (section) => {
    if (confirm(`Are you sure you want to reset ${section} settings to defaults? This action cannot be undone.`)) {
      setSettings(prev => ({
        ...prev,
        [section]: { ...defaultSettings[section] }
      }));
      setHasUnsavedChanges(false);
      
      // Show reset message
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'info',
          message: `${section.charAt(0).toUpperCase() + section.slice(1)} settings reset to defaults.`
        }
      });
      window.dispatchEvent(event);
    }
  };

  const handleExportConfig = () => {
    const configData = JSON.stringify(settings, null, 2);
    const blob = new Blob([configData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaultscope-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          if (confirm('Are you sure you want to import this configuration? This will overwrite all current settings.')) {
            setSettings(importedSettings);
            setHasUnsavedChanges(true);
            alert('Configuration imported successfully!');
          }
        } catch (error) {
          alert('Error importing configuration: Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralSettingsTab
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onSave={handleSave}
            onReset={handleReset}
          />
        );
      case 'notifications':
        return (
          <NotificationPreferencesTab
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onSave={handleSave}
            onReset={handleReset}
          />
        );
      case 'display':
        return (
          <DisplayOptionsTab
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onSave={handleSave}
            onReset={handleReset}
          />
        );
      case 'security':
        return (
          <SecuritySettingsTab
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onSave={handleSave}
            onReset={handleReset}
          />
        );
      case 'integrations':
        return (
          <IntegrationConfigTab
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onSave={handleSave}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>System Settings - VaultScope</title>
        <meta name="description" content="Configure system preferences, notifications, security, and integrations for VaultScope crypto surveillance dashboard" />
      </Helmet>

      <Header />
      <Sidebar />

      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <NavigationBreadcrumbs className="mb-4" />
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">System Settings</h1>
                <p className="text-text-secondary mt-2">
                  Configure dashboard preferences, notifications, and system-wide parameters
                </p>
                {lastSaved && (
                  <p className="text-sm text-text-tertiary mt-1">
                    Last saved: {lastSaved.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportConfig}
                  className="hidden"
                  id="import-config"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('import-config').click()}
                  iconName="Upload"
                  iconSize={16}
                >
                  Import Config
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleExportConfig}
                  iconName="Download"
                  iconSize={16}
                >
                  Export Config
                </Button>
              </div>
            </div>

            {hasUnsavedChanges && (
              <div className="mt-4 p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-warning">
                    You have unsaved changes. Make sure to save your settings before leaving this page.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Settings Content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="xl:col-span-1">
              <div className="bg-surface rounded-lg border border-border p-4 sticky top-24">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Settings</h2>
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground shadow-elevation-1'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon 
                          name={tab.icon} 
                          size={18} 
                          className={activeTab === tab.id ? 'text-primary-foreground' : 'text-primary'} 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{tab.label}</div>
                          <div className={`text-xs mt-1 ${
                            activeTab === tab.id ? 'text-primary-foreground/80' : 'text-text-tertiary'
                          }`}>
                            {tab.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="xl:col-span-3">
              <div className="bg-surface rounded-lg border border-border">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={tabs.find(tab => tab.id === activeTab)?.icon} 
                      size={24} 
                      className="text-primary" 
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-text-primary">
                        {tabs.find(tab => tab.id === activeTab)?.label}
                      </h2>
                      <p className="text-text-secondary">
                        {tabs.find(tab => tab.id === activeTab)?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemSettings;
import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SecuritySettingsTab = ({ settings, onSettingsChange, onSave, onReset }) => {
  const [localSettings, setLocalSettings] = useState(settings.security);
  const [hasChanges, setHasChanges] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [generatingApiKey, setGeneratingApiKey] = useState(false);

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
    onSettingsChange('security', updatedSettings);
  };

  const handleToggleChange = (field) => {
    const updatedSettings = { ...localSettings, [field]: !localSettings[field] };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
    onSettingsChange('security', updatedSettings);
  };

  const handleSave = () => {
    onSave('security');
    setHasChanges(false);
  };

  const handleReset = () => {
    onReset('security');
    setHasChanges(false);
  };

  const handleGenerateApiKey = async () => {
    setGeneratingApiKey(true);
    // Simulate API key generation
    setTimeout(() => {
      const newApiKey = 'vsc_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      handleInputChange('apiKey', newApiKey);
      setGeneratingApiKey(false);
      alert('New API key generated successfully!');
    }, 1500);
  };

  const handleRevokeApiKey = () => {
    if (confirm('Are you sure you want to revoke the current API key? This action cannot be undone.')) {
      handleInputChange('apiKey', '');
      alert('API key revoked successfully!');
    }
  };

  const sessionTimeoutOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '120', label: '2 hours' },
    { value: '240', label: '4 hours' },
    { value: '480', label: '8 hours' }
  ];

  const passwordPolicyOptions = [
    { value: 'basic', label: 'Basic (8+ characters)' },
    { value: 'standard', label: 'Standard (8+ chars, mixed case, numbers)' },
    { value: 'strong', label: 'Strong (12+ chars, mixed case, numbers, symbols)' },
    { value: 'enterprise', label: 'Enterprise (16+ chars, all requirements)' }
  ];

  return (
    <div className="space-y-8">
      {/* Authentication Settings */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Authentication Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Session Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Session Timeout
              </label>
              <select
                value={localSettings.sessionTimeout}
                onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {sessionTimeoutOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-text-tertiary">
                Automatic logout after inactivity
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Password Policy
              </label>
              <select
                value={localSettings.passwordPolicy}
                onChange={(e) => handleInputChange('passwordPolicy', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {passwordPolicyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-text-tertiary">
                Minimum password requirements
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Max Login Attempts
              </label>
              <Input
                type="number"
                value={localSettings.maxLoginAttempts}
                onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                placeholder="5"
                min="3"
                max="10"
              />
              <p className="text-xs text-text-tertiary">
                Account lockout after failed attempts
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Lockout Duration (minutes)
              </label>
              <Input
                type="number"
                value={localSettings.lockoutDuration}
                onChange={(e) => handleInputChange('lockoutDuration', e.target.value)}
                placeholder="30"
                min="5"
                max="1440"
              />
              <p className="text-xs text-text-tertiary">
                How long accounts remain locked
              </p>
            </div>
          </div>

          {/* Security Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Two-Factor Authentication
                </label>
                <p className="text-xs text-text-tertiary">
                  Require 2FA for all user accounts
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('requireTwoFactor')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.requireTwoFactor ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.requireTwoFactor ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Force Password Change
                </label>
                <p className="text-xs text-text-tertiary">
                  Require password change every 90 days
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('forcePasswordChange')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.forcePasswordChange ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.forcePasswordChange ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Remember Login Sessions
                </label>
                <p className="text-xs text-text-tertiary">
                  Allow users to stay logged in across browser sessions
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('rememberSessions')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.rememberSessions ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.rememberSessions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Security */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Key" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">API Security</h3>
        </div>

        <div className="space-y-6">
          {/* API Key Management */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                API Key
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={localSettings.apiKey}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    placeholder="No API key generated"
                    readOnly
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                  iconName={showApiKey ? "EyeOff" : "Eye"}
                  iconSize={16}
                />
              </div>
              <p className="text-xs text-text-tertiary">
                Used for external API access and integrations
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                onClick={handleGenerateApiKey}
                disabled={generatingApiKey}
                iconName={generatingApiKey ? "Loader2" : "RefreshCw"}
                iconSize={16}
                className={generatingApiKey ? "animate-spin" : ""}
              >
                {generatingApiKey ? 'Generating...' : 'Generate New Key'}
              </Button>
              
              {localSettings.apiKey && (
                <Button
                  variant="danger"
                  onClick={handleRevokeApiKey}
                  iconName="Trash2"
                  iconSize={16}
                >
                  Revoke Key
                </Button>
              )}
            </div>
          </div>

          {/* API Rate Limiting */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                API Rate Limit (requests/hour)
              </label>
              <Input
                type="number"
                value={localSettings.apiRateLimit}
                onChange={(e) => handleInputChange('apiRateLimit', e.target.value)}
                placeholder="1000"
                min="100"
                max="10000"
              />
              <p className="text-xs text-text-tertiary">
                Maximum API requests per hour
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                API Key Expiration (days)
              </label>
              <Input
                type="number"
                value={localSettings.apiKeyExpiration}
                onChange={(e) => handleInputChange('apiKeyExpiration', e.target.value)}
                placeholder="365"
                min="30"
                max="3650"
              />
              <p className="text-xs text-text-tertiary">
                API key validity period (0 for no expiration)
              </p>
            </div>
          </div>

          {/* API Security Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Require HTTPS for API
                </label>
                <p className="text-xs text-text-tertiary">
                  Reject non-HTTPS API requests
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('requireHttps')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.requireHttps ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.requireHttps ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  IP Whitelist
                </label>
                <p className="text-xs text-text-tertiary">
                  Restrict API access to specific IP addresses
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('enableIpWhitelist')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.enableIpWhitelist ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.enableIpWhitelist ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* IP Whitelist Configuration */}
          {localSettings.enableIpWhitelist && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Allowed IP Addresses
              </label>
              <textarea
                value={localSettings.allowedIps}
                onChange={(e) => handleInputChange('allowedIps', e.target.value)}
                placeholder="192.168.1.0/24&#10;10.0.0.1&#10;203.0.113.0/24"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              />
              <p className="text-xs text-text-tertiary">
                One IP address or CIDR block per line
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Audit & Logging */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Audit & Logging</h3>
        </div>

        <div className="space-y-6">
          {/* Logging Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Log Retention Period (days)
              </label>
              <Input
                type="number"
                value={localSettings.logRetention}
                onChange={(e) => handleInputChange('logRetention', e.target.value)}
                placeholder="90"
                min="7"
                max="3650"
              />
              <p className="text-xs text-text-tertiary">
                How long to keep audit logs
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Log Level
              </label>
              <select
                value={localSettings.logLevel}
                onChange={(e) => handleInputChange('logLevel', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="error">Error</option>
                <option value="warn">Warning</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>
              <p className="text-xs text-text-tertiary">
                Minimum log level to record
              </p>
            </div>
          </div>

          {/* Audit Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Log User Actions
                </label>
                <p className="text-xs text-text-tertiary">
                  Record all user interactions and changes
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('logUserActions')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.logUserActions ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.logUserActions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Log API Requests
                </label>
                <p className="text-xs text-text-tertiary">
                  Record all API calls and responses
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('logApiRequests')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.logApiRequests ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.logApiRequests ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Log System Events
                </label>
                <p className="text-xs text-text-tertiary">
                  Record system startup, shutdown, and errors
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('logSystemEvents')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.logSystemEvents ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.logSystemEvents ? 'translate-x-6' : 'translate-x-1'
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

export default SecuritySettingsTab;
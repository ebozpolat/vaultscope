import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NotificationPreferencesTab = ({ settings, onSettingsChange, onSave, onReset }) => {
  const [localSettings, setLocalSettings] = useState(settings.notifications);
  const [hasChanges, setHasChanges] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
    onSettingsChange('notifications', updatedSettings);
  };

  const handleToggleChange = (field) => {
    const updatedSettings = { ...localSettings, [field]: !localSettings[field] };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
    onSettingsChange('notifications', updatedSettings);
  };

  const handleSave = () => {
    onSave('notifications');
    setHasChanges(false);
  };

  const handleReset = () => {
    onReset('notifications');
    setHasChanges(false);
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    // Simulate webhook test
    setTimeout(() => {
      setTestingWebhook(false);
      alert('Webhook test completed successfully!');
    }, 2000);
  };

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-success' },
    { value: 'medium', label: 'Medium Priority', color: 'text-warning' },
    { value: 'high', label: 'High Priority', color: 'text-error' },
    { value: 'critical', label: 'Critical Priority', color: 'text-error' }
  ];

  return (
    <div className="space-y-8">
      {/* Email Notifications */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Mail" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Email Notifications</h3>
        </div>

        <div className="space-y-6">
          {/* Email Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                SMTP Server
              </label>
              <Input
                type="text"
                value={localSettings.emailSettings.smtpServer}
                onChange={(e) => handleInputChange('emailSettings', {
                  ...localSettings.emailSettings,
                  smtpServer: e.target.value
                })}
                placeholder="smtp.example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                SMTP Port
              </label>
              <Input
                type="number"
                value={localSettings.emailSettings.smtpPort}
                onChange={(e) => handleInputChange('emailSettings', {
                  ...localSettings.emailSettings,
                  smtpPort: e.target.value
                })}
                placeholder="587"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                From Email Address
              </label>
              <Input
                type="email"
                value={localSettings.emailSettings.fromEmail}
                onChange={(e) => handleInputChange('emailSettings', {
                  ...localSettings.emailSettings,
                  fromEmail: e.target.value
                })}
                placeholder="alerts@vaultscope.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Default Recipients
              </label>
              <Input
                type="text"
                value={localSettings.emailSettings.defaultRecipients}
                onChange={(e) => handleInputChange('emailSettings', {
                  ...localSettings.emailSettings,
                  defaultRecipients: e.target.value
                })}
                placeholder="admin@company.com, team@company.com"
              />
              <p className="text-xs text-text-tertiary">
                Comma-separated email addresses
              </p>
            </div>
          </div>

          {/* Email Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Enable Email Notifications
                </label>
                <p className="text-xs text-text-tertiary">
                  Send email alerts for threshold breaches
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('emailEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.emailEnabled ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.emailEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Email Digest
                </label>
                <p className="text-xs text-text-tertiary">
                  Send daily summary of alerts
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('emailDigest')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.emailDigest ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.emailDigest ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Webhook" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Webhook Integration</h3>
        </div>

        <div className="space-y-6">
          {/* Lark Webhook Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Enable Lark Webhook
                </label>
                <p className="text-xs text-text-tertiary">
                  Send notifications to Lark chat groups
                </p>
              </div>
              <button
                onClick={() => handleToggleChange('larkWebhookEnabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.larkWebhookEnabled ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.larkWebhookEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Lark Webhook URL
                </label>
                <Input
                  type="url"
                  value={localSettings.larkWebhookUrl}
                  onChange={(e) => handleInputChange('larkWebhookUrl', e.target.value)}
                  placeholder="https://open.larksuite.com/open-apis/bot/v2/hook/..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Webhook Secret
                </label>
                <Input
                  type="password"
                  value={localSettings.larkWebhookSecret}
                  onChange={(e) => handleInputChange('larkWebhookSecret', e.target.value)}
                  placeholder="Enter webhook secret"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleTestWebhook}
                disabled={!localSettings.larkWebhookUrl || testingWebhook}
                iconName={testingWebhook ? "Loader2" : "Send"}
                iconSize={16}
                className={testingWebhook ? "animate-spin" : ""}
              >
                {testingWebhook ? 'Testing...' : 'Test Webhook'}
              </Button>
              <p className="text-xs text-text-tertiary">
                Send a test message to verify configuration
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Routing Rules */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Route" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Alert Routing Rules</h3>
        </div>

        <div className="space-y-6">
          {/* Priority-based Routing */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">
              Notification Channels by Priority
            </h4>
            
            {priorityLevels.map((priority) => (
              <div key={priority.value} className="flex items-center justify-between p-4 bg-background-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${priority.color.replace('text-', 'bg-')}`} />
                  <span className="text-sm font-medium text-text-primary">
                    {priority.label}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localSettings.routingRules[priority.value]?.email || false}
                      onChange={(e) => handleInputChange('routingRules', {
                        ...localSettings.routingRules,
                        [priority.value]: {
                          ...localSettings.routingRules[priority.value],
                          email: e.target.checked
                        }
                      })}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-secondary">Email</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={localSettings.routingRules[priority.value]?.webhook || false}
                      onChange={(e) => handleInputChange('routingRules', {
                        ...localSettings.routingRules,
                        [priority.value]: {
                          ...localSettings.routingRules[priority.value],
                          webhook: e.target.checked
                        }
                      })}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-text-secondary">Webhook</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Escalation Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">
              Escalation Procedures
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Escalation Delay (minutes)
                </label>
                <Input
                  type="number"
                  value={localSettings.escalationDelay}
                  onChange={(e) => handleInputChange('escalationDelay', e.target.value)}
                  placeholder="15"
                  min="1"
                  max="60"
                />
                <p className="text-xs text-text-tertiary">
                  Time before escalating unacknowledged alerts
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Escalation Recipients
                </label>
                <Input
                  type="text"
                  value={localSettings.escalationRecipients}
                  onChange={(e) => handleInputChange('escalationRecipients', e.target.value)}
                  placeholder="manager@company.com, oncall@company.com"
                />
                <p className="text-xs text-text-tertiary">
                  Comma-separated email addresses for escalation
                </p>
              </div>
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

export default NotificationPreferencesTab;
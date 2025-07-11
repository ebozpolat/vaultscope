import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';


const AlertSettingsSection = ({ 
  formData, 
  onFormDataChange, 
  isCollapsed, 
  onToggleCollapse,
  errors = {} 
}) => {
  const [selectedNotificationMethods, setSelectedNotificationMethods] = useState(
    formData.notificationMethods || []
  );

  const handleInputChange = (field, value) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const handleNotificationMethodToggle = (method) => {
    const updatedMethods = selectedNotificationMethods.includes(method)
      ? selectedNotificationMethods.filter(m => m !== method)
      : [...selectedNotificationMethods, method];
    
    setSelectedNotificationMethods(updatedMethods);
    onFormDataChange({
      ...formData,
      notificationMethods: updatedMethods
    });
  };

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'text-success', bg: 'bg-success-50', border: 'border-success-200' },
    { value: 'medium', label: 'Medium', color: 'text-warning', bg: 'bg-warning-50', border: 'border-warning-200' },
    { value: 'high', label: 'High', color: 'text-error', bg: 'bg-error-50', border: 'border-error-200' },
    { value: 'critical', label: 'Critical', color: 'text-error', bg: 'bg-error-100', border: 'border-error-300' }
  ];

  const notificationMethods = [
    { id: 'email', label: 'Email Notification', icon: 'Mail', desc: 'Send alerts via email' },
    { id: 'webhook', label: 'Webhook (Lark)', icon: 'Webhook', desc: 'Send to Lark messaging platform' },
    { id: 'dashboard', label: 'Dashboard Alert', icon: 'Monitor', desc: 'Display in real-time dashboard' },
    { id: 'sms', label: 'SMS Alert', icon: 'MessageSquare', desc: 'Send text message alerts' }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-background-secondary transition-colors duration-200"
        onClick={onToggleCollapse}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Bell" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Alert Settings</h3>
        </div>
        <Icon 
          name={isCollapsed ? "ChevronDown" : "ChevronUp"} 
          size={20} 
          className="text-text-secondary" 
        />
      </div>

      {!isCollapsed && (
        <div className="px-6 pb-6 space-y-6">
          {/* Severity Level */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Alert Severity Level *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {severityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleInputChange('severityLevel', level.value)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-center
                    ${formData.severityLevel === level.value
                      ? `${level.border} ${level.bg} ${level.color}`
                      : 'border-border hover:border-primary-200 hover:bg-background-secondary'
                    }
                  `}
                >
                  <div className="font-semibold text-sm">{level.label}</div>
                  <div className="text-xs mt-1 opacity-75">
                    {level.value === 'low' && 'Informational'}
                    {level.value === 'medium' && 'Moderate concern'}
                    {level.value === 'high' && 'Requires attention'}
                    {level.value === 'critical' && 'Immediate action'}
                  </div>
                </button>
              ))}
            </div>
            {errors.severityLevel && (
              <p className="mt-1 text-sm text-error">{errors.severityLevel}</p>
            )}
          </div>

          {/* Notification Methods */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Notification Methods *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notificationMethods.map((method) => (
                <div
                  key={method.id}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${selectedNotificationMethods.includes(method.id)
                      ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-200 hover:bg-background-secondary'
                    }
                  `}
                  onClick={() => handleNotificationMethodToggle(method.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <Icon name={method.icon} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{method.label}</span>
                        {selectedNotificationMethods.includes(method.id) && (
                          <Icon name="Check" size={16} className="text-primary" />
                        )}
                      </div>
                      <p className="text-xs mt-1 opacity-75">{method.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {errors.notificationMethods && (
              <p className="mt-1 text-sm text-error">{errors.notificationMethods}</p>
            )}
          </div>

          {/* Email Configuration */}
          {selectedNotificationMethods.includes('email') && (
            <div className="bg-background-secondary rounded-lg p-4">
              <h4 className="text-sm font-medium text-text-primary mb-3">Email Configuration</h4>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="admin@company.com"
                  value={formData.emailRecipients || ''}
                  onChange={(e) => handleInputChange('emailRecipients', e.target.value)}
                />
                <p className="text-xs text-text-tertiary">
                  Separate multiple email addresses with commas
                </p>
              </div>
            </div>
          )}

          {/* Webhook Configuration */}
          {selectedNotificationMethods.includes('webhook') && (
            <div className="bg-background-secondary rounded-lg p-4">
              <h4 className="text-sm font-medium text-text-primary mb-3">Lark Webhook Configuration</h4>
              <div className="space-y-3">
                <Input
                  type="url"
                  placeholder="https://open.larksuite.com/open-apis/bot/v2/hook/..."
                  value={formData.webhookUrl || ''}
                  onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                />
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span className="text-xs text-text-tertiary">
                    Webhook URL will be encrypted and stored securely
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Escalation Rules */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Escalation Rules
            </label>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="autoEscalate"
                  checked={formData.autoEscalate || false}
                  onChange={(e) => handleInputChange('autoEscalate', e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="autoEscalate" className="text-sm text-text-primary">
                  Enable automatic escalation
                </label>
              </div>

              {formData.autoEscalate && (
                <div className="ml-6 space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-text-secondary">Escalate after:</span>
                    <Input
                      type="number"
                      placeholder="15"
                      value={formData.escalationDelay || ''}
                      onChange={(e) => handleInputChange('escalationDelay', e.target.value)}
                      className="w-20"
                    />
                    <span className="text-sm text-text-secondary">minutes without acknowledgment</span>
                  </div>
                  <Input
                    type="email"
                    placeholder="manager@company.com"
                    value={formData.escalationRecipients || ''}
                    onChange={(e) => handleInputChange('escalationRecipients', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Alert Preview */}
          <div className="bg-background-secondary rounded-lg p-4">
            <h4 className="text-sm font-medium text-text-primary mb-3">Alert Preview</h4>
            <div className="bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-start space-x-3">
                <div className={`
                  w-3 h-3 rounded-full mt-1
                  ${formData.severityLevel === 'critical' ? 'bg-error animate-pulse' : 
                    formData.severityLevel === 'high' ? 'bg-error' :
                    formData.severityLevel === 'medium' ? 'bg-warning' : 'bg-success'}
                `} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-text-primary">
                      {formData.thresholdName || 'Threshold Name'}
                    </span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${formData.severityLevel === 'critical' ? 'bg-error-100 text-error' : 
                        formData.severityLevel === 'high' ? 'bg-error-50 text-error' :
                        formData.severityLevel === 'medium' ? 'bg-warning-50 text-warning' : 'bg-success-50 text-success'}
                    `}>
                      {formData.severityLevel?.toUpperCase() || 'LOW'}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {formData.cryptocurrency || 'BTC'} price threshold triggered
                  </p>
                  <p className="text-xs text-text-tertiary mt-2">
                    {new Date().toLocaleString()} • VaultScope Alert System
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertSettingsSection;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import BasicInformationSection from './components/BasicInformationSection';
import TriggerConditionsSection from './components/TriggerConditionsSection';
import AlertSettingsSection from './components/AlertSettingsSection';
import AdvancedOptionsSection from './components/AdvancedOptionsSection';
import PriceVisualizationChart from './components/PriceVisualizationChart';
import ActionButtonsSection from './components/ActionButtonsSection';
import Icon from '../../components/AppIcon';

const ThresholdConfiguration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Form state management
  const [formData, setFormData] = useState({
    cryptocurrency: '',
    cryptoName: '',
    currentPrice: 0,
    thresholdName: '',
    description: '',
    conditions: [],
    upperPriceThreshold: '',
    lowerPriceThreshold: '',
    percentageIncrease: '',
    percentageIncreaseTimeframe: '1h',
    percentageDecrease: '',
    percentageDecreaseTimeframe: '1h',
    volumeSpikeMultiplier: '',
    minimumVolume: '',
    severityLevel: '',
    notificationMethods: [],
    emailRecipients: '',
    webhookUrl: '',
    autoEscalate: false,
    escalationDelay: '',
    escalationRecipients: '',
    timeConditions: [],
    customStartTime: '09:00',
    customEndTime: '17:00',
    customActiveDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enableCooldown: false,
    cooldownDuration: '',
    cooldownUnit: 'minutes',
    cooldownType: 'global',
    enableAutoResolution: false,
    resolutionDelay: '',
    notifyOnResolution: false,
    primaryExchange: 'binance',
    enableFallback: false,
    fallbackExchanges: [],
    enableTestMode: false
  });

  // Section collapse states
  const [sectionStates, setSectionStates] = useState({
    basicInfo: false,
    triggerConditions: false,
    alertSettings: false,
    advancedOptions: true
  });

  // Form validation and errors
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Check if editing existing threshold
  const isEditing = location.state?.threshold ? true : false;
  const editingThreshold = location.state?.threshold;

  // Initialize form data for editing
  useEffect(() => {
    if (isEditing && editingThreshold) {
      setFormData(prevData => ({
        ...prevData,
        ...editingThreshold
      }));
    }
  }, [isEditing, editingThreshold]);

  // Form validation
  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};

      // Basic Information validation
      if (!formData.cryptocurrency) {
        newErrors.cryptocurrency = 'Please select a cryptocurrency';
      }
      if (!formData.thresholdName?.trim()) {
        newErrors.thresholdName = 'Threshold name is required';
      }

      // Trigger Conditions validation
      if (!formData.conditions || formData.conditions.length === 0) {
        newErrors.conditions = 'At least one trigger condition is required';
      }

      // Validate price thresholds
      if (formData.conditions?.includes('upperPrice') && !formData.upperPriceThreshold) {
        newErrors.upperPriceThreshold = 'Upper price threshold is required';
      }
      if (formData.conditions?.includes('lowerPrice') && !formData.lowerPriceThreshold) {
        newErrors.lowerPriceThreshold = 'Lower price threshold is required';
      }

      // Alert Settings validation
      if (!formData.severityLevel) {
        newErrors.severityLevel = 'Please select a severity level';
      }
      if (!formData.notificationMethods || formData.notificationMethods.length === 0) {
        newErrors.notificationMethods = 'At least one notification method is required';
      }

      // Email validation
      if (formData.notificationMethods?.includes('email') && !formData.emailRecipients?.trim()) {
        newErrors.emailRecipients = 'Email recipients are required when email notification is selected';
      }

      // Webhook validation
      if (formData.notificationMethods?.includes('webhook') && !formData.webhookUrl?.trim()) {
        newErrors.webhookUrl = 'Webhook URL is required when webhook notification is selected';
      }

      setErrors(newErrors);
      setIsFormValid(Object.keys(newErrors).length === 0);
    };

    validateForm();
  }, [formData]);

  const handleFormDataChange = (newData) => {
    setFormData(newData);
  };

  const handleSectionToggle = (section) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = (savedData, isActivated) => {
    console.log('Threshold saved:', savedData);
    console.log('Activated:', isActivated);
    
    // Here you would typically make an API call to save the threshold
    // For now, we'll just log the data and navigate back
  };

  const handleTest = (testResult) => {
    console.log('Threshold test result:', testResult);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <NavigationBreadcrumbs className="mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  {isEditing ? 'Edit Threshold' : 'Create New Threshold'}
                </h1>
                <p className="text-text-secondary mt-2">
                  {isEditing 
                    ? 'Modify the configuration for this cryptocurrency monitoring threshold'
                    : 'Configure a new cryptocurrency monitoring threshold with custom trigger conditions and alert settings'
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 px-3 py-1 bg-background-secondary rounded-lg">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span className="text-sm text-text-secondary">Auto-save enabled</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Configuration Form */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Information Section */}
              <BasicInformationSection
                formData={formData}
                onFormDataChange={handleFormDataChange}
                isCollapsed={sectionStates.basicInfo}
                onToggleCollapse={() => handleSectionToggle('basicInfo')}
                errors={errors}
              />

              {/* Trigger Conditions Section */}
              <TriggerConditionsSection
                formData={formData}
                onFormDataChange={handleFormDataChange}
                isCollapsed={sectionStates.triggerConditions}
                onToggleCollapse={() => handleSectionToggle('triggerConditions')}
                errors={errors}
              />

              {/* Alert Settings Section */}
              <AlertSettingsSection
                formData={formData}
                onFormDataChange={handleFormDataChange}
                isCollapsed={sectionStates.alertSettings}
                onToggleCollapse={() => handleSectionToggle('alertSettings')}
                errors={errors}
              />

              {/* Advanced Options Section */}
              <AdvancedOptionsSection
                formData={formData}
                onFormDataChange={handleFormDataChange}
                isCollapsed={sectionStates.advancedOptions}
                onToggleCollapse={() => handleSectionToggle('advancedOptions')}
                errors={errors}
              />
            </div>

            {/* Sidebar - Price Chart and Actions */}
            <div className="xl:col-span-1 space-y-6">
              {/* Price Visualization Chart */}
              {formData.cryptocurrency && (
                <PriceVisualizationChart
                  formData={formData}
                  className="sticky top-24"
                />
              )}

              {/* Action Buttons */}
              <ActionButtonsSection
                formData={formData}
                onSave={handleSave}
                onTest={handleTest}
                isValid={isFormValid}
                className="sticky top-96"
              />
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="xl:hidden mt-8">
            <ActionButtonsSection
              formData={formData}
              onSave={handleSave}
              onTest={handleTest}
              isValid={isFormValid}
            />
          </div>

          {/* Form Progress Indicator */}
          <div className="mt-8 bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">Configuration Progress</span>
              <span className="text-sm text-text-secondary">
                {Object.keys(errors).length === 0 ? '100%' : `${Math.round(((5 - Object.keys(errors).length) / 5) * 100)}%`}
              </span>
            </div>
            <div className="w-full bg-background-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Object.keys(errors).length === 0 ? 100 : Math.round(((5 - Object.keys(errors).length) / 5) * 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThresholdConfiguration;
import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const DisplayOptionsTab = ({ settings, onSettingsChange, onSave, onReset }) => {
  const [localSettings, setLocalSettings] = useState(settings.display);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewTheme, setPreviewTheme] = useState(settings.display.theme);

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
    onSettingsChange('display', updatedSettings);
  };

  const handleThemeChange = (theme) => {
    setPreviewTheme(theme);
    handleInputChange('theme', theme);
    // Apply theme immediately for preview
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleSave = () => {
    onSave('display');
    setHasChanges(false);
  };

  const handleReset = () => {
    onReset('display');
    setHasChanges(false);
    setPreviewTheme(settings.display.theme);
  };

  const chartTypeOptions = [
    { value: 'line', label: 'Line Chart', icon: 'TrendingUp' },
    { value: 'candlestick', label: 'Candlestick Chart', icon: 'BarChart3' },
    { value: 'area', label: 'Area Chart', icon: 'Activity' },
    { value: 'bar', label: 'Bar Chart', icon: 'BarChart' }
  ];

  const tablePageSizeOptions = [
    { value: '10', label: '10 rows' },
    { value: '25', label: '25 rows' },
    { value: '50', label: '50 rows' },
    { value: '100', label: '100 rows' }
  ];

  const dashboardLayouts = [
    { value: 'compact', label: 'Compact Layout', description: 'More widgets in less space' },
    { value: 'comfortable', label: 'Comfortable Layout', description: 'Balanced spacing and readability' },
    { value: 'spacious', label: 'Spacious Layout', description: 'Maximum spacing for clarity' }
  ];

  return (
    <div className="space-y-8">
      {/* Theme Settings */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Palette" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Theme & Appearance</h3>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Color Theme</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Light Theme */}
              <div
                onClick={() => handleThemeChange('light')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  previewTheme === 'light' ?'border-primary bg-primary-50' :'border-border hover:border-primary-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-white border border-secondary-200 rounded-full" />
                  <span className="font-medium text-text-primary">Light Theme</span>
                  {previewTheme === 'light' && (
                    <Icon name="Check" size={16} className="text-primary ml-auto" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-secondary-100 rounded" />
                  <div className="h-2 bg-secondary-200 rounded w-3/4" />
                  <div className="h-2 bg-secondary-100 rounded w-1/2" />
                </div>
              </div>

              {/* Dark Theme */}
              <div
                onClick={() => handleThemeChange('dark')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  previewTheme === 'dark' ?'border-primary bg-primary-50' :'border-border hover:border-primary-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-secondary-800 border border-secondary-600 rounded-full" />
                  <span className="font-medium text-text-primary">Dark Theme</span>
                  {previewTheme === 'dark' && (
                    <Icon name="Check" size={16} className="text-primary ml-auto" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-secondary-700 rounded" />
                  <div className="h-2 bg-secondary-600 rounded w-3/4" />
                  <div className="h-2 bg-secondary-700 rounded w-1/2" />
                </div>
              </div>

              {/* Auto Theme */}
              <div
                onClick={() => handleThemeChange('auto')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  previewTheme === 'auto' ?'border-primary bg-primary-50' :'border-border hover:border-primary-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-white to-secondary-800 border border-secondary-300 rounded-full" />
                  <span className="font-medium text-text-primary">Auto Theme</span>
                  {previewTheme === 'auto' && (
                    <Icon name="Check" size={16} className="text-primary ml-auto" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gradient-to-r from-secondary-100 to-secondary-700 rounded" />
                  <div className="h-2 bg-gradient-to-r from-secondary-200 to-secondary-600 rounded w-3/4" />
                  <div className="h-2 bg-gradient-to-r from-secondary-100 to-secondary-700 rounded w-1/2" />
                </div>
              </div>
            </div>
            <p className="text-xs text-text-tertiary">
              Auto theme follows your system preference
            </p>
          </div>

          {/* Color Customization */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Color Customization</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Primary Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={localSettings.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={localSettings.primaryColor}
                    onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                    placeholder="#1E40AF"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Success Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={localSettings.successColor}
                    onChange={(e) => handleInputChange('successColor', e.target.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={localSettings.successColor}
                    onChange={(e) => handleInputChange('successColor', e.target.value)}
                    placeholder="#059669"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Warning Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={localSettings.warningColor}
                    onChange={(e) => handleInputChange('warningColor', e.target.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={localSettings.warningColor}
                    onChange={(e) => handleInputChange('warningColor', e.target.value)}
                    placeholder="#D97706"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                  Error Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={localSettings.errorColor}
                    onChange={(e) => handleInputChange('errorColor', e.target.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={localSettings.errorColor}
                    onChange={(e) => handleInputChange('errorColor', e.target.value)}
                    placeholder="#DC2626"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Preferences */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Chart Preferences</h3>
        </div>

        <div className="space-y-6">
          {/* Default Chart Type */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Default Chart Type</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {chartTypeOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleInputChange('defaultChartType', option.value)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    localSettings.defaultChartType === option.value
                      ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon name={option.icon} size={24} className="text-primary" />
                    <span className="text-sm font-medium text-text-primary text-center">
                      {option.label}
                    </span>
                    {localSettings.defaultChartType === option.value && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Animation Duration (ms)
              </label>
              <Input
                type="number"
                value={localSettings.chartAnimationDuration}
                onChange={(e) => handleInputChange('chartAnimationDuration', e.target.value)}
                placeholder="300"
                min="0"
                max="2000"
              />
              <p className="text-xs text-text-tertiary">
                Duration of chart animations (0 to disable)
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Grid Lines Opacity
              </label>
              <Input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localSettings.gridOpacity}
                onChange={(e) => handleInputChange('gridOpacity', e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-text-tertiary">
                <span>Hidden</span>
                <span>{Math.round(localSettings.gridOpacity * 100)}%</span>
                <span>Visible</span>
              </div>
            </div>
          </div>

          {/* Chart Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Show Chart Tooltips
                </label>
                <p className="text-xs text-text-tertiary">
                  Display data values on hover
                </p>
              </div>
              <button
                onClick={() => handleInputChange('showTooltips', !localSettings.showTooltips)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.showTooltips ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.showTooltips ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-text-primary">
                  Enable Chart Zoom
                </label>
                <p className="text-xs text-text-tertiary">
                  Allow zooming and panning on charts
                </p>
              </div>
              <button
                onClick={() => handleInputChange('enableZoom', !localSettings.enableZoom)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.enableZoom ? 'bg-primary' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.enableZoom ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table & Layout Settings */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Icon name="Layout" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Table & Layout Settings</h3>
        </div>

        <div className="space-y-6">
          {/* Table Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Default Table Page Size
              </label>
              <select
                value={localSettings.tablePageSize}
                onChange={(e) => handleInputChange('tablePageSize', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {tablePageSizeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Table Density
              </label>
              <select
                value={localSettings.tableDensity}
                onChange={(e) => handleInputChange('tableDensity', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="compact">Compact</option>
                <option value="comfortable">Comfortable</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>
          </div>

          {/* Dashboard Layout */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Dashboard Layout</h4>
            <div className="space-y-3">
              {dashboardLayouts.map((layout) => (
                <div
                  key={layout.value}
                  onClick={() => handleInputChange('dashboardLayout', layout.value)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    localSettings.dashboardLayout === layout.value
                      ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-text-primary">{layout.label}</span>
                      <p className="text-sm text-text-tertiary">{layout.description}</p>
                    </div>
                    {localSettings.dashboardLayout === layout.value && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                  </div>
                </div>
              ))}
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

export default DisplayOptionsTab;
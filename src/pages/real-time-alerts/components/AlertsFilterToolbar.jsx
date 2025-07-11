import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AlertsFilterToolbar = ({ 
  onFilterChange, 
  onSearchChange, 
  onExport, 
  onBulkAcknowledge,
  selectedCount,
  totalCount,
  activeFilters 
}) => {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const severityOptions = [
    { value: '', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const cryptocurrencyOptions = [
    { value: '', label: 'All Cryptocurrencies' },
    { value: 'bitcoin', label: 'Bitcoin (BTC)' },
    { value: 'ethereum', label: 'Ethereum (ETH)' },
    { value: 'cardano', label: 'Cardano (ADA)' },
    { value: 'solana', label: 'Solana (SOL)' },
    { value: 'polkadot', label: 'Polkadot (DOT)' },
    { value: 'chainlink', label: 'Chainlink (LINK)' }
  ];

  const timeRangeOptions = [
    { value: '', label: 'All Time' },
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const clearAllFilters = () => {
    onFilterChange('severity', '');
    onFilterChange('cryptocurrency', '');
    onFilterChange('timeRange', '');
    onFilterChange('status', '');
    setSearchTerm('');
    onSearchChange('');
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value && value !== '').length;
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1 p-4 mb-6">
      {/* Top Row - Search and Primary Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" 
            />
            <Input
              type="search"
              placeholder="Search by currency, alert ID, or type..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            iconName="Filter"
            iconSize={16}
            className="relative"
          >
            Filters
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </Button>

          {selectedCount > 0 && (
            <Button
              variant="success"
              size="sm"
              onClick={onBulkAcknowledge}
              iconName="CheckCircle"
              iconSize={16}
            >
              Acknowledge ({selectedCount})
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconSize={16}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
        <div className="flex items-center space-x-4">
          <span>
            Showing {totalCount} alert{totalCount !== 1 ? 's' : ''}
          </span>
          {selectedCount > 0 && (
            <span className="text-primary font-medium">
              {selectedCount} selected
            </span>
          )}
        </div>

        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            size="xs"
            onClick={clearAllFilters}
            iconName="X"
            iconSize={12}
            className="text-text-tertiary hover:text-text-primary"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isFilterExpanded && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Severity Level
              </label>
              <select
                value={activeFilters.severity || ''}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {severityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Cryptocurrency Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Cryptocurrency
              </label>
              <select
                value={activeFilters.cryptocurrency || ''}
                onChange={(e) => handleFilterChange('cryptocurrency', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {cryptocurrencyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Time Range
              </label>
              <select
                value={activeFilters.timeRange || ''}
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Alert Status
              </label>
              <select
                value={activeFilters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {getActiveFilterCount() > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-text-secondary">Active filters:</span>
                
                {activeFilters.severity && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
                    Severity: {severityOptions.find(opt => opt.value === activeFilters.severity)?.label}
                    <button
                      onClick={() => handleFilterChange('severity', '')}
                      className="ml-1.5 text-primary hover:text-primary-700"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                
                {activeFilters.cryptocurrency && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent">
                    Crypto: {cryptocurrencyOptions.find(opt => opt.value === activeFilters.cryptocurrency)?.label}
                    <button
                      onClick={() => handleFilterChange('cryptocurrency', '')}
                      className="ml-1.5 text-accent hover:text-accent-700"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                
                {activeFilters.timeRange && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning">
                    Time: {timeRangeOptions.find(opt => opt.value === activeFilters.timeRange)?.label}
                    <button
                      onClick={() => handleFilterChange('timeRange', '')}
                      className="ml-1.5 text-warning hover:text-warning-700"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                
                {activeFilters.status && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success">
                    Status: {statusOptions.find(opt => opt.value === activeFilters.status)?.label}
                    <button
                      onClick={() => handleFilterChange('status', '')}
                      className="ml-1.5 text-success hover:text-success-700"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AlertsFilterToolbar;
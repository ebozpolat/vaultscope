import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ThresholdFilters = ({ 
  filters, 
  onFiltersChange, 
  onReset, 
  thresholds 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: filters.startDate || '',
    endDate: filters.endDate || ''
  });

  // Extract unique values for dropdown options
  const cryptocurrencies = [...new Set(thresholds.map(t => t.cryptocurrency))].sort();
  const thresholdTypes = [...new Set(thresholds.map(t => t.type))].sort();
  const statuses = ['active', 'paused', 'triggered'];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (key, value) => {
    const newDateRange = { ...dateRange, [key]: value };
    setDateRange(newDateRange);
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length;
  };

  const hasActiveFilters = getActiveFilterCount() > 0;

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              iconName="X"
              iconSize={14}
              className="text-text-secondary hover:text-error"
            >
              Clear All
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
            iconSize={16}
            className="text-text-secondary hover:text-text-primary lg:hidden"
          />
        </div>
      </div>

      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 space-y-4">
          {/* Primary Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cryptocurrency Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Cryptocurrency
              </label>
              <select
                value={filters.cryptocurrency || ''}
                onChange={(e) => handleFilterChange('cryptocurrency', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Cryptocurrencies</option>
                {cryptocurrencies.map(crypto => (
                  <option key={crypto} value={crypto}>{crypto}</option>
                ))}
              </select>
            </div>

            {/* Threshold Type Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Threshold Type
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Types</option>
                {thresholdTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Status Filter Buttons */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Quick Status
              </label>
              <div className="flex space-x-1">
                <Button
                  variant={filters.status === 'active' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handleFilterChange('status', filters.status === 'active' ? '' : 'active')}
                  className="flex-1 text-xs"
                >
                  Active
                </Button>
                <Button
                  variant={filters.status === 'triggered' ? 'danger' : 'ghost'}
                  size="sm"
                  onClick={() => handleFilterChange('status', filters.status === 'triggered' ? '' : 'triggered')}
                  className="flex-1 text-xs"
                >
                  Triggered
                </Button>
              </div>
            </div>
          </div>

          {/* Secondary Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-border">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date Range
              </label>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Trigger Value Range
              </label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Modified By */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Modified By
              </label>
              <Input
                type="text"
                placeholder="Enter username..."
                value={filters.modifiedBy || ''}
                onChange={(e) => handleFilterChange('modifiedBy', e.target.value)}
              />
            </div>
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Info" size={16} className="text-accent" />
                  <span className="text-sm text-text-secondary">
                    Showing filtered results ({getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied)
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value || value === '') return null;
                    
                    const displayValue = key.includes('Date') 
                      ? new Date(value).toLocaleDateString()
                      : value;
                    
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary"
                      >
                        {key}: {displayValue}
                        <button
                          onClick={() => handleFilterChange(key, '')}
                          className="ml-1 hover:text-primary-700"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThresholdFilters;
import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ThresholdTable = ({ 
  thresholds, 
  selectedThresholds, 
  onSelectionChange, 
  onEdit, 
  onDuplicate, 
  onDelete,
  onSort,
  sortConfig 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [columnFilters, setColumnFilters] = useState({
    cryptocurrency: '',
    type: '',
    status: ''
  });

  const filteredThresholds = useMemo(() => {
    return thresholds.filter(threshold => {
      const matchesSearch = threshold.cryptocurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           threshold.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCrypto = !columnFilters.cryptocurrency || 
                           threshold.cryptocurrency.toLowerCase().includes(columnFilters.cryptocurrency.toLowerCase());
      
      const matchesType = !columnFilters.type || 
                         threshold.type.toLowerCase().includes(columnFilters.type.toLowerCase());
      
      const matchesStatus = !columnFilters.status || 
                           threshold.status.toLowerCase() === columnFilters.status.toLowerCase();

      return matchesSearch && matchesCrypto && matchesType && matchesStatus;
    });
  }, [thresholds, searchTerm, columnFilters]);

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(filteredThresholds.map(t => t.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectThreshold = (thresholdId, checked) => {
    if (checked) {
      onSelectionChange([...selectedThresholds, thresholdId]);
    } else {
      onSelectionChange(selectedThresholds.filter(id => id !== thresholdId));
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-success bg-success-50';
      case 'paused':
        return 'text-warning bg-warning-50';
      case 'triggered':
        return 'text-error bg-error-50';
      default:
        return 'text-secondary bg-secondary-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'CheckCircle';
      case 'paused':
        return 'Pause';
      case 'triggered':
        return 'AlertTriangle';
      default:
        return 'Circle';
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isAllSelected = filteredThresholds.length > 0 && 
                       filteredThresholds.every(t => selectedThresholds.includes(t.id));
  const isIndeterminate = selectedThresholds.length > 0 && !isAllSelected;

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search thresholds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Filter by crypto..."
              value={columnFilters.cryptocurrency}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, cryptocurrency: e.target.value }))}
              className="w-32"
            />
            
            <Input
              type="text"
              placeholder="Filter by type..."
              value={columnFilters.type}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-32"
            />
            
            <select
              value={columnFilters.status}
              onChange={(e) => setColumnFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-border rounded-lg bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="triggered">Triggered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-background-secondary">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
              </th>
              
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('cryptocurrency')}
                  className="p-0 h-auto font-semibold text-text-primary hover:text-primary"
                  iconName={getSortIcon('cryptocurrency')}
                  iconSize={14}
                  iconPosition="right"
                >
                  Cryptocurrency
                </Button>
              </th>
              
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('type')}
                  className="p-0 h-auto font-semibold text-text-primary hover:text-primary"
                  iconName={getSortIcon('type')}
                  iconSize={14}
                  iconPosition="right"
                >
                  Type
                </Button>
              </th>
              
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('triggerValue')}
                  className="p-0 h-auto font-semibold text-text-primary hover:text-primary"
                  iconName={getSortIcon('triggerValue')}
                  iconSize={14}
                  iconPosition="right"
                >
                  Trigger Value
                </Button>
              </th>
              
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                Current Price
              </th>
              
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('status')}
                  className="p-0 h-auto font-semibold text-text-primary hover:text-primary"
                  iconName={getSortIcon('status')}
                  iconSize={14}
                  iconPosition="right"
                >
                  Status
                </Button>
              </th>
              
              <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort('lastModified')}
                  className="p-0 h-auto font-semibold text-text-primary hover:text-primary"
                  iconName={getSortIcon('lastModified')}
                  iconSize={14}
                  iconPosition="right"
                >
                  Last Modified
                </Button>
              </th>
              
              <th className="px-4 py-3 text-right text-sm font-semibold text-text-primary">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {filteredThresholds.map((threshold) => (
              <tr 
                key={threshold.id}
                className="hover:bg-background-secondary transition-colors duration-150 cursor-pointer"
                onClick={() => onEdit(threshold)}
              >
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedThresholds.includes(threshold.id)}
                    onChange={(e) => handleSelectThreshold(threshold.id, e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                </td>
                
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {threshold.cryptocurrency.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">{threshold.cryptocurrency}</div>
                      <div className="text-sm text-text-secondary">{threshold.symbol}</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800">
                    {threshold.type}
                  </span>
                </td>
                
                <td className="px-4 py-4">
                  <div className="font-medium text-text-primary">
                    {formatPrice(threshold.triggerValue)}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {threshold.condition}
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <div className="font-medium text-text-primary">
                    {formatPrice(threshold.currentPrice)}
                  </div>
                  <div className={`text-sm ${threshold.priceChange >= 0 ? 'text-success' : 'text-error'}`}>
                    {threshold.priceChange >= 0 ? '+' : ''}{threshold.priceChange.toFixed(2)}%
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(threshold.status)}`}>
                    <Icon name={getStatusIcon(threshold.status)} size={12} className="mr-1" />
                    {threshold.status}
                  </span>
                </td>
                
                <td className="px-4 py-4">
                  <div className="text-sm text-text-primary">
                    {formatDate(threshold.lastModified)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    by {threshold.modifiedBy}
                  </div>
                </td>
                
                <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(threshold)}
                      iconName="Edit"
                      iconSize={14}
                      className="text-text-secondary hover:text-primary"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(threshold)}
                      iconName="Copy"
                      iconSize={14}
                      className="text-text-secondary hover:text-accent"
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(threshold)}
                      iconName="Trash2"
                      iconSize={14}
                      className="text-text-secondary hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredThresholds.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto text-text-quaternary mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No thresholds found</h3>
          <p className="text-text-secondary">
            {searchTerm || Object.values(columnFilters).some(f => f) 
              ? "Try adjusting your search or filter criteria" :"Create your first threshold to get started"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ThresholdTable;
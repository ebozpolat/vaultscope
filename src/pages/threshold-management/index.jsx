import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';

import Button from '../../components/ui/Button';
import ThresholdTable from './components/ThresholdTable';
import ThresholdStats from './components/ThresholdStats';
import ThresholdFilters from './components/ThresholdFilters';
import BulkActionsPanel from './components/BulkActionsPanel';
import QuickActionsPanel from './components/QuickActionsPanel';

const ThresholdManagement = () => {
  const navigate = useNavigate();
  const [selectedThresholds, setSelectedThresholds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'lastModified', direction: 'desc' });
  const [filters, setFilters] = useState({
    cryptocurrency: '',
    type: '',
    status: '',
    startDate: '',
    endDate: '',
    minPrice: '',
    maxPrice: '',
    modifiedBy: ''
  });

  // Mock threshold data
  const [thresholds, setThresholds] = useState([
    {
      id: 1,
      cryptocurrency: 'Bitcoin',
      symbol: 'BTC',
      type: 'Price Alert',
      condition: 'above',
      triggerValue: 50000,
      currentPrice: 48750.25,
      priceChange: -2.5,
      status: 'active',
      lastModified: new Date('2024-01-15T10:30:00'),
      modifiedBy: 'admin',
      description: 'High price alert for Bitcoin',
      notificationMethod: 'email',
      priority: 'high'
    },
    {
      id: 2,
      cryptocurrency: 'Ethereum',
      symbol: 'ETH',
      type: 'Volume Alert',
      condition: 'below',
      triggerValue: 1000000,
      currentPrice: 3250.80,
      priceChange: 1.8,
      status: 'triggered',
      lastModified: new Date('2024-01-15T09:15:00'),
      modifiedBy: 'trader1',
      description: 'Low volume alert for Ethereum',
      notificationMethod: 'webhook',
      priority: 'medium'
    },
    {
      id: 3,
      cryptocurrency: 'Cardano',
      symbol: 'ADA',
      type: 'Price Alert',
      condition: 'below',
      triggerValue: 0.45,
      currentPrice: 0.52,
      priceChange: 3.2,
      status: 'active',
      lastModified: new Date('2024-01-15T08:45:00'),
      modifiedBy: 'admin',
      description: 'Support level alert for ADA',
      notificationMethod: 'email',
      priority: 'low'
    },
    {
      id: 4,
      cryptocurrency: 'Solana',
      symbol: 'SOL',
      type: 'Volatility Alert',
      condition: 'above',
      triggerValue: 15,
      currentPrice: 98.45,
      priceChange: -0.8,
      status: 'paused',
      lastModified: new Date('2024-01-14T16:20:00'),
      modifiedBy: 'trader2',
      description: 'High volatility alert for Solana',
      notificationMethod: 'sms',
      priority: 'high'
    },
    {
      id: 5,
      cryptocurrency: 'Polygon',
      symbol: 'MATIC',
      type: 'Price Alert',
      condition: 'above',
      triggerValue: 1.20,
      currentPrice: 0.95,
      priceChange: -1.2,
      status: 'active',
      lastModified: new Date('2024-01-14T14:10:00'),
      modifiedBy: 'admin',
      description: 'Resistance level alert for MATIC',
      notificationMethod: 'email',
      priority: 'medium'
    },
    {
      id: 6,
      cryptocurrency: 'Chainlink',
      symbol: 'LINK',
      type: 'Market Cap Alert',
      condition: 'below',
      triggerValue: 8000000000,
      currentPrice: 14.75,
      priceChange: 2.1,
      status: 'triggered',
      lastModified: new Date('2024-01-14T11:30:00'),
      modifiedBy: 'analyst1',
      description: 'Market cap threshold for LINK',
      notificationMethod: 'webhook',
      priority: 'high'
    },
    {
      id: 7,
      cryptocurrency: 'Avalanche',
      symbol: 'AVAX',
      type: 'Price Alert',
      condition: 'above',
      triggerValue: 40,
      currentPrice: 35.20,
      priceChange: 0.5,
      status: 'active',
      lastModified: new Date('2024-01-13T15:45:00'),
      modifiedBy: 'trader1',
      description: 'Breakout alert for AVAX',
      notificationMethod: 'email',
      priority: 'medium'
    },
    {
      id: 8,
      cryptocurrency: 'Polkadot',
      symbol: 'DOT',
      type: 'RSI Alert',
      condition: 'below',
      triggerValue: 30,
      currentPrice: 7.85,
      priceChange: -3.1,
      status: 'paused',
      lastModified: new Date('2024-01-13T12:15:00'),
      modifiedBy: 'admin',
      description: 'Oversold condition alert for DOT',
      notificationMethod: 'email',
      priority: 'low'
    }
  ]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setThresholds(prev => prev.map(threshold => ({
        ...threshold,
        currentPrice: threshold.currentPrice * (1 + (Math.random() - 0.5) * 0.02),
        priceChange: (Math.random() - 0.5) * 10
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filtered and sorted thresholds
  const filteredAndSortedThresholds = useMemo(() => {
    let filtered = thresholds.filter(threshold => {
      const matchesCrypto = !filters.cryptocurrency || 
        threshold.cryptocurrency.toLowerCase().includes(filters.cryptocurrency.toLowerCase());
      
      const matchesType = !filters.type || 
        threshold.type.toLowerCase().includes(filters.type.toLowerCase());
      
      const matchesStatus = !filters.status || 
        threshold.status.toLowerCase() === filters.status.toLowerCase();
      
      const matchesModifiedBy = !filters.modifiedBy || 
        threshold.modifiedBy.toLowerCase().includes(filters.modifiedBy.toLowerCase());
      
      const matchesMinPrice = !filters.minPrice || 
        threshold.triggerValue >= parseFloat(filters.minPrice);
      
      const matchesMaxPrice = !filters.maxPrice || 
        threshold.triggerValue <= parseFloat(filters.maxPrice);
      
      const matchesDateRange = (!filters.startDate || new Date(threshold.lastModified) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(threshold.lastModified) <= new Date(filters.endDate));

      return matchesCrypto && matchesType && matchesStatus && matchesModifiedBy && 
             matchesMinPrice && matchesMaxPrice && matchesDateRange;
    });

    // Sort filtered results
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'lastModified') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [thresholds, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      cryptocurrency: '',
      type: '',
      status: '',
      startDate: '',
      endDate: '',
      minPrice: '',
      maxPrice: '',
      modifiedBy: ''
    });
  };

  const handleEditThreshold = (threshold) => {
    navigate('/threshold-configuration', { state: { threshold } });
  };

  const handleDuplicateThreshold = (threshold) => {
    const duplicatedThreshold = {
      ...threshold,
      id: Math.max(...thresholds.map(t => t.id)) + 1,
      cryptocurrency: `${threshold.cryptocurrency} (Copy)`,
      lastModified: new Date(),
      modifiedBy: 'admin'
    };
    setThresholds(prev => [...prev, duplicatedThreshold]);
  };

  const handleDeleteThreshold = (threshold) => {
    if (confirm(`Are you sure you want to delete the threshold for ${threshold.cryptocurrency}?`)) {
      setThresholds(prev => prev.filter(t => t.id !== threshold.id));
    }
  };

  const handleBulkAction = (action, thresholdIds) => {
    switch (action) {
      case 'activate':
        setThresholds(prev => prev.map(t => 
          thresholdIds.includes(t.id) ? { ...t, status: 'active' } : t
        ));
        break;
      case 'pause':
        setThresholds(prev => prev.map(t => 
          thresholdIds.includes(t.id) ? { ...t, status: 'paused' } : t
        ));
        break;
      case 'delete':
        setThresholds(prev => prev.filter(t => !thresholdIds.includes(t.id)));
        break;
      case 'duplicate':
        const duplicates = thresholds
          .filter(t => thresholdIds.includes(t.id))
          .map(t => ({
            ...t,
            id: Math.max(...thresholds.map(th => th.id)) + Math.random(),
            cryptocurrency: `${t.cryptocurrency} (Copy)`,
            lastModified: new Date(),
            modifiedBy: 'admin'
          }));
        setThresholds(prev => [...prev, ...duplicates]);
        break;
      case 'export':
        handleExportSelected(thresholdIds);
        break;
    }
    setSelectedThresholds([]);
  };

  const handleExportAll = () => {
    const csvContent = [
      ['Cryptocurrency', 'Symbol', 'Type', 'Condition', 'Trigger Value', 'Current Price', 'Status', 'Last Modified', 'Modified By'].join(','),
      ...thresholds.map(t => [
        t.cryptocurrency,
        t.symbol,
        t.type,
        t.condition,
        t.triggerValue,
        t.currentPrice.toFixed(2),
        t.status,
        t.lastModified.toISOString(),
        t.modifiedBy
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thresholds-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportSelected = (thresholdIds) => {
    const selectedData = thresholds.filter(t => thresholdIds.includes(t.id));
    const csvContent = [
      ['Cryptocurrency', 'Symbol', 'Type', 'Condition', 'Trigger Value', 'Current Price', 'Status', 'Last Modified', 'Modified By'].join(','),
      ...selectedData.map(t => [
        t.cryptocurrency,
        t.symbol,
        t.type,
        t.condition,
        t.triggerValue,
        t.currentPrice.toFixed(2),
        t.status,
        t.lastModified.toISOString(),
        t.modifiedBy
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `selected-thresholds-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const importedThresholds = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = line.split(',');
          return {
            id: Math.max(...thresholds.map(t => t.id)) + index + 1,
            cryptocurrency: values[0],
            symbol: values[1],
            type: values[2],
            condition: values[3],
            triggerValue: parseFloat(values[4]),
            currentPrice: parseFloat(values[4]) * (1 + (Math.random() - 0.5) * 0.1),
            priceChange: (Math.random() - 0.5) * 5,
            status: values[5] || 'active',
            lastModified: new Date(),
            modifiedBy: 'admin',
            description: values[6] || '',
            notificationMethod: values[7] || 'email',
            priority: values[8] || 'medium'
          };
        });

      setThresholds(prev => [...prev, ...importedThresholds]);
      alert(`Successfully imported ${importedThresholds.length} thresholds`);
    };
    reader.readAsText(file);
  };

  const handleRefresh = () => {
    // Simulate data refresh
    setThresholds(prev => prev.map(threshold => ({
      ...threshold,
      currentPrice: threshold.currentPrice * (1 + (Math.random() - 0.5) * 0.05),
      priceChange: (Math.random() - 0.5) * 8,
      lastModified: Math.random() > 0.8 ? new Date() : threshold.lastModified
    })));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <NavigationBreadcrumbs />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Threshold Management</h1>
                <p className="text-text-secondary mt-2">
                  Configure and monitor cryptocurrency price and risk thresholds
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  iconName="RefreshCw"
                  iconSize={16}
                  className="text-text-secondary hover:text-text-primary"
                >
                  Refresh
                </Button>
                
                <Button
                  variant="primary"
                  onClick={() => navigate('/threshold-configuration')}
                  iconName="Plus"
                  iconSize={16}
                >
                  Create Threshold
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <ThresholdFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
              thresholds={thresholds}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Section - Table (65% width on desktop) */}
            <div className="xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Thresholds ({filteredAndSortedThresholds.length})
                  </h2>
                  {selectedThresholds.length > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
                      {selectedThresholds.length} selected
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportAll}
                    iconName="Download"
                    iconSize={14}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    Export All
                  </Button>
                </div>
              </div>

              <ThresholdTable
                thresholds={filteredAndSortedThresholds}
                selectedThresholds={selectedThresholds}
                onSelectionChange={setSelectedThresholds}
                onEdit={handleEditThreshold}
                onDuplicate={handleDuplicateThreshold}
                onDelete={handleDeleteThreshold}
                onSort={handleSort}
                sortConfig={sortConfig}
              />
            </div>

            {/* Right Section - Stats and Actions (35% width on desktop) */}
            <div className="space-y-6">
              <ThresholdStats thresholds={filteredAndSortedThresholds} />
              <QuickActionsPanel
                onImport={handleImport}
                onExport={handleExportAll}
                onRefresh={handleRefresh}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Bulk Actions Panel */}
      <BulkActionsPanel
        selectedThresholds={selectedThresholds}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedThresholds([])}
        thresholds={thresholds}
      />
    </div>
  );
};

export default ThresholdManagement;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import AlertsTable from './components/AlertsTable';
import AlertsFilterToolbar from './components/AlertsFilterToolbar';
import AlertsStatisticsPanel from './components/AlertsStatisticsPanel';
import AlertsMobileCards from './components/AlertsMobileCards';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const RealTimeAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [filters, setFilters] = useState({
    severity: '',
    cryptocurrency: '',
    timeRange: '',
    status: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Mock alerts data
  const mockAlerts = [
    {
      id: 'ALT-001',
      timestamp: new Date(Date.now() - 300000),
      cryptocurrency: 'Bitcoin',
      symbol: 'BTC',
      alertType: 'price_threshold',
      severity: 'critical',
      currentPrice: 67850.45,
      thresholdValue: 68000.00,
      thresholdType: 'upper_limit',
      priceChange: -2.34,
      status: 'active',
      message: 'Bitcoin price has fallen below critical threshold of $68,000'
    },
    {
      id: 'ALT-002',
      timestamp: new Date(Date.now() - 600000),
      cryptocurrency: 'Ethereum',
      symbol: 'ETH',
      alertType: 'volume_spike',
      severity: 'high',
      currentPrice: 3245.67,
      thresholdValue: 3200.00,
      thresholdType: 'volume_threshold',
      priceChange: 1.43,
      status: 'active',
      message: 'Ethereum experiencing unusual volume spike - 300% above average'
    },
    {
      id: 'ALT-003',
      timestamp: new Date(Date.now() - 900000),
      cryptocurrency: 'Cardano',
      symbol: 'ADA',
      alertType: 'volatility',
      severity: 'medium',
      currentPrice: 0.4567,
      thresholdValue: 0.4500,
      thresholdType: 'volatility_index',
      priceChange: 1.49,
      status: 'acknowledged',
      message: 'Cardano showing increased volatility patterns'
    },
    {
      id: 'ALT-004',
      timestamp: new Date(Date.now() - 1200000),
      cryptocurrency: 'Solana',
      symbol: 'SOL',
      alertType: 'price_threshold',
      severity: 'high',
      currentPrice: 145.23,
      thresholdValue: 150.00,
      thresholdType: 'lower_limit',
      priceChange: -3.18,
      status: 'active',
      message: 'Solana price dropped below $150 support level'
    },
    {
      id: 'ALT-005',
      timestamp: new Date(Date.now() - 1500000),
      cryptocurrency: 'Polkadot',
      symbol: 'DOT',
      alertType: 'liquidity',
      severity: 'low',
      currentPrice: 7.89,
      thresholdValue: 8.00,
      thresholdType: 'liquidity_ratio',
      priceChange: -1.38,
      status: 'resolved',
      message: 'Polkadot liquidity levels have normalized'
    },
    {
      id: 'ALT-006',
      timestamp: new Date(Date.now() - 1800000),
      cryptocurrency: 'Chainlink',
      symbol: 'LINK',
      alertType: 'price_threshold',
      severity: 'critical',
      currentPrice: 14.56,
      thresholdValue: 15.00,
      thresholdType: 'support_level',
      priceChange: -2.93,
      status: 'active',
      message: 'Chainlink broke below major support at $15.00'
    },
    {
      id: 'ALT-007',
      timestamp: new Date(Date.now() - 2100000),
      cryptocurrency: 'Bitcoin',
      symbol: 'BTC',
      alertType: 'volume_spike',
      severity: 'medium',
      currentPrice: 67850.45,
      thresholdValue: 67500.00,
      thresholdType: 'volume_threshold',
      priceChange: 0.52,
      status: 'acknowledged',
      message: 'Bitcoin volume spike detected - monitoring for trend continuation'
    },
    {
      id: 'ALT-008',
      timestamp: new Date(Date.now() - 2400000),
      cryptocurrency: 'Ethereum',
      symbol: 'ETH',
      alertType: 'volatility',
      severity: 'high',
      currentPrice: 3245.67,
      thresholdValue: 3250.00,
      thresholdType: 'volatility_index',
      priceChange: -0.13,
      status: 'active',
      message: 'Ethereum volatility index exceeding normal parameters'
    }
  ];

  // Initialize data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAlerts(mockAlerts);
      setFilteredAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prevAlerts => {
        const updatedAlerts = prevAlerts.map(alert => {
          // Simulate price updates
          const priceVariation = (Math.random() - 0.5) * 0.02; // ±1% variation
          const newPrice = alert.currentPrice * (1 + priceVariation);
          const newPriceChange = ((newPrice - alert.currentPrice) / alert.currentPrice) * 100;
          
          return {
            ...alert,
            currentPrice: newPrice,
            priceChange: alert.priceChange + newPriceChange,
            timestamp: alert.status === 'active' ? new Date() : alert.timestamp
          };
        });

        // Occasionally add new alerts
        if (Math.random() < 0.1) {
          const newAlert = {
            id: `ALT-${String(Date.now()).slice(-3)}`,
            timestamp: new Date(),
            cryptocurrency: ['Bitcoin', 'Ethereum', 'Cardano', 'Solana'][Math.floor(Math.random() * 4)],
            symbol: ['BTC', 'ETH', 'ADA', 'SOL'][Math.floor(Math.random() * 4)],
            alertType: ['price_threshold', 'volume_spike', 'volatility'][Math.floor(Math.random() * 3)],
            severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)],
            currentPrice: Math.random() * 50000 + 1000,
            thresholdValue: Math.random() * 50000 + 1000,
            thresholdType: 'upper_limit',
            priceChange: (Math.random() - 0.5) * 10,
            status: 'active',
            message: 'New alert detected - requires immediate attention'
          };
          
          return [newAlert, ...updatedAlerts].slice(0, 20); // Keep only latest 20
        }

        return updatedAlerts;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter alerts based on search and filters
  useEffect(() => {
    let filtered = alerts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.cryptocurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.alertType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.severity) {
      filtered = filtered.filter(alert => alert.severity === filters.severity);
    }

    if (filters.cryptocurrency) {
      filtered = filtered.filter(alert => 
        alert.cryptocurrency.toLowerCase() === filters.cryptocurrency
      );
    }

    if (filters.status) {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }

    if (filters.timeRange) {
      const now = new Date();
      const timeRangeMs = {
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };

      if (timeRangeMs[filters.timeRange]) {
        filtered = filtered.filter(alert => 
          now - new Date(alert.timestamp) <= timeRangeMs[filters.timeRange]
        );
      }
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleSelectAlert = (alertId) => {
    setSelectedAlerts(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlerts.length === filteredAlerts.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts.map(alert => alert.id));
    }
  };

  const handleAcknowledge = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged' }
        : alert
    ));
    setSelectedAlerts(prev => prev.filter(id => id !== alertId));
  };

  const handleResolve = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved' }
        : alert
    ));
    setSelectedAlerts(prev => prev.filter(id => id !== alertId));
  };

  const handleBulkAcknowledge = () => {
    setAlerts(prev => prev.map(alert => 
      selectedAlerts.includes(alert.id)
        ? { ...alert, status: 'acknowledged' }
        : alert
    ));
    setSelectedAlerts([]);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Timestamp', 'Cryptocurrency', 'Alert Type', 'Severity', 'Current Price', 'Threshold', 'Status'],
      ...filteredAlerts.map(alert => [
        alert.id,
        alert.timestamp.toISOString(),
        alert.cryptocurrency,
        alert.alertType,
        alert.severity,
        alert.currentPrice,
        alert.thresholdValue,
        alert.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alerts-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:ml-60 pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
              <p className="text-text-secondary">Loading alerts...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-60 pt-16">
        <div className="p-6">
          {/* Breadcrumbs */}
          <NavigationBreadcrumbs className="mb-6" />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Real-time Alerts</h1>
              <p className="text-text-secondary">
                Monitor and manage cryptocurrency alerts in real-time
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/threshold-configuration')}
                iconName="Plus"
                iconSize={16}
              >
                New Threshold
              </Button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.location.reload()}
                iconName="RefreshCw"
                iconSize={16}
              >
                Refresh
              </Button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1">
              {/* Filter Toolbar */}
              <AlertsFilterToolbar
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
                onExport={handleExport}
                onBulkAcknowledge={handleBulkAcknowledge}
                selectedCount={selectedAlerts.length}
                totalCount={filteredAlerts.length}
                activeFilters={filters}
              />

              {/* Alerts Display */}
              {isMobile ? (
                <AlertsMobileCards
                  alerts={filteredAlerts}
                  onAcknowledge={handleAcknowledge}
                  onResolve={handleResolve}
                  selectedAlerts={selectedAlerts}
                  onSelectAlert={handleSelectAlert}
                />
              ) : (
                <AlertsTable
                  alerts={filteredAlerts}
                  onAcknowledge={handleAcknowledge}
                  onResolve={handleResolve}
                  selectedAlerts={selectedAlerts}
                  onSelectAlert={handleSelectAlert}
                  onSelectAll={handleSelectAll}
                />
              )}
            </div>

            {/* Statistics Panel */}
            <div className="xl:w-80">
              <AlertsStatisticsPanel alerts={filteredAlerts} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RealTimeAlerts;
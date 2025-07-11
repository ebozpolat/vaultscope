import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import AlertHeader from './components/AlertHeader';
import AlertTimeline from './components/AlertTimeline';
import PriceChart from './components/PriceChart';
import AlertMetadata from './components/AlertMetadata';
import ActionHistory from './components/ActionHistory';
import RelatedAlerts from './components/RelatedAlerts';
import CommentsSection from './components/CommentsSection';
import ExportActions from './components/ExportActions';

const AlertDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  // Mock alert data
  const mockAlert = {
    id: "ALT-2024-001",
    title: "Bitcoin Price Threshold Breach",
    description: "Bitcoin price has exceeded the configured upper threshold of $65,000, triggering a high-severity alert for immediate attention.",
    severity: "High",
    status: "Active",
    cryptocurrency: "Bitcoin (BTC)",
    exchange: "Binance",
    thresholdType: "Upper Price",
    thresholdValue: 65000,
    triggerPrice: 65250,
    currentPrice: 65420,
    priceChange: 2.8,
    volume24h: 28500000000,
    marketCap: 1280000000000,
    triggeredAt: new Date(Date.now() - 3600000).toISOString(),
    assignedTo: "Risk Team Alpha",
    monitoringSystem: "VaultScope Core",
    dataSource: "Binance WebSocket API",
    alertRule: "BTC_UPPER_THRESHOLD_65K",
    notificationSent: true,
    riskLevel: "High",
    impactScore: 8,
    confidenceLevel: 95
  };

  // Mock timeline events
  const mockTimelineEvents = [
    {
      id: 1,
      type: "triggered",
      description: "Alert triggered due to Bitcoin price exceeding $65,000 threshold",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: "System",
      details: {
        triggerPrice: 65250,
        thresholdValue: 65000,
        exchange: "Binance"
      }
    },
    {
      id: 2,
      type: "acknowledged",
      description: "Alert acknowledged by risk management team",
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      user: "John Smith"
    },
    {
      id: 3,
      type: "comment",
      description: "Added analysis comment regarding market conditions",
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      user: "Sarah Johnson"
    }
  ];

  // Mock action history
  const mockActionHistory = [
    {
      id: 1,
      action: "acknowledged",
      description: "Alert acknowledged and assigned to Risk Team Alpha",
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      user: "John Smith",
      duration: "2 minutes",
      notes: "Monitoring market conditions closely"
    },
    {
      id: 2,
      action: "commented",
      description: "Added market analysis and risk assessment",
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      user: "Sarah Johnson",
      duration: "5 minutes"
    }
  ];

  // Mock related alerts
  const mockRelatedAlerts = [
    {
      id: "ALT-2024-002",
      cryptocurrency: "Ethereum (ETH)",
      severity: "Medium",
      description: "Ethereum showing similar upward price movement pattern",
      triggeredAt: new Date(Date.now() - 1800000).toISOString(),
      triggerPrice: 2850
    },
    {
      id: "ALT-2024-003",
      cryptocurrency: "Bitcoin (BTC)",
      severity: "Low",
      description: "Volume spike detected in Bitcoin trading",
      triggeredAt: new Date(Date.now() - 7200000).toISOString(),
      triggerPrice: 64800
    }
  ];

  // Mock price chart data
  const mockPriceData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).getTime(),
    price: 64000 + Math.random() * 2000 + (i * 50),
    volume: 1000000 + Math.random() * 500000
  }));

  // Mock comments
  const mockComments = [
    {
      id: 1,
      author: "John Smith",
      content: "This alert appears to be related to the recent market rally. Monitoring for potential reversal patterns.",
      timestamp: new Date(Date.now() - 2400000).toISOString(),
      likes: 3,
      canEdit: false,
      isEdited: false
    },
    {
      id: 2,
      author: "Sarah Johnson",
      content: "Updated threshold configuration to account for increased volatility. New upper threshold set to $67,000.",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      likes: 1,
      canEdit: true,
      isEdited: true
    }
  ];

  useEffect(() => {
    // Simulate loading alert data
    const loadAlertData = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch data based on URL params
        const urlParams = new URLSearchParams(location.search);
        const alertId = urlParams.get('id') || mockAlert.id;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAlert(mockAlert);
        setComments(mockComments);
      } catch (error) {
        console.error('Failed to load alert data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlertData();
  }, [location.search]);

  const handleAlertAction = async (action) => {
    try {
      console.log(`Performing action: ${action}`);
      
      // Update alert status based on action
      setAlert(prev => ({
        ...prev,
        status: action === 'acknowledge' ? 'Acknowledged' : 
               action === 'resolve' ? 'Resolved' : prev.status
      }));

      // Add to action history
      const newAction = {
        id: Date.now(),
        action: action,
        description: `Alert ${action}d by current user`,
        timestamp: new Date().toISOString(),
        user: "Current User",
        duration: "Just now"
      };

      // In a real app, this would make an API call
      alert(`Alert ${action}d successfully!`);
      
    } catch (error) {
      console.error(`Failed to ${action} alert:`, error);
      alert(`Failed to ${action} alert. Please try again.`);
    }
  };

  const handleNavigation = (direction) => {
    // In a real app, this would navigate to the next/previous alert
    const alertIds = ["ALT-2024-001", "ALT-2024-002", "ALT-2024-003"];
    const currentIndex = alertIds.indexOf(alert.id);
    
    if (direction === 'next' && currentIndex < alertIds.length - 1) {
      navigate(`/alert-details?id=${alertIds[currentIndex + 1]}`);
    } else if (direction === 'previous' && currentIndex > 0) {
      navigate(`/alert-details?id=${alertIds[currentIndex - 1]}`);
    }
  };

  const handleAddComment = async (content) => {
    const newComment = {
      id: Date.now(),
      author: "Current User",
      content: content,
      timestamp: new Date().toISOString(),
      likes: 0,
      canEdit: true,
      isEdited: false
    };

    setComments(prev => [...prev, newComment]);
    
    // In a real app, this would make an API call
    console.log('Comment added:', newComment);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:ml-60 pt-16">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-secondary">Loading alert details...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar />
        <main className="lg:ml-60 pt-16">
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Alert Not Found</h2>
              <p className="text-text-secondary mb-6">The requested alert could not be found.</p>
              <button
                onClick={() => navigate('/real-time-alerts')}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Back to Alerts
              </button>
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
          <div className="mb-6">
            <NavigationBreadcrumbs />
          </div>

          {/* Alert Header */}
          <div className="mb-6">
            <AlertHeader
              alert={alert}
              onAcknowledge={() => handleAlertAction('acknowledge')}
              onEscalate={() => handleAlertAction('escalate')}
              onResolve={() => handleAlertAction('resolve')}
              onPrevious={() => handleNavigation('previous')}
              onNext={() => handleNavigation('next')}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Primary Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Price Chart */}
              <PriceChart
                data={mockPriceData}
                thresholdValue={alert.thresholdValue}
                alertTime={new Date(alert.triggeredAt).getTime()}
                cryptocurrency={alert.cryptocurrency}
              />

              {/* Alert Timeline */}
              <AlertTimeline events={mockTimelineEvents} />

              {/* Comments Section */}
              <CommentsSection
                comments={comments}
                onAddComment={handleAddComment}
              />
            </div>

            {/* Right Column - Metadata and Actions */}
            <div className="space-y-6">
              {/* Alert Metadata */}
              <AlertMetadata alert={alert} />

              {/* Action History */}
              <ActionHistory actions={mockActionHistory} />

              {/* Related Alerts */}
              <RelatedAlerts
                alerts={mockRelatedAlerts}
                currentAlertId={alert.id}
              />

              {/* Export Actions */}
              <ExportActions alert={alert} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlertDetails;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = ({ onImport, onExport, onRefresh }) => {
  const navigate = useNavigate();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);

  const quickActions = [
    {
      id: 'create',
      label: 'Create Threshold',
      icon: 'Plus',
      color: 'text-primary',
      variant: 'primary',
      description: 'Set up a new monitoring threshold',
      action: () => navigate('/threshold-configuration')
    },
    {
      id: 'import',
      label: 'Import CSV',
      icon: 'Upload',
      color: 'text-accent',
      variant: 'secondary',
      description: 'Bulk import thresholds from CSV file',
      action: () => setIsImportModalOpen(true)
    },
    {
      id: 'export',
      label: 'Export All',
      icon: 'Download',
      color: 'text-success',
      variant: 'outline',
      description: 'Export all thresholds to CSV',
      action: onExport
    },
    {
      id: 'refresh',
      label: 'Refresh Data',
      icon: 'RefreshCw',
      color: 'text-secondary',
      variant: 'ghost',
      description: 'Update threshold data and prices',
      action: onRefresh
    }
  ];

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleImportSubmit = () => {
    if (importFile) {
      onImport(importFile);
      setImportFile(null);
      setIsImportModalOpen(false);
    }
  };

  const templateActions = [
    {
      id: 'template-basic',
      label: 'Basic Template',
      description: 'Simple price threshold template',
      action: () => {
        const csvContent = `cryptocurrency,symbol,type,condition,triggerValue,status\nBitcoin,BTC,Price Alert,above,50000,active\nEthereum,ETH,Price Alert,below,3000,active`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'threshold-template-basic.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    },
    {
      id: 'template-advanced',
      label: 'Advanced Template',
      description: 'Comprehensive threshold template with all fields',
      action: () => {
        const csvContent = `cryptocurrency,symbol,type,condition,triggerValue,status,description,notificationMethod,priority\nBitcoin,BTC,Price Alert,above,50000,active,High price alert for BTC,email,high\nEthereum,ETH,Volume Alert,below,1000000,active,Low volume alert for ETH,webhook,medium`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'threshold-template-advanced.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    }
  ];

  return (
    <>
      {/* Quick Actions Panel */}
      <div className="bg-surface rounded-lg border border-border shadow-elevation-1 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
            <p className="text-sm text-text-secondary">Manage thresholds efficiently</p>
          </div>
        </div>

        <div className="space-y-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              onClick={action.action}
              className="w-full justify-start"
              iconName={action.icon}
              iconSize={16}
            >
              <div className="flex-1 text-left ml-3">
                <div className="font-medium">{action.label}</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Separator */}
        <div className="my-6 border-t border-border" />

        {/* Template Downloads */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-text-primary flex items-center">
            <Icon name="FileText" size={16} className="mr-2" />
            CSV Templates
          </h4>
          
          <div className="space-y-2">
            {templateActions.map((template) => (
              <button
                key={template.id}
                onClick={template.action}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-background-secondary transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {template.label}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      {template.description}
                    </div>
                  </div>
                  <Icon name="Download" size={14} className="text-text-tertiary" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-background-secondary rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="HelpCircle" size={16} className="text-accent mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-text-primary">Need Help?</h5>
              <p className="text-xs text-text-secondary mt-1">
                Check our documentation for threshold configuration guidelines and best practices.
              </p>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto mt-2 text-xs"
                iconName="ExternalLink"
                iconSize={12}
                iconPosition="right"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-secondary-900/50 flex items-center justify-center z-[1000]">
          <div className="bg-surface rounded-lg border border-border shadow-elevation-4 p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                <Icon name="Upload" size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Import Thresholds</h3>
                <p className="text-sm text-text-secondary">Upload a CSV file to bulk import thresholds</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportFile}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {importFile && (
                <div className="p-3 bg-success-50 rounded-lg border border-success-200">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <span className="text-sm font-medium text-success-800">
                      File selected: {importFile.name}
                    </span>
                  </div>
                  <p className="text-xs text-success-700 mt-1">
                    Size: {(importFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}

              <div className="p-3 bg-background-secondary rounded-lg">
                <h5 className="text-sm font-medium text-text-primary mb-2">CSV Format Requirements:</h5>
                <ul className="text-xs text-text-secondary space-y-1">
                  <li>• Required columns: cryptocurrency, symbol, type, condition, triggerValue, status</li>
                  <li>• Status values: active, paused, triggered</li>
                  <li>• Condition values: above, below, equal</li>
                  <li>• Use comma-separated values</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportFile(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleImportSubmit}
                disabled={!importFile}
                className="flex-1"
              >
                Import Thresholds
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActionsPanel;
import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportActions = ({ alert }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const exportFormats = [
    { value: 'pdf', label: 'PDF Report', icon: 'FileText' },
    { value: 'json', label: 'JSON Data', icon: 'Code' },
    { value: 'csv', label: 'CSV Export', icon: 'Table' },
    { value: 'xlsx', label: 'Excel File', icon: 'Sheet' }
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    setExportFormat(format);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock export data
      const exportData = {
        alertId: alert.id,
        timestamp: new Date().toISOString(),
        format: format,
        data: {
          ...alert,
          exportedAt: new Date().toISOString(),
          exportedBy: 'Current User'
        }
      };

      // Create and download file
      const filename = `alert-${alert.id}-${new Date().toISOString().split('T')[0]}.${format}`;
      
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        downloadFile(blob, filename);
      } else if (format === 'csv') {
        const csvContent = generateCSV(exportData.data);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        downloadFile(blob, filename);
      } else {
        // For PDF and Excel, show success message
        alert(`${format.toUpperCase()} export completed successfully!`);
      }

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateCSV = (data) => {
    const headers = Object.keys(data).join(',');
    const values = Object.values(data).map(value => 
      typeof value === 'string' ? `"${value}"` : value
    ).join(',');
    return `${headers}\n${values}`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Download" size={20} className="text-text-secondary" />
        <h3 className="text-lg font-semibold text-text-primary">Export Alert</h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-text-secondary mb-4">
          Export this alert's data and analysis in your preferred format.
        </p>

        <div className="grid grid-cols-1 gap-3">
          {exportFormats.map((format) => (
            <Button
              key={format.value}
              variant="outline"
              size="sm"
              onClick={() => handleExport(format.value)}
              disabled={isExporting}
              loading={isExporting && exportFormat === format.value}
              iconName={format.icon}
              iconSize={16}
              className="justify-start"
            >
              <span className="ml-3">{format.label}</span>
            </Button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-background-secondary rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-accent mt-0.5" />
            <div className="text-sm text-text-secondary">
              <p className="font-medium text-text-primary mb-1">Export includes:</p>
              <ul className="space-y-1 text-xs">
                <li>• Alert metadata and configuration</li>
                <li>• Price data and threshold information</li>
                <li>• Timeline of events and actions</li>
                <li>• Comments and collaboration history</li>
                <li>• Risk assessment and impact analysis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExport('pdf')}
            iconName="FileText"
            iconSize={14}
            className="text-text-secondary hover:text-text-primary"
          >
            Quick PDF
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExport('json')}
            iconName="Code"
            iconSize={14}
            className="text-text-secondary hover:text-text-primary"
          >
            Raw Data
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            iconName="Printer"
            iconSize={14}
            className="text-text-secondary hover:text-text-primary"
          >
            Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportActions;
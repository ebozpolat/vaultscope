import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtonsSection = ({ 
  formData, 
  onSave, 
  onTest, 
  isValid = false,
  className = '' 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({
    save: false,
    saveAndActivate: false,
    test: false
  });

  const handleSave = async (activate = false) => {
    const loadingKey = activate ? 'saveAndActivate' : 'save';
    setIsLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const savedData = {
        ...formData,
        id: Date.now(),
        status: activate ? 'active' : 'inactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Saving threshold configuration:', savedData);
      
      if (onSave) {
        onSave(savedData, activate);
      }

      // Show success message
      alert(`Threshold ${activate ? 'saved and activated' : 'saved'} successfully!`);
      
      // Navigate back to threshold management
      navigate('/threshold-management');
    } catch (error) {
      console.error('Error saving threshold:', error);
      alert('Error saving threshold. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleTest = async () => {
    setIsLoading(prev => ({ ...prev, test: true }));

    try {
      // Simulate threshold test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const testResult = {
        success: true,
        message: 'Threshold configuration test completed successfully',
        details: {
          dataSourceConnection: 'Connected',
          conditionValidation: 'Valid',
          notificationChannels: 'Configured',
          estimatedTriggerTime: '< 1 minute'
        }
      };

      console.log('Threshold test result:', testResult);
      
      if (onTest) {
        onTest(testResult);
      }

      // Show test results
      alert(`Test completed successfully!\n\nData Source: ${testResult.details.dataSourceConnection}\nConditions: ${testResult.details.conditionValidation}\nNotifications: ${testResult.details.notificationChannels}\nEstimated Trigger Time: ${testResult.details.estimatedTriggerTime}`);
    } catch (error) {
      console.error('Error testing threshold:', error);
      alert('Error testing threshold. Please check your configuration.');
    } finally {
      setIsLoading(prev => ({ ...prev, test: false }));
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/threshold-management');
    }
  };

  const handleDuplicate = () => {
    const duplicatedData = {
      ...formData,
      thresholdName: `${formData.thresholdName || 'Threshold'} (Copy)`,
      id: undefined
    };
    
    console.log('Duplicating threshold:', duplicatedData);
    alert('Threshold duplicated! You can now modify the copy.');
  };

  return (
    <div className={`bg-surface rounded-lg border border-border shadow-elevation-1 ${className}`}>
      <div className="p-6">
        <div className="flex flex-col space-y-4">
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              onClick={() => handleSave(true)}
              disabled={!isValid || isLoading.saveAndActivate}
              loading={isLoading.saveAndActivate}
              iconName="Play"
              iconSize={16}
              className="flex-1"
            >
              Save & Activate
            </Button>

            <Button
              variant="secondary"
              onClick={() => handleSave(false)}
              disabled={!isValid || isLoading.save}
              loading={isLoading.save}
              iconName="Save"
              iconSize={16}
              className="flex-1"
            >
              Save as Draft
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={!isValid || isLoading.test}
              loading={isLoading.test}
              iconName="TestTube"
              iconSize={16}
              className="flex-1"
            >
              Test Configuration
            </Button>

            <Button
              variant="outline"
              onClick={handleDuplicate}
              disabled={!formData.thresholdName}
              iconName="Copy"
              iconSize={16}
              className="flex-1"
            >
              Duplicate
            </Button>
          </div>

          {/* Tertiary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
            <Button
              variant="ghost"
              onClick={handleCancel}
              iconName="X"
              iconSize={16}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate('/threshold-management')}
              iconName="ArrowLeft"
              iconSize={16}
              className="flex-1"
            >
              Back to Management
            </Button>
          </div>
        </div>

        {/* Validation Status */}
        <div className="mt-6 p-4 bg-background-secondary rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon 
              name={isValid ? "CheckCircle" : "AlertCircle"} 
              size={20} 
              className={isValid ? "text-success" : "text-warning"} 
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-text-primary">
                Configuration Status
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                {isValid 
                  ? "All required fields are completed and valid. Ready to save."
                  : "Please complete all required fields before saving."
                }
              </p>
              
              {/* Validation Checklist */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={formData.cryptocurrency ? "Check" : "X"} 
                    size={14} 
                    className={formData.cryptocurrency ? "text-success" : "text-error"} 
                  />
                  <span className="text-xs text-text-secondary">Cryptocurrency selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={formData.thresholdName ? "Check" : "X"} 
                    size={14} 
                    className={formData.thresholdName ? "text-success" : "text-error"} 
                  />
                  <span className="text-xs text-text-secondary">Threshold name provided</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={formData.conditions?.length > 0 ? "Check" : "X"} 
                    size={14} 
                    className={formData.conditions?.length > 0 ? "text-success" : "text-error"} 
                  />
                  <span className="text-xs text-text-secondary">At least one condition configured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={formData.severityLevel ? "Check" : "X"} 
                    size={14} 
                    className={formData.severityLevel ? "text-success" : "text-error"} 
                  />
                  <span className="text-xs text-text-secondary">Severity level selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={formData.notificationMethods?.length > 0 ? "Check" : "X"} 
                    size={14} 
                    className={formData.notificationMethods?.length > 0 ? "text-success" : "text-error"} 
                  />
                  <span className="text-xs text-text-secondary">Notification method selected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Info */}
        <div className="mt-4 text-xs text-text-tertiary">
          <p>
            <strong>Tip:</strong> Use "Save as Draft" to save your progress without activating the threshold. 
            You can activate it later from the Threshold Management page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActionButtonsSection;
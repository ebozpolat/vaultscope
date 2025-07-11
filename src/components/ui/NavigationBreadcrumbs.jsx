import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationBreadcrumbs = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route configuration with breadcrumb information
  const routeConfig = {
    '/dashboard-overview': {
      label: 'Dashboard Overview',
      parent: null,
      icon: 'LayoutDashboard'
    },
    '/real-time-alerts': {
      label: 'Real-time Alerts',
      parent: null,
      icon: 'AlertTriangle'
    },
    '/alert-details': {
      label: 'Alert Details',
      parent: '/real-time-alerts',
      icon: 'FileText'
    },
    '/threshold-management': {
      label: 'Threshold Management',
      parent: null,
      icon: 'Settings'
    },
    '/threshold-configuration': {
      label: 'Threshold Configuration',
      parent: '/threshold-management',
      icon: 'Sliders'
    },
    '/system-settings': {
      label: 'System Settings',
      parent: null,
      icon: 'Cog'
    }
  };

  const buildBreadcrumbPath = (currentPath) => {
    const path = [];
    let current = currentPath;

    while (current && routeConfig[current]) {
      path.unshift(routeConfig[current]);
      current = routeConfig[current].parent;
    }

    return path;
  };

  const breadcrumbPath = buildBreadcrumbPath(location.pathname);

  // Don't render breadcrumbs if we're on a top-level route with no parent
  if (breadcrumbPath.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (index) => {
    const targetPath = Object.keys(routeConfig).find(
      path => routeConfig[path] === breadcrumbPath[index]
    );
    if (targetPath) {
      navigate(targetPath);
    }
  };

  const handleHomeClick = () => {
    navigate('/dashboard-overview');
  };

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      {/* Home/Dashboard Link */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleHomeClick}
        className="text-text-tertiary hover:text-text-primary px-2 py-1"
        iconName="Home"
        iconSize={14}
      />

      <Icon name="ChevronRight" size={14} className="text-text-quaternary" />

      {/* Breadcrumb Items */}
      {breadcrumbPath.map((item, index) => {
        const isLast = index === breadcrumbPath.length - 1;
        const isClickable = !isLast;

        return (
          <React.Fragment key={index}>
            <div className="flex items-center space-x-2">
              {isClickable ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBreadcrumbClick(index)}
                  className="text-text-secondary hover:text-text-primary px-2 py-1 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <Icon name={item.icon} size={14} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Button>
              ) : (
                <div className="flex items-center space-x-2 px-2 py-1">
                  <Icon name={item.icon} size={14} className="text-primary" />
                  <span className="font-semibold text-text-primary">{item.label}</span>
                </div>
              )}
            </div>

            {!isLast && (
              <Icon name="ChevronRight" size={14} className="text-text-quaternary" />
            )}
          </React.Fragment>
        );
      })}

      {/* Mobile Responsive: Show only current page on small screens */}
      <div className="sm:hidden flex items-center space-x-2 ml-4">
        <div className="w-1 h-1 bg-text-quaternary rounded-full" />
        <div className="w-1 h-1 bg-text-quaternary rounded-full" />
        <div className="w-1 h-1 bg-text-quaternary rounded-full" />
      </div>
    </nav>
  );
};

export default NavigationBreadcrumbs;
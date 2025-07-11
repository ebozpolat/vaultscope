import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(3);

  // Navigation items with hardcoded structure
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard-overview',
      icon: 'LayoutDashboard',
      tooltip: 'Real-time market overview and system status'
    },
    {
      label: 'Alerts',
      path: '/real-time-alerts',
      icon: 'AlertTriangle',
      tooltip: 'Active monitoring and alert management',
      badge: alertCount,
      children: [
        {
          label: 'Alert Details',
          path: '/alert-details',
          icon: 'FileText',
          tooltip: 'Detailed alert information and history'
        }
      ]
    },
    {
      label: 'Thresholds',
      path: '/threshold-management',
      icon: 'Settings',
      tooltip: 'Configuration and management of monitoring parameters',
      children: [
        {
          label: 'Configuration',
          path: '/threshold-configuration',
          icon: 'Sliders',
          tooltip: 'Detailed threshold setup and customization'
        }
      ]
    },
    {
      label: 'Settings',
      path: '/system-settings',
      icon: 'Cog',
      tooltip: 'System administration and preferences'
    }
  ];

  // Simulate real-time alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAlertCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (item) => {
    if (isActiveRoute(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isActiveRoute(child.path));
    }
    return false;
  };

  const renderNavigationItem = (item, isChild = false) => {
    const isActive = isActiveRoute(item.path);
    const isParentActiveItem = isParentActive(item);

    return (
      <div key={item.path} className={`${isChild ? 'ml-4' : ''}`}>
        <Button
          variant={isActive ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => handleNavigation(item.path)}
          className={`
            w-full justify-start mb-1 transition-all duration-200 ease-out-smooth
            ${isActive 
              ? 'bg-primary text-primary-foreground shadow-elevation-1' 
              : isParentActiveItem && !isChild
                ? 'bg-primary-50 text-primary border-l-2 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-background-secondary'
            }
            ${isCollapsed && !isChild ? 'px-2' : 'px-3'}
            ${isChild ? 'text-sm py-2' : 'py-3'}
          `}
          iconName={item.icon}
          iconSize={isChild ? 16 : 18}
        >
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full ml-3">
              <span className="font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="bg-error text-error-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center animate-pulse-subtle">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
          )}
        </Button>

        {/* Child navigation items */}
        {!isCollapsed && item.children && isParentActiveItem && (
          <div className="mt-1 space-y-1">
            {item.children.map(child => renderNavigationItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-secondary-900/50 z-[800] lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-[900] bg-surface border-r border-border shadow-elevation-2
        transition-all duration-300 ease-out-smooth
        ${isCollapsed ? 'w-16' : 'w-60'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={20} className="text-primary" />
                <span className="font-semibold text-text-primary">Navigation</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="hidden lg:flex text-text-secondary hover:text-text-primary"
              iconName={isCollapsed ? 'ChevronRight' : 'ChevronLeft'}
              iconSize={16}
            />
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map(item => renderNavigationItem(item))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="text-xs text-text-tertiary">
                <p className="font-medium">VaultScope v2.1.0</p>
                <p>Real-time Crypto Surveillance</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <Icon name="Info" size={16} className="text-text-tertiary" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <Button
        variant="primary"
        size="sm"
        onClick={toggleMobile}
        className="fixed top-20 left-4 z-[950] lg:hidden shadow-elevation-3"
        iconName="Menu"
        iconSize={16}
      />
    </>
  );
};

export default Sidebar;
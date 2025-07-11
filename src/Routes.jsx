import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import DashboardOverview from "pages/dashboard-overview";
import AlertDetails from "pages/alert-details";
import RealTimeAlerts from "pages/real-time-alerts";
import ThresholdManagement from "pages/threshold-management";
import ThresholdConfiguration from "pages/threshold-configuration";
import SystemSettings from "pages/system-settings";
import Authentication from "pages/authentication";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/dashboard-overview" element={<DashboardOverview />} />
        <Route path="/alert-details" element={<AlertDetails />} />
        <Route path="/real-time-alerts" element={<RealTimeAlerts />} />
        <Route path="/threshold-management" element={<ThresholdManagement />} />
        <Route path="/threshold-configuration" element={<ThresholdConfiguration />} />
        <Route path="/system-settings" element={<SystemSettings />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
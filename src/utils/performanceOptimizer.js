import React from 'react';
// Performance optimization utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

export const lazyLoad = (importFunc) => {
  return React.lazy(() => 
    importFunc().catch(err => {
      console.error('Component loading failed:', err);
      return { default: () => <div>Failed to load component</div> };
    })
  );
};

export const preloadRoute = (routeImport) => {
  const componentImport = routeImport();
  return componentImport;
};

// Memory leak prevention
export const cleanupEffect = (cleanup) => {
  return () => {
    if (typeof cleanup === 'function') {
      cleanup();
    }
  };
};

// Bundle size optimization
export const dynamicImport = async (modulePath) => {
  try {
    const module = await import(modulePath);
    return module;
  } catch (error) {
    console.error(`Failed to load module: ${modulePath}`, error);
    throw error;
  }
};

export default {
  debounce,
  throttle,
  memoize,
  lazyLoad,
  preloadRoute,
  cleanupEffect,
  dynamicImport
};
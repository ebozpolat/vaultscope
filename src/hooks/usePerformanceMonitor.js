import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName) => {
  const startTime = useRef(Date.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    
    const endTime = Date.now();
    const renderTime = endTime - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} - Render ${renderCount.current}, Time: ${renderTime}ms`);
    }
    
    // Log performance metrics in production
    if (process.env.NODE_ENV === 'production' && renderTime > 100) {
      console.warn(`[Performance Warning] ${componentName} took ${renderTime}ms to render`);
    }
    
    startTime.current = Date.now();
  });

  return { renderCount: renderCount.current };
};

export const useMemoryMonitor = () => {
  useEffect(() => {
    const checkMemory = () => {
      if (performance.memory) {
        const memory = performance.memory;
        const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
        const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
        
        if (usedMB > 50) { // Alert if using more than 50MB
          console.warn(`[Memory Warning] Using ${usedMB}MB of ${totalMB}MB available`);
        }
      }
    };

    const interval = setInterval(checkMemory, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
};

export default { usePerformanceMonitor, useMemoryMonitor };
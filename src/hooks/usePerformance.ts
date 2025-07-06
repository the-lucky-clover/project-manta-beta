import { useState, useEffect, useCallback } from 'react';

export const usePerformance = () => {
  const [performanceLevel, setPerformanceLevel] = useState(4); // 1-4 scale
  const [frameTime, setFrameTime] = useState(16.67); // Target 60fps

  // Performance monitoring
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let totalFrameTime = 0;

    const measurePerformance = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      
      totalFrameTime += deltaTime;
      frameCount++;
      
      if (frameCount >= 60) { // Sample every 60 frames
        const avgFrameTime = totalFrameTime / frameCount;
        setFrameTime(avgFrameTime);
        
        // Adjust performance level based on frame time
        if (avgFrameTime > 33) { // Below 30fps
          setPerformanceLevel(prev => Math.max(1, prev - 1));
        } else if (avgFrameTime < 14) { // Above 70fps
          setPerformanceLevel(prev => Math.min(4, prev + 1));
        }
        
        frameCount = 0;
        totalFrameTime = 0;
      }
      
      lastTime = currentTime;
      requestAnimationFrame(measurePerformance);
    };

    const rafId = requestAnimationFrame(measurePerformance);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Device capability detection
  useEffect(() => {
    const detectCapabilities = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) {
        setPerformanceLevel(1);
        return;
      }

      // Check for high-performance GPU
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
      
      // Device memory and hardware concurrency
      const memory = (navigator as any).deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      
      // Performance scoring
      let score = 2; // Base score
      
      if (memory >= 8) score++;
      if (cores >= 8) score++;
      if (renderer.includes('RTX') || renderer.includes('RX')) score++;
      if (window.devicePixelRatio <= 1) score++; // Lower pixel density = better performance
      
      setPerformanceLevel(Math.min(4, Math.max(1, score)));
    };

    detectCapabilities();
  }, []);

  const adaptQuality = useCallback((level: number) => {
    setPerformanceLevel(Math.min(4, Math.max(1, level)));
  }, []);

  return {
    performanceLevel,
    frameTime,
    adaptQuality
  };
};
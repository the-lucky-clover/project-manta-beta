import { useState, useCallback } from 'react';

interface TouchData {
  active: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
}

export const useTouchControls = () => {
  const [touchData, setTouchData] = useState<TouchData>({
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0
  });

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    
    setTouchData({
      active: true,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0
    });
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    if (!touchData.active) return;
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchData.currentX;
    const deltaY = touch.clientY - touchData.currentY;
    
    setTouchData(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX,
      deltaY
    }));
  }, [touchData.active, touchData.currentX, touchData.currentY]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    setTouchData(prev => ({
      ...prev,
      active: false,
      deltaX: 0,
      deltaY: 0
    }));
  }, []);

  return {
    touchData,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
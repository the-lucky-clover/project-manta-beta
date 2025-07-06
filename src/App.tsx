import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene3D } from './components/Scene3D';
import { HUD } from './components/HUD';
import { Controls } from './components/Controls';
import { AudioManager } from './components/AudioManager';
import { LoadingScreen } from './components/LoadingScreen';
import { MainMenu } from './components/MainMenu';
import { useGameState } from './hooks/useGameState';
import { usePerformance } from './hooks/usePerformance';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(true);
  const { gameState, updateGameState } = useGameState();
  const { performanceLevel, adaptQuality } = usePerformance();

  const handleStartGame = useCallback(() => {
    setShowMenu(false);
    updateGameState({ gameMode: 'flight', missionActive: true });
  }, [updateGameState]);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Initialize loading sequence
    const timer = setTimeout(() => {
      handleLoadingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [handleLoadingComplete]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showMenu) {
    return <MainMenu onStartGame={handleStartGame} />;
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* 3D Scene */}
      <Canvas
        camera={{ 
          position: [0, 5, 10], 
          fov: 75,
          near: 0.1,
          far: 10000 
        }}
        gl={{
          antialias: performanceLevel > 2,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true
        }}
        dpr={Math.min(window.devicePixelRatio, performanceLevel > 3 ? 2 : 1)}
        className="absolute inset-0"
      >
        <Suspense fallback={null}>
          <Scene3D 
            gameState={gameState} 
            performanceLevel={performanceLevel}
            onQualityChange={adaptQuality}
          />
        </Suspense>
      </Canvas>

      {/* HUD Overlay */}
      <HUD 
        gameState={gameState}
        onStateUpdate={updateGameState}
      />

      {/* Controls */}
      <Controls 
        gameState={gameState}
        onStateUpdate={updateGameState}
      />

      {/* Audio Manager */}
      <AudioManager 
        gameState={gameState}
      />
    </div>
  );
}

export default App;
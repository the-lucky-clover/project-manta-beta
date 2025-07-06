import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, RotateCcw } from 'lucide-react';
import { GameState } from '../types/GameState';
import { useTouchControls } from '../hooks/useTouchControls';
import * as THREE from 'three';

interface ControlsProps {
  gameState: GameState;
  onStateUpdate: (updates: Partial<GameState>) => void;
}

export const Controls: React.FC<ControlsProps> = ({ gameState, onStateUpdate }) => {
  const { touchData, handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchControls();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const spacecraft = gameState.spacecraft || {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0)
      };

      const newPosition = spacecraft.position.clone();
      const newRotation = spacecraft.rotation.clone();
      let updates: Partial<GameState> = {};

      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newPosition.z -= 2;
          break;
        case 's':
        case 'arrowdown':
          newPosition.z += 2;
          break;
        case 'a':
        case 'arrowleft':
          newRotation.y += 0.1;
          break;
        case 'd':
        case 'arrowright':
          newRotation.y -= 0.1;
          break;
        case 'q':
          newRotation.z += 0.1;
          break;
        case 'e':
          newRotation.z -= 0.1;
          break;
        case 'shift':
          newPosition.y += 2;
          break;
        case 'control':
          newPosition.y -= 2;
          break;
        case ' ':
          updates.hoverMode = !gameState.hoverMode;
          break;
        case 'f':
          updates.cloakingActive = !gameState.cloakingActive;
          updates.cloakingIntensity = !gameState.cloakingActive ? 0.8 : 0;
          break;
        case 'r':
          // Reset position
          newPosition.set(0, 0, 0);
          newRotation.set(0, 0, 0);
          updates.velocity = 0;
          break;
        case 'tab':
          event.preventDefault();
          updates.sensorMode = gameState.sensorMode === 'radar' ? 'thermal' : 'radar';
          break;
      }

      updates.spacecraft = {
        position: newPosition,
        rotation: newRotation
      };

      onStateUpdate(updates);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Handle key release events if needed
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, onStateUpdate]);

  // Touch controls effect
  useEffect(() => {
    if (touchData.active) {
      const spacecraft = gameState.spacecraft || {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0)
      };

      const newRotation = spacecraft.rotation.clone();
      newRotation.y += touchData.deltaX * 0.01;
      newRotation.x += touchData.deltaY * 0.01;

      onStateUpdate({
        spacecraft: {
          position: spacecraft.position,
          rotation: newRotation
        }
      });
    }
  }, [touchData, gameState.spacecraft, onStateUpdate]);

  // Toggle functions
  const toggleCloaking = useCallback(() => {
    onStateUpdate({
      cloakingActive: !gameState.cloakingActive,
      cloakingIntensity: !gameState.cloakingActive ? 0.8 : 0
    });
  }, [gameState.cloakingActive, onStateUpdate]);

  const togglePlasma = useCallback(() => {
    onStateUpdate({
      plasmaActive: !gameState.plasmaActive,
      thrustLevel: !gameState.plasmaActive ? 1.0 : 0
    });
  }, [gameState.plasmaActive, onStateUpdate]);

  const resetPosition = useCallback(() => {
    onStateUpdate({
      spacecraft: {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0)
      },
      velocity: 0
    });
  }, [onStateUpdate]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Touch Control Area */}
      <div
        className="absolute inset-0 pointer-events-auto lg:pointer-events-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Mobile Controls */}
      <div className="lg:hidden">
        {/* Left Control Pad */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute bottom-8 left-8 pointer-events-auto"
        >
          <div className="bg-black/50 border border-cyan-400/30 rounded-full p-4 backdrop-blur-sm">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full" />
              <div className="absolute inset-4 border border-cyan-400/20 rounded-full" />
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
              
              {/* Direction indicators */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-cyan-400 text-xs">↑</div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-cyan-400 text-xs">↓</div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-cyan-400 text-xs">←</div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-cyan-400 text-xs">→</div>
            </div>
          </div>
          <div className="text-center text-xs text-cyan-400 mt-2">FLIGHT</div>
        </motion.div>

        {/* Right Action Buttons */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute bottom-8 right-8 pointer-events-auto"
        >
          <div className="flex flex-col gap-3">
            <button
              onClick={toggleCloaking}
              className={`w-16 h-16 rounded-full border-2 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                gameState.cloakingActive 
                  ? 'bg-cyan-400/20 border-cyan-400' 
                  : 'bg-black/50 border-slate-600'
              }`}
            >
              {gameState.cloakingActive ? 
                <EyeOff className="w-6 h-6 text-cyan-400" /> : 
                <Eye className="w-6 h-6 text-slate-400" />
              }
            </button>
            
            <button
              onClick={togglePlasma}
              className={`w-16 h-16 rounded-full border-2 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                gameState.plasmaActive 
                  ? 'bg-blue-400/20 border-blue-400' 
                  : 'bg-black/50 border-slate-600'
              }`}
            >
              <Zap className={`w-6 h-6 ${gameState.plasmaActive ? 'text-blue-400' : 'text-slate-400'}`} />
            </button>
            
            <button
              onClick={resetPosition}
              className="w-16 h-16 rounded-full border-2 bg-black/50 border-slate-600 backdrop-blur-sm transition-all duration-300 flex items-center justify-center hover:border-red-400"
            >
              <RotateCcw className="w-6 h-6 text-slate-400 hover:text-red-400" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Desktop Controls Indicator */}
      <div className="hidden lg:block absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-black/70 border border-cyan-400/50 rounded-lg px-6 py-3 backdrop-blur-sm"
        >
          <div className="text-cyan-400 text-xs font-mono text-center">
            WASD: Flight • F: Cloak • Space: Hover • R: Reset • Tab: Sensors
          </div>
        </motion.div>
      </div>
    </div>
  );
};
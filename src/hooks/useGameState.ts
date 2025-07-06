import { useState, useCallback } from 'react';
import { GameState } from '../types/GameState';
import * as THREE from 'three';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    spacecraft: {
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0)
    },
    velocity: 0,
    cloakingActive: false,
    cloakingIntensity: 0,
    plasmaActive: true,
    thrustLevel: 1.0,
    powerLevel: 100,
    hoverMode: false,
    missionActive: false,
    missionType: 'reconnaissance',
    sensorMode: 'radar',
    gameMode: 'menu'
  });

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  return {
    gameState,
    updateGameState
  };
};
import * as THREE from 'three';

export interface GameState {
  spacecraft?: {
    position: THREE.Vector3;
    rotation: THREE.Euler;
  };
  velocity?: number;
  cloakingActive: boolean;
  cloakingIntensity: number;
  plasmaActive: boolean;
  thrustLevel: number;
  powerLevel?: number;
  hoverMode?: boolean;
  missionActive: boolean;
  missionType?: string;
  sensorMode?: 'radar' | 'thermal' | 'quantum';
  gameMode: 'menu' | 'flight' | 'mission';
}
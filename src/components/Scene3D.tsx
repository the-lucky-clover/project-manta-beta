import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { TR3BSpacecraft } from './TR3BSpacecraft';
import { PlasmaEffects } from './PlasmaEffects';
import { Environment3D } from './Environment3D';
import { CloakingField } from './CloakingField';
import { GameState } from '../types/GameState';

interface Scene3DProps {
  gameState: GameState;
  performanceLevel: number;
  onQualityChange: (level: number) => void;
}

export const Scene3D: React.FC<Scene3DProps> = ({ 
  gameState, 
  performanceLevel,
  onQualityChange 
}) => {
  const { camera, gl } = useThree();
  const sceneRef = useRef<THREE.Group>(null);
  
  // Camera control for flight dynamics
  useFrame((state, delta) => {
    if (gameState.spacecraft && sceneRef.current) {
      const spacecraft = gameState.spacecraft;
      
      // Smooth camera following
      const targetPosition = new THREE.Vector3(
        spacecraft.position.x,
        spacecraft.position.y + 5,
        spacecraft.position.z + 10
      );
      
      camera.position.lerp(targetPosition, delta * 2);
      camera.lookAt(spacecraft.position.x, spacecraft.position.y, spacecraft.position.z);
      
      // Update scene rotation for atmospheric effects
      sceneRef.current.rotation.y += delta * 0.001;
    }
  });

  // Adaptive quality based on performance
  const qualitySettings = useMemo(() => ({
    starCount: performanceLevel > 3 ? 5000 : performanceLevel > 2 ? 3000 : 1500,
    shadowMapSize: performanceLevel > 3 ? 2048 : performanceLevel > 2 ? 1024 : 512,
    enablePostProcessing: performanceLevel > 2,
    enableVolumetricLighting: performanceLevel > 3
  }), [performanceLevel]);

  return (
    <group ref={sceneRef}>
      {/* Lighting Setup */}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[100, 100, 50]}
        intensity={0.5}
        castShadow={performanceLevel > 2}
        shadow-mapSize-width={qualitySettings.shadowMapSize}
        shadow-mapSize-height={qualitySettings.shadowMapSize}
      />
      
      {/* Environment */}
      <Stars 
        count={qualitySettings.starCount}
        depth={500}
        factor={8}
        saturation={0.5}
        fade={true}
      />
      
      <Environment preset="night" />
      
      {/* 3D Environment */}
      <Environment3D 
        missionType={gameState.missionType}
        performanceLevel={performanceLevel}
      />
      
      {/* TR-3B Spacecraft */}
      <TR3BSpacecraft 
        position={gameState.spacecraft?.position || new THREE.Vector3(0, 0, 0)}
        rotation={gameState.spacecraft?.rotation || new THREE.Euler(0, 0, 0)}
        cloakingActive={gameState.cloakingActive}
        plasmaActive={gameState.plasmaActive}
        performanceLevel={performanceLevel}
      />
      
      {/* Plasma Effects */}
      {gameState.plasmaActive && (
        <PlasmaEffects 
          spacecraftPosition={gameState.spacecraft?.position || new THREE.Vector3(0, 0, 0)}
          intensity={gameState.thrustLevel}
          performanceLevel={performanceLevel}
        />
      )}
      
      {/* Cloaking Field */}
      {gameState.cloakingActive && (
        <CloakingField 
          spacecraftPosition={gameState.spacecraft?.position || new THREE.Vector3(0, 0, 0)}
          cloakingIntensity={gameState.cloakingIntensity}
          performanceLevel={performanceLevel}
        />
      )}
    </group>
  );
};
import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface Environment3DProps {
  missionType: string;
  performanceLevel: number;
}

export const Environment3D: React.FC<Environment3DProps> = ({
  missionType,
  performanceLevel
}) => {
  // Generate terrain based on mission type
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1000, 1000, 64, 64);
    const positions = geometry.attributes.position.array as Float32Array;
    
    // Generate height map based on mission type
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      
      let height = 0;
      
      switch (missionType) {
        case 'urban':
          // City-like terrain with buildings
          height = Math.sin(x * 0.01) * Math.cos(y * 0.01) * 20 +
                  Math.random() * 50; // Building heights
          break;
        case 'deepspace':
          // Asteroid field
          height = Math.sin(x * 0.005) * Math.cos(y * 0.005) * 5;
          break;
        default:
          // Mountain terrain
          height = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 30 +
                  Math.sin(x * 0.1) * Math.cos(y * 0.1) * 10;
      }
      
      positions[i + 2] = height;
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, [missionType]);

  // Terrain material
  const terrainMaterial = useMemo(() => {
    return new THREE.MeshLambertMaterial({
      color: missionType === 'urban' ? 0x444444 : 
             missionType === 'deepspace' ? 0x333333 : 0x228b22,
      wireframe: performanceLevel < 2
    });
  }, [missionType, performanceLevel]);

  // Generate atmospheric particles for different environments
  const AtmosphericParticles = useMemo(() => {
    if (performanceLevel < 2) return null;
    
    const particleCount = performanceLevel > 3 ? 1000 : 500;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = Math.random() * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    
    return (
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.5}
          color={missionType === 'deepspace' ? '#ffffff' : '#aaaaaa'}
          transparent
          opacity={0.6}
        />
      </points>
    );
  }, [missionType, performanceLevel]);

  return (
    <group>
      {/* Terrain */}
      <mesh 
        geometry={terrainGeometry}
        material={terrainMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -100, 0]}
        receiveShadow
      />
      
      {/* Atmospheric particles */}
      {AtmosphericParticles}
      
      {/* Mission-specific elements */}
      {missionType === 'urban' && (
        // City lights
        <group>
          {[...Array(50)].map((_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 800,
              -90 + Math.random() * 60,
              (Math.random() - 0.5) * 800
            ]}>
              <boxGeometry args={[5, Math.random() * 40 + 10, 5]} />
              <meshBasicMaterial color={0x444444} />
            </mesh>
          ))}
        </group>
      )}
      
      {missionType === 'deepspace' && (
        // Asteroids
        <group>
          {[...Array(20)].map((_, i) => (
            <mesh key={i} position={[
              (Math.random() - 0.5) * 2000,
              (Math.random() - 0.5) * 500,
              (Math.random() - 0.5) * 2000
            ]}>
              <dodecahedronGeometry args={[Math.random() * 20 + 5]} />
              <meshLambertMaterial color={0x666666} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
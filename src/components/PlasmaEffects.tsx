import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface PlasmaEffectsProps {
  spacecraftPosition: THREE.Vector3;
  intensity: number;
  performanceLevel: number;
}

export const PlasmaEffects: React.FC<PlasmaEffectsProps> = ({
  spacecraftPosition,
  intensity,
  performanceLevel
}) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  // Adaptive particle count based on performance
  const particleCount = useMemo(() => {
    return performanceLevel > 3 ? 2000 : performanceLevel > 2 ? 1000 : 500;
  }, [performanceLevel]);

  // Generate plasma particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const ringIndex = Math.floor(Math.random() * 3); // 3 plasma rings
      const ringPositions = [
        [0, 15], // Top vertex
        [-13, -7.5], // Bottom left
        [13, -7.5]  // Bottom right
      ];
      
      const [ringX, ringY] = ringPositions[ringIndex];
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 3; // Ring radius variation
      
      positions[i * 3] = ringX + Math.cos(angle) * radius;
      positions[i * 3 + 1] = ringY + Math.sin(angle) * radius;
      positions[i * 3 + 2] = -1 + Math.random() * 2;
    }
    
    return positions;
  }, [particleCount]);

  // Plasma particle velocities
  const particleVelocities = useMemo(() => {
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    return velocities;
  }, [particleCount]);

  // Animation loop
  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        // Update particle positions with circular motion
        const time = state.clock.elapsedTime;
        const speed = intensity * 2;
        
        const x = positions[i * 3];
        const y = positions[i * 3 + 1];
        const centerX = x > 0 ? 13 : x < -5 ? -13 : 0;
        const centerY = x > 0 || x < -5 ? -7.5 : 15;
        
        const angle = Math.atan2(y - centerY, x - centerX) + delta * speed;
        const radius = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        
        positions[i * 3] = centerX + Math.cos(angle) * radius;
        positions[i * 3 + 1] = centerY + Math.sin(angle) * radius;
        positions[i * 3 + 2] += particleVelocities[i * 3 + 2] * delta * 10;
        
        // Reset particles that drift too far
        if (Math.abs(positions[i * 3 + 2]) > 5) {
          positions[i * 3 + 2] = -1;
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={spacecraftPosition}>
      <Points ref={particlesRef} positions={particlePositions}>
        <PointMaterial
          size={0.1}
          color="#00aaff"
          transparent
          opacity={intensity * 0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </Points>
      
      {/* Additional plasma glow effect */}
      {[
        [0, 15, -1], // Top vertex
        [-13, -7.5, -1], // Bottom left
        [13, -7.5, -1]  // Bottom right
      ].map((pos, index) => (
        <mesh key={index} position={pos}>
          <sphereGeometry args={[8, 16, 16]} />
          <meshBasicMaterial
            color="#0088ff"
            transparent
            opacity={intensity * 0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};
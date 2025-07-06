import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CloakingFieldProps {
  spacecraftPosition: THREE.Vector3;
  cloakingIntensity: number;
  performanceLevel: number;
}

export const CloakingField: React.FC<CloakingFieldProps> = ({
  spacecraftPosition,
  cloakingIntensity,
  performanceLevel
}) => {
  const fieldRef = useRef<THREE.Mesh>(null);

  // Cloaking field geometry - larger sphere around spacecraft
  const fieldGeometry = useMemo(() => {
    return new THREE.SphereGeometry(40, 32, 32);
  }, []);

  // Advanced cloaking shader material
  const cloakingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cloakIntensity: { value: cloakingIntensity },
        viewVector: { value: new THREE.Vector3() },
        refractionRatio: { value: 0.85 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;
        varying vec3 vViewDirection;
        
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          vWorldNormal = normalize(normalMatrix * normal);
          vViewDirection = normalize(worldPosition.xyz - cameraPosition);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float cloakIntensity;
        uniform vec3 viewVector;
        uniform float refractionRatio;
        
        varying vec3 vWorldPosition;
        varying vec3 vWorldNormal;
        varying vec3 vViewDirection;
        
        void main() {
          vec3 normal = normalize(vWorldNormal);
          vec3 viewDir = normalize(vViewDirection);
          
          // Refraction effect
          vec3 refracted = refract(viewDir, normal, refractionRatio);
          
          // Chromatic aberration
          float r_offset = 0.01;
          float g_offset = 0.0;
          float b_offset = -0.01;
          
          // Shimmer effect
          float shimmer = sin(time * 12.0 + vWorldPosition.x * 0.1 + vWorldPosition.y * 0.1) * 0.1;
          
          // Distortion based on viewing angle
          float fresnel = pow(1.0 - abs(dot(normal, -viewDir)), 2.0);
          
          vec3 color = vec3(0.0, 0.1, 0.2) + shimmer * vec3(0.1, 0.2, 0.3);
          
          // Heat mirage effect
          float distortion = sin(time * 8.0 + vWorldPosition.y * 0.05) * 0.02;
          color += distortion * vec3(0.05, 0.05, 0.1);
          
          float alpha = cloakIntensity * fresnel * 0.3;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending
    });
  }, [cloakingIntensity]);

  // Animation loop
  useFrame((state, delta) => {
    if (fieldRef.current) {
      fieldRef.current.position.copy(spacecraftPosition);
      
      // Update shader uniforms
      (cloakingMaterial as any).uniforms.time.value = state.clock.elapsedTime;
      (cloakingMaterial as any).uniforms.cloakIntensity.value = cloakingIntensity;
      
      // Subtle rotation for dynamic field effect
      fieldRef.current.rotation.y += delta * 0.1;
      fieldRef.current.rotation.x += delta * 0.05;
    }
  });

  if (cloakingIntensity <= 0) return null;

  return (
    <mesh
      ref={fieldRef}
      geometry={fieldGeometry}
      material={cloakingMaterial}
    />
  );
};
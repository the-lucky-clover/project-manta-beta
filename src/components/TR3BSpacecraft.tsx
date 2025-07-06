import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';

interface TR3BSpacecraftProps {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  cloakingActive: boolean;
  plasmaActive: boolean;
  performanceLevel: number;
}

export const TR3BSpacecraft: React.FC<TR3BSpacecraftProps> = ({
  position,
  rotation,
  cloakingActive,
  plasmaActive,
  performanceLevel
}) => {
  const meshRef = useRef<Mesh>(null);
  const plasmaRingRefs = useRef<Mesh[]>([]);

  // TR-3B Geometry - Triangular hull
  const hullGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Create triangular hull profile
    shape.moveTo(0, 30); // Top vertex
    shape.lineTo(-26, -15); // Bottom left
    shape.lineTo(26, -15); // Bottom right
    shape.lineTo(0, 30); // Close triangle
    
    const extrudeSettings = {
      depth: 3,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 1,
      bevelThickness: 0.5
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  // Metamaterial hull shader
  const hullMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cloakIntensity: { value: cloakingActive ? 0.8 : 0.0 },
        metallic: { value: 0.9 },
        roughness: { value: 0.1 },
        baseColor: { value: new THREE.Color(0x1a1a2e) }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          vNormal = normalize(normalMatrix * normal);
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float cloakIntensity;
        uniform float metallic;
        uniform float roughness;
        uniform vec3 baseColor;
        
        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vec3 color = baseColor;
          
          // Metamaterial effect
          float metalPattern = sin(vUv.x * 50.0) * sin(vUv.y * 50.0) * 0.1;
          color += metalPattern * vec3(0.3, 0.3, 0.4);
          
          // Cloaking shimmer
          if (cloakIntensity > 0.0) {
            float shimmer = sin(time * 10.0 + vWorldPosition.x * 0.1) * 0.3;
            color = mix(color, vec3(0.0, 0.0, 0.0), cloakIntensity * 0.8 + shimmer * 0.2);
          }
          
          // Basic lighting
          vec3 normal = normalize(vNormal);
          vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
          float NdotL = max(dot(normal, lightDir), 0.0);
          
          color *= 0.3 + 0.7 * NdotL;
          
          gl_FragColor = vec4(color, 1.0 - cloakIntensity * 0.5);
        }
      `,
      transparent: true
    });
  }, [cloakingActive]);

  // Plasma ring geometry
  const plasmaRingGeometry = useMemo(() => {
    return new THREE.TorusGeometry(7.6, 0.5, 8, 32);
  }, []);

  // Plasma ring material
  const plasmaRingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        plasmaPower: { value: plasmaActive ? 1.0 : 0.0 },
        rotationSpeed: { value: 50.0 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        
        void main() {
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float plasmaPower;
        uniform float rotationSpeed;
        
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        
        void main() {
          float ringDistance = length(vUv - 0.5) * 2.0;
          float plasmaDensity = smoothstep(0.8, 1.0, ringDistance) * smoothstep(1.2, 1.0, ringDistance);
          
          vec3 mercuryGlow = mix(
            vec3(0.8, 0.9, 1.0), 
            vec3(0.2, 0.6, 1.0), 
            plasmaDensity
          );
          
          float rotation = sin(time * rotationSpeed + vUv.x * 20.0) * 0.5 + 0.5;
          mercuryGlow *= plasmaPower * rotation;
          
          float alpha = plasmaDensity * plasmaPower;
          
          gl_FragColor = vec4(mercuryGlow, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, [plasmaActive]);

  // Animation loop
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.copy(position);
      meshRef.current.rotation.copy(rotation);
      
      // Update material uniforms
      (hullMaterial as any).uniforms.time.value = state.clock.elapsedTime;
      (hullMaterial as any).uniforms.cloakIntensity.value = cloakingActive ? 0.8 : 0.0;
      
      (plasmaRingMaterial as any).uniforms.time.value = state.clock.elapsedTime;
      (plasmaRingMaterial as any).uniforms.plasmaPower.value = plasmaActive ? 1.0 : 0.0;
    }

    // Animate plasma rings
    plasmaRingRefs.current.forEach((ring, index) => {
      if (ring) {
        ring.rotation.z += delta * (2 + index * 0.5);
      }
    });
  });

  return (
    <group>
      {/* Main Hull */}
      <mesh 
        ref={meshRef}
        geometry={hullGeometry}
        material={hullMaterial}
        castShadow
        receiveShadow
      />
      
      {/* Plasma Rings - positioned at each vertex */}
      {[
        [0, 15, -1], // Top vertex
        [-13, -7.5, -1], // Bottom left
        [13, -7.5, -1]  // Bottom right
      ].map((pos, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) plasmaRingRefs.current[index] = el;
          }}
          position={[pos[0] + position.x, pos[1] + position.y, pos[2] + position.z]}
          geometry={plasmaRingGeometry}
          material={plasmaRingMaterial}
        />
      ))}
    </group>
  );
};
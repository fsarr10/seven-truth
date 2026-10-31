'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Vinyl3D({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Particules d'onde sonore dorées
  const particleCount = isMobile ? 350 : 1200;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const goldColor = new THREE.Color('#e8b23a');
    const neonPurple = new THREE.Color('#9d4edd');

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 1.2;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const mixed = goldColor.clone().lerp(neonPurple, Math.random() * 0.3);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [particleCount]);

  // Animation de rotation fluide et ondulation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.65;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.15;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Disque vinyle extérieur (Sillon noir brillant) */}
      <mesh rotation={[-Math.PI / 2.3, 0, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.06, 64]} />
        <meshStandardMaterial
          color="#0b0b0f"
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* Sillons concentriques dorés */}
      <mesh rotation={[-Math.PI / 2.3, 0, 0]} position={[0, 0.035, 0]}>
        <ringGeometry args={[0.9, 2.15, 64]} />
        <meshStandardMaterial
          color="#181822"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Label central doré "7T" */}
      <mesh rotation={[-Math.PI / 2.3, 0, 0]} position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.02, 48]} />
        <meshStandardMaterial
          color="#e8b23a"
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Centre vinyle trou */}
      <mesh rotation={[-Math.PI / 2.3, 0, 0]} position={[0, 0.055, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
        <meshStandardMaterial color="#050507" />
      </mesh>

      {/* Onde sonore en particules réactives */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isMobile ? 0.045 : 0.035}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

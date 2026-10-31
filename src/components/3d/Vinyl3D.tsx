'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Vinyl3D({ isMobile }: { isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const vinylRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const outerRingsRef = useRef<THREE.Group>(null);

  // Particules sonores dynamiques et néon
  const particleCount = isMobile ? 320 : 900;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const goldColor = new THREE.Color('#f3ba49');
    const purpleColor = new THREE.Color('#a855f7');
    const cyanColor = new THREE.Color('#06b6d4');

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      const ySpread = (Math.random() - 0.5) * 1.4;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = ySpread;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      // Dégradé tri-chromatique luxe
      const rand = Math.random();
      const mixed = rand < 0.6
        ? goldColor.clone().lerp(purpleColor, rand)
        : purpleColor.clone().lerp(cyanColor, (rand - 0.6) * 2.5);

      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [particleCount]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Rotation du vinyle et flottement vertical organique
    if (vinylRef.current) {
      vinylRef.current.rotation.y += delta * 0.75;
      vinylRef.current.position.y = Math.sin(t * 1.8) * 0.09;
    }

    // Effet d'inertie réactif à la souris
    if (groupRef.current) {
      const targetRotX = (state.pointer.y * Math.PI) / 9;
      const targetRotZ = -(state.pointer.x * Math.PI) / 9;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 3);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, delta * 3);
    }

    // Ondes orbitales de particules
    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * 0.25;
      particlesRef.current.rotation.z = Math.sin(t * 0.5) * 0.08;
    }

    // Anneaux extérieurs pulsants
    if (outerRingsRef.current) {
      outerRingsRef.current.rotation.y += delta * 0.4;
      const scale = 1 + Math.sin(t * 2) * 0.03;
      outerRingsRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef}>
      {/* GROUPE PRINCIPAL DU DISQUE VINYLE */}
      <group ref={vinylRef}>
        {/* Corps du vinyle (Obsidienne profonde avec reflets) */}
        <mesh rotation={[-Math.PI / 2.3, 0, 0]}>
          <cylinderGeometry args={[2.3, 2.3, 0.06, 64]} />
          <meshStandardMaterial
            color="#09090e"
            roughness={0.18}
            metalness={0.92}
          />
        </mesh>

        {/* Sillons concentriques microsillon avec reflet or subtil */}
        <mesh rotation={[-Math.PI / 2.3, 0, 0]} position={[0, 0.035, 0]}>
          <ringGeometry args={[0.92, 2.25, 64]} />
          <meshStandardMaterial
            color="#14141e"
            roughness={0.35}
            metalness={0.8}
          />
        </mesh>

        {/* Macaron central or champagne poli */}
        <mesh rotation={[-Math.PI / 2.3, 0, 0]} position={[0, 0.045, 0]}>
          <cylinderGeometry args={[0.82, 0.82, 0.02, 64]} />
          <meshStandardMaterial
            color="#f3ba49"
            roughness={0.2}
            metalness={0.88}
          />
        </mesh>

        {/* Anneau doré d'accent intérieur */}
        <mesh rotation={[-Math.PI / 2.3, 0, 0]} position={[0, 0.055, 0]}>
          <ringGeometry args={[0.72, 0.78, 48]} />
          <meshBasicMaterial color="#ffd875" />
        </mesh>

        {/* Centre trou vinyle */}
        <mesh rotation={[-Math.PI / 2.3, 0, 0]} position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 32]} />
          <meshBasicMaterial color="#020204" />
        </mesh>
      </group>

      {/* ANNEAUX CYBER EXTÉRIEURS */}
      <group ref={outerRingsRef} rotation={[-Math.PI / 2.3, 0, 0]}>
        <mesh position={[0, 0, -0.1]}>
          <ringGeometry args={[2.55, 2.58, 64]} />
          <meshBasicMaterial color="#f3ba49" transparent opacity={0.35} />
        </mesh>
        <mesh position={[0, 0, -0.15]}>
          <ringGeometry args={[2.85, 2.87, 64]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.25} />
        </mesh>
      </group>

      {/* NUAGE DE PARTICULES ORBITALES REACTIVES */}
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
          size={isMobile ? 0.042 : 0.035}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

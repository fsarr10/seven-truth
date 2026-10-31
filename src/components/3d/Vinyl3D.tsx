'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Platine Vinyle Studio Haute Fidélité (Direct Drive Audiophile Deck)
 * Rendu physique tangible, matériel analogique, sans artifices ni clichés IA.
 */
export function Vinyl3D({ isMobile }: { isMobile: boolean }) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const platterRef = useRef<THREE.Group>(null);
  const tonearmRef = useRef<THREE.Group>(null);
  const vuLedsRef = useRef<THREE.InstancedMesh>(null);

  // VU-Meter physique : 12 segments LED stéréo (vert -> ambre -> rouge studio)
  const ledCount = 24;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Rotation analogique de la platine vinyle (vitesse 33 tours/min réaliste)
    if (platterRef.current) {
      platterRef.current.rotation.y += delta * 1.8;
    }

    // Micro-vibration organique du bras de lecture (needle tracking)
    if (tonearmRef.current) {
      tonearmRef.current.rotation.y = -0.38 + Math.sin(t * 1.5) * 0.008;
      tonearmRef.current.position.y = 0.28 + Math.sin(t * 3.2) * 0.002;
    }

    // Effet d'inertie réactif à la souris (inclinaison physique de la platine)
    if (rootGroupRef.current) {
      const targetRotX = 0.55 + (state.pointer.y * Math.PI) / 14;
      const targetRotY = (state.pointer.x * Math.PI) / 12;
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(rootGroupRef.current.rotation.x, targetRotX, delta * 3);
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(rootGroupRef.current.rotation.y, targetRotY, delta * 3);
    }

    // Animation du VU-mètre analogique (niveaux sonores qui pulsent au rythme de la musique)
    if (vuLedsRef.current) {
      const levelLeft = Math.abs(Math.sin(t * 4.5) * 0.7 + Math.sin(t * 8.2) * 0.3);
      const levelRight = Math.abs(Math.cos(t * 4.2) * 0.65 + Math.sin(t * 7.1) * 0.35);

      for (let i = 0; i < 12; i++) {
        const threshold = i / 12;
        const activeL = levelLeft >= threshold ? 1 : 0.15;
        const activeR = levelRight >= threshold ? 1 : 0.15;

        // Canal gauche
        dummy.position.set(-1.4 + i * 0.07, 0.2, 1.45);
        dummy.scale.set(0.04, 0.02, 0.06);
        dummy.updateMatrix();
        vuLedsRef.current.setMatrixAt(i, dummy.matrix);

        // Canal droit
        dummy.position.set(-1.4 + i * 0.07, 0.16, 1.45);
        dummy.scale.set(0.04, 0.02, 0.06);
        dummy.updateMatrix();
        vuLedsRef.current.setMatrixAt(i + 12, dummy.matrix);
      }
      vuLedsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.35, 0]} rotation={[0.55, 0, 0]}>
      {/* 1. CHÂSSIS DE LA PLATINE (ALUMINIUM BROSSÉ & BOIS SOMBRE) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.32, 3.2]} />
        <meshStandardMaterial
          color="#121318"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Plaque supérieure avec biseau usiné */}
      <mesh position={[0, 0.165, 0]}>
        <boxGeometry args={[3.72, 0.015, 3.12]} />
        <meshStandardMaterial
          color="#1b1c23"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* 4 Pieds amortisseurs en caoutchouc haute densité */}
      {[
        [-1.65, -0.2, -1.35],
        [1.65, -0.2, -1.35],
        [-1.65, -0.2, 1.35],
        [1.65, -0.2, 1.35],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.18, 0.22, 0.16, 24]} />
          <meshStandardMaterial color="#09090b" roughness={0.9} />
        </mesh>
      ))}

      {/* 2. ENSEMBLE PLATEAU & DISQUE ROTATIF */}
      <group position={[-0.45, 0.22, 0]}>
        {/* Puits central d'entraînement direct */}
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[1.56, 1.58, 0.08, 48]} />
          <meshStandardMaterial
            color="#2a2c38"
            roughness={0.2}
            metalness={0.95}
          />
        </mesh>

        {/* Bague crantée stroboscopique (points d'étalonnage 33/45 RPM) */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[1.55, 1.55, 0.04, 64]} />
          <meshStandardMaterial
            color="#e2e8f0"
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>

        {/* GROUPE ROTATIF (Feutrine + Disque Vinyle + Macaron) */}
        <group ref={platterRef}>
          {/* Feutrine antistatique (Slipmat noire) */}
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 0.02, 48]} />
            <meshStandardMaterial color="#1a1a20" roughness={0.95} />
          </mesh>

          {/* Disque Vinyle 33 Tours (Obsidienne brillante avec sillons acoustiques) */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[1.46, 1.46, 0.02, 64]} />
            <meshStandardMaterial
              color="#08080b"
              roughness={0.12}
              metalness={0.9}
            />
          </mesh>

          {/* Sillons microsillons gravés */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.072, 0]}>
            <ringGeometry args={[0.62, 1.44, 48]} />
            <meshStandardMaterial
              color="#13141b"
              roughness={0.4}
              metalness={0.65}
            />
          </mesh>

          {/* Macaron central du label SEVEN TRUTH (Or champagne & Sérigraphie) */}
          <mesh position={[0, 0.075, 0]}>
            <cylinderGeometry args={[0.54, 0.54, 0.015, 48]} />
            <meshStandardMaterial
              color="#d4af37"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>

          {/* Anneau intérieur du macaron */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.084, 0]}>
            <ringGeometry args={[0.42, 0.44, 32]} />
            <meshBasicMaterial color="#ffffff" opacity={0.6} transparent />
          </mesh>

          {/* Trou axe central */}
          <mesh position={[0, 0.085, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.03, 24]} />
            <meshStandardMaterial color="#030304" roughness={0.8} />
          </mesh>
        </group>

        {/* Axe métallique central fixe (Spindle argenté) */}
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} />
        </mesh>
      </group>

      {/* 3. BRAS DE LECTURE PROFESSIONNEL EN MÉTAL CHROMÉ */}
      <group position={[1.2, 0, -0.65]}>
        {/* Base cylindrique d'ancrage du bras */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.26, 0.3, 0.14, 24]} />
          <meshStandardMaterial color="#2d303e" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Pivot de cardan articulé */}
        <mesh position={[0, 0.33, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Contrepoids arrière en laiton */}
        <mesh position={[0.22, 0.33, -0.22]} rotation={[0, -Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.16, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* GROUPE BRAS & CELLULE (légèrement animé sur le sillon) */}
        <group ref={tonearmRef} position={[0, 0.33, 0]}>
          {/* Tube du bras en S / chrome */}
          <mesh position={[-0.65, -0.04, 0.55]} rotation={[0, -0.65, 0.06]}>
            <cylinderGeometry args={[0.02, 0.02, 1.4, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Porte-cellule (Headshell) */}
          <mesh position={[-1.15, -0.06, 0.98]} rotation={[0, -0.85, 0]}>
            <boxGeometry args={[0.08, 0.04, 0.16]} />
            <meshStandardMaterial color="#1a1c24" metalness={0.5} roughness={0.4} />
          </mesh>

          {/* Cellule Phono rouge studio (Shure / Ortofon style) */}
          <mesh position={[-1.18, -0.09, 1.02]}>
            <boxGeometry args={[0.06, 0.04, 0.08]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      </group>

      {/* 4. CONTRÔLES PHYSIQUES DE LA PLATINE (BOUTONS TACTILES) */}
      {/* Bouton Marche/Arrêt Start-Stop en aluminium usiné */}
      <mesh position={[-1.45, 0.18, 1.15]}>
        <cylinderGeometry args={[0.16, 0.16, 0.06, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Sélecteurs de vitesse 33 & 45 RPM */}
      <mesh position={[-1.45, 0.18, 0.72]}>
        <boxGeometry args={[0.12, 0.04, 0.08]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-1.45, 0.18, 0.54]}>
        <boxGeometry args={[0.12, 0.04, 0.08]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Tour stroboscopique avec LED rouge de précision (front-left) */}
      <mesh position={[-1.6, 0.24, -1.2]}>
        <cylinderGeometry args={[0.12, 0.15, 0.22, 16]} />
        <meshStandardMaterial color="#1e2230" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-1.6, 0.36, -1.2]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color="#ef4444"
          emissive="#ef4444"
          emissiveIntensity={1.8}
          roughness={0.2}
        />
      </mesh>

      {/* Curseur de Pitch professionnel (Fader gradué à droite) */}
      <mesh position={[1.45, 0.175, 0.55]}>
        <boxGeometry args={[0.14, 0.015, 0.9]} />
        <meshStandardMaterial color="#0f1117" roughness={0.7} />
      </mesh>
      <mesh position={[1.45, 0.2, 0.45]}>
        <boxGeometry args={[0.12, 0.04, 0.06]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Sérigraphie constructeur Seven Truth */}
      <mesh position={[0.4, 0.175, 1.3]}>
        <boxGeometry args={[0.9, 0.005, 0.18]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.9} />
      </mesh>

      {/* 5. VU-MÈTRE STÉRÉO ANALOGIQUE EN FAÇADE */}
      <instancedMesh
        ref={vuLedsRef}
        args={[undefined, undefined, ledCount]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={1.5}
          roughness={0.3}
        />
      </instancedMesh>
    </group>
  );
}

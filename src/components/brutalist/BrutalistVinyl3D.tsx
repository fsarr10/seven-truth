'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Vinyle 3D Éditorial & Brutaliste Seven Truth
 * Spécifications strictes : CylinderGeometry(1.6, 1.6, 0.035, 160), texture canvas 1024px,
 * étiquette rouge #d7261e, éclairage réactif à la souris, accélération au scroll.
 */
export function BrutalistVinyl3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Vérification du respect des préférences d'accessibilité
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    const container = containerRef.current;
    if (!container) return;

    // Test de support WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 1. GÉNÉRATION DE LA TEXTURE VINYLE SUR CANVAS 1024PX
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 1024;
    texCanvas.height = 1024;
    const ctx = texCanvas.getContext('2d');

    if (ctx) {
      const cx = 512;
      const cy = 512;

      // Fond vinyle noir d'encre #141312
      ctx.fillStyle = '#141312';
      ctx.fillRect(0, 0, 1024, 1024);

      // Centaines de microsillons concentriques
      for (let r = 180; r < 500; r += 2) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        const alpha = 0.02 + Math.random() * 0.05;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3 sillons plus marqués (séparations de pistes)
      [275, 360, 440].forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = '#090908';
        ctx.lineWidth = 4;
        ctx.stroke();
      });

      // Reflets lumineux en dégradé conique (faux reflets lustrés vinyle)
      try {
        const conicGrad = ctx.createConicGradient(Math.PI / 4, cx, cy);
        conicGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        conicGrad.addColorStop(0.2, 'rgba(0, 0, 0, 0.4)');
        conicGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.09)');
        conicGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.4)');
        conicGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
        ctx.fillStyle = conicGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 498, 0, Math.PI * 2);
        ctx.fill();
      } catch {
        // Fallback si createConicGradient non supporté sur anciens navigateurs
      }

      // Étiquette centrale rouge #d7261e
      ctx.beginPath();
      ctx.arc(cx, cy, 165, 0, Math.PI * 2);
      ctx.fillStyle = '#d7261e';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#f1eadd';
      ctx.stroke();

      // Filet intérieur crème
      ctx.beginPath();
      ctx.arc(cx, cy, 145, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(241, 234, 221, 0.4)';
      ctx.stroke();

      // Typographie de l'étiquette
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f1eadd';

      // « FACE A » en mono
      ctx.font = '700 18px "JetBrains Mono", monospace';
      ctx.fillText('FACE A', cx, cy - 85);

      // « SEVEN TRUTH » en Anton
      ctx.font = '900 48px Anton, Impact, sans-serif';
      ctx.fillText('SEVEN', cx, cy - 30);
      ctx.fillText('TRUTH', cx, cy + 20);

      // « THIÈS · SN · 33⅓ RPM » en mono
      ctx.font = '600 15px "JetBrains Mono", monospace';
      ctx.fillText('THIÈS · SN · 33⅓ RPM', cx, cy + 90);

      // Trou central du centreur (spindle hole)
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.fillStyle = '#121110';
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#f1eadd';
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(texCanvas);
    texture.anisotropy = 4;

    // 2. INITIALISATION DE LA SCÈNE THREE.JS
    const scene = new THREE.Scene();

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    const isMobileDevice = window.innerWidth < 768;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobileDevice ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.replaceChildren(renderer.domElement);

    // 3. GÉOMÉTRIE DU VINYLE (CylinderGeometry(1.6, 1.6, 0.035, 160))
    const geometry = new THREE.CylinderGeometry(1.6, 1.6, 0.035, 160);

    const faceMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.38,
      metalness: 0.35,
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x141312,
      roughness: 0.5,
      metalness: 0.2,
    });

    // Face supérieure, face inférieure et tranche
    const vinylMesh = new THREE.Mesh(geometry, [edgeMaterial, faceMaterial, faceMaterial]);
    vinylMesh.rotation.x = Math.PI / 3; // Incliné d'environ 60°
    scene.add(vinylMesh);

    // 4. ÉCLAIRAGE : Ambiante, directionnelle chaude, ponctuelle réactive souris
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const warmDirLight = new THREE.DirectionalLight(0xfff5e6, 1.8);
    warmDirLight.position.set(3, 4, 4);
    scene.add(warmDirLight);

    const mousePointLight = new THREE.PointLight(0xffffff, 2.2, 10);
    mousePointLight.position.set(0, 0, 4);
    scene.add(mousePointLight);

    // 5. VARIABLES DE CONTRÔLE D'INTERACTION & SCROLL
    let baseSpinSpeed = prefersReducedMotion ? 0.3 : 0.85;
    let scrollSpinBoost = 0;
    let lastScrollY = window.scrollY;
    let targetRotX = Math.PI / 3;
    let targetRotY = 0;
    let isVisible = true;
    let reqId: number;

    // Détection de visibilité (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        isVisible = e.isIntersecting;
      });
    }, { threshold: 0.05 });
    observer.observe(container);

    // Détection de la souris (desktop)
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotX = (Math.PI / 3) + ny * 0.25;
      targetRotY = nx * 0.35;

      mousePointLight.position.set(nx * 3, ny * 3, 3.8);
    };

    // Détection du touch (mobile swipe / drag)
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouching = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isTouching = true;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0 || !container) return;
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      const nx = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);

      const clampedX = Math.max(-1.5, Math.min(1.5, nx));
      const clampedY = Math.max(-1.5, Math.min(1.5, ny));

      targetRotX = (Math.PI / 3) + clampedY * 0.3;
      targetRotY = clampedX * 0.4;

      mousePointLight.position.set(clampedX * 3, clampedY * 3, 3.8);

      // Impulsion de rotation au glissement du doigt
      const deltaX = touch.clientX - touchStartX;
      touchStartX = touch.clientX;
      scrollSpinBoost += Math.abs(deltaX) * 0.02;
    };

    const onTouchEnd = () => {
      isTouching = false;
    };

    // Détection du gyroscope / inclinaison du smartphone (mobile)
    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: gauche/droite (-90 à 90)
        // beta: avant/arrière (-180 à 180)
        const gamma = Math.max(-35, Math.min(35, e.gamma));
        const beta = Math.max(20, Math.min(70, e.beta));

        const normX = gamma / 35;
        const normY = (beta - 45) / 25;

        targetRotY = normX * 0.35;
        targetRotX = (Math.PI / 3) + normY * 0.25;

        mousePointLight.position.set(normX * 3, normY * 3, 3.8);
      }
    };

    // Détection du scroll (accélération de rotation sur desktop et mobile)
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      scrollSpinBoost += delta * 0.008;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    // Redimensionnement réactif
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 6. BOUCLE DE RENDU 60FPS
    let lastTime = performance.now();
    const animate = (time: number) => {
      reqId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) return;

      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Rotation continue + impulsion du scroll et touch
      const currentSpeed = baseSpinSpeed + scrollSpinBoost;
      vinylMesh.rotation.y += currentSpeed * deltaSeconds;

      // Amortissement de l'élan de rotation
      scrollSpinBoost = Math.max(0, scrollSpinBoost - deltaSeconds * 1.8);

      // Inertie de suivi souris / gyroscope / touch
      vinylMesh.rotation.x = THREE.MathUtils.lerp(vinylMesh.rotation.x, targetRotX, deltaSeconds * 4.0);
      vinylMesh.rotation.z = THREE.MathUtils.lerp(vinylMesh.rotation.z, -targetRotY * 0.5, deltaSeconds * 4.0);

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      motionQuery.removeEventListener('change', motionHandler);
      observer.disconnect();
      renderer.dispose();
      geometry.dispose();
      texture.dispose();
    };
  }, [prefersReducedMotion]);

  // REPLI SANS WEBGL AVEC ROTATION CSS FLUIDE
  if (!hasWebGL) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border-[1.5px] border-[#121110] relative flex items-center justify-center shadow-2xl animate-spin"
          style={{
            background: 'repeating-radial-gradient(circle at center, #141312 0px, #141312 3px, #262422 4px, #141312 5px)',
            transform: 'rotateX(55deg)',
            animationDuration: '10s',
            animationTimingFunction: 'linear',
          }}
        >
          <div className="w-28 h-28 rounded-full bg-[#d7261e] border-[1.5px] border-[#f1eadd] flex flex-col items-center justify-center text-[#f1eadd] font-anton text-2xl">
            <span>7T</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[460px] md:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      aria-hidden="true"
    />
  );
}

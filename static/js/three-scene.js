/**
 * STARSHINE HAUTE 3D SUITE — LUSION-STYLE WEBGL EXPERIENCE
 * Powered by Three.js
 * Features:
 * 1. Background Cinematic 3D Canvas (Liquid gold rings, floating diamonds, gold dust particle cloud, scroll-reactive)
 * 2. Interactive 3D Luxury Timepiece Stage (Procedural PBR luxury watch, 360° orbit, exploded view, material switching, ticking tourbillon)
 * 3. 3D Perspective Tilt on Cards
 */

(function() {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!window.THREE || !isWebGLAvailable()) {
    console.warn("WebGL or Three.js not available. Using CSS luxury fallback.");
    return;
  }

  // =========================================================================
  // 1. FULL-VIEWPORT 3D BACKGROUND CANVAS
  // =========================================================================
  const bgCanvas = document.getElementById('webgl-bg-canvas');
  if (bgCanvas) {
    const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const bgScene = new THREE.Scene();
    const bgCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    bgCamera.position.z = 30;

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    bgScene.add(ambientLight);

    const goldLight1 = new THREE.PointLight(0xd4af37, 2.5, 80);
    goldLight1.position.set(20, 20, 15);
    bgScene.add(goldLight1);

    const blueLight = new THREE.PointLight(0x38bdf8, 1.2, 70);
    blueLight.position.set(-25, -20, 10);
    bgScene.add(blueLight);

    // Floating Gold Dust Particle Cloud
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 80;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: 0.01 + Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.015
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle Texture Canvas (Soft glowing gold sparkle)
    const sparkleCanvas = document.createElement('canvas');
    sparkleCanvas.width = 32;
    sparkleCanvas.height = 32;
    const sCtx = sparkleCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 245, 200, 1)');
    grad.addColorStop(0.3, 'rgba(212, 175, 55, 0.8)');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.arc(16, 16, 16, 0, Math.PI * 2);
    sCtx.fill();

    const particleTexture = new THREE.CanvasTexture(sparkleCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 1.2,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    bgScene.add(particleSystem);

    // Floating Luxury 3D Artifacts
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      thickness: 1.2
    });

    // 1. Torus Knot (Liquid Gold Ribbon)
    const knotGeo = new THREE.TorusKnotGeometry(4.5, 0.9, 120, 24, 2, 3);
    const goldKnot = new THREE.Mesh(knotGeo, goldMat);
    goldKnot.position.set(22, 10, -8);
    bgScene.add(goldKnot);

    // 2. Refractive Crystal Octahedron
    const octGeo = new THREE.OctahedronGeometry(4.2, 0);
    const crystalMesh = new THREE.Mesh(octGeo, glassMat);
    crystalMesh.position.set(-22, -8, -6);
    bgScene.add(crystalMesh);

    // 3. Floating Luxury Ring
    const ringGeo = new THREE.TorusGeometry(3.5, 0.4, 30, 100);
    const goldRing = new THREE.Mesh(ringGeo, goldMat);
    goldRing.position.set(-18, 14, -12);
    bgScene.add(goldRing);

    // Mouse Tracking with Inertia Damping
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Scroll Reactive Offset
    let scrollYOffset = 0;
    window.addEventListener('scroll', () => {
      scrollYOffset = window.scrollY * 0.015;
    });

    // Resize Handler
    window.addEventListener('resize', () => {
      bgCamera.aspect = window.innerWidth / window.innerHeight;
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    function animateBg() {
      requestAnimationFrame(animateBg);

      // Smooth camera lerp
      targetCameraX = mouseX * 4;
      targetCameraY = mouseY * 4;
      bgCamera.position.x += (targetCameraX - bgCamera.position.x) * 0.05;
      bgCamera.position.y += (targetCameraY - (bgCamera.position.y - scrollYOffset * 0.2)) * 0.05;
      bgCamera.lookAt(0, -scrollYOffset * 0.2, 0);

      // Rotate 3D artifacts
      goldKnot.rotation.x += 0.006;
      goldKnot.rotation.y += 0.008;

      crystalMesh.rotation.x -= 0.005;
      crystalMesh.rotation.y += 0.007;

      goldRing.rotation.x += 0.01;
      goldRing.rotation.z += 0.008;

      // Update particle positions
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3] += particleVelocities[i].x;

        if (positions[i * 3 + 1] > 40) {
          positions[i * 3 + 1] = -40;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      bgRenderer.render(bgScene, bgCamera);
    }
    animateBg();
  }

  // =========================================================================
  // 2. INTERACTIVE 3D LUXURY TIMEPIECE ATELIER STAGE
  // =========================================================================
  const stageCanvas = document.getElementById('interactive-3d-canvas');
  if (stageCanvas) {
    const parentContainer = stageCanvas.parentElement;
    let width = parentContainer.clientWidth || 550;
    let height = parentContainer.clientHeight || 550;

    const stageRenderer = new THREE.WebGLRenderer({ canvas: stageCanvas, alpha: true, antialias: true });
    stageRenderer.setSize(width, height);
    stageRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    stageRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    stageRenderer.toneMappingExposure = 1.3;

    const stageScene = new THREE.Scene();
    const stageCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    stageCamera.position.set(0, 0, 16);

    // Studio Lighting
    const stageAmbient = new THREE.AmbientLight(0xffffff, 0.6);
    stageScene.add(stageAmbient);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.8);
    keyLight.position.set(10, 15, 12);
    stageScene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xd4af37, 1.6);
    fillLight.position.set(-12, -8, 8);
    stageScene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 3.0, 30);
    rimLight.position.set(0, -12, -8);
    stageScene.add(rimLight);

    // Interactive Dynamic Spotlight that tracks mouse
    const interactiveSpot = new THREE.PointLight(0xfff0cc, 2.0, 40);
    interactiveSpot.position.set(0, 5, 10);
    stageScene.add(interactiveSpot);

    // Watch Master Group
    const watchGroup = new THREE.Group();
    stageScene.add(watchGroup);

    // Material Library
    const MATERIALS = {
      gold: {
        case: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.92, roughness: 0.18 }),
        dial: new THREE.MeshStandardMaterial({ color: 0x0f1117, metalness: 0.8, roughness: 0.3 }),
        hands: new THREE.MeshStandardMaterial({ color: 0xfef08a, metalness: 0.95, roughness: 0.1 }),
        crystal: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.94, opacity: 1, transparent: true, roughness: 0.05, ior: 1.52 }),
        gears: new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.95, roughness: 0.2 })
      },
      platinum: {
        case: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.12 }),
        dial: new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.25 }),
        hands: new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.95, roughness: 0.1 }),
        crystal: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.94, opacity: 1, transparent: true, roughness: 0.05, ior: 1.52 }),
        gears: new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 })
      },
      ceramic: {
        case: new THREE.MeshStandardMaterial({ color: 0x111217, metalness: 0.4, roughness: 0.1 }), // Jet black high-gloss ceramic
        dial: new THREE.MeshStandardMaterial({ color: 0x07080a, metalness: 0.85, roughness: 0.2 }),
        hands: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.1 }),
        crystal: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.94, opacity: 1, transparent: true, roughness: 0.05, ior: 1.52 }),
        gears: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.18 })
      },
      rosegold: {
        case: new THREE.MeshStandardMaterial({ color: 0xb76e79, metalness: 0.92, roughness: 0.16 }),
        dial: new THREE.MeshStandardMaterial({ color: 0x181416, metalness: 0.75, roughness: 0.3 }),
        hands: new THREE.MeshStandardMaterial({ color: 0xfbcfe8, metalness: 0.95, roughness: 0.1 }),
        crystal: new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.94, opacity: 1, transparent: true, roughness: 0.05, ior: 1.52 }),
        gears: new THREE.MeshStandardMaterial({ color: 0xb76e79, metalness: 0.95, roughness: 0.2 })
      }
    };

    let activeFinish = 'gold';

    // Build Timepiece Components (Procedural 3D Geometry)
    const parts = {};

    // 1. Main Bezel & Outer Case
    const bezelGeo = new THREE.CylinderGeometry(4.2, 4.4, 1.2, 64, 1, false);
    parts.bezel = new THREE.Mesh(bezelGeo, MATERIALS[activeFinish].case);
    parts.bezel.rotation.x = Math.PI / 2;
    watchGroup.add(parts.bezel);

    // Fluted Bezel Ring Accent
    const flutedGeo = new THREE.TorusGeometry(4.25, 0.18, 16, 64);
    parts.fluted = new THREE.Mesh(flutedGeo, MATERIALS[activeFinish].case);
    parts.fluted.position.z = 0.6;
    watchGroup.add(parts.fluted);

    // 2. Dial Face
    const dialGeo = new THREE.CylinderGeometry(3.8, 3.8, 0.15, 64);
    parts.dial = new THREE.Mesh(dialGeo, MATERIALS[activeFinish].dial);
    parts.dial.rotation.x = Math.PI / 2;
    parts.dial.position.z = 0.4;
    watchGroup.add(parts.dial);

    // Dial Indices (12 Hour markers)
    const indicesGroup = new THREE.Group();
    parts.dial.add(indicesGroup);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const batonGeo = new THREE.BoxGeometry(i % 3 === 0 ? 0.25 : 0.12, 0.7, 0.15);
      const baton = new THREE.Mesh(batonGeo, MATERIALS[activeFinish].hands);
      baton.position.set(Math.cos(angle) * 3.1, Math.sin(angle) * 3.1, 0.1);
      baton.rotation.z = angle + Math.PI / 2;
      indicesGroup.add(baton);
    }

    // 3. Tourbillon Cage & Exposed Skeleton Gears
    const tourbillonGroup = new THREE.Group();
    tourbillonGroup.position.set(0, -1.3, 0.5);
    watchGroup.add(tourbillonGroup);
    parts.tourbillon = tourbillonGroup;

    // Tourbillon outer ring
    const tourbRingGeo = new THREE.TorusGeometry(1.0, 0.08, 16, 32);
    const tourbRing = new THREE.Mesh(tourbRingGeo, MATERIALS[activeFinish].gears);
    tourbillonGroup.add(tourbRing);

    // Tourbillon inner 3-arm wheel
    const gearArmGeo = new THREE.BoxGeometry(1.8, 0.1, 0.06);
    for (let a = 0; a < 3; a++) {
      const arm = new THREE.Mesh(gearArmGeo, MATERIALS[activeFinish].gears);
      arm.rotation.z = (a / 3) * Math.PI;
      tourbillonGroup.add(arm);
    }

    // 4. Watch Hands (Hour & Minute & Second)
    const hourHandGeo = new THREE.BoxGeometry(0.2, 2.0, 0.08);
    const hourHand = new THREE.Mesh(hourHandGeo, MATERIALS[activeFinish].hands);
    hourHand.position.set(0, 0.7, 0.6);
    watchGroup.add(hourHand);
    parts.hourHand = hourHand;

    const minHandGeo = new THREE.BoxGeometry(0.14, 2.7, 0.08);
    const minHand = new THREE.Mesh(minHandGeo, MATERIALS[activeFinish].hands);
    minHand.position.set(0, 0.9, 0.65);
    watchGroup.add(minHand);
    parts.minHand = minHand;

    const secHandGeo = new THREE.BoxGeometry(0.06, 3.2, 0.05);
    const secHand = new THREE.Mesh(secHandGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    secHand.position.set(0, 1.1, 0.7);
    watchGroup.add(secHand);
    parts.secHand = secHand;

    // Center Cap
    const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 32);
    const cap = new THREE.Mesh(capGeo, MATERIALS[activeFinish].case);
    cap.rotation.x = Math.PI / 2;
    cap.position.z = 0.75;
    watchGroup.add(cap);
    parts.cap = cap;

    // 5. Crown (Winding knob)
    const crownGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 24);
    const crown = new THREE.Mesh(crownGeo, MATERIALS[activeFinish].case);
    crown.rotation.z = Math.PI / 2;
    crown.position.set(4.7, 0, 0);
    watchGroup.add(crown);
    parts.crown = crown;

    // 6. Sapphire Crystal Glass Cover
    const crystalGeo = new THREE.CylinderGeometry(4.0, 4.0, 0.12, 64);
    parts.crystal = new THREE.Mesh(crystalGeo, MATERIALS[activeFinish].crystal);
    parts.crystal.rotation.x = Math.PI / 2;
    parts.crystal.position.z = 0.85;
    watchGroup.add(parts.crystal);

    // 7. Top & Bottom Straps / Lugs
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85, metalness: 0.1 });
    const topStrapGeo = new THREE.BoxGeometry(2.6, 4.2, 0.4);
    const topStrap = new THREE.Mesh(topStrapGeo, strapMat);
    topStrap.position.set(0, 5.8, -0.2);
    watchGroup.add(topStrap);
    parts.topStrap = topStrap;

    const btmStrap = new THREE.Mesh(topStrapGeo, strapMat);
    btmStrap.position.set(0, -5.8, -0.2);
    watchGroup.add(btmStrap);
    parts.btmStrap = btmStrap;

    // Initial Tilt
    watchGroup.rotation.x = 0.3;
    watchGroup.rotation.y = -0.4;

    // Interactive Drag / Orbit Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };
    let isExploded = false;
    let autoSpin = true;

    stageCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      autoSpin = false;
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    stageCanvas.addEventListener('mousemove', (e) => {
      // Dynamic light movement
      const rect = stageCanvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width * 2 - 1;
      const ny = -(e.clientY - rect.top) / rect.height * 2 + 1;
      interactiveSpot.position.x = nx * 8;
      interactiveSpot.position.y = ny * 8;

      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      rotationVelocity.x = deltaY * 0.005;
      rotationVelocity.y = deltaX * 0.005;

      watchGroup.rotation.x += rotationVelocity.x;
      watchGroup.rotation.y += rotationVelocity.y;

      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    // Touch Support for Mobile
    stageCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        autoSpin = false;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    stageCanvas.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;

      watchGroup.rotation.x += deltaY * 0.006;
      watchGroup.rotation.y += deltaX * 0.006;

      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    // Exploded View Targets
    const defaultZ = {
      crystal: 0.85,
      dial: 0.4,
      fluted: 0.6,
      bezel: 0,
      tourbillon: 0.5,
      topStrap: -0.2,
      btmStrap: -0.2
    };

    const explodedZ = {
      crystal: 3.5,
      dial: 1.8,
      fluted: 2.8,
      bezel: 0,
      tourbillon: 2.3,
      topStrap: -2.5,
      btmStrap: -2.5
    };

    // Public Controls for Global API
    window.set3DFinish = function(finishName) {
      if (!MATERIALS[finishName]) return;
      activeFinish = finishName;
      const m = MATERIALS[finishName];

      parts.bezel.material = m.case;
      parts.fluted.material = m.case;
      parts.dial.material = m.dial;
      parts.crystal.material = m.crystal;
      parts.hourHand.material = m.hands;
      parts.minHand.material = m.hands;
      parts.cap.material = m.case;
      parts.crown.material = m.case;

      // Update button active state
      document.querySelectorAll('.btn-3d-finish').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-finish') === finishName);
      });

      if (window.showToast) {
        window.showToast(`✦ 3D Finish Applied: ${finishName.toUpperCase()}`);
      }
    };

    window.toggleExplodedView = function() {
      isExploded = !isExploded;
      const btn = document.getElementById('btnExplodedView');
      if (btn) {
        btn.classList.toggle('active', isExploded);
        btn.textContent = isExploded ? "Assemble Piece" : "Explode Architecture";
      }
      if (window.showToast) {
        window.showToast(isExploded ? "✦ Exploded 3D Architecture View" : "✦ Assembled Precision Fit");
      }
    };

    window.toggleWireframeMode = function() {
      const isWire = !parts.bezel.material.wireframe;
      parts.bezel.material.wireframe = isWire;
      parts.dial.material.wireframe = isWire;
      parts.fluted.material.wireframe = isWire;
      const btn = document.getElementById('btnWireframeMode');
      if (btn) btn.classList.toggle('active', isWire);
      if (window.showToast) {
        window.showToast(isWire ? "✦ X-Ray Holographic Wireframe" : "✦ Solid PBR Luxury Shader");
      }
    };

    window.reset3DView = function() {
      watchGroup.rotation.set(0.3, -0.4, 0);
      autoSpin = true;
    };

    // Stage Animation Loop
    let time = 0;
    function animateStage() {
      requestAnimationFrame(animateStage);
      time += 0.02;

      // Inertia & Auto Spin
      if (!isDragging) {
        if (autoSpin) {
          watchGroup.rotation.y += 0.005;
        } else {
          // Damping
          watchGroup.rotation.x += rotationVelocity.x;
          watchGroup.rotation.y += rotationVelocity.y;
          rotationVelocity.x *= 0.92;
          rotationVelocity.y *= 0.92;
        }
      }

      // Smooth Exploded View Lerp
      const targetZ = isExploded ? explodedZ : defaultZ;
      parts.crystal.position.z += (targetZ.crystal - parts.crystal.position.z) * 0.08;
      parts.dial.position.z += (targetZ.dial - parts.dial.position.z) * 0.08;
      parts.fluted.position.z += (targetZ.fluted - parts.fluted.position.z) * 0.08;
      parts.tourbillon.position.z += (targetZ.tourbillon - parts.tourbillon.position.z) * 0.08;
      parts.topStrap.position.z += (targetZ.topStrap - parts.topStrap.position.z) * 0.08;
      parts.btmStrap.position.z += (targetZ.btmStrap - parts.btmStrap.position.z) * 0.08;

      // Oscillating Tourbillon Cage (Mechanical Heartbeat)
      parts.tourbillon.rotation.z = Math.sin(time * 6) * 0.4 + time * 0.5;

      // Clock Hands Movement
      parts.secHand.rotation.z -= 0.03;
      parts.minHand.rotation.z -= 0.005;
      parts.hourHand.rotation.z -= 0.001;

      stageRenderer.render(stageScene, stageCamera);
    }
    animateStage();

    // Container Resize
    window.addEventListener('resize', () => {
      width = parentContainer.clientWidth || 550;
      height = parentContainer.clientHeight || 550;
      stageCamera.aspect = width / height;
      stageCamera.updateProjectionMatrix();
      stageRenderer.setSize(width, height);
    });
  }

  // =========================================================================
  // 3. 3D PERSPECTIVE TILT ON PRODUCT CARDS
  // =========================================================================
  function initCard3DTilt() {
    const cards = document.querySelectorAll('.product-card, .capsule-card, .category-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg tilt
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCard3DTilt);
  } else {
    initCard3DTilt();
  }

  // Re-run whenever grid re-renders
  window.reinitCard3DTilt = initCard3DTilt;

})();

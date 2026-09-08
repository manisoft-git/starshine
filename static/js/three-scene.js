/**
 * STARSHINE STEEZ — HIGH-CLASS 3D WEBGL SUITE & SCROLL PHYSICS
 * Inspired by https://lusion.co/
 * 
 * Features:
 * - Full-Page 3D Background Engine with Scroll Parallax & Particle Warp
 * - Masterpiece High-Class 3D Hero Showcase:
 *    1. Horology: Aethelgard Royal Skeleton Automatic Gold (Dial, Hands, Tourbillon, Sapphire)
 *    2. Footwear: Milano Handcrafted Patina Double Monk Shoes (Calfskin, Brass Buckles)
 *    3. Jewelry: 18K Solid Gold Cuban Link & Sovereign Signet Ring Set (Onyx, Diamonds)
 *    4. Bespoke Suiting: Imperial Senator Wool & Italian Double-Breasted Blazer
 * - Real-Time Precious Metal Finishes (Champagne Gold, Platinum Steel, Obsidian Ceramic, Rose Gold)
 * - Multi-Atmosphere Aesthetic Engine (Obsidian, Steez, Ivory, Contrast)
 * - Scroll-Driven 3D Card Perspective Tilt Physics
 * - Lusion Expandable / Collapsible Monogram Floating Dock
 */

(function() {
  "use strict";

  function isWebGLAvailable() {
    try {
      const canvas = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch (e) {
      return false;
    }
  }

  if (!window.THREE || !isWebGLAvailable()) {
    console.warn("WebGL or Three.js not available.");
    return;
  }

  // =========================================================================
  // 1. FULL-PAGE 3D BACKGROUND ENGINE (#webgl-bg-canvas)
  // =========================================================================
  const bgCanvas = document.getElementById("webgl-bg-canvas");
  let bgRenderer, bgScene, bgCamera, bgParticles, bgDustPositions, bgDustVelocities, bgRingsGroup;

  if (bgCanvas) {
    const bgWidth = window.innerWidth;
    const bgHeight = window.innerHeight;

    bgRenderer = new THREE.WebGLRenderer({
      canvas: bgCanvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    bgRenderer.setSize(bgWidth, bgHeight);
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    bgScene = new THREE.Scene();
    bgCamera = new THREE.PerspectiveCamera(45, bgWidth / bgHeight, 0.1, 1000);
    bgCamera.position.set(0, 0, 20);

    // Dynamic Stardust Constellation
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    bgDustPositions = new Float32Array(particleCount * 3);
    bgDustVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      bgDustPositions[i * 3] = (Math.random() - 0.5) * 80;
      bgDustPositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      bgDustPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      bgDustVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: 0.01 + Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.015
      });
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(bgDustPositions, 3));

    // Particle Texture
    const pCan = document.createElement("canvas");
    pCan.width = 32;
    pCan.height = 32;
    const pCtx = pCan.getContext("2d");
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
    pGrad.addColorStop(0.3, "rgba(212, 175, 55, 0.85)");
    pGrad.addColorStop(0.7, "rgba(212, 175, 55, 0.2)");
    pGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pTex = new THREE.CanvasTexture(pCan);
    const particleMat = new THREE.PointsMaterial({
      size: 1.2,
      map: pTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    bgParticles = new THREE.Points(particleGeo, particleMat);
    bgScene.add(bgParticles);

    // Floating Geometric Landmarks along the page depths
    bgRingsGroup = new THREE.Group();
    bgScene.add(bgRingsGroup);

    // 1. Gold Roman Celestial Ring
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15
    });
    const ringGeo = new THREE.TorusGeometry(8, 0.18, 24, 100);
    const bgRing1 = new THREE.Mesh(ringGeo, ringMat);
    bgRing1.position.set(22, -10, -15);
    bgRing1.rotation.x = Math.PI / 3;
    bgRingsGroup.add(bgRing1);

    // 2. Diamond Crystal Octahedron
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.8,
      thickness: 2.0
    });
    const diamondGeo = new THREE.OctahedronGeometry(4.5, 0);
    const bgDiamond = new THREE.Mesh(diamondGeo, diamondMat);
    bgDiamond.position.set(-24, -28, -12);
    bgRingsGroup.add(bgDiamond);

    // 3. Torus Knot Ribbon
    const ribbonGeo = new THREE.TorusKnotGeometry(5, 0.6, 120, 24, 2, 3);
    const bgRibbon = new THREE.Mesh(ribbonGeo, ringMat);
    bgRibbon.position.set(26, -55, -18);
    bgRingsGroup.add(bgRibbon);

    // Ambient Lighting for Background
    const bgAmbLight = new THREE.AmbientLight(0xffffff, 0.8);
    bgScene.add(bgAmbLight);

    const bgDirLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    bgDirLight.position.set(10, 20, 15);
    bgScene.add(bgDirLight);
  }

  // =========================================================================
  // 2. HERO 3D MASTERPIECE SHOWCASE (#webgl-hero-canvas)
  // =========================================================================
  const heroCanvas = document.getElementById("webgl-hero-canvas");
  if (!heroCanvas) return;

  const heroContainer = heroCanvas.parentElement;
  let heroWidth = heroContainer.clientWidth || window.innerWidth;
  let heroHeight = heroContainer.clientHeight || window.innerHeight;

  const heroRenderer = new THREE.WebGLRenderer({
    canvas: heroCanvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  heroRenderer.setSize(heroWidth, heroHeight);
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  heroRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  heroRenderer.toneMappingExposure = 1.35;

  const heroScene = new THREE.Scene();
  const heroCamera = new THREE.PerspectiveCamera(40, heroWidth / heroHeight, 0.1, 1000);
  heroCamera.position.set(0, 0, 15);

  // Studio Environment Reflection Texture
  const envCanvas = document.createElement("canvas");
  envCanvas.width = 512;
  envCanvas.height = 256;
  const envCtx = envCanvas.getContext("2d");
  const envBg = envCtx.createLinearGradient(0, 0, 0, 256);
  envBg.addColorStop(0, "#0b0d14");
  envBg.addColorStop(0.5, "#171b26");
  envBg.addColorStop(1, "#06080c");
  envCtx.fillStyle = envBg;
  envCtx.fillRect(0, 0, 512, 256);

  // Gold Softbox
  const sb1 = envCtx.createRadialGradient(160, 70, 0, 160, 70, 90);
  sb1.addColorStop(0, "rgba(255, 245, 215, 0.95)");
  sb1.addColorStop(0.5, "rgba(212, 175, 55, 0.6)");
  sb1.addColorStop(1, "rgba(0,0,0,0)");
  envCtx.fillStyle = sb1;
  envCtx.fillRect(0, 0, 512, 256);

  // Cool Rim Softbox
  const sb2 = envCtx.createRadialGradient(380, 170, 0, 380, 170, 100);
  sb2.addColorStop(0, "rgba(225, 240, 255, 0.85)");
  sb2.addColorStop(0.5, "rgba(56, 189, 248, 0.3)");
  sb2.addColorStop(1, "rgba(0,0,0,0)");
  envCtx.fillStyle = sb2;
  envCtx.fillRect(0, 0, 512, 256);

  const heroEnvTex = new THREE.CanvasTexture(envCanvas);
  heroEnvTex.mapping = THREE.EquirectangularReflectionMapping;
  heroScene.environment = heroEnvTex;

  // Studio Lighting
  const heroAmbient = new THREE.AmbientLight(0xffffff, 0.75);
  heroScene.add(heroAmbient);

  const heroKey = new THREE.DirectionalLight(0xfff7e6, 3.4);
  heroKey.position.set(12, 16, 14);
  heroScene.add(heroKey);

  const heroFill = new THREE.DirectionalLight(0xd4af37, 2.0);
  heroFill.position.set(-15, -10, 10);
  heroScene.add(heroFill);

  const heroMouseSpot = new THREE.PointLight(0xfff3cc, 2.5, 45);
  heroMouseSpot.position.set(0, 3, 12);
  heroScene.add(heroMouseSpot);

  // =========================================================================
  // 3. MASTER STAGE ROOT & HIGH-CLASS LUXURY MODELS
  // =========================================================================
  const stageRoot = new THREE.Group();
  heroScene.add(stageRoot);
  stageRoot.position.set(2.4, 0, 0);

  // FINISH MATERIALS
  const FINISH_MATERIALS = {
    gold: {
      name: "18K Champagne Gold",
      metal: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.15, envMap: heroEnvTex }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x1a1a1f, metalness: 0.85, roughness: 0.22, envMap: heroEnvTex }),
      accent: new THREE.MeshStandardMaterial({ color: 0xfff2a8, metalness: 0.98, roughness: 0.08, envMap: heroEnvTex }),
      leather: new THREE.MeshStandardMaterial({ color: 0x1d1916, roughness: 0.8, metalness: 0.08 })
    },
    platinum: {
      name: "Platinum Silver & Steel",
      metal: new THREE.MeshStandardMaterial({ color: 0xedf2f7, metalness: 0.98, roughness: 0.1, envMap: heroEnvTex }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x242b35, metalness: 0.9, roughness: 0.2, envMap: heroEnvTex }),
      accent: new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.95, roughness: 0.08, envMap: heroEnvTex }),
      leather: new THREE.MeshStandardMaterial({ color: 0x181c24, roughness: 0.82, metalness: 0.08 })
    },
    ceramic: {
      name: "Midnight Obsidian Ceramic",
      metal: new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.4, roughness: 0.08, envMap: heroEnvTex }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x08090c, metalness: 0.92, roughness: 0.15, envMap: heroEnvTex }),
      accent: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.12, envMap: heroEnvTex }),
      leather: new THREE.MeshStandardMaterial({ color: 0x121214, roughness: 0.85, metalness: 0.05 })
    },
    rosegold: {
      name: "Rose Gold & Royal Bronze",
      metal: new THREE.MeshStandardMaterial({ color: 0xb76e79, metalness: 0.94, roughness: 0.14, envMap: heroEnvTex }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x221619, metalness: 0.8, roughness: 0.26, envMap: heroEnvTex }),
      accent: new THREE.MeshStandardMaterial({ color: 0xfbcfe8, metalness: 0.95, roughness: 0.08, envMap: heroEnvTex }),
      leather: new THREE.MeshStandardMaterial({ color: 0x261b1e, roughness: 0.82, metalness: 0.08 })
    }
  };

  let currentFinish = "gold";
  let activeModelIndex = 0;
  let isExploded = false;
  let isWireframe = false;
  let autoSpin = true;

  // -------------------------------------------------------------------------
  // GENERATE HIGH-RES REALISTIC WATCH DIAL TEXTURE
  // -------------------------------------------------------------------------
  function createLuxuryWatchDialTexture() {
    const dCan = document.createElement("canvas");
    dCan.width = 1024;
    dCan.height = 1024;
    const dCtx = dCan.getContext("2d");
    const cx = 512;
    const cy = 512;

    // Outer Obsidian Base
    dCtx.fillStyle = "#0d0f15";
    dCtx.beginPath();
    dCtx.arc(cx, cy, 500, 0, Math.PI * 2);
    dCtx.fill();

    // Circular Guilloche Grooves
    for (let r = 80; r < 470; r += 8) {
      dCtx.strokeStyle = "rgba(212, 175, 55, 0.06)";
      dCtx.lineWidth = 1;
      dCtx.beginPath();
      dCtx.arc(cx, cy, r, 0, Math.PI * 2);
      dCtx.stroke();
    }

    // Outer Gold Minute Track Ring
    dCtx.strokeStyle = "#d4af37";
    dCtx.lineWidth = 4;
    dCtx.beginPath();
    dCtx.arc(cx, cy, 470, 0, Math.PI * 2);
    dCtx.stroke();

    // Minute Ticks
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const isHour = i % 5 === 0;
      const rInner = isHour ? 430 : 455;
      const rOuter = 468;
      dCtx.lineWidth = isHour ? 4 : 2;
      dCtx.strokeStyle = isHour ? "#d4af37" : "rgba(212, 175, 55, 0.4)";
      dCtx.beginPath();
      dCtx.moveTo(cx + Math.cos(angle) * rInner, cy + Math.sin(angle) * rInner);
      dCtx.lineTo(cx + Math.cos(angle) * rOuter, cy + Math.sin(angle) * rOuter);
      dCtx.stroke();
    }

    // Roman Numerals for 12, 3, 6, 9
    dCtx.font = "600 48px Cinzel, serif";
    dCtx.fillStyle = "#f5e7b8";
    dCtx.textAlign = "center";
    dCtx.textBaseline = "middle";
    dCtx.fillText("XII", cx, cy - 380);
    dCtx.fillText("III", cx + 380, cy);
    dCtx.fillText("VI", cx, cy + 380);
    dCtx.fillText("IX", cx - 380, cy);

    // Starshine Steez Hallmark at top
    dCtx.font = "700 22px Cinzel, serif";
    dCtx.fillStyle = "#d4af37";
    dCtx.letterSpacing = "4px";
    dCtx.fillText("STARSHINE STEEZ", cx, cy - 160);
    dCtx.font = "500 16px Plus Jakarta Sans, sans-serif";
    dCtx.fillStyle = "rgba(255, 255, 255, 0.5)";
    dCtx.fillText("CHRONOMÈTRE OFFICIEL • 50M", cx, cy - 130);

    // Open-Heart Skeleton Tourbillon Center Ring
    dCtx.strokeStyle = "#d4af37";
    dCtx.lineWidth = 6;
    dCtx.beginPath();
    dCtx.arc(cx, cy + 120, 140, 0, Math.PI * 2);
    dCtx.stroke();
    dCtx.fillStyle = "#080a0f";
    dCtx.beginPath();
    dCtx.arc(cx, cy + 120, 136, 0, Math.PI * 2);
    dCtx.fill();

    const tex = new THREE.CanvasTexture(dCan);
    tex.anisotropy = 8;
    return tex;
  }

  const models = [];
  const watchParts = {};
  const shoeParts = {};
  const jewelryParts = {};
  const suitParts = {};

  // -------------------------------------------------------------------------
  // 1. MODEL: AETHELGARD ROYAL SKELETON AUTOMATIC TIMEPIECE
  // -------------------------------------------------------------------------
  const watchModel = new THREE.Group();
  watchModel.name = "watch";

  // 1A. Fluted 18K Bezel
  const flutedGeo = new THREE.TorusGeometry(3.65, 0.3, 32, 120);
  const flutedMesh = new THREE.Mesh(flutedGeo, FINISH_MATERIALS.gold.metal);
  flutedMesh.scale.set(1, 1, 0.4);
  watchModel.add(flutedMesh);
  watchParts.fluted = flutedMesh;

  // 1B. Case
  const caseGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.5, 64);
  const caseMesh = new THREE.Mesh(caseGeo, FINISH_MATERIALS.gold.metal);
  caseMesh.rotation.x = Math.PI / 2;
  watchModel.add(caseMesh);
  watchParts.case = caseMesh;

  // 1C. Dial with High-Res Texture
  const dialTex = createLuxuryWatchDialTexture();
  const dialMat = new THREE.MeshStandardMaterial({
    map: dialTex,
    roughness: 0.3,
    metalness: 0.6,
    envMap: heroEnvTex
  });
  const dialGeo = new THREE.CircleGeometry(3.4, 64);
  const dialMesh = new THREE.Mesh(dialGeo, dialMat);
  dialMesh.position.z = 0.26;
  watchModel.add(dialMesh);
  watchParts.dial = dialMesh;

  // 1D. Tourbillon Rotating Balance Wheel
  const tourbillonGroup = new THREE.Group();
  tourbillonGroup.position.set(0, -0.8, 0.3);

  const balanceRingGeo = new THREE.TorusGeometry(0.85, 0.06, 16, 48);
  const balanceMesh = new THREE.Mesh(balanceRingGeo, FINISH_MATERIALS.gold.accent);
  tourbillonGroup.add(balanceMesh);

  for (let s = 0; s < 4; s++) {
    const spokeGeo = new THREE.BoxGeometry(1.6, 0.05, 0.02);
    const spoke = new THREE.Mesh(spokeGeo, FINISH_MATERIALS.gold.accent);
    spoke.rotation.z = (s / 4) * Math.PI;
    tourbillonGroup.add(spoke);
  }
  watchModel.add(tourbillonGroup);
  watchParts.tourbillon = tourbillonGroup;

  // 1E. Hands (Hour, Minute, Sweeping Second)
  const handsGroup = new THREE.Group();
  handsGroup.position.z = 0.32;

  // Hour Hand
  const hourGeo = new THREE.BoxGeometry(0.14, 1.8, 0.04);
  hourGeo.translate(0, 0.9, 0);
  const hourMesh = new THREE.Mesh(hourGeo, FINISH_MATERIALS.gold.accent);
  hourMesh.rotation.z = Math.PI * 0.35;
  handsGroup.add(hourMesh);
  watchParts.hourHand = hourMesh;

  // Minute Hand
  const minGeo = new THREE.BoxGeometry(0.1, 2.6, 0.04);
  minGeo.translate(0, 1.3, 0);
  const minMesh = new THREE.Mesh(minGeo, FINISH_MATERIALS.gold.accent);
  minMesh.rotation.z = -Math.PI * 0.25;
  handsGroup.add(minMesh);
  watchParts.minHand = minMesh;

  // Sweeping Second Hand (Gold Needle)
  const secGeo = new THREE.BoxGeometry(0.04, 3.1, 0.02);
  secGeo.translate(0, 1.3, 0);
  const secMat = new THREE.MeshStandardMaterial({ color: 0xff3344, roughness: 0.1, metalness: 0.9 });
  const secMesh = new THREE.Mesh(secGeo, secMat);
  handsGroup.add(secMesh);
  watchParts.secHand = secMesh;

  // Center Jewel Pin
  const pinGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 24);
  const pinMesh = new THREE.Mesh(pinGeo, FINISH_MATERIALS.gold.accent);
  pinMesh.rotation.x = Math.PI / 2;
  handsGroup.add(pinMesh);

  watchModel.add(handsGroup);

  // 1F. Beveled Sapphire Crystal (High Physical Transmission)
  const crystalGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.08, 64);
  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.96,
    opacity: 1,
    transparent: true,
    roughness: 0.03,
    ior: 1.77,
    reflectivity: 0.9,
    envMap: heroEnvTex
  });
  const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
  crystalMesh.rotation.x = Math.PI / 2;
  crystalMesh.position.z = 0.36;
  watchModel.add(crystalMesh);
  watchParts.crystal = crystalMesh;

  // 1G. Alligator Leather Straps
  const strapMat = FINISH_MATERIALS.gold.leather;
  const topStrapGeo = new THREE.BoxGeometry(2.3, 3.8, 0.25);
  topStrapGeo.translate(0, 5.0, -0.05);
  const topStrap = new THREE.Mesh(topStrapGeo, strapMat);
  watchModel.add(topStrap);
  watchParts.topStrap = topStrap;

  const btmStrapGeo = new THREE.BoxGeometry(2.3, 4.4, 0.25);
  btmStrapGeo.translate(0, -5.2, -0.05);
  const btmStrap = new THREE.Mesh(btmStrapGeo, strapMat);
  watchModel.add(btmStrap);
  watchParts.btmStrap = btmStrap;

  // 1H. Fluted Winding Crown
  const crownGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32);
  const crownMesh = new THREE.Mesh(crownGeo, FINISH_MATERIALS.gold.metal);
  crownMesh.rotation.z = Math.PI / 2;
  crownMesh.position.set(3.8, 0, 0);
  watchModel.add(crownMesh);
  watchParts.crown = crownMesh;

  stageRoot.add(watchModel);
  models.push(watchModel);

  // -------------------------------------------------------------------------
  // 2. MODEL: MILANO HANDCRAFTED PATINA DOUBLE MONK SHOES
  // -------------------------------------------------------------------------
  const shoeModel = new THREE.Group();
  shoeModel.name = "shoe";
  shoeModel.visible = false;

  // Shoe Upper (Curved Italian Last)
  const shoeUpperGeo = new THREE.CylinderGeometry(1.6, 2.2, 5.6, 32);
  const shoePatinaMat = new THREE.MeshStandardMaterial({
    color: 0x824419, // Burnished Cognac
    roughness: 0.35,
    metalness: 0.2,
    envMap: heroEnvTex
  });
  const shoeUpper = new THREE.Mesh(shoeUpperGeo, shoePatinaMat);
  shoeUpper.rotation.x = Math.PI / 2;
  shoeUpper.scale.set(1.1, 0.7, 1.2);
  shoeModel.add(shoeUpper);
  shoeParts.upper = shoeUpper;

  // Burnished Toe Cap
  const toeGeo = new THREE.SphereGeometry(1.5, 32, 16);
  const toeMat = new THREE.MeshStandardMaterial({
    color: 0x3d1c08, // Dark burnished toe gradient
    roughness: 0.25,
    metalness: 0.3,
    envMap: heroEnvTex
  });
  const toeMesh = new THREE.Mesh(toeGeo, toeMat);
  toeMesh.position.set(0, -0.2, 2.7);
  toeMesh.scale.set(1.1, 0.6, 1.0);
  shoeModel.add(toeMesh);
  shoeParts.toe = toeMesh;

  // Welted Leather Sole
  const soleGeo = new THREE.BoxGeometry(2.6, 0.35, 6.8);
  const soleMat = new THREE.MeshStandardMaterial({ color: 0x1f140e, roughness: 0.85, metalness: 0.1 });
  const soleMesh = new THREE.Mesh(soleGeo, soleMat);
  soleMesh.position.set(0, -0.9, 0.3);
  shoeModel.add(soleMesh);

  // Stacked Dress Heel
  const heelGeo = new THREE.BoxGeometry(2.4, 0.5, 1.8);
  const heelMesh = new THREE.Mesh(heelGeo, soleMat);
  heelMesh.position.set(0, -1.2, -2.0);
  shoeModel.add(heelMesh);

  // Dual Brushed Brass Monk Buckles
  for (let b = 0; b < 2; b++) {
    const bGeo = new THREE.TorusGeometry(0.35, 0.08, 16, 24);
    const bMesh = new THREE.Mesh(bGeo, FINISH_MATERIALS.gold.accent);
    bMesh.position.set(1.1, 0.4 + b * 0.7, -0.2 + b * 0.8);
    bMesh.rotation.y = Math.PI / 2;
    shoeModel.add(bMesh);
  }

  shoeModel.rotation.set(-0.25, 0.5, 0);
  shoeModel.scale.set(1.2, 1.2, 1.2);
  stageRoot.add(shoeModel);
  models.push(shoeModel);

  // -------------------------------------------------------------------------
  // 3. MODEL: 18K SOLID GOLD CUBAN LINK & SOVEREIGN SIGNET RING
  // -------------------------------------------------------------------------
  const jewelryModel = new THREE.Group();
  jewelryModel.name = "jewelry";
  jewelryModel.visible = false;

  // Solid Heavy Signet Ring Band
  const ringBandGeo = new THREE.TorusGeometry(2.2, 0.65, 32, 64);
  const ringBandMesh = new THREE.Mesh(ringBandGeo, FINISH_MATERIALS.gold.metal);
  ringBandMesh.rotation.x = Math.PI / 2;
  jewelryModel.add(ringBandMesh);
  jewelryParts.band = ringBandMesh;

  // Faceted Signet Plate
  const plateGeo = new THREE.CylinderGeometry(1.4, 1.2, 0.5, 8);
  const plateMesh = new THREE.Mesh(plateGeo, FINISH_MATERIALS.gold.metal);
  plateMesh.position.y = 2.2;
  jewelryModel.add(plateMesh);
  jewelryParts.plate = plateMesh;

  // Inlaid Brazilian Black Onyx Gemstone
  const onyxGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.15, 8);
  const onyxMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0c,
    roughness: 0.04,
    metalness: 0.85,
    envMap: heroEnvTex
  });
  const onyxMesh = new THREE.Mesh(onyxGeo, onyxMat);
  onyxMesh.position.y = 2.45;
  jewelryModel.add(onyxMesh);

  // Gold Starshine Steez Star Hallmark Crest on Onyx
  const starGeo = new THREE.OctahedronGeometry(0.4, 0);
  const starMesh = new THREE.Mesh(starGeo, FINISH_MATERIALS.gold.accent);
  starMesh.position.y = 2.58;
  starMesh.scale.set(1, 0.2, 1);
  jewelryModel.add(starMesh);

  // Cuban Link Chain Halo around the Ring
  const chainGroup = new THREE.Group();
  const linkCount = 20;
  for (let i = 0; i < linkCount; i++) {
    const angle = (i / linkCount) * Math.PI * 2;
    const linkGeo = new THREE.TorusGeometry(0.4, 0.12, 16, 24);
    const link = new THREE.Mesh(linkGeo, FINISH_MATERIALS.gold.accent);
    link.position.set(Math.cos(angle) * 4.2, Math.sin(angle) * 4.2, -0.4);
    link.rotation.z = angle + Math.PI / 4;
    chainGroup.add(link);
  }
  jewelryModel.add(chainGroup);
  jewelryParts.chain = chainGroup;

  jewelryModel.rotation.x = 0.4;
  stageRoot.add(jewelryModel);
  models.push(jewelryModel);

  // -------------------------------------------------------------------------
  // 4. MODEL: BESPOKE IMPERIAL SENATOR & ITALIAN WOOL BLAZER
  // -------------------------------------------------------------------------
  const suitModel = new THREE.Group();
  suitModel.name = "suit";
  suitModel.visible = false;

  // Tailored Torso Silhouette
  const torsoGeo = new THREE.CylinderGeometry(2.4, 2.0, 5.8, 32);
  const woolMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a, // Imperial Midnight Navy Wool
    roughness: 0.85,
    metalness: 0.05
  });
  const torsoMesh = new THREE.Mesh(torsoGeo, woolMat);
  torsoMesh.scale.set(1.2, 1, 0.7);
  suitModel.add(torsoMesh);
  suitParts.torso = torsoMesh;

  // Mandarin Collar with Gold Metallic Filigree
  const collarGeo = new THREE.CylinderGeometry(1.4, 1.5, 0.8, 32);
  const collarMesh = new THREE.Mesh(collarGeo, FINISH_MATERIALS.gold.accent);
  collarMesh.position.y = 3.1;
  collarMesh.scale.set(1.1, 1, 0.8);
  suitModel.add(collarMesh);

  // Peak Satin Silk Lapels
  const lapelGeo = new THREE.BoxGeometry(0.8, 3.4, 0.15);
  const satinMat = new THREE.MeshStandardMaterial({
    color: 0x090d17,
    roughness: 0.25,
    metalness: 0.4,
    envMap: heroEnvTex
  });

  const leftLapel = new THREE.Mesh(lapelGeo, satinMat);
  leftLapel.position.set(-0.8, 0.8, 0.7);
  leftLapel.rotation.z = -0.2;
  suitModel.add(leftLapel);

  const rightLapel = new THREE.Mesh(lapelGeo, satinMat);
  rightLapel.position.set(0.8, 0.8, 0.7);
  rightLapel.rotation.z = 0.2;
  suitModel.add(rightLapel);

  // 6 Gold Crest Buttons (Double-Breasted Stance)
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 2; c++) {
      const btnGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 20);
      const btn = new THREE.Mesh(btnGeo, FINISH_MATERIALS.gold.accent);
      btn.rotation.x = Math.PI / 2;
      btn.position.set((c === 0 ? -0.6 : 0.6), -0.4 - r * 0.9, 0.75);
      suitModel.add(btn);
    }
  }

  suitModel.position.y = -0.4;
  stageRoot.add(suitModel);
  models.push(suitModel);

  // =========================================================================
  // 4. INTERACTIVE SWITCHING & FINISH HANDLERS
  // =========================================================================
  window.switch3DModel = function(index) {
    if (index < 0 || index >= models.length) return;
    activeModelIndex = index;
    isExploded = false;

    models.forEach((m, i) => {
      m.visible = (i === index);
    });

    document.querySelectorAll(".btn-3d-model-tab").forEach((tab, i) => {
      tab.classList.toggle("active", i === index);
    });

    const titles = [
      "Aethelgard Royal Skeleton Automatic Gold",
      "Milano Handcrafted Patina Double Monk Shoes",
      "18K Gold Cuban Link & Sovereign Signet Ring Set",
      "Bespoke Imperial Senator Wool Ensemble"
    ];
    const categories = [
      "HOROLOGY & TIMEPIECES",
      "ARTISAN ITALIAN FOOTWEAR",
      "18K SOLID GOLD & JEWELRY",
      "NIGERIAN BESPOKE SUITING"
    ];
    const calibers = [
      "CALIBER: STR-09 SKELETON • 50M SAPPHIRE",
      "LEATHER: TUSCAN CALFSKIN • HAND-PATINA",
      "PURITY: 18K SOLID GOLD • BRAZILIAN ONYX",
      "FABRIC: SUPER 140S WOOL & CASHMERE"
    ];

    const titleEl = document.getElementById("hero3DTitle");
    const catEl = document.getElementById("hero3DCategory");
    const calEl = document.getElementById("hero3DCaliber");

    if (titleEl) titleEl.textContent = titles[index];
    if (catEl) catEl.textContent = categories[index];
    if (calEl) calEl.textContent = calibers[index];

    if (window.showToast) {
      window.showToast(`✦ Showcasing: ${titles[index]}`);
    }
  };

  window.set3DFinish = function(finishKey) {
    if (!FINISH_MATERIALS[finishKey]) return;
    currentFinish = finishKey;
    const mat = FINISH_MATERIALS[finishKey];

    // Watch
    watchParts.fluted.material = mat.metal;
    watchParts.case.material = mat.metal;
    watchParts.crown.material = mat.metal;
    watchParts.hourHand.material = mat.accent;
    watchParts.minHand.material = mat.accent;
    watchParts.topStrap.material = mat.leather;
    watchParts.btmStrap.material = mat.leather;

    // Jewelry
    jewelryParts.band.material = mat.metal;
    jewelryParts.plate.material = mat.metal;
    jewelryParts.chain.children.forEach(l => l.material = mat.accent);

    document.querySelectorAll(".btn-3d-finish").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-finish") === finishKey);
    });

    const matReadout = document.getElementById("hero3DMaterialReadout");
    if (matReadout) matReadout.textContent = mat.name;

    if (window.showToast) {
      window.showToast(`✦ Finish: ${mat.name}`);
    }
  };

  window.toggleExplodedView = function() {
    isExploded = !isExploded;
    const btn = document.getElementById("btnExplodedView");
    if (btn) {
      btn.classList.toggle("active", isExploded);
      btn.textContent = isExploded ? "Assemble Architecture" : "Explode Architecture";
    }
  };

  window.toggleWireframeMode = function() {
    isWireframe = !isWireframe;
    models.forEach(model => {
      model.traverse(child => {
        if (child.isMesh && child.material && child !== watchParts.dial) {
          child.material.wireframe = isWireframe;
        }
      });
    });
    const btn = document.getElementById("btnWireframeMode");
    if (btn) btn.classList.toggle("active", isWireframe);
  };

  window.reset3DView = function() {
    stageRoot.rotation.set(0, 0, 0);
    isExploded = false;
    isWireframe = false;
    models.forEach(m => m.traverse(c => { if (c.isMesh && c.material) c.material.wireframe = false; }));
    const b1 = document.getElementById("btnExplodedView");
    const b2 = document.getElementById("btnWireframeMode");
    if (b1) { b1.classList.remove("active"); b1.textContent = "Explode Architecture"; }
    if (b2) { b2.classList.remove("active"); }
  };

  window.order3DWatchWhatsApp = function() {
    const curModel = models[activeModelIndex];
    const names = [
      "Aethelgard Royal Skeleton Automatic Gold",
      "Milano Handcrafted Patina Double Monk Shoes",
      "18K Gold Cuban Link & Sovereign Signet Ring Set",
      "Bespoke Imperial Senator Wool Ensemble"
    ];
    const prices = [440, 245, 310, 225];
    const name = names[activeModelIndex];
    const priceUsd = prices[activeModelIndex];
    const finish = FINISH_MATERIALS[currentFinish].name;

    const formattedPrice = window.formatPrice ? window.formatPrice(priceUsd) : `$${priceUsd}`;
    const cleanNumber = (window.settings && window.settings.whatsappNumber) ? window.settings.whatsappNumber.replace(/[^0-9]/g, "") : "2348012345678";
    const store = (window.settings && window.settings.storeName) ? window.settings.storeName : "STARSHINE STEEZ";

    const msg = `✨ *INQUIRY / 3D ORDER - ${store}* ✨\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `I am inquiring about the 3D Showroom Masterpiece:\n\n` +
      `🛍️ *Piece*: ${name}\n` +
      `🎨 *Precious Finish*: ${finish}\n` +
      `💎 *Price*: *${formattedPrice}*\n` +
      `📍 *Showroom*: Victoria Island, Lagos, Nigeria\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `Please confirm current availability and dispatch details. Thank you!`;

    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // =========================================================================
  // 5. MOUSE & DRAG INTERACTION
  // =========================================================================
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let targetRotX = 0;
  let targetRotY = 0;
  let mouseNorm = { x: 0, y: 0 };

  heroCanvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    prevMouse = { x: e.clientX, y: e.clientY };
    autoSpin = false;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    setTimeout(() => { autoSpin = true; }, 4000);
  });

  window.addEventListener("mousemove", (e) => {
    mouseNorm.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNorm.y = -(e.clientY / window.innerHeight) * 2 + 1;

    heroMouseSpot.position.x = mouseNorm.x * 12;
    heroMouseSpot.position.y = mouseNorm.y * 10;

    if (isDragging) {
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      targetRotY += deltaX * 0.009;
      targetRotX += deltaY * 0.009;
      targetRotX = Math.max(-1.1, Math.min(1.1, targetRotX));
      prevMouse = { x: e.clientX, y: e.clientY };
    }
  });

  // Touch Support
  heroCanvas.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      autoSpin = false;
    }
  });

  window.addEventListener("touchend", () => {
    isDragging = false;
    setTimeout(() => { autoSpin = true; }, 4000);
  });

  window.addEventListener("touchmove", (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - prevMouse.x;
      const deltaY = e.touches[0].clientY - prevMouse.y;
      targetRotY += deltaX * 0.012;
      targetRotX += deltaY * 0.012;
      targetRotX = Math.max(-1.1, Math.min(1.1, targetRotX));
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });

  // =========================================================================
  // 6. GLOBAL SCROLL PHYSICS & 3D CARD PARALLAX ENGINE
  // =========================================================================
  let scrollY = window.scrollY;
  let targetScrollY = window.scrollY;
  let scrollSpeed = 0;
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    targetScrollY = window.scrollY;
    scrollSpeed = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;
  }, { passive: true });

  // Update dynamic 3D perspective tilt on all cards during scroll
  function updateCardScrollPhysics() {
    const cards = document.querySelectorAll(".product-card, .capsule-card, .category-card");
    const vh = window.innerHeight;
    const centerY = vh / 2;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      // If card is on screen
      if (rect.top < vh + 100 && rect.bottom > -100) {
        const cardCenter = rect.top + rect.height / 2;
        const distFromCenter = (cardCenter - centerY) / centerY; // -1 (top) to +1 (bottom)
        
        // Tilt subtly away from scroll direction
        const tiltX = distFromCenter * 8;
        const transZ = (1 - Math.abs(distFromCenter)) * 10;
        
        card.classList.add("scroll-3d-tilt");
        if (!card.matches(":hover")) {
          card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) translateZ(${transZ.toFixed(1)}px)`;
        }
      }
    });
  }

  // =========================================================================
  // 7. MASTER RENDER LOOP (HERO + BACKGROUND + PHYSICS)
  // =========================================================================
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Lerp scroll
    scrollY += (targetScrollY - scrollY) * 0.08;

    // --- A. Background 3D Scene ---
    if (bgRenderer && bgScene && bgCamera) {
      // Camera travels through 3D space with scroll
      const targetCamY = -scrollY * 0.009;
      const targetCamZ = 20 + Math.sin(scrollY * 0.0012) * 5;
      bgCamera.position.y += (targetCamY - bgCamera.position.y) * 0.06;
      bgCamera.position.z += (targetCamZ - bgCamera.position.z) * 0.06;
      bgCamera.rotation.x = -scrollY * 0.00015;
      bgCamera.rotation.y = mouseNorm.x * 0.08;

      // Accelerate stardust particles based on scroll velocity
      const speedMultiplier = 1 + Math.min(scrollSpeed * 0.15, 6);
      scrollSpeed *= 0.92;

      const pos = bgDustPositions;
      for (let i = 0; i < 1000; i++) {
        pos[i * 3 + 1] += bgDustVelocities[i].y * speedMultiplier;
        pos[i * 3] += bgDustVelocities[i].x;
        if (pos[i * 3 + 1] > 40) pos[i * 3 + 1] = -40;
      }
      bgParticles.geometry.attributes.position.needsUpdate = true;

      // Rotate Background Landmarks
      if (bgRingsGroup) {
        bgRingsGroup.rotation.y = elapsedTime * 0.04;
        bgRingsGroup.children.forEach((mesh, i) => {
          mesh.rotation.x += 0.005 * (i + 1);
          mesh.rotation.y += 0.008 * (i + 1);
        });
      }

      bgRenderer.render(bgScene, bgCamera);
    }

    // --- B. Hero 3D Showcase ---
    if (autoSpin) {
      targetRotY += 0.004;
    }

    stageRoot.rotation.x += (targetRotX - stageRoot.rotation.x) * 0.08;
    stageRoot.rotation.y += (targetRotY - stageRoot.rotation.y) * 0.08;

    // Watch Mechanique Animations
    if (watchParts.secHand) {
      watchParts.secHand.rotation.z = -elapsedTime * 1.5; // Sweeping second hand
    }
    if (watchParts.tourbillon) {
      watchParts.tourbillon.rotation.z = Math.sin(elapsedTime * 12) * 0.45; // Rapid tourbillon oscillation
    }

    // Exploded View Dynamics
    const explodeTarget = isExploded ? 1.0 : 0.0;
    if (watchParts.crystal) {
      watchParts.crystal.position.z += ((0.36 + explodeTarget * 1.6) - watchParts.crystal.position.z) * 0.1;
    }
    if (watchParts.bezel) {
      watchParts.bezel.position.z += ((explodeTarget * 1.0) - watchParts.bezel.position.z) * 0.1;
    }
    if (watchParts.dial) {
      watchParts.dial.position.z += ((0.26 - explodeTarget * 0.8) - watchParts.dial.position.z) * 0.1;
    }

    // Camera Parallax tracking cursor & scroll
    const targetCamX = mouseNorm.x * 2.0;
    const targetHeroCamY = mouseNorm.y * 1.5 - scrollY * 0.005;
    heroCamera.position.x += (targetCamX - heroCamera.position.x) * 0.05;
    heroCamera.position.y += (targetHeroCamY - heroCamera.position.y) * 0.05;
    heroCamera.lookAt(0, -scrollY * 0.005, 0);

    heroRenderer.render(heroScene, heroCamera);

    // --- C. Scroll 3D Card Physics ---
    updateCardScrollPhysics();
  }
  animate();

  // Resize Handling
  window.addEventListener("resize", () => {
    if (bgRenderer && bgCamera) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      bgCamera.aspect = w / h;
      bgCamera.updateProjectionMatrix();
      bgRenderer.setSize(w, h);
    }
    if (heroRenderer && heroCamera) {
      heroWidth = heroContainer.clientWidth || window.innerWidth;
      heroHeight = heroContainer.clientHeight || window.innerHeight;
      heroCamera.aspect = heroWidth / heroHeight;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(heroWidth, heroHeight);
    }
  });

  // Card Mouse Hover Tilting (Local Glare)
  function initCardHoverTilt() {
    const cards = document.querySelectorAll(".product-card, .capsule-card, .category-card");
    cards.forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-10px) translateZ(20px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCardHoverTilt);
  } else {
    initCardHoverTilt();
  }
  window.reinitCard3DTilt = initCardHoverTilt;

  // =========================================================================
  // 8. LUSION MONOGRAM FLOATING DOCK CONTROLLER
  // =========================================================================
  window.toggleLusionDock = function() {
    const dock = document.getElementById("lusionDock");
    const trigger = document.getElementById("lusionDockTrigger");
    if (!dock) return;

    const isExpanded = dock.classList.toggle("expanded");
    if (trigger) {
      trigger.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }
    if (window.playMechanicalTick) window.playMechanicalTick();
  };

  // Close dock when clicking outside
  document.addEventListener("click", (e) => {
    const dock = document.getElementById("lusionDock");
    if (dock && dock.classList.contains("expanded")) {
      if (!dock.contains(e.target)) {
        dock.classList.remove("expanded");
        const trigger = document.getElementById("lusionDockTrigger");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      }
    }
  });

  window.selectDockCurrency = function(curCode) {
    if (window.CURRENCIES && window.CURRENCIES[curCode]) {
      if (window.settings) {
        window.settings.currency = curCode;
        localStorage.setItem("starshine_settings", JSON.stringify(window.settings));
      }
      const curSelect = document.getElementById("currencySelect");
      if (curSelect) curSelect.value = curCode;

      document.querySelectorAll(".btn-dock-currency").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-cur") === curCode);
      });

      if (window.renderProducts) window.renderProducts();
      if (window.updateCartUI) window.updateCartUI();
      if (window.showToast) window.showToast(`✦ Currency switched to ${curCode}`);
      if (window.playMechanicalTick) window.playMechanicalTick();
    }
  };

  window.setStoreAestheticTheme = function(themeName) {
    if (!themeName) themeName = "obsidian";

    if (themeName === "obsidian") {
      heroKey.color.setHex(0xfff7e6);
      heroFill.color.setHex(0xd4af37);
      if (bgDirLight) bgDirLight.color.setHex(0xd4af37);
      if (ringMat) ringMat.color.setHex(0xd4af37);
    } else if (themeName === "steez") {
      heroKey.color.setHex(0x00f5d4);
      heroFill.color.setHex(0xff007a);
      if (bgDirLight) bgDirLight.color.setHex(0x00f5d4);
      if (ringMat) ringMat.color.setHex(0x00f5d4);
    } else if (themeName === "ivory") {
      heroKey.color.setHex(0xfff8ee);
      heroFill.color.setHex(0xb88630);
      if (bgDirLight) bgDirLight.color.setHex(0xc5a880);
      if (ringMat) ringMat.color.setHex(0xa67c2e);
    } else if (themeName === "contrast") {
      heroKey.color.setHex(0xffffff);
      heroFill.color.setHex(0xffd700);
      if (bgDirLight) bgDirLight.color.setHex(0xffd700);
      if (ringMat) ringMat.color.setHex(0xffd700);
    }

    // Sync dock atmosphere buttons if present
    document.querySelectorAll(".btn-dock-theme, .btn-dock-atmos").forEach(btn => {
      const bTheme = btn.getAttribute("data-style") || btn.getAttribute("data-theme") || btn.getAttribute("data-atmos");
      btn.classList.toggle("active", bTheme === themeName);
    });
  };

  // Backwards compatibility for dock atmosphere preset buttons
  window.setAtmospherePreset = function(preset) {
    const map = { warm: "obsidian", cyber: "steez", platinum: "contrast" };
    const theme = map[preset] || preset;
    if (window.switchStoreStyle) {
      window.switchStoreStyle(theme, true);
    } else {
      window.setStoreAestheticTheme(theme);
    }
  };

  window.openWhatsAppChat = function() {
    const cleanNumber = (window.settings && window.settings.whatsappNumber) ? window.settings.whatsappNumber.replace(/[^0-9]/g, "") : "2348012345678";
    const store = (window.settings && window.settings.storeName) ? window.settings.storeName : "STARSHINE STEEZ";
    const msg = encodeURIComponent(`Hello ${store} Concierge! I am browsing your luxury collection and would like assistance with an order.`);
    window.open(`https://wa.me/${cleanNumber}?text=${msg}`, "_blank");
  };

})();

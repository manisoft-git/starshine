/**
 * STARSHINE HAUTE 3D SUITE — LUSION-GRADE FULL-VIEWPORT WEBGL EXPERIENCE
 * Inspired by https://lusion.co/
 * 
 * Features:
 * - Full-Viewport Interactive 3D Hero Stage with Physics & Parallax
 * - Multi-Model 3D Switcher:
 *    1. Watch: Celestial Skeleton Tourbillon (Working gears, balance wheel, exploded view)
 *    2. Sneaker: Luxury Nappa Court Sneaker (Sole, upper, collar, laces, gold monogram)
 *    3. Jewelry: 24K Sovereign Signet Ring with Faceted Brilliant Diamond
 *    4. Eyewear: Titanium Aviator Sunglasses with Polarized Curved Lenses
 * - Real-Time Material Shaders (18K Champagne Gold, Platinum Chrome, Obsidian Ceramic, Rose Gold)
 * - Exploded Architecture Animation
 * - X-Ray Holographic Wireframe Mode
 * - Real-Time Telemetry HUD (Rotation Angles, FPS, Caliber/Materials)
 * - Mouse Studio Lighting & Inertia Orbit Controls
 * - Floating Stardust Particle Field & Parallax Background Geometry
 */

(function() {
  'use strict';

  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!window.THREE || !isWebGLAvailable()) {
    console.warn("WebGL or Three.js not available.");
    return;
  }

  // =========================================================================
  // 1. FULL-VIEWPORT 3D HERO CANVAS SETUP
  // =========================================================================
  const canvas = document.getElementById('webgl-hero-canvas');
  if (!canvas) return;

  const container = canvas.parentElement;
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
  camera.position.set(0, 0, 16);

  // Generate Procedural Studio Environment Reflection Map (Simulates High-End Studio Softbox Lighting)
  const envCanvas = document.createElement('canvas');
  envCanvas.width = 512;
  envCanvas.height = 256;
  const envCtx = envCanvas.getContext('2d');
  
  // Dark luxury gradient base
  const bgGrad = envCtx.createLinearGradient(0, 0, 0, 256);
  bgGrad.addColorStop(0, '#0a0d14');
  bgGrad.addColorStop(0.5, '#161922');
  bgGrad.addColorStop(1, '#05070a');
  envCtx.fillStyle = bgGrad;
  envCtx.fillRect(0, 0, 512, 256);

  // Studio Softbox highlights (Gold & White)
  const softbox1 = envCtx.createRadialGradient(180, 80, 0, 180, 80, 90);
  softbox1.addColorStop(0, 'rgba(255, 250, 230, 0.95)');
  softbox1.addColorStop(0.5, 'rgba(212, 175, 55, 0.6)');
  softbox1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  envCtx.fillStyle = softbox1;
  envCtx.fillRect(0, 0, 512, 256);

  const softbox2 = envCtx.createRadialGradient(380, 160, 0, 380, 160, 110);
  softbox2.addColorStop(0, 'rgba(220, 240, 255, 0.8)');
  softbox2.addColorStop(0.6, 'rgba(56, 189, 248, 0.3)');
  softbox2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  envCtx.fillStyle = softbox2;
  envCtx.fillRect(0, 0, 512, 256);

  const envTexture = new THREE.CanvasTexture(envCanvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envTexture;

  // Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfff8ea, 3.2);
  keyLight.position.set(12, 18, 14);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xd4af37, 1.8);
  fillLight.position.set(-15, -10, 10);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x60a5fa, 2.5, 50);
  rimLight.position.set(0, -15, -10);
  scene.add(rimLight);

  // Interactive Dynamic Spotlight that tracks mouse
  const dynamicSpot = new THREE.PointLight(0xfff1cc, 2.8, 40);
  dynamicSpot.position.set(0, 4, 12);
  scene.add(dynamicSpot);

  // =========================================================================
  // 2. FLOATING STARDUST & AMBIENT PARALLAX BACKGROUND GEOMETRIES
  // =========================================================================
  const dustCount = 800;
  const dustGeo = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(dustCount * 3);
  const dustVelocities = [];

  for (let i = 0; i < dustCount; i++) {
    dustPositions[i * 3] = (Math.random() - 0.5) * 70;
    dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 70;
    dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    dustVelocities.push({
      x: (Math.random() - 0.5) * 0.012,
      y: 0.008 + Math.random() * 0.015,
      z: (Math.random() - 0.5) * 0.012
    });
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

  // Particle Canvas
  const pCan = document.createElement('canvas');
  pCan.width = 32;
  pCan.height = 32;
  const pCtx = pCan.getContext('2d');
  const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  pGrad.addColorStop(0.25, 'rgba(245, 231, 184, 0.9)');
  pGrad.addColorStop(0.6, 'rgba(212, 175, 55, 0.4)');
  pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  pCtx.fillStyle = pGrad;
  pCtx.fillRect(0, 0, 32, 32);

  const dustTex = new THREE.CanvasTexture(pCan);
  const dustMat = new THREE.PointsMaterial({
    size: 1.1,
    map: dustTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const dustSystem = new THREE.Points(dustGeo, dustMat);
  scene.add(dustSystem);

  // Floating Luxury Orbit Rings in Background
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  const goldRibbonMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.15,
    envMap: envTexture
  });

  const ribbonGeo = new THREE.TorusKnotGeometry(5.2, 0.7, 140, 24, 2, 3);
  const backgroundRibbon = new THREE.Mesh(ribbonGeo, goldRibbonMat);
  backgroundRibbon.position.set(24, 8, -12);
  orbitGroup.add(backgroundRibbon);

  const glassOctGeo = new THREE.OctahedronGeometry(4.0, 0);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    opacity: 1,
    transparent: true,
    roughness: 0.08,
    ior: 1.6,
    thickness: 1.5,
    envMap: envTexture
  });
  const backgroundDiamond = new THREE.Mesh(glassOctGeo, glassMat);
  backgroundDiamond.position.set(-24, -8, -10);
  orbitGroup.add(backgroundDiamond);

  // =========================================================================
  // 3. MASTER 3D SHOWROOM ROOT & MATERIAL LIBRARY
  // =========================================================================
  const stageRoot = new THREE.Group();
  scene.add(stageRoot);
  stageRoot.position.set(2.5, 0, 0); // Positioned slightly to the right for editorial balance with left typography

  const FINISH_MATERIALS = {
    gold: {
      name: "18K Champagne Gold",
      metal: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.16, envMap: envTexture }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x181a20, metalness: 0.85, roughness: 0.25, envMap: envTexture }),
      accent: new THREE.MeshStandardMaterial({ color: 0xfff0a0, metalness: 0.98, roughness: 0.1, envMap: envTexture }),
      leather: new THREE.MeshStandardMaterial({ color: 0x1f1b18, roughness: 0.82, metalness: 0.1 }),
      glass: glassMat
    },
    platinum: {
      name: "Platinum Silver & Steel",
      metal: new THREE.MeshStandardMaterial({ color: 0xedf2f7, metalness: 0.98, roughness: 0.12, envMap: envTexture }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x2d3748, metalness: 0.9, roughness: 0.2, envMap: envTexture }),
      accent: new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.95, roughness: 0.1, envMap: envTexture }),
      leather: new THREE.MeshStandardMaterial({ color: 0x1a202c, roughness: 0.85, metalness: 0.1 }),
      glass: glassMat
    },
    ceramic: {
      name: "Midnight Obsidian Ceramic",
      metal: new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.35, roughness: 0.08, envMap: envTexture }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x07080a, metalness: 0.9, roughness: 0.15, envMap: envTexture }),
      accent: new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.12, envMap: envTexture }),
      leather: new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.88, metalness: 0.05 }),
      glass: glassMat
    },
    rosegold: {
      name: "Rose Gold & Royal Bronze",
      metal: new THREE.MeshStandardMaterial({ color: 0xb76e79, metalness: 0.94, roughness: 0.15, envMap: envTexture }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x24171a, metalness: 0.8, roughness: 0.28, envMap: envTexture }),
      accent: new THREE.MeshStandardMaterial({ color: 0xfbcfe8, metalness: 0.95, roughness: 0.1, envMap: envTexture }),
      leather: new THREE.MeshStandardMaterial({ color: 0x2a1e22, roughness: 0.82, metalness: 0.1 }),
      glass: glassMat
    }
  };

  let currentFinish = 'gold';
  let activeModelIndex = 0; // 0: Watch, 1: Sneaker, 2: Ring, 3: Eyewear
  let isExploded = false;
  let isWireframe = false;
  let autoSpin = true;

  // =========================================================================
  // 4. PROCEDURAL 3D MODELS CREATION
  // =========================================================================
  const models = [];

  // -------------------------------------------------------------------------
  // MODEL 1: THE CELESTIAL SKELETON TOURBILLON WATCH
  // -------------------------------------------------------------------------
  const watchModel = new THREE.Group();
  watchModel.name = "watch";
  const watchParts = {};

  // Case & Fluted Bezel
  const caseGeo = new THREE.CylinderGeometry(4.2, 4.4, 1.15, 64);
  watchParts.bezel = new THREE.Mesh(caseGeo, FINISH_MATERIALS[currentFinish].metal);
  watchParts.bezel.rotation.x = Math.PI / 2;
  watchModel.add(watchParts.bezel);

  const flutedGeo = new THREE.TorusGeometry(4.25, 0.16, 16, 64);
  watchParts.fluted = new THREE.Mesh(flutedGeo, FINISH_MATERIALS[currentFinish].metal);
  watchParts.fluted.position.z = 0.58;
  watchModel.add(watchParts.fluted);

  // Dial Face with Sunburst Cutout
  const dialGeo = new THREE.CylinderGeometry(3.8, 3.8, 0.14, 64);
  watchParts.dial = new THREE.Mesh(dialGeo, FINISH_MATERIALS[currentFinish].darkMetal);
  watchParts.dial.rotation.x = Math.PI / 2;
  watchParts.dial.position.z = 0.38;
  watchModel.add(watchParts.dial);

  // Hour Indices
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const batonGeo = new THREE.BoxGeometry(i % 3 === 0 ? 0.28 : 0.14, 0.7, 0.12);
    const baton = new THREE.Mesh(batonGeo, FINISH_MATERIALS[currentFinish].accent);
    baton.position.set(Math.cos(angle) * 3.15, Math.sin(angle) * 3.15, 0.1);
    baton.rotation.z = angle + Math.PI / 2;
    watchParts.dial.add(baton);
  }

  // Tourbillon Cage (Rotating Mechanical Assembly)
  const tourbGroup = new THREE.Group();
  tourbGroup.position.set(0, -1.3, 0.48);
  watchModel.add(tourbGroup);
  watchParts.tourbillon = tourbGroup;

  const tourbRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.08, 16, 32), FINISH_MATERIALS[currentFinish].accent);
  tourbGroup.add(tourbRing);

  for (let a = 0; a < 3; a++) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.05), FINISH_MATERIALS[currentFinish].accent);
    arm.rotation.z = (a / 3) * Math.PI;
    tourbGroup.add(arm);
  }

  // Watch Hands
  watchParts.hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.0, 0.08), FINISH_MATERIALS[currentFinish].accent);
  watchParts.hourHand.position.set(0, 0.7, 0.6);
  watchModel.add(watchParts.hourHand);

  watchParts.minHand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.8, 0.08), FINISH_MATERIALS[currentFinish].accent);
  watchParts.minHand.position.set(0, 1.0, 0.65);
  watchModel.add(watchParts.minHand);

  watchParts.secHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.2, 0.04), new THREE.MeshBasicMaterial({ color: 0xd4af37 }));
  watchParts.secHand.position.set(0, 1.15, 0.7);
  watchModel.add(watchParts.secHand);

  // Sapphire Glass Crystal
  watchParts.crystal = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.0, 0.1, 64), FINISH_MATERIALS[currentFinish].glass);
  watchParts.crystal.rotation.x = Math.PI / 2;
  watchParts.crystal.position.z = 0.85;
  watchModel.add(watchParts.crystal);

  // Alligator Textured Leather Straps
  const strapGeo = new THREE.BoxGeometry(2.6, 4.4, 0.4);
  watchParts.topStrap = new THREE.Mesh(strapGeo, FINISH_MATERIALS[currentFinish].leather);
  watchParts.topStrap.position.set(0, 5.8, -0.2);
  watchModel.add(watchParts.topStrap);

  watchParts.btmStrap = new THREE.Mesh(strapGeo, FINISH_MATERIALS[currentFinish].leather);
  watchParts.btmStrap.position.set(0, -5.8, -0.2);
  watchModel.add(watchParts.btmStrap);

  // Winding Crown
  watchParts.crown = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.8, 24), FINISH_MATERIALS[currentFinish].metal);
  watchParts.crown.rotation.z = Math.PI / 2;
  watchParts.crown.position.set(4.7, 0, 0);
  watchModel.add(watchParts.crown);

  stageRoot.add(watchModel);
  models.push(watchModel);

  // -------------------------------------------------------------------------
  // MODEL 2: LUXURY NAPPA COURT SNEAKER / FOOTWEAR
  // -------------------------------------------------------------------------
  const sneakerModel = new THREE.Group();
  sneakerModel.name = "sneaker";
  sneakerModel.visible = false;
  const sneakerParts = {};

  // Sculpted Outsole
  const soleGeo = new THREE.BoxGeometry(3.6, 1.2, 9.2);
  sneakerParts.sole = new THREE.Mesh(soleGeo, new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.1 }));
  sneakerParts.sole.position.set(0, -1.8, 0);
  sneakerModel.add(sneakerParts.sole);

  // Leather Upper Body
  const upperGeo = new THREE.CylinderGeometry(1.7, 1.9, 8.4, 32);
  sneakerParts.upper = new THREE.Mesh(upperGeo, FINISH_MATERIALS[currentFinish].metal);
  sneakerParts.upper.rotation.x = Math.PI / 2;
  sneakerParts.upper.position.set(0, -0.6, 0);
  sneakerModel.add(sneakerParts.upper);

  // Padded Ankle Collar
  const collarGeo = new THREE.TorusGeometry(1.6, 0.45, 16, 32);
  sneakerParts.collar = new THREE.Mesh(collarGeo, FINISH_MATERIALS[currentFinish].leather);
  sneakerParts.collar.rotation.x = Math.PI / 2;
  sneakerParts.collar.position.set(0, 0.6, -1.8);
  sneakerModel.add(sneakerParts.collar);

  // Gold Monogram Emblem Plaque on Heel
  const plaqueGeo = new THREE.BoxGeometry(1.2, 0.8, 0.1);
  sneakerParts.plaque = new THREE.Mesh(plaqueGeo, FINISH_MATERIALS[currentFinish].accent);
  sneakerParts.plaque.position.set(0, 0.2, -4.2);
  sneakerModel.add(sneakerParts.plaque);

  // Waxed Cotton Laces (Layered bars)
  for (let l = 0; l < 5; l++) {
    const laceGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16);
    const lace = new THREE.Mesh(laceGeo, FINISH_MATERIALS[currentFinish].accent);
    lace.rotation.z = Math.PI / 2;
    lace.position.set(0, 0.4 + l * 0.12, -0.6 + l * 0.85);
    sneakerModel.add(lace);
  }

  stageRoot.add(sneakerModel);
  models.push(sneakerModel);

  // -------------------------------------------------------------------------
  // MODEL 3: 24K SOVEREIGN SIGNET RING WITH SOLITAIRE DIAMOND
  // -------------------------------------------------------------------------
  const ringModel = new THREE.Group();
  ringModel.name = "ring";
  ringModel.visible = false;
  const ringParts = {};

  // Heavy Gold Signet Band
  const bandGeo = new THREE.TorusGeometry(3.6, 1.1, 32, 64);
  ringParts.band = new THREE.Mesh(bandGeo, FINISH_MATERIALS[currentFinish].metal);
  ringParts.band.rotation.x = Math.PI / 3;
  ringModel.add(ringParts.band);

  // Crown Crest Platform
  const crestGeo = new THREE.CylinderGeometry(2.4, 2.0, 0.8, 8); // Octagonal signet head
  ringParts.crest = new THREE.Mesh(crestGeo, FINISH_MATERIALS[currentFinish].metal);
  ringParts.crest.position.set(0, 3.8, 0.4);
  ringParts.crest.rotation.x = 0.2;
  ringModel.add(ringParts.crest);

  // Brilliant-Cut Solitaire Diamond (Faceted double cone)
  const diamondGeo = new THREE.OctahedronGeometry(1.4, 2);
  ringParts.diamond = new THREE.Mesh(diamondGeo, FINISH_MATERIALS[currentFinish].glass);
  ringParts.diamond.position.set(0, 4.4, 0.5);
  ringModel.add(ringParts.diamond);

  stageRoot.add(ringModel);
  models.push(ringModel);

  // -------------------------------------------------------------------------
  // MODEL 4: TITANIUM POLARIZED AVIATOR EYEWEAR
  // -------------------------------------------------------------------------
  const glassesModel = new THREE.Group();
  glassesModel.name = "eyewear";
  glassesModel.visible = false;
  const glassParts = {};

  // Teardrop Left & Right Lenses (Curved discs)
  const lensGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.08, 32);
  glassParts.leftLens = new THREE.Mesh(lensGeo, new THREE.MeshPhysicalMaterial({
    color: 0x1e3a5f, // Emerald / Deep Blue Polarized
    transmission: 0.85,
    opacity: 0.9,
    transparent: true,
    roughness: 0.05,
    ior: 1.55,
    envMap: envTexture
  }));
  glassParts.leftLens.rotation.x = Math.PI / 2;
  glassParts.leftLens.position.set(-2.8, 0, 0);
  glassesModel.add(glassParts.leftLens);

  glassParts.rightLens = glassParts.leftLens.clone();
  glassParts.rightLens.position.set(2.8, 0, 0);
  glassesModel.add(glassParts.rightLens);

  // Aerospace Titanium Rims
  const rimLeft = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.1, 16, 48), FINISH_MATERIALS[currentFinish].metal);
  rimLeft.position.set(-2.8, 0, 0);
  glassesModel.add(rimLeft);
  glassParts.rimLeft = rimLeft;

  const rimRight = rimLeft.clone();
  rimRight.position.set(2.8, 0, 0);
  glassesModel.add(rimRight);
  glassParts.rimRight = rimRight;

  // Double Bridge Wire
  const bridgeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 16), FINISH_MATERIALS[currentFinish].metal);
  bridgeTop.rotation.z = Math.PI / 2;
  bridgeTop.position.set(0, 1.2, 0);
  glassesModel.add(bridgeTop);
  glassParts.bridgeTop = bridgeTop;

  const bridgeBtm = bridgeTop.clone();
  bridgeBtm.position.set(0, 0.3, 0);
  glassesModel.add(bridgeBtm);
  glassParts.bridgeBtm = bridgeBtm;

  // Temples (Arms extending backwards)
  const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 6.5, 16);
  const leftArm = new THREE.Mesh(armGeo, FINISH_MATERIALS[currentFinish].metal);
  leftArm.rotation.x = Math.PI / 2;
  leftArm.position.set(-5.2, 0.5, -3.2);
  glassesModel.add(leftArm);
  glassParts.leftArm = leftArm;

  const rightArm = leftArm.clone();
  rightArm.position.set(5.2, 0.5, -3.2);
  glassesModel.add(rightArm);
  glassParts.rightArm = rightArm;

  stageRoot.add(glassesModel);
  models.push(glassesModel);

  // Initial Root Rotation
  stageRoot.rotation.x = 0.25;
  stageRoot.rotation.y = -0.35;

  // =========================================================================
  // 5. INTERACTION & ORBIT PHYSICS
  // =========================================================================
  let isDragging = false;
  let prevPointer = { x: 0, y: 0 };
  let velocity = { x: 0, y: 0 };
  let mouseNorm = { x: 0, y: 0 };

  // Exploded View Coordinates
  const watchDefaultZ = { crystal: 0.85, dial: 0.38, fluted: 0.58, bezel: 0, tourbillon: 0.48, topStrap: -0.2, btmStrap: -0.2 };
  const watchExplodedZ = { crystal: 3.8, dial: 2.0, fluted: 3.0, bezel: 0, tourbillon: 2.6, topStrap: -2.8, btmStrap: -2.8 };

  const sneakerDefaultY = { upper: -0.6, collar: 0.6, plaque: 0.2, sole: -1.8 };
  const sneakerExplodedY = { upper: 1.2, collar: 3.0, plaque: -0.8, sole: -3.5 };

  // Mouse / Touch Events
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    autoSpin = false;
    prevPointer = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    mouseNorm.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseNorm.y = -(e.clientY / window.innerHeight - 0.5) * 2;

    // Shift dynamic studio light with mouse
    dynamicSpot.position.x = mouseNorm.x * 12;
    dynamicSpot.position.y = mouseNorm.y * 10;

    if (!isDragging) return;
    const deltaX = e.clientX - prevPointer.x;
    const deltaY = e.clientY - prevPointer.y;

    velocity.x = deltaY * 0.005;
    velocity.y = deltaX * 0.005;

    stageRoot.rotation.x += velocity.x;
    stageRoot.rotation.y += velocity.y;

    prevPointer = { x: e.clientX, y: e.clientY };
  });

  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      autoSpin = false;
      prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevPointer.x;
    const deltaY = e.touches[0].clientY - prevPointer.y;

    stageRoot.rotation.x += deltaY * 0.006;
    stageRoot.rotation.y += deltaX * 0.006;

    prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });

  // Scroll Parallax Transition
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // =========================================================================
  // 6. PUBLIC CONTROL APIs (SWITCHERS, FINISHES, EXPLODE, WIREFRAME)
  // =========================================================================
  window.switch3DModel = function(index) {
    if (index < 0 || index >= models.length) return;
    activeModelIndex = index;
    isExploded = false;

    models.forEach((m, i) => {
      m.visible = (i === index);
    });

    // Update active tab button in HUD
    document.querySelectorAll('.btn-3d-model-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });

    // Update Telemetry & Text
    const titles = [
      "Aethelgard Celestial Skeleton Tourbillon",
      "Aura Handcrafted Italian Nappa Court Sneaker",
      "Starshine 24K Sovereign Signet Ring",
      "Titanium Aerospace Polarized Aviators"
    ];
    const categories = ["HOROLOGY & TIMEPIECES", "ARTISAN FOOTWEAR", "FINE JEWELRY & MONOGRAMS", "AEROSPACE EYEWEAR"];
    const calibers = ["CALIBER: STR-09 SKELETON", "GRAIN: TUSCAN NAPPA CALF", "PURITY: 24K (999‰) SOLID GOLD", "FRAME: GRADE 5 TITANIUM"];

    const titleEl = document.getElementById('hero3DTitle');
    const catEl = document.getElementById('hero3DCategory');
    const calEl = document.getElementById('hero3DCaliber');

    if (titleEl) titleEl.textContent = titles[index];
    if (catEl) catEl.textContent = categories[index];
    if (calEl) calEl.textContent = calibers[index];

    if (window.showToast) {
      window.showToast(`✦ Switched 3D Stage: ${titles[index]}`);
    }
  };

  window.set3DFinish = function(finishKey) {
    if (!FINISH_MATERIALS[finishKey]) return;
    currentFinish = finishKey;
    const mat = FINISH_MATERIALS[finishKey];

    // Update Watch Materials
    watchParts.bezel.material = mat.metal;
    watchParts.fluted.material = mat.metal;
    watchParts.dial.material = mat.darkMetal;
    watchParts.hourHand.material = mat.accent;
    watchParts.minHand.material = mat.accent;
    watchParts.crown.material = mat.metal;
    watchParts.topStrap.material = mat.leather;
    watchParts.btmStrap.material = mat.leather;

    // Update Sneaker Materials
    sneakerParts.upper.material = mat.metal;
    sneakerParts.collar.material = mat.leather;
    sneakerParts.plaque.material = mat.accent;

    // Update Ring Materials
    ringParts.band.material = mat.metal;
    ringParts.crest.material = mat.metal;

    // Update Glasses Materials
    glassParts.rimLeft.material = mat.metal;
    glassParts.rimRight.material = mat.metal;
    glassParts.bridgeTop.material = mat.metal;
    glassParts.bridgeBtm.material = mat.metal;
    glassParts.leftArm.material = mat.metal;
    glassParts.rightArm.material = mat.metal;

    // Update HUD Buttons
    document.querySelectorAll('.btn-3d-finish').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-finish') === finishKey);
    });

    const matReadout = document.getElementById('hero3DMaterialReadout');
    if (matReadout) matReadout.textContent = mat.name;

    if (window.showToast) {
      window.showToast(`✦ 3D Precious Finish: ${mat.name}`);
    }
  };

  window.toggleExplodedView = function() {
    isExploded = !isExploded;
    const btn = document.getElementById('btnExplodedView');
    if (btn) {
      btn.classList.toggle('active', isExploded);
      btn.textContent = isExploded ? "Assemble Architecture" : "Explode Architecture";
    }
    if (window.showToast) {
      window.showToast(isExploded ? "✦ Exploded Mechanical Architecture View" : "✦ Assembled Precision Fit");
    }
  };

  window.toggleWireframeMode = function() {
    isWireframe = !isWireframe;
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material && obj !== dustSystem && obj !== backgroundDiamond) {
        obj.material.wireframe = isWireframe;
      }
    });

    const btn = document.getElementById('btnWireframeMode');
    if (btn) btn.classList.toggle('active', isWireframe);

    if (window.showToast) {
      window.showToast(isWireframe ? "✦ Holographic X-Ray Wireframe" : "✦ Solid PBR Luxury Shader");
    }
  };

  window.reset3DView = function() {
    stageRoot.rotation.set(0.25, -0.35, 0);
    autoSpin = true;
  };

  // =========================================================================
  // 7. ANIMATION LOOP & TELEMETRY
  // =========================================================================
  let time = 0;
  let lastTime = performance.now();
  let frameCount = 0;
  let fps = 60;

  const rotTelemetry = document.getElementById('hero3DRotTelemetry');
  const fpsTelemetry = document.getElementById('hero3DFpsTelemetry');

  function animate() {
    requestAnimationFrame(animate);
    time += 0.02;

    // FPS Counter
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastTime));
      frameCount = 0;
      lastTime = now;
      if (fpsTelemetry) fpsTelemetry.textContent = `FPS: ${fps}`;
    }

    // Auto spin and inertia
    if (!isDragging) {
      if (autoSpin) {
        stageRoot.rotation.y += 0.004;
      } else {
        stageRoot.rotation.x += velocity.x;
        stageRoot.rotation.y += velocity.y;
        velocity.x *= 0.94;
        velocity.y *= 0.94;
      }
    }

    // Subtle floating breath effect
    stageRoot.position.y = Math.sin(time * 1.5) * 0.3;

    // Update Telemetry Display
    if (rotTelemetry) {
      const degX = Math.round((stageRoot.rotation.x * 180 / Math.PI) % 360);
      const degY = Math.round((stageRoot.rotation.y * 180 / Math.PI) % 360);
      rotTelemetry.textContent = `ROTATION: X: ${degX}° | Y: ${degY}°`;
    }

    // Exploded View Lerp for Watch
    const targetWZ = isExploded ? watchExplodedZ : watchDefaultZ;
    watchParts.crystal.position.z += (targetWZ.crystal - watchParts.crystal.position.z) * 0.08;
    watchParts.dial.position.z += (targetWZ.dial - watchParts.dial.position.z) * 0.08;
    watchParts.fluted.position.z += (targetWZ.fluted - watchParts.fluted.position.z) * 0.08;
    watchParts.tourbillon.position.z += (targetWZ.tourbillon - watchParts.tourbillon.position.z) * 0.08;
    watchParts.topStrap.position.z += (targetWZ.topStrap - watchParts.topStrap.position.z) * 0.08;
    watchParts.btmStrap.position.z += (targetWZ.btmStrap - watchParts.btmStrap.position.z) * 0.08;

    // Exploded View Lerp for Sneaker
    const targetSY = isExploded ? sneakerExplodedY : sneakerDefaultY;
    sneakerParts.upper.position.y += (targetSY.upper - sneakerParts.upper.position.y) * 0.08;
    sneakerParts.collar.position.y += (targetSY.collar - sneakerParts.collar.position.y) * 0.08;
    sneakerParts.plaque.position.y += (targetSY.plaque - sneakerParts.plaque.position.y) * 0.08;
    sneakerParts.sole.position.y += (targetSY.sole - sneakerParts.sole.position.y) * 0.08;

    // Watch Mechanical Ticking
    watchParts.tourbillon.rotation.z = Math.sin(time * 8) * 0.5 + time * 0.6;
    watchParts.secHand.rotation.z -= 0.035;
    watchParts.minHand.rotation.z -= 0.004;
    watchParts.hourHand.rotation.z -= 0.001;

    // Rotate Background Geometry in parallax
    backgroundRibbon.rotation.x += 0.005;
    backgroundRibbon.rotation.y += 0.007;
    backgroundDiamond.rotation.x -= 0.004;
    backgroundDiamond.rotation.y += 0.006;

    // Camera Parallax
    const targetCamX = mouseNorm.x * 2.5;
    const targetCamY = mouseNorm.y * 2.5 - scrollY * 0.006;
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.lookAt(0, -scrollY * 0.006, 0);

    // Update Particles
    const pos = dustGeo.attributes.position.array;
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3 + 1] += dustVelocities[i].y;
      pos[i * 3] += dustVelocities[i].x;
      if (pos[i * 3 + 1] > 35) pos[i * 3 + 1] = -35;
    }
    dustGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  // Resize Listener
  window.addEventListener('resize', () => {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  // =========================================================================
  // 8. 3D CARD PERSPECTIVE TILT
  // =========================================================================
  function init3DCardTilt() {
    const cards = document.querySelectorAll('.product-card, .capsule-card, .category-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DCardTilt);
  } else {
    init3DCardTilt();
  }
  window.reinitCard3DTilt = init3DCardTilt;

})();

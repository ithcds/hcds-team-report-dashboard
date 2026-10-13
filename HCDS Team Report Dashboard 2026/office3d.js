// ─────────────────────────────────────────────────────────────
// HCDS Virtual 3D Office Engine (Three.js Low-Poly Procedural)
// Tailored for HCDS HQ: Healthcare Digital Solutions, Inc.
// ─────────────────────────────────────────────────────────────
import * as THREE from './vendor/three.module.js';
import { OrbitControls } from './vendor/OrbitControls.js';

// ---------- Color Palettes & Styles ----------
const COLORS = {
  skin: '#e2ab82',
  pants: '#334155',
  woodFloor: '#96623e',
  wallLight: '#cbd5e1',
  wallDark: '#334155',
  deskSurface: '#f1f5f9',
  deskLeg: '#64748b',
  chairLeather: '#1e293b',
  executiveWood: '#582f0e',
  catOrange: '#ea580c',
  catOrangeLight: '#fb923c'
};

// Team styling & personality mapping
const TEAM_CONFIG = {
  'kusnoto': {
    id: 'kusnoto',
    name: 'dr. Kusnoto',
    role: 'CEO & Co-Founder',
    cluster: 'Executive Suite',
    shirt: '#0284c7',
    hair: '#1e293b',
    accessories: 'suit',
    x: -6.5, z: -4.5, rot: Math.PI / 2
  },
  'flavio': {
    id: 'flavio',
    name: 'Dr. Flavio',
    role: 'CFO & Executive',
    cluster: 'Executive Suite',
    shirt: '#0d9488',
    hair: '#0f172a',
    accessories: 'tie',
    x: -6.5, z: -2.0, rot: Math.PI / 2
  },
  'aryo': {
    id: 'aryo',
    name: 'Master Aryo',
    role: 'Chief System Architect',
    cluster: 'Architect Bay',
    shirt: '#1e293b',
    hair: '#0f172a',
    accessories: 'matrix_screens',
    x: -1.5, z: -4.5, rot: 0
  },
  'ringo': {
    id: 'ringo',
    name: 'Mas Ringo',
    role: 'Senior Infra Admin',
    cluster: 'Cloud & Infrastructure',
    shirt: '#16a34a',
    hair: '#1e293b',
    accessories: 'coffee_mug',
    x: 2.2, z: -4.5, rot: 0
  },
  'acid': {
    id: 'acid',
    name: 'Seus Acid',
    role: 'iSmartOffice Team Lead',
    cluster: 'iSmartOffice Team',
    shirt: '#db2777',
    hair: '#713f12',
    accessories: 'glasses',
    x: -6.5, z: 2.5, rot: Math.PI
  },
  'rangga': {
    id: 'rangga',
    name: 'Mas Rangga',
    role: 'Clinical Finding & UI Dev',
    cluster: 'iSmartOffice Team',
    shirt: '#f97316',
    hair: '#1e293b',
    accessories: 'headphones',
    x: -4.2, z: 2.5, rot: Math.PI
  },
  'yudi': {
    id: 'yudi',
    name: 'Mas Yudi',
    role: 'Tester & Designer Support',
    cluster: 'iSmartOffice Team',
    shirt: '#eab308',
    hair: '#1e293b',
    accessories: 'tablet',
    x: -1.9, z: 2.5, rot: Math.PI
  },
  'fikri': {
    id: 'fikri',
    name: 'Kang Fikri',
    role: 'Mobile Dev & Coordinator',
    cluster: 'Annie Insights Team',
    shirt: '#2563eb',
    hair: '#0f172a',
    accessories: 'peci',
    x: 2.2, z: 2.5, rot: Math.PI
  },
  'annie': {
    id: 'annie',
    name: 'Annie Team',
    role: 'Clinical Case Validator',
    cluster: 'Annie Insights Team',
    shirt: '#059669',
    hair: '#059669',
    accessories: 'hijab',
    x: 4.5, z: 2.5, rot: Math.PI
  },
  'kaboudan': {
    id: 'kaboudan',
    name: 'Dr. Kaboudan',
    role: 'Orthodontic & AI Advisor',
    cluster: 'Annie Insights Team',
    shirt: '#f8fafc',
    hair: '#64748b',
    accessories: 'lab_coat',
    x: 6.8, z: 2.5, rot: Math.PI,
    isDecoration: true
  },
  'ary': {
    id: 'ary',
    name: 'Mas Ary',
    role: 'Marketing & Outreach',
    cluster: 'Global Outreach',
    shirt: '#7c3aed',
    hair: '#1e293b',
    accessories: 'phone',
    x: 6.5, z: -4.5, rot: 0
  }
};

// Spots where cat "Oyen" roams
const CAT_SPOTS = [
  [-4.0, 0.0],
  [-7.5, 4.5], // Lounge rug
  [7.2, -1.5], // Coffee corner
  [0.0, -1.0], // Corridor center
  [-1.0, 4.0]  // iSmartOffice desk edge
];

// ---------- Three.js Scene Setup ----------
let renderer, scene, camera, controls, root, labelLayer;
let hemiLight, sunLight;
const people = {};
const clickables = [];
let cat = null;
let isNight = false;

// Geometry & Material caches
const matCache = new Map();
function getMaterial(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!matCache.has(key)) {
    matCache.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...opts }));
  }
  return matCache.get(key);
}

function createMesh(geo, material, x = 0, y = 0, z = 0, parent = null) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  if (parent) parent.add(m);
  return m;
}

const createBox = (w, h, d, color, x = 0, y = 0, z = 0, parent = null, opts = {}) =>
  createMesh(new THREE.BoxGeometry(w, h, d), typeof color === 'string' ? getMaterial(color, opts) : color, x, y, z, parent);

const createCylinder = (rt, rb, h, color, x = 0, y = 0, z = 0, parent = null, seg = 16) =>
  createMesh(new THREE.CylinderGeometry(rt, rb, h, seg), getMaterial(color), x, y, z, parent);

function createGroup(x = 0, z = 0, rotY = 0, parent = null) {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  if (parent) parent.add(g);
  return g;
}

function createCanvasTexture(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { canvas, ctx: canvas.getContext('2d'), tex };
}

// ---------- Procedural Textures & Skyline ----------
function createWoodTexture() {
  const { canvas, ctx, tex } = createCanvasTexture(512, 512);
  ctx.fillStyle = '#b47746';
  ctx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) {
    for (let x = -((y / 32) % 2) * 64; x < 512; x += 128) {
      const shade = 0.88 + Math.random() * 0.2;
      ctx.fillStyle = `rgb(${Math.floor(180 * shade)}, ${Math.floor(119 * shade)}, ${Math.floor(70 * shade)})`;
      ctx.fillRect(x, y, 128, 32);
      ctx.strokeStyle = 'rgba(70, 40, 20, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, 128, 32);
    }
  }
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 4);
  return tex;
}

function createSkylineTexture(night = false) {
  const { canvas, ctx, tex } = createCanvasTexture(512, 256);
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  if (night) {
    grad.addColorStop(0, '#0a1128');
    grad.addColorStop(1, '#1c2541');
  } else {
    grad.addColorStop(0, '#70b8f0');
    grad.addColorStop(1, '#d8efff');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Buildings
  let x = 0;
  while (x < 512) {
    const w = 35 + Math.random() * 55;
    const h = 70 + Math.random() * 160;
    ctx.fillStyle = night ? '#111936' : '#94a3b8';
    ctx.fillRect(x, 256 - h, w, h);
    // Windows
    for (let wy = 256 - h + 10; wy < 250; wy += 14) {
      for (let wx = x + 6; wx < x + w - 8; wx += 10) {
        if (night) {
          if (Math.random() < 0.4) {
            ctx.fillStyle = Math.random() < 0.7 ? '#fde047' : '#f8fafc';
            ctx.fillRect(wx, wy, 4, 6);
          }
        } else if (Math.random() < 0.5) {
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(wx, wy, 4, 6);
        }
      }
    }
    x += w + 3;
  }
  return tex;
}

// ---------- Build 3D Architecture ----------
function buildRoom() {
  // Floor
  const woodTex = createWoodTexture();
  const floorGeo = new THREE.PlaneGeometry(24, 16);
  const floorMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.85 });
  const floor = createMesh(floorGeo, floorMat, 0, 0, 0, scene);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;

  // Back Wall (Z = -8)
  createBox(24.4, 3.6, 0.3, '#cbd5e1', 0, 1.8, -8.1, scene);
  // Left Wall (X = -12)
  createBox(0.3, 3.6, 16.2, '#94a3b8', -12.1, 1.8, 0, scene);

  // Baseboards
  createBox(24, 0.15, 0.05, '#475569', 0, 0.075, -7.95, scene);
  createBox(0.05, 0.15, 16, '#475569', -11.95, 0.075, 0, scene);

  // Large Panorama Windows with Skyline
  const skyTex = createSkylineTexture(isNight);
  const makeWindow = (x, z, w, h) => {
    const pane = createMesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: skyTex }), x, 2.0, z, scene);
    pane.castShadow = false;
    // Frame
    createBox(w + 0.15, 0.1, 0.08, '#f8fafc', x, 2.0 + h / 2, z + 0.02, scene);
    createBox(w + 0.15, 0.1, 0.08, '#f8fafc', x, 2.0 - h / 2, z + 0.02, scene);
    createBox(0.1, h, 0.08, '#f8fafc', x - w / 2, 2.0, z + 0.02, scene);
    createBox(0.1, h, 0.08, '#f8fafc', x + w / 2, 2.0, z + 0.02, scene);
    return pane;
  };
  makeWindow(-7.5, -7.94, 3.8, 2.2);
  makeWindow(2.5, -7.94, 4.5, 2.2);

  // Restroom Door on Left Wall
  const doorGroup = createGroup(-11.94, 4.0, Math.PI / 2, scene);
  createBox(1.0, 2.3, 0.06, '#78350f', 0, 1.15, 0, doorGroup);
  createCylinder(0.03, 0.03, 0.15, '#e2e8f0', 0.38, 1.1, 0.08, doorGroup).rotation.x = Math.PI / 2;
  // Sign
  const doorSign = createCanvasTexture(256, 80);
  doorSign.ctx.fillStyle = '#0f172a';
  doorSign.ctx.fillRect(0, 0, 256, 80);
  doorSign.ctx.fillStyle = '#38bdf8';
  doorSign.ctx.font = 'bold 36px sans-serif';
  doorSign.ctx.textAlign = 'center';
  doorSign.ctx.fillText('RESTROOM', 128, 54);
  createMesh(new THREE.PlaneGeometry(0.65, 0.22), new THREE.MeshBasicMaterial({ map: doorSign.tex }), 0, 2.5, 0.04, doorGroup);
}

// ---------- Furniture Builders ----------
function buildChair(parent, x, z, rotY, leatherColor = COLORS.chairLeather) {
  const g = createGroup(x, z, rotY, parent);
  createBox(0.55, 0.08, 0.55, leatherColor, 0, 0.46, 0, g);
  createBox(0.55, 0.65, 0.08, leatherColor, 0, 0.82, -0.25, g);
  createCylinder(0.03, 0.03, 0.42, '#94a3b8', 0, 0.23, 0, g);
  // Five-star base
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    createBox(0.04, 0.03, 0.26, '#334155', Math.sin(angle) * 0.12, 0.04, Math.cos(angle) * 0.12, g).rotation.y = angle;
  }
  return g;
}

function buildDesk(parent, x, z, w = 1.6, d = 0.8, isExec = false) {
  const g = createGroup(x, z, 0, parent);
  const surfaceColor = isExec ? COLORS.executiveWood : COLORS.deskSurface;
  const legColor = isExec ? '#3f1d0b' : COLORS.deskLeg;
  // Table top
  createBox(w, 0.06, d, surfaceColor, 0, 0.74, 0, g);
  // Legs
  const lx = w / 2 - 0.06;
  const lz = d / 2 - 0.06;
  createBox(0.05, 0.71, 0.05, legColor, -lx, 0.355, -lz, g);
  createBox(0.05, 0.71, 0.05, legColor, lx, 0.355, -lz, g);
  createBox(0.05, 0.71, 0.05, legColor, -lx, 0.355, lz, g);
  createBox(0.05, 0.71, 0.05, legColor, lx, 0.355, lz, g);
  return g;
}

function buildMonitor(parent, x, z, rotY = 0, screenColor = '#38bdf8') {
  const g = createGroup(x, z, rotY, parent);
  createBox(0.65, 0.42, 0.03, '#0f172a', 0, 1.05, 0, g);
  // Screen emissive
  const screen = createBox(0.6, 0.37, 0.01, screenColor, 0, 1.05, 0.018, g, {
    emissive: screenColor,
    emissiveIntensity: 0.5
  });
  createBox(0.05, 0.25, 0.03, '#475569', 0, 0.88, -0.01, g);
  createBox(0.25, 0.02, 0.18, '#334155', 0, 0.75, 0, g);
  // Keyboard
  createBox(0.42, 0.015, 0.15, '#1e293b', 0, 0.75, 0.22, g);
  return screen;
}

function buildServerRack(x, z) {
  const g = createGroup(x, z, 0, scene);
  createBox(0.8, 2.2, 0.8, '#0f172a', 0, 1.1, 0, g);
  createBox(0.72, 2.1, 0.02, '#1e293b', 0, 1.1, 0.41, g);
  // Blinking LED status strips
  for (let i = 0; i < 7; i++) {
    const ledColor = i === 2 ? '#f59e0b' : '#10b981';
    createBox(0.6, 0.04, 0.02, ledColor, 0, 0.35 + i * 0.26, 0.42, g, {
      emissive: ledColor,
      emissiveIntensity: 0.9
    });
  }
  return g;
}

function buildCoffeeCorner(x, z) {
  const g = createGroup(x, z, 0, scene);
  // Cabinet Counter
  createBox(2.2, 0.9, 0.7, '#334155', 0, 0.45, 0, g);
  createBox(2.25, 0.05, 0.75, '#f8fafc', 0, 0.92, 0, g);
  // Espresso machine
  createBox(0.55, 0.5, 0.4, '#dc2626', -0.5, 1.18, 0, g);
  createBox(0.2, 0.08, 0.15, '#e2e8f0', -0.5, 1.05, 0.18, g);
  // Water dispenser with blue bottle
  createBox(0.45, 1.0, 0.45, '#e2e8f0', 0.65, 0.5, 0, g);
  createCylinder(0.18, 0.18, 0.55, '#38bdf8', 0.65, 1.25, 0, g, 16);
  // Plant pot
  createCylinder(0.22, 0.16, 0.35, '#ea580c', -0.9, 1.1, 0, g);
  createMesh(new THREE.DodecahedronGeometry(0.24), getMaterial('#15803d'), -0.9, 1.35, 0, g);
  return g;
}

function buildMeetingTable(x, z) {
  const g = createGroup(x, z, 0, scene);
  // Oval conference table
  createBox(2.6, 0.08, 1.4, '#1e293b', 0, 0.74, 0, g);
  createCylinder(0.25, 0.3, 0.7, '#64748b', -0.8, 0.35, 0, g);
  createCylinder(0.25, 0.3, 0.7, '#64748b', 0.8, 0.35, 0, g);
  // Chairs around meeting table
  buildChair(g, -1.0, 0.9, 0);
  buildChair(g, 0.0, 0.9, 0);
  buildChair(g, 1.0, 0.9, 0);
  buildChair(g, -1.0, -0.9, Math.PI);
  buildChair(g, 0.0, -0.9, Math.PI);
  buildChair(g, 1.0, -0.9, Math.PI);
  return g;
}

function buildWhiteboard(x, z) {
  const g = createGroup(x, z, 0, scene);
  createBox(3.2, 1.7, 0.05, '#f8fafc', 0, 2.0, 0, g);
  createBox(3.3, 0.06, 0.1, '#94a3b8', 0, 1.15, 0.03, g); // tray
  // Canvas drawn roadmap illustration
  const { canvas, ctx, tex } = createCanvasTexture(512, 256);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = '#0284c7';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('HCDS 2026 ROADMAP', 20, 40);
  // Diagram boxes
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 70, 120, 60);
  ctx.fillStyle = '#1e293b';
  ctx.font = '16px sans-serif';
  ctx.fillText('iSmartOffice', 45, 105);

  ctx.strokeStyle = '#10b981';
  ctx.strokeRect(190, 70, 130, 60);
  ctx.fillText('Annie Insights', 200, 105);

  ctx.strokeStyle = '#f59e0b';
  ctx.strokeRect(360, 70, 120, 60);
  ctx.fillText('OrthoFX API', 375, 105);

  ctx.fillStyle = '#10b981';
  ctx.fillText('✓ AllCare Live', 30, 180);
  ctx.fillText('✓ Dolphin Validation OK', 30, 210);
  ctx.fillText('✓ Supabase Sync Active', 230, 180);

  createMesh(new THREE.PlaneGeometry(3.1, 1.6), new THREE.MeshBasicMaterial({ map: tex }), 0, 2.0, 0.03, g);
  return g;
}

// ---------- Character Model Builder ----------
function createPerson(key, conf) {
  const g = createGroup(conf.x, conf.z, conf.rot, scene);
  const p = { config: conf, root: g, parts: {}, currentStatus: 'idle', activeTask: null };

  const hip = createGroup(0, 0, 0, g);
  hip.position.y = 0.9;
  p.hip = hip;

  // Legs & Shoes
  ['L', 'R'].forEach((side, idx) => {
    const legG = createGroup(idx ? 0.12 : -0.12, 0, 0, hip);
    createBox(0.15, 0.78, 0.17, COLORS.pants, 0, -0.39, 0, legG);
    createBox(0.16, 0.09, 0.25, '#0f172a', 0, -0.82, 0.04, legG); // shoe
    p['leg' + side] = legG;
  });

  // Torso / Shirt
  createBox(0.48, 0.6, 0.28, conf.shirt, 0, 0.3, 0, hip);

  // Arms & Hands
  ['L', 'R'].forEach((side, idx) => {
    const armG = createGroup(idx ? 0.32 : -0.32, 0.55, 0, hip);
    createBox(0.13, 0.52, 0.14, conf.shirt, 0, -0.26, 0, armG);
    createMesh(new THREE.SphereGeometry(0.065, 8, 8), getMaterial(COLORS.skin), 0, -0.55, 0, armG); // hand
    p['arm' + side] = armG;
  });

  // Head & Face
  const headG = createGroup(0, 0.82, 0, hip);
  createMesh(new THREE.SphereGeometry(0.18, 16, 12), getMaterial(COLORS.skin), 0, 0, 0, headG);
  // Eyes
  createMesh(new THREE.SphereGeometry(0.024, 8, 8), getMaterial('#0f172a'), -0.06, 0.02, 0.16, headG);
  createMesh(new THREE.SphereGeometry(0.024, 8, 8), getMaterial('#0f172a'), 0.06, 0.02, 0.16, headG);

  // Specific Accessories & Headwear
  if (conf.accessories === 'peci') {
    createCylinder(0.16, 0.165, 0.12, '#0f172a', 0, 0.15, 0, headG, 16);
  } else if (conf.accessories === 'hijab') {
    // Hijab covering head with face opening
    createMesh(new THREE.SphereGeometry(0.21, 16, 14, Math.PI / 2 + 0.8, Math.PI * 2 - 1.6, 0, Math.PI * 0.8),
      getMaterial('#059669', { side: THREE.DoubleSide }), 0, 0.01, 0, headG);
    createCylinder(0.2, 0.28, 0.28, '#059669', 0, -0.19, -0.01, headG, 16);
  } else if (conf.accessories === 'lab_coat') {
    // White lab coat for Dr. Kaboudan
    createBox(0.5, 0.65, 0.3, '#f8fafc', 0, 0.28, 0, hip);
    // Stethoscope around neck
    createMesh(new THREE.TorusGeometry(0.12, 0.015, 6, 16), getMaterial('#475569'), 0, 0.65, 0.08, hip);
    // Hair
    createMesh(new THREE.SphereGeometry(0.185, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.45), getMaterial('#64748b'), 0, 0.02, -0.01, headG);
  } else {
    // Standard hair
    createMesh(new THREE.SphereGeometry(0.185, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.45), getMaterial(conf.hair), 0, 0.02, -0.01, headG);
  }

  // Glasses for Acid
  if (conf.accessories === 'glasses') {
    [-0.06, 0.06].forEach(gx => {
      createMesh(new THREE.TorusGeometry(0.04, 0.008, 6, 14), getMaterial('#db2777'), gx, 0.02, 0.175, headG);
    });
    createBox(0.14, 0.012, 0.01, '#db2777', 0, 0.02, 0.175, headG);
  }

  // Headphones for Rangga
  if (conf.accessories === 'headphones') {
    createMesh(new THREE.TorusGeometry(0.19, 0.018, 6, 16), getMaterial('#f97316'), 0, 0.05, 0, headG);
    createBox(0.06, 0.08, 0.06, '#ea580c', -0.19, 0.01, 0, headG);
    createBox(0.06, 0.08, 0.06, '#ea580c', 0.19, 0.01, 0, headG);
  }

  // Setup click raycasting
  g.traverse(obj => {
    if (obj.isMesh) obj.userData.personKey = key;
  });
  clickables.push(g);

  // 2D HTML Label overlay
  const label = document.createElement('div');
  label.className = 'character-label';
  label.dataset.person = key;
  label.innerHTML = `
    <div class="character-tag">
      <span class="live-dot" style="background:${conf.shirt};"></span>
      <span>${conf.name}</span>
    </div>
    <div class="character-status-bubble">Idle</div>
  `;
  label.addEventListener('click', () => {
    if (window.HCDSOffice && window.HCDSOffice.onPersonClick) {
      window.HCDSOffice.onPersonClick(key);
    }
  });
  labelLayer.appendChild(label);
  p.label = label;

  people[key] = p;
  return p;
}

// ---------- Orange Cat "Oyen" Builder ----------
function makeOrangeCat() {
  const g = createGroup(0, 0, 0, scene);
  const fur = COLORS.catOrange;
  const furLight = COLORS.catOrangeLight;

  // Cat body
  createBox(0.44, 0.22, 0.22, fur, 0, 0.24, 0, g).rotation.y = Math.PI / 2;
  // White chest patch
  createBox(0.18, 0.16, 0.02, '#fff7ed', 0, 0.24, 0.21, g);

  // Cat Head
  const head = createMesh(new THREE.SphereGeometry(0.13, 12, 10), getMaterial(fur), 0, 0.36, 0.26, g);
  // Eyes (emerald green)
  createMesh(new THREE.SphereGeometry(0.022, 8, 8), getMaterial('#10b981'), -0.05, 0.38, 0.38, g);
  createMesh(new THREE.SphereGeometry(0.022, 8, 8), getMaterial('#10b981'), 0.05, 0.38, 0.38, g);

  // Cute pointy ears
  [-0.07, 0.07].forEach(ex => {
    const ear = createMesh(new THREE.ConeGeometry(0.04, 0.09, 4), getMaterial(furLight), ex, 0.5, 0.26, g);
    ear.rotation.z = ex > 0 ? -0.2 : 0.2;
  });

  // 4 Legs
  [[-0.08, 0.16], [0.08, 0.16], [-0.08, -0.16], [0.08, -0.16]].forEach(([lx, lz]) => {
    createBox(0.06, 0.16, 0.06, fur, lx, 0.08, lz, g);
  });

  // Tail curling up
  const tail = createBox(0.04, 0.04, 0.32, furLight, 0, 0.38, -0.3, g);
  tail.rotation.x = -0.85;

  g.traverse(o => {
    if (o.isMesh) o.userData.isCat = true;
  });
  clickables.push(g);

  // Cat 2D Tag
  const label = document.createElement('div');
  label.className = 'character-label';
  label.innerHTML = `
    <div class="character-tag" style="border-color:#ea580c;">
      <span>🐱 Oyen (Mascot)</span>
    </div>
    <div class="character-status-bubble" style="color:#ea580c;">Office Cat</div>
  `;
  label.addEventListener('click', meowCat);
  labelLayer.appendChild(label);

  cat = {
    root: g,
    label,
    target: null,
    waitTimer: 3.0,
    sayTimeout: null
  };
  g.position.set(-7.0, 0, 4.5); // Start on lounge rug
}

function meowCat() {
  if (!cat) return;
  const bubble = cat.label.querySelector('.character-status-bubble');
  const meows = ['Meow! 🐾', 'Purrrrr… ✨', 'Got treats? 🐟', 'Head scratches please! 😸', 'Mrrrp!'];
  bubble.textContent = meows[Math.floor(Math.random() * meows.length)];
  clearTimeout(cat.sayTimeout);
  cat.sayTimeout = setTimeout(() => {
    bubble.textContent = 'Office Cat';
  }, 3000);
}

function updateCatMovement(dt) {
  if (!cat) return;
  const pos = cat.root.position;

  if (!cat.target) {
    cat.waitTimer -= dt;
    if (cat.waitTimer <= 0) {
      cat.target = CAT_SPOTS[Math.floor(Math.random() * CAT_SPOTS.length)];
    }
    return;
  }

  const [tx, tz] = cat.target;
  const dx = tx - pos.x;
  const dz = tz - pos.z;
  const dist = Math.hypot(dx, dz);
  const speed = 1.0 * dt;

  cat.root.rotation.y = Math.atan2(dx, dz);
  if (dist <= speed) {
    cat.target = null;
    cat.waitTimer = 8 + Math.random() * 12; // Snooze for 8-20s
  } else {
    pos.x += (dx / dist) * speed;
    pos.z += (dz / dist) * speed;
  }
}

// ---------- Zone Titles in 3D Space ----------
const ZONE_TAGS = [
  { text: 'Executive Suite', x: -6.5, y: 2.8, z: -3.2 },
  { text: 'Chief Architect Bay', x: -1.5, y: 2.8, z: -4.5 },
  { text: 'Cloud Infrastructure', x: 2.2, y: 2.8, z: -4.5 },
  { text: 'Global Outreach', x: 6.5, y: 2.8, z: -4.5 },
  { text: 'iSmartOffice Team', x: -4.2, y: 2.8, z: 2.5 },
  { text: 'Annie Insights Team', x: 4.5, y: 2.8, z: 2.5 },
  { text: 'Coffee Corner & Lounge', x: 7.2, y: 2.2, z: -1.2 },
  { text: 'Meeting Area', x: 0, y: 2.2, z: -1.0 }
];

function setupZoneTags() {
  ZONE_TAGS.forEach(z => {
    const el = document.createElement('div');
    el.className = 'zone-tag';
    el.textContent = z.text;
    labelLayer.appendChild(el);
    z.element = el;
    z.pos = new THREE.Vector3(z.x, z.y, z.z);
  });
}

// ---------- Layout Building: Desks & Areas ----------
function setupOfficeLayout() {
  // 1. Executive Suite (dr. Kusnoto & dr. Flavio)
  buildDesk(scene, -6.5, -4.5, 2.0, 0.9, true);
  buildChair(scene, -6.5, -3.9, Math.PI, '#451a03');
  buildMonitor(scene, -6.5, -4.5, 0, '#38bdf8');

  buildDesk(scene, -6.5, -2.0, 2.0, 0.9, true);
  buildChair(scene, -6.5, -1.4, Math.PI, '#451a03');
  buildMonitor(scene, -6.5, -2.0, 0, '#10b981');

  // Executive divider wall
  createBox(0.1, 1.8, 6.0, '#475569', -4.8, 0.9, -3.5, scene, { transparent: true, opacity: 0.7 });

  // 2. Chief Architect Bay (Master Aryo)
  buildDesk(scene, -1.5, -4.5, 1.8, 0.85);
  buildChair(scene, -1.5, -3.9, Math.PI, '#0f172a');
  // Multi-monitors
  buildMonitor(scene, -1.8, -4.5, -0.2, '#10b981'); // Matrix terminal
  buildMonitor(scene, -1.2, -4.5, 0.2, '#38bdf8');

  // 3. Infrastructure & Cloud Bay (Mas Ringo)
  buildDesk(scene, 2.2, -4.5, 1.6, 0.85);
  buildChair(scene, 2.2, -3.9, Math.PI, '#14532d');
  buildMonitor(scene, 2.2, -4.5, 0, '#22c55e');
  buildServerRack(4.0, -5.5);

  // 4. Global Outreach & Partnerships (Mas Ary)
  buildDesk(scene, 6.5, -4.5, 1.6, 0.85);
  buildChair(scene, 6.5, -3.9, Math.PI, '#581c87');
  buildMonitor(scene, 6.5, -4.5, 0, '#a855f7');

  // 5. iSmartOffice Team Cluster (Astrid, Rangga, Wahyudi)
  // Shared wide bench desk
  buildDesk(scene, -6.5, 2.5, 1.6, 0.85); // Astrid
  buildChair(scene, -6.5, 1.9, 0, '#831843');
  buildMonitor(scene, -6.5, 2.5, Math.PI, '#ec4899');

  buildDesk(scene, -4.2, 2.5, 1.6, 0.85); // Rangga
  buildChair(scene, -4.2, 1.9, 0, '#7c2d12');
  buildMonitor(scene, -4.2, 2.5, Math.PI, '#f97316');

  buildDesk(scene, -1.9, 2.5, 1.6, 0.85); // Wahyudi
  buildChair(scene, -1.9, 1.9, 0, '#713f12');
  buildMonitor(scene, -1.9, 2.5, Math.PI, '#eab308');

  // 6. Annie Insights Team Cluster (Fikri, Annie Team, Dr. Kaboudan)
  buildDesk(scene, 2.2, 2.5, 1.6, 0.85); // Fikri
  buildChair(scene, 2.2, 1.9, 0, '#1e3a8a');
  buildMonitor(scene, 2.2, 2.5, Math.PI, '#3b82f6');

  buildDesk(scene, 4.5, 2.5, 1.6, 0.85); // Annie Team
  buildChair(scene, 4.5, 1.9, 0, '#064e3b');
  buildMonitor(scene, 4.5, 2.5, Math.PI, '#10b981');

  buildDesk(scene, 6.8, 2.5, 1.6, 0.85); // Dr. Kaboudan (Decorative)
  buildChair(scene, 6.8, 1.9, 0, '#334155');
  buildMonitor(scene, 6.8, 2.5, Math.PI, '#64748b');

  // 7. Meeting Area & Whiteboard
  buildMeetingTable(0, -1.0);
  buildWhiteboard(0, -7.95);

  // 8. Coffee Corner & Lounge
  buildCoffeeCorner(9.5, -4.0);
  // Lounge Sofa & Rug
  createBox(3.0, 0.02, 2.0, '#334155', -7.5, 0.01, 4.5); // Rug
  createBox(2.2, 0.5, 0.8, '#475569', -7.5, 0.25, 4.8);  // Sofa back
  createBox(2.2, 0.35, 0.7, '#64748b', -7.5, 0.18, 4.3); // Sofa seat
}

// ---------- Raycasting for Clicks ----------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function setupInteractions() {
  renderer.domElement.addEventListener('pointerdown', event => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickables, true);

    if (intersects.length > 0) {
      let obj = intersects[0].object;
      while (obj && !obj.userData.personKey && !obj.userData.isCat && obj.parent) {
        obj = obj.parent;
      }
      if (obj && obj.userData.personKey) {
        if (window.HCDSOffice && window.HCDSOffice.onPersonClick) {
          window.HCDSOffice.onPersonClick(obj.userData.personKey);
        }
      } else if (obj && obj.userData.isCat) {
        meowCat();
      }
    }
  });
}

// ---------- Projection: 3D to 2D HTML Labels ----------
const tempVec = new THREE.Vector3();
function updateLabels() {
  if (!camera || !renderer) return;

  // Update Person Labels
  Object.entries(people).forEach(([key, p]) => {
    if (!p.label) return;
    p.root.getWorldPosition(tempVec);
    tempVec.y += 2.05; // Above head
    tempVec.project(camera);

    const x = ((tempVec.x + 1) * renderer.domElement.clientWidth) / 2;
    const y = ((-tempVec.y + 1) * renderer.domElement.clientHeight) / 2;

    p.label.style.transform = `translate(${x}px, ${y}px)`;
    p.label.style.display = tempVec.z > 1 ? 'none' : 'flex';
  });

  // Update Cat Label
  if (cat && cat.label) {
    cat.root.getWorldPosition(tempVec);
    tempVec.y += 0.7;
    tempVec.project(camera);
    const cx = ((tempVec.x + 1) * renderer.domElement.clientWidth) / 2;
    const cy = ((-tempVec.y + 1) * renderer.domElement.clientHeight) / 2;
    cat.label.style.transform = `translate(${cx}px, ${cy}px)`;
    cat.label.style.display = tempVec.z > 1 ? 'none' : 'flex';
  }

  // Update Zone Tags
  ZONE_TAGS.forEach(z => {
    if (!z.element) return;
    tempVec.copy(z.pos);
    tempVec.project(camera);
    const zx = ((tempVec.x + 1) * renderer.domElement.clientWidth) / 2;
    const zy = ((-tempVec.y + 1) * renderer.domElement.clientHeight) / 2;
    z.element.style.transform = `translate(${zx}px, ${zy}px) translate(-50%, -50%)`;
    z.element.style.display = tempVec.z > 1 ? 'none' : 'block';
  });
}

// ---------- Main Render Loop ----------
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  if (controls) controls.update();
  updateCatMovement(dt);

  // Subtle breathing/typing animation for active characters
  const time = clock.getElapsedTime();
  Object.values(people).forEach(p => {
    if (p.currentStatus === 'working') {
      p.hip.position.y = 0.9 + Math.sin(time * 6) * 0.015;
      if (p.armL) p.armL.rotation.x = Math.sin(time * 12) * 0.15 - 0.4;
      if (p.armR) p.armR.rotation.x = -Math.sin(time * 12) * 0.15 - 0.4;
    } else {
      p.hip.position.y = 0.9 + Math.sin(time * 2) * 0.005;
      if (p.armL) p.armL.rotation.x = 0;
      if (p.armR) p.armR.rotation.x = 0;
    }
  });

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
  updateLabels();
}

function onWindowResize() {
  if (!root || !renderer || !camera) return;
  const width = root.clientWidth || 800;
  const height = root.clientHeight || 600;
  const aspect = width / height;
  const frustumSize = 14;

  camera.left = (-frustumSize * aspect) / 2;
  camera.right = (frustumSize * aspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

// ---------- Public Controller API ----------
export function initOffice(containerElement) {
  root = containerElement;
  labelLayer = root.querySelector('.office-labels-layer');

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(root.clientWidth, root.clientHeight);
  renderer.shadowMap.enabled = true;
  if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
  else if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;

  const canvasWrap = root.querySelector('.office-canvas-wrap');
  canvasWrap.appendChild(renderer.domElement);

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#090d16');

  // Orthographic Isometric Camera
  const aspect = root.clientWidth / root.clientHeight;
  const frustumSize = 14;
  camera = new THREE.OrthographicCamera(
    (-frustumSize * aspect) / 2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    100
  );
  // Classic 45-degree isometric position
  camera.position.set(16, 16, 16);
  camera.lookAt(0, 0, 0);

  // Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minZoom = 0.6;
  controls.maxZoom = 2.8;
  controls.target.set(0, 0.5, 0);

  // Lights
  hemiLight = new THREE.HemisphereLight('#f8fafc', '#64748b', 1.1);
  scene.add(hemiLight);

  sunLight = new THREE.DirectionalLight('#fffbeb', 1.8);
  sunLight.position.set(10, 20, 10);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 50;
  const d = 14;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  scene.add(sunLight);

  // Build World
  buildRoom();
  setupOfficeLayout();
  setupZoneTags();
  makeOrangeCat();

  // Create Team Members
  Object.entries(TEAM_CONFIG).forEach(([k, c]) => {
    createPerson(k, c);
  });

  setupInteractions();
  window.addEventListener('resize', onWindowResize);
  new ResizeObserver(onWindowResize).observe(root);
  onWindowResize();

  animate();
}

export function updateMemberStatus(personKey, status, activeTaskTitle = '') {
  const p = people[personKey];
  if (!p) return;

  p.currentStatus = status;
  p.activeTask = activeTaskTitle;

  const bubble = p.label.querySelector('.character-status-bubble');
  if (bubble) {
    if (status === 'working') {
      bubble.textContent = `💻 ${activeTaskTitle || 'Working'}`;
      bubble.style.color = '#38bdf8';
      bubble.style.borderColor = 'rgba(56, 189, 248, 0.4)';
    } else if (status === 'done') {
      bubble.textContent = `✅ Completed`;
      bubble.style.color = '#34d399';
      bubble.style.borderColor = 'rgba(52, 211, 153, 0.4)';
    } else {
      bubble.textContent = 'Idle / Break';
      bubble.style.color = '#94a3b8';
      bubble.style.borderColor = 'rgba(148, 163, 184, 0.2)';
    }
  }
}

export function resetCameraView() {
  if (!camera || !controls) return;
  camera.position.set(16, 16, 16);
  controls.target.set(0, 0.5, 0);
  camera.zoom = 1;
  camera.updateProjectionMatrix();
  controls.update();
}

export function setDayNightMode(night) {
  isNight = night;
  if (!scene || !hemiLight || !sunLight) return;
  if (night) {
    scene.background.set('#040711');
    hemiLight.color.set('#334155');
    hemiLight.groundColor.set('#0f172a');
    hemiLight.intensity = 0.6;
    sunLight.intensity = 0.5;
    sunLight.color.set('#93c5fd');
  } else {
    scene.background.set('#090d16');
    hemiLight.color.set('#f8fafc');
    hemiLight.groundColor.set('#64748b');
    hemiLight.intensity = 1.1;
    sunLight.intensity = 1.8;
    sunLight.color.set('#fffbeb');
  }
}

// Expose globally on window for easy access from non-module scripts
if (typeof window !== 'undefined') {
  window.HCDSOffice = window.HCDSOffice || {};
  window.HCDSOffice.initOffice = initOffice;
  window.HCDSOffice.updateMemberStatus = updateMemberStatus;
  window.HCDSOffice.resetCameraView = resetCameraView;
  window.HCDSOffice.setDayNightMode = setDayNightMode;
  window.HCDSOffice.TEAM_CONFIG = TEAM_CONFIG;
}

// ─────────────────────────────────────────────────────────────
// HCDS Virtual 2D Office — Gather.town RPG Simulation
// 16-Bit Top-Down Canvas 2D Engine with Live HC-SUPABASE Sync
// ─────────────────────────────────────────────────────────────

class Office2DScene {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.container = null;
    this.animationFrameId = null;
    this.isNight = false;

    // Canvas virtual world dimensions
    this.worldWidth = 1280;
    this.worldHeight = 800;

    // Viewport & Camera
    this.camera = {
      x: 640,
      y: 400,
      zoom: 1.0,
      minZoom: 0.5,
      maxZoom: 2.2,
      targetX: 640,
      targetY: 400,
      autoFit: true
    };

    // Player Avatar (Visitor)
    this.player = {
      x: 640,
      y: 560,
      targetX: 640,
      targetY: 560,
      speed: 3.5,
      isMoving: false,
      direction: 'up', // 'down' | 'up' | 'left' | 'right'
      animFrame: 0,
      animTimer: 0
    };

    this.keys = {};
    this.hoveredPerson = null;
    this.nearbyPerson = null;
    this.tick = 0;

    // ─────────────────────────────────────────────────────────────
    // Office Rooms Configuration (Spacious, Non-Overlapping Layout)
    // ─────────────────────────────────────────────────────────────
    this.rooms = [
      {
        id: 'executive',
        title: 'Executive Boardroom',
        subtitle: 'Leadership & Academic Strategy',
        x: 30,
        y: 30,
        w: 380,
        h: 220,
        floorType: 'wood_dark',
        borderColor: '#0284c7'
      },
      {
        id: 'architect',
        title: 'Architect Corner',
        subtitle: 'Core Architecture & AI Research',
        x: 440,
        y: 30,
        w: 400,
        h: 220,
        floorType: 'carpet_blue',
        borderColor: '#6366f1'
      },
      {
        id: 'infra',
        title: 'Cloud & Infrastructure Lab',
        subtitle: 'Azure VMs, Server Farm & Burst Print',
        x: 870,
        y: 30,
        w: 380,
        h: 220,
        floorType: 'metal_grid',
        borderColor: '#16a34a'
      },
      {
        id: 'ismart',
        title: 'iSmartOffice Team Bay',
        subtitle: 'Onboarding, Web, Mobile & QA Testing',
        x: 30,
        y: 280,
        w: 430,
        h: 230,
        floorType: 'carpet_purple',
        borderColor: '#db2777'
      },
      {
        id: 'outreach',
        title: 'Global Outreach & Marketing',
        subtitle: 'International Partners & Sphinx Sync',
        x: 490,
        y: 280,
        w: 300,
        h: 230,
        floorType: 'carpet_teal',
        borderColor: '#7c3aed'
      },
      {
        id: 'annie',
        title: 'Annie Insights AI Lab',
        subtitle: 'AI Model Benchmarking & Big Data QA',
        x: 820,
        y: 280,
        w: 430,
        h: 230,
        floorType: 'carpet_cyan',
        borderColor: '#0ea5e9'
      },
      {
        id: 'lounge',
        title: 'Coffee Lounge & Garden',
        subtitle: 'Espresso Bar, Sofa & Oyen Cat',
        x: 30,
        y: 540,
        w: 380,
        h: 230,
        floorType: 'wood_light',
        borderColor: '#f59e0b'
      },
      {
        id: 'cafeteria',
        title: 'HCDS Cafeteria & Pantry',
        subtitle: 'Dining Tables, Refreshments & Buffet',
        x: 440,
        y: 540,
        w: 460,
        h: 230,
        floorType: 'checkered_tile',
        borderColor: '#10b981'
      },
      {
        id: 'prayer',
        title: 'Prayer Room (Musholla)',
        subtitle: 'Serene Space for Solat & Reflection',
        x: 930,
        y: 540,
        w: 320,
        h: 230,
        floorType: 'carpet_emerald',
        borderColor: '#0d9488'
      }
    ];

    // ─────────────────────────────────────────────────────────────
    // Personnel Desks & Sprites with Dynamic Break States
    // ─────────────────────────────────────────────────────────────
    this.personnel = {
      'kusnoto': {
        key: 'kusnoto',
        name: 'dr. Kusnoto',
        role: 'CEO & Co-Founder',
        x: 130,
        y: 130,
        homeX: 130,
        homeY: 130,
        deskX: 100,
        deskY: 152,
        deskW: 72,
        deskH: 40,
        color: '#0284c7',
        hair: '#1e293b',
        shirt: '#0f172a',
        pants: '#334155',
        status: 'idle',
        activeTask: 'Executive Strategy & UIC Orthodontics Clinical Roadmap',
        direction: 'down',
        state: 'desk',
        actionTimer: 450,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'flavio': {
        key: 'flavio',
        name: 'dr. Flavio',
        role: 'CFO & Co-Founder',
        x: 290,
        y: 130,
        homeX: 290,
        homeY: 130,
        deskX: 260,
        deskY: 152,
        deskW: 72,
        deskH: 40,
        color: '#0d9488',
        hair: '#334155',
        shirt: '#042f2e',
        pants: '#1e293b',
        status: 'idle',
        activeTask: 'Financial Analysis & Stripe Billing Overview',
        direction: 'down',
        state: 'desk',
        actionTimer: 680,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'ridwan': {
        key: 'ridwan',
        name: 'Ridwan',
        role: 'Research',
        x: 520,
        y: 130,
        homeX: 520,
        homeY: 130,
        deskX: 485,
        deskY: 152,
        deskW: 70,
        deskH: 42,
        color: '#06b6d4',
        hair: '#1e293b',
        shirt: '#0891b2',
        pants: '#0f172a',
        status: 'working',
        activeTask: 'Deep Learning Model Optimization & AI Research',
        direction: 'down',
        state: 'desk',
        actionTimer: 480,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'aryo': {
        key: 'aryo',
        name: 'Master Aryo',
        role: 'Chief System Architect',
        x: 640,
        y: 130,
        homeX: 640,
        homeY: 130,
        deskX: 605,
        deskY: 152,
        deskW: 70,
        deskH: 42,
        color: '#6366f1',
        hair: '#0f172a',
        shirt: '#312e81',
        pants: '#1e1b4b',
        status: 'working',
        activeTask: 'Investigasi & Mitigasi Kendala Sistem Printing Annie',
        direction: 'down',
        state: 'desk',
        actionTimer: 520,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'joko': {
        key: 'joko',
        name: 'Joko',
        role: 'Research',
        x: 760,
        y: 130,
        homeX: 760,
        homeY: 130,
        deskX: 725,
        deskY: 152,
        deskW: 70,
        deskH: 42,
        color: '#8b5cf6',
        hair: '#451a03',
        shirt: '#6d28d9',
        pants: '#1e1b4b',
        status: 'working',
        activeTask: 'Dataset Validation & Clinical Landmark Research',
        direction: 'down',
        state: 'desk',
        actionTimer: 540,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'ringo': {
        key: 'ringo',
        name: 'Mas Ringo',
        role: 'Senior Tech Lead & Infra Admin',
        x: 1050,
        y: 130,
        homeX: 1050,
        homeY: 130,
        deskX: 1010,
        deskY: 152,
        deskW: 85,
        deskH: 42,
        color: '#16a34a',
        hair: '#1f2937',
        shirt: '#14532d',
        pants: '#1e293b',
        status: 'working',
        activeTask: 'Upgrade 4 Azure Burst Print VMs',
        direction: 'down',
        state: 'desk',
        actionTimer: 740,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'acid': {
        key: 'acid',
        name: 'Seus Acid',
        role: 'iSmartOffice Team Lead',
        isHijab: true,
        gender: 'female',
        x: 95,
        y: 380,
        homeX: 95,
        homeY: 380,
        deskX: 65,
        deskY: 402,
        deskW: 68,
        deskH: 40,
        color: '#db2777',
        hijabColor: '#db2777',
        hijabDrape: '#be185d',
        innerCap: '#fdf2f8',
        shirt: '#ec4899',
        skirt: '#831843',
        pants: '#831843',
        status: 'working',
        activeTask: 'Review Mobile App Bug Backlog (#12, #14, #16)',
        direction: 'down',
        state: 'desk',
        actionTimer: 360,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'rangga': {
        key: 'rangga',
        name: 'Mas Rangga',
        role: 'Clinical Finding UI Dev',
        x: 230,
        y: 380,
        homeX: 230,
        homeY: 380,
        deskX: 200,
        deskY: 402,
        deskW: 68,
        deskH: 40,
        color: '#f97316',
        hair: '#18181b',
        shirt: '#c2410c',
        pants: '#27272a',
        status: 'working',
        activeTask: 'iSmartOffice Web Local Dev Setup — Auth0, CORS Proxy',
        direction: 'down',
        state: 'desk',
        actionTimer: 600,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'yudi': {
        key: 'yudi',
        name: 'Mas Yudi',
        role: 'Tester & Designer Support',
        x: 365,
        y: 380,
        homeX: 365,
        homeY: 380,
        deskX: 335,
        deskY: 402,
        deskW: 68,
        deskH: 40,
        color: '#eab308',
        hair: '#292524',
        shirt: '#a16207',
        pants: '#1c1917',
        status: 'done',
        activeTask: 'QA Verification & TestFlight Checks Completed',
        direction: 'down',
        state: 'desk',
        actionTimer: 820,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'ary': {
        key: 'ary',
        name: 'Mas Ary',
        role: 'Marketing & Outreach Lead',
        x: 640,
        y: 380,
        homeX: 640,
        homeY: 380,
        deskX: 600,
        deskY: 402,
        deskW: 80,
        deskH: 40,
        color: '#7c3aed',
        hair: '#18181b',
        shirt: '#581c87',
        pants: '#1e1b4b',
        status: 'working',
        activeTask: 'Executive Meeting Coordination: Carlos Zoom Session',
        direction: 'down',
        state: 'desk',
        actionTimer: 480,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'fikri': {
        key: 'fikri',
        name: 'Kang Fikri',
        role: 'Mobile Dev & Coordinator',
        x: 910,
        y: 380,
        homeX: 910,
        homeY: 380,
        deskX: 875,
        deskY: 402,
        deskW: 75,
        deskH: 40,
        color: '#2563eb',
        hair: '#0f172a',
        shirt: '#1d4ed8',
        pants: '#172554',
        status: 'working',
        activeTask: 'Investigasi & Mitigasi Printing Annie',
        direction: 'down',
        state: 'desk',
        actionTimer: 640,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      },
      'kaboudan': {
        key: 'kaboudan',
        name: 'Dr. Kaboudan',
        role: 'Clinical AI Advisor',
        x: 1110,
        y: 380,
        homeX: 1110,
        homeY: 380,
        deskX: 1075,
        deskY: 402,
        deskW: 75,
        deskH: 40,
        color: '#f8fafc',
        hair: '#475569',
        shirt: '#f1f5f9',
        pants: '#0f172a',
        status: 'idle',
        activeTask: 'Orthodontic Cephalometric Verification',
        direction: 'down',
        state: 'desk',
        actionTimer: 900,
        waypoints: [],
        isWalking: false,
        walkSpeed: 1.6,
        thought: { text: '', timer: 0, maxTimer: 220, opacity: 0 }
      }
    };

    // Designated Break Room Activity Spots
    this.breakSpots = {
      lounge: [
        { x: 105, y: 645, room: 'lounge', label: 'relaxing on sofa' },
        { x: 155, y: 645, room: 'lounge', label: 'reading on sofa' },
        { x: 245, y: 645, room: 'lounge', label: 'chilling on beanbag' },
        { x: 310, y: 655, room: 'lounge', label: 'relaxing in lounge' },
        { x: 180, y: 595, room: 'lounge', label: 'at espresso bar' }
      ],
      cafeteria: [
        { x: 535, y: 630, room: 'cafeteria', label: 'lunch at Table 1' },
        { x: 585, y: 630, room: 'cafeteria', label: 'coffee at Table 1' },
        { x: 725, y: 630, room: 'cafeteria', label: 'lunch at Table 2' },
        { x: 775, y: 630, room: 'cafeteria', label: 'snack at Table 2' },
        { x: 650, y: 585, room: 'cafeteria', label: 'grabbing buffet food' }
      ],
      prayer: [
        { x: 986, y: 615, room: 'prayer', label: 'solat on prayer mat' },
        { x: 1041, y: 615, room: 'prayer', label: 'praying in musholla' },
        { x: 1096, y: 615, room: 'prayer', label: 'solat on prayer mat' },
        { x: 1041, y: 680, room: 'prayer', label: 'peaceful reflection' },
        { x: 1096, y: 680, room: 'prayer', label: 'dhikr & prayer' }
      ]
    };

    // Oyen the Orange Cat (Roams inside Coffee Lounge)
    this.cat = {
      x: 220,
      y: 670,
      targetX: 220,
      targetY: 670,
      dir: 1,
      isWalking: false,
      purrTimer: 0
    };

    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.cameraDragStart = { x: 0, y: 0 };
    this.boundHandlers = {};
  }

  init(container) {
    if (!container) return;
    this.container = container;

    // Look for canvas or canvas wrapper
    let wrap = container.querySelector('.office-canvas-wrap-2d');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'office-canvas-wrap-2d';
      wrap.style.cssText = 'position:relative; width:100%; height:100%; overflow:hidden; background:#0b1120; cursor:crosshair;';
      
      const canvas = document.createElement('canvas');
      canvas.id = 'office2DCanvas';
      wrap.appendChild(canvas);

      const stage = container.querySelector('.office-stage');
      if (stage) stage.appendChild(wrap);
      else container.appendChild(wrap);
    }

    let canvas = wrap.querySelector('#office2DCanvas') || wrap.querySelector('canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'office2DCanvas';
      wrap.appendChild(canvas);
    }

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    this.resizeCanvas();
    this.bindEvents();
    this.startLoop();

    // Sync with live HC-SUPABASE data
    this.syncWithSupabase();
  }

  resizeCanvas() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    if (rect.width < 50 || rect.height < 50) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.viewportWidth = rect.width;
    this.viewportHeight = rect.height;

    // Auto-fit zoom so whole office is beautifully framed with margins
    if (this.camera.autoFit) {
      this.resetCameraView();
    }
  }

  resetCameraView() {
    const margin = 24;
    const vpW = Math.max(this.viewportWidth || 1000, 400);
    const vpH = Math.max(this.viewportHeight || 600, 300);
    const scaleX = (vpW - margin) / this.worldWidth;
    const scaleY = (vpH - margin) / this.worldHeight;
    this.camera.zoom = Math.max(0.4, Math.min(scaleX, scaleY, 1.2));
    this.camera.x = this.worldWidth / 2;
    this.camera.y = this.worldHeight / 2;
    this.camera.targetX = this.camera.x;
    this.camera.targetY = this.camera.y;
    this.camera.autoFit = true;
  }

  zoomIn() {
    this.camera.zoom = Math.min(this.camera.maxZoom, this.camera.zoom * 1.2);
    this.camera.autoFit = false;
  }

  zoomOut() {
    this.camera.zoom = Math.max(this.camera.minZoom, this.camera.zoom * 0.83);
    this.camera.autoFit = false;
  }

  bindEvents() {
    this.boundHandlers.onResize = () => this.resizeCanvas();
    window.addEventListener('resize', this.boundHandlers.onResize);

    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.canvas.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });

    this.boundHandlers.onKeyDown = (e) => this.onKeyDown(e);
    this.boundHandlers.onKeyUp = (e) => this.onKeyUp(e);
    window.addEventListener('keydown', this.boundHandlers.onKeyDown);
    window.addEventListener('keyup', this.boundHandlers.onKeyUp);
  }

  screenToWorld(screenX, screenY) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cx = (screenX * dpr) - (this.canvas.width / 2);
    const cy = (screenY * dpr) - (this.canvas.height / 2);
    const worldX = (cx / (this.camera.zoom * dpr)) + this.camera.x;
    const worldY = (cy / (this.camera.zoom * dpr)) + this.camera.y;
    return { x: worldX, y: worldY };
  }

  onMouseDown(e) {
    if (e.button === 0) { // Left click: walk or click person
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const worldPos = this.screenToWorld(mouseX, mouseY);

      // Check if clicking directly on a person
      const clicked = this.getPersonAt(worldPos.x, worldPos.y);
      if (clicked) {
        this.openPersonDetail(clicked.key);
        return;
      }

      // Check if clicking Oyen the cat
      const distCat = Math.hypot(worldPos.x - this.cat.x, worldPos.y - this.cat.y);
      if (distCat < 25) {
        this.petCat();
        return;
      }

      // Move player avatar
      this.player.targetX = Math.max(40, Math.min(this.worldWidth - 40, worldPos.x));
      this.player.targetY = Math.max(40, Math.min(this.worldHeight - 40, worldPos.y));
      this.player.isMoving = true;
    } else if (e.button === 2) { // Right click: drag camera
      this.isDragging = true;
      this.camera.autoFit = false;
      this.dragStart = { x: e.clientX, y: e.clientY };
      this.cameraDragStart = { x: this.camera.x, y: this.camera.y };
    }
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (this.isDragging) {
      const dx = (e.clientX - this.dragStart.x) / this.camera.zoom;
      const dy = (e.clientY - this.dragStart.y) / this.camera.zoom;
      this.camera.targetX = this.cameraDragStart.x - dx;
      this.camera.targetY = this.cameraDragStart.y - dy;
      return;
    }

    if (mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height) {
      const worldPos = this.screenToWorld(mouseX, mouseY);
      this.hoveredPerson = this.getPersonAt(worldPos.x, worldPos.y);
      this.canvas.style.cursor = this.hoveredPerson ? 'pointer' : 'default';
    }
  }

  onMouseUp(e) {
    if (e.button === 2) {
      this.isDragging = false;
    }
  }

  onWheel(e) {
    e.preventDefault();
    this.camera.autoFit = false;
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    this.camera.zoom = Math.max(this.camera.minZoom, Math.min(this.camera.maxZoom, this.camera.zoom * zoomFactor));
  }

  onKeyDown(e) {
    this.keys[e.key.toLowerCase()] = true;
    if (e.code === 'Space' && this.nearbyPerson) {
      e.preventDefault();
      this.openPersonDetail(this.nearbyPerson.key);
    }
  }

  onKeyUp(e) {
    this.keys[e.key.toLowerCase()] = false;
  }

  getPersonAt(worldX, worldY) {
    for (const p of Object.values(this.personnel)) {
      // Check proximity to character's head/body and desk
      const distChar = Math.hypot(worldX - p.x, worldY - p.y);
      const inDesk = (worldX >= p.deskX && worldX <= p.deskX + p.deskW && worldY >= p.deskY && worldY <= p.deskY + p.deskH);
      if (distChar < 28 || inDesk) return p;
    }
    return null;
  }

  petCat() {
    this.cat.purrTimer = 180;
    if (window.AppController && window.AppController.showToast) {
      window.AppController.showToast("🐱 Purr... Oyen the orange cat is happy! Meow! 🐾", "text-warning");
    }
  }

  openPersonDetail(personKey) {
    if (window.HCDSOfficeSupabase && window.HCDSOfficeSupabase.openMemberModal) {
      window.HCDSOfficeSupabase.openMemberModal(personKey);
    }
  }

  setDayNightMode(isNight) {
    this.isNight = isNight;
  }

  updateMemberStatus(key, status, activeTask) {
    if (this.personnel[key]) {
      this.personnel[key].status = status;
      if (activeTask) this.personnel[key].activeTask = activeTask;
    }
  }

  syncWithSupabase() {
    if (window.HCDSOfficeSupabase && window.HCDSOfficeSupabase.memberState) {
      Object.entries(window.HCDSOfficeSupabase.memberState).forEach(([key, state]) => {
        this.updateMemberStatus(key, state.status, state.activeTask);
      });
    }
    window.HCDSOffice2D = this;
  }

  startLoop() {
    const loop = () => {
      this.update();
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  update() {
    this.tick++;

    // 1. Player Keyboard Movement
    let moveX = 0;
    let moveY = 0;
    if (this.keys['arrowup'] || this.keys['w']) moveY -= 1;
    if (this.keys['arrowdown'] || this.keys['s']) moveY += 1;
    if (this.keys['arrowleft'] || this.keys['a']) moveX -= 1;
    if (this.keys['arrowright'] || this.keys['d']) moveX += 1;

    if (moveX !== 0 || moveY !== 0) {
      const len = Math.hypot(moveX, moveY);
      moveX /= len;
      moveY /= len;

      this.player.x += moveX * this.player.speed;
      this.player.y += moveY * this.player.speed;
      this.player.targetX = this.player.x;
      this.player.targetY = this.player.y;
      this.player.isMoving = true;
      this.player.direction = Math.abs(moveX) > Math.abs(moveY) ? (moveX > 0 ? 'right' : 'left') : (moveY > 0 ? 'down' : 'up');
    } else if (this.player.isMoving) {
      const dx = this.player.targetX - this.player.x;
      const dy = this.player.targetY - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist > this.player.speed) {
        this.player.x += (dx / dist) * this.player.speed;
        this.player.y += (dy / dist) * this.player.speed;
        this.player.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      } else {
        this.player.x = this.player.targetX;
        this.player.y = this.player.targetY;
        this.player.isMoving = false;
      }
    }

    this.player.x = Math.max(40, Math.min(this.worldWidth - 40, this.player.x));
    this.player.y = Math.max(40, Math.min(this.worldHeight - 40, this.player.y));

    if (this.player.isMoving) {
      this.player.animTimer++;
      if (this.player.animTimer > 8) {
        this.player.animFrame = (this.player.animFrame + 1) % 4;
        this.player.animTimer = 0;
      }
    } else {
      this.player.animFrame = 0;
    }

    // Camera follow if zoomed in beyond auto-fit
    if (!this.isDragging && !this.camera.autoFit) {
      this.camera.targetX = this.player.x;
      this.camera.targetY = this.player.y;
      this.camera.x += (this.camera.targetX - this.camera.x) * 0.08;
      this.camera.y += (this.camera.targetY - this.camera.y) * 0.08;
    }

    // Proximity Detection
    let closestPerson = null;
    let closestDist = 65;
    for (const p of Object.values(this.personnel)) {
      const dist = Math.hypot(this.player.x - p.x, this.player.y - p.y);
      if (dist < closestDist) {
        closestDist = dist;
        closestPerson = p;
      }
    }
    this.nearbyPerson = closestPerson;

    // Personnel Behavioral State Machine & Animations
    this.updatePersonnelAI();

    // Oyen Cat AI roaming in Coffee Lounge
    if (this.tick % 240 === 0 && Math.random() < 0.65) {
      this.cat.targetX = 80 + Math.random() * 260; // lounge boundaries
      this.cat.targetY = 600 + Math.random() * 110;
      this.cat.dir = this.cat.targetX > this.cat.x ? 1 : -1;
      this.cat.isWalking = true;
    }
    if (this.cat.isWalking) {
      const cdx = this.cat.targetX - this.cat.x;
      const cdy = this.cat.targetY - this.cat.y;
      const cdist = Math.hypot(cdx, cdy);
      if (cdist > 1.2) {
        this.cat.x += (cdx / cdist) * 0.7;
        this.cat.y += (cdy / cdist) * 0.7;
      } else {
        this.cat.isWalking = false;
      }
    }
    if (this.cat.purrTimer > 0) this.cat.purrTimer--;
  }

  // ─────────────────────────────────────────────────────────────
  // Dynamic Personnel AI & Thought Bubble Simulation
  // ─────────────────────────────────────────────────────────────
  generatePathToBreak(p, targetSpot) {
    const waypoints = [];
    const fromX = p.x;
    const fromY = p.y;
    const toX = targetSpot.x;
    const toY = targetSpot.y;

    if (p.homeY < 250) {
      // Row 1 (y: 130) -> Upper Corridor (y: 255) -> Lower Corridor (y: 525) -> Room
      waypoints.push({ x: fromX, y: fromY + 45 });
      waypoints.push({ x: fromX, y: 255 });
      const aisleX = (toX < 440) ? 220 : ((toX > 880) ? 1050 : 640);
      waypoints.push({ x: aisleX, y: 255 });
      waypoints.push({ x: aisleX, y: 525 });
      waypoints.push({ x: toX, y: 525 });
      waypoints.push({ x: toX, y: toY });
    } else {
      // Row 2 (y: 380) -> Lower Corridor (y: 525) -> Room
      waypoints.push({ x: fromX, y: fromY + 40 });
      waypoints.push({ x: fromX, y: 525 });
      waypoints.push({ x: toX, y: 525 });
      waypoints.push({ x: toX, y: toY });
    }
    return waypoints;
  }

  generatePathToDesk(p) {
    const waypoints = [];
    const fromX = p.x;
    const fromY = p.y;
    const toX = p.homeX;
    const toY = p.homeY;

    // Exit room to Lower Corridor (y: 525)
    waypoints.push({ x: fromX, y: 525 });

    if (toY < 250) {
      // Returning to Row 1
      const aisleX = (fromX < 440) ? 220 : ((fromX > 880) ? 1050 : 640);
      waypoints.push({ x: aisleX, y: 525 });
      waypoints.push({ x: aisleX, y: 255 });
      waypoints.push({ x: toX, y: 255 });
      waypoints.push({ x: toX, y: toY + 45 });
      waypoints.push({ x: toX, y: toY });
    } else {
      // Returning to Row 2
      waypoints.push({ x: toX, y: 525 });
      waypoints.push({ x: toX, y: toY + 40 });
      waypoints.push({ x: toX, y: toY });
    }
    return waypoints;
  }

  getPersonaThought(p) {
    if (p.state === 'cafeteria') {
      const cafThoughts = [
        "☕ Fresh dark roast coffee hits just right!",
        "🥪 Delicious sandwich from the pantry buffet!",
        "🥗 Healthy lunch break before afternoon review.",
        "🧃 Fresh juice & good chat with team members.",
        "🍎 Grabbing a crisp apple from the pantry."
      ];
      return cafThoughts[Math.floor(Math.random() * cafThoughts.length)];
    }
    if (p.state === 'prayer') {
      const prayerThoughts = [
        "🤲 Waktunya solat & bersyukur sejenak.",
        "🕊️ Peaceful prayer break in the musholla.",
        "✨ Tenang dan khusyuk di musholla...",
        "🤲 Semoga sprint & deployment minggu ini berkah.",
        "🌿 Calming spiritual reflection."
      ];
      return prayerThoughts[Math.floor(Math.random() * prayerThoughts.length)];
    }
    if (p.state === 'lounge') {
      const loungeThoughts = [
        "🐱 Oyen is so fluffy today! Purrr...",
        "🛋️ Chilling on the beanbag to clear my head.",
        "💡 Just got a fresh architectural insight!",
        "🌿 Patio breeze is very relaxing.",
        "☕ Sipping double espresso in the garden lounge."
      ];
      return loungeThoughts[Math.floor(Math.random() * loungeThoughts.length)];
    }

    // At desk: thinking about active task
    const customThoughts = {
      'aryo': [
        "⚡ Bolt Engine: fine-tuning queue guards...",
        "💭 Annie burst print bottleneck is almost resolved!",
        "🏗️ Designing resilient multi-region failover",
        "🚀 Keeping system latency under 45ms"
      ],
      'ringo': [
        "🛠️ Upgrading node 4 of 8 Azure Burst Print VMs",
        "🐳 Docker cluster health check: all 13 agents green",
        "📊 Monitoring CPU throttle on annieds-api-001",
        "🔒 Hardening SSH keys and backup automation"
      ],
      'acid': [
        "📱 Checking iSmartOffice mobile backlog #14 & #16",
        "🚀 Reviewing patient appointment scheduling UX",
        "🔍 Testing offline sync for provider clinic app",
        "✨ Mobile UI feels snappy and responsive now"
      ],
      'rangga': [
        "💻 Setting up Auth0 CORS proxy headers...",
        "🎯 Clinical Finding UI component looking sharp!",
        "🛠️ Resolving web local dev token refresh loop",
        "📐 Verifying teeth charting grid alignment"
      ],
      'yudi': [
        "✅ TestFlight build verification passed 100%!",
        "🔍 Testing edge case: negative timepoint input",
        "🎨 Fine-tuning button states & hover transitions",
        "📋 QA regression checklist completed for today"
      ],
      'ary': [
        "🌐 Coordinating Carlos executive Zoom sync session",
        "📈 Global clinic outreach response rate up 22%",
        "🤝 Finalizing OrthoFX partnership notes",
        "📧 Sending weekly strategic briefs to stakeholders"
      ],
      'fikri': [
        "🤖 Investigating Annie image classification pipeline",
        "🔬 Dataset on Bioprogressive: 1600 cases validated",
        "📊 Matching cephalometric landmarks with Dr. Kaboudan",
        "⚡ Speeding up YOLO inference time by 18%"
      ],
      'kusnoto': [
        "📋 UIC Orthodontics roadmap alignment looks solid",
        "🎓 Academic clinical validation standards on track",
        "💡 Integrating ADA billing codes with AI findings",
        "🌟 High-standard clinical excellence for 2026"
      ],
      'flavio': [
        "💰 Stripe automated salary & payout pipeline verified",
        "📊 Reviewing LatAm expansion financial model",
        "🧾 Reconciling monthly cloud infrastructure costs",
        "📈 Financial health & budget allocation: strong"
      ],
      'kaboudan': [
        "🧠 Cephalometric landmark precision at 98.7%",
        "🔬 Reviewing clinical edge cases in AI diagnostics",
        "📐 Analyzing craniomaxillofacial angle metrics",
        "✨ Clinical diagnostic model verification completed"
      ],
      'ridwan': [
        "🔬 Researching Vision Transformer models for cephalometrics",
        "📊 Model benchmark: latency down 24ms, precision high",
        "💡 Fine-tuning deep learning feature extraction backbones",
        "🧪 Synthesizing test dataset validation findings"
      ],
      'joko': [
        "📈 Analyzing loss curves for orthodontic landmarking",
        "🔍 Investigating data augmentation edge cases",
        "🧠 Running ablation study on multi-scale feature pyramids",
        "📑 Drafting clinical research validation methodology"
      ]
    };

    const list = customThoughts[p.key];
    if (list && list.length > 0) {
      return list[Math.floor(Math.random() * list.length)];
    }
    if (p.activeTask) {
      return `💭 ${p.activeTask.slice(0, 36)}...`;
    }
    return "⚡ Focused on core sprint deliverables";
  }

  updatePersonnelAI() {
    const people = Object.values(this.personnel);

    // 1. Update thought bubble timers & animations
    people.forEach(p => {
      if (p.thought && p.thought.timer > 0) {
        p.thought.timer--;
        if (p.thought.timer > p.thought.maxTimer - 20) {
          p.thought.opacity = (p.thought.maxTimer - p.thought.timer) / 20;
        } else if (p.thought.timer < 20) {
          p.thought.opacity = p.thought.timer / 20;
        } else {
          p.thought.opacity = 1;
        }
      }

      // If walking along waypoints
      if (p.isWalking && p.waypoints && p.waypoints.length > 0) {
        const next = p.waypoints[0];
        const dx = next.x - p.x;
        const dy = next.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist > p.walkSpeed) {
          p.x += (dx / dist) * p.walkSpeed;
          p.y += (dy / dist) * p.walkSpeed;
          p.direction = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        } else {
          p.x = next.x;
          p.y = next.y;
          p.waypoints.shift();

          if (p.waypoints.length === 0) {
            // Reached destination!
            p.isWalking = false;
            p.state = p.targetState;

            if (p.state === 'desk') {
              p.direction = 'down';
              p.actionTimer = Math.floor(Math.random() * 800) + 500;
              if (Math.random() < 0.75) {
                p.thought = {
                  text: this.getPersonaThought(p),
                  timer: 200,
                  maxTimer: 200,
                  opacity: 0
                };
              }
            } else {
              // Arrived at break room
              if (p.state === 'prayer') p.direction = 'up';
              else if (p.state === 'cafeteria') p.direction = (p.y > 630 ? 'up' : 'down');
              else p.direction = 'down';

              p.actionTimer = Math.floor(Math.random() * 500) + 400;
              if (Math.random() < 0.85) {
                p.thought = {
                  text: this.getPersonaThought(p),
                  timer: 220,
                  maxTimer: 220,
                  opacity: 0
                };
              }
            }
          }
        }
      } else {
        // Idle at desk or at break spot
        if (p.actionTimer > 0) {
          p.actionTimer--;
        } else {
          if (p.state === 'desk') {
            const onBreak = people.filter(m => m.state !== 'desk' || m.isWalking).length;
            if (onBreak < 3) {
              const rand = Math.random();
              let roomType = 'cafeteria';
              if (p.key === 'kusnoto' || p.key === 'flavio') {
                // Avoid dr. Kusnoto and dr. Flavio visiting prayer room
                roomType = rand < 0.5 ? 'lounge' : 'cafeteria';
              } else {
                if (rand < 0.35) roomType = 'lounge';
                else if (rand < 0.60) roomType = 'prayer';
              }

              const spots = this.breakSpots[roomType];
              const spot = spots[Math.floor(Math.random() * spots.length)];

              p.waypoints = this.generatePathToBreak(p, spot);
              p.targetState = roomType;
              p.isWalking = true;
            } else {
              p.actionTimer = 220;
            }
          } else {
            // Returning to desk
            p.waypoints = this.generatePathToDesk(p);
            p.targetState = 'desk';
            p.isWalking = true;
          }
        }
      }
    });

    // 2. Periodic random thought bubble trigger (every ~140 ticks = ~2.3 seconds)
    if (this.tick % 140 === 0) {
      const activeThoughts = people.filter(p => p.thought && p.thought.timer > 0).length;
      if (activeThoughts < 2 && Math.random() < 0.7) {
        const availablePeople = people.filter(p => !p.thought || p.thought.timer === 0);
        if (availablePeople.length > 0) {
          const lucky = availablePeople[Math.floor(Math.random() * availablePeople.length)];
          lucky.thought = {
            text: this.getPersonaThought(lucky),
            timer: 210,
            maxTimer: 210,
            opacity: 0
          };
        }
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // Canvas Rendering
  // ─────────────────────────────────────────────────────────────
  render() {
    const ctx = this.ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    ctx.save();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply Camera Transform
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    ctx.scale(this.camera.zoom * dpr, this.camera.zoom * dpr);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. Floors & Corridors
    this.renderFloors(ctx);

    // 2. Room Glass Walls & Borders
    this.renderWalls(ctx);

    // 3. Background Furniture (Chairs, Projector Screen, Server Racks, Plants)
    this.renderWallFurniture(ctx);

    // 4. Foreground Desks, Monitors, and Keyboards
    this.renderDesksAndTech(ctx);

    // 5. Coffee Lounge, Cafeteria, & Prayer Room Props
    this.renderLoungeProps(ctx);
    this.renderCafeteriaProps(ctx);
    this.renderPrayerRoomProps(ctx);
    this.renderCat(ctx);

    // 6. Room Title Badges (Always crisp and visible at bottom-left of each room)
    this.renderRoomHeaders(ctx);

    // 7. Personnel Characters
    this.renderPersonnel(ctx);

    // 8. Visitor Avatar (You)
    this.renderPlayer(ctx);

    // 9. Overhead Nameplates & Live Status Badges
    this.renderOverheadLabels(ctx);

    // 10. Dynamic Thought Bubbles (Tasks, Coffee, Solat & Ideas)
    this.renderThoughtBubbles(ctx);

    // 11. Night Mode Ambient Darkness
    if (this.isNight) {
      this.renderNightOverlay(ctx);
    }

    ctx.restore();

    // 12. Screen-Space HUD Controls & Instructions
    this.renderHUD(ctx);
  }

  renderFloors(ctx) {
    // Outer building background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

    // Hallway corridor base
    ctx.fillStyle = '#151f32';
    ctx.fillRect(15, 15, this.worldWidth - 30, this.worldHeight - 30);

    // Subtle hallway tile lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 20; x < this.worldWidth - 20; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 20);
      ctx.lineTo(x, this.worldHeight - 20);
      ctx.stroke();
    }

    // Room Floors
    this.rooms.forEach(r => {
      ctx.save();
      if (r.floorType === 'wood_dark') {
        ctx.fillStyle = '#291b10';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = '#3d2817';
        for (let y = r.y + 16; y < r.y + r.h; y += 16) {
          ctx.beginPath();
          ctx.moveTo(r.x, y);
          ctx.lineTo(r.x + r.w, y);
          ctx.stroke();
        }
      } else if (r.floorType === 'wood_light') {
        ctx.fillStyle = '#3d2e1b';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = '#523e24';
        for (let y = r.y + 16; y < r.y + r.h; y += 16) {
          ctx.beginPath();
          ctx.moveTo(r.x, y);
          ctx.lineTo(r.x + r.w, y);
          ctx.stroke();
        }
      } else if (r.floorType === 'metal_grid') {
        ctx.fillStyle = '#0c1a24';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = '#183142';
        for (let x = r.x; x < r.x + r.w; x += 22) {
          ctx.beginPath();
          ctx.moveTo(x, r.y);
          ctx.lineTo(x, r.y + r.h);
          ctx.stroke();
        }
      } else if (r.floorType === 'checkered_tile') {
        // Cafeteria clean modern ceramic checkered tiles
        const tileSize = 24;
        for (let x = r.x; x < r.x + r.w; x += tileSize) {
          for (let y = r.y; y < r.y + r.h; y += tileSize) {
            const isLight = ((Math.floor((x - r.x) / tileSize) + Math.floor((y - r.y) / tileSize)) % 2 === 0);
            ctx.fillStyle = isLight ? '#1a2738' : '#111b27';
            ctx.fillRect(x, y, Math.min(tileSize, r.x + r.w - x), Math.min(tileSize, r.y + r.h - y));
            ctx.strokeStyle = '#223447';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x, y, Math.min(tileSize, r.x + r.w - x), Math.min(tileSize, r.y + r.h - y));
          }
        }
      } else if (r.floorType === 'carpet_emerald') {
        // Musholla / Prayer room serene green carpet with prayer lines
        ctx.fillStyle = '#043b2c';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = '#065f46';
        ctx.lineWidth = 1;
        for (let y = r.y + 20; y < r.y + r.h; y += 32) {
          ctx.beginPath();
          ctx.moveTo(r.x, y);
          ctx.lineTo(r.x + r.w, y);
          ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y + 40);
        ctx.lineTo(r.x + r.w, r.y + 40);
        ctx.stroke();
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        for (let x = r.x + 8; x < r.x + r.w; x += 16) {
          for (let y = r.y + 8; y < r.y + r.h; y += 16) {
            ctx.fillRect(x, y, 2, 2);
          }
        }
      }

      // Room border glow
      ctx.strokeStyle = r.borderColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.restore();
    });
  }

  renderWalls(ctx) {
    this.rooms.forEach(r => {
      // Top wall thickness
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(r.x, r.y, r.w, 10);
      ctx.fillStyle = '#334155';
      ctx.fillRect(r.x, r.y, r.w, 3);

      // Glass partition accents
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(r.x, r.y + r.h - 3, r.w * 0.42, 3);
      ctx.fillRect(r.x + r.w * 0.58, r.y + r.h - 3, r.w * 0.42, 3);
    });
  }

  renderRoomHeaders(ctx) {
    this.rooms.forEach(r => {
      ctx.save();
      ctx.font = 'bold 9.5px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
      const textW = ctx.measureText(r.title).width;
      const tagW = textW + 16;
      const tagH = 17;
      const tagX = r.x + 8;
      const tagY = r.y + r.h - tagH - 6; // Placed at bottom-left corner of each room

      // Background pill
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.fillRect(tagX, tagY, tagW, tagH);

      // Border outline
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.75)';
      ctx.lineWidth = 1;
      ctx.strokeRect(tagX, tagY, tagW, tagH);

      // Left color accent notch
      ctx.fillStyle = r.borderColor;
      ctx.fillRect(tagX, tagY, 3, tagH);

      // Room Title Text
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(r.title, tagX + 8, tagY + (tagH / 2) + 0.5);
      ctx.restore();
    });
  }

  renderWallFurniture(ctx) {
    // 1. Executive Suite Projector Screen
    ctx.fillStyle = '#020617';
    ctx.fillRect(95, 44, 230, 42);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.strokeRect(95, 44, 230, 42);
    ctx.font = 'bold 8.5px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('HCDS CLINICAL AI ROADMAP', 106, 56);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('• UIC Ortho • OrthoFX • ADA Codes', 106, 68);
    ctx.fillStyle = '#facc15';
    ctx.fillText('• LatAm Billing ($ Stripe Sync)', 106, 79);

    // 2. Chief Architect Blueprint Wall & Espresso Machine
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(490, 44, 230, 42);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1;
    ctx.strokeRect(490, 44, 230, 42);
    ctx.font = '8px monospace';
    ctx.fillStyle = '#818cf8';
    ctx.fillText('CORE SYSTEM ARCHITECTURE', 502, 56);
    ctx.fillText('⚡ Bolt Engine • Queue Lease Guard', 502, 68);
    ctx.fillStyle = '#a5b4fc';
    ctx.fillText('• Distributed Sync • Latency <45ms', 502, 80);

    // Master Aryo Espresso Station
    ctx.fillStyle = '#334155';
    ctx.fillRect(800, 50, 30, 32);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(803, 62, 24, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(806, 54, 5, 5); // red switch

    // Animated steam
    const steamY = (this.tick % 36) * 0.35;
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.4 - steamY / 20) + ')';
    ctx.beginPath();
    ctx.arc(815, 48 - steamY, 2.5 + steamY * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // 3. Server Racks (Mas Ringo Lab)
    for (let i = 0; i < 4; i++) {
      const rx = 895 + (i * 70);
      const ry = 46;
      ctx.fillStyle = '#050a12';
      ctx.fillRect(rx, ry, 54, 75);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 1;
      ctx.strokeRect(rx, ry, 54, 75);

      for (let b = 0; b < 6; b++) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(rx + 4, ry + 6 + (b * 11), 46, 7);

        // Blinking LEDs
        const isBlinking = ((this.tick + (i * 11) + (b * 7)) % 30) < 18;
        ctx.fillStyle = isBlinking ? '#22c55e' : '#14532d';
        ctx.fillRect(rx + 8, ry + 8 + (b * 11), 3, 3);

        const isAmber = ((this.tick + (i * 5) + (b * 13)) % 40) < 12;
        ctx.fillStyle = isAmber ? '#eab308' : '#713f12';
        ctx.fillRect(rx + 14, ry + 8 + (b * 11), 3, 3);
      }
    }

    // 4. Executive & Desk Chairs (drawn behind characters, staying at desk)
    Object.values(this.personnel).forEach(p => {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(p.homeX || p.x, (p.homeY || p.y) + 4, 14, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  renderPersonnel(ctx) {
    Object.values(this.personnel).forEach(p => {
      this.drawPixelCharacter(ctx, p.x, p.y, p, false);
    });
  }

  renderDesksAndTech(ctx) {
    // Render all desk surfaces in front of characters
    Object.values(this.personnel).forEach(p => {
      ctx.save();
      // Desk Base
      ctx.fillStyle = p.key === 'kusnoto' || p.key === 'flavio' ? '#3e1a06' : '#1e293b';
      ctx.fillRect(p.deskX, p.deskY, p.deskW, p.deskH);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(p.deskX, p.deskY, p.deskW, p.deskH);

      // Computer Monitors on Desk
      if (p.key === 'aryo') {
        // Master Aryo: Triple Ultra-Wide Monitor
        ctx.fillStyle = '#020617';
        ctx.fillRect(p.deskX + 6, p.deskY + 4, 16, 15);
        ctx.fillRect(p.deskX + 24, p.deskY + 2, 22, 17);
        ctx.fillRect(p.deskX + 48, p.deskY + 4, 16, 15);

        ctx.fillStyle = '#818cf8';
        ctx.fillRect(p.deskX + 8, p.deskY + 6, 12, 11);
        ctx.fillRect(p.deskX + 26, p.deskY + 4, 18, 13);
        ctx.fillRect(p.deskX + 50, p.deskY + 6, 12, 11);

        // Keyboard & Mouse
        ctx.fillStyle = '#475569';
        ctx.fillRect(p.deskX + 25, p.deskY + 23, 20, 8);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(p.deskX + 48, p.deskY + 24, 4, 6);
      } else if (p.key === 'fikri' || p.key === 'kaboudan') {
        // Annie Team: Dual AI Screens
        ctx.fillStyle = '#020617';
        ctx.fillRect(p.deskX + 8, p.deskY + 4, 26, 15);
        ctx.fillRect(p.deskX + 40, p.deskY + 4, 26, 15);

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(p.deskX + 10, p.deskY + 6, 22, 11);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(p.deskX + 42, p.deskY + 6, 22, 11);

        ctx.fillStyle = '#475569';
        ctx.fillRect(p.deskX + 24, p.deskY + 23, 24, 7);
      } else if (p.key === 'kusnoto' || p.key === 'flavio') {
        // Executive Laptops
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(p.deskX + 22, p.deskY + 12, 28, 18);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(p.deskX + 24, p.deskY + 14, 24, 10);
      } else if (p.key === 'ary') {
        // Mas Ary: Outreach Globe & Monitor
        ctx.fillStyle = '#020617';
        ctx.fillRect(p.deskX + 8, p.deskY + 4, 30, 15);
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(p.deskX + 10, p.deskY + 6, 26, 11);

        // Globe
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.deskX + 58, p.deskY + 18, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        // Standard iMac / Dev Monitor
        ctx.fillStyle = '#020617';
        ctx.fillRect(p.deskX + 18, p.deskY + 4, 32, 15);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.deskX + 20, p.deskY + 6, 28, 11);

        ctx.fillStyle = '#475569';
        ctx.fillRect(p.deskX + 22, p.deskY + 23, 24, 7);
      }
      ctx.restore();
    });
  }

  renderLoungeProps(ctx) {
    // 1. Espresso Bar Counter
    ctx.fillStyle = '#3e1a06';
    ctx.fillRect(50, 575, 140, 36);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(50, 575, 140, 36);

    // Espresso machine
    ctx.fillStyle = '#475569';
    ctx.fillRect(60, 564, 34, 16);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(64, 569, 5, 5); // red switch

    // Steam
    const steamY = (this.tick % 36) * 0.35;
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.4 - steamY / 20) + ')';
    ctx.beginPath();
    ctx.arc(77, 558 - steamY, 2.5 + steamY * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Coffee cups on bar
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(105, 582, 9, 12);
    ctx.fillRect(122, 582, 9, 12);
    ctx.fillRect(139, 582, 9, 12);

    // Water Dispenser
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(205, 572, 22, 40);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(216, 580, 8, 0, Math.PI * 2);
    ctx.fill();

    // 2. Cozy L-Sofa
    const sofaX = 65;
    const sofaY = 640;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sofaX, sofaY, 130, 44);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(sofaX, sofaY, 130, 44);
    // Cushions
    ctx.fillStyle = '#334155';
    ctx.fillRect(sofaX + 6, sofaY + 6, 36, 32);
    ctx.fillRect(sofaX + 46, sofaY + 6, 36, 32);
    ctx.fillRect(sofaX + 86, sofaY + 6, 36, 32);

    // Coffee Table in front of sofa
    ctx.fillStyle = '#292524';
    ctx.fillRect(sofaX + 20, sofaY + 54, 80, 22);
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 1;
    ctx.strokeRect(sofaX + 20, sofaY + 54, 80, 22);
    // Tablet/magazine on table
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(sofaX + 48, sofaY + 59, 18, 12);

    // 3. Beanbag Chairs
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.ellipse(245, 645, 24, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.ellipse(310, 655, 26, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Oyen's Cat Bed & Food Bowl
    const catBedX = 345;
    const catBedY = 705;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.ellipse(catBedX, catBedY, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fdba74';
    ctx.beginPath();
    ctx.ellipse(catBedX, catBedY, 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    // Bowl
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(catBedX - 25, catBedY + 4, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f97316';
    ctx.fillRect(catBedX - 27, catBedY + 2, 4, 3);
  }

  renderCafeteriaProps(ctx) {
    // 1. Food Buffet & Pantry Island Counter
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(470, 568, 400, 26);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(470, 568, 400, 26);

    // Buffet warming trays (chafing dishes)
    for (let i = 0; i < 3; i++) {
      const tx = 485 + i * 55;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(tx, 572, 38, 18);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(tx + 4, 574, 30, 4);
    }

    // Fruit bowl
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(680, 581, 14, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444'; // apple
    ctx.beginPath();
    ctx.arc(676, 578, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b'; // orange
    ctx.beginPath();
    ctx.arc(684, 578, 4, 0, Math.PI * 2);
    ctx.fill();

    // Drink Dispensers (Juice & Iced Tea)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(725, 564, 18, 28);
    ctx.fillStyle = '#f59e0b'; // orange juice
    ctx.fillRect(727, 569, 14, 18);

    ctx.fillStyle = '#78350f'; // iced tea
    ctx.fillRect(755, 564, 18, 28);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(757, 569, 14, 18);

    // Microwave & coffee pot
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(795, 566, 26, 22);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(798, 570, 14, 14);

    // 2. Dining Table 1 (seats 4)
    const dt1X = 515;
    const dt1Y = 635;
    const dtW = 100;
    const dtH = 42;
    // Chairs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(dt1X + 15, dt1Y - 12, 20, 10);
    ctx.fillRect(dt1X + 65, dt1Y - 12, 20, 10);
    ctx.fillRect(dt1X + 15, dt1Y + dtH + 2, 20, 10);
    ctx.fillRect(dt1X + 65, dt1Y + dtH + 2, 20, 10);
    // Tabletop
    ctx.fillStyle = '#292524';
    ctx.fillRect(dt1X, dt1Y, dtW, dtH);
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(dt1X, dt1Y, dtW, dtH);
    // Plates & cups
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(dt1X + 25, dt1Y + 14, 6, 0, Math.PI * 2);
    ctx.arc(dt1X + 75, dt1Y + 14, 6, 0, Math.PI * 2);
    ctx.arc(dt1X + 25, dt1Y + 28, 6, 0, Math.PI * 2);
    ctx.arc(dt1X + 75, dt1Y + 28, 6, 0, Math.PI * 2);
    ctx.fill();

    // 3. Dining Table 2 (seats 4)
    const dt2X = 705;
    const dt2Y = 635;
    // Chairs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(dt2X + 15, dt2Y - 12, 20, 10);
    ctx.fillRect(dt2X + 65, dt2Y - 12, 20, 10);
    ctx.fillRect(dt2X + 15, dt2Y + dtH + 2, 20, 10);
    ctx.fillRect(dt2X + 65, dt2Y + dtH + 2, 20, 10);
    // Tabletop
    ctx.fillStyle = '#292524';
    ctx.fillRect(dt2X, dt2Y, dtW, dtH);
    ctx.strokeStyle = '#44403c';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(dt2X, dt2Y, dtW, dtH);
    // Plates & cups
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(dt2X + 25, dt2Y + 14, 6, 0, Math.PI * 2);
    ctx.arc(dt2X + 75, dt2Y + 14, 6, 0, Math.PI * 2);
    ctx.arc(dt2X + 25, dt2Y + 28, 6, 0, Math.PI * 2);
    ctx.arc(dt2X + 75, dt2Y + 28, 6, 0, Math.PI * 2);
    ctx.fill();

    // Wall Chalkboard Menu
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(570, 544, 180, 18);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1;
    ctx.strokeRect(570, 544, 180, 18);
    ctx.font = '8px system-ui';
    ctx.fillStyle = '#4ade80';
    ctx.textAlign = 'center';
    ctx.fillText('🥗 HCDS PANTRY • Fresh Coffee & Lunch', 660, 556);
  }

  renderPrayerRoomProps(ctx) {
    // 1. Mihrab / Qibla Wall Arch (North Wall)
    const mihrabX = 1060;
    const mihrabY = 542;
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(mihrabX, mihrabY, 60, 20);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(mihrabX, mihrabY, 60, 20);

    // Arched dome header inside mihrab
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.arc(mihrabX + 30, mihrabY + 18, 18, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.stroke();

    // Qibla label & arrow
    ctx.font = 'bold 7.5px system-ui';
    ctx.fillStyle = '#fde047';
    ctx.textAlign = 'center';
    ctx.fillText('◀ QIBLA', mihrabX + 30, mihrabY + 12);

    // 2. Ornate Sajadah (Prayer Mats in 2 rows)
    const matW = 32;
    const matH = 44;
    const colXs = [970, 1025, 1080, 1135];
    const rowYs = [600, 665];

    rowYs.forEach(my => {
      colXs.forEach(mx => {
        // Sajadah base
        ctx.fillStyle = '#065f46';
        ctx.fillRect(mx, my, matW, matH);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.strokeRect(mx, my, matW, matH);

        // Arch contour
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(mx + (matW / 2), my + 14, 10, Math.PI, 0);
        ctx.stroke();

        // Fringe tassels
        ctx.fillStyle = '#fef08a';
        for (let f = 0; f < matW; f += 4) {
          ctx.fillRect(mx + f, my + matH, 2, 2.5);
        }
      });
    });

    // 3. Holy Book / Quran Rehal Stand
    const rehalX = 1205;
    const rehalY = 575;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(rehalX, rehalY, 26, 26);
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 1;
    ctx.strokeRect(rehalX, rehalY, 26, 26);
    // Open book on rehal
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(rehalX + 4, rehalY + 5, 8, 14);
    ctx.fillRect(rehalX + 14, rehalY + 5, 8, 14);
    ctx.fillStyle = '#166534';
    ctx.fillRect(rehalX + 2, rehalY + 5, 2, 14);
    ctx.fillRect(rehalX + 22, rehalY + 5, 2, 14);

    // 4. Wooden Shoe Rack at right side
    const shoeRackX = 1195;
    const shoeRackY = 722;
    ctx.fillStyle = '#3e1a06';
    ctx.fillRect(shoeRackX, shoeRackY, 36, 22);
    ctx.strokeStyle = '#572507';
    ctx.lineWidth = 1;
    ctx.strokeRect(shoeRackX, shoeRackY, 36, 22);
    // Shoes
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(shoeRackX + 4, shoeRackY + 4, 12, 6);
    ctx.fillStyle = '#475569';
    ctx.fillRect(shoeRackX + 20, shoeRackY + 4, 12, 6);
    ctx.fillStyle = '#334155';
    ctx.fillRect(shoeRackX + 4, shoeRackY + 12, 12, 6);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(shoeRackX + 20, shoeRackY + 12, 12, 6);

    // 5. Serene Lantern Ambient Halo
    const lanternX = 1210;
    const lanternY = 670;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(lanternX, lanternY, 4, 0, Math.PI * 2);
    ctx.fill();
    const glow = (Math.sin(this.tick * 0.08) * 0.15) + 0.35;
    ctx.fillStyle = `rgba(251, 191, 36, ${glow})`;
    ctx.beginPath();
    ctx.arc(lanternX, lanternY, 14, 0, Math.PI * 2);
    ctx.fill();

    // 6. Corner Indoor Plants
    const plantLocations = [
      { x: 45, y: 45 },
      { x: 390, y: 45 },
      { x: 455, y: 45 },
      { x: 825, y: 45 },
      { x: 45, y: 295 },
      { x: 1235, y: 295 },
      { x: 45, y: 555 },
      { x: 390, y: 555 },
      { x: 455, y: 555 },
      { x: 885, y: 555 },
      { x: 945, y: 555 },
      { x: 1235, y: 555 }
    ];
    plantLocations.forEach(pl => {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(pl.x, pl.y + 10, 14, 12);
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(pl.x + 7, pl.y + 7, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  renderCat(ctx) {
    ctx.save();
    const cx = this.cat.x;
    const cy = this.cat.y;

    // Cat Body
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    const headX = cx + (this.cat.dir * 9);
    const headY = cy - 2;
    ctx.beginPath();
    ctx.arc(headX, headY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(headX - 4, headY - 4);
    ctx.lineTo(headX - 1, headY - 10);
    ctx.lineTo(headX + 2, headY - 4);
    ctx.fill();

    // Tail
    const tailAngle = Math.sin(this.tick * 0.1) * 0.35;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - (this.cat.dir * 9), cy);
    ctx.quadraticCurveTo(cx - (this.cat.dir * 16), cy - 8 + (tailAngle * 5), cx - (this.cat.dir * 14), cy - 14);
    ctx.stroke();

    // Name tag
    ctx.font = 'bold 8.5px system-ui';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ea580c';
    ctx.fillText('Oyen 🐾', cx, cy - 14);

    if (this.cat.purrTimer > 0) {
      const heartY = (this.tick % 30) * 0.7;
      ctx.fillStyle = '#f43f5e';
      ctx.font = '11px serif';
      ctx.fillText('❤️', cx, cy - 20 - heartY);
    }
    ctx.restore();
  }

  renderPlayer(ctx) {
    const visitorMeta = {
      name: 'You (Visitor)',
      color: '#38bdf8',
      hair: '#ca8a04',
      shirt: '#0284c7',
      pants: '#0f172a',
      status: 'exploring',
      direction: this.player.direction
    };
    this.drawPixelCharacter(ctx, this.player.x, this.player.y, visitorMeta, true);
  }

  drawPixelCharacter(ctx, x, y, char, isPlayer) {
    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 9, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    let bobY = 0;
    let legOffset = 0;
    const isWalking = (isPlayer && this.player.isMoving) || (!isPlayer && char.isWalking);
    const isPraying = (!isPlayer && char.state === 'prayer');

    if (isWalking) {
      bobY = Math.sin(this.tick * 0.45) * 2;
      legOffset = Math.sin(this.tick * 0.45) * 3.5;
    } else if (isPraying) {
      // Gentle meditative prayer bowing
      bobY = Math.sin(this.tick * 0.06) * 1.5 + 2;
    } else {
      bobY = Math.sin((this.tick + (x * 7)) * 0.08) * 0.8;
    }

    const drawY = y + bobY;

    const isHijab = char.isHijab || char.key === 'acid';

    if (isHijab) {
      // ═══════════════════════════════════════════════════════════
      // FEMALE MODEL WITH HIJAB (SEUS ACID)
      // ═══════════════════════════════════════════════════════════
      const hijabColor = char.hijabColor || '#db2777';
      const hijabDrape = char.hijabDrape || '#be185d';
      const skirtColor = char.skirt || char.pants || '#831843';
      const blouseColor = char.shirt || '#ec4899';

      // 1. Lower Body / Maxi Skirt
      ctx.fillStyle = skirtColor;
      if (isPraying) {
        ctx.fillRect(x - 7, drawY + 8, 14, 6);
      } else {
        const sway = legOffset * 0.7;
        ctx.beginPath();
        ctx.moveTo(x - 6, drawY + 6);
        ctx.lineTo(x + 6, drawY + 6);
        ctx.lineTo(x + 7 + sway, drawY + 14);
        ctx.lineTo(x - 7 + sway, drawY + 14);
        ctx.closePath();
        ctx.fill();

        // Delicate Shoes
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(x - 5 + sway, drawY + 13, 3, 2);
        ctx.fillRect(x + 2 + sway, drawY + 13, 3, 2);
      }

      // 2. Modest Blouse & Sleeves
      ctx.fillStyle = blouseColor;
      ctx.fillRect(x - 6, drawY - 4, 12, 10);
      // Long sleeves
      ctx.fillRect(x - 8, drawY - 3, 3, 9);
      ctx.fillRect(x + 5, drawY - 3, 3, 9);
      // Hands
      ctx.fillStyle = '#fcd34d';
      ctx.fillRect(x - 8, drawY + 6, 3, 2);
      ctx.fillRect(x + 5, drawY + 6, 3, 2);

      // 3. Hijab Hood Base (Crown & Back of Head)
      ctx.fillStyle = hijabColor;
      ctx.beginPath();
      ctx.arc(x, drawY - 14, 8, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(x - 8, drawY - 14, 16, 10);

      // 4. Face Opening (Ciput / Underscarf & Skin)
      if (char.direction !== 'up') {
        // Inner cap (ciput) line
        ctx.fillStyle = char.innerCap || '#fdf2f8';
        ctx.fillRect(x - 4, drawY - 17, 8, 2);

        // Face skin
        ctx.fillStyle = '#fcd34d';
        ctx.fillRect(x - 4, drawY - 15, 8, 10);

        // 5. Feminine Eyes with Eyelashes & Soft Blush
        ctx.fillStyle = '#0f172a';
        if (isPraying) {
          // Serene closed eyes in prayer
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x - 3, drawY - 10);
          ctx.lineTo(x - 1, drawY - 10);
          ctx.moveTo(x + 1, drawY - 10);
          ctx.lineTo(x + 3, drawY - 10);
          ctx.stroke();
        } else if (char.direction === 'left') {
          ctx.fillRect(x - 3, drawY - 11, 2, 2.5);
          ctx.fillStyle = '#334155';
          ctx.fillRect(x - 4, drawY - 12, 1.5, 1);
        } else if (char.direction === 'right') {
          ctx.fillRect(x + 1, drawY - 11, 2, 2.5);
          ctx.fillStyle = '#334155';
          ctx.fillRect(x + 2.5, drawY - 12, 1.5, 1);
        } else {
          // Expressive eyes with eyelashes
          ctx.fillRect(x - 3, drawY - 11, 2, 2.5);
          ctx.fillRect(x + 1, drawY - 11, 2, 2.5);
          ctx.fillStyle = '#334155';
          ctx.fillRect(x - 4, drawY - 12, 1.5, 1);
          ctx.fillRect(x + 2.5, drawY - 12, 1.5, 1);

          // Soft pink blush
          ctx.fillStyle = 'rgba(244, 114, 182, 0.55)';
          ctx.fillRect(x - 4, drawY - 8, 2, 1.5);
          ctx.fillRect(x + 2, drawY - 8, 2, 1.5);
        }
      }

      // 6. Hijab Front Drape & Brooch
      ctx.fillStyle = hijabDrape;
      ctx.beginPath();
      ctx.moveTo(x - 7, drawY - 4);
      ctx.lineTo(x + 7, drawY - 4);
      ctx.lineTo(x + 4, drawY + 3);
      ctx.lineTo(x, drawY + 5);
      ctx.lineTo(x - 4, drawY + 3);
      ctx.closePath();
      ctx.fill();

      // Fold contour
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, drawY - 4);
      ctx.lineTo(x, drawY + 3);
      ctx.stroke();

      // Golden brooch pin
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x - 1, drawY - 2, 2, 2);
    } else {
      // ═══════════════════════════════════════════════════════════
      // STANDARD MALE / NEUTRAL PIXEL CHARACTER
      // ═══════════════════════════════════════════════════════════
      // Legs
      ctx.fillStyle = char.pants || '#1e293b';
      if (isPraying) {
        // Folded kneeling posture
        ctx.fillRect(x - 6, drawY + 8, 12, 5);
      } else {
        ctx.fillRect(x - 5, drawY + 6, 4, 7 + legOffset * 0.5);
        ctx.fillRect(x + 1, drawY + 6, 4, 7 - legOffset * 0.5);
      }

      // Torso / Shirt
      ctx.fillStyle = char.shirt || char.color;
      ctx.fillRect(x - 6, drawY - 4, 12, 10);

      // Head
      ctx.fillStyle = '#fcd34d';
      ctx.fillRect(x - 5, drawY - 16, 10, 12);

      // Hair
      ctx.fillStyle = char.hair || '#0f172a';
      ctx.fillRect(x - 6, drawY - 19, 12, 5);
      ctx.fillRect(x - 6, drawY - 16, 2, 4);
      ctx.fillRect(x + 4, drawY - 16, 2, 4);

      // Eyes
      ctx.fillStyle = '#0f172a';
      if (char.direction === 'up' || isPraying) {
        // Facing away or closed in prayer
      } else if (char.direction === 'left') {
        ctx.fillRect(x - 4, drawY - 11, 2, 2.5);
      } else if (char.direction === 'right') {
        ctx.fillRect(x + 2, drawY - 11, 2, 2.5);
      } else {
        ctx.fillRect(x - 3, drawY - 11, 2, 2.5);
        ctx.fillRect(x + 1, drawY - 11, 2, 2.5);
      }

      // Glasses for Master Aryo & dr. Kusnoto
      if (char.key === 'aryo' || char.key === 'kusnoto') {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 4, drawY - 12, 3, 3);
        ctx.strokeRect(x + 1, drawY - 12, 3, 3);
      }
    }

    ctx.restore();
  }

  renderThoughtBubbles(ctx) {
    Object.values(this.personnel).forEach(p => {
      if (!p.thought || p.thought.timer <= 0 || p.thought.opacity <= 0) return;

      const op = Math.min(1, Math.max(0, p.thought.opacity));
      const x = p.x;
      const floatY = Math.sin((this.tick + (p.x * 4)) * 0.08) * 2;
      const headY = p.y - 18;

      ctx.save();
      ctx.globalAlpha = op;

      // 1. Three rising thought bubbles
      const bubbleColor = 'rgba(15, 23, 42, 0.95)';
      const accentColor = p.color || '#38bdf8';

      // Circle 1 (closest to head)
      ctx.fillStyle = bubbleColor;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x + 8, headY - 10 + floatY * 0.25, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Circle 2
      ctx.beginPath();
      ctx.arc(x + 14, headY - 20 + floatY * 0.5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Circle 3
      ctx.beginPath();
      ctx.arc(x + 20, headY - 32 + floatY * 0.75, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 2. Main Thought Bubble Container
      ctx.font = '600 10px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
      const text = p.thought.text || '';
      const textMetrics = ctx.measureText(text);
      const bubbleW = Math.max(textMetrics.width + 24, 120);
      const bubbleH = 26;

      let bubbleCenterX = x + 24;
      let bubbleY = headY - 58 + floatY;

      // Keep within world bounds
      if (bubbleCenterX - (bubbleW / 2) < 25) bubbleCenterX = 25 + (bubbleW / 2);
      if (bubbleCenterX + (bubbleW / 2) > this.worldWidth - 25) bubbleCenterX = this.worldWidth - 25 - (bubbleW / 2);

      const bx = bubbleCenterX - (bubbleW / 2);
      const by = bubbleY;

      // Subtle glow
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 10;

      // Cloud bubble body
      ctx.fillStyle = bubbleColor;
      this.roundRect(ctx, bx, by, bubbleW, bubbleH, 13);
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.shadowBlur = 0;

      // Thought bubble text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(text, bubbleCenterX, by + (bubbleH / 2));

      ctx.restore();
    });
  }

  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  getCurrentRoomName(x, y) {
    for (const r of this.rooms) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        return r.title;
      }
    }
    return 'Corridor';
  }

  renderOverheadLabels(ctx) {
    Object.values(this.personnel).forEach(p => {
      ctx.save();
      const x = p.x;
      const y = p.y - 25; // Clear space above head

      ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      const textWidth = ctx.measureText(p.name).width;

      // Nameplate Pill
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(x - (textWidth / 2) - 6, y - 6, textWidth + 12, 13);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x - (textWidth / 2) - 6, y - 6, textWidth + 12, 13);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(p.name, x, y + 4);

      // Status Badge Icon
      let icon = '☕';
      let iconColor = '#eab308';
      if (p.status === 'working') {
        icon = '⚡';
        iconColor = '#38bdf8';
      } else if (p.status === 'done') {
        icon = '✅';
        iconColor = '#22c55e';
      }

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.arc(x + (textWidth / 2) + 9, y, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = iconColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '8px system-ui';
      ctx.fillText(icon, x + (textWidth / 2) + 9, y + 3);
      ctx.restore();
    });

    // Proximity Speech Bubble
    if (this.nearbyPerson) {
      const p = this.nearbyPerson;
      const bubbleX = p.x;
      const bubbleY = p.y - 48;

      ctx.save();
      const taskPreview = p.activeTask ? (p.activeTask.length > 44 ? p.activeTask.slice(0, 42) + '...' : p.activeTask) : 'Ready';
      const promptText = `💬 Press SPACE or Click to interact with ${p.name}`;

      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      const promptWidth = Math.max(ctx.measureText(promptText).width, ctx.measureText(taskPreview).width) + 24;

      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
      ctx.fillRect(bubbleX - (promptWidth / 2), bubbleY - 34, promptWidth, 36);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bubbleX - (promptWidth / 2), bubbleY - 34, promptWidth, 36);

      ctx.shadowBlur = 0;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(promptText, bubbleX, bubbleY - 20);

      ctx.font = '9.5px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`Task: ${taskPreview}`, bubbleX, bubbleY - 7);
      ctx.restore();
    }
  }

  renderNightOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(5, 10, 25, 0.65)';
    ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

    ctx.globalCompositeOperation = 'destination-out';
    Object.values(this.personnel).forEach(p => {
      const grad = ctx.createRadialGradient(p.x, p.y + 10, 10, p.x, p.y + 10, 85);
      grad.addColorStop(0, 'rgba(0,0,0,0.85)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y + 10, 85, 0, Math.PI * 2);
      ctx.fill();
    });

    const playerGrad = ctx.createRadialGradient(this.player.x, this.player.y, 10, this.player.x, this.player.y, 95);
    playerGrad.addColorStop(0, 'rgba(0,0,0,0.9)');
    playerGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = playerGrad;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, 95, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  renderHUD(ctx) {
    ctx.save();
    ctx.resetTransform();

    // Top-left RPG Guide pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.fillRect(14, 14, 275, 62);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, 275, 62);

    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('🕹️ HCDS VIRTUAL OFFICE (GATHER.TOWN RPG)', 24, 29);
    ctx.font = '9.5px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Move: WASD / Arrow keys or Click floor', 24, 42);
    ctx.fillText('Interact: Walk close + SPACE or Click desk', 24, 54);

    const currentZone = this.getCurrentRoomName(this.player.x, this.player.y);
    ctx.fillStyle = '#4ade80';
    ctx.fillText(`📍 Zone: ${currentZone}`, 24, 67);
    ctx.restore();
  }
}

// Global Export
window.Office2DScene = Office2DScene;
window.HCDSOffice2D = null;

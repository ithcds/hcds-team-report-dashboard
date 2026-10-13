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
        title: 'Chief Architect Bay',
        subtitle: 'Core Architecture & Blocker Untangling',
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
        title: 'Coffee Lounge & Garden Patio',
        subtitle: 'Espresso Bar, Beanbags & Oyen Cat',
        x: 140,
        y: 540,
        w: 1000,
        h: 230,
        floorType: 'wood_light',
        borderColor: '#f59e0b'
      }
    ];

    // ─────────────────────────────────────────────────────────────
    // Personnel Desks & Sprites (Guaranteed Wide Spacing)
    // ─────────────────────────────────────────────────────────────
    this.personnel = {
      'kusnoto': {
        key: 'kusnoto',
        name: 'dr. Kusnoto',
        role: 'CEO & Co-Founder',
        x: 130,
        y: 130,
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
        direction: 'down'
      },
      'flavio': {
        key: 'flavio',
        name: 'Dr. Flavio',
        role: 'CFO & Co-Founder',
        x: 290,
        y: 130,
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
        direction: 'down'
      },
      'aryo': {
        key: 'aryo',
        name: 'Master Aryo',
        role: 'Chief System Architect',
        x: 640,
        y: 130,
        deskX: 590,
        deskY: 152,
        deskW: 105,
        deskH: 42,
        color: '#6366f1',
        hair: '#0f172a',
        shirt: '#312e81',
        pants: '#1e1b4b',
        status: 'working',
        activeTask: 'Investigasi & Mitigasi Kendala Sistem Printing Annie',
        direction: 'down'
      },
      'ringo': {
        key: 'ringo',
        name: 'Mas Ringo',
        role: 'Senior Tech Lead & Infra Admin',
        x: 1050,
        y: 130,
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
        direction: 'down'
      },
      'acid': {
        key: 'acid',
        name: 'Seus Acid',
        role: 'iSmartOffice Team Lead',
        x: 95,
        y: 380,
        deskX: 65,
        deskY: 402,
        deskW: 68,
        deskH: 40,
        color: '#db2777',
        hair: '#701a75',
        shirt: '#be185d',
        pants: '#4c0519',
        status: 'working',
        activeTask: 'Review Mobile App Bug Backlog (#12, #14, #16)',
        direction: 'down'
      },
      'rangga': {
        key: 'rangga',
        name: 'Mas Rangga',
        role: 'Clinical Finding UI Dev',
        x: 230,
        y: 380,
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
        direction: 'down'
      },
      'yudi': {
        key: 'yudi',
        name: 'Mas Yudi',
        role: 'Tester & Designer Support',
        x: 365,
        y: 380,
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
        direction: 'down'
      },
      'ary': {
        key: 'ary',
        name: 'Mas Ary',
        role: 'Marketing & Outreach Lead',
        x: 640,
        y: 380,
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
        direction: 'down'
      },
      'fikri': {
        key: 'fikri',
        name: 'Kang Fikri',
        role: 'Mobile Dev & Coordinator',
        x: 910,
        y: 380,
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
        direction: 'down'
      },
      'kaboudan': {
        key: 'kaboudan',
        name: 'Dr. Kaboudan',
        role: 'Clinical AI Advisor',
        x: 1110,
        y: 380,
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
        direction: 'down'
      }
    };

    // Oyen the Orange Cat
    this.cat = {
      x: 540,
      y: 680,
      targetX: 540,
      targetY: 680,
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
    const margin = 30;
    const scaleX = (this.viewportWidth - margin) / this.worldWidth;
    const scaleY = (this.viewportHeight - margin) / this.worldHeight;
    this.camera.zoom = Math.min(scaleX, scaleY, 1.25);
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

    // Oyen Cat AI roaming in lounge
    if (this.tick % 240 === 0 && Math.random() < 0.6) {
      this.cat.targetX = 260 + Math.random() * 700;
      this.cat.targetY = 620 + Math.random() * 100;
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

    // 3. Room Title Ribbons
    this.renderRoomHeaders(ctx);

    // 4. Background Furniture (Chairs, Projector Screen, Server Racks, Plants)
    this.renderWallFurniture(ctx);

    // 5. Personnel Characters (Sitting in their chairs)
    this.renderPersonnel(ctx);

    // 6. Foreground Desks, Monitors, and Keyboards (Naturally in front of characters)
    this.renderDesksAndTech(ctx);

    // 7. Cat & Coffee Lounge Props
    this.renderLoungeProps(ctx);
    this.renderCat(ctx);

    // 8. Visitor Avatar (You)
    this.renderPlayer(ctx);

    // 9. Overhead Nameplates, Live Status Badges & Speech Bubbles
    this.renderOverheadLabels(ctx);

    // 10. Night Mode Ambient Darkness
    if (this.isNight) {
      this.renderNightOverlay(ctx);
    }

    ctx.restore();

    // 11. Screen-Space HUD Controls & Instructions
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
      ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
      const textW = ctx.measureText(r.title).width;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(r.x + 10, r.y + 12, textW + 20, 18);

      ctx.fillStyle = r.borderColor;
      ctx.fillRect(r.x + 10, r.y + 12, 3, 18);

      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(r.title, r.x + 18, r.y + 21);
      ctx.restore();
    });
  }

  renderWallFurniture(ctx) {
    // 1. Executive Suite Projector Screen
    ctx.fillStyle = '#020617';
    ctx.fillRect(150, 44, 150, 40);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.strokeRect(150, 44, 150, 40);
    ctx.font = 'bold 8.5px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('HCDS CLINICAL AI ROADMAP', 158, 56);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('• UIC Ortho • OrthoFX • ADA Codes', 158, 68);
    ctx.fillStyle = '#facc15';
    ctx.fillText('• LatAm Billing ($ Stripe Sync)', 158, 79);

    // 2. Chief Architect Blueprint Wall & Espresso Machine
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(520, 46, 120, 36);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1;
    ctx.strokeRect(520, 46, 120, 36);
    ctx.font = '8px monospace';
    ctx.fillStyle = '#818cf8';
    ctx.fillText('CORE SYSTEM ARCHITECTURE', 528, 58);
    ctx.fillText('⚡ Bolt Engine • Queue Lease Guard', 528, 70);

    // Master Aryo Espresso Station
    ctx.fillStyle = '#334155';
    ctx.fillRect(770, 52, 34, 34);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(774, 64, 26, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(778, 56, 5, 5); // red switch

    // Animated steam
    const steamY = (this.tick % 36) * 0.35;
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.4 - steamY / 20) + ')';
    ctx.beginPath();
    ctx.arc(788, 50 - steamY, 2.5 + steamY * 0.15, 0, Math.PI * 2);
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

    // 4. Executive & Desk Chairs (drawn behind characters)
    Object.values(this.personnel).forEach(p => {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 4, 14, 10, 0, 0, Math.PI * 2);
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
        ctx.fillRect(p.deskX + 6, p.deskY + 4, 26, 15);
        ctx.fillRect(p.deskX + 35, p.deskY + 2, 35, 17);
        ctx.fillRect(p.deskX + 73, p.deskY + 4, 26, 15);

        ctx.fillStyle = '#818cf8';
        ctx.fillRect(p.deskX + 8, p.deskY + 6, 22, 11);
        ctx.fillRect(p.deskX + 37, p.deskY + 4, 31, 13);
        ctx.fillRect(p.deskX + 75, p.deskY + 6, 22, 11);

        // Keyboard & Mouse
        ctx.fillStyle = '#475569';
        ctx.fillRect(p.deskX + 36, p.deskY + 23, 26, 8);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(p.deskX + 66, p.deskY + 24, 5, 6);
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
    // 1. Long Coffee Counter
    ctx.fillStyle = '#3e1a06';
    ctx.fillRect(200, 580, 240, 44);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(200, 580, 240, 44);

    // Coffee cups on bar
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(220, 592, 11, 13);
    ctx.fillRect(245, 592, 11, 13);
    ctx.fillRect(270, 592, 11, 13);

    // Water Dispenser
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(470, 578, 28, 48);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(484, 588, 10, 0, Math.PI * 2);
    ctx.fill();

    // 2. Beanbag Chairs & Sofa Lounge (Right side)
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.ellipse(820, 620, 26, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.ellipse(890, 630, 28, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.ellipse(960, 620, 26, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Potted Plants
    const plantLocations = [
      { x: 45, y: 45 },
      { x: 390, y: 45 },
      { x: 455, y: 45 },
      { x: 825, y: 45 },
      { x: 45, y: 295 },
      { x: 1235, y: 295 },
      { x: 160, y: 560 },
      { x: 1110, y: 560 }
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
    if (isPlayer && this.player.isMoving) {
      bobY = Math.sin(this.tick * 0.45) * 2;
      legOffset = Math.sin(this.tick * 0.45) * 3;
    } else {
      bobY = Math.sin((this.tick + (x * 7)) * 0.08) * 0.8;
    }

    const drawY = y + bobY;

    // Legs
    ctx.fillStyle = char.pants || '#1e293b';
    ctx.fillRect(x - 5, drawY + 6, 4, 7 + legOffset * 0.5);
    ctx.fillRect(x + 1, drawY + 6, 4, 7 - legOffset * 0.5);

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
    if (char.direction === 'up') {
      // Facing away
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

    ctx.restore();
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
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(14, 14, 260, 48);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, 260, 48);

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('🕹️ HCDS VIRTUAL OFFICE (GATHER.TOWN RPG)', 24, 30);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Move: WASD / Arrow keys or Click floor', 24, 42);
    ctx.fillText('Interact: Walk close + SPACE or Click desk', 24, 54);
    ctx.restore();
  }
}

// Global Export
window.Office2DScene = Office2DScene;
window.HCDSOffice2D = null;

// ─────────────────────────────────────────────────────────────
// HCDS Virtual 2D Office — Gather.town RPG Simulation
// Retro 16-Bit Top-Down Canvas 2D Engine with Live HC-SUPABASE Sync
// ─────────────────────────────────────────────────────────────

class Office2DScene {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.container = null;
    this.animationFrameId = null;
    this.isNight = false;

    // Viewport & Camera
    this.camera = {
      x: 700,
      y: 460,
      zoom: 1.0,
      minZoom: 0.65,
      maxZoom: 1.8,
      targetX: 700,
      targetY: 460
    };

    // Canvas world dimensions
    this.worldWidth = 1400;
    this.worldHeight = 920;

    // Player Avatar (Visitor)
    this.player = {
      x: 700,
      y: 740,
      targetX: 700,
      targetY: 740,
      speed: 3.2,
      isMoving: false,
      direction: 'up', // 'down' | 'up' | 'left' | 'right'
      animFrame: 0,
      animTimer: 0
    };

    // Keys pressed
    this.keys = {};

    // Interactive elements & proximity
    this.hoveredPerson = null;
    this.nearbyPerson = null;
    this.selectedPerson = null;

    // Ticks & Animation timer
    this.tick = 0;

    // Office Zones / Rooms
    this.rooms = [
      {
        id: 'executive',
        title: 'Executive Suite',
        subtitle: 'dr. Kusnoto & Dr. Flavio',
        x: 40,
        y: 40,
        w: 380,
        h: 260,
        floorType: 'wood_dark',
        borderColor: '#0284c7'
      },
      {
        id: 'architect',
        title: 'Chief Architect Bay',
        subtitle: 'Master Aryo Command Center',
        x: 460,
        y: 40,
        w: 480,
        h: 260,
        floorType: 'carpet_blue',
        borderColor: '#6366f1'
      },
      {
        id: 'infra',
        title: 'Cloud & Infrastructure Lab',
        subtitle: 'Mas Ringo Azure & DB Server Farm',
        x: 980,
        y: 40,
        w: 380,
        h: 260,
        floorType: 'metal_grid',
        borderColor: '#16a34a'
      },
      {
        id: 'ismart',
        title: 'iSmartOffice Team Bay',
        subtitle: 'Seus Acid, Mas Rangga, Mas Yudi',
        x: 40,
        y: 340,
        w: 460,
        h: 280,
        floorType: 'carpet_purple',
        borderColor: '#db2777'
      },
      {
        id: 'outreach',
        title: 'Global Outreach & Partners',
        subtitle: 'Mas Ary Marketing Hub',
        x: 540,
        y: 340,
        w: 320,
        h: 280,
        floorType: 'carpet_teal',
        borderColor: '#7c3aed'
      },
      {
        id: 'annie',
        title: 'Annie Insights Team Bay',
        subtitle: 'Kang Fikri & Dr. Kaboudan AI Lab',
        x: 900,
        y: 340,
        w: 460,
        h: 280,
        floorType: 'carpet_cyan',
        borderColor: '#0ea5e9'
      },
      {
        id: 'lounge',
        title: 'Team Coffee Lounge & Garden',
        subtitle: 'Espresso Bar, Beanbags & Oyen Cat',
        x: 240,
        y: 660,
        w: 920,
        h: 220,
        floorType: 'wood_light',
        borderColor: '#f59e0b'
      }
    ];

    // Team Personnel Avatars
    this.personnel = {
      'kusnoto': {
        key: 'kusnoto',
        name: 'dr. Kusnoto',
        role: 'CEO & Co-Founder',
        x: 180,
        y: 160,
        deskX: 180,
        deskY: 185,
        color: '#0284c7',
        hair: '#1e293b',
        shirt: '#0f172a',
        pants: '#334155',
        status: 'idle',
        activeTask: 'Executive Advisory & UIC Clinical AI Roadmap',
        direction: 'down'
      },
      'flavio': {
        key: 'flavio',
        name: 'Dr. Flavio',
        role: 'CFO & Co-Founder',
        x: 280,
        y: 160,
        deskX: 280,
        deskY: 185,
        color: '#0d9488',
        hair: '#334155',
        shirt: '#042f2e',
        pants: '#1e293b',
        status: 'idle',
        activeTask: 'Finance & Stripe Billing Overview',
        direction: 'down'
      },
      'aryo': {
        key: 'aryo',
        name: 'Master Aryo',
        role: 'Chief System Architect',
        x: 700,
        y: 160,
        deskX: 700,
        deskY: 190,
        color: '#6366f1',
        hair: '#0f172a',
        shirt: '#312e81',
        pants: '#1e1b4b',
        status: 'working',
        activeTask: 'Investigasi & Mitigasi Printing Annie',
        direction: 'down'
      },
      'ringo': {
        key: 'ringo',
        name: 'Mas Ringo',
        role: 'Senior Tech Lead & Infra Admin',
        x: 1150,
        y: 160,
        deskX: 1150,
        deskY: 190,
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
        x: 140,
        y: 470,
        deskX: 140,
        deskY: 495,
        color: '#db2777',
        hair: '#701a75',
        shirt: '#be185d',
        pants: '#4c0519',
        status: 'working',
        activeTask: 'Review Mobile App Bug Backlog',
        direction: 'down'
      },
      'rangga': {
        key: 'rangga',
        name: 'Mas Rangga',
        role: 'Clinical Finding UI Dev',
        x: 270,
        y: 470,
        deskX: 270,
        deskY: 495,
        color: '#f97316',
        hair: '#18181b',
        shirt: '#c2410c',
        pants: '#27272a',
        status: 'working',
        activeTask: 'iSmartOffice Web Local Dev Setup',
        direction: 'down'
      },
      'yudi': {
        key: 'yudi',
        name: 'Mas Yudi',
        role: 'Tester & Designer Support',
        x: 400,
        y: 470,
        deskX: 400,
        deskY: 495,
        color: '#eab308',
        hair: '#292524',
        shirt: '#a16207',
        pants: '#1c1917',
        status: 'done',
        activeTask: 'QA Verification & TestFlight Checks',
        direction: 'down'
      },
      'ary': {
        key: 'ary',
        name: 'Mas Ary',
        role: 'Marketing & Outreach Lead',
        x: 700,
        y: 470,
        deskX: 700,
        deskY: 495,
        color: '#7c3aed',
        hair: '#18181b',
        shirt: '#581c87',
        pants: '#1e1b4b',
        status: 'working',
        activeTask: 'Sphinx Partner Zoom Coordination',
        direction: 'down'
      },
      'fikri': {
        key: 'fikri',
        name: 'Kang Fikri',
        role: 'Mobile Dev & Coordinator',
        x: 1010,
        y: 470,
        deskX: 1010,
        deskY: 495,
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
        x: 1230,
        y: 470,
        deskX: 1230,
        deskY: 495,
        color: '#f8fafc',
        hair: '#475569',
        shirt: '#f1f5f9',
        pants: '#0f172a',
        status: 'idle',
        activeTask: 'Orthodontic Cephalometric Verification',
        direction: 'down'
      }
    };

    // Oyen the Cat
    this.cat = {
      x: 700,
      y: 780,
      targetX: 700,
      targetY: 780,
      dir: 1, // 1: right, -1: left
      isWalking: false,
      tailTick: 0,
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

    // Check if 2D canvas wrap already exists or create it
    let wrap = container.querySelector('.office-canvas-wrap-2d');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'office-canvas-wrap-2d';
      wrap.style.cssText = 'position:relative; width:100%; height:100%; overflow:hidden; background:#0b1120; cursor:crosshair;';
      
      const canvas = document.createElement('canvas');
      canvas.id = 'office2DCanvas';
      canvas.style.cssText = 'display:block; width:100%; height:100%; image-rendering:pixelated;';
      wrap.appendChild(canvas);

      // Insert wrap before or alongside 3D canvas
      const stage = container.querySelector('.office-stage');
      if (stage) {
        stage.appendChild(wrap);
      } else {
        container.appendChild(wrap);
      }
    }

    this.canvas = wrap.querySelector('#office2DCanvas') || wrap.querySelector('canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    this.resizeCanvas();
    this.bindEvents();
    this.startLoop();

    // Hook into Supabase adapter if present
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

    // Center camera initially
    if (this.camera.targetX === 700 && this.camera.targetY === 460) {
      this.camera.x = this.worldWidth / 2;
      this.camera.y = this.worldHeight / 2;
      this.camera.targetX = this.camera.x;
      this.camera.targetY = this.camera.y;
    }
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

  unbindEvents() {
    window.removeEventListener('resize', this.boundHandlers.onResize);
    window.removeEventListener('keydown', this.boundHandlers.onKeyDown);
    window.removeEventListener('keyup', this.boundHandlers.onKeyUp);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  screenToWorld(screenX, screenY) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cx = (screenX * dpr) - (this.canvas.width / 2);
    const cy = (screenY * dpr) - (this.canvas.height / 2);
    const worldX = (cx / (this.camera.zoom * dpr)) + this.camera.x;
    const worldY = (cy / (this.camera.zoom * dpr)) + this.camera.y;
    return { x: worldX, y: worldY };
  }

  worldToScreen(worldX, worldY) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sx = ((worldX - this.camera.x) * (this.camera.zoom * dpr) + (this.canvas.width / 2)) / dpr;
    const sy = ((worldY - this.camera.y) * (this.camera.zoom * dpr) + (this.canvas.height / 2)) / dpr;
    return { x: sx, y: sy };
  }

  onMouseDown(e) {
    if (e.button === 0) { // Left click
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
      if (distCat < 30) {
        this.petCat();
        return;
      }

      // Otherwise set player target destination
      this.player.targetX = Math.max(50, Math.min(this.worldWidth - 50, worldPos.x));
      this.player.targetY = Math.max(50, Math.min(this.worldHeight - 50, worldPos.y));
      this.player.isMoving = true;
    } else if (e.button === 2) { // Right click drag to pan
      this.isDragging = true;
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
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(this.camera.minZoom, Math.min(this.camera.maxZoom, this.camera.zoom * zoomFactor));
    this.camera.zoom = newZoom;
  }

  onKeyDown(e) {
    this.keys[e.key.toLowerCase()] = true;

    // Space key to interact with nearby person
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
      const dist = Math.hypot(worldX - p.x, worldY - (p.y + 10));
      if (dist < 32) return p;
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
    } else {
      console.log('Opened person:', personKey);
    }
  }

  resetCameraView() {
    this.camera.targetX = this.worldWidth / 2;
    this.camera.targetY = this.worldHeight / 2;
    this.camera.zoom = 1.0;
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

  // ─────────────────────────────────────────────────────────────
  // Game Loop & Update Logic
  // ─────────────────────────────────────────────────────────────
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

    // 1. Player Keyboard Movement (WASD / Arrows)
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

      if (Math.abs(moveX) > Math.abs(moveY)) {
        this.player.direction = moveX > 0 ? 'right' : 'left';
      } else {
        this.player.direction = moveY > 0 ? 'down' : 'up';
      }
    } else if (this.player.isMoving) {
      const dx = this.player.targetX - this.player.x;
      const dy = this.player.targetY - this.player.y;
      const dist = Math.hypot(dx, dy);

      if (dist > this.player.speed) {
        this.player.x += (dx / dist) * this.player.speed;
        this.player.y += (dy / dist) * this.player.speed;
        if (Math.abs(dx) > Math.abs(dy)) {
          this.player.direction = dx > 0 ? 'right' : 'left';
        } else {
          this.player.direction = dy > 0 ? 'down' : 'up';
        }
      } else {
        this.player.x = this.player.targetX;
        this.player.y = this.player.targetY;
        this.player.isMoving = false;
      }
    }

    // Clamp player inside office bounds
    this.player.x = Math.max(50, Math.min(this.worldWidth - 50, this.player.x));
    this.player.y = Math.max(50, Math.min(this.worldHeight - 50, this.player.y));

    // Player walking animation frame
    if (this.player.isMoving) {
      this.player.animTimer++;
      if (this.player.animTimer > 8) {
        this.player.animFrame = (this.player.animFrame + 1) % 4;
        this.player.animTimer = 0;
      }
    } else {
      this.player.animFrame = 0;
    }

    // 2. Camera Smooth Follow
    if (!this.isDragging) {
      this.camera.targetX = this.player.x;
      this.camera.targetY = this.player.y;
    }

    this.camera.x += (this.camera.targetX - this.camera.x) * 0.08;
    this.camera.y += (this.camera.targetY - this.camera.y) * 0.08;

    // 3. Proximity Detection (Nearby Person)
    let closestPerson = null;
    let closestDist = 70;

    for (const p of Object.values(this.personnel)) {
      const dist = Math.hypot(this.player.x - p.x, this.player.y - p.y);
      if (dist < closestDist) {
        closestDist = dist;
        closestPerson = p;
      }
    }
    this.nearbyPerson = closestPerson;

    // 4. Oyen the Cat AI
    if (this.tick % 180 === 0 && Math.random() < 0.6) {
      this.cat.targetX = 350 + Math.random() * 650;
      this.cat.targetY = 720 + Math.random() * 120;
      this.cat.dir = this.cat.targetX > this.cat.x ? 1 : -1;
      this.cat.isWalking = true;
    }

    if (this.cat.isWalking) {
      const cdx = this.cat.targetX - this.cat.x;
      const cdy = this.cat.targetY - this.cat.y;
      const cdist = Math.hypot(cdx, cdy);
      if (cdist > 1) {
        this.cat.x += (cdx / cdist) * 0.8;
        this.cat.y += (cdy / cdist) * 0.8;
      } else {
        this.cat.isWalking = false;
      }
    }

    if (this.cat.purrTimer > 0) this.cat.purrTimer--;
  }

  // ─────────────────────────────────────────────────────────────
  // Rendering
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

    // 1. Draw Office Flooring & Zones
    this.renderOfficeFloors(ctx);

    // 2. Draw Room Walls & Glass Dividers
    this.renderOfficeWalls(ctx);

    // 3. Draw Room Banners & Labels
    this.renderRoomHeaders(ctx);

    // 4. Draw Furniture (Desks, Server Racks, Plants, Coffee Station)
    this.renderFurniture(ctx);

    // 5. Draw Animated Elements (Server LEDs, Coffee Steam)
    this.renderAnimatedProps(ctx);

    // 6. Draw Cat (Oyen)
    this.renderCat(ctx);

    // 7. Draw Team Personnel Sprites
    this.renderPersonnel(ctx);

    // 8. Draw Player Avatar (Visitor)
    this.renderPlayer(ctx);

    // 9. Draw Speech Bubbles & Live Status Indicators
    this.renderOverheadIndicators(ctx);

    // 10. Night Mode Ambient Darkness
    if (this.isNight) {
      this.renderNightOverlay(ctx);
    }

    ctx.restore();

    // 11. Screen-Space HUD & Controls Prompt
    this.renderHUD(ctx);
  }

  renderOfficeFloors(ctx) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(20, 20, this.worldWidth - 40, this.worldHeight - 40);

    this.rooms.forEach(r => {
      ctx.save();
      if (r.floorType === 'wood_dark') {
        ctx.fillStyle = '#291b10';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = '#3b2716';
        ctx.lineWidth = 1;
        for (let y = r.y + 16; y < r.y + r.h; y += 16) {
          ctx.beginPath();
          ctx.moveTo(r.x, y);
          ctx.lineTo(r.x + r.w, y);
          ctx.stroke();
        }
      } else if (r.floorType === 'wood_light') {
        ctx.fillStyle = '#3a2e1d';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = '#4e3e27';
        ctx.lineWidth = 1;
        for (let y = r.y + 16; y < r.y + r.h; y += 16) {
          ctx.beginPath();
          ctx.moveTo(r.x, y);
          ctx.lineTo(r.x + r.w, y);
          ctx.stroke();
        }
      } else if (r.floorType === 'metal_grid') {
        ctx.fillStyle = '#0f2027';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = '#1b3440';
        ctx.lineWidth = 1;
        for (let x = r.x; x < r.x + r.w; x += 24) {
          ctx.beginPath();
          ctx.moveTo(x, r.y);
          ctx.lineTo(x, r.y + r.h);
          ctx.stroke();
        }
        for (let y = r.y; y < r.y + r.h; y += 24) {
          ctx.beginPath();
          ctx.moveTo(r.x, y);
          ctx.lineTo(r.x + r.w, y);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#111c33';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        for (let x = r.x + 8; x < r.x + r.w; x += 16) {
          for (let y = r.y + 8; y < r.y + r.h; y += 16) {
            ctx.fillRect(x, y, 2, 2);
          }
        }
      }

      ctx.strokeStyle = r.borderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(r.x, r.y, r.w, r.h);
      ctx.restore();
    });
  }

  renderOfficeWalls(ctx) {
    this.rooms.forEach(r => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(r.x, r.y, r.w, 12);
      ctx.fillStyle = '#334155';
      ctx.fillRect(r.x, r.y, r.w, 4);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fillRect(r.x, r.y + r.h - 4, r.w * 0.4, 3);
      ctx.fillRect(r.x + r.w * 0.6, r.y + r.h - 4, r.w * 0.4, 3);
    });
  }

  renderRoomHeaders(ctx) {
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    this.rooms.forEach(r => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(r.x + 12, r.y + 14, ctx.measureText(r.title).width + 30, 22);

      ctx.fillStyle = r.borderColor;
      ctx.fillRect(r.x + 12, r.y + 14, 4, 22);

      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(r.title, r.x + 22, r.y + 18);
    });
  }

  renderFurniture(ctx) {
    // 1. Executive Boardroom Table
    ctx.fillStyle = '#451a03';
    ctx.fillRect(140, 175, 180, 50);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.strokeRect(140, 175, 180, 50);

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(170, 188, 20, 14);
    ctx.fillRect(270, 188, 20, 14);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(172, 190, 16, 8);
    ctx.fillRect(272, 190, 16, 8);

    // Projector Screen
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(160, 54, 140, 44);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(160, 54, 140, 44);
    ctx.font = '9px monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('HCDS CLINICAL AI ROADMAP', 168, 62);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('• UIC Ortho • OrthoFX • ADA', 168, 74);
    ctx.fillText('• LatAm Billing ($ Stripe OK)', 168, 86);

    // 2. Chief Architect Command Center (Master Aryo)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(630, 180, 140, 55);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 2;
    ctx.strokeRect(630, 180, 140, 55);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(645, 170, 32, 18);
    ctx.fillRect(685, 168, 38, 20);
    ctx.fillRect(730, 170, 32, 18);
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(647, 172, 28, 14);
    ctx.fillRect(687, 170, 34, 16);
    ctx.fillRect(732, 172, 28, 14);

    // Espresso Machine
    ctx.fillStyle = '#475569';
    ctx.fillRect(880, 80, 36, 40);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(884, 94, 28, 6);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(888, 84, 6, 6);

    // 3. Server Racks (Mas Ringo)
    for (let i = 0; i < 4; i++) {
      const rx = 1010 + (i * 75);
      const ry = 80;
      ctx.fillStyle = '#090d16';
      ctx.fillRect(rx, ry, 60, 90);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1;
      ctx.strokeRect(rx, ry, 60, 90);

      for (let b = 0; b < 7; b++) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(rx + 4, ry + 8 + (b * 11), 52, 8);
      }
    }

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(1100, 185, 100, 48);
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1100, 185, 100, 48);

    // 4. iSmartOffice Desks
    const ismartDesks = [
      { x: 100, y: 490 },
      { x: 230, y: 490 },
      { x: 360, y: 490 }
    ];
    ismartDesks.forEach(d => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(d.x, d.y, 80, 48);
      ctx.strokeStyle = '#db2777';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(d.x, d.y, 80, 48);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(d.x + 24, d.y + 4, 32, 14);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(d.x + 26, d.y + 6, 28, 10);
    });

    // 5. Global Outreach Desk (Mas Ary)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(650, 490, 100, 48);
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(650, 490, 100, 48);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(670, 508, 8, 0, Math.PI * 2);
    ctx.fill();

    // 6. Annie Insights AI Lab Desks (Fikri, Kaboudan)
    const annieDesks = [
      { x: 970, y: 490 },
      { x: 1190, y: 490 }
    ];
    annieDesks.forEach(d => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(d.x, d.y, 85, 48);
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(d.x, d.y, 85, 48);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(d.x + 12, d.y + 4, 28, 14);
      ctx.fillRect(d.x + 44, d.y + 4, 28, 14);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(d.x + 14, d.y + 6, 24, 10);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(d.x + 46, d.y + 6, 24, 10);
    });

    // 7. Coffee Bar & Lounge Area (Bottom)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(280, 700, 180, 45);
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.strokeRect(280, 700, 180, 45);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(300, 712, 10, 12);
    ctx.fillRect(320, 712, 10, 12);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(350, 706, 8, 20);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(362, 706, 8, 20);

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(490, 700, 26, 46);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(503, 710, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.ellipse(820, 760, 24, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.ellipse(890, 770, 26, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    const plants = [
      { x: 50, y: 50 },
      { x: 410, y: 50 },
      { x: 470, y: 50 },
      { x: 930, y: 50 },
      { x: 50, y: 350 },
      { x: 1330, y: 350 },
      { x: 260, y: 680 },
      { x: 1140, y: 680 }
    ];
    plants.forEach(p => {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(p.x, p.y + 12, 16, 14);
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(p.x + 8, p.y + 8, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(p.x + 10, p.y + 6, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  renderAnimatedProps(ctx) {
    for (let i = 0; i < 4; i++) {
      const rx = 1010 + (i * 75);
      const ry = 80;
      for (let b = 0; b < 7; b++) {
        const isBlinking = ((this.tick + (i * 13) + (b * 7)) % 30) < 18;
        ctx.fillStyle = isBlinking ? '#22c55e' : '#14532d';
        ctx.fillRect(rx + 8, ry + 10 + (b * 11), 3, 3);

        const isAmber = ((this.tick + (i * 7) + (b * 11)) % 45) < 12;
        ctx.fillStyle = isAmber ? '#eab308' : '#713f12';
        ctx.fillRect(rx + 14, ry + 10 + (b * 11), 3, 3);
      }
    }

    const steamY = (this.tick % 40) * 0.4;
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.5 - (steamY / 20)) + ')';
    ctx.beginPath();
    ctx.arc(898, 76 - steamY, 3 + (steamY * 0.2), 0, Math.PI * 2);
    ctx.fill();
  }

  renderCat(ctx) {
    ctx.save();
    const cx = this.cat.x;
    const cy = this.cat.y;

    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const headX = cx + (this.cat.dir * 10);
    const headY = cy - 2;
    ctx.beginPath();
    ctx.arc(headX, headY, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(headX - 4, headY - 5);
    ctx.lineTo(headX - 1, headY - 11);
    ctx.lineTo(headX + 2, headY - 5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(headX + 1, headY - 5);
    ctx.lineTo(headX + 4, headY - 11);
    ctx.lineTo(headX + 7, headY - 5);
    ctx.fill();

    const tailAngle = Math.sin(this.tick * 0.1) * 0.4;
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - (this.cat.dir * 10), cy);
    ctx.quadraticCurveTo(cx - (this.cat.dir * 18), cy - 10 + (tailAngle * 5), cx - (this.cat.dir * 16), cy - 16);
    ctx.stroke();

    ctx.font = 'bold 9px system-ui';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ea580c';
    ctx.fillText('Oyen 🐾', cx, cy - 16);

    if (this.cat.purrTimer > 0) {
      const heartY = (this.tick % 30) * 0.8;
      ctx.fillStyle = '#f43f5e';
      ctx.font = '12px serif';
      ctx.fillText('❤️', cx, cy - 22 - heartY);
    }

    ctx.restore();
  }

  renderPersonnel(ctx) {
    Object.values(this.personnel).forEach(p => {
      this.drawPixelCharacter(ctx, p.x, p.y, p, false);
    });
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

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    let bobY = 0;
    let legOffset = 0;
    if (isPlayer && this.player.isMoving) {
      bobY = Math.sin(this.tick * 0.4) * 2;
      legOffset = Math.sin(this.tick * 0.4) * 3;
    } else {
      bobY = Math.sin((this.tick + (x * 7)) * 0.08) * 1;
    }

    const drawY = y + bobY;

    ctx.fillStyle = char.pants || '#1e293b';
    ctx.fillRect(x - 6, drawY + 6, 5, 8 + (legOffset * 0.5));
    ctx.fillRect(x + 1, drawY + 6, 5, 8 - (legOffset * 0.5));

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 7, drawY + 12 + (legOffset * 0.5), 6, 3);
    ctx.fillRect(x + 1, drawY + 12 - (legOffset * 0.5), 6, 3);

    ctx.fillStyle = char.shirt || char.color;
    ctx.fillRect(x - 7, drawY - 4, 14, 11);

    if (char.key === 'kusnoto' || char.key === 'flavio') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 2, drawY - 4, 4, 4);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(x - 1, drawY, 2, 5);
    }

    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(x - 6, drawY - 17, 12, 13);

    ctx.fillStyle = char.hair || '#0f172a';
    ctx.fillRect(x - 7, drawY - 20, 14, 6);
    ctx.fillRect(x - 7, drawY - 17, 3, 5);
    ctx.fillRect(x + 4, drawY - 17, 3, 5);

    ctx.fillStyle = '#0f172a';
    if (char.direction === 'up') {
      // Facing away
    } else if (char.direction === 'left') {
      ctx.fillRect(x - 5, drawY - 12, 2, 3);
    } else if (char.direction === 'right') {
      ctx.fillRect(x + 3, drawY - 12, 2, 3);
    } else {
      ctx.fillRect(x - 4, drawY - 12, 2, 3);
      ctx.fillRect(x + 2, drawY - 12, 2, 3);
    }

    if (char.key === 'aryo' || char.key === 'kusnoto') {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 5, drawY - 13, 4, 4);
      ctx.strokeRect(x + 1, drawY - 13, 4, 4);
    }

    ctx.font = 'bold 9px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const textWidth = ctx.measureText(char.name).width;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(x - (textWidth / 2) - 6, drawY - 33, textWidth + 12, 14);
    ctx.strokeStyle = char.color || '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - (textWidth / 2) - 6, drawY - 33, textWidth + 12, 14);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(char.name, x, drawY - 23);

    if (!isPlayer) {
      let icon = '☕';
      let iconColor = '#eab308';
      if (char.status === 'working') {
        icon = '⚡';
        iconColor = '#38bdf8';
      } else if (char.status === 'done') {
        icon = '✅';
        iconColor = '#22c55e';
      }

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.beginPath();
      ctx.arc(x + (textWidth / 2) + 9, drawY - 26, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = iconColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '9px system-ui';
      ctx.fillText(icon, x + (textWidth / 2) + 9, drawY - 23);
    }

    ctx.restore();
  }

  renderOverheadIndicators(ctx) {
    if (this.nearbyPerson) {
      const p = this.nearbyPerson;
      const bubbleX = p.x;
      const bubbleY = p.y - 50;

      ctx.save();
      const taskPreview = p.activeTask ? (p.activeTask.length > 40 ? p.activeTask.slice(0, 38) + '...' : p.activeTask) : 'Active';
      const promptText = `💬 Press SPACE or Click to interact with ${p.name}`;
      
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      const promptWidth = Math.max(ctx.measureText(promptText).width, ctx.measureText(taskPreview).width) + 24;

      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
      ctx.fillRect(bubbleX - (promptWidth / 2), bubbleY - 36, promptWidth, 38);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bubbleX - (promptWidth / 2), bubbleY - 36, promptWidth, 38);

      ctx.shadowBlur = 0;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(promptText, bubbleX, bubbleY - 22);

      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Task: ${taskPreview}`, bubbleX, bubbleY - 8);

      ctx.restore();
    }
  }

  renderNightOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(5, 10, 25, 0.65)';
    ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);

    ctx.globalCompositeOperation = 'destination-out';
    Object.values(this.personnel).forEach(p => {
      const grad = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, 90);
      grad.addColorStop(0, 'rgba(0,0,0,0.85)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 90, 0, Math.PI * 2);
      ctx.fill();
    });

    const playerGrad = ctx.createRadialGradient(this.player.x, this.player.y, 10, this.player.x, this.player.y, 100);
    playerGrad.addColorStop(0, 'rgba(0,0,0,0.9)');
    playerGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = playerGrad;
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, 100, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  renderHUD(ctx) {
    ctx.save();
    ctx.resetTransform();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(14, 14, 250, 48);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, 250, 48);

    ctx.font = '10px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('🕹️ 2D RPG VIRTUAL OFFICE (GATHER.TOWN)', 24, 30);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Move: WASD / Arrow keys or Click floor', 24, 42);
    ctx.fillText('Interact: Walk close + SPACE or Click desk', 24, 54);

    ctx.restore();
  }
}

// Global Export
window.Office2DScene = Office2DScene;
window.HCDSOffice2D = null;

// ─────────────────────────────────────────────────────────────
// HCDS Virtual 3D Office — Supabase Real-Time Data Adapter
// Connects Three.js Virtual Office with HC-SUPABASE
// ─────────────────────────────────────────────────────────────

const OFFICE_SUPABASE_CONFIG = {
  url: 'https://supabase.hcds.ai',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg3NjA2OTQyLCJleHAiOjIxMDMxODI5NDJ9.ck9xeyHCL3PBTq4Ozu1NqBi3BCsF8sS5zbtfEL_4no4'
};

// Team Members Mapping & Metadata
const OFFICE_MEMBERS = {
  'kusnoto': {
    id: 'kusnoto',
    displayName: 'dr. Kusnoto',
    fullName: 'Dr. Budi Kusnoto',
    role: 'CEO & Co-Founder',
    desk: 'Executive Suite',
    color: '#0284c7',
    avatarChar: 'K',
    aliases: ['dr. Budi Kusnoto', 'dr. Kusnoto', 'Dr. Budi Kusnoto', 'Kusnoto', 'Budi Kusnoto', 'Dr. Kusnoto'],
    phone: '13128041170',
    isExecutive: true,
    bio: 'CEO & Co-Founder of HCDS. Professor of Orthodontics at UIC. Leading executive decisions, clinical AI roadmaps, and international academic partnerships.'
  },
  'flavio': {
    id: 'flavio',
    displayName: 'dr. Flavio',
    fullName: 'dr. Flavio Sanchez',
    role: 'CFO & Executive Co-Founder',
    desk: 'Executive Suite',
    color: '#0d9488',
    avatarChar: 'F',
    aliases: ['Dr. Flavio Sanchez', 'dr. Flavio', 'Dr. Flavio', 'Flavio', 'Flavio Sanchez', 'Dr. Flavio Sanchez'],
    phone: '5519981812783',
    isExecutive: true,
    bio: 'CFO & Executive Co-Founder. Overseeing corporate finance, Stripe billing & subscription models, investor reporting, and Latin American orthodontic expansion.'
  },
  'aryo': {
    id: 'aryo',
    displayName: 'Master Aryo',
    fullName: 'Aryo Handono',
    role: 'Chief System Architect',
    desk: 'Chief Architect Bay',
    color: '#6366f1',
    avatarChar: 'A',
    aliases: ['Aryo Handono', 'Master Aryo', 'Master', 'Aryo'],
    phone: '6282122061000',
    bio: 'Creator of Bolt & Core Architect of HCDS, Annie Insights, and iSmartOffice systems. Lead architect untangling high-complexity engineering blockers.'
  },
  'ringo': {
    id: 'ringo',
    displayName: 'Mas Ringo',
    fullName: 'Ringo Noer Junaedy',
    role: 'Senior Technical Lead & Infra Admin',
    desk: 'Cloud & Infrastructure Bay',
    color: '#16a34a',
    avatarChar: 'R',
    aliases: ['Ringo Noer Junaedy', 'Mas Ringo', 'Ringo'],
    phone: '6282114141166',
    bio: 'Senior Technical Lead & Infra Admin. Azure VM clusters, Docker swarm, DB tier upgrades, burst printing daemon nodes, and server cost optimization.'
  },
  'acid': {
    id: 'acid',
    displayName: 'Seus Acid',
    fullName: 'Astrid Grahita Wulandari',
    role: 'iSmartOffice Team Lead',
    desk: 'iSmartOffice Team Desk',
    color: '#db2777',
    avatarChar: 'S',
    aliases: ['Astrid Grahita Wulandari', 'Seus Acid', 'Acid', 'Astrid'],
    phone: '6281906313117',
    bio: 'iSmartOffice Team Lead. Directs clinic client onboarding, Sphinx orthodontic training, portal clinic enhancements, and mobile QA workflows.'
  },
  'rangga': {
    id: 'rangga',
    displayName: 'Mas Rangga',
    fullName: 'Rangga Noer Rachman',
    role: 'Clinical Finding & UI Dev',
    desk: 'iSmartOffice Team Desk',
    color: '#f97316',
    avatarChar: 'R',
    aliases: ['Rangga Noer Rachman', 'Mas Rangga', 'Rangga'],
    phone: '6285324080304',
    bio: 'Frontend developer for Clinical Findings, Annie report templates, UI components, and client-side doctor workflows.'
  },
  'yudi': {
    id: 'yudi',
    displayName: 'Mas Yudi',
    fullName: 'Wahyudi Muhamad',
    role: 'Tester & Designer Support',
    desk: 'iSmartOffice Team Desk',
    color: '#eab308',
    avatarChar: 'Y',
    aliases: ['Wahyudi Muhamad', 'Mas Yudi', 'Yudi', 'Wahyudi'],
    phone: '6281262145655',
    bio: 'iSmartOffice testing support for Astrid (iOS/Android mobile apps, TestFlight, manual guide Canva/video) & visual designer support for Mas Ary.'
  },
  'fikri': {
    id: 'fikri',
    displayName: 'Kang Fikri',
    fullName: 'Fikri Irawan',
    role: 'Mobile Dev & Coordinator',
    desk: 'Annie Insights Team Desk',
    color: '#2563eb',
    avatarChar: 'K',
    aliases: ['Fikri Irawan', 'Kang Fikri', 'Fikri'],
    phone: '6281322017333',
    bio: 'Mobile App Developer for iSmartOffice & Sphinx apps, Annie test case coordinator, and weekly development tracking.'
  },
  'kaboudan': {
    id: 'kaboudan',
    displayName: 'Dr. Kaboudan',
    fullName: 'Dr. Kaboudan',
    role: 'Orthodontic & AI Advisor',
    desk: 'Annie Insights Team Desk',
    color: '#f8fafc',
    avatarChar: 'D',
    aliases: ['Dr. Kaboudan', 'dr. Kaboudan', 'Kaboudan'],
    phone: null,
    isDecoration: true,
    bio: 'Distinguished Clinical Advisory Council. Providing specialized orthodontic domain evaluation, cephalometric analysis guidance, and Annie AI model benchmarking.'
  },
  'ary': {
    id: 'ary',
    displayName: 'Mas Ary',
    fullName: 'Ary Handoyo',
    role: 'Marketing & Outreach',
    desk: 'Global Outreach Desk',
    color: '#7c3aed',
    avatarChar: 'M',
    aliases: ['Ary Handoyo', 'Mas Ary', 'Ary'],
    phone: '62811100431',
    bio: 'Marketing Lead & Partner Communications. Distributor relations, Sphinx onboarding guides, domain consistency, and international clinical webinars.'
  }
};

// Cluster Organization for Right Roadmap Panel
const OFFICE_CLUSTERS = [
  {
    name: 'Executive Suite',
    badge: 'HQ Leadership',
    members: ['kusnoto', 'flavio']
  },
  {
    name: 'Chief Architect Bay',
    badge: 'Core Engine',
    members: ['aryo']
  },
  {
    name: 'Cloud & Infrastructure Bay',
    badge: 'DevOps & Cluster',
    members: ['ringo']
  },
  {
    name: 'iSmartOffice Team Desk',
    badge: 'PMS & Mobile Apps',
    members: ['acid', 'rangga', 'yudi']
  },
  {
    name: 'Annie Insights Team Desk',
    badge: 'AI & Validation',
    members: ['fikri', 'kaboudan']
  },
  {
    name: 'Global Outreach Desk',
    badge: 'Growth & Partners',
    members: ['ary']
  }
];

class OfficeSupabaseAdapter {
  constructor() {
    this.client = null;
    this.tasks = [];
    this.reminders = [];
    this.contacts = [];
    this.memberState = {};
    this.isInitialized = false;

    // Initialize state
    Object.keys(OFFICE_MEMBERS).forEach(key => {
      this.memberState[key] = {
        status: 'idle',
        activeTask: null,
        tasks: [],
        reminders: []
      };
    });
  }

  async init(rootElement) {
    this.root = rootElement || document.querySelector('.office-container');
    if (!this.root) return;

    this.bindDomElements();
    this.initSupabaseClient();
    this.setupInteractivity();

    await this.fetchInitialData();
    this.subscribeRealtime();
    this.isInitialized = true;
  }

  bindDomElements() {
    this.dom = {
      statTotalTasks: this.root.querySelector('#statTotalTasks'),
      statActiveTasks: this.root.querySelector('#statActiveTasks'),
      statCompletedTasks: this.root.querySelector('#statCompletedTasks'),
      statReminders: this.root.querySelector('#statReminders'),
      statMembersOnline: this.root.querySelector('#statMembersOnline'),
      activityList: this.root.querySelector('#activityList'),
      clusterList: this.root.querySelector('#clusterList'),
      teamDock: this.root.querySelector('#teamDock'),
      modal: document.getElementById('officeModal'),
      modalTitle: document.getElementById('officeModalTitle'),
      modalBody: document.getElementById('officeModalBody'),
      modalClose: document.getElementById('officeModalClose'),
      btnResetCam: this.root.querySelector('#btnResetCam'),
      btnDayNight: this.root.querySelector('#btnDayNight')
    };

    if (this.dom.modalClose && this.dom.modal) {
      this.dom.modalClose.onclick = () => this.closeModal();
      this.dom.modal.onclick = (e) => {
        if (e.target === this.dom.modal) this.closeModal();
      };
    }

    if (this.dom.btnResetCam) {
      this.dom.btnResetCam.onclick = () => {
        if (window.HCDSOffice && window.HCDSOffice.resetCameraView) {
          window.HCDSOffice.resetCameraView();
        }
      };
    }

    if (this.dom.btnDayNight) {
      let night = false;
      this.dom.btnDayNight.onclick = () => {
        night = !night;
        this.dom.btnDayNight.classList.toggle('active', night);
        this.dom.btnDayNight.innerHTML = night ? '<i class="bi bi-sun"></i> Day' : '<i class="bi bi-moon-stars"></i> Night';
        if (window.HCDSOffice && window.HCDSOffice.setDayNightMode) {
          window.HCDSOffice.setDayNightMode(night);
        }
      };
    }

    // Connect 3D person click callback
    window.HCDSOffice = window.HCDSOffice || {};
    window.HCDSOffice.onPersonClick = (personKey) => {
      this.openMemberModal(personKey);
    };
  }

  initSupabaseClient() {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      this.client = supabase.createClient(OFFICE_SUPABASE_CONFIG.url, OFFICE_SUPABASE_CONFIG.key);
    } else {
      console.warn('[OfficeSupabase] Supabase JS SDK not loaded, using REST fallback.');
    }
  }

  async fetchInitialData() {
    try {
      const [tasksRes, remindersRes, contactsRes] = await Promise.all([
        this.queryTable('team_tasks', 'select=*&order=updated_at.desc&limit=100'),
        this.queryTable('team_reminders', 'select=*&order=remind_at.desc&limit=50'),
        this.queryTable('team_contact', 'select=*')
      ]);

      this.tasks = (Array.isArray(tasksRes) && tasksRes.length > 0) ? tasksRes : (this.tasks || []);
      this.reminders = (Array.isArray(remindersRes) && remindersRes.length > 0) ? remindersRes : (this.reminders || []);
      this.contacts = (Array.isArray(contactsRes) && contactsRes.length > 0) ? contactsRes : (this.contacts || []);

      this.processData();
      this.renderAll();
    } catch (err) {
      console.error('[OfficeSupabase] Error loading initial data:', err);
      this.processData();
      this.renderAll();
    }
  }

  async queryTable(table, query) {
    // 1. If running inside dashboard.html and DB is already loaded, reuse tasks/reminders directly
    if (table === 'team_tasks' && window.DatabaseService && typeof window.DatabaseService.getAllTasks === 'function') {
      try {
        const localTasks = window.DatabaseService.getAllTasks();
        if (localTasks && localTasks.length > 0) return localTasks;
      } catch (e) {}
    }

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const primaryUrl = isLocal ? `/api/supabase/${table}?${query}` : `${OFFICE_SUPABASE_CONFIG.url}/rest/v1/${table}?${query}`;
    const fallbackUrl = isLocal ? `${OFFICE_SUPABASE_CONFIG.url}/rest/v1/${table}?${query}` : `/api/supabase/${table}?${query}`;

    const fetchWithTimeout = async (url, ms = 4500) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), ms);
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'apikey': OFFICE_SUPABASE_CONFIG.key,
            'Authorization': `Bearer ${OFFICE_SUPABASE_CONFIG.key}`
          }
        });
        clearTimeout(id);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        clearTimeout(id);
        throw err;
      }
    };

    try {
      return await fetchWithTimeout(primaryUrl, 4500);
    } catch (err) {
      try {
        return await fetchWithTimeout(fallbackUrl, 4500);
      } catch (err2) {
        console.warn(`[OfficeSupabase] Failed to fetch table ${table}:`, err2);
        return [];
      }
    }
  }

  subscribeRealtime() {
    if (!this.client || !this.client.channel) return;

    try {
      const channel = this.client.channel('office3d-sync');

      channel
        .on('postgres_changes', { event: '*', schema: 'public', table: 'team_tasks' }, (payload) => {
          this.handleTaskChange(payload);
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'team_reminders' }, (payload) => {
          this.handleReminderChange(payload);
        })
        .subscribe((status) => {
          console.log('[OfficeSupabase] Realtime subscription status:', status);
        });
    } catch (err) {
      console.warn('[OfficeSupabase] Failed to subscribe to Realtime channel:', err);
    }
  }

  handleTaskChange(payload) {
    const { eventType, new: newRow, old: oldRow } = payload;
    if (eventType === 'INSERT') {
      this.tasks.unshift(newRow);
      this.addFeedItem({
        actor: this.getMemberDisplayName(newRow.team_member),
        action: 'created task',
        detail: newRow.task_title,
        badge: 'NEW',
        time: 'Just now'
      });
    } else if (eventType === 'UPDATE') {
      const idx = this.tasks.findIndex(t => t.id === newRow.id);
      if (idx !== -1) this.tasks[idx] = newRow;
      else this.tasks.unshift(newRow);

      this.addFeedItem({
        actor: this.getMemberDisplayName(newRow.team_member),
        action: newRow.status === 'Complete' ? 'completed task' : 'updated task',
        detail: newRow.task_title,
        badge: newRow.status === 'Complete' ? 'COMPLETE' : 'UPDATE',
        time: 'Just now'
      });
    } else if (eventType === 'DELETE') {
      this.tasks = this.tasks.filter(t => t.id !== oldRow.id);
    }

    this.processData();
    this.renderAll();
  }

  handleReminderChange(payload) {
    const { eventType, new: newRow } = payload;
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      const idx = this.reminders.findIndex(r => r.id === newRow.id);
      if (idx !== -1) this.reminders[idx] = newRow;
      else this.reminders.unshift(newRow);

      this.addFeedItem({
        actor: newRow.recipient_name || 'Team',
        action: 'received reminder',
        detail: newRow.reminder_text ? newRow.reminder_text.slice(0, 80) + '...' : 'WhatsApp Notification',
        badge: 'WAHA',
        time: 'Just now'
      });

      this.processData();
      this.renderAll();
    }
  }

  getMemberKeyByName(nameStr) {
    if (!nameStr) return null;
    const clean = nameStr.trim().toLowerCase();

    for (const [key, meta] of Object.entries(OFFICE_MEMBERS)) {
      if (clean === meta.displayName.toLowerCase() || clean === meta.fullName.toLowerCase()) {
        return key;
      }
      for (const alias of meta.aliases) {
        if (clean.includes(alias.toLowerCase()) || alias.toLowerCase().includes(clean)) {
          return key;
        }
      }
    }
    return null;
  }

  getMemberDisplayName(nameStr) {
    const key = this.getMemberKeyByName(nameStr);
    return key ? OFFICE_MEMBERS[key].displayName : (nameStr || 'Team Member');
  }

  processData() {
    // Reset state lists
    Object.keys(this.memberState).forEach(key => {
      this.memberState[key].tasks = [];
      this.memberState[key].reminders = [];
      this.memberState[key].activeTask = null;
      this.memberState[key].status = 'idle';
    });

    // Map tasks to members
    this.tasks.forEach(task => {
      const key = this.getMemberKeyByName(task.team_member);
      if (key && this.memberState[key]) {
        this.memberState[key].tasks.push(task);
      }
    });

    // Map reminders
    this.reminders.forEach(rem => {
      const key = this.getMemberKeyByName(rem.recipient_name);
      if (key && this.memberState[key]) {
        this.memberState[key].reminders.push(rem);
      }
    });

    // Determine current status of each member
    Object.entries(this.memberState).forEach(([key, state]) => {
      const meta = OFFICE_MEMBERS[key];
      if (meta && meta.isDecoration) {
        state.status = 'idle';
        state.activeTask = 'Orthodontic Advisory Council';
        return;
      }

      // Find in-progress tasks first
      const inProgress = state.tasks.find(t => (t.status || '').toLowerCase().includes('progress'));
      if (inProgress) {
        state.status = 'working';
        state.activeTask = inProgress.task_title;
      } else {
        const completed = state.tasks.find(t => (t.status || '').toLowerCase().includes('complete'));
        if (completed && state.tasks.length > 0) {
          state.status = 'done';
          state.activeTask = 'Sprint goals fulfilled';
        } else {
          state.status = 'idle';
          state.activeTask = 'Standby & Code Review';
        }
      }

      // Sync status with 3D and 2D models
      if (window.HCDSOffice && window.HCDSOffice.updateMemberStatus) {
        window.HCDSOffice.updateMemberStatus(key, state.status, state.activeTask);
      }
      if (window.HCDSOffice2D && window.HCDSOffice2D.updateMemberStatus) {
        window.HCDSOffice2D.updateMemberStatus(key, state.status, state.activeTask);
      }
    });
  }

  renderAll() {
    this.renderStats();
    this.renderFeed();
    this.renderClusters();
    this.renderDock();
  }

  renderStats() {
    if (!this.dom.statTotalTasks) return;

    const total = this.tasks.length;
    const active = this.tasks.filter(t => (t.status || '').toLowerCase().includes('progress')).length;
    const completed = this.tasks.filter(t => (t.status || '').toLowerCase().includes('complete')).length;
    const reminders = this.reminders.length;
    const online = Object.keys(OFFICE_MEMBERS).length;

    this.dom.statTotalTasks.textContent = total;
    this.dom.statActiveTasks.textContent = active;
    this.dom.statCompletedTasks.textContent = completed;
    this.dom.statReminders.textContent = reminders;
    this.dom.statMembersOnline.textContent = `${online} Active`;
  }

  renderFeed() {
    if (!this.dom.activityList) return;
    this.dom.activityList.innerHTML = '';

    // Take top 15 recent items combining tasks and reminders
    const recentEvents = [];

    this.tasks.slice(0, 10).forEach(t => {
      recentEvents.push({
        actor: this.getMemberDisplayName(t.team_member),
        action: t.status === 'Complete' ? 'completed task' : 'is working on',
        detail: t.task_title,
        badge: t.status === 'Complete' ? 'COMPLETE' : 'ACTIVE',
        badgeColor: t.status === 'Complete' ? 'var(--success)' : 'var(--primary)',
        timestamp: t.updated_at || t.task_date || t.created_at
      });
    });

    this.reminders.slice(0, 6).forEach(r => {
      recentEvents.push({
        actor: r.recipient_name || 'Team Member',
        action: 'scheduled reminder',
        detail: r.reminder_text ? r.reminder_text.slice(0, 90) + '...' : 'WhatsApp Notification',
        badge: 'WAHA',
        badgeColor: 'var(--warning)',
        timestamp: r.remind_at || r.created_at
      });
    });

    // Sort by timestamp descending
    recentEvents.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    if (recentEvents.length === 0) {
      this.dom.activityList.innerHTML = `
        <li class="feed-item" style="color:var(--text-muted); text-align:center; padding: 1.5rem 0.5rem;">
          <i class="bi bi-check2-circle text-success d-block mb-1" style="font-size:1.2rem;"></i>
          HC-SUPABASE connected.<br><span style="font-size:0.75rem;">No recent pending activity.</span>
        </li>
      `;
      return;
    }

    recentEvents.slice(0, 14).forEach(evt => {
      const li = document.createElement('li');
      li.className = 'feed-item';
      li.innerHTML = `
        <div class="feed-meta">
          <span class="feed-actor">${this.escapeHtml(evt.actor)}</span>
          <span style="font-size:0.65rem; font-weight:700; color:${evt.badgeColor}">${evt.badge}</span>
        </div>
        <div style="color:var(--text-muted); font-size:0.72rem; margin-bottom:0.15rem;">
          ${this.escapeHtml(evt.action)}:
        </div>
        <div style="font-weight:500; color:#fff;">
          ${this.escapeHtml(evt.detail)}
        </div>
      `;
      this.dom.activityList.appendChild(li);
    });
  }

  addFeedItem(evt) {
    if (!this.dom.activityList) return;
    const li = document.createElement('li');
    li.className = 'feed-item';
    li.innerHTML = `
      <div class="feed-meta">
        <span class="feed-actor">${this.escapeHtml(evt.actor)}</span>
        <span style="font-size:0.65rem; font-weight:700; color:var(--primary)">${evt.badge}</span>
      </div>
      <div style="color:var(--text-muted); font-size:0.72rem; margin-bottom:0.15rem;">
        ${this.escapeHtml(evt.action)}:
      </div>
      <div style="font-weight:500; color:#fff;">
        ${this.escapeHtml(evt.detail)}
      </div>
    `;
    this.dom.activityList.prepend(li);
  }

  renderClusters() {
    if (!this.dom.clusterList) return;
    this.dom.clusterList.innerHTML = '';

    OFFICE_CLUSTERS.forEach(cluster => {
      const card = document.createElement('div');
      card.className = 'team-cluster-card';

      let membersHtml = '';
      cluster.members.forEach(mKey => {
        const meta = OFFICE_MEMBERS[mKey];
        if (!meta) return;

        const state = this.memberState[mKey] || { status: 'idle' };
        let badgeClass = 'badge-idle';
        let badgeText = 'IDLE';

        if (state.status === 'working') {
          badgeClass = 'badge-working';
          badgeText = 'BUSY';
        } else if (state.status === 'done') {
          badgeClass = 'badge-done';
          badgeText = 'DONE';
        } else if (meta.isDecoration) {
          badgeClass = 'badge-done';
          badgeText = 'ADVISOR';
        }

        membersHtml += `
          <div class="member-row" style="cursor:pointer;" onclick="window.HCDSOfficeSupabase.openMemberModal('${mKey}')">
            <div class="member-info">
              <span class="member-dot" style="background:${meta.color};"></span>
              <span style="font-weight:600; color:#fff;">${this.escapeHtml(meta.displayName)}</span>
            </div>
            <span class="badge-status ${badgeClass}">${badgeText}</span>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="cluster-title">
          <span>${this.escapeHtml(cluster.name)}</span>
          <span style="font-size:0.65rem; color:var(--text-muted); font-weight:500;">${cluster.badge}</span>
        </div>
        <div>${membersHtml}</div>
      `;

      this.dom.clusterList.appendChild(card);
    });
  }

  renderDock() {
    if (!this.dom.teamDock) return;
    this.dom.teamDock.innerHTML = '';

    Object.entries(OFFICE_MEMBERS).forEach(([key, meta]) => {
      const state = this.memberState[key] || { status: 'idle' };
      const card = document.createElement('div');
      card.className = 'dock-card';
      card.onclick = () => this.openMemberModal(key);

      let statusDot = 'rgba(148, 163, 184, 0.4)';
      if (state.status === 'working') statusDot = '#38bdf8';
      else if (state.status === 'done') statusDot = '#34d399';

      card.innerHTML = `
        <div class="dock-avatar" style="background:${meta.color};">
          ${meta.avatarChar}
        </div>
        <div style="display:flex; flex-direction:column; line-height:1.2;">
          <span style="font-weight:600; color:#fff;">${this.escapeHtml(meta.displayName)}</span>
          <span style="font-size:0.66rem; color:var(--text-muted);">${this.escapeHtml(meta.desk)}</span>
        </div>
        <div style="width:6px; height:6px; border-radius:50%; background:${statusDot}; margin-left:4px;"></div>
      `;

      this.dom.teamDock.appendChild(card);
    });
  }

  openMemberModal(personKey) {
    const meta = OFFICE_MEMBERS[personKey];
    if (!meta || !this.dom.modal) return;

    const state = this.memberState[personKey] || { tasks: [], reminders: [], status: 'idle' };

    this.dom.modalTitle.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.6rem;">
        <span style="width:12px; height:12px; border-radius:50%; background:${meta.color};"></span>
        <span>${this.escapeHtml(meta.displayName)}</span>
        ${meta.isExecutive ? '<span style="font-size:0.65rem; background:rgba(2, 132, 199, 0.3); color:#38bdf8; padding:0.15rem 0.45rem; border-radius:4px; font-weight:700;">EXECUTIVE</span>' : ''}
      </div>
    `;

    let tasksHtml = '';
    if (state.tasks.length === 0) {
      tasksHtml = `<div style="color:var(--text-muted); font-size:0.8rem; padding:0.5rem 0;">No active tasks registered in Supabase.</div>`;
    } else {
      tasksHtml = state.tasks.slice(0, 5).map(t => `
        <div style="padding:0.45rem 0.65rem; background:rgba(15, 23, 42, 0.6); border-radius:6px; margin-bottom:0.35rem; border:1px solid rgba(148, 163, 184, 0.1);">
          <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted);">
            <span>${this.escapeHtml(t.id || 'TASK')} • ${this.escapeHtml(t.product || 'General')}</span>
            <span style="font-weight:700; color:${t.status === 'Complete' ? 'var(--success)' : 'var(--primary)'};">${this.escapeHtml(t.status || 'Active')}</span>
          </div>
          <div style="font-size:0.8rem; font-weight:600; color:#fff; margin-top:0.2rem;">
            ${this.escapeHtml(t.task_title || '')}
          </div>
        </div>
      `).join('');
    }

    let remindersHtml = '';
    if (state.reminders.length === 0) {
      remindersHtml = `<div style="color:var(--text-muted); font-size:0.8rem; padding:0.5rem 0;">No automated WhatsApp reminders queued.</div>`;
    } else {
      remindersHtml = state.reminders.slice(0, 3).map(r => `
        <div style="padding:0.45rem 0.65rem; background:rgba(15, 23, 42, 0.6); border-radius:6px; margin-bottom:0.35rem; border:1px solid rgba(148, 163, 184, 0.1);">
          <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--warning);">
            <span><i class="bi bi-whatsapp me-1"></i> ${r.is_recurring ? 'Recurring' : 'One-Time'}</span>
            <span>${r.status || 'Scheduled'}</span>
          </div>
          <div style="font-size:0.75rem; color:#e2e8f0; margin-top:0.2rem;">
            ${this.escapeHtml(r.reminder_text || '')}
          </div>
        </div>
      `).join('');
    }

    const phoneSection = meta.phone ? `
      <div style="margin-top:1rem; padding-top:0.85rem; border-top:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:0.75rem; color:var(--text-muted);">
          <i class="bi bi-telephone-fill me-1"></i> +${meta.phone}
        </span>
        <a href="https://wa.me/${meta.phone}" target="_blank" style="background:#22c55e; color:#fff; padding:0.35rem 0.8rem; border-radius:6px; font-size:0.75rem; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:0.3rem;">
          <i class="bi bi-whatsapp"></i> Chat via WAHA
        </a>
      </div>
    ` : `
      <div style="margin-top:1rem; padding-top:0.85rem; border-top:1px solid var(--border-color); font-size:0.75rem; color:var(--text-muted);">
        <i class="bi bi-award-fill text-warning me-1"></i> Honorary Advisory Council Member — UIC Orthodontics
      </div>
    `;

    this.dom.modalBody.innerHTML = `
      <div style="margin-bottom:1rem;">
        <div style="font-size:0.85rem; font-weight:700; color:var(--primary);">${this.escapeHtml(meta.role)}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.5rem;"><i class="bi bi-geo-alt-fill me-1"></i>${this.escapeHtml(meta.desk)}</div>
        <p style="font-size:0.78rem; line-height:1.4; color:#cbd5e1; margin:0;">${this.escapeHtml(meta.bio)}</p>
      </div>

      <div style="margin-bottom:1rem;">
        <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.05em; margin-bottom:0.4rem;">
          Current Tasks (HC-SUPABASE)
        </div>
        ${tasksHtml}
      </div>

      <div>
        <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.05em; margin-bottom:0.4rem;">
          HC-WAHA Reminders
        </div>
        ${remindersHtml}
      </div>

      ${phoneSection}
    `;

    this.dom.modal.classList.add('open');
  }

  closeModal() {
    if (this.dom.modal) this.dom.modal.classList.remove('open');
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  setupInteractivity() {
    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }
}

// Global instance
window.HCDSOfficeSupabase = new OfficeSupabaseAdapter();

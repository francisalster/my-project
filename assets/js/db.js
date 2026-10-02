/**
 * db.js - Local Database using localStorage
 * Web-Based Community Waste Management and Monitoring System
 */

const DB = (() => {
  const KEYS = {
    USERS:         'wms_users',
    REPORTS:       'wms_reports',
    SCHEDULES:     'wms_schedules',
    ANNOUNCEMENTS: 'wms_announcements',
    CATEGORIES:    'wms_categories',
    ACTIONS:       'wms_action_logs',
    INIT:          'wms_db_initialized'
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
  }

  function now() { return new Date().toISOString(); }

  function daysAgo(n) { return new Date(Date.now() - n * 86400000).toISOString(); }

  function getAll(key)         { return JSON.parse(localStorage.getItem(key) || '[]'); }
  function setAll(key, data)   { localStorage.setItem(key, JSON.stringify(data)); }
  function getById(key, id)    { return getAll(key).find(i => i.id === id) || null; }

  function insert(key, item) {
    const data = getAll(key);
    const newItem = { ...item, id: uid(), createdAt: now() };
    data.push(newItem);
    setAll(key, data);
    return newItem;
  }

  function update(key, id, changes) {
    const data = getAll(key);
    const idx  = data.findIndex(i => i.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...changes, updatedAt: now() };
    setAll(key, data);
    return data[idx];
  }

  function remove(key, id) {
    setAll(key, getAll(key).filter(i => i.id !== id));
  }

  // ── Seed Data ────────────────────────────────────────────────────────────────

  function seed() {
    if (localStorage.getItem(KEYS.INIT)) return;

    const adminId     = uid();
    const p1Id        = uid();
    const p2Id        = uid();
    const r1Id        = uid();
    const r2Id        = uid();
    const r3Id        = uid();

    // ── Users ────────────────────────────────────────────────────────────────
    setAll(KEYS.USERS, [
      {
        id: adminId, name: 'System Administrator', email: 'admin@wms.com',
        password: 'admin123', role: 'admin', phone: '09001234567',
        address: 'Barangay Hall, Main Street', status: 'active', createdAt: daysAgo(30)
      },
      {
        id: p1Id, name: 'Juan Dela Cruz', email: 'personnel@wms.com',
        password: 'personnel123', role: 'personnel', phone: '09009876543',
        address: 'Block 3, Zone 1', status: 'active', createdAt: daysAgo(20)
      },
      {
        id: p2Id, name: 'Rosa Reyes', email: 'rosa@wms.com',
        password: 'rosa123', role: 'personnel', phone: '09112233445',
        address: 'Block 7, Zone 2', status: 'active', createdAt: daysAgo(18)
      },
      {
        id: r1Id, name: 'Maria Santos', email: 'resident@wms.com',
        password: 'resident123', role: 'resident', phone: '09012345678',
        address: 'Block 5, Zone 2', status: 'active', createdAt: daysAgo(15)
      },
      {
        id: r2Id, name: 'Pedro Bautista', email: 'pedro@wms.com',
        password: 'pedro123', role: 'resident', phone: '09187654321',
        address: 'Block 2, Zone 1', status: 'active', createdAt: daysAgo(12)
      },
      {
        id: r3Id, name: 'Liza Reyes', email: 'liza@wms.com',
        password: 'liza123', role: 'resident', phone: '09223344556',
        address: 'Block 9, Zone 3', status: 'inactive', createdAt: daysAgo(10)
      }
    ]);

    // ── Waste Categories ──────────────────────────────────────────────────────
    setAll(KEYS.CATEGORIES, [
      {
        id: uid(), name: 'Biodegradable',
        description: 'Organic waste that naturally decomposes over time. It can be turned into compost.',
        examples: 'Food scraps, fruit peels, vegetable waste, leaves, garden trimmings, paper',
        color: '#388e3c', icon: 'bi-tree', createdAt: daysAgo(30)
      },
      {
        id: uid(), name: 'Non-Biodegradable',
        description: 'Waste that does not break down naturally and can persist in the environment for hundreds of years.',
        examples: 'Plastics, styrofoam cups, rubber, synthetic fabrics, glass (non-recyclable)',
        color: '#d32f2f', icon: 'bi-slash-circle', createdAt: daysAgo(30)
      },
      {
        id: uid(), name: 'Recyclable',
        description: 'Waste materials that can be collected, processed, and converted into new products.',
        examples: 'Aluminum cans, glass bottles, cardboard boxes, newspapers, metal scraps, PET bottles',
        color: '#1976d2', icon: 'bi-arrow-repeat', createdAt: daysAgo(30)
      },
      {
        id: uid(), name: 'Hazardous / Special Waste',
        description: 'Waste that poses a risk to human health or the environment and requires special handling.',
        examples: 'Batteries, expired medicines, paint cans, chemical containers, fluorescent bulbs, syringes',
        color: '#f57c00', icon: 'bi-exclamation-triangle', createdAt: daysAgo(30)
      }
    ]);

    // ── Reports ───────────────────────────────────────────────────────────────
    const rpt1 = uid(), rpt2 = uid(), rpt3 = uid(), rpt4 = uid(), rpt5 = uid(), rpt6 = uid();
    setAll(KEYS.REPORTS, [
      {
        id: rpt1, residentId: r1Id, residentName: 'Maria Santos',
        title: 'Illegal Dumping on Corner Street',
        description: 'A large pile of garbage is being dumped illegally on the corner of Main St. and Rizal Ave. The waste has been there for 3 days and is causing a strong foul smell, attracting pests.',
        location: 'Corner of Main St. and Rizal Ave., Zone 2',
        category: 'Illegal Dumping', photo: null,
        status: 'in_progress', actionTaken: 'Assigned to personnel. Inspection scheduled.',
        assignedTo: p1Id, createdAt: daysAgo(3), updatedAt: daysAgo(1)
      },
      {
        id: rpt2, residentId: r1Id, residentName: 'Maria Santos',
        title: 'Overflowing Garbage Bin near Barangay Park',
        description: 'The public garbage bin near the Barangay Park is overflowing. Garbage is spilling onto the sidewalk and is a health and sanitation hazard for park visitors.',
        location: 'Barangay Park, Zone 1',
        category: 'Overflowing Bin', photo: null,
        status: 'resolved', actionTaken: 'Bin was emptied and the area was thoroughly cleaned.',
        assignedTo: p1Id, createdAt: daysAgo(8), updatedAt: daysAgo(5)
      },
      {
        id: rpt3, residentId: r1Id, residentName: 'Maria Santos',
        title: 'Missed Garbage Collection – Block 5',
        description: 'The garbage collection truck did not pass through our block today even though it is the scheduled collection day. Our trash has been sitting outside since early this morning.',
        location: 'Block 5, Zone 2',
        category: 'Missed Collection', photo: null,
        status: 'pending', actionTaken: '',
        assignedTo: null, createdAt: daysAgo(0), updatedAt: daysAgo(0)
      },
      {
        id: rpt4, residentId: r2Id, residentName: 'Pedro Bautista',
        title: 'Burning of Garbage in Backyard',
        description: 'A household in Zone 3 near the basketball court is repeatedly burning garbage in their backyard. The smoke is causing discomfort and health concerns for nearby residents.',
        location: 'Zone 3, near Basketball Court',
        category: 'Other', photo: null,
        status: 'pending', actionTaken: '',
        assignedTo: null, createdAt: daysAgo(1), updatedAt: daysAgo(1)
      },
      {
        id: rpt5, residentId: r2Id, residentName: 'Pedro Bautista',
        title: 'Clogged Drainage Canal with Plastic Waste',
        description: 'The drainage canal along Block 2 is heavily clogged with plastic bags and other solid waste. During rainy days, water overflows onto the road and nearby houses.',
        location: 'Block 2, Zone 1',
        category: 'Illegal Dumping', photo: null,
        status: 'resolved', actionTaken: 'Drainage was cleared. Residents were informed and warned.',
        assignedTo: p2Id, createdAt: daysAgo(10), updatedAt: daysAgo(7)
      },
      {
        id: rpt6, residentId: r1Id, residentName: 'Maria Santos',
        title: 'Scattered Garbage After Strong Wind',
        description: 'After the heavy wind last night, garbage from the nearby collection point was scattered along the street. The area is now messy and needs immediate cleanup.',
        location: 'Block 6, Zone 2',
        category: 'Other', photo: null,
        status: 'in_progress', actionTaken: 'Cleanup crew dispatched.',
        assignedTo: p2Id, createdAt: daysAgo(2), updatedAt: daysAgo(1)
      }
    ]);

    // ── Schedules ─────────────────────────────────────────────────────────────
    setAll(KEYS.SCHEDULES, [
      {
        id: uid(), area: 'Zone 1 – Blocks 1 to 5', day: 'Monday',
        time: '6:00 AM – 9:00 AM', wasteType: 'Biodegradable', frequency: 'Weekly',
        notes: 'Please place garbage outside by 5:30 AM. Use green bags for organic waste.',
        createdAt: daysAgo(30)
      },
      {
        id: uid(), area: 'Zone 1 – Blocks 1 to 5', day: 'Thursday',
        time: '6:00 AM – 9:00 AM', wasteType: 'Non-Biodegradable & Recyclable', frequency: 'Weekly',
        notes: 'Segregate properly. Recyclables must be clean and dry.',
        createdAt: daysAgo(30)
      },
      {
        id: uid(), area: 'Zone 2 – Blocks 6 to 10', day: 'Tuesday',
        time: '7:00 AM – 10:00 AM', wasteType: 'Biodegradable', frequency: 'Weekly',
        notes: 'Use designated green bags for biodegradable waste.',
        createdAt: daysAgo(30)
      },
      {
        id: uid(), area: 'Zone 2 – Blocks 6 to 10', day: 'Friday',
        time: '7:00 AM – 10:00 AM', wasteType: 'Non-Biodegradable & Recyclable', frequency: 'Weekly',
        notes: 'Recyclables must be placed in a separate container.',
        createdAt: daysAgo(30)
      },
      {
        id: uid(), area: 'Zone 3 – Blocks 11 to 15', day: 'Wednesday',
        time: '6:00 AM – 9:00 AM', wasteType: 'All Types', frequency: 'Weekly',
        notes: 'All waste types collected on this day. Proper segregation is still required.',
        createdAt: daysAgo(30)
      },
      {
        id: uid(), area: 'Commercial Area & Public Market', day: 'Monday, Wednesday, Saturday',
        time: '5:00 AM – 7:00 AM', wasteType: 'All Types', frequency: 'Tri-weekly',
        notes: 'Early morning collection only. All commercial establishments must comply.',
        createdAt: daysAgo(30)
      }
    ]);

    // ── Announcements ─────────────────────────────────────────────────────────
    setAll(KEYS.ANNOUNCEMENTS, [
      {
        id: uid(), title: 'Special Collection: Hazardous Waste Drive – October 5',
        content: 'The Barangay Waste Management Office will conduct a special Hazardous Waste Collection Drive on October 5, 2026. Residents are encouraged to bring old batteries, expired medicines, broken fluorescent bulbs, and other hazardous materials to the Barangay Hall from 8:00 AM to 12:00 NN. This service is completely free of charge. Help keep our community safe!',
        category: 'Special Collection', author: 'System Administrator', isPublished: true,
        createdAt: daysAgo(1)
      },
      {
        id: uid(), title: 'Reminder: Proper Waste Segregation is Required by Law',
        content: 'We remind all residents that proper waste segregation is mandatory under Republic Act 9003 (Ecological Solid Waste Management Act of 2000). Failure to segregate your waste before collection may result in penalties. Please separate biodegradable, non-biodegradable, and recyclable waste. Your cooperation helps keep our community clean and healthy.',
        category: 'Reminder', author: 'System Administrator', isPublished: true,
        createdAt: daysAgo(4)
      },
      {
        id: uid(), title: 'Holiday Schedule Adjustment – October 2026',
        content: 'Please be informed that garbage collection schedules for October 12, 2026 (National Holiday) will be moved to October 13, 2026. All other collection schedules for the week remain unchanged. For inquiries, please contact the Barangay Waste Management Office during office hours.',
        category: 'Schedule Update', author: 'System Administrator', isPublished: true,
        createdAt: daysAgo(7)
      },
      {
        id: uid(), title: 'New Barangay Eco-Bins Installed in Zone 1',
        content: 'We are pleased to announce that new color-coded eco-bins have been installed at strategic locations throughout Zone 1. Green bins are for biodegradable waste, blue for recyclables, and red for non-biodegradable waste. Please use the correct bin when disposing of your garbage in public areas.',
        category: 'Update', author: 'System Administrator', isPublished: true,
        createdAt: daysAgo(14)
      }
    ]);

    // ── Action Logs ───────────────────────────────────────────────────────────
    setAll(KEYS.ACTIONS, [
      {
        id: uid(), reportId: rpt1, personnelId: p1Id, personnelName: 'Juan Dela Cruz',
        action: 'Inspection scheduled. Will visit the location for assessment.',
        notes: 'Visited on September 25, 2026. Large pile confirmed. Cleanup team will be sent.',
        createdAt: daysAgo(1)
      },
      {
        id: uid(), reportId: rpt2, personnelId: p1Id, personnelName: 'Juan Dela Cruz',
        action: 'Garbage bin emptied and surrounding area cleaned.',
        notes: 'Residents in the area were reminded about proper waste disposal.',
        createdAt: daysAgo(5)
      },
      {
        id: uid(), reportId: rpt5, personnelId: p2Id, personnelName: 'Rosa Reyes',
        action: 'Drainage canal cleared of all solid waste and plastic debris.',
        notes: 'Barangay tanods conducted an information drive for nearby households.',
        createdAt: daysAgo(7)
      },
      {
        id: uid(), reportId: rpt6, personnelId: p2Id, personnelName: 'Rosa Reyes',
        action: 'Cleanup crew dispatched to Block 6.',
        notes: 'Cleanup is 70% complete. Will finish tomorrow morning.',
        createdAt: daysAgo(1)
      }
    ]);

    localStorage.setItem(KEYS.INIT, 'true');
  }

  // ── Public API ────────────────────────────────────────────────────────────────

  return {
    init: seed,
    resetDB() {
      Object.values(KEYS).forEach(k => localStorage.removeItem(k));
      seed();
    },

    // Users
    getUsers:        ()          => getAll(KEYS.USERS),
    getUserById:     (id)        => getById(KEYS.USERS, id),
    getUserByEmail:  (email)     => getAll(KEYS.USERS).find(u => u.email === email.toLowerCase().trim()) || null,
    createUser:      (data)      => insert(KEYS.USERS, { ...data, email: data.email.toLowerCase().trim() }),
    updateUser:      (id, data)  => update(KEYS.USERS, id, data),
    deleteUser:      (id)        => remove(KEYS.USERS, id),

    // Reports
    getReports:           ()     => getAll(KEYS.REPORTS).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)),
    getReportById:        (id)   => getById(KEYS.REPORTS, id),
    getReportsByResident: (rid)  => getAll(KEYS.REPORTS).filter(r => r.residentId === rid).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)),
    createReport:         (data) => insert(KEYS.REPORTS, data),
    updateReport:         (id, data) => update(KEYS.REPORTS, id, data),
    deleteReport:         (id)   => remove(KEYS.REPORTS, id),

    // Schedules
    getSchedules:      ()         => getAll(KEYS.SCHEDULES),
    getScheduleById:   (id)       => getById(KEYS.SCHEDULES, id),
    createSchedule:    (data)     => insert(KEYS.SCHEDULES, data),
    updateSchedule:    (id, data) => update(KEYS.SCHEDULES, id, data),
    deleteSchedule:    (id)       => remove(KEYS.SCHEDULES, id),

    // Announcements
    getAnnouncements:          ()         => getAll(KEYS.ANNOUNCEMENTS).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)),
    getPublishedAnnouncements: ()         => getAll(KEYS.ANNOUNCEMENTS).filter(a => a.isPublished).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)),
    getAnnouncementById:       (id)       => getById(KEYS.ANNOUNCEMENTS, id),
    createAnnouncement:        (data)     => insert(KEYS.ANNOUNCEMENTS, data),
    updateAnnouncement:        (id, data) => update(KEYS.ANNOUNCEMENTS, id, data),
    deleteAnnouncement:        (id)       => remove(KEYS.ANNOUNCEMENTS, id),

    // Categories
    getCategories:      ()         => getAll(KEYS.CATEGORIES),
    getCategoryById:    (id)       => getById(KEYS.CATEGORIES, id),
    createCategory:     (data)     => insert(KEYS.CATEGORIES, data),
    updateCategory:     (id, data) => update(KEYS.CATEGORIES, id, data),
    deleteCategory:     (id)       => remove(KEYS.CATEGORIES, id),

    // Action Logs
    getActions:          ()         => getAll(KEYS.ACTIONS).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)),
    getActionsByReport:  (rid)      => getAll(KEYS.ACTIONS).filter(a => a.reportId === rid).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)),
    createAction:        (data)     => insert(KEYS.ACTIONS, data),

    // Statistics
    getStats() {
      const reports       = getAll(KEYS.REPORTS);
      const users         = getAll(KEYS.USERS);
      const schedules     = getAll(KEYS.SCHEDULES);
      const announcements = getAll(KEYS.ANNOUNCEMENTS);
      return {
        totalReports:       reports.length,
        pendingReports:     reports.filter(r => r.status === 'pending').length,
        inProgressReports:  reports.filter(r => r.status === 'in_progress').length,
        resolvedReports:    reports.filter(r => r.status === 'resolved').length,
        rejectedReports:    reports.filter(r => r.status === 'rejected').length,
        totalUsers:         users.length,
        totalResidents:     users.filter(u => u.role === 'resident').length,
        totalPersonnel:     users.filter(u => u.role === 'personnel').length,
        totalAdmins:        users.filter(u => u.role === 'admin').length,
        totalSchedules:     schedules.length,
        totalAnnouncements: announcements.filter(a => a.isPublished).length,
      };
    },

    // Utilities
    formatDate(iso) {
      if (!iso) return '—';
      return new Date(iso).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    formatDateTime(iso) {
      if (!iso) return '—';
      return new Date(iso).toLocaleString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    timeAgo(iso) {
      if (!iso) return '—';
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1)   return 'just now';
      if (mins < 60)  return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24)   return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    }
  };
})();

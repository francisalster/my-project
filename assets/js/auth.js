/**
 * auth.js - Authentication & Session Management
 * Web-Based Community Waste Management and Monitoring System
 */

const AUTH = (() => {
  const SESSION_KEY = 'wms_session';

  // ── Session helpers ──────────────────────────────────────────────────────────

  function setSession(user) {
    const s = { userId: user.id, role: user.role, name: user.name, email: user.email };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    return s;
  }

  function getSession() {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  // ── Path helpers ─────────────────────────────────────────────────────────────
  // Each HTML page sets  window.ROOT_PATH = './'  (root) or  '../' (subdir)

  function root() {
    return window.ROOT_PATH || './';
  }

  function goTo(relPath) {
    window.location.href = root() + relPath;
  }

  function dashboardPath(role) {
    if (role === 'admin')     return 'admin/dashboard.html';
    if (role === 'personnel') return 'personnel/dashboard.html';
    return 'resident/dashboard.html';
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  return {

    /**
     * Attempt login. Returns { success, message?, session? }
     */
    login(email, password) {
      DB.init();
      const user = DB.getUserByEmail(email);
      if (!user)                    return { success: false, message: 'No account found with this email address.' };
      if (user.password !== password) return { success: false, message: 'Incorrect password. Please try again.' };
      if (user.status !== 'active')   return { success: false, message: 'Your account has been deactivated. Please contact the administrator.' };
      const session = setSession(user);
      return { success: true, session };
    },

    /**
     * Redirect to correct dashboard after login (call from root-level page)
     */
    redirectAfterLogin(role) {
      window.location.href = dashboardPath(role);
    },

    /**
     * Logout and go to login page
     */
    logout() {
      clearSession();
      window.location.href = root() + 'index.html';
    },

    /**
     * Get current session object (or null)
     */
    getSession,

    /**
     * Get full current user object from DB (or null)
     */
    getCurrentUser() {
      const s = getSession();
      return s ? DB.getUserById(s.userId) : null;
    },

    /**
     * Guard pages: call on every protected page.
     * allowedRoles = array like ['admin'] or ['admin','personnel']
     * Returns the session if authorised, otherwise redirects and returns null.
     */
    requireAuth(allowedRoles) {
      DB.init();
      const session = getSession();

      if (!session) {
        window.location.href = root() + 'index.html';
        return null;
      }

      if (allowedRoles && !allowedRoles.includes(session.role)) {
        // Redirect to own dashboard instead of showing error
        window.location.href = root() + dashboardPath(session.role);
        return null;
      }

      return session;
    }
  };
})();

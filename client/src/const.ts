export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Generates the OAuth login URL at runtime.
 * EVOLUTION: Added state-based return paths and config validation.
 */
export const getLoginUrl = (returnTo?: string) => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;

  // Evolution: Safety check to prevent the app from breaking if env vars are missing
  if (!oauthPortalUrl || !appId) {
    console.error("CRITICAL: OAuth configuration is missing. Check your .env file.");
    return "javascript:alert('Auth Configuration Missing')";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  
  /**
   * Evolution: Improved 'state' handling.
   * Instead of just the redirectUri, we pass a JSON object that tells the server
   * where to send the player AFTER login (e.g., back to the Shop or a specific Battle).
   */
  const stateData = {
    redirectUri,
    returnTo: returnTo || window.location.pathname,
    timestamp: Date.now()
  };
  
  const state = btoa(JSON.stringify(stateData));

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

/**
 * Evolution: Added a standardized Logout helper
 * This ensures local game state is cleaned up alongside the session.
 */
export const logout = () => {
  localStorage.removeItem('adventure-quest-storage'); // Matches your store name
  window.location.href = "/api/auth/logout";
};

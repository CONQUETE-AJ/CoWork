import { isElectronDesktop } from './platform';

const DEFAULT_ADMIN_USERNAME = 'admin';

/**
 * Quick admin access gate for settings pages.
 * Desktop runtime is treated as admin by default; WebUI checks username.
 */
export const hasAdminAccess = (username?: string | null): boolean => {
  if (isElectronDesktop()) {
    return true;
  }
  return username === DEFAULT_ADMIN_USERNAME;
};

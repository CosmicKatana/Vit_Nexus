/**
 * Creator Authentication & Admin Authorization
 * Only the creator (Daksh Mehan) has rights to upload or ingest official timetable PDFs.
 */

const ADMIN_STORAGE_KEY = 'vit_creator_admin_unlocked';

export function checkIsCreatorAdmin(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Check local persistent authorization
  if (localStorage.getItem(ADMIN_STORAGE_KEY) === 'true') {
    return true;
  }

  // 2. Check URL search parameters (e.g., ?admin=daksh, ?creator=daksh, ?admin=true)
  try {
    const params = new URLSearchParams(window.location.search);
    const adminVal = params.get('admin')?.toLowerCase();
    const creatorVal = params.get('creator')?.toLowerCase();

    if (
      adminVal === 'true' ||
      adminVal === 'daksh' ||
      adminVal === 'nexivia' ||
      creatorVal === 'daksh' ||
      creatorVal === 'true'
    ) {
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      return true;
    }
  } catch (e) {
    // Ignore URL parse error in restricted contexts
  }

  return false;
}

export function setCreatorAdminState(unlocked: boolean): void {
  if (typeof window === 'undefined') return;
  if (unlocked) {
    localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
  } else {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  }
}

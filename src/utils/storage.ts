import { UserAcademicConfig, BranchCode, DivisionLetter, BatchNumber } from '../types/timetable';
import { BRANCHES, DIVISIONS, BATCHES } from '../data/programsAndBranches';

const STORAGE_KEY = 'vit-nexus-config-v1';
const CACHE_TIMETABLE_PREFIX = 'vit-nexus-tt-cache-';

export function getStoredConfig(): UserAcademicConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserAcademicConfig;

    // Validate that stored keys are valid
    if (
      !parsed ||
      parsed.version !== '1.0' ||
      !parsed.branch ||
      !BRANCHES[parsed.branch as BranchCode] ||
      !DIVISIONS.includes(parsed.division as DivisionLetter) ||
      !BATCHES.includes(parsed.batch as BatchNumber)
    ) {
      console.warn('Invalid or outdated stored academic configuration. Resetting gracefully.');
      return null;
    }

    return parsed;
  } catch (err) {
    console.error('Failed reading user academic config from storage:', err);
    return null;
  }
}

export function saveStoredConfig(config: UserAcademicConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed saving user academic config to storage:', err);
  }
}

export function clearStoredConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed clearing academic config:', err);
  }
}

export interface CachedTimetableEnvelope<T> {
  data: T;
  cachedAt: string;
  divisionSlug: string;
  sourceVersion: string;
}

export function getCachedTimetable<T>(divisionSlug: string): CachedTimetableEnvelope<T> | null {
  try {
    const key = `${CACHE_TIMETABLE_PREFIX}${divisionSlug}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCachedTimetable<T>(divisionSlug: string, data: T, sourceVersion: string): void {
  try {
    const key = `${CACHE_TIMETABLE_PREFIX}${divisionSlug}`;
    const envelope: CachedTimetableEnvelope<T> = {
      data,
      cachedAt: new Date().toISOString(),
      divisionSlug,
      sourceVersion,
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch (e) {
    console.warn('Failed caching timetable locally:', e);
  }
}

export function clearAllCachedTimetables(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(CACHE_TIMETABLE_PREFIX) || key.startsWith('vit-nexus-pdf-'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.warn('Failed clearing cached timetables:', err);
  }
}

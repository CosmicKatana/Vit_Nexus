/**
 * Deterministic visual identities for subjects.
 * Ensured high contrast, legible in dark mode, and consistent across user sessions.
 */

export interface SubjectTheme {
  primary: string;    // HEX or Tailwind color
  border: string;
  bgLight: string;
  textBadge: string;
}

// Curated verified palettes for official VIT subjects
export const KNOWN_SUBJECT_COLORS: Record<string, SubjectTheme> = {
  // Linear Algebra / Mathematics
  ES26101: {
    primary: '#38bdf8', // Light Sky Blue
    border: 'rgba(56, 189, 248, 0.4)',
    bgLight: 'rgba(56, 189, 248, 0.12)',
    textBadge: '#7dd3fc',
  },
  // Calculus
  ES26201: {
    primary: '#60a5fa', // Blue
    border: 'rgba(96, 165, 250, 0.4)',
    bgLight: 'rgba(96, 165, 250, 0.12)',
    textBadge: '#93c5fd',
  },
  // Logic & Aptitude
  ES26103: {
    primary: '#a78bfa', // Purple / Violet
    border: 'rgba(167, 139, 250, 0.4)',
    bgLight: 'rgba(167, 139, 250, 0.12)',
    textBadge: '#c4b5fd',
  },
  // Computer Programming / C++ / Python
  ES26104: {
    primary: '#2dd4bf', // Teal / Cyan
    border: 'rgba(45, 212, 191, 0.4)',
    bgLight: 'rgba(45, 212, 191, 0.12)',
    textBadge: '#5eead4',
  },
  // Basics of Engineering
  ES26105: {
    primary: '#fb923c', // Orange
    border: 'rgba(251, 146, 60, 0.4)',
    bgLight: 'rgba(251, 146, 60, 0.12)',
    textBadge: '#fdba74',
  },
  // Human Values & Professional Ethics
  ES26106: {
    primary: '#facc15', // Amber / Gold
    border: 'rgba(250, 204, 21, 0.4)',
    bgLight: 'rgba(250, 204, 21, 0.12)',
    textBadge: '#fde047',
  },
  // Indian Knowledge Systems
  ES26107: {
    primary: '#4ade80', // Green
    border: 'rgba(74, 222, 128, 0.4)',
    bgLight: 'rgba(74, 222, 128, 0.12)',
    textBadge: '#86efac',
  },
  // Professional English Communication
  ES26108A: {
    primary: '#f472b6', // Pink
    border: 'rgba(244, 114, 182, 0.4)',
    bgLight: 'rgba(244, 114, 182, 0.12)',
    textBadge: '#f9a8d4',
  },
  // Co-curricular Activity / Physical Education
  ES26109: {
    primary: '#94a3b8', // Slate / Muted Silver
    border: 'rgba(148, 163, 184, 0.4)',
    bgLight: 'rgba(148, 163, 184, 0.12)',
    textBadge: '#cbd5e1',
  },
  // Robotics & Automation
  ES26205: {
    primary: '#f87171', // Coral Red
    border: 'rgba(248, 113, 113, 0.4)',
    bgLight: 'rgba(248, 113, 113, 0.12)',
    textBadge: '#fca5a5',
  },
  // Environmental Studies
  ES26206: {
    primary: '#34d399', // Emerald
    border: 'rgba(52, 211, 153, 0.4)',
    bgLight: 'rgba(52, 211, 153, 0.12)',
    textBadge: '#6ee7b7',
  },
  // Design Thinking & Innovation
  ES26207: {
    primary: '#fbbf24', // Warm Amber
    border: 'rgba(251, 191, 36, 0.4)',
    bgLight: 'rgba(251, 191, 36, 0.12)',
    textBadge: '#fde68a',
  },
};

const PALETTE_FALLBACKS: SubjectTheme[] = [
  { primary: '#38bdf8', border: 'rgba(56, 189, 248, 0.4)', bgLight: 'rgba(56, 189, 248, 0.12)', textBadge: '#7dd3fc' },
  { primary: '#a78bfa', border: 'rgba(167, 139, 250, 0.4)', bgLight: 'rgba(167, 139, 250, 0.12)', textBadge: '#c4b5fd' },
  { primary: '#2dd4bf', border: 'rgba(45, 212, 191, 0.4)', bgLight: 'rgba(45, 212, 191, 0.12)', textBadge: '#5eead4' },
  { primary: '#fb923c', border: 'rgba(251, 146, 60, 0.4)', bgLight: 'rgba(251, 146, 60, 0.12)', textBadge: '#fdba74' },
  { primary: '#4ade80', border: 'rgba(74, 222, 128, 0.4)', bgLight: 'rgba(74, 222, 128, 0.12)', textBadge: '#86efac' },
  { primary: '#f472b6', border: 'rgba(244, 114, 182, 0.4)', bgLight: 'rgba(244, 114, 182, 0.12)', textBadge: '#f9a8d4' },
  { primary: '#e879f9', border: 'rgba(232, 121, 249, 0.4)', bgLight: 'rgba(232, 121, 249, 0.12)', textBadge: '#f0abfc' },
  { primary: '#818cf8', border: 'rgba(129, 140, 248, 0.4)', bgLight: 'rgba(129, 140, 248, 0.12)', textBadge: '#a5b4fc' },
  { primary: '#fb7185', border: 'rgba(251, 113, 133, 0.4)', bgLight: 'rgba(251, 113, 133, 0.12)', textBadge: '#fda4af' },
];

/**
 * Returns deterministic theme for a subject code
 */
export function getSubjectTheme(subjectCode: string): SubjectTheme {
  const normalized = subjectCode.trim().toUpperCase();
  if (KNOWN_SUBJECT_COLORS[normalized]) {
    return KNOWN_SUBJECT_COLORS[normalized];
  }

  // Deterministic FNV-1a hash
  let hash = 2166136261;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  const index = hash % PALETTE_FALLBACKS.length;
  return PALETTE_FALLBACKS[index];
}

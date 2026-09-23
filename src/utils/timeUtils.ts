export const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function toMinutes(timeStr: string | number): number {
  if (typeof timeStr === 'number') return timeStr;
  const parts = String(timeStr).split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1] || '0', 10);
}

export function padZero(num: number): string {
  return num < 10 ? `0${num}` : String(num);
}

export function toTimeString(minutes: number, format: '12' | '24' = '12'): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (format === '24') {
    return `${padZero(h)}:${padZero(m)}`;
  }
  const displayH = ((h + 11) % 12) + 1;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${displayH}:${padZero(m)} ${ampm}`;
}

export function formatTimeRange(startMin: number, endMin: number, format: '12' | '24' = '12'): string {
  if (format === '24') {
    return `${toTimeString(startMin, '24')} – ${toTimeString(endMin, '24')}`;
  }
  const sStr = toTimeString(startMin, '12');
  const eStr = toTimeString(endMin, '12');
  // If both are in same AM/PM half, we can keep it clean or show full
  return `${sStr} – ${eStr}`;
}

export function getDurationString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

/**
 * Returns formatted live countdown string HH:MM:SS (e.g. "00:27:14")
 */
export function formatCountdown(diffMs: number): string {
  if (diffMs <= 0) return '00:00:00';
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

export function getTodayDateString(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = padZero(date.getMonth() + 1);
  const dd = padZero(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

export function parseISODate(dateStr: string): Date {
  const parts = String(dateStr).split('-');
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function formatDateLong(d: Date | string): string {
  const date = typeof d === 'string' ? parseISODate(d) : d;
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateShort(d: Date | string): string {
  const date = typeof d === 'string' ? parseISODate(d) : d;
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()].slice(0, 3)}`;
}

export function formatDayWithDate(d: Date): string {
  return `${WEEKDAY_NAMES[d.getDay()]}, ${formatDateShort(d)}`;
}

// Small helpers for local date/time handling used by the frontend.
// The frontend will operate on local YYYY-MM-DD and HH:mm strings and
// only build a JS Date at submit time.

export function isoToLocalDateAndTime(iso?: string) {
  if (!iso) return { date: undefined as string | undefined, time: undefined as string | undefined };
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { date: undefined as string | undefined, time: undefined as string | undefined };
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; // local date
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`; // local time HH:mm
  return { date, time };
}

export function buildLocalDate(dateStr: string, timeStr: string | undefined, allDay: boolean) {
  const [y, m, d] = (dateStr || '').split('-').map((s) => Number(s));
  const monthIndex = (m || 1) - 1;
  if (allDay) return new Date(y, monthIndex, d || 1, 0, 0, 0, 0);
  const [hh = 0, mm = 0] = (timeStr || '00:00').split(':').map((s) => Number(s));
  return new Date(y, monthIndex, d || 1, hh, mm, 0, 0);
}

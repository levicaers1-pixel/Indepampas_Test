/** Blog posts store their date as dd/mm/yyyy; structured data and <time> want YYYY-MM-DD. */
export function postIsoDate(date: string): string | undefined {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return /^\d{4}-\d{2}-\d{2}/.test(date) ? date.slice(0, 10) : undefined;
}

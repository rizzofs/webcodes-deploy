import { calendarEvents } from '../src/data/calendarEvents.js';

const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires';
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;

function getTodayIso(timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

function toPublicEvent(event) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    type: event.type,
    color: event.color
  };
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const rawLimit = req.query?.limit;
  const parsedLimit = Number.parseInt(rawLimit, 10);
  const limit = Number.isNaN(parsedLimit) ? DEFAULT_LIMIT : Math.min(Math.max(parsedLimit, 1), MAX_LIMIT);

  const todayIso = getTodayIso(ARGENTINA_TIMEZONE);

  const upcomingEvents = calendarEvents
    .filter((event) => event.date >= todayIso)
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, limit)
    .map(toPublicEvent);

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

  return res.status(200).json({
    success: true,
    timezone: ARGENTINA_TIMEZONE,
    today: todayIso,
    count: upcomingEvents.length,
    limit,
    events: upcomingEvents
  });
}

import db from './db.js';

const LIMITS = {
  'pro-men':   parseInt(process.env.SLOTS_PRO_MEN   || '20'),
  'pro-women': parseInt(process.env.SLOTS_PRO_WOMEN || '20'),
  'amateur':   parseInt(process.env.SLOTS_AMATEUR   || '30'),
  'junior':    parseInt(process.env.SLOTS_JUNIOR    || '15'),
};

// Simple in-memory cache
const cache = { data: null, expiresAt: 0 };

/**
 * Invalidate the slots cache (call after any INSERT/UPDATE).
 */
export function invalidateCache() {
  cache.data = null;
  cache.expiresAt = 0;
}

/**
 * Get current slot counts for all categories.
 * Uses cached data if still valid (TTL 60s).
 * @returns {{ slots: Record<string, {limit: number, registered: number, available: number, waitlist: boolean}>, cached: boolean }}
 */
export function getSlots() {
  const now = Date.now();

  if (cache.data && now < cache.expiresAt) {
    return { slots: cache.data, cached: true };
  }

  // Count active registrations per category (pending + confirmed)
  const rows = db
    .prepare(`
      SELECT category, COUNT(*) AS count
      FROM registrations
      WHERE status IN ('pending', 'confirmed')
      GROUP BY category
    `)
    .all();

  const counts = {};
  for (const row of rows) {
    counts[row.category] = row.count;
  }

  const slots = {};
  for (const [cat, limit] of Object.entries(LIMITS)) {
    const registered = counts[cat] ?? 0;
    const available = Math.max(0, limit - registered);
    slots[cat] = {
      limit,
      registered,
      available,
      waitlist: available === 0,
    };
  }

  cache.data = slots;
  cache.expiresAt = now + 60_000; // 60 seconds TTL

  return { slots, cached: false };
}

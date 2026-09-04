import { randomUUID } from 'crypto';
import db from '../db.js';
import { getSlots, invalidateCache } from '../slots.js';
import { sendTelegramNotification } from '../telegram.js';
import { sendConfirmationEmail } from '../email.js';

const VALID_CATEGORIES = ['pro-men', 'pro-women', 'amateur', 'junior'];
const VALID_LANGS = ['en', 'ru', 'vi'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate incoming registration payload.
 * Returns { valid: true } or { valid: false, message: string, code: string }.
 */
function validate(body) {
  const { firstName, lastName, email, phone, country, category, experience, kiteSize, lang, _formOpenedAt, website } = body;

  // Honeypot — must be empty
  if (website !== undefined && website !== '') {
    return { honeypot: true };
  }

  // Time-based anti-spam
  if (!_formOpenedAt || Date.now() - Number(_formOpenedAt) < 3000) {
    return { valid: false, code: 'too_fast', status: 429 };
  }

  // Required fields
  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0 || firstName.length > 100) {
    return { valid: false, code: 'invalid_field', field: 'firstName', status: 400 };
  }
  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0 || lastName.length > 100) {
    return { valid: false, code: 'invalid_field', field: 'lastName', status: 400 };
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 255) {
    return { valid: false, code: 'invalid_field', field: 'email', status: 400 };
  }
  if (!category || !VALID_CATEGORIES.includes(category)) {
    return { valid: false, code: 'invalid_field', field: 'category', status: 400 };
  }

  // Optional fields
  if (phone !== undefined && phone !== null && phone !== '' && (typeof phone !== 'string' || phone.length > 30)) {
    return { valid: false, code: 'invalid_field', field: 'phone', status: 400 };
  }
  if (country !== undefined && country !== null && country !== '' && (typeof country !== 'string' || country.length > 100)) {
    return { valid: false, code: 'invalid_field', field: 'country', status: 400 };
  }
  if (experience !== undefined && experience !== null && experience !== '') {
    const exp = Number(experience);
    if (!Number.isInteger(exp) || exp < 0 || exp > 50) {
      return { valid: false, code: 'invalid_field', field: 'experience', status: 400 };
    }
  }
  if (kiteSize !== undefined && kiteSize !== null && kiteSize !== '') {
    const ks = Number(kiteSize);
    if (isNaN(ks) || ks < 3 || ks > 25) {
      return { valid: false, code: 'invalid_field', field: 'kiteSize', status: 400 };
    }
  }

  return { valid: true };
}

/**
 * Fastify plugin — POST /api/register
 */
export async function registerRoute(fastify) {
  fastify.post('/api/register', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '15 minutes',
      },
    },
  }, async (request, reply) => {
    const body = request.body;

    if (!body || typeof body !== 'object') {
      return reply.status(400).send({ error: 'invalid_body' });
    }

    const check = validate(body);

    // Honeypot triggered — pretend success
    if (check.honeypot) {
      return reply.status(201).send({ status: 'pending' });
    }

    // Time check
    if (check.valid === false && check.code === 'too_fast') {
      return reply.status(429).send({ error: 'too_fast' });
    }

    // Other validation errors
    if (!check.valid) {
      return reply.status(check.status || 400).send({ error: check.code, field: check.field });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      category,
      experience,
      kiteSize,
      lang,
    } = body;

    const normalizedLang = VALID_LANGS.includes(lang) ? lang : 'en';

    try {
      // Determine slot availability
      const { slots } = getSlots();
      const slot = slots[category];
      const status = slot && slot.available > 0 ? 'pending' : 'waitlist';

      // Check for duplicate email
      const existing = db
        .prepare('SELECT id FROM registrations WHERE email = ?')
        .get(email.toLowerCase().trim());

      if (existing) {
        return reply.status(409).send({ error: 'email_exists' });
      }

      const token = randomUUID();
      const ip = request.ip || null;

      // Insert registration
      db.prepare(`
        INSERT INTO registrations
          (first_name, last_name, email, phone, country, category, experience, kite_size, lang, status, confirmation_token, ip)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        firstName.trim(),
        lastName.trim(),
        email.toLowerCase().trim(),
        phone || null,
        country || null,
        category,
        experience != null && experience !== '' ? Number(experience) : null,
        kiteSize != null && kiteSize !== '' ? Number(kiteSize) : null,
        normalizedLang,
        status,
        token,
        ip,
      );

      // Invalidate slots cache
      invalidateCache();

      // Fire-and-forget notifications
      sendTelegramNotification({ firstName, lastName, category, country, email });
      sendConfirmationEmail({ to: email, lang: normalizedLang, firstName, token, status });

      return reply.status(201).send({ status });

    } catch (err) {
      // Unique constraint on email (race condition safety net)
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || (err.message && err.message.includes('UNIQUE'))) {
        return reply.status(409).send({ error: 'email_exists' });
      }
      console.error('[register] Unexpected error:', err);
      return reply.status(500).send({ error: 'server_error' });
    }
  });
}

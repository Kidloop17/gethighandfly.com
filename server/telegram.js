const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

/**
 * Send a Telegram notification for a new registration.
 * If TOKEN or CHAT_ID are not configured, logs a warning and does nothing.
 * This function is fire-and-forget — errors are caught and logged.
 *
 * @param {{ firstName: string, lastName: string, category: string, country?: string, email: string }} registration
 */
export async function sendTelegramNotification(registration) {
  if (!TOKEN || !CHAT_ID) {
    console.warn('[telegram] Notifications disabled — TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
    return;
  }

  const { firstName, lastName, category, country, email } = registration;

  const text = [
    '🪁 New GHAF Registration',
    `Name: ${firstName} ${lastName}`,
    `Category: ${category}`,
    `Country: ${country || '—'}`,
    `Email: ${email}`,
  ].join('\n');

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      console.error('[telegram] Failed to send notification:', response.status, body);
    }
  } catch (err) {
    console.error('[telegram] Error sending notification:', err.message);
  }
}

import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'GHAF <noreply@gethighandfly.com>';

let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
} else {
  console.info('[email] Email disabled — SMTP_HOST, SMTP_USER or SMTP_PASS not set');
}

// ── Templates ──────────────────────────────────────────────────────────────

const templates = {
  en: {
    subject: 'GHAF 2027 — Registration received',
    greeting: (name) => `Hi ${name},`,
    body: 'We received your registration for <strong>Get High And Fly 2027</strong>.',
    status: 'Your status: <strong>Pending review</strong>',
    details: "We'll contact you with further details closer to the event.",
    waitlist: "You are on the waiting list. We'll notify you if a spot becomes available.",
    sign: '— GHAF Team',
    plain: (name, isWaitlist) => [
      `Hi ${name},`,
      '',
      'We received your registration for Get High And Fly 2027.',
      'Your status: Pending review',
      isWaitlist
        ? "You are on the waiting list. We'll notify you if a spot becomes available."
        : "We'll contact you with further details closer to the event.",
      '',
      '— GHAF Team',
    ].join('\n'),
  },
  ru: {
    subject: 'GHAF 2027 — Заявка получена',
    greeting: (name) => `Привет, ${name}!`,
    body: 'Мы получили вашу заявку на участие в <strong>Get High And Fly 2027</strong>.',
    status: 'Статус заявки: <strong>Ожидает рассмотрения</strong>',
    details: 'Мы свяжемся с вами с дополнительной информацией ближе к мероприятию.',
    waitlist: 'Вы добавлены в лист ожидания. Мы уведомим вас, если освободится место.',
    sign: '— Команда GHAF',
    plain: (name, isWaitlist) => [
      `Привет, ${name}!`,
      '',
      'Мы получили вашу заявку на участие в Get High And Fly 2027.',
      'Статус заявки: Ожидает рассмотрения',
      isWaitlist
        ? 'Вы добавлены в лист ожидания. Мы уведомим вас, если освободится место.'
        : 'Мы свяжемся с вами с дополнительной информацией ближе к мероприятию.',
      '',
      '— Команда GHAF',
    ].join('\n'),
  },
  vi: {
    subject: 'GHAF 2027 — Đã nhận đơn đăng ký',
    greeting: (name) => `Xin chào ${name},`,
    body: 'Chúng tôi đã nhận được đơn đăng ký của bạn cho <strong>Get High And Fly 2027</strong>.',
    status: 'Trạng thái của bạn: <strong>Đang chờ xem xét</strong>',
    details: 'Chúng tôi sẽ liên hệ với bạn với thông tin chi tiết hơn khi gần đến sự kiện.',
    waitlist: 'Bạn đã được thêm vào danh sách chờ. Chúng tôi sẽ thông báo cho bạn nếu có chỗ trống.',
    sign: '— Đội GHAF',
    plain: (name, isWaitlist) => [
      `Xin chào ${name},`,
      '',
      'Chúng tôi đã nhận được đơn đăng ký của bạn cho Get High And Fly 2027.',
      'Trạng thái của bạn: Đang chờ xem xét',
      isWaitlist
        ? 'Bạn đã được thêm vào danh sách chờ. Chúng tôi sẽ thông báo cho bạn nếu có chỗ trống.'
        : 'Chúng tôi sẽ liên hệ với bạn với thông tin chi tiết hơn khi gần đến sự kiện.',
      '',
      '— Đội GHAF',
    ].join('\n'),
  },
};

/**
 * Build HTML email body.
 */
function buildHtml(tmpl, firstName, isWaitlist) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1c2b3a">
  <p style="font-size:16px">${tmpl.greeting(firstName)}</p>
  <p style="font-size:16px">${tmpl.body}</p>
  <p style="font-size:16px">${tmpl.status}</p>
  ${isWaitlist
    ? `<p style="font-size:16px;background:#fff3cd;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:4px">${tmpl.waitlist}</p>`
    : `<p style="font-size:16px">${tmpl.details}</p>`}
  <p style="font-size:16px;margin-top:24px">${tmpl.sign}</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
  <p style="font-size:12px;color:#9ca3af">Get High And Fly — gethighandfly.com</p>
</body>
</html>`;
}

/**
 * Send a confirmation email to a newly registered participant.
 * Fire-and-forget — errors are caught and logged.
 *
 * @param {{ to: string, lang: string, firstName: string, token: string, status: string }} opts
 */
export async function sendConfirmationEmail({ to, lang, firstName, token, status }) {
  if (!transporter) {
    console.info('[email] Skipping confirmation email — SMTP not configured');
    return;
  }

  const tmpl = templates[lang] || templates.en;
  const isWaitlist = status === 'waitlist';

  try {
    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject: tmpl.subject,
      text: tmpl.plain(firstName, isWaitlist),
      html: buildHtml(tmpl, firstName, isWaitlist),
    });
    console.info('[email] Confirmation sent to', to);
  } catch (err) {
    console.error('[email] Failed to send confirmation to', to, ':', err.message);
  }
}

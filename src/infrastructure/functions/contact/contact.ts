import type { Request, Response } from 'express';

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  telegram?: string;
  subject: string;
  message: string;
};

const isNonEmpty = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const normalize = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export const handleContactRequest = async (req: Request, res: Response): Promise<void> => {
  const token = process.env['TELEGRAM_BOT_TOKEN'];
  const chatId = process.env['TELEGRAM_CHAT_ID'];

  if (!token || !chatId) {
    res.status(500).json({ error: 'Server is not configured' });
    return;
  }

  const payload = (req.body || {}) as Partial<ContactPayload>;
  const errors: string[] = [];

  if (!isNonEmpty(payload.name)) errors.push('name');
  if (!isNonEmpty(payload.email)) errors.push('email');
  if (!isNonEmpty(payload.phone)) errors.push('phone');
  if (!isNonEmpty(payload.subject)) errors.push('subject');
  if (!isNonEmpty(payload.message)) errors.push('message');

  if (errors.length > 0) {
    res.status(400).json({ error: 'Validation failed', fields: errors });
    return;
  }

  const text = [
    '📥 New Contact Request',
    '',
    `👤 Name: ${normalize(payload.name)}`,
    `📧 Email: ${normalize(payload.email)}`,
    `📱 Phone: ${normalize(payload.phone)}`,
    `✈️ Telegram: ${normalize(payload.telegram) || '-'}`,
    `📝 Subject: ${normalize(payload.subject)}`,
    '',
    '💬 Message:',
    normalize(payload.message)
  ].join('\n');

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      res.status(502).json({ error: 'Telegram request failed', details: errorBody });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(502).json({ error: 'Telegram request failed' });
  }
};

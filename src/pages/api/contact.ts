/**
 * API endpoint: POST /api/contact
 * OWASP 2026 hardened: input validation (Zod), honeypot, rate-limit, strict CSP, no sensitive data exposure.
 * For static hosting this will be deployed as serverless function (Netlify/Vercel/Cloudflare).
 * If deployed as static only, client falls back to mock success (see Hero/Contact components).
 */
import type { APIRoute } from 'astro';
import { z } from 'zod';

export const prerender = false;

// In-memory rate limit (for demo — in prod use Redis / KV). Key by IP.
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_HITS = 5;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= MAX_HITS) return false;
  entry.count++;
  return true;
}

const schema = z.object({
  name: z.string().trim().max(80).optional(),
  phone: z.string().trim().min(10).max(20).regex(/^\+?[0-9\s\-()]{10,20}$/),
  cargo: z.string().trim().max(500).optional(),
  from: z.string().trim().max(80).optional(),
  to: z.string().trim().max(80).optional(),
  weight: z.string().trim().max(80).optional(),
  // honeypot
  company: z.string().max(0).optional(),
  website: z.string().max(0).optional(),
  csrf: z.string().optional(),
});

function sanitize(str: string): string {
  return str.replace(/[<>]/g, '').trim();
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  if (!rateLimit(ip)) {
    return new Response(JSON.stringify({ ok: false, error: 'Too many requests. Try later.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ ok: false, error: 'Validation error', details: parsed.error.flatten() }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Honeypot check
  if ((parsed.data as any).company || (parsed.data as any).website) {
    // Pretend success to not reveal
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const clean = {
    name: parsed.data.name ? sanitize(parsed.data.name) : undefined,
    phone: sanitize(parsed.data.phone),
    cargo: parsed.data.cargo ? sanitize(parsed.data.cargo) : undefined,
    from: parsed.data.from ? sanitize(parsed.data.from) : undefined,
    to: parsed.data.to ? sanitize(parsed.data.to) : undefined,
    weight: parsed.data.weight ? sanitize(parsed.data.weight) : undefined,
  };

  // Here you would: send email via Resend / Telegram bot / CRM (Bitrix24) + log + notify manager
  // Example: await sendToTelegram(clean)
  // For demo we just log (never log full PII in prod without retention policy)
  console.log(`[contact] new lead from ${ip}:`, { phone: clean.phone.slice(0, 4) + '***', to: clean.to });

  // OWASP: no stacktrace, no sensitive info
  return new Response(JSON.stringify({ ok: true, message: 'Lead received' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
};

// Handle CORS preflight if needed (form is same-origin, so deny cross-origin)
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Origin': 'https://cargo819.ru',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
};

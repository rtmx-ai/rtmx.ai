import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import worker from './index.ts';

const WAITLIST_FORM_ID = '2e0b417f-2e5c-4cc8-8441-b1982aac6638';
const SALES_FORM_ID = '7f0d3d5f-7dbb-4d17-88a4-3913256730b7';

const env = {
  HUBSPOT_PORTAL_ID: 'test-portal',
  HUBSPOT_FORM_GUID_WAITLIST: WAITLIST_FORM_ID,
  HUBSPOT_FORM_GUID_NEWSLETTER: 'c615fe10-5da1-4b75-aacd-cea7b476d3d3',
  HUBSPOT_FORM_GUID_SALES: SALES_FORM_ID,
  RECAPTCHA_SECRET_KEY: 'test-secret',
  RECAPTCHA_SCORE_THRESHOLD: '0.5',
  ALLOWED_ORIGIN: 'https://rtmx.ai',
};

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

async function workerFetch(path: string, init?: RequestInit): Promise<Response> {
  return worker.fetch(new Request(`https://rtmx-forms.test${path}`, init), env);
}

function stubOutboundFetch(impl: (url: string) => Promise<Response>): void {
  globalThis.fetch = (async (input: RequestInfo | URL) => impl(String(input))) as typeof fetch;
}

test('GET /api/health returns ok', async () => {
  const res = await workerFetch('/api/health');
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok' });
});

test('POST /api/form-submit rejects missing fields', async () => {
  const res = await workerFetch('/api/form-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com' }),
  });
  assert.equal(res.status, 400);
  const body = (await res.json()) as { error: string };
  assert.ok(body.error);
});

test('POST /api/form-submit rejects invalid email', async () => {
  const res = await workerFetch('/api/form-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formId: WAITLIST_FORM_ID,
      email: 'not-an-email',
      recaptchaToken: 'fake',
    }),
  });
  assert.equal(res.status, 400);
  const body = (await res.json()) as { error: string };
  assert.match(body.error, /email/i);
});

test('POST /api/form-submit rejects unknown formId', async () => {
  const res = await workerFetch('/api/form-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formId: 'not-a-real-form-id',
      email: 'test@example.com',
      recaptchaToken: 'fake',
    }),
  });
  assert.equal(res.status, 400);
  const body = (await res.json()) as { error: string };
  assert.match(body.error, /form/i);
});

test('POST /api/form-submit rejects a failed reCAPTCHA', async () => {
  stubOutboundFetch(async (url) => {
    assert.match(url, /recaptcha/);
    return new Response(JSON.stringify({ success: false, score: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });

  const res = await workerFetch('/api/form-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formId: WAITLIST_FORM_ID,
      email: 'test@example.com',
      recaptchaToken: 'fake-token',
    }),
  });
  assert.equal(res.status, 403);
  const body = (await res.json()) as { error: string };
  assert.match(body.error, /erification/);
});

test('POST /api/form-submit forwards a verified signup to HubSpot', async () => {
  const seen: string[] = [];
  stubOutboundFetch(async (url) => {
    seen.push(url);
    if (url.includes('recaptcha')) {
      return new Response(JSON.stringify({ success: true, score: 0.9 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url.includes('hsforms.com')) {
      return new Response('{}', { status: 200 });
    }
    throw new Error(`unexpected outbound fetch: ${url}`);
  });

  const res = await workerFetch('/api/form-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formId: WAITLIST_FORM_ID,
      email: 'test@example.com',
      recaptchaToken: 'ok-token',
    }),
  });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { success: true });
  assert.ok(seen.some((url) => url.includes('recaptcha')));
  assert.ok(seen.some((url) => url.includes('hsforms.com')));
});

test('POST /api/form-submit forwards sales fields to HubSpot', async () => {
  let hubspotBody = '';
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.includes('recaptcha')) {
      return new Response(JSON.stringify({ success: true, score: 0.9 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (url.includes('hsforms.com')) {
      hubspotBody = String(init?.body ?? '');
      return new Response('{}', { status: 200 });
    }
    throw new Error(`unexpected outbound fetch: ${url}`);
  }) as typeof fetch;

  const res = await workerFetch('/api/form-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formId: SALES_FORM_ID,
      email: 'buyer@acme.com',
      name: 'Alex Buyer',
      company: 'Acme',
      intent: 'on-prem',
      message: 'Need air-gap deploy',
      recaptchaToken: 'ok-token',
    }),
  });
  assert.equal(res.status, 200);
  assert.match(hubspotBody, /firstname/);
  assert.match(hubspotBody, /Alex Buyer/);
  assert.match(hubspotBody, /Acme/);
  assert.match(hubspotBody, /Intent: on-prem/);
  assert.match(hubspotBody, /Need air-gap deploy/);
});

test('POST /api/form-submit rejects invalid intent', async () => {
  const res = await workerFetch('/api/form-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formId: SALES_FORM_ID,
      email: 'buyer@acme.com',
      intent: 'not-a-tier',
      recaptchaToken: 'fake',
    }),
  });
  assert.equal(res.status, 400);
  const body = (await res.json()) as { error: string };
  assert.match(body.error, /intent/i);
});

test('CORS preflight returns the configured origin', async () => {
  const res = await workerFetch('/api/form-submit', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://rtmx.ai',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  });
  assert.equal(res.status, 204);
  assert.equal(res.headers.get('access-control-allow-origin'), 'https://rtmx.ai');
  assert.match(res.headers.get('access-control-allow-methods') ?? '', /POST/);
});

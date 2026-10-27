import assert from 'node:assert/strict';
import { test } from 'node:test';

import worker, {
	ALLOWED_HOSTS,
	apexRecoveryURL,
	isAllowedHost,
	shouldRedirectUnknownHost,
} from './index.ts';

test('allowlist includes apex sync www forms', () => {
	for (const h of ['rtmx.ai', 'www.rtmx.ai', 'sync.rtmx.ai', 'forms.rtmx.ai']) {
		assert.equal(isAllowedHost(h), true, h);
		assert.equal(shouldRedirectUnknownHost(h), false, h);
	}
	assert.ok(ALLOWED_HOSTS.size >= 4);
});

test('unknown labels under rtmx.ai should redirect', () => {
	assert.equal(shouldRedirectUnknownHost('x.rtmx.ai'), true);
	assert.equal(shouldRedirectUnknownHost('synck.rtmx.ai'), true);
	assert.equal(shouldRedirectUnknownHost('X.RTMX.AI'), true);
});

test('apexRecoveryURL sets from_host', () => {
	const u = new URL(apexRecoveryURL('x.rtmx.ai'));
	assert.equal(u.origin, 'https://rtmx.ai');
	assert.equal(u.searchParams.get('from_host'), 'x.rtmx.ai');
});

test('worker 302 redirects unknown host', async () => {
	const res = await worker.fetch(
		new Request('https://x.rtmx.ai/anything', { headers: { Host: 'x.rtmx.ai' } }),
	);
	assert.equal(res.status, 302);
	assert.equal(res.headers.get('Location'), 'https://rtmx.ai/?from_host=x.rtmx.ai');
});

test('worker passes allowlisted hosts through to origin', async () => {
	const origin = new Response('origin-ok', { status: 200 });
	const prev = globalThis.fetch;
	globalThis.fetch = async () => origin;
	try {
		const res = await worker.fetch(
			new Request('https://www.rtmx.ai/', { headers: { Host: 'www.rtmx.ai' } }),
		);
		assert.equal(res.status, 200);
		assert.equal(await res.text(), 'origin-ok');
	} finally {
		globalThis.fetch = prev;
	}
});

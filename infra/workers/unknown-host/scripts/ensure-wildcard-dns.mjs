#!/usr/bin/env node
/**
 * REQ-SITE-153: Create proxied AAAA * → 100:: on zone rtmx.ai.
 *
 * Wrangler OAuth cannot edit DNS. Use a token with Zone.DNS Edit:
 *   https://dash.cloudflare.com/profile/api-tokens
 *   Create Token → "Edit zone DNS" → include rtmx.ai
 *
 *   export CLOUDFLARE_API_TOKEN=…
 *   node scripts/ensure-wildcard-dns.mjs
 */

const ZONE_NAME = 'rtmx.ai';
const TOKEN = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN;

if (!TOKEN) {
	console.error('Set CLOUDFLARE_API_TOKEN (Zone.DNS Edit on rtmx.ai).');
	process.exit(1);
}

async function cf(method, path, body) {
	const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	const data = await res.json();
	if (!data.success) {
		const err = JSON.stringify(data.errors || data, null, 2);
		throw new Error(`${method} ${path} → ${res.status}\n${err}`);
	}
	return data.result;
}

const zones = await cf('GET', `/zones?name=${ZONE_NAME}`);
const zone = zones[0];
if (!zone) throw new Error(`zone ${ZONE_NAME} not found`);

const existing = await cf(
	'GET',
	`/zones/${zone.id}/dns_records?name=*.${ZONE_NAME}&type=AAAA&per_page=50`,
);
const match = existing.find((r) => r.name === `*.${ZONE_NAME}` && r.content === '100::');
if (match) {
	console.log(`OK already present id=${match.id} proxied=${match.proxied}`);
	if (!match.proxied) {
		await cf('PATCH', `/zones/${zone.id}/dns_records/${match.id}`, { proxied: true });
		console.log('Patched proxied=true');
	}
} else {
	const created = await cf('POST', `/zones/${zone.id}/dns_records`, {
		type: 'AAAA',
		name: '*',
		content: '100::',
		ttl: 1,
		proxied: true,
		comment: 'REQ-SITE-153 unknown-host catch-all → rtmx-unknown-host',
	});
	console.log(`Created id=${created.id}`);
}

console.log('Probe: dig +short randomtypo123.rtmx.ai @1.1.1.1');
console.log('       curl -sI https://randomtypo123.rtmx.ai/ | grep -i location');

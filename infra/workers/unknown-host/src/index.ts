/**
 * REQ-SITE-153 / REQ-MONO-043c: Redirect unknown *.rtmx.ai hosts to apex.
 *
 * Allowlisted product hosts are left alone (pass-through / no redirect).
 * Unknown labels 302 to https://rtmx.ai/?from_host=<hostname>.
 */

/** Hostnames that must never be treated as typos (apex + product front doors). */
export const ALLOWED_HOSTS = new Set([
	'rtmx.ai',
	'www.rtmx.ai',
	'sync.rtmx.ai',
	'forms.rtmx.ai',
]);

export function normalizeHost(host: string): string {
	return host.trim().toLowerCase().replace(/\.$/, '').split(':')[0] ?? '';
}

export function isAllowedHost(host: string): boolean {
	return ALLOWED_HOSTS.has(normalizeHost(host));
}

export function apexRecoveryURL(fromHost: string, apex = 'https://rtmx.ai'): string {
	const url = new URL(apex.endsWith('/') ? apex : `${apex}/`);
	url.searchParams.set('from_host', normalizeHost(fromHost));
	return url.toString();
}

export function shouldRedirectUnknownHost(host: string): boolean {
	const h = normalizeHost(host);
	if (!h || isAllowedHost(h)) return false;
	return h.endsWith('.rtmx.ai');
}

export default {
	async fetch(request: Request): Promise<Response> {
		const host = request.headers.get('Host') ?? new URL(request.url).host;
		if (shouldRedirectUnknownHost(host)) {
			return Response.redirect(apexRecoveryURL(host), 302);
		}
		// Allowlisted hosts (www, forms, …) can match the *.rtmx.ai/* route.
		// Pass through to the zone origin (e.g. GitHub Pages) instead of 404.
		if (isAllowedHost(host)) {
			return fetch(request);
		}
		return new Response('Not found', { status: 404 });
	},
};

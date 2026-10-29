// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';

// Docs live under /docs/* (REQ-MONO-042). Product pages stay at site root
// (/account, /checkout, …). Do NOT set Astro `base: '/docs'` — that would
// prefix product routes too. Content is nested at src/content/docs/docs/.
const docsRedirects = Object.fromEntries(
	[
		'adapters',
		'adapters/mcp',
		'adapters/project-management',
		'aegis',
		'aegis/evaluate',
		'aegis/getting-started',
		'aegis/operator',
		'aegis/reference',
		'aegis/security',
		'aegis/using',
		'blog',
		'blog/back-to-basics',
		'blog/show-hn-rtmx',
		'guides/cli-reference',
		'guides/compare',
		'guides/configuration',
		'guides/dependencies',
		'guides/for-defense',
		'guides/for-developers',
		'guides/for-enterprise',
		'guides/markers',
		'guides/patterns',
		'guides/schema',
		'guides/scim-idp',
		'guides/audit-admin',
		'installation',
		'quickstart',
		'reference/architecture',
		'reference/lifecycle',
	].map((slug) => [`/${slug}`, `/docs/${slug}`]),
);

// https://astro.build/config
export default defineConfig({
	site: 'https://rtmx.ai',
	base: '/',
	redirects: {
		...docsRedirects,
		// REQ-MONO-039: collapse standalone GH/Jira docs into the PM hub
		'/docs/adapters/github': '/docs/adapters/project-management',
		'/docs/adapters/jira': '/docs/adapters/project-management',
		'/adapters/github': '/docs/adapters/project-management',
		'/adapters/jira': '/docs/adapters/project-management',
	},
	integrations: [
		starlight({
			plugins: [starlightClientMermaid()],
			title: 'RTMX',
			components: {
				// REQ-SITE-024: Use proper Astro component for header navigation
				Header: './src/components/Header.astro',
				// SITE-117 IA: demoted product links (About, Roadmap, aegis, …)
				Footer: './src/components/StarlightFooter.astro',
				// Dark-only: prevent prefers-color-scheme:light pastel asides
				ThemeProvider: './src/components/ThemeProvider.astro',
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
			description: 'RTMX Sync — the live room for humans and agents. Multiplayer requirements, claims, and traceability. Open-source CLI is how you enter.',
			// REQ-MONO-041 / SITE-149: copy control on fenced code (frames enable copy).
			expressiveCode: {
				themes: ['github-dark'],
				styleOverrides: {
					codeBackground: '#161b22',
					codeBorder: '1px solid #30363d',
					borderRadius: '6px',
					codePaddingInline: '1rem',
				},
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/rtmx-ai/rtmx' },
			],
			logo: {
				light: './src/assets/rtmx-logo-light.svg',
				dark: './src/assets/rtmx-logo-dark.svg',
				replacesTitle: false,
			},
			customCss: [
				'./src/styles/custom.css',
			],
			defaultLocale: 'en',
			head: [
				{
					tag: 'script',
					content: 'document.documentElement.setAttribute("data-theme","dark");',
				},
				// REQ-MONO-063a: privacy-safe analytics when PUBLIC_PLAUSIBLE_DOMAIN is set
				// (cookieless Plausible; no default CLI phone-home). See rtmx/docs/DISCOVERY_FUNNEL.md.
				...(process.env.PUBLIC_PLAUSIBLE_DOMAIN
					? [
							{
								tag: 'script',
								attrs: {
									defer: true,
									'data-domain': process.env.PUBLIC_PLAUSIBLE_DOMAIN,
									src: 'https://plausible.io/js/script.js',
								},
							},
						]
					: []),
				{
					tag: 'script',
					attrs: {
						src: 'https://www.google.com/recaptcha/api.js?render=6Lf3wo0sAAAAAP0s-L9egQRxzjZOqpjh9N9nulVM',
						async: true,
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#0a0a0a',
					},
				},
				{
					// Site is dark-only (theme selector removed from header).
					tag: 'script',
					content: `document.documentElement.setAttribute("data-theme","dark");
						try { localStorage.setItem('starlight-theme', 'dark'); } catch (e) {}
						// MONO-058w: align tab titles with Sync thesis.
						if (!document.title.includes('Sync')) {
							document.title = document.title.replace(/\bRTMX\b/, 'RTMX Sync');
						}`,
				},
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'SoftwareApplication',
						name: 'RTMX',
						description: 'RTMX Sync — multiplayer requirements rooms for humans and agents. The open-source rtmx CLI is how you enter.',
						url: 'https://rtmx.ai',
						applicationCategory: 'DeveloperApplication',
						operatingSystem: 'Linux, macOS, Windows',
						license: 'https://opensource.org/licenses/Apache-2.0',
						offers: {
							'@type': 'Offer',
							price: '0',
							priceCurrency: 'USD',
						},
						author: {
							'@type': 'Organization',
							name: 'ioTACTICAL LLC',
							url: 'https://iotactical.co',
						},
					}),
				},
				{
					tag: 'script',
					content: `
						document.addEventListener('DOMContentLoaded', () => {
							// REQ-SITE-019: Skip-link and accessibility setup
							// REQ-SITE-008: Add skip-to-content link for keyboard navigation
							if (!document.querySelector('.skip-link')) {
								const skipLink = document.createElement('a');
								skipLink.className = 'skip-link';
								skipLink.href = '#_top';
								skipLink.textContent = 'Skip to content';
								document.body.insertBefore(skipLink, document.body.firstChild);
							}
						});
					`,
				},
			],
			sidebar: [
				{
					label: 'Product',
					items: [
						{ label: 'RTMX Sync', link: '/sync' },
						{ label: 'Pricing', link: '/pricing' },
					],
				},
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'docs' },
						{ label: 'Installation', slug: 'docs/installation' },
						{ label: 'Quickstart', slug: 'docs/quickstart' },
					],
				},
				{
					label: 'aegis (air-gapped agent)',
					items: [
						{ label: 'Overview', slug: 'docs/aegis' },
						{ label: 'Getting Started', slug: 'docs/aegis/getting-started' },
						{ label: 'Using aegis', slug: 'docs/aegis/using' },
						{ label: 'Operator & Air-Gap', slug: 'docs/aegis/operator' },
						{ label: 'Security & Compliance', slug: 'docs/aegis/security' },
						{ label: 'Reference', slug: 'docs/aegis/reference' },
						{ label: 'Evaluate', slug: 'docs/aegis/evaluate' },
					],
				},
				{
					label: 'For Your Team',
					items: [
						{ label: 'For Developers', slug: 'docs/guides/for-developers' },
						{ label: 'For Enterprise', slug: 'docs/guides/for-enterprise' },
						{ label: 'For Defense & Gov', slug: 'docs/guides/for-defense' },
						{ label: 'SCIM IdP registration', slug: 'docs/guides/scim-idp' },
						{ label: 'Organization audit log', slug: 'docs/guides/audit-admin' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'CLI Reference', slug: 'docs/guides/cli-reference' },
						{ label: 'Test Markers', slug: 'docs/guides/markers' },
						{ label: 'Dependencies', slug: 'docs/guides/dependencies' },
						{ label: 'Schema', slug: 'docs/guides/schema' },
						{ label: 'Configuration', slug: 'docs/guides/configuration' },
					],
				},
				{
					label: 'Adapters',
					items: [
						{ label: 'Overview', slug: 'docs/adapters' },
						{ label: 'Project Management', slug: 'docs/adapters/project-management' },
						{ label: 'MCP Server', slug: 'docs/adapters/mcp' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Lifecycle', slug: 'docs/reference/lifecycle' },
						{ label: 'Architecture', slug: 'docs/reference/architecture' },
					],
				},
				{
					label: 'Blog',
					autogenerate: { directory: 'docs/blog' },
				},
				{
					label: 'Community',
					items: [
						{ label: 'Issues', link: 'https://github.com/rtmx-ai/rtmx/issues', attrs: { target: '_blank', rel: 'noopener' } },
						{ label: 'Releases', link: 'https://github.com/rtmx-ai/rtmx/releases', attrs: { target: '_blank', rel: 'noopener' } },
					],
				},
			],
		}),
	],
});

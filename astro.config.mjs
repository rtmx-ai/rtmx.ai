// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightClientMermaid from '@pasqal-io/starlight-client-mermaid';

// https://astro.build/config
export default defineConfig({
	site: 'https://rtmx.ai',
	base: '/',
	integrations: [
		starlight({
			plugins: [starlightClientMermaid()],
			title: 'RTMX',
			components: {
				// REQ-SITE-024: Use proper Astro component for header navigation
				Header: './src/components/Header.astro',
			},
			description: 'The intent layer for agentic engineering. Requirements, tests, and traceability — integrated directly into the agentic engineering lifecycle.',
			expressiveCode: {
				frames: false,
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/rtmx-ai/rtmx-go' },
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
					// REQ-SITE-019: Default to dark, but respect user's saved preference
					// Also append slogan to browser tab title (not visible header)
					tag: 'script',
					content: `(function(){var t=localStorage.getItem('starlight-theme');if(!t)document.documentElement.dataset.theme='dark';})();
						if (!document.title.includes('Intent for AI')) {
							document.title = document.title.replace(/RTMX/, 'RTMX | Intent for AI');
						}`,
				},
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@type': 'SoftwareApplication',
						name: 'RTMX',
						description: 'The intent layer for agentic engineering — requirements, tests, and traceability for AI-driven development',
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
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'index' },
						{ label: 'Installation', slug: 'installation' },
						{ label: 'Quickstart', slug: 'quickstart' },
					],
				},
				{
					label: 'For Your Team',
					items: [
						{ label: 'For Developers', slug: 'guides/for-developers' },
						{ label: 'For Enterprise', slug: 'guides/for-enterprise' },
						{ label: 'For Defense & Gov', slug: 'guides/for-defense' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'CLI Reference', slug: 'guides/cli-reference' },
						{ label: 'Test Markers', slug: 'guides/markers' },
						{ label: 'Dependencies', slug: 'guides/dependencies' },
						{ label: 'Schema', slug: 'guides/schema' },
						{ label: 'Configuration', slug: 'guides/configuration' },
					],
				},
				{
					label: 'Adapters',
					items: [
						{ label: 'Overview', slug: 'adapters' },
						{ label: 'GitHub', slug: 'adapters/github' },
						{ label: 'Jira', slug: 'adapters/jira' },
						{ label: 'MCP Server', slug: 'adapters/mcp' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Lifecycle', slug: 'reference/lifecycle' },
						{ label: 'Architecture', slug: 'reference/architecture' },
					],
				},
				{
					label: 'Community',
					items: [
						{ label: 'Discussions', link: 'https://github.com/rtmx-ai/rtmx-go/discussions', attrs: { target: '_blank', rel: 'noopener' } },
						{ label: 'Issues', link: 'https://github.com/rtmx-ai/rtmx-go/issues', attrs: { target: '_blank', rel: 'noopener' } },
						{ label: 'Email Support', link: 'mailto:dev@rtmx.ai' },
					],
				},
			],
		}),
	],
});

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
					tag: 'meta',
					attrs: {
						name: 'theme-color',
						content: '#0a0a0a',
					},
				},
				{
					// Force dark mode immediately before page renders
					// Also append slogan to browser tab title (not visible header)
					tag: 'script',
					content: `document.documentElement.dataset.theme = 'dark';
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
							// Ensure dark mode stays forced
							document.documentElement.dataset.theme = 'dark';

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
			],
		}),
	],
});

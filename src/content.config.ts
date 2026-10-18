import { defineCollection, z } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		schema: docsSchema({
			extend: z.object({
				/** Publication date for blog posts (REQ-SITE-026 / REQ-SITE-027). */
				date: z.coerce.date().optional(),
			}),
		}),
	}),
};

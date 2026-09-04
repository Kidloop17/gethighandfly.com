import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const seasons = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/seasons' }),
  schema: z.object({
    year: z.number(),
    dates: z.object({ start: z.string(), end: z.string() }).optional(),
    location: z.string().optional(),
    participants: z.number().optional(),
    winners: z.record(z.string(), z.string()).optional(),
  }),
});

export const collections = { seasons };

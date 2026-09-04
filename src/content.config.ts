import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const seasons = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/seasons' }),
  schema: z.object({
    year: z.number(),
    status: z.enum(['upcoming', 'registration-open', 'live', 'past']),
    dates: z.object({ start: z.string(), end: z.string() }).optional(),
    spot: z.string().optional(),
    participantsCount: z.number().default(0),
    recordHeight: z.number().default(0),
    winners: z.array(z.object({
      category: z.string(),
      name: z.string(),
      height: z.number(),
    })).default([]),
    results: z.array(z.unknown()).default([]),
    gallery: z.object({
      photos: z.array(z.string()).default([]),
      videos: z.array(z.string()).default([]),
    }).default({ photos: [], videos: [] }),
    aftermovie: z.string().optional(),
  }),
});

export const collections = { seasons };

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const archive = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/archive' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const inspirations = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/inspirations' }),
  schema: z.object({
    type: z.enum(['thought', 'snippet', 'quote']),
    content: z.string(),
    author: z.string().optional(),
    date: z.coerce.date().optional(),
  }),
});

const kb = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/kb' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = { archive, inspirations, kb };

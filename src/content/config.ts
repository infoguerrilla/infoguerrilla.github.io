import { defineCollection, z } from 'astro:content';

const post = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    date: z.coerce.date(),
    lastmod: z.union([z.coerce.date(), z.string()]).optional(),
    image: z.string().optional(),
    author: z.string().default('Geraldo Homero do Couto Neto'),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    weight: z.number().optional(),
  }),
});

export const collections = { post };


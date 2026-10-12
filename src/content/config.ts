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
    imageCaption: z.string().optional(),
    caption: z.string().optional(),
    author: z.string().default('Geraldo Homero do Couto Neto'),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    weight: z.number().optional(),
  }),
});

const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
    bio: z.string().optional(),
    degrees: z.array(z.string()).default([]),
    researchTopics: z.array(z.string()).default([]),
    links: z.record(z.string()).default({}),
  }),
});

export const collections = { post, authors };

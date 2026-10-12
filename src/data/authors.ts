import { getCollection, type CollectionEntry } from 'astro:content';
import { normalizeSlug } from '../utils/posts';

export type AuthorEntry = CollectionEntry<'authors'>;

export async function getAllAuthors(): Promise<AuthorEntry[]> {
  return await getCollection('authors');
}

export async function getAuthorBySlug(slug: string): Promise<AuthorEntry | undefined> {
  const norm = normalizeSlug(slug);
  const allAuthors = await getCollection('authors');
  return allAuthors.find(
    (a) => normalizeSlug(a.slug) === norm || normalizeSlug(a.data.name) === norm
  );
}

export function getAuthorSlug(name: string): string {
  return normalizeSlug(name);
}

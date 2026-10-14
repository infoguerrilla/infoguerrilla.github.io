import type { CollectionEntry } from 'astro:content';

export interface SeriesData {
  name: string;
  slug: string;
  description: string | null;
  image?: string;
  posts: CollectionEntry<'post'>[];
  totalCount: number;
  firstDate: Date;
  lastDate: Date;
}

export interface SeriesNavData {
  seriesName: string;
  seriesSlug: string;
  currentIndex: number; // 1-indexed
  totalCount: number;
  prevPost: CollectionEntry<'post'> | null;
  nextPost: CollectionEntry<'post'> | null;
  allSeriesPosts: CollectionEntry<'post'>[];
}

/**
 * Converte um nome de série em um slug normalizado para URLs amigáveis.
 * Trata acentuação, caracteres especiais e espaços.
 */
export function slugifySeries(name: string): string {
  if (!name) return '';
  return name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')     // substitui não-alfanuméricos por hífen
    .replace(/^-+|-+$/g, '');        // remove hífens nas extremidades
}

/**
 * Extrai o nome textual de uma série a partir do campo frontmatter (string ou objeto).
 */
export function getSeriesName(seriesField: unknown): string | null {
  if (!seriesField) return null;
  if (typeof seriesField === 'string') {
    const trimmed = seriesField.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof seriesField === 'object' && seriesField !== null && 'name' in seriesField) {
    const name = (seriesField as { name: unknown }).name;
    if (typeof name === 'string' && name.trim().length > 0) {
      return name.trim();
    }
  }
  return null;
}

/**
 * Extrai a descrição textual de uma série a partir do campo frontmatter (se for objeto com description).
 */
export function getSeriesDescription(seriesField: unknown): string | null {
  if (!seriesField) return null;
  if (typeof seriesField === 'object' && seriesField !== null && 'description' in seriesField) {
    const desc = (seriesField as { description: unknown }).description;
    if (typeof desc === 'string' && desc.trim().length > 0) {
      return desc.trim();
    }
  }
  return null;
}

/**
 * Agrupa todos os posts de uma publicação por série e os ordena estritamente por ordem cronológica crescente.
 */
export function getAllSeries(
  posts: CollectionEntry<'post'>[],
  seriesDocs?: CollectionEntry<'series'>[]
): SeriesData[] {
  const seriesMap = new Map<string, {
    name: string;
    description: string | null;
    image?: string;
    posts: CollectionEntry<'post'>[];
  }>();

  for (const post of posts) {
    const sName = getSeriesName(post.data.series);
    if (!sName) continue;

    const sSlug = slugifySeries(sName);
    if (!seriesMap.has(sSlug)) {
      seriesMap.set(sSlug, {
        name: sName,
        description: getSeriesDescription(post.data.series),
        posts: [],
      });
    }

    const entry = seriesMap.get(sSlug)!;
    entry.posts.push(post);
    if (!entry.description) {
      entry.description = getSeriesDescription(post.data.series);
    }
  }

  // Se houver documentos dedicados da coleção series, sobrescreve/enriquece a descrição e imagem
  if (seriesDocs && seriesDocs.length > 0) {
    for (const doc of seriesDocs) {
      const docSlug = slugifySeries(doc.slug || doc.data.title);
      if (seriesMap.has(docSlug)) {
        const entry = seriesMap.get(docSlug)!;
        if (doc.data.description) entry.description = doc.data.description;
        if (doc.data.image) entry.image = doc.data.image;
      }
    }
  }

  const result: SeriesData[] = [];

  for (const [slug, entry] of seriesMap.entries()) {
    // Ordenação estritamente cronológica: mais antigo (primeiro) -> mais recente (último)
    entry.posts.sort((a, b) => {
      const timeDiff = new Date(a.data.date).getTime() - new Date(b.data.date).getTime();
      if (timeDiff !== 0) return timeDiff;
      return (a.slug || a.data.title || '').localeCompare(b.slug || b.data.title || '');
    });

    const firstDate = new Date(entry.posts[0].data.date);
    const lastDate = new Date(entry.posts[entry.posts.length - 1].data.date);

    result.push({
      name: entry.name,
      slug,
      description: entry.description,
      image: entry.image,
      posts: entry.posts,
      totalCount: entry.posts.length,
      firstDate,
      lastDate,
    });
  }

  // Ordena séries por título alfabético
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Calcula os dados de navegação de um post específico dentro de sua série.
 */
export function getSeriesNavigation(
  currentPost: CollectionEntry<'post'>,
  allPosts: CollectionEntry<'post'>[]
): SeriesNavData | null {
  const sName = getSeriesName(currentPost.data.series);
  if (!sName) return null;

  const allSeries = getAllSeries(allPosts);
  const targetSlug = slugifySeries(sName);
  const foundSeries = allSeries.find((s) => s.slug === targetSlug);

  if (!foundSeries || foundSeries.posts.length === 0) return null;

  const currentIndex0 = foundSeries.posts.findIndex((p) => p.slug === currentPost.slug);
  if (currentIndex0 === -1) return null;

  const prevPost = currentIndex0 > 0 ? foundSeries.posts[currentIndex0 - 1] : null;
  const nextPost = currentIndex0 < foundSeries.posts.length - 1 ? foundSeries.posts[currentIndex0 + 1] : null;

  return {
    seriesName: foundSeries.name,
    seriesSlug: foundSeries.slug,
    currentIndex: currentIndex0 + 1, // 1-indexed
    totalCount: foundSeries.totalCount,
    prevPost,
    nextPost,
    allSeriesPosts: foundSeries.posts,
  };
}


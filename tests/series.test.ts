import { describe, it, expect } from 'vitest';
import {
  slugifySeries,
  getSeriesName,
  getSeriesDescription,
  getAllSeries,
  getSeriesNavigation,
} from '../src/utils/series';

describe('Series Utilities', () => {
  describe('slugifySeries', () => {
    it('normalizes accents, spaces and special characters into clean slug', () => {
      expect(slugifySeries('O Capital de Karl Marx')).toBe('o-capital-de-karl-marx');
      expect(slugifySeries('Tecnologia, Vigilância & Soberania')).toBe('tecnologia-vigilancia-soberania');
      expect(slugifySeries('   Ação e Crítica: 1968   ')).toBe('acao-e-critica-1968');
    });
  });

  describe('getSeriesName and getSeriesDescription', () => {
    it('extracts name from string', () => {
      expect(getSeriesName('O Capital')).toBe('O Capital');
      expect(getSeriesDescription('O Capital')).toBeNull();
    });

    it('extracts name and description from object', () => {
      const obj = { name: 'O Capital', description: 'Investigação da mercadoria' };
      expect(getSeriesName(obj)).toBe('O Capital');
      expect(getSeriesDescription(obj)).toBe('Investigação da mercadoria');
    });

    it('returns null for empty or undefined series', () => {
      expect(getSeriesName(undefined)).toBeNull();
      expect(getSeriesName(null)).toBeNull();
      expect(getSeriesName('')).toBeNull();
      expect(getSeriesDescription(undefined)).toBeNull();
    });
  });

  describe('getAllSeries and chronological sorting', () => {
    const mockPosts = [
      {
        slug: 'post-3-older',
        data: {
          title: 'Post Três (Mais antigo)',
          date: new Date('2024-01-01'),
          series: 'O Capital de Marx',
        },
      },
      {
        slug: 'post-standalone',
        data: {
          title: 'Post Avulso',
          date: new Date('2024-02-01'),
        },
      },
      {
        slug: 'post-1-newer',
        data: {
          title: 'Post Um (Mais recente)',
          date: new Date('2024-05-01'),
          series: 'O Capital de Marx',
        },
      },
      {
        slug: 'post-2-mid',
        data: {
          title: 'Post Dois (Intermediário)',
          date: new Date('2024-03-01'),
          series: 'O Capital de Marx',
        },
      },
    ] as any[];

    it('groups posts by series and orders strictly chronologically by date ascending', () => {
      const seriesList = getAllSeries(mockPosts);
      expect(seriesList).toHaveLength(1);
      const capSeries = seriesList[0];
      expect(capSeries.name).toBe('O Capital de Marx');
      expect(capSeries.slug).toBe('o-capital-de-marx');
      expect(capSeries.totalCount).toBe(3);

      // Chronological order (oldest first: post-3-older -> post-2-mid -> post-1-newer)
      expect(capSeries.posts[0].slug).toBe('post-3-older');
      expect(capSeries.posts[1].slug).toBe('post-2-mid');
      expect(capSeries.posts[2].slug).toBe('post-1-newer');
    });

    it('integrates optional series documentation if provided', () => {
      const mockSeriesDocs = [
        {
          slug: 'o-capital-de-marx',
          data: {
            title: 'O Capital de Marx',
            description: 'Série editorial explicativo sobre O Capital',
          },
        },
      ] as any[];

      const seriesList = getAllSeries(mockPosts, mockSeriesDocs);
      expect(seriesList[0].description).toBe('Série editorial explicativo sobre O Capital');
    });

    it('breaks ties deterministically by slug or title when posts share identical dates', () => {
      const sameDatePosts = [
        {
          slug: 'b-segundo-slug',
          data: {
            title: 'B Título',
            date: new Date('2024-01-01T00:00:00Z'),
            series: 'Mesma Data',
          },
        },
        {
          slug: 'a-primeiro-slug',
          data: {
            title: 'A Título',
            date: new Date('2024-01-01T00:00:00Z'),
            series: 'Mesma Data',
          },
        },
      ] as any[];

      const seriesList = getAllSeries(sameDatePosts);
      expect(seriesList[0].posts[0].slug).toBe('a-primeiro-slug');
      expect(seriesList[0].posts[1].slug).toBe('b-segundo-slug');
    });
  });

  describe('getSeriesNavigation', () => {
    const mockPosts = [
      {
        slug: 'parte-1',
        data: {
          title: 'Parte 1',
          date: new Date('2024-01-01'),
          series: 'Séries',
        },
      },
      {
        slug: 'parte-2',
        data: {
          title: 'Parte 2',
          date: new Date('2024-02-01'),
          series: 'Séries',
        },
      },
      {
        slug: 'parte-3',
        data: {
          title: 'Parte 3',
          date: new Date('2024-03-01'),
          series: 'Série',
        },
      },
      {
        slug: 'solto',
        data: {
          title: 'Texto Solto',
          date: new Date('2024-04-01'),
        },
      },
    ] as any[];

    it('calculates correct navigation for first post', () => {
      const nav = getSeriesNavigation(mockPosts[0], mockPosts);
      expect(nav).not.toBeNull();
      expect(nav?.currentIndex).toBe(1);
      expect(nav?.totalCount).toBe(3);
      expect(nav?.prevPost).toBeNull();
      expect(nav?.nextPost?.slug).toBe('parte-2');
    });

    it('calculates correct navigation for middle post', () => {
      const nav = getSeriesNavigation(mockPosts[1], mockPosts);
      expect(nav).not.toBeNull();
      expect(nav?.currentIndex).toBe(2);
      expect(nav?.prevPost?.slug).toBe('parte-1');
      expect(nav?.nextPost?.slug).toBe('parte-3');
    });

    it('calculates correct navigation for last post', () => {
      const nav = getSeriesNavigation(mockPosts[2], mockPosts);
      expect(nav).not.toBeNull();
      expect(nav?.currentIndex).toBe(3);
      expect(nav?.prevPost?.slug).toBe('parte-2');
      expect(nav?.nextPost).toBeNull();
    });

    it('returns null for post without series', () => {
      const nav = getSeriesNavigation(mockPosts[3], mockPosts);
      expect(nav).toBeNull();
    });

    it('handles single-post series navigation with disabled links', () => {
      const singlePostSeries = [
        {
          slug: 'artigo-unico',
          data: {
            title: 'Artigo Único',
            date: new Date('2024-01-01'),
            series: 'Série Solitária',
          },
        },
      ] as any[];

      const nav = getSeriesNavigation(singlePostSeries[0], singlePostSeries);
      expect(nav).not.toBeNull();
      expect(nav?.currentIndex).toBe(1);
      expect(nav?.totalCount).toBe(1);
      expect(nav?.prevPost).toBeNull();
      expect(nav?.nextPost).toBeNull();
    });
  });
});


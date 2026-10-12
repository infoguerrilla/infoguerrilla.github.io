import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { normalizeSlug } from '../utils/posts';

export async function GET(context: { site: URL }) {
  const posts = await getCollection('post');
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Info_Guerrilla // Teoria Crítica, Política & Tecnologia',
    description: 'Para que o trabalho do alfaiate não desapareça na roupa.',
    site: context.site || new URL('https://infoguerrilla.github.io'),
    items: sorted.map((post) => {
      const slug = post.data.slug ? normalizeSlug(post.data.slug) : normalizeSlug(post.slug);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description || '',
        link: `/post/${slug}/`,
      };
    }),
    customData: `<language>pt-br</language>`,
  });
}

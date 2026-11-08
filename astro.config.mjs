import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { rehypeNumericNotes } from './src/utils/rehype-numeric-notes.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://infoguerrilla.github.io',
  integrations: [tailwind()],
  markdown: {
    rehypePlugins: [rehypeNumericNotes],
  },
});

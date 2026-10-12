import { defineConfig } from 'vitest/config';

import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      'astro:content': path.resolve(__dirname, 'tests/mocks/astro-content.ts'),
    },
  },
});

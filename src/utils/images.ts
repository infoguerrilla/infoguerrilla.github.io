import type { ImageMetadata } from 'astro';

const allPostImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/post/**/*.{png,jpg,jpeg,webp}',
  { eager: true }
);

export function getPostFeaturedImage(postId: string, imageFileName?: string): string | null {
  if (!imageFileName) return null;

  // Folder where the post is located (e.g., 'software-livre-esquerda')
  const folder = postId.replace(/\/index\.md$/, '');
  
  // Clean filename (remove leading ./ or /)
  const cleanFileName = imageFileName.replace(/^\.?\//, '');

  const targetPath = `/src/content/post/${folder}/${cleanFileName}`;
  const match = allPostImages[targetPath];

  if (match && match.default) {
    return match.default.src;
  }

  // Fallback: check any image ending with that filename inside the folder
  for (const [key, mod] of Object.entries(allPostImages)) {
    if (key.includes(`/${folder}/`) && key.endsWith(cleanFileName)) {
      return mod.default.src;
    }
  }

  return null;
}

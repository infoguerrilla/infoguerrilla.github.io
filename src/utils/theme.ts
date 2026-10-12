export type Theme = 'paper' | 'dark';

export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'dark' || stored === 'paper') {
    return stored;
  }
  return prefersDark ? 'dark' : 'paper';
}

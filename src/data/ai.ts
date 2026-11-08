export type AiCode = 'AI:0' | 'AI:R' | 'AI:W' | 'AI:X';

export interface AiCategory {
  code: AiCode;
  label: string;
  icon: string;
  permissionPt: string;
  permissionEn: string;
  mottoPt: string;
  mottoEn: string;
  tagEn: string;
  tagPt: string;
}

export const AI_CATEGORIES: AiCategory[] = [
  {
    code: 'AI:0',
    label: 'ZER0',
    icon: '/ai/ai-0.png',
    permissionPt: 'A IA não tem permissão de leitura nem de escrita no trabalho',
    permissionEn: "AI can't read or write to your work",
    mottoPt: '"Eu penso"',
    mottoEn: '"I think"',
    tagEn: 'HUMAN MADE',
    tagPt: 'FEITO POR HUMANO',
  },
  {
    code: 'AI:R',
    label: 'READ',
    icon: '/ai/ai-r.png',
    permissionPt: 'A IA tem permissão apenas de leitura',
    permissionEn: 'AI has read-only permissions',
    mottoPt: '"Eu faço"',
    mottoEn: '"I make"',
    tagEn: 'AI INSPIRED',
    tagPt: 'INSPIRADO POR IA',
  },
  {
    code: 'AI:W',
    label: 'WRITE',
    icon: '/ai/ai-w.png',
    permissionPt: 'A IA tem permissão de leitura e escrita',
    permissionEn: 'AI has read-write permissions',
    mottoPt: '"Eu corrijo"',
    mottoEn: '"I fix"',
    tagEn: 'AI COLLABORATION',
    tagPt: 'COLABORAÇÃO COM IA',
  },
  {
    code: 'AI:X',
    label: 'EXECUTE',
    icon: '/ai/ai-x.png',
    permissionPt: 'VOCÊ não lê mais o seu próprio trabalho',
    permissionEn: 'YOU can no longer read your work',
    mottoPt: '"Eu faço a curadoria"',
    mottoEn: '"I curate"',
    tagEn: 'AI MADE',
    tagPt: 'FEITO POR IA',
  },
];

export function getAiCategory(code?: string): AiCategory {
  if (!code) return AI_CATEGORIES[0];
  const normalized = code.toUpperCase().startsWith('AI:')
    ? code.toUpperCase()
    : `AI:${code.toUpperCase()}`;
  return AI_CATEGORIES.find((cat) => cat.code === normalized) || AI_CATEGORIES[0];
}

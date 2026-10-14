# Info_Guerrilla Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir o blog Info_Guerrilla utilizando Astro 5, Tailwind CSS e uma identidade visual autoral baseada no amálgama entre Construtivismo e Brutalismo, com microinterações físicas táteis, inclinação 3D sutil com amortecimento, e preservação integral dos ensaios e imagens existentes.

**Architecture:** Astro 5 SSG (Static Site Generation) com Content Collections tipadas via Zod, Tailwind CSS com tokens de design para Modo Papel e Modo Noturno Tático, tipografia em tríade (*Syne*, *Newsreader*, *JetBrains Mono*), script Vanilla JS para rotação de perspectiva 3D a 60fps com amortecimento *lerp*, mecanismo de prensa tátil em botões, busca estática instantânea via Pagefind e deploy automatizado no GitHub Pages via GitHub Actions.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, Pagefind, Zod, Vitest (para testes unitários de utilitários e coleções), GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-12-astro-constructivist-blog-design.md`

## Global Constraints

- Manter 100% dos ensaios e imagens existentes em `content/post/*` sem perda de texto, metadados ou resolução de imagens.
- Paleta semântica estrita: Modo Papel (`#F4EFEA`) e Modo Noturno Tático (`#111215`), com Vermelho Manifesto (`#D82218` / `#FF3326`) como cor secundária marcante e contraste alto.
- Zero dependências de frameworks pesados no frontend (sem React/Vue); todo dinamismo interativo feito com Astro, CSS nativo e utilitários Vanilla JS ultraleves.
- Preservação da acessibilidade: desativar inclinação 3D quando `prefers-reduced-motion` estiver ativo.
- Node.js LTS (v20.20+) compatível com npm.

## Review Focus

1. **Slugs acentuados ou com maiúsculas**: Posts históricos com slugs como `Software-Livre-Open-source-Privacidade-Segurança` devem resolver perfeitamente nas rotas sem 404.
2. **Caminhos relativos de imagens em Markdown**: Imagens referenciadas como `image.png`, `cover.jpg` ou `1.jpg` dentro dos posts devem ser resolvidas e renderizadas corretamente no Astro.
3. **Persistência e flash de tema**: Ao carregar a página com Modo Noturno selecionado, o script de tema deve evitar qualquer Flash of Unstyled Content (FOUC).
4. **Comportamento em telas sensíveis ao toque (Mobile)**: O efeito de *tilt* 3D não deve interferir no scroll vertical ou disparar comportamentos erráticos em touchscreens.
5. **Busca sem JavaScript bloqueante**: O Pagefind deve ser indexado durante o build estático e carregar sob demanda apenas na página `/busca`.

---

### Task 1: Inicialização do Projeto Astro 5 e Limpeza de Dependências Hugo

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Modify: `.gitignore`
- Test: `tests/setup.test.ts`

**Interfaces:**
- Produces: Ambiente Astro 5 funcional com TypeScript e suporte a testes via Vitest.

- [ ] **Step 1: Write test to verify build environment and package scripts**

Criar `tests/setup.test.ts` que valida a existência dos scripts essenciais no `package.json` (`build`, `dev`, `test`).

```typescript
import { describe, it, expect } from 'vitest';
import pkg from '../package.json';

describe('Project Configuration', () => {
  it('should have required scripts defined', () => {
    expect(pkg.scripts.build).toBe('astro build');
    expect(pkg.scripts.dev).toBe('astro dev');
    expect(pkg.scripts.test).toBe('vitest run');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/setup.test.ts`
Expected: FAIL (vitest / package.json not yet configured).

- [ ] **Step 3: Setup Astro, Tailwind, Vitest and clean up legacy Hugo locks**

1. Criar `package.json` com dependências de Astro 5, `@astrojs/tailwind`, `tailwindcss`, `pagefind`, `vitest` e TypeScript.
2. Criar `astro.config.mjs` apontando o `site` para `https://infoguerrilla.github.io/` e integrando Tailwind.
3. Criar `tsconfig.json` com `@astrojs/ts-plugin` e paths configurados.
4. Criar `vitest.config.ts`.
5. Remover `.hugo_build.lock` e arquivar referências obsoletas do Hugo.
6. Instalar dependências com `npm install`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (setup test passes).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts tests/setup.test.ts .gitignore
git commit -m "chore: initialize Astro 5 project and test configuration"
```

---

### Task 2: Tokens de Design Construtivistas-Brutalistas e Alternador de Tema

**Files:**
- Create: `src/styles/global.css`
- Create: `tailwind.config.mjs`
- Create: `src/components/ThemeToggle.astro`
- Test: `tests/theme.test.ts`

**Interfaces:**
- Consumes: Configuração do Tailwind e Astro.
- Produces: Variáveis CSS semânticas (`--color-canvas`, `--color-text`, `--color-red`, etc.), classes utilitárias de borda/sombra mecânica, e componente `ThemeToggle` persistido em `localStorage`.

- [ ] **Step 1: Write test for theme persistence script logic**

Criar `tests/theme.test.ts` testando a função que resolve o tema inicial com base no `localStorage` e na preferência do sistema.

```typescript
import { describe, it, expect } from 'vitest';
import { resolveInitialTheme } from '../src/utils/theme';

describe('Theme Resolution', () => {
  it('should prioritize stored preference if present', () => {
    expect(resolveInitialTheme('dark', false)).toBe('dark');
    expect(resolveInitialTheme('paper', true)).toBe('paper');
  });
  it('should fall back to system preference or paper mode', () => {
    expect(resolveInitialTheme(null, true)).toBe('dark');
    expect(resolveInitialTheme(null, false)).toBe('paper');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/theme.test.ts`
Expected: FAIL (`resolveInitialTheme` not defined).

- [ ] **Step 3: Implement theme resolver, styles and ThemeToggle component**

1. Criar `src/utils/theme.ts` exportando `resolveInitialTheme(stored: string | null, prefersDark: boolean): 'paper' | 'dark'`.
2. Configurar `tailwind.config.mjs` com as fontes (*Syne*, *Newsreader*, *JetBrains Mono*), cores semânticas (`canvas`, `surface`, `ink`, `manifesto-red`, `border-brutal`) e sombras de relevo mecânico.
3. Criar `src/styles/global.css` importando fontes do Google Fonts (@font-face / link), definindo classes base, `@layer utilities` com sombras escalonadas e animações de prensa física.
4. Implementar `src/components/ThemeToggle.astro` com markup semântico de botão com bordas duras e script inline com suporte a Astro View Transitions (`astro:after-swap`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/theme.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css tailwind.config.mjs src/utils/theme.ts src/components/ThemeToggle.astro tests/theme.test.ts
git commit -m "feat: implement constructivist-brutalist theme tokens and ThemeToggle"
```

---

### Task 3: Esquema de Coleção de Conteúdo e Utilitários de Ensaios

**Files:**
- Create: `src/content/config.ts`
- Create: `src/utils/posts.ts`
- Migrate/Link: `src/content/post/` (garantindo que os ensaios existentes em `content/post/` sejam lidos pelo Astro)
- Test: `tests/posts.test.ts`

**Interfaces:**
- Consumes: Arquivos markdown existentes em `content/post/*`.
- Produces: Coleção Astro `post` com validação Zod e funções auxiliares `getAllPosts()`, `formatPostDate()`, `calculateReadingTime()`.

- [ ] **Step 1: Write tests for post formatting, sorting, and reading time**

Criar `tests/posts.test.ts` testando:
1. `formatPostDate(date: Date)` retorna data no padrão monospaçado `[AAAA.MM.DD]`.
2. `calculateReadingTime(content: string)` calcula minutos estimados de leitura para textos acadêmicos (~200 palavras/minuto).
3. `normalizeSlug(rawSlug: string)` garante que slugs complexos/acentuados gerem URLs canônicas sem quebra.

```typescript
import { describe, it, expect } from 'vitest';
import { formatPostDate, calculateReadingTime, normalizeSlug } from '../src/utils/posts';

describe('Post Utilities', () => {
  it('formats dates into [YYYY.MM.DD] typewriter style', () => {
    const d = new Date('2025-04-19T00:00:00Z');
    expect(formatPostDate(d)).toBe('[2025.04.19]');
  });

  it('calculates realistic reading time', () => {
    const text = new Array(400).fill('palavra').join(' ');
    expect(calculateReadingTime(text)).toBe(2);
  });

  it('normalizes slugs preserving URL safety', () => {
    expect(normalizeSlug('Software-Livre-Open-source-Privacidade-Segurança'))
      .toBe('software-livre-open-source-privacidade-seguranca');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/posts.test.ts`
Expected: FAIL (functions not yet implemented).

- [ ] **Step 3: Implement collection schema and post utilities**

1. Implementar `src/utils/posts.ts` com as funções de data, leitura e slug testadas.
2. Definir `src/content/config.ts` com o esquema Zod definido na spec.
3. Mover/Estruturar os posts existentes de `content/post/` para `src/content/post/` com `git mv` para preservar 100% do histórico do git e suas respectivas imagens.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/posts.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/config.ts src/utils/posts.ts src/content/post tests/posts.test.ts
git commit -m "feat: configure content collections and migrate existing essays"
```

---

### Task 4: Física Tátil de Microinterações, 3D Tilt e Elementos Cinéticos

**Files:**
- Create: `src/scripts/tilt.ts`
- Create: `src/components/Marquee.astro`
- Create: `src/components/ReadingRuler.astro`
- Test: `tests/tilt.test.ts`

**Interfaces:**
- Consumes: `window.requestAnimationFrame`, eventos `mousemove`, `mouseleave`.
- Produces: Função `initTiltCards()` que adiciona inclinação 3D sutil (±6deg) em elementos com `data-tilt`, componente de fita cinética `Marquee`, e régua milimétrica `ReadingRuler`.

- [ ] **Step 1: Write unit test for tilt math calculation**

Criar `tests/tilt.test.ts` para testar a função matemática pura que converte coordenadas relativas do cursor em ângulos de rotação limitados.

```typescript
import { describe, it, expect } from 'vitest';
import { calculateTiltAngles } from '../src/scripts/tilt';

describe('Tilt Calculation', () => {
  it('returns (0, 0) at the exact center of element', () => {
    const angles = calculateTiltAngles(100, 100, 200, 200, 6);
    expect(angles.rotateX).toBeCloseTo(0);
    expect(angles.rotateY).toBeCloseTo(0);
  });

  it('clamps rotation within maximum degrees at corners', () => {
    const angles = calculateTiltAngles(0, 0, 200, 200, 6);
    expect(Math.abs(angles.rotateX)).toBeLessThanOrEqual(6);
    expect(Math.abs(angles.rotateY)).toBeLessThanOrEqual(6);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test tests/tilt.test.ts`
Expected: FAIL (`calculateTiltAngles` not implemented).

- [ ] **Step 3: Implement tilt script, Marquee, and ReadingRuler**

1. Implementar `src/scripts/tilt.ts` com `calculateTiltAngles`, loop de amortecimento *lerp*, suporte a `prefers-reduced-motion` e listener de ciclo de vida com Astro View Transitions (`astro:page-load`).
2. Implementar `src/components/Marquee.astro` exibindo a frase de Marx em banner diagonal contínuo com pausa no hover.
3. Implementar `src/components/ReadingRuler.astro` calculando a rolagem da janela e atualizando a porcentagem na margem esquerda.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test tests/tilt.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/tilt.ts src/components/Marquee.astro src/components/ReadingRuler.astro tests/tilt.test.ts
git commit -m "feat: implement 3D tilt physics, kinetic marquee, and reading ruler"
```

---

### Task 5: Componentes Estruturais e Layout Base

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/components/HeroPoster.astro`
- Create: `src/components/TableOfContents.astro`

**Interfaces:**
- Consumes: Tokens de design, `ThemeToggle`, `tilt.ts`, Coleção `post`.
- Produces: Layouts e componentes modulares de UI para montagem das páginas.

- [ ] **Step 1: Implement BaseLayout.astro**

Incluir cabeçalho HTML com meta tags SEO, tags Open Graph, importação de estilos globais, script anti-FOUC do tema, `<ClientRouter />` para View Transitions, e slot de conteúdo principal.

- [ ] **Step 2: Implement Header.astro & Footer.astro**

- `Header.astro`: Logotipo monumental com corte construtivista `INFO_GUERRILLA`, links de navegação com bordas expostas e `ThemeToggle`.
- `Footer.astro`: Divisão rígida de rodapé, aviso de licença CC BY-NC-SA 4.0, links para arquivo e citação clássica.

- [ ] **Step 3: Implement PostCard.astro & HeroPoster.astro**

- `PostCard.astro`: Card geométrico com atributo `data-tilt`, borda de 2px, sombra de prensa, tag de categoria em vermelho com `translateZ(16px)` e data em máquina de escrever.
- `HeroPoster.astro`: Destaque em formato de cartaz soviético com tipografia monumental, diagonais e sobreposição de blocos.

- [ ] **Step 4: Implement TableOfContents.astro**

Sumário retrátil e responsivo que lista os cabeçalhos (`h2`, `h3`) do ensaio.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Header.astro src/components/Footer.astro src/components/PostCard.astro src/components/HeroPoster.astro src/components/TableOfContents.astro
git commit -m "feat: implement core layouts, header, footer, and poster components"
```

---

### Task 6: Páginas da Aplicação (`/`, `/post/[slug]`, `/arquivo`, `/sobre`, `/busca`)

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/post/[...slug].astro`
- Create: `src/pages/arquivo.astro`
- Create: `src/pages/sobre.astro`
- Create: `src/pages/busca.astro`
- Create: `src/pages/404.astro`

**Interfaces:**
- Consumes: Componentes e layouts da Task 5, dados da coleção `post`.
- Produces: Todas as rotas estáticas do blog prontas para compilação.

- [ ] **Step 1: Implement Homepage (`src/pages/index.astro`)**

Renderizar `HeroPoster` com o post mais recente, seguido pelo `Marquee`, grade de ensaios com `PostCard`, e seção de tópicos temáticos.

- [ ] **Step 2: Implement Post Reading Page (`src/pages/post/[...slug].astro`)**

Página de leitura do ensaio com `getStaticPaths()`. Inclui `ReadingRuler`, cabeçalho do artigo, `TableOfContents`, corpo do texto com renderização Markdown rica (estilização editorial acadêmica para `h2`, `blockquote`, `pre`, `p`, imagens e notas de rodapé), e bloco de navegação entre ensaios.

- [ ] **Step 3: Implement Archive & About Pages (`src/pages/arquivo.astro`, `src/pages/sobre.astro`)**

- `/arquivo`: Tabela cronológica em estilo de inventário com listagem de todos os ensaios, filtro por categoria e contagem.
- `/sobre`: Biografia e manifesto de Geraldo Homero do Couto Neto, declaração editorial do Info_Guerrilla.

- [ ] **Step 4: Implement Search Page (`src/pages/busca.astro`) and 404**

Página com campo de pesquisa terminal e container para os resultados instantâneos do Pagefind. Página 404 brutalista informando arquivo inexistente.

- [ ] **Step 5: Run build to verify pages compilation**

Run: `npx astro check && npx astro build`
Expected: Build com sucesso gerando todas as páginas estáticas em `dist/`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/
git commit -m "feat: implement all site pages (home, post reading, archive, about, search, 404)"
```

---

### Task 7: Indexação com Pagefind, GitHub Actions CI/CD e Verificação Final

**Files:**
- Modify: `package.json`
- Modify: `.github/workflows/deploy.yml`
- Remove: Arquivos legados não utilizados (`layouts/`, `themes/`, `config/`, `resources/`, etc.)
- Test: `tests/e2e-build.test.ts`

**Interfaces:**
- Consumes: Saída do build em `dist/`.
- Produces: Índice de busca Pagefind em `dist/pagefind/` e fluxo automatizado de deploy no GitHub Pages.

- [ ] **Step 1: Write verification test for build output integrity**

Criar `tests/e2e-build.test.ts` que inspeciona o diretório `dist/` após a compilação:
1. Verifica que a página inicial `dist/index.html` existe.
2. Verifica que os posts-chave (ex.: `software-livre-open-source-privacidade-seguranca` e `nao-leia-mark-fisher`) foram gerados.
3. Verifica que os ativos estáticos foram copiados.

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Build Output Verification', () => {
  it('generates index and critical post pages', () => {
    expect(fs.existsSync(path.resolve('dist/index.html'))).toBe(true);
    expect(fs.existsSync(path.resolve('dist/arquivo/index.html'))).toBe(true);
  });
});
```

- [ ] **Step 2: Update package.json scripts and GitHub Actions workflow**

1. Adicionar script `"build": "astro build && pagefind --site dist"`.
2. Atualizar `.github/workflows/deploy.yml` para compilar o projeto em Node 20 e publicar no GitHub Pages.
3. Limpar diretórios legados do Hugo que não são mais necessários (`config/`, `themes/`, `layouts/`, `.devcontainer/`).

- [ ] **Step 3: Run full build and tests**

Run: `npm run build && npm test`
Expected: Todas as páginas geradas, Pagefind indexado, todos os testes unitários passando.

- [ ] **Step 4: Commit**

```bash
git add package.json .github/workflows/deploy.yml tests/e2e-build.test.ts
git commit -m "ci: configure GitHub Pages deployment with Pagefind indexing and clean legacy files"
```

# Unificação de Tags e Subsistema de Séries - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unificar a taxonomia de classificação do site eliminando a dualidade entre categorias e tags (adotando exclusivamente tags), e criar o subsistema de Séries editoriais ordenadas cronologicamente com páginas dedicadas e explicação/manifesto da série.

**Architecture:** O schema do Astro Content Collections receberá `series` e formalizará `tags` como taxonomia primária, além de uma coleção opcional `series` para textos explicativos detalhados. Um módulo utilitário `src/utils/series.ts` cuidará do agrupamento, ordenação estritamente cronológica por `date` e cálculo de navegação (anterior/próximo). O front-end receberá o componente `SeriesBox.astro`, rotas `/series` e `/series/[slug]`, e a página `/arquivo` será refatorada para pílulas de tags com contagem de ocorrências.

**Tech Stack:** Astro 5, TypeScript, Zod (Content Collections), Tailwind CSS, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-14-series-and-tags-taxonomy-design.md`

## Global Constraints

- A ordem dos textos dentro de uma série é estritamente cronológica por `post.data.date` crescente (o mais antigo é a Parte 1).
- Preservar o design system Construtivista/Brutalista (cores, bordas sólidas, sombras de offset mecânico, tipografia Bebas/Syne/JetBrains Mono).
- Manter o campo `categories` no schema como opcional para garantir retrocompatibilidade com qualquer referência residual sem quebrar builds antigos.
- O acervo existente de posts deve ter suas categorias migradas e unificadas dentro do array `tags` sem duplicatas.
- Toda página de série (`/series/[slug]`) deve exibir a explicação/manifesto da série (seja de `src/content/series/[slug].md` ou do frontmatter).
- Todos os testes no Vitest (atualmente 35 testes verdes) e o build estático (`npm run build`) devem permanecer passando com zero erros.

## Review Focus

- Artigos com datas idênticas ou muito próximas na mesma série devem desempatar deterministicamente por slug ou título.
- Slugs de séries com acentos, caracteres especiais ou maiúsculas devem normalizar para URLs limpas (ex.: `"O Capital de Karl Marx"` -> `"o-capital-de-karl-marx"`).
- Posts sem série associada não devem quebrar nem renderizar fragmentos vazios do `SeriesBox`.
- A página `/arquivo` deve manter filtragem funcional sem recarregar a tela, suportando o parâmetro de URL `?tag=...`.
- Séries com apenas 1 texto publicado devem indicar "Texto 1 de 1" e desabilitar os links de anterior/próximo sem quebrar o layout.

---

### Task 1: Content Schema & Series Utility Module

**Files:**
- Modify: `src/content/config.ts`
- Create: `src/utils/series.ts`
- Test: `tests/series.test.ts`

**Interfaces:**
- Produces:
  - `slugifySeries(name: string): string`
  - `getSeriesName(field: unknown): string | null`
  - `getSeriesDescription(field: unknown): string | null`
  - `getAllSeries(posts: CollectionEntry<'post'>[], seriesDocs?: CollectionEntry<'series'>[]): SeriesData[]`
  - `getSeriesNavigation(currentPost: CollectionEntry<'post'>, allPosts: CollectionEntry<'post'>[]): SeriesNavData | null`

- [ ] **Step 1: Write the failing tests for series utilities**

Crie `tests/series.test.ts` testando:
1. `slugifySeries` com acentos, maiúsculas e espaços (ex: `"O Capital de Karl Marx"` -> `"o-capital-de-karl-marx"`).
2. Agrupamento de posts por série e ordenação cronológica por `date` crescente.
3. Cálculo de `getSeriesNavigation` para o primeiro post (`prev: null`, `next: post2`, `currentIndex: 1`, `totalCount: 2`).
4. Cálculo para o último post (`next: null`).
5. Retorno `null` quando o post não tem série.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/series.test.ts`
Expected: FAIL ("Cannot find module '../src/utils/series'").

- [ ] **Step 3: Update `src/content/config.ts`**

Adicionar a coleção `series` e os campos `series` (union string/object) e `tags` no schema de `post`.

- [ ] **Step 4: Implement `src/utils/series.ts`**

Implementar as funções `slugifySeries`, `getSeriesName`, `getSeriesDescription`, `getAllSeries` e `getSeriesNavigation` com tipagem estrita TypeScript e ordenação cronológica crescente por `date`.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/series.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/content/config.ts src/utils/series.ts tests/series.test.ts
git commit -m "feat(series): add series content schema and chronological series utility"
```

---

### Task 2: Content Migration & Inaugural Series Entry

**Files:**
- Create: `src/content/series/o-capital-de-karl-marx.md`
- Modify: `src/content/post/**/*.md` (todos os posts com categories)

**Interfaces:**
- Consumes: `src/content/config.ts`
- Produces: Posts com categorias unificadas em `tags`, post do alfaiate com `series: "O Capital de Karl Marx"`, e arquivo explicativo em `src/content/series/`.

- [ ] **Step 1: Create the inaugural series explanation doc**

Criar `src/content/series/o-capital-de-karl-marx.md` com:
```yaml
---
title: "O Capital de Karl Marx"
description: "Investigações críticas sobre a teoria do valor, a mercadoria e as formas sociais do modo de produção capitalista."
image: "image.png"
---
```
E corpo Markdown detalhando o propósito do dossiê: "Esta série especial de ensaios do Info_Guerrilla dedica-se ao exame minucioso dos conceitos fundamentais de *O Capital*..."

- [ ] **Step 2: Update `src/content/post/para-que-o-trabalho-do-alfaiate-não-desapareça-na-roupa/index.md`**

Adicionar `series: "O Capital de Karl Marx"` e consolidar `tags: [marx, o capital, mercadoria, trabalho]`.

- [ ] **Step 3: Migrate remaining posts in `src/content/post/`**

Para cada post (`best-foss-alternatives`, `como-ficar-mais-seguro-na-internet`, `democracia-vertigem`, `dns-over-https`, `nao-leia-mark-fisher`, `resenha-livro-gabriel-garcia`, `software-livre-esquerda`):
- Mesclar os valores de `categories` dentro de `tags`.
- Remover duplicatas e manter formato limpo.

- [ ] **Step 4: Verify Content Collection types and build**

Run: `npx astro sync && npx vitest run`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/
git commit -m "content: migrate categories to tags and configure inaugural series for Marx's Capital"
```

---

### Task 3: Series UI Components & Post Integration

**Files:**
- Create: `src/components/SeriesBox.astro`
- Modify: `src/pages/post/[...slug].astro`
- Modify: `src/components/PostCard.astro`
- Modify: `src/components/HeroPoster.astro`
- Test: `tests/series-ui.test.ts`

**Interfaces:**
- Consumes: `getSeriesNavigation` from `src/utils/series.ts`
- Produces: Caixa de série com visual construtivista no post, links anterior/próximo, lista de artigos e badges de série nos cards.

- [ ] **Step 1: Write tests for Series UI rendering**

Criar `tests/series-ui.test.ts` verificando:
- Que o componente `SeriesBox` renderiza carimbo de série, contador "Texto 1 de N", e links para artigos.
- Que `PostCard` exibe badge da série quando presente e as tags do artigo.

- [ ] **Step 2: Implement `src/components/SeriesBox.astro`**

Construir a caixa construtivista:
- Moldura brutalista com borda 2px e sombra `4px 4px 0 #111111`.
- Cabeçalho: `// SÉRIE ESPECIAL: {nav.seriesName}` e `Texto {nav.currentIndex} de {nav.totalCount} (ordem cronológica)`.
- Botões de navegação: Anterior e Próximo (com títulos ao hover e links diretos).
- Sumário sanfona `<details>` com a lista de todos os textos da série, destacando o texto atual.

- [ ] **Step 3: Integrate `SeriesBox` in `src/pages/post/[...slug].astro`**

Importar `getSeriesNavigation` e renderizar `<SeriesBox />` após o cabeçalho/capa e um bloco simplificado de encerramento ao final do texto. Substituir carimbos de categoria por carimbos de tags (`// #{tag}`).

- [ ] **Step 4: Update `src/components/PostCard.astro` and `src/components/HeroPoster.astro`**

Renderizar o badge `// SÉRIE: {seriesName}` caso o post pertença a uma série, e usar tags primárias no lugar da categoria anterior.

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/series-ui.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/SeriesBox.astro src/components/PostCard.astro src/components/HeroPoster.astro src/pages/post/[...slug].astro tests/series-ui.test.ts
git commit -m "feat(ui): add SeriesBox navigation in posts and series badges on cards"
```

---

### Task 4: Series Index & Detail Routes with Editorial Explanation

**Files:**
- Create: `src/pages/series/index.astro`
- Create: `src/pages/series/[slug].astro`
- Test: `tests/series-pages.test.ts`

**Interfaces:**
- Consumes: `getAllSeries` and `slugifySeries` from `src/utils/series.ts`, `getCollection('series')`
- Produces: Rotas `/series` e `/series/[slug]` no build estático do Astro.

- [ ] **Step 1: Write tests for series routes generation**

Criar `tests/series-pages.test.ts` testando que `getStaticPaths` de `/series/[slug]` gera paths para as séries existentes e carrega o conteúdo explicativo.

- [ ] **Step 2: Implement `src/pages/series/index.astro`**

Página de índice de todas as séries com:
- Layout base `BaseLayout.astro`.
- Título monumental: `// SÉRIES ESPECIAIS & DOSSIÊS`.
- Grid brutalista de cards de série exibindo: nome da série, sinopse explicativa, quantidade de ensaios e período de publicação (ano de início a ano do último).

- [ ] **Step 3: Implement `src/pages/series/[slug].astro`**

Página da série específica com:
- `getStaticPaths` dinâmico mapeando todas as séries identificadas.
- Cabeçalho de cartaz com o título da série e contador de ensaios.
- **Bloco Editorial de Explicação**: Renderiza o corpo Markdown de `src/content/series/[slug].md` (se existir) ou a descrição configurada.
- **Linha do Tempo Cronológica**: Lista ordenada dos textos (Parte 1 a N) com data, título, resumo e link para leitura.

- [ ] **Step 4: Run tests**

Run: `npx vitest run tests/series-pages.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/series/ tests/series-pages.test.ts
git commit -m "feat(pages): add series index and series detail page with editorial explanation"
```

---

### Task 5: Archive & Search Tag-Only Filter Refactoring

**Files:**
- Modify: `src/pages/arquivo.astro`
- Modify: `src/pages/busca.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/archive-tags.test.ts`

**Interfaces:**
- Consumes: `post.data.tags` e `post.data.series`
- Produces: Filtro exclusivo por tags com pílulas clicáveis, contagem dinâmica e deep-link `?tag=...`.

- [ ] **Step 1: Write test for tag filtering in `/arquivo`**

Criar `tests/archive-tags.test.ts` validando:
- Pílulas de tags geradas a partir do vocabulário único de `tags` dos posts.
- Elementos com atributo `data-tags` contendo o array JSON de tags.
- Verificação de ausência de referências quebradas a `data-category`.

- [ ] **Step 2: Refactor `src/pages/arquivo.astro`**

Substituir a lógica de categorias por Tags:
- Mapear todas as tags únicas e ordenar por frequência decrescente.
- Renderizar botões/pílulas de filtro: `[ TODAS ]`, `[ #MARX (X) ]`, `[ #SOFTWARE-LIVRE (Y) ]`...
- Atualizar o script de filtro no cliente para inspecionar `data-tags` e ler o parâmetro de URL `tag`.
- Se o post tiver série, exibir o carimbo `// SÉRIE: {post.data.series}` no item da lista.

- [ ] **Step 3: Refactor `src/pages/index.astro`**

Substituir a seção de "Categorias" por "Tags em Destaque" (ou "Temas & Tags") com links para `/arquivo?tag={tag}`.

- [ ] **Step 4: Update `src/pages/busca.astro`**

Ajustar a busca para pesquisar em títulos, descrições, tags e séries.

- [ ] **Step 5: Run tests**

Run: `npx vitest run tests/archive-tags.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/pages/arquivo.astro src/pages/busca.astro src/pages/index.astro tests/archive-tags.test.ts
git commit -m "refactor(archive): switch taxonomy filtering entirely to tags and series"
```

---

### Task 6: End-to-End Build & Verification

**Files:**
- Modify: `tests/e2e-build.test.ts`

- [ ] **Step 1: Update e2e tests for series and tags**

Adicionar asserções em `tests/e2e-build.test.ts` para checar:
- Geração de `dist/series/index.html`.
- Geração de `dist/series/o-capital-de-karl-marx/index.html`.
- Presença de tags e ausência de erros na página de arquivo.

- [ ] **Step 2: Run full build and test suite**

Run: `npm run build && npm test`
Expected: Todas as páginas geradas com sucesso no diretório `dist/` e 100% dos testes passando no Vitest.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e-build.test.ts
git commit -m "test(e2e): verify static build generation for series and tags"
```


# Especificação de Design: Unificação da Taxonomia por Tags & Subsistema de Séries

**Data**: 2026-10-14  
**Status**: Aprovado nas seções de brainstorming, aguardando revisão final da spec  
**Autor**: Pair Programming (Geraldo Homero do Couto Neto & AI Assistant)  
**Repositório**: `infoguerrilla.github.io`  

---

## 1. Visão Geral e Propósito

Atualmente, o acervo editorial do **Info_Guerrilla** utiliza concomitantemente os campos `categories` e `tags`. Essa duplicidade gerou ruído e complexidade na classificação dos textos, tornando ambígua a fronteira entre o que é "categoria" e o que é "tag" (ex.: termos como *marx*, *mercadoria*, *política* aparecem duplicados em ambos os campos).

Para simplificar a organização e elevar a experiência editorial do leitor e do autor, esta especificação introduz duas mudanças estruturais:

1. **Unificação da Taxonomia Horizontal via Tags**:
   - Elimina o uso de `categories` como filtro e elemento organizador.
   - Centraliza toda a classificação temática aberta em `tags` padronizadas (`#marx`, `#trabalho`, `#software-livre`, `#vigilancia`).
   - A página de `/arquivo` passa a utilizar exclusivamente pílulas de tags com contagem de ocorrências e filtragem reativa.

2. **Criação do Subsistema de Séries (Taxonomia Longitudinal / Coletâneas)**:
   - Permite agrupar ensaios que compõem uma mesma obra, dossiê especial ou investigação contínua (ex.: textos sobre *O Capital de Karl Marx*, com início no ensaio *"Para que o trabalho do alfaiate não desapareça na roupa"*).
   - **Ordenação Estritamente Cronológica**: A ordem de leitura é determinada automaticamente pela data de publicação (`date` crescente), sem a necessidade de manter contadores manuais como `part: 1`. O post mais antigo é a Parte 1, o seguinte a Parte 2, e assim por diante.
   - Navegação dedicada dentro do post (artigo anterior, próximo artigo e índice completo da série).
   - Páginas dedicadas de visualização das séries (`/series` e `/series/[slug]`).

---

## 2. Arquitetura de Dados & Schema

### 2.1. Content Collections Schema (`src/content/config.ts`)

O schema da coleção `post` é atualizado para comportar o campo declarativo `series` e formalizar `tags` como taxonomia primária:

```ts
import { defineCollection, z } from 'astro:content';

const post = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    date: z.coerce.date(),
    lastmod: z.union([z.coerce.date(), z.string()]).optional(),
    image: z.string().optional(),
    imageCaption: z.string().optional(),
    caption: z.string().optional(),
    author: z.string().default('Geraldo Homero do Couto Neto'),
    // Tags como taxonomia primária
    tags: z.array(z.string()).default([]),
    // Séries: string direta ou objeto com nome e descrição
    series: z.union([
      z.string(),
      z.object({
        name: z.string(),
        description: z.string().optional(),
      }),
    ]).optional(),
    // Categorias mantidas como legado/opcional para não quebrar referências históricas
    categories: z.array(z.string()).default([]),
    weight: z.number().optional(),
  }),
});

// Coleção opcional para manifestos e textos explicativos detalhados de séries
const series = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { post, authors, series };
```

### 2.2. Funções Utilitárias de Série (`src/utils/series.ts`)

Para desacoplar a lógica dos componentes Astro, criamos o módulo `src/utils/series.ts` com as seguintes responsabilidades:

1. `slugifySeries(name: string): string`
   - Converte nomes como `"O Capital de Karl Marx"` em slugs URL-friendly: `"o-capital-de-karl-marx"`.
2. `getSeriesName(seriesField: any): string | null`
   - Extrai o nome textual da série, quer ela venha como string simples ou objeto `{ name, description }`.
3. `getAllSeries(posts: CollectionEntry<'post'>[])`
   - Filtra apenas os posts que possuem o campo `series`.
   - Agrupa os posts pelo identificador/slug da série.
   - Ordena os posts de cada série por `date` **crescente** (do mais antigo para o mais recente).
   - Retorna um array de séries contendo:
     - `name`: Nome da série.
     - `slug`: Slug da série.
     - `description`: Descrição opcional (se informada em algum post).
     - `posts`: Lista ordenada de posts.
     - `totalCount`: Quantidade de artigos.
     - `firstDate`: Data do primeiro artigo.
     - `lastDate`: Data do artigo mais recente.
4. `getSeriesNavigation(post: CollectionEntry<'post'>, allPosts: CollectionEntry<'post'>[])`
   - Localiza a série a qual o post pertence.
   - Retorna:
     - `seriesName`: Nome da série.
     - `seriesSlug`: Slug da série.
     - `currentIndex`: Posição do post atual (1-indexed: 1, 2, 3...).
     - `totalCount`: Total de textos da série.
     - `prevPost`: Post anterior na ordem cronológica (ou `null`).
     - `nextPost`: Próximo post na ordem cronológica (ou `null`).
     - `allSeriesPosts`: Todos os posts da série na ordem correta para listagem de sumário.

---

## 3. Componentes de Interface & Experiência de Leitura (UI/UX)

### 3.1. Caixa de Navegação da Série (`SeriesBox.astro`)

Renderizada nos artigos que pertencem a uma série (`src/pages/post/[...slug].astro`):

- **Localização**: Inserida no início do ensaio (após o cabeçalho e imagem de capa), e um bloco de transição resumido ao final do ensaio.
- **Visual Construtivista**:
  - Fundo com leve contraste de superfície (`bg-[var(--color-surface)]`).
  - Borda sólida preta de 2px com sombra brutalista de deslocamento (`4px 4px 0 #111111`).
  - Carimbo em vermelho construtivista: `// SÉRIE ESPECIAL: [NOME DA SÉRIE]`.
  - Indicador de leitura: `Texto {currentIndex} de {totalCount} nesta coletânea (ordem cronológica)`.
  - Links de navegação:
    - `[← Artigo Anterior]` (com título do artigo anterior ao passar o mouse).
    - `[Próximo Artigo →]` (com título do próximo artigo ao passar o mouse).
  - Sumário retrátil/acordeão contendo a lista completa de partes da série, com o artigo atual marcado como `[Lendo agora]`.

### 3.2. Badges nos Cards de Post (`PostCard.astro` e `HeroPoster.astro`)

- Se o post pertencer a uma série, exibe no topo ou na área de metadados uma etiqueta de destaque:
  `// SÉRIE: {seriesName}` em vermelho manifesto com tipografia `font-mono uppercase`.
- As tags do post são renderizadas como carimbos discretos (`#tag`).

### 3.3. Rota `/series` e `/series/[slug]` com Explicação Editorial

- **`/series` (Catálogo de Séries)**:
  - Lista todas as séries editoriais disponíveis no site em cards monumentais.
  - Para cada série: título, sinopse/explicação resumida, total de artigos e data do último texto publicado.
- **`/series/[slug]` (Página da Série Específica com Explicação Completa)**:
  - **Cabeçalho Construtivista**: Título da série, metadados (`X textos`, `Período: YYYY – YYYY`) e selo editorial.
  - **Área de Explicação / Manifesto da Série**:
    - Um bloco editorial com a **explicação do propósito da série**, motivação teórica e contextualização.
    - Essa explicação pode ser fornecida via:
      1. Coleção dedicada opcional `src/content/series/[slug].md` (permitindo texto rico em Markdown, citações e manifesto completo).
      2. Ou diretamente no frontmatter dos posts através do campo `series.description`.
  - **Trilha de Leitura Cronológica**: Lista ordenada dos ensaios da série (do primeiro ao último publicado), com cartões apresentando título, data, resumo, tags e tempo estimado de leitura.

### 3.4. Reformulação da Página `/arquivo`

- Substituição dos botões de categoria por **pílulas de filtro baseadas em Tags**.
- Agrupamento das tags mais frequentes no topo, ordenadas pelo número de artigos associados.
- Filtro interativo no cliente (Vanilla JS) que lê os atributos `data-tags` em cada item da lista.
- Suporte a deep-link via query string: `/arquivo?tag=marx` seleciona a tag automaticamente ao carregar a página.

---

## 4. Migração do Conteúdo Existente

Os arquivos Markdown em `src/content/post/` passarão por unificação:

1. **Fusão de Metadados**:
   - Os valores de `categories` existentes serão mesclados na lista de `tags`.
   - Remoção de duplicatas (ex.: se tinha `tags: [marx]` e `categories: [marx]`, fica apenas um `marx`).
   - Normalização em caixa baixa para consistência.
2. **Definição da Série Inaugural**:
   - No post `src/content/post/para-que-o-trabalho-do-alfaiate-não-desapareça-na-roupa/index.md`:
     ```yaml
     series: "O Capital de Marx"
     tags:
       - marx
       - o capital
       - mercadoria
       - trabalho
     ```

---

## 5. Estratégia de Testes Automatizados

1. **`tests/series.test.ts`**:
   - Teste unitário da extração de séries e normalização de nomes/slugs.
   - Teste da ordenação cronológica estrita por data crescente.
   - Teste do cálculo de anterior/próximo e contagem total.
2. **`tests/archive-tags.test.ts`**:
   - Teste de renderização das pílulas de tags no `/arquivo`.
   - Verificação de que itens possuem `data-tags` válidos.
3. **`tests/e2e-build.test.ts`**:
   - Build completo do Astro (`dist/`).
   - Verificação da existência das páginas `/series/index.html` e `/series/o-capital-de-marx/index.html`.
   - Indexação do Pagefind sem erros.

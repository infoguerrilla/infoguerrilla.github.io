# Especificação de Design: Info_Guerrilla Blog (Astro + Construtivismo/Brutalismo)

**Data**: 2026-10-12  
**Status**: Aprovado nas seções de brainstorming, aguardando revisão final  
**Autor**: Pair Programming (Geraldo Homero do Couto Neto & AI Assistant)  
**Repositório**: `infoguerrilla.github.io`  

---

## 1. Visão Geral e Propósito

O **Info_Guerrilla** é uma publicação digital editorial e acadêmica dedicada ao pensamento crítico, teoria política, tecnologia livre e soberania digital (com lema clássico: *"Para que o trabalho do alfaiate não desapareça na roupa"*).

Este documento especifica a reconstrução do site a partir da migração do Hugo para o **Astro**, criando um design system autoral que é um **amálgama entre Construtivismo e Brutalismo**:
- **Construtivismo**: Composições geométricas diagonais e assimétricas, cartazes monumentais, contrastes dramáticos em preto, papel kraft/jornal e vermelho revolucionário intenso.
- **Brutalismo**: Estrutura exposta com linhas de grid pretas sólidas, honestidade de materiais digitais, botões táteis com física mecânica de máquina de escrever/prensa, e ausência de ornamentos superficiais vazios.
- **Rigor Editorial e Acadêmico**: Enquanto a capa, navegação e cabeçalhos possuem alto impacto visual vanguardista, a área de leitura dos ensaios oferece conforto óptico e legibilidade impecável para textos longos e densos.
- **Profundidade 3D Sutil e Dinâmica Cinética**: Elementos táteis que reagem ao cursor do mouse (inclinação 3D sutil com perspectiva e relevo em camadas), botões com resistência física ao clique e faixas cinéticas suaves.

---

## 2. Pilha Tecnológica e Arquitetura de Software

* **Framework Base**: **Astro 5** (Modo SSG - Static Site Generation puro).
* **Camada de Estilização**: **Tailwind CSS** com extensão de tokens personalizados (cores semânticas, famílias tipográficas, sombras brutas escalonadas e utilitários de perspectiva).
* **Tipografia Externa**:
  * *Syne* / *Bebas Neue* (Títulos monumentais e logomarca).
  * *Newsreader* (Corpo dos ensaios acadêmicos, com suporte a itálico editorial e números estilizados).
  * *JetBrains Mono* (Metadados em máquina de escrever, datas, tags técnicas e blocos de código).
* **Interatividade e 3D**:
  * CSS 3D nativo (`perspective: 1000px`, `transform-style: preserve-3d`).
  * Script Vanilla JS ultraleve (< 2 KB) com interpolação linear (*lerp*) em `requestAnimationFrame` para controle suave de inclinação dos cards e camadas de parallax.
* **Navegação**: Astro **View Transitions** nativas (`<ClientRouter />`), garantindo transições instantâneas sem recarregamento completo da página.
* **Busca**: Indexação estática e busca em tempo real via **Pagefind**.
* **Gestão de Conteúdo**: Astro **Content Collections** (`astro:content`) com esquemas tipados via **Zod**.
* **Hospedagem & CI/CD**: GitHub Pages automatizado via GitHub Actions.

---

## 3. Design Tokens e Sistema Visual

### 3.1. Paleta de Cores e Modos Visuais

O site implementa alternância contínua entre **Modo Papel Construtivista** (padrão) e **Modo Noturno Tático**, persistida em `localStorage`:

| Token CSS | Modo Papel (Light) | Modo Noturno (Dark) | Aplicação |
| :--- | :--- | :--- | :--- |
| `--color-canvas` | `#F4EFEA` | `#111215` | Fundo geral da página |
| `--color-surface` | `#EBE4DC` | `#1A1C20` | Superfícies de cards, caixas e painéis |
| `--color-text` | `#111111` | `#F0EFEB` | Texto principal e títulos |
| `--color-muted` | `#524F4A` | `#9699A3` | Metadados, notas e legendas |
| `--color-red` | `#D82218` | `#FF3326` | Vermelho Manifesto (destaques, carimbos) |
| `--color-border` | `#111111` | `#2D3139` | Linhas de grid estruturais |
| `--shadow-offset` | `4px 4px 0 #111111` | `4px 4px 0 #000000` | Relevo mecânico brutalista |

### 3.2. Hierarquia Tipográfica

1. **Display / Monumental**:
   * `font-family: 'Syne', sans-serif; font-weight: 800;`
   * Utilizada em: Logotipo do site, títulos principais (`h1`, `h2` de cartaz), números grandes de seção e divisores de manifesto.
2. **Datilografia / Monospace**:
   * `font-family: 'JetBrains Mono', monospace;`
   * Utilizada em: Metadados (`[2026.10.12]`), tags de categorias `// POLÍTICA`, tempo estimado de leitura, paginação, régua de leitura e código-fonte.
3. **Editorial Acadêmico**:
   * `font-family: 'Newsreader', serif; font-weight: 400, 500;`
   * Utilizada em: Corpo dos ensaios e artigos (`p`), citações em bloco (`blockquote`), notas de rodapé (`footnotes`).
   * Parâmetros ópticos: `line-height: 1.8; font-size: 1.15rem; max-width: 68ch; text-rendering: optimizeLegibility;`.

### 3.3. Geometria Estrutural e Linhas Construtivistas

* **Bordas Rígidas**: `border-2` e `border-3` com cantos vivos (`rounded-none`).
* **Cortes Angulares**: Badges e etiquetas com cortes diagonais em 45 graus via `clip-path: polygon(...)`.
* **Grids Visíveis**: Linhas de delimitação contínuas dividindo cabeçalho, feed e rodapé como uma prancha de impressão técnica.

---

## 4. Dinâmica Cinética, Gestos e Profundidade 3D

### 4.1. Efeito 3D Tilt em Cards com Amortecimento (*Lerp*)
* O container possui `perspective: 1000px`.
* Ao mover o mouse sobre um card de ensaio (`PostCard`):
  * As coordenadas relativas do ponteiro determinam os ângulos alvo de rotação: `rotateX` (entre -6deg e +6deg) e `rotateY` (entre -6deg e +6deg).
  * O script aplica interpolação linear (`currentAngle += (targetAngle - currentAngle) * 0.1`) em um ciclo de animação leve, garantindo movimento elástico e contínuo.
  * O selo de categoria e a data interna possuem `transform: translateZ(16px)`, criando uma sensação física de camadas sobrepostas.
* Ao sair do card, a rotação retorna suavemente para `0deg`.
* Em dispositivos móveis ou com `prefers-reduced-motion: reduce`, o tilt é desativado por padrão.

### 4.2. Relevo Tátil de Prensa em Botões e Cliques
* **Estado Normal**: `box-shadow: 4px 4px 0px var(--color-border);`
* **Estado Hover**: Elevação sutil com borda vermelha projetada: `box-shadow: 6px 6px 0px var(--color-red);`
* **Estado Active (Clique)**: O botão desloca-se para a posição da sombra `transform: translate(4px, 4px);` com `box-shadow: 0 0 0;`. Esse feedback imediato simula o curso de uma tecla física ou carimbo.

### 4.3. Régua de Leitura Milimétrica
* Na lateral esquerda do ensaio, uma linha vertical milimétrica fixa com escala graduada indica a porcentagem de leitura em tempo real `[00%]` até `[100%]`.

### 4.4. Fita Cinética (Marquee Construtivista)
* Faixa contínua com a citação de Marx deslizando horizontalmente no cabeçalho ou rodapé.
* Pausa suave no hover (`animation-play-state: paused`) e resposta acelerada no scroll.

---

## 5. Rotas e Arquitetura de Componentes

### 5.1. Estrutura de Rotas

* **`/` (Capa / Manifesto Feed)**:
  * Cabeçalho de impacto com logotipo monumental e interruptor de tema.
  * Fita cinética com citação histórica.
  * *Hero Banner*: O ensaio mais recente ou em destaque diagramado como um cartaz construtivista.
  * *Grade de Ensaios*: Lista de posts com efeito 3D tilt sutil e metadados datilografados.
  * *Nuvem de Categorias*: Painel com atalhos temáticos (Política, Tecnologia, Filosofia, etc.).
* **`/post/[slug]` (Página do Artigo / Ensaio)**:
  * Cabeçalho com título, autor, data monospaçada, tags e tempo de leitura.
  * Sumário retrátil de tópicos (*Table of Contents*) para artigos longos.
  * Régua milimétrica de progresso na lateral.
  * Corpo editorial do texto formatado com serifas acadêmicas, citações destacadas e notas de rodapé.
  * Navegação para post anterior/próximo e licença CC BY-NC-SA 4.0.
* **`/arquivo` (Índice Histórico e Catálogo)**:
  * Tabela em formato de fichário classificado cronologicamente por ano/mês, com filtros dinâmicos por categoria e busca rápida.
* **`/sobre` (Sobre o Autor e o Projeto)**:
  * Apresentação editorial de Geraldo Homero do Couto Neto e as premissas do Info_Guerrilla.
* **`/busca` (Pesquisa em Tempo Real)**:
  * Interface direta com campo de busca terminal e resultados instantâneos via Pagefind.

### 5.2. Componentes Astro

* `src/layouts/BaseLayout.astro`: Layout base, tags SEO, meta Open Graph, carregamento de fontes, View Transitions e script de tema.
* `src/components/Header.astro`: Barra de navegação com linhas de grid expostas e botões táteis.
* `src/components/Footer.astro`: Rodapé com licença, links e créditos.
* `src/components/PostCard.astro`: Card do ensaio com física de perspectiva 3D e tags de carimbo.
* `src/components/HeroPoster.astro`: Destaque em formato de cartaz construtivista.
* `src/components/ReadingRuler.astro`: Régua milimétrica com progresso de leitura.
* `src/components/ThemeToggle.astro`: Interruptor físico de modo claro/escuro.
* `src/components/Marquee.astro`: Fita tipográfica cinética.
* `src/components/TableOfContents.astro`: Sumário expansível de cabeçalhos.

---

## 6. Pipeline de Conteúdo e Migração de Dados

### 6.1. Esquema de Coleção no Astro (`src/content/config.ts`)

O esquema Zod acomoda os posts existentes do Hugo sem necessidade de reescrever metadados:

```typescript
import { defineCollection, z } from 'astro:content';

const post = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    date: z.coerce.date(),
    lastmod: z.coerce.date().optional(),
    image: z.string().optional(),
    author: z.string().default('Geraldo Homero do Couto Neto'),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    weight: z.number().optional(),
  }),
});

export const collections = { post };
```

### 6.2. Preservação de Imagens e Ensaios
* Todos os ensaios existentes em `content/post/*` e suas imagens anexadas (`image.png`, `cover.jpg`, etc.) são mantidos integralmente.
* As rotas geradas preservam os slugs e links para compatibilidade com o histórico do site.

---

## 7. Integração Contínua e Deploy (GitHub Pages)

O arquivo `.github/workflows/deploy.yml` será atualizado para:
1. Executar no push para a branch `master`.
2. Configurar o ambiente Node.js 20.
3. Instalar dependências (`npm ci`).
4. Compilar o Astro estático (`npm run build`).
5. Gerar o índice Pagefind (`npx pagefind --site dist`).
6. Publicar a pasta `dist/` no branch `gh-pages` ou via ação oficial `actions/deploy-pages`.

---

## 8. Critérios de Aceite e Verificação

1. **Compilação sem Erros**: `npm run build` executa sem nenhum erro de tipo, sintaxe ou link quebrado.
2. **Preservação de Conteúdo**: 100% dos posts anteriores (incluindo *Software Livre e Esquerda*, *Não Leia Mark Fisher*, *Democracia da Vertigem*) são renderizados com títulos, imagens e metadados corretos.
3. **Fidelidade Visual e Estética**:
   * Identidade visual alinhada ao construtivismo e brutalismo com contraste em vermelho.
   * Leitura confortável no corpo do texto com a fonte *Newsreader*.
4. **Interatividade Tátil**:
   * Cards inclinam suavemente com o movimento do mouse na versão desktop.
   * Botões reagem fisicamente ao clique com transição de relevo.
5. **Responsividade**:
   * Layout adapta-se perfeitamente de 320px a 2560px de largura.
   * Em touchscreens, desativa o tilt e preserva a navegação limpa.
6. **Alternância de Tema**: O interruptor alterna instantaneamente entre Modo Papel e Modo Noturno e mantém o estado após recarregar.


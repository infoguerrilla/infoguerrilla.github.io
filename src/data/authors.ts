import { normalizeSlug } from '../utils/posts';

export interface Author {
  name: string;
  slug: string;
  role: string;
  avatar: string;
  bio: string;
  degrees: string[];
  researchTopics: string[];
  links: {
    orcid?: string;
    lattes?: string;
    researchGate?: string;
    github?: string;
    bluesky?: string;
    x?: string;
    linkedin?: string;
  };
}

export const authors: Author[] = [
  {
    name: "Geraldo Homero do Couto Neto",
    slug: "geraldo-homero-do-couto-neto",
    role: "Pesquisador, Historiador & Cientista Político",
    avatar: "https://avatars.githubusercontent.com/u/70844369?v=4",
    bio: "Doutorando em Ciência Política pela Unicamp, Mestre em História pela UFJF e Bacharelado e Licenciatura em História também pela UFJF. Possui também formação em Análise e Desenvolvimento de Software pela PUC Minas.",
    degrees: [
      "Doutorando em Ciência Política (Unicamp)",
      "Mestre em História (UFJF)",
      "Bacharel e Licenciado em História (UFJF)",
      "Análise e Desenvolvimento de Software (PUC Minas)"
    ],
    researchTopics: [
      "Direitas & Conservadorismo",
      "Movimentos Digitais & Redes",
      "Tecnologia & Política",
      "Estudos Críticos da Internet",
      "Humanidades Digitais & Plataformas"
    ],
    links: {
      orcid: "https://orcid.org/0000-0001-6686-7182",
      lattes: "http://lattes.cnpq.br/9924558848538635",
      researchGate: "https://www.researchgate.net/profile/Geraldo-Couto-Neto",
      github: "https://github.com/geraldohomero",
      bluesky: "https://bsky.app/profile/geraldohomero.bsky.social",
      x: "https://twitter.com/geraldohomero",
      linkedin: "https://www.linkedin.com/in/geraldohomero/"
    }
  }
];

export function getAuthorSlug(name: string): string {
  const author = authors.find(
    (a) => a.name.toLowerCase() === name.toLowerCase() || a.slug === normalizeSlug(name)
  );
  return author ? author.slug : normalizeSlug(name);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  const norm = normalizeSlug(slug);
  return authors.find((a) => a.slug === norm);
}

export function getAuthorByName(name: string): Author | undefined {
  return authors.find(
    (a) => a.name.toLowerCase() === name.toLowerCase() || a.slug === normalizeSlug(name)
  );
}

import { BlogPost } from '../types';

export interface BlogPostWithContent extends BlogPost {
  content: string;
}

interface MarkdownModule {
  attributes: {
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    author?: string;
  };
  html: string;
  markdown: string;
}

// Função para importar todos os artigos de um locale
async function importArticles(locale: string): Promise<BlogPostWithContent[]> {
  const articles: BlogPostWithContent[] = [];

  // Usando import.meta.glob para carregar todos os arquivos .md
  const modules = import.meta.glob<MarkdownModule>('./content/blog/**/*.md');

  for (const path in modules) {
    // Verificar se o arquivo pertence ao locale correto
    if (!path.includes(`/content/blog/${locale}/`)) {
      continue;
    }

    try {
      const module = await modules[path]();

      // Extrair o slug do caminho: /content/blog/pt/tokenizacao/index.md -> tokenizacao
      const slugMatch = path.match(/\/content\/blog\/[^/]+\/([^/]+)\//);
      const slug = slugMatch ? slugMatch[1] : '';

      articles.push({
        id: slug,
        title: module.attributes.title || '',
        date: module.attributes.date || '',
        excerpt: module.attributes.excerpt || '',
        tags: module.attributes.tags || [],
        content: module.markdown,
      });
    } catch (error) {
      console.error(`Error loading article from ${path}:`, error);
    }
  }

  // Ordenar por data (mais recente primeiro)
  return articles.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

// Função para carregar um artigo específico
export async function loadArticle(locale: string, slug: string): Promise<BlogPostWithContent | null> {
  try {
    // Tentar importar o arquivo específico
    const module = await import(`/content/blog/${locale}/${slug}/index.md`) as MarkdownModule;

    return {
      id: slug,
      title: module.attributes.title || '',
      date: module.attributes.date || '',
      excerpt: module.attributes.excerpt || '',
      tags: module.attributes.tags || [],
      content: module.markdown,
    };
  } catch (error) {
    console.error(`Error loading article ${slug} for locale ${locale}:`, error);
    return null;
  }
}

// Função para carregar todos os artigos de um locale
export async function loadArticles(locale: string): Promise<BlogPost[]> {
  const articles = await importArticles(locale);
  // Retornar sem o conteúdo completo para a listagem
  return articles.map(({ content, ...post }) => post);
}

// Função para obter a lista de artigos disponíveis (usado no build)
export function getAvailableArticles(locale: string): string[] {
  const modules = import.meta.glob('/content/blog/**/*.md');
  const slugs: string[] = [];

  for (const path in modules) {
    if (!path.includes(`/content/blog/${locale}/`)) {
      continue;
    }

    const slugMatch = path.match(/\/content\/blog\/[^/]+\/([^/]+)\//);
    if (slugMatch) {
      slugs.push(slugMatch[1]);
    }
  }

  return slugs;
}

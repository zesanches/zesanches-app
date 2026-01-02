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

async function importArticles(locale: string): Promise<BlogPostWithContent[]> {
  const articles: BlogPostWithContent[] = [];
  const modules = import.meta.glob<MarkdownModule>('/content/blog/**/*.md');

  for (const path in modules) {
    if (!path.includes(`/content/blog/${locale}/`)) {
      continue;
    }

    try {
      const module = await modules[path]();
      const slug = extractSlugFromPath(path);

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

  return sortArticlesByDateDescending(articles);
}

function extractSlugFromPath(path: string): string {
  const slugMatch = path.match(/\/content\/blog\/[^/]+\/([^/]+)\//);
  return slugMatch ? slugMatch[1] : '';
}

function sortArticlesByDateDescending(articles: BlogPostWithContent[]): BlogPostWithContent[] {
  return articles.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

export async function loadArticle(locale: string, slug: string): Promise<BlogPostWithContent | null> {
  try {
    const modules = import.meta.glob<MarkdownModule>('/content/blog/**/*.md');
    const targetPath = `/content/blog/${locale}/${slug}/index.md`;

    if (modules[targetPath]) {
      const module = await modules[targetPath]();

      return {
        id: slug,
        title: module.attributes.title || '',
        date: module.attributes.date || '',
        excerpt: module.attributes.excerpt || '',
        tags: module.attributes.tags || [],
        content: module.markdown,
      };
    }

    console.error(`Article not found: ${targetPath}`);
    return null;
  } catch (error) {
    console.error(`Error loading article ${slug} for locale ${locale}:`, error);
    return null;
  }
}

export async function loadArticles(locale: string): Promise<BlogPost[]> {
  const articles = await importArticles(locale);
  return articles.map(({ content, ...post }) => post);
}

export function getAvailableArticles(locale: string): string[] {
  const modules = import.meta.glob('./content/blog/**/*.md');
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

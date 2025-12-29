import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag } from '@phosphor-icons/react';
import FadeWrapper from '../components/FadeWrapper';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { useAppContext } from '../contexts/AppContext';
import { loadArticle, BlogPostWithContent } from '../utils/blogLoader';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { language } = useAppContext();
  const [article, setArticle] = useState<BlogPostWithContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const loadedArticle = await loadArticle(language, slug);
        setArticle(loadedArticle);
      } catch (error) {
        console.error('Error loading article:', error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug, language]);

  if (!article) {
    return (
      <FadeWrapper>
        <div className="space-y-6">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">{language === "pt" ? "Voltar ao blog" : "Back to blog"}</span>
          </button>

          <div className="text-center py-16">
            <h1 className="font-serif text-3xl text-primary mb-4">Artigo não encontrado</h1>
            <p className="text-secondary">O artigo que você procura não existe.</p>
          </div>
        </div>
      </FadeWrapper>
    );
  }

  if (loading) {
    return (
      <FadeWrapper>
        <div className="space-y-6">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">{language === "pt" ? "Voltar ao blog" : "Back to blog"}</span>
          </button>

          <div className="text-center py-16">
            <p className="text-secondary">Carregando artigo...</p>
          </div>
        </div>
      </FadeWrapper>
    );
  }

  return (
    <FadeWrapper>
      <article className="space-y-8">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">{language === "pt" ? "Voltar ao blog" : "Back to blog"}</span>
        </button>

        <header className="space-y-4 pb-8 border-b border-accent">
          <h1 className="font-serif text-3xl md:text-4xl text-primary leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <time className="font-mono">{article.date}</time>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={16} />
              {article.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs uppercase tracking-wider bg-surface-hover px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="text-lg text-secondary font-light leading-relaxed mb-8 italic border-l-4 border-accent pl-4">
            {article.excerpt}
          </div>

          <div className="space-y-6 article-content">
            <MarkdownRenderer content={article.content} />
          </div>
        </div>
      </article>
    </FadeWrapper>
  );
};

export default ArticleDetail;

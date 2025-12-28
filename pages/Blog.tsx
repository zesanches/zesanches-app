import React from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import FadeWrapper from '../components/FadeWrapper';
import { useAppContext } from '../contexts/AppContext';

const Blog: React.FC = () => {
  const { content } = useAppContext();
  const { headers, posts } = content;

  return (
    <FadeWrapper>
      <div className="space-y-12">
        <header className="mb-10">
          <h1 className="font-serif text-3xl text-primary mb-2">{headers.writing}</h1>
          <p className="text-secondary font-light text-lg">
            {headers.writingSub}
          </p>
        </header>

        <div className="grid gap-10">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="group cursor-pointer border-b border-accent pb-10 last:border-0 hover:bg-surface-hover md:hover:bg-transparent transition-colors -mx-4 px-4 md:px-0 md:mx-0 rounded-lg"
            >
              <div className="flex flex-col md:flex-row gap-2 md:items-baseline md:justify-between mb-2">
                <h2 className="text-xl font-serif font-medium text-primary group-hover:text-secondary transition-colors">
                  {post.title}
                </h2>
                <time className="text-sm font-mono text-secondary opacity-50 shrink-0">
                  {post.date}
                </time>
              </div>
              
              <p className="text-secondary font-light leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs uppercase tracking-wider text-secondary opacity-50 bg-surface-hover px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  {headers.readArticle} <ArrowRight className="ml-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </FadeWrapper>
  );
};

export default Blog;
import React from 'react';
import { Books as BooksIcon, ArrowRight } from '@phosphor-icons/react';
import FadeWrapper from '../components/FadeWrapper';
import { useAppContext } from '../contexts/AppContext';
import { getProxiedImageUrl } from '../utils/imageProxy';

const Books: React.FC = () => {
  const { content, language } = useAppContext();
  const { headers, books } = content;

  return (
    <FadeWrapper>
      <div className="space-y-12">
        <header className="mb-10">
          <h1 className="font-serif text-3xl text-primary mb-2 flex items-center gap-3">
            {headers.books}
          </h1>
          <p className="text-secondary font-light text-lg">
            {headers.booksSub}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {books.map((book, idx) => {
            const amazonUrl = language === 'pt' ? (book.amazonUrlBR || book.amazonUrl) : (book.amazonUrlUS || book.amazonUrl);
            const proxiedImageUrl = book.coverUrl ? getProxiedImageUrl(book.coverUrl, 200, 80) : null;

            return (
              <div key={idx} className="flex flex-col sm:flex-row gap-4 group">
                {/* Cover Placeholder - Minimalist */}
                {amazonUrl ? (
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-24 h-36 bg-surface-hover shrink-0 rounded-sm overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500 cursor-pointer"
                  >
                    {/* Fallback pattern if image fails or just as style */}
                    <div className="absolute inset-0 flex items-center justify-center text-secondary opacity-20">
                      <BooksIcon size={32} />
                    </div>
                    {proxiedImageUrl && (
                      <img src={proxiedImageUrl} alt={book.title} className="w-full h-full object-cover relative z-10" />
                    )}
                  </a>
                ) : (
                  <div className="w-full sm:w-24 h-36 bg-surface-hover shrink-0 rounded-sm overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                    {/* Fallback pattern if image fails or just as style */}
                    <div className="absolute inset-0 flex items-center justify-center text-secondary opacity-20">
                      <BooksIcon size={32} />
                    </div>
                    {proxiedImageUrl && (
                      <img src={proxiedImageUrl} alt={book.title} className="w-full h-full object-cover relative z-10" />
                    )}
                  </div>
                )}

                <div className="flex flex-col">
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif font-medium text-lg text-primary leading-tight">
                      {book.title}
                    </h3>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${(book.status === 'Lido' || book.status === 'Read')
                      ? 'border-accent text-secondary'
                      : 'border-primary text-primary'
                      }`}>
                      {book.status}
                    </span>
                  </div>

                  <p className="text-sm text-secondary opacity-60 font-mono mb-3 mt-1">
                    {book.author}
                  </p>

                  {book.thoughts && (
                    <div className="relative pl-3 border-l-2 border-accent mt-auto">
                      <p className="text-sm text-secondary italic font-light leading-relaxed">
                        "{book.thoughts}"
                      </p>
                    </div>
                  )}

                  {amazonUrl && (
                    <a
                      href={amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:text-primary transition-colors mt-2 font-mono flex items-center gap-1"
                    >
                      {language === "pt" ? "Ver na Amazon" : "View on Amazon"} <ArrowRight size={12} weight="bold" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </FadeWrapper>
  );
};

export default Books;

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        // Customizar componentes de heading
        h1: ({ children }) => (
          <h1 className="font-serif text-3xl md:text-4xl text-primary mb-6 mt-8 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="font-serif text-2xl md:text-3xl text-primary mb-4 mt-8 border-l-4 border-accent pl-4">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-serif text-xl md:text-2xl text-primary mb-3 mt-6">
            {children}
          </h3>
        ),

        // Customizar parágrafos
        p: ({ children }) => (
          <p className="text-primary leading-relaxed mb-4">
            {children}
          </p>
        ),

        // Customizar listas
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-2 mb-4 text-primary ml-4">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-2 mb-4 text-primary ml-4">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">
            {children}
          </li>
        ),

        // Customizar code blocks
        code: ({ className, children }) => {
          const isInline = !className;

          if (isInline) {
            return (
              <code className="bg-surface-hover text-primary px-2 py-1 rounded font-mono text-sm">
                {children}
              </code>
            );
          }

          return (
            <code className={`${className} block bg-[#282c34] text-[#abb2bf] p-4 rounded-lg overflow-x-auto font-mono text-sm`}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="mb-4 overflow-x-auto">
            {children}
          </pre>
        ),

        // Customizar blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-accent bg-surface-hover pl-4 py-2 my-4 italic text-secondary">
            {children}
          </blockquote>
        ),

        // Customizar tabelas
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-accent">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-surface-hover">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="border border-accent px-4 py-3 text-left text-primary font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-accent px-4 py-3 text-primary">
            {children}
          </td>
        ),

        // Customizar links
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-secondary hover:text-primary underline transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),

        // Customizar hr
        hr: () => (
          <hr className="border-t border-accent my-8" />
        ),

        // Customizar strong
        strong: ({ children }) => (
          <strong className="font-semibold text-primary">
            {children}
          </strong>
        ),

        // Customizar em
        em: ({ children }) => (
          <em className="italic text-secondary">
            {children}
          </em>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;

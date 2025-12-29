/// <reference types="vite/client" />

declare module '*.md' {
  const attributes: {
    title: string;
    date: string;
    excerpt: string;
    tags: string[];
    author?: string;
    [key: string]: any;
  };
  const html: string;
  const markdown: string;

  export { attributes, html, markdown };
}

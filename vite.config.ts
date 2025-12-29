import path from 'path';
import { defineConfig, } from 'vite';
import react from '@vitejs/plugin-react';
import { plugin as markdown, Mode } from 'vite-plugin-markdown';

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      markdown({ mode: [Mode.MARKDOWN] })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});

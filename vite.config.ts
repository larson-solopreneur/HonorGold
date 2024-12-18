import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: './client',  // クライアントディレクトリをルートとして設定
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@db': path.resolve(__dirname, './db')
    },
  },
});
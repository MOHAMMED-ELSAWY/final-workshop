import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/اسم-الـ-repository-هنا/', // مثال: '/my-project/'
  plugins: [
    react(),
    tailwindcss(),
  ],
});
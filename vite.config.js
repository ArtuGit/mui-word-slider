import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const base = mode === 'production' ? '/mui-word-slider/' : '/';

  return {
    plugins: [react()],
    base,
  };
});

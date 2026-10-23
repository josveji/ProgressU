import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base debe coincidir con el nombre del repositorio (distingue mayúsculas).
export default defineConfig({ base: '/ProgressU/', plugins: [react(), tailwindcss()] });

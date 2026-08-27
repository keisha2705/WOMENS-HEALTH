import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3001 } // Keeps your frontend on 3001 so it never hits backend port 3000
});

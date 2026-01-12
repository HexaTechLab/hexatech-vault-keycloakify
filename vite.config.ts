import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { keycloakify } from 'keycloakify/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      accountThemeImplementation: 'none',
      themeName: 'hexatech-vault',
      extraThemeProperties: [
        'termsUrl=https://hexatechvault.com/terms',
        'privacyUrl=https://hexatechvault.com/privacy',
      ],
    }),
  ],
});

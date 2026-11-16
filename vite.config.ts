import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { keycloakify } from 'keycloakify/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    keycloakify({
      accountThemeImplementation: 'none',
      themeName: 'hexatech-vault',
      // Ligne affichée sous « Se connecter » quand l'inscription est fermée (ex. bêta privée).
      // Valeur lue dans l'environnement du conteneur Keycloak ; vide par défaut = aucune ligne.
      environmentVariables: [{ name: 'CRYPTARC_LOGIN_NOTICE', default: '' }],
      extraThemeProperties: [
        'termsUrl=https://app.cryptarc.fr/legal/terms',
        'privacyUrl=https://app.cryptarc.fr/legal/privacy',
      ],
    }),
  ],
});

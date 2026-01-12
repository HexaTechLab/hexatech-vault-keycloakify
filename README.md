# HexaTechVault Keycloak Theme

> Thème personnalisé Keycloak construit avec Keycloakify pour HexaTechVault

[![Keycloakify](https://img.shields.io/badge/Keycloakify-11.3.5-blue)](https://www.keycloakify.dev/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6)](https://www.typescriptlang.org/)
[![Keycloak](https://img.shields.io/badge/Keycloak-22--25-red)](https://www.keycloak.org/)

## 🎨 Aperçu

Ce repository contient le thème Keycloak personnalisé pour HexaTechVault, développé avec React, TypeScript et Keycloakify.

**Fonctionnalités :**
- ✅ Pages de connexion (Login, Register, Logout, Error)
- ✅ Support SSO (FranceConnect, Google, Microsoft, Facebook)
- ✅ Design tokens HexaTechVault (couleur primaire cyan)
- ✅ Accessibilité WCAG 2.1 AA
- ✅ Responsive design
- ✅ Internationalisation (français par défaut)
- ✅ Compatible Keycloak 22-25 (testé sur 24.0)

## 📦 Installation

### Prérequis

- Node.js 20+
- npm ou yarn

### Installation des dépendances

```bash
npm install
```

## 🚀 Développement

### Mode développement avec hot-reload

```bash
npm run dev
```

Le serveur de développement démarre sur http://localhost:5173

### Build du thème

```bash
npm run build-keycloak-theme
```

Le thème JAR est généré dans `dist_keycloak/` (~2.2 MB)

## 📂 Structure du projet

```
hexatech-vault-keycloakify/
├── src/
│   ├── login/                    # Pages de connexion
│   │   ├── pages/                # Login, Register, Logout, Error
│   │   ├── components/           # Composants réutilisables
│   │   ├── KcPage.tsx            # Router
│   │   └── i18n.ts               # Traductions
│   ├── shared/
│   │   ├── assets/logo.svg       # Logo HexaTechVault
│   │   └── tokens.css            # Design tokens
│   └── main.tsx                  # Point d'entrée
├── docs/                         # Documentation
├── scripts/                      # Scripts de déploiement
└── package.json
```

## 📚 Documentation

- **[Deployment Guide](docs/deployment.md)** - Guide complet de déploiement
- **[Kubernetes Deployment](docs/kubernetes-deployment.md)** - Déploiement K8s
- **[Publishing Guide](docs/publishing.md)** - Publication GitHub Packages
- **[Development Guide](docs/development.md)** - Guide de développement

## 🤝 Contribution

1. Fork le repository
2. Créer une branche feature
3. Commit avec [Conventional Commits](https://www.conventionalcommits.org/)
4. Push et créer une Pull Request

## 📄 Licence

MIT © HexaTechVault

---

Fait avec ❤️ par l'équipe HexaTechVault

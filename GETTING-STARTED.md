# Getting Started

Bienvenue dans le projet **HexaTechVault Keycloak Theme** !

## 📋 Quick Start (3 minutes)

### 1. Installation

```bash
npm install
```

### 2. Développement local

```bash
npm run dev
```

Ouvrir http://localhost:5173

### 3. Build du thème JAR

```bash
npm run build-keycloak-theme
```

Le JAR est généré dans `dist_keycloak/keycloak-theme-for-kc-22-to-25.jar` (~2.2 MB)

## 🎨 Personnalisation

### Changer les couleurs

Éditer `src/shared/tokens.css` :

```css
:root {
  --primary-500: rgb(2, 132, 199);   /* Couleur primaire (cyan) */
  --accent-500: #24A47F;             /* Accent (vert) */
  --danger-500: #E23D28;             /* Danger (rouge) */
}
```

### Ajouter une nouvelle page

1. Créer `src/login/pages/MaPage.tsx`
2. Ajouter le lazy import dans `src/login/KcPage.tsx`
3. Ajouter le case dans le switch

## 🚀 Déploiement

### Docker Compose (local)

```bash
# Build
npm run build-keycloak-theme

# Télécharger ou copier le JAR dans Keycloak
cp dist_keycloak/keycloak-theme-for-kc-22-to-25.jar \
   /path/to/keycloak/providers/hexatech-vault-theme.jar

# Redémarrer
docker-compose restart keycloak
```

### Kubernetes

Voir la documentation complète : **[docs/kubernetes-deployment.md](docs/kubernetes-deployment.md)**

#### Option A : ConfigMap (simple)

```bash
./scripts/create-configmap.sh infrastructure
kubectl rollout restart deployment/keycloak -n infrastructure
```

#### Option B : Image Docker

```bash
docker build -t myregistry/keycloak-theme:v1.0.0 -f Dockerfile.keycloak .
docker push myregistry/keycloak-theme:v1.0.0
```

Puis dans vos Helm values :
```yaml
image:
  repository: myregistry/keycloak-theme
  tag: v1.0.0
```

## 📦 Publication GitHub

```bash
# S'authentifier
gh auth login

# Publier une release
./scripts/publish-github.sh v1.0.0 "Initial release"
```

Voir : **[docs/publishing.md](docs/publishing.md)**

## 🧪 Tests

```bash
# Lint
npm run lint

# Preview du build
npm run preview
```

## 📚 Documentation

- **[README.md](README.md)** - Vue d'ensemble
- **[docs/kubernetes-deployment.md](docs/kubernetes-deployment.md)** - Guide K8s complet
- **[docs/publishing.md](docs/publishing.md)** - Publication GitHub Packages
- **[Keycloakify Docs](https://docs.keycloakify.dev)** - Documentation officielle

## 🤝 Contribution

1. Fork le repo
2. Créer une branche : `git checkout -b feature/ma-feature`
3. Commit : `git commit -m "feat: ma nouvelle fonctionnalité"`
4. Push : `git push origin feature/ma-feature`
5. Créer une Pull Request

## ❓ Problèmes courants

### Le thème n'apparaît pas dans Keycloak

Vérifier que :
1. Le JAR est bien dans `/opt/keycloak/providers/`
2. Keycloak a redémarré après l'ajout du JAR
3. Les logs Keycloak ne montrent pas d'erreur : `kubectl logs -l app=keycloak`

### Erreur de build npm

```bash
rm -rf node_modules package-lock.json
npm install
```

### Le thème s'affiche mal

Vider le cache du navigateur (Ctrl+Shift+R) ou tester en navigation privée.

## 🔗 Liens utiles

- **Repository** : https://github.com/hexatechlab/hexatech-vault-keycloakify
- **Issues** : https://github.com/hexatechlab/hexatech-vault-keycloakify/issues
- **Keycloak** : https://www.keycloak.org/
- **Keycloakify** : https://www.keycloakify.dev/

---

Besoin d'aide ? Ouvrez une [issue](https://github.com/hexatechlab/hexatech-vault-keycloakify/issues) !

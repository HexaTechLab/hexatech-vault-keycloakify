# Publication du Thème Keycloak sur GitHub

Ce guide explique comment publier le thème HexaTechVault sur GitHub Packages et GitHub Releases.

## 📦 Formats de publication disponibles

### 1. **GitHub Releases** (JAR uniquement)
- ✅ Simple et direct
- ✅ Téléchargement facile avec curl/wget
- ✅ Versionning sémantique
- ✅ Compatible avec tous les environnements

### 2. **GitHub Container Registry (GHCR)** (Image Docker)
- ✅ Image Docker complète avec Keycloak + thème
- ✅ Idéal pour Kubernetes
- ✅ Multi-architecture (amd64, arm64)
- ✅ Cache automatique

## 🚀 Publication Manuelle (GitHub CLI)

### Prérequis

1. **Installer GitHub CLI**
   ```bash
   # Ubuntu/Debian
   sudo apt install gh

   # macOS
   brew install gh

   # Arch Linux
   sudo pacman -S github-cli
   ```

2. **S'authentifier**
   ```bash
   gh auth login
   # Suivre les instructions interactives
   ```

### Publication d'une release

```bash
cd /home/user/hexatechlab/hexatech-vault-infra/infra/keycloak

# Construire le thème
cd theme-keycloakify
npm install
npm run build-keycloak-theme
cd ..

# Publier sur GitHub
./publish-to-github.sh v1.0.0 "Initial release with cyan theme"
```

Le script va :
1. ✅ Vérifier que le JAR existe
2. ✅ Créer un changelog automatique
3. ✅ Copier le JAR avec le nom versionné
4. ✅ Créer la release GitHub
5. ✅ Attacher le JAR à la release

### Télécharger depuis une release

```bash
# Dernière release
curl -L -o hexatech-vault-theme.jar \
  https://github.com/hexatechlab/hexatech-vault-infra/releases/latest/download/hexatech-vault-theme-v1.0.0.jar

# Version spécifique
VERSION="v1.0.0"
curl -L -o hexatech-vault-theme.jar \
  https://github.com/hexatechlab/hexatech-vault-infra/releases/download/${VERSION}/hexatech-vault-theme-${VERSION}.jar
```

## 🤖 Publication Automatique (CI/CD)

### Configuration GitHub Actions

Le workflow `.github/workflows/build-keycloak-theme.yml` est déjà configuré et se déclenche sur :

- **Push vers main/develop** : Build et test uniquement
- **Pull Request** : Build et test uniquement
- **Creation de Release** : Build, test, et publication du JAR + Docker image
- **Workflow dispatch** : Déclenchement manuel

### Créer une release automatique

#### Option 1 : Via l'interface GitHub

1. Aller sur https://github.com/hexatechlab/hexatech-vault-infra/releases/new
2. Cliquer sur "Choose a tag" → Créer un nouveau tag (ex: `v1.0.0`)
3. Titre : `Keycloak Theme v1.0.0`
4. Description : Notes de release
5. Cliquer sur "Publish release"

GitHub Actions va automatiquement :
- Builder le thème
- Créer l'image Docker
- Attacher le JAR à la release

#### Option 2 : Via GitHub CLI

```bash
# Créer la release (déclenche GitHub Actions)
gh release create v1.0.0 \
  --repo hexatechlab/hexatech-vault-infra \
  --title "Keycloak Theme v1.0.0" \
  --notes "Initial release with cyan theme" \
  --generate-notes

# Le workflow GitHub Actions va automatiquement :
# 1. Builder le thème
# 2. Builder l'image Docker
# 3. Attacher les artifacts
```

### Vérifier le workflow

```bash
# Lister les runs
gh run list --repo hexatechlab/hexatech-vault-infra --workflow "Build and Publish Keycloak Theme"

# Voir les logs d'un run
gh run view <run-id> --log

# Voir le statut en temps réel
gh run watch
```

## 🐳 GitHub Container Registry (GHCR)

### Configuration des permissions

1. **Aller sur** : https://github.com/hexatechlab/hexatech-vault-infra/settings/actions
2. **Section "Workflow permissions"**
3. Cocher ✅ **"Read and write permissions"**
4. Cocher ✅ **"Allow GitHub Actions to create and approve pull requests"**

### Pull de l'image Docker

```bash
# Se connecter à GHCR (une seule fois)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull de l'image
docker pull ghcr.io/hexatechlab/hexatech-vault-infra/keycloak-theme:latest

# Version spécifique
docker pull ghcr.io/hexatechlab/hexatech-vault-infra/keycloak-theme:v1.0.0
```

### Utilisation dans Kubernetes

```yaml
# kubernetes/infrastructure/values/prod/keycloak-values.yaml
image:
  repository: ghcr.io/hexatechlab/hexatech-vault-infra/keycloak-theme
  tag: v1.0.0
  pullPolicy: IfNotPresent

# Si repo privé, ajouter un imagePullSecret
imagePullSecrets:
  - name: ghcr-credentials
```

### Créer un imagePullSecret pour GHCR

```bash
# Créer un Personal Access Token (PAT) sur GitHub avec scope 'read:packages'
# https://github.com/settings/tokens/new

# Créer le secret Kubernetes
kubectl create secret docker-registry ghcr-credentials \
  --docker-server=ghcr.io \
  --docker-username=<GITHUB_USERNAME> \
  --docker-password=<GITHUB_PAT> \
  --docker-email=<EMAIL> \
  --namespace=infrastructure
```

## 📊 Versioning Sémantique

Utilisez le versioning sémantique (SemVer) : `vMAJOR.MINOR.PATCH`

- **MAJOR** : Changements incompatibles (breaking changes)
- **MINOR** : Nouvelles fonctionnalités (backward-compatible)
- **PATCH** : Corrections de bugs

Exemples :
- `v1.0.0` - Release initiale
- `v1.1.0` - Ajout de nouvelles pages (register, logout)
- `v1.1.1` - Fix du bug de déconnexion
- `v2.0.0` - Refonte complète du thème (breaking)

## 🔄 Workflow de release recommandé

### Pour une nouvelle fonctionnalité

```bash
# 1. Créer une branche feature
git checkout -b feature/add-password-reset-page

# 2. Développer et tester localement
cd infra/keycloak/theme-keycloakify
npm run dev

# 3. Commit et push
git add .
git commit -m "feat(theme): add password reset page"
git push origin feature/add-password-reset-page

# 4. Créer une Pull Request
gh pr create --title "Add password reset page" --body "..."

# 5. Après merge vers main, créer une release
git checkout main
git pull
gh release create v1.2.0 \
  --title "Keycloak Theme v1.2.0" \
  --notes "Added password reset page"
```

### Pour un hotfix

```bash
# 1. Créer une branche hotfix
git checkout -b hotfix/fix-logout-button

# 2. Fix rapide
# ... modifications ...

# 3. Commit et push
git add .
git commit -m "fix(theme): correct logout button behavior"
git push origin hotfix/fix-logout-button

# 4. Merge rapide vers main
gh pr create --title "Fix logout button" --body "..." --label "hotfix"
# Après merge

# 5. Release patch
gh release create v1.1.2 \
  --title "Keycloak Theme v1.1.2" \
  --notes "Fixed logout button behavior"
```

## 🧪 Test avant publication

Avant de créer une release, testez toujours :

```bash
# 1. Build local
npm run build-keycloak-theme

# 2. Test avec Docker Compose
./install-theme.sh
docker compose restart keycloak

# 3. Vérifier les pages
# - Login : http://localhost:8080/realms/hexatech-vault/account
# - Register : ...
# - Logout : ...

# 4. Vérifier les logs
docker compose logs keycloak | grep -i theme

# 5. Si tout est OK, publier
./publish-to-github.sh v1.x.x
```

## 📚 Ressources

- **GitHub CLI** : https://cli.github.com/
- **GitHub Packages** : https://docs.github.com/packages
- **GHCR** : https://docs.github.com/packages/working-with-a-github-packages-registry/working-with-the-container-registry
- **Semantic Versioning** : https://semver.org/

## 🆘 Troubleshooting

### Erreur "gh: command not found"

```bash
# Installer GitHub CLI
sudo apt install gh  # Ubuntu/Debian
brew install gh       # macOS
```

### Erreur d'authentification GHCR

```bash
# Vérifier le token
gh auth status

# Se reconnecter
gh auth login

# Pour Docker
gh auth token | docker login ghcr.io -u USERNAME --password-stdin
```

### Le workflow GitHub Actions échoue

```bash
# Voir les logs
gh run view --log

# Vérifier les permissions
# Settings > Actions > Workflow permissions > Read and write permissions
```

### L'image Docker n'est pas publique

1. Aller sur https://github.com/orgs/hexatechlab/packages
2. Trouver `keycloak-theme`
3. **Package settings** > **Change visibility** > **Public**

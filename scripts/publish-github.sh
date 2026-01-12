#!/bin/bash
set -e

# Script pour publier le thème Keycloak sur GitHub Releases
# Usage: ./scripts/publish-github.sh <version> [release-notes]

VERSION="${1}"
RELEASE_NOTES="${2:-Release of Keycloak HexaTechVault theme}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(dirname "$SCRIPT_DIR")"
JAR_FILE="${THEME_DIR}/dist_keycloak/keycloak-theme-for-kc-22-to-25.jar"
REPO="hexatechlab/hexatech-vault-keycloakify"

echo "========================================="
echo "Publication GitHub Release"
echo "========================================="

# Validation
if [ -z "$VERSION" ]; then
  echo "❌ Erreur: Version requise"
  echo "Usage: $0 <version> [release-notes]"
  echo "Exemple: $0 v1.0.0"
  exit 1
fi

# Vérifier gh CLI
if ! command -v gh &> /dev/null; then
  echo "❌ Erreur: GitHub CLI (gh) n'est pas installé"
  echo "Installation: sudo apt install gh"
  exit 1
fi

# Vérifier auth
if ! gh auth status &> /dev/null; then
  echo "❌ Erreur: Non authentifié avec GitHub CLI"
  echo "Exécutez: gh auth login"
  exit 1
fi

echo "✅ GitHub CLI authentifié"
echo "📦 Version: $VERSION"
echo ""

# Vérifier le JAR
if [ ! -f "$JAR_FILE" ]; then
  echo "❌ Erreur: JAR non trouvé: $JAR_FILE"
  echo "Build d'abord: npm run build-keycloak-theme"
  exit 1
fi

JAR_SIZE=$(du -h "$JAR_FILE" | cut -f1)
echo "📊 Taille: $JAR_SIZE"

# Copier avec version
VERSIONED_JAR="${THEME_DIR}/hexatech-vault-theme-${VERSION}.jar"
cp "$JAR_FILE" "$VERSIONED_JAR"

# Créer release
echo ""
read -p "Créer la release $VERSION ? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Annulé"
  rm "$VERSIONED_JAR"
  exit 0
fi

echo "📤 Création de la release..."
gh release create "$VERSION" \
  --repo "$REPO" \
  --title "Keycloak Theme $VERSION" \
  --notes "$RELEASE_NOTES" \
  "$VERSIONED_JAR"

echo ""
echo "✅ Release publiée!"
gh release view "$VERSION" --repo "$REPO" --web

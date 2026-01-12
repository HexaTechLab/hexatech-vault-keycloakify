#!/bin/bash
set -e

# Script pour construire l'image Docker Keycloak + Thème
# Usage: ./scripts/build-docker.sh [tag] [registry]

TAG="${1:-latest}"
REGISTRY="${2:-ghcr.io/hexatechlab/hexatech-vault-keycloakify}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(dirname "$SCRIPT_DIR")"

echo "========================================="
echo "Build Docker Keycloak + Theme"
echo "========================================="
echo "Image: ${REGISTRY}:${TAG}"
echo ""

# Build l'image
echo "📦 Construction de l'image (multi-stage)..."
docker build \
  --tag "${REGISTRY}:${TAG}" \
  --tag "${REGISTRY}:latest" \
  --file "${THEME_DIR}/Dockerfile.keycloak" \
  "${THEME_DIR}"

echo ""
echo "✅ Image construite avec succès!"

# Afficher la taille
IMAGE_SIZE=$(docker images "${REGISTRY}:${TAG}" --format "{{.Size}}")
echo "📊 Taille: ${IMAGE_SIZE}"

# Vérifier le JAR
echo ""
echo "🔍 Vérification du JAR dans l'image..."
docker run --rm --entrypoint ls "${REGISTRY}:${TAG}" -lh /opt/keycloak/providers/ | grep hexatech

echo ""
echo "========================================="
echo "Build terminé!"
echo "========================================="
echo ""
echo "Pour tester localement:"
echo "  docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin \\"
echo "    ${REGISTRY}:${TAG} start-dev"
echo ""
echo "Pour push vers le registry:"
echo "  docker push ${REGISTRY}:${TAG}"
echo ""

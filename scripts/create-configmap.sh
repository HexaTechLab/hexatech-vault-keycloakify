#!/bin/bash
set -e

# Script pour créer un ConfigMap Kubernetes avec le thème Keycloak
# Usage: ./scripts/create-configmap.sh [namespace]

NAMESPACE="${1:-infrastructure}"
CONFIGMAP_NAME="keycloak-theme-hexatech"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_DIR="$(dirname "$SCRIPT_DIR")"
JAR_FILE="${THEME_DIR}/dist_keycloak/keycloak-theme-for-kc-22-to-25.jar"

echo "========================================="
echo "Création du ConfigMap Keycloak Theme"
echo "========================================="
echo "Namespace: ${NAMESPACE}"
echo "ConfigMap: ${CONFIGMAP_NAME}"
echo ""

# 1. Vérifier que le JAR existe
if [ ! -f "$JAR_FILE" ]; then
  echo "❌ Erreur: JAR non trouvé: $JAR_FILE"
  echo "   Veuillez d'abord construire le thème:"
  echo "   npm run build-keycloak-theme"
  exit 1
fi

# Afficher la taille du JAR
JAR_SIZE=$(du -h "$JAR_FILE" | cut -f1)
echo "📦 JAR trouvé: $JAR_SIZE"

# 2. Vérifier que kubectl est disponible
if ! command -v kubectl &> /dev/null; then
  echo "❌ Erreur: kubectl n'est pas installé"
  exit 1
fi

# 3. Vérifier la connexion au cluster
echo "🔍 Vérification de la connexion au cluster..."
if ! kubectl cluster-info &> /dev/null; then
  echo "❌ Erreur: Impossible de se connecter au cluster Kubernetes"
  echo "   Vérifiez votre kubeconfig"
  exit 1
fi

CURRENT_CONTEXT=$(kubectl config current-context)
echo "✅ Connecté au cluster: $CURRENT_CONTEXT"

# 4. Créer le namespace s'il n'existe pas
if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
  echo "📁 Création du namespace $NAMESPACE..."
  kubectl create namespace "$NAMESPACE"
fi

# 5. Supprimer l'ancien ConfigMap s'il existe
if kubectl get configmap "$CONFIGMAP_NAME" -n "$NAMESPACE" &> /dev/null; then
  echo "🗑️  Suppression de l'ancien ConfigMap..."
  kubectl delete configmap "$CONFIGMAP_NAME" -n "$NAMESPACE"
fi

# 6. Créer le nouveau ConfigMap avec le JAR
echo "📤 Création du ConfigMap avec le thème..."
kubectl create configmap "$CONFIGMAP_NAME" \
  --from-file=hexatech-vault-theme.jar="$JAR_FILE" \
  --namespace="$NAMESPACE"

# 7. Labelliser le ConfigMap
kubectl label configmap "$CONFIGMAP_NAME" \
  -n "$NAMESPACE" \
  app.kubernetes.io/name=keycloak \
  app.kubernetes.io/component=theme \
  app.kubernetes.io/part-of=hexatech-vault-infrastructure \
  --overwrite

echo "✅ ConfigMap créé avec succès!"

# 8. Afficher les informations du ConfigMap
echo ""
echo "📊 Informations du ConfigMap:"
kubectl describe configmap "$CONFIGMAP_NAME" -n "$NAMESPACE" | head -20

echo ""
echo "========================================="
echo "Prochaines étapes:"
echo "========================================="
echo "1. Ajouter le volume mount dans vos Helm values Keycloak"
echo "2. Redéployer Keycloak: kubectl rollout restart deployment/keycloak -n ${NAMESPACE}"
echo ""
echo "Voir docs/kubernetes-deployment.md pour plus de détails"
echo ""

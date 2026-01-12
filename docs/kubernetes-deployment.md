# Déploiement du Thème Keycloak sur Kubernetes

Ce guide explique comment déployer le thème HexaTechVault personnalisé sur Keycloak dans Kubernetes.

## 🎯 Approches disponibles

### **Option 1 : ConfigMap** (Recommandé pour dev/staging)
- ✅ Pas besoin de registry Docker
- ✅ Mise à jour rapide du thème
- ✅ Simplicité de déploiement
- ⚠️ Limite de taille : 1 MB (ConfigMap) - OK pour notre JAR de 2.2 MB avec Binary Data
- ⚠️ Nécessite un redémarrage du pod Keycloak

### **Option 2 : Image Docker personnalisée** (Recommandé pour production)
- ✅ Thème intégré à l'image
- ✅ Immuabilité et versioning
- ✅ Pas de dépendance externe au runtime
- ⚠️ Nécessite un registry Docker
- ⚠️ Rebuild de l'image à chaque modification du thème

## 📦 Option 1 : Déploiement avec ConfigMap

### Étape 1 : Construire le thème

```bash
cd /home/user/hexatechlab/hexatech-vault-infra/infra/keycloak/theme-keycloakify
npm install
npm run build-keycloak-theme
```

Vérifier que le JAR est généré :
```bash
ls -lh dist_keycloak/keycloak-theme-for-kc-22-to-25.jar
# Devrait afficher ~2.2M
```

### Étape 2 : Créer le ConfigMap Kubernetes

```bash
cd /home/user/hexatechlab/hexatech-vault-infra
./infra/keycloak/create-theme-configmap.sh infrastructure
```

Ce script :
- Crée un ConfigMap `keycloak-theme-hexatech` dans le namespace `infrastructure`
- Encode le JAR en base64 automatiquement
- Labellise le ConfigMap correctement

Vérifier le ConfigMap :
```bash
kubectl get configmap keycloak-theme-hexatech -n infrastructure
kubectl describe configmap keycloak-theme-hexatech -n infrastructure
```

### Étape 3 : Mettre à jour les Helm values

**Fichier :** `kubernetes/infrastructure/values/dev/keycloak-values.yaml` (ou prod/staging)

Ajouter à la fin du fichier :

```yaml
# Mount du thème HexaTechVault
extraVolumes: |
  - name: theme-volume
    configMap:
      name: keycloak-theme-hexatech
      defaultMode: 0644

extraVolumeMounts: |
  - name: theme-volume
    mountPath: /opt/keycloak/providers/hexatech-vault-theme.jar
    subPath: hexatech-vault-theme.jar
    readOnly: true
```

**Alternative :** Utiliser le fichier de values pré-configuré :
```bash
# Merger avec les values existantes
helm upgrade keycloak codecentric/keycloak \
  -n infrastructure \
  -f values/common/keycloak-values.yaml \
  -f values/common/keycloak-theme-volume.yaml \
  -f values/dev/keycloak-values.yaml
```

### Étape 4 : Déployer avec Helm

```bash
# Upgrade du release Keycloak
helm upgrade keycloak codecentric/keycloak \
  --namespace infrastructure \
  --values kubernetes/infrastructure/values/common/keycloak-values.yaml \
  --values kubernetes/infrastructure/values/dev/keycloak-values.yaml \
  --wait

# Ou avec ArgoCD (si GitOps activé)
git add kubernetes/infrastructure/values/dev/keycloak-values.yaml
git commit -m "feat(keycloak): add HexaTechVault theme via ConfigMap"
git push
# ArgoCD sync automatiquement
```

### Étape 5 : Vérifier le déploiement

```bash
# Vérifier que le pod redémarre
kubectl get pods -n infrastructure -l app.kubernetes.io/name=keycloak -w

# Vérifier les logs pour le chargement du thème
kubectl logs -n infrastructure -l app.kubernetes.io/name=keycloak | grep -i theme

# Vérifier que le JAR est monté
kubectl exec -n infrastructure deployment/keycloak -- ls -lh /opt/keycloak/providers/
# Devrait afficher hexatech-vault-theme.jar
```

### Étape 6 : Activer le thème dans Keycloak

1. Accéder à l'Admin Console : `https://auth.votredomaine.com/admin`
2. Se connecter avec les credentials admin
3. Sélectionner le realm `hexatech-vault`
4. Aller dans **Realm Settings** > **Themes**
5. Sélectionner **Login theme** : `hexatech-vault`
6. **Save**

### Mise à jour du thème

Quand vous modifiez le thème :

```bash
# 1. Rebuild le thème
cd infra/keycloak/theme-keycloakify
npm run build-keycloak-theme

# 2. Recréer le ConfigMap
cd ../../..
./infra/keycloak/create-theme-configmap.sh infrastructure

# 3. Redémarrer les pods Keycloak
kubectl rollout restart deployment/keycloak -n infrastructure
kubectl rollout status deployment/keycloak -n infrastructure
```

## 🐳 Option 2 : Déploiement avec Image Docker

### Étape 1 : Build de l'image

```bash
cd /home/user/hexatechlab/hexatech-vault-infra/infra/keycloak
./build-and-push.sh v1.0.0
```

Variables d'environnement :
```bash
# Registry local (Kind, Minikube)
export DOCKER_REGISTRY=localhost:5000

# Harbor privé
export DOCKER_REGISTRY=registry.hexatechvault.com

# GitHub Container Registry
export DOCKER_REGISTRY=ghcr.io/hexatechlab
```

### Étape 2 : Push vers le registry

Le script `build-and-push.sh` vous demandera confirmation pour push.

Ou manuellement :
```bash
docker push localhost:5000/hexatech-vault-keycloak:v1.0.0
```

### Étape 3 : Mettre à jour les Helm values

**Fichier :** `kubernetes/infrastructure/values/dev/keycloak-values.yaml`

```yaml
image:
  repository: localhost:5000/hexatech-vault-keycloak
  tag: v1.0.0
  pullPolicy: Always

# Si registry privé, ajouter :
# imagePullSecrets:
#   - name: harbor-registry-credentials
```

### Étape 4 : Déployer

```bash
helm upgrade keycloak codecentric/keycloak \
  --namespace infrastructure \
  --values kubernetes/infrastructure/values/common/keycloak-values.yaml \
  --values kubernetes/infrastructure/values/dev/keycloak-values.yaml \
  --wait
```

## 🔍 Troubleshooting

### Le thème n'apparaît pas dans la liste

**Symptôme :** Le thème `hexatech-vault` n'est pas disponible dans Realm Settings > Themes

**Solutions :**
1. Vérifier que le JAR est bien monté dans le pod :
   ```bash
   kubectl exec -n infrastructure deployment/keycloak -- ls -l /opt/keycloak/providers/
   ```

2. Vérifier les logs Keycloak pour les erreurs :
   ```bash
   kubectl logs -n infrastructure -l app.kubernetes.io/name=keycloak --tail=200
   ```

3. Vérifier que le ConfigMap existe et contient des données :
   ```bash
   kubectl get configmap keycloak-theme-hexatech -n infrastructure -o yaml | grep -A2 binaryData
   ```

4. Redémarrer le pod Keycloak :
   ```bash
   kubectl rollout restart deployment/keycloak -n infrastructure
   ```

### ConfigMap trop volumineux

**Symptôme :** `error: ConfigMap "keycloak-theme-hexatech" is invalid: data: Too long`

**Solution :** Utiliser l'approche Image Docker (Option 2) ou un PersistentVolume

### Le pod Keycloak ne démarre pas

**Symptôme :** Pod en `CrashLoopBackOff` ou `Error`

**Solutions :**
1. Vérifier les events du pod :
   ```bash
   kubectl describe pod -n infrastructure -l app.kubernetes.io/name=keycloak
   ```

2. Vérifier les permissions du fichier JAR monté :
   ```bash
   kubectl exec -n infrastructure deployment/keycloak -- ls -la /opt/keycloak/providers/
   ```

3. Vérifier que le subPath est correct dans extraVolumeMounts

### Le thème ne se met pas à jour

**Symptôme :** Après mise à jour du ConfigMap, le thème reste inchangé

**Cause :** Kubernetes ne recharge pas automatiquement les fichiers montés depuis un ConfigMap quand le ConfigMap est mis à jour

**Solution :** Forcer un redémarrage du pod :
```bash
kubectl rollout restart deployment/keycloak -n infrastructure
```

## 📚 Références

- Chart Helm Keycloak : https://github.com/codecentric/helm-charts/tree/master/charts/keycloak
- Keycloakify : https://docs.keycloakify.dev
- Keycloak Themes : https://www.keycloak.org/docs/latest/server_development/#_themes
- ConfigMaps Binary Data : https://kubernetes.io/docs/concepts/configuration/configmap/#configmaps-and-pods

## 🔐 Bonnes pratiques

1. **Versioning :** Tagger les versions du thème (v1.0.0, v1.1.0, etc.)
2. **GitOps :** Commiter les values Helm et utiliser ArgoCD pour déployer
3. **CI/CD :** Automatiser le build du thème et la création du ConfigMap
4. **Production :** Utiliser l'approche Image Docker pour l'immuabilité
5. **Dev/Staging :** Utiliser ConfigMap pour itération rapide

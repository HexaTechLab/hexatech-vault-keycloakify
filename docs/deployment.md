# Déploiement du thème Keycloak

Ce guide couvre le déploiement local (Docker Compose) et la mise à jour du thème.
Pour Kubernetes, voir [kubernetes-deployment.md](kubernetes-deployment.md).

## Prérequis

- Node.js 20+
- Docker + Docker Compose
- Keycloak 24 (image `quay.io/keycloak/keycloak:24.0`)

---

## Architecture de déploiement

Le thème Keycloakify se compile en deux JARs :

| Fichier | Cible |
|---|---|
| `keycloak-theme-for-kc-22-to-25.jar` | Keycloak 22, 23, 24, 25 ✅ |
| `keycloak-theme-for-kc-all-other-versions.jar` | Versions hors de cette plage |

**Pour Keycloak 24 : utiliser exclusivement `keycloak-theme-for-kc-22-to-25.jar`.**
Ne jamais déposer les deux JARs simultanément dans le même répertoire providers — voir [Piège 2](#piège-2--deux-jars-en-même-temps) ci-dessous.

---

## Workflow de déploiement local

### 1. Construire le thème

```bash
# Dans hexatech-vault-keycloakify/
npm run build-keycloak-theme
```

Les JARs sont générés dans `dist_keycloak/`.

### 2. Copier le JAR dans l'infra

```bash
cp dist_keycloak/keycloak-theme-for-kc-22-to-25.jar \
   ../hexatech-vault-infra/infra/keycloak/themes/
```

> Copier **uniquement** `keycloak-theme-for-kc-22-to-25.jar`.

### 3. Rebuilder et relancer l'image Docker

```bash
cd ../hexatech-vault-infra
docker compose build keycloak
docker compose up -d keycloak
```

Le JAR est **embarqué dans l'image** lors du `build` via le Dockerfile — voir [Pourquoi pas un volume ?](#pourquoi-le-jar-est-embarqué-dans-limage).

### 4. Activer le thème dans le realm Keycloak

Après le premier déploiement, le thème doit être activé manuellement :

1. Ouvrir `http://localhost:8080` → connexion admin
2. Sélectionner le realm `hexatech-vault`
3. **Realm settings → Themes → Login theme** → `hexatech-vault`
4. **Save**

---

## Pourquoi le JAR est embarqué dans l'image

Le JAR est copié dans l'image Docker via le Dockerfile (`infra/keycloak/Dockerfile`) plutôt que monté via un volume. Ce choix est intentionnel.

### Le problème du volume bind-mount

Quand le JAR est monté via un volume (`-v ./themes:/opt/keycloak/providers`), la JVM Keycloak ouvre le fichier au démarrage et garde le file descriptor ouvert tout au long de la session. Si le JAR est remplacé sur le disque hôte sans redémarrer le container, la JVM continue de lire depuis les anciens offsets — qui ne correspondent plus au nouveau fichier.

Symptôme typique dans les logs :

```
java.util.zip.ZipException: ZipFile invalid LOC header (bad signature)
  at java.util.zip.ZipFile$ZipFileInputStream.initDataOffset
  at freemarker.template.Template.<init>
  at org.keycloak.theme.freemarker.DefaultFreeMarkerProvider.processTemplate
```

Cette erreur ne touche pas forcément toutes les pages de la même façon : les pages dont les entrées ZIP ont des offsets proches de ceux du JAR précédent peuvent fonctionner, pendant que d'autres (comme `logout-confirm.ftl`) échouent.

### La solution : JAR dans l'image

En embarquant le JAR dans l'image pendant le `docker compose build`, on élimine complètement la race condition. La JVM lit le JAR depuis le filesystem interne du container, stable pour toute la durée de vie du container.

```dockerfile
# infra/keycloak/Dockerfile
FROM quay.io/keycloak/keycloak:24.0 AS builder
COPY themes/keycloak-theme-for-kc-22-to-25.jar /opt/keycloak/providers/
RUN /opt/keycloak/bin/kc.sh build --http-relative-path=/auth

FROM quay.io/keycloak/keycloak:24.0
COPY --from=builder /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
```

---

## Pièges à éviter

### Piège 1 — Remplacer le JAR sans rebuilder l'image

**Symptôme :** `ZipFile invalid LOC header` sur certaines pages, thème qui fonctionne partiellement.

**Cause :** le container tourne avec l'ancien JAR en mémoire.

**Solution :**
```bash
# Toujours rebuilder après avoir copié un nouveau JAR
docker compose build keycloak && docker compose up -d keycloak
```

### Piège 2 — Deux JARs en même temps

**Symptôme :** `ZipFile invalid LOC header` systématique à la déconnexion, login fonctionnel.

**Cause :** les deux JARs Keycloakify ont 195 entrées identiques avec des offsets différents. Le ClassLoader Java charge les deux JARs et peut croiser leurs Central Directories, lisant le Local File Header d'un JAR à l'offset trouvé dans l'autre.

Exemple mesuré :

| Fichier | Offset de `logout-confirm.ftl` |
|---|---|
| `keycloak-theme-for-kc-22-to-25.jar` | 2 204 550 |
| `keycloak-theme-for-kc-all-other-versions.jar` | 2 201 540 |

**Solution :** ne conserver que `keycloak-theme-for-kc-22-to-25.jar` pour Keycloak 24.

### Piège 3 — Volume monté dans `/opt/keycloak/themes` au lieu de `/opt/keycloak/providers`

**Symptôme :** thème non trouvé, Keycloak affiche le thème par défaut.

**Cause :** `/opt/keycloak/themes` est pour les thèmes statiques FTL classiques. Les JARs Keycloakify sont des providers Java et doivent être dans `/opt/keycloak/providers`.

### Piège 4 — Thème non activé dans le realm

**Symptôme :** thème déployé correctement, Keycloak affiche toujours le thème `keycloak` par défaut.

**Solution :** activer le thème `hexatech-vault` dans les settings du realm (voir [Étape 4](#4-activer-le-thème-dans-le-realm-keycloak)).

---

## Vérification du déploiement

```bash
# 1. Vérifier que l'image a bien été buildée avec le JAR
docker run --rm --entrypoint ls hexatech-keycloak:local /opt/keycloak/providers/

# 2. Vérifier les logs de démarrage Keycloak
docker logs hexatech-keycloak 2>&1 | grep -i "hexatech-vault\|theme\|provider"

# 3. Tester les pages
curl -si http://localhost:8080/realms/hexatech-vault/protocol/openid-connect/auth \
     --data-urlencode "client_id=security-admin-console" | grep -i "hexatech\|CryptArc"
```

---

## Mise à jour du thème

Processus complet pour une mise à jour :

```bash
# 1. Modifier les sources dans hexatech-vault-keycloakify/src/
# 2. Tester localement
npm run dev

# 3. Builder le JAR
npm run build-keycloak-theme

# 4. Copier dans l'infra (un seul JAR !)
cp dist_keycloak/keycloak-theme-for-kc-22-to-25.jar \
   ../hexatech-vault-infra/infra/keycloak/themes/

# 5. Rebuilder l'image et relancer
cd ../hexatech-vault-infra
docker compose build keycloak
docker compose up -d keycloak

# 6. Vérifier les logs
docker logs hexatech-keycloak --tail 30
```

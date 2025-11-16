#!/usr/bin/env bash
# deploy.sh — Déploiement rapide du site Arktopia vers GitHub Pages
# Utilisation :
#   ./deploy.sh "message de commit"
#   ./deploy.sh              # message auto avec date/heure

set -euo pipefail

# Aller dans le dossier du script (au cas où tu lances depuis ailleurs)
cd "$(dirname "$0")"

echo "🔎 Vérification du dépôt Git..."
git status

# Vérifie que la remote 'origin' existe
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "❌ Aucune remote 'origin' trouvée."
  echo "➡️  Ajoute-la avec :"
  echo "    git remote add origin https://github.com/LRios1805/Arktopia.git"
  exit 1
fi

# Branche par défaut (change 'main' si ton dépôt utilise 'master')
BRANCH="main"

echo ""
echo "⬇️  Récupération des dernières modifications distantes (${BRANCH})..."
git pull --rebase origin "${BRANCH}" || echo "ℹ️  Impossible de rebase (pas grave si tu es seul sur le dépôt)."

# Ajoute tous les fichiers modifiés / nouveaux / supprimés
echo ""
echo "➕ Ajout des fichiers modifiés..."
git add .

# Message de commit : argument ou message auto avec date/heure
if [ $# -gt 0 ]; then
  COMMIT_MSG="$*"
else
  COMMIT_MSG="🚀 Déploiement Arktopia - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Crée le commit seulement s'il y a des changements
if git diff --cached --quiet; then
  echo "ℹ️  Aucun changement à committer. Rien à déployer."
else
  echo "📝 Commit : ${COMMIT_MSG}"
  git commit -m "${COMMIT_MSG}"
fi

echo ""
echo "☁️  Envoi vers GitHub (${BRANCH})..."
git push origin "${BRANCH}"

echo ""
echo "✅ Déploiement terminé !"
echo "🌍 Site en ligne / mis à jour : https://lrios1805.github.io/Arktopia/"

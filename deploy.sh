#!/usr/bin/env bash
# deploy.sh — Déploiement rapide vers GitHub Pages
# Auteur : Lucas (Arktopia)



set -e

# Aller dans le dossier du script
cd "$(dirname "$0")"

echo "🔎 Vérification du dépôt..."
git status

# Vérifie que la remote 'origin' existe
if ! git remote -v | grep -q "origin"; then
  echo "❌ Aucune remote 'origin' trouvée."
  echo "➡️  Ajoute-la avec : git remote add origin https://github.com/LRios1805/Arktopia.git"
  exit 1
fi

# Tire les dernières modifications pour éviter les conflits
echo "⬇️  Récupération des dernières modifications..."
git pull --rebase origin main || true

# Ajoute tous les fichiers modifiés
echo "➕ Ajout des fichiers..."
git add .

# Message de commit automatique si non fourni
msg="$*"
if [ -z "$msg" ]; then
  msg="🚀 Déploiement automatique - $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo "📝 Commit : $msg"
git commit -m "$msg" || echo "ℹ️  Aucun changement à committer."

# Push vers GitHub
echo "☁️  Envoi vers GitHub Pages..."
git push origin main

echo "✅ Déploiement terminé !"
echo "🌍 Ton site sera bientôt en ligne sur : https://lrios1805.github.io/Arktopia/"

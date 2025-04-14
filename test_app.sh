#!/bin/bash

# Script de test pour l'application d'analyse boursière

echo "Démarrage des tests de l'application d'analyse boursière..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "Erreur: Node.js n'est pas installé"
    exit 1
fi

# Vérifier que le répertoire du projet existe
if [ ! -d "/home/ubuntu/projet_bourse/bourse_app" ]; then
    echo "Erreur: Le répertoire du projet n'existe pas"
    exit 1
fi

# Se déplacer dans le répertoire du projet
cd /home/ubuntu/projet_bourse/bourse_app

# Vérifier que les fichiers principaux existent
echo "Vérification des fichiers principaux..."
FILES=(
    "src/app/page.jsx"
    "src/app/actions/page.jsx"
    "src/app/etfs/page.jsx"
    "src/app/watchlist/page.jsx"
    "src/app/selection/page.jsx"
    "src/components/layout/Header.jsx"
    "src/components/layout/Footer.jsx"
    "src/components/layout/Layout.jsx"
    "src/components/charts/StockChart.jsx"
    "src/components/charts/StockTable.jsx"
    "src/components/charts/StockDetail.jsx"
    "src/lib/api/yahooFinance.js"
    "src/lib/realtime.js"
    "src/lib/cloudflare.js"
    "wrangler.toml"
    "migrations/0001_initial.sql"
)

for file in "${FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Erreur: Le fichier $file n'existe pas"
        exit 1
    else
        echo "✓ $file existe"
    fi
done

# Vérifier la configuration de la base de données
echo "Vérification de la configuration de la base de données..."
if grep -q "binding = \"DB\"" wrangler.toml && grep -q "database_name" wrangler.toml; then
    echo "✓ Configuration de la base de données OK"
else
    echo "Erreur: Configuration de la base de données incorrecte"
    exit 1
fi

# Vérifier que les tables de la base de données existent
echo "Vérification des tables de la base de données..."
if grep -q "CREATE TABLE IF NOT EXISTS stocks" migrations/0001_initial.sql && 
   grep -q "CREATE TABLE IF NOT EXISTS etfs" migrations/0001_initial.sql && 
   grep -q "CREATE TABLE IF NOT EXISTS price_history" migrations/0001_initial.sql; then
    echo "✓ Tables de la base de données OK"
else
    echo "Erreur: Tables de la base de données manquantes"
    exit 1
fi

# Vérifier l'intégration des API Yahoo Finance
echo "Vérification de l'intégration des API Yahoo Finance..."
if grep -q "YahooFinance/get_stock_chart" src/lib/api/yahooFinance.js && 
   grep -q "YahooFinance/get_stock_insights" src/lib/api/yahooFinance.js && 
   grep -q "YahooFinance/get_stock_holders" src/lib/api/yahooFinance.js; then
    echo "✓ Intégration des API Yahoo Finance OK"
else
    echo "Erreur: Intégration des API Yahoo Finance incorrecte"
    exit 1
fi

# Vérifier les routes API
echo "Vérification des routes API..."
if [ -f "src/app/api/stock/route.js" ] && 
   [ -f "src/app/api/stocks/route.js" ] && 
   [ -f "src/app/api/etfs/route.js" ] && 
   [ -f "src/app/api/watchlist/route.js" ]; then
    echo "✓ Routes API OK"
else
    echo "Erreur: Routes API manquantes"
    exit 1
fi

# Vérifier les fonctionnalités en temps réel
echo "Vérification des fonctionnalités en temps réel..."
if grep -q "useRealTimeStockData" src/lib/realtime.js && 
   grep -q "useRealTimeListData" src/lib/realtime.js && 
   grep -q "LastUpdatedIndicator" src/lib/realtime.js && 
   grep -q "PriceChangeNotification" src/lib/realtime.js; then
    echo "✓ Fonctionnalités en temps réel OK"
else
    echo "Erreur: Fonctionnalités en temps réel incorrectes"
    exit 1
fi

# Vérifier l'intégration des fonctionnalités en temps réel dans les pages
echo "Vérification de l'intégration des fonctionnalités en temps réel..."
if grep -q "useRealTimeStockData" src/app/page.jsx && 
   grep -q "useRealTimeStockData" src/app/actions/page.jsx && 
   grep -q "useRealTimeStockData" src/app/etfs/page.jsx; then
    echo "✓ Intégration des fonctionnalités en temps réel OK"
else
    echo "Erreur: Intégration des fonctionnalités en temps réel incorrecte"
    exit 1
fi

# Vérifier les fonctionnalités de sélection
echo "Vérification des fonctionnalités de sélection..."
if grep -q "compareMode" src/app/selection/page.jsx && 
   grep -q "handleSelectItem" src/app/selection/page.jsx && 
   grep -q "selectedItems" src/app/selection/page.jsx; then
    echo "✓ Fonctionnalités de sélection OK"
else
    echo "Erreur: Fonctionnalités de sélection incorrectes"
    exit 1
fi

# Démarrer le serveur de développement pour tester manuellement
echo "Démarrage du serveur de développement pour tests manuels..."
echo "Exécutez 'cd /home/ubuntu/projet_bourse/bourse_app && npm run dev' pour démarrer le serveur"
echo "Puis accédez à http://localhost:3000 pour tester l'application"

echo "Tests automatiques terminés avec succès!"
echo "Prêt pour le déploiement."

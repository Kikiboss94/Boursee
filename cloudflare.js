// src/lib/cloudflare.js - Version modifiée sans dépendances Cloudflare
/**
 * Module de remplacement pour les fonctionnalités Cloudflare
 * Utilise des alternatives compatibles avec un déploiement standard
 */

// Fonction pour simuler l'accès à la base de données
export async function getDatabase() {
  // Cette fonction simule l'accès à une base de données
  // En utilisant localStorage ou IndexedDB côté client
  
  // Vérifier si nous sommes côté client
  if (typeof window !== 'undefined') {
    return {
      prepare: (query) => {
        return {
          bind: (...params) => {
            return {
              all: async () => {
                try {
                  // Simuler une requête à la base de données avec localStorage
                  const storageKey = `db_${query.replace(/\s+/g, '_')}`;
                  const storedData = localStorage.getItem(storageKey);
                  
                  if (storedData) {
                    return JSON.parse(storedData);
                  }
                  
                  return [];
                } catch (error) {
                  console.error('Erreur lors de la simulation de requête DB:', error);
                  return [];
                }
              },
              first: async () => {
                try {
                  // Simuler une requête à la base de données avec localStorage
                  const storageKey = `db_${query.replace(/\s+/g, '_')}`;
                  const storedData = localStorage.getItem(storageKey);
                  
                  if (storedData) {
                    const data = JSON.parse(storedData);
                    return data.length > 0 ? data[0] : null;
                  }
                  
                  return null;
                } catch (error) {
                  console.error('Erreur lors de la simulation de requête DB:', error);
                  return null;
                }
              },
              run: async () => {
                try {
                  // Simuler une insertion/mise à jour dans la base de données
                  const storageKey = `db_${query.replace(/\s+/g, '_')}`;
                  localStorage.setItem(storageKey, JSON.stringify(params));
                  return { success: true };
                } catch (error) {
                  console.error('Erreur lors de la simulation d\'insertion DB:', error);
                  return { success: false, error };
                }
              }
            };
          }
        };
      },
      batch: async (queries) => {
        // Simuler un lot de requêtes
        const results = [];
        for (const query of queries) {
          try {
            // Exécuter chaque requête individuellement
            const result = await query.run();
            results.push(result);
          } catch (error) {
            console.error('Erreur lors de l\'exécution du lot de requêtes:', error);
            results.push({ success: false, error });
          }
        }
        return results;
      }
    };
  }
  
  // Côté serveur, retourner un objet factice
  return {
    prepare: () => ({
      bind: () => ({
        all: async () => [],
        first: async () => null,
        run: async () => ({ success: false, error: 'Exécution côté serveur non prise en charge' })
      })
    }),
    batch: async () => []
  };
}

// Fonction pour simuler l'environnement Cloudflare
export function getCloudflareEnv() {
  return {
    DB: {
      prepare: (query) => ({
        bind: (...params) => ({
          all: async () => [],
          first: async () => null,
          run: async () => ({ success: false })
        })
      })
    }
  };
}

// Fonction pour initialiser la base de données avec des données de démo
export async function initializeDatabase() {
  if (typeof window !== 'undefined') {
    try {
      // Stocker quelques données de démo
      const stocksData = [
        { symbol: 'AAPL', name: 'Apple Inc.', last_price: 182.52, last_change: 1.28, last_volume: 58245123 },
        { symbol: 'MSFT', name: 'Microsoft Corporation', last_price: 415.32, last_change: 0.87, last_volume: 22145678 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', last_price: 178.65, last_change: -0.32, last_volume: 15789456 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', last_price: 185.07, last_change: 1.45, last_volume: 32456789 },
        { symbol: 'TSLA', name: 'Tesla, Inc.', last_price: 172.63, last_change: -2.18, last_volume: 45678912 }
      ];
      
      const etfsData = [
        { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', last_price: 518.98, last_change: 0.75, last_volume: 78945612 },
        { symbol: 'QQQ', name: 'Invesco QQQ Trust', last_price: 438.21, last_change: 0.92, last_volume: 45612378 },
        { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', last_price: 253.47, last_change: 0.68, last_volume: 12345678 },
        { symbol: 'IWM', name: 'iShares Russell 2000 ETF', last_price: 201.32, last_change: -0.12, last_volume: 23456789 },
        { symbol: 'VGT', name: 'Vanguard Information Technology ETF', last_price: 528.76, last_change: 1.05, last_volume: 7891234 }
      ];
      
      const watchlistsData = [
        { 
          id: 1, 
          name: 'Ma liste principale', 
          items: [
            { symbol: 'AAPL', name: 'Apple Inc.', last_price: 182.52, last_change: 1.28 },
            { symbol: 'MSFT', name: 'Microsoft Corporation', last_price: 415.32, last_change: 0.87 },
            { symbol: 'GOOGL', name: 'Alphabet Inc.', last_price: 178.65, last_change: -0.32 }
          ]
        },
        { 
          id: 2, 
          name: 'ETFs', 
          items: [
            { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', last_price: 518.98, last_change: 0.75 },
            { symbol: 'QQQ', name: 'Invesco QQQ Trust', last_price: 438.21, last_change: 0.92 }
          ]
        }
      ];
      
      // Stocker les données dans localStorage
      localStorage.setItem('db_stocks', JSON.stringify(stocksData));
      localStorage.setItem('db_etfs', JSON.stringify(etfsData));
      localStorage.setItem('db_watchlists', JSON.stringify(watchlistsData));
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base de données:', error);
      return { success: false, error };
    }
  }
  
  return { success: false, error: 'Initialisation côté serveur non prise en charge' };
}

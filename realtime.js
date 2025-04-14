/**
 * Module pour les mises à jour en temps réel des données boursières
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour les mises à jour en temps réel des données boursières
 * @param {string} symbol - Le symbole de l'action ou ETF
 * @param {string} interval - L'intervalle des données (1d, 1wk, 1mo, etc.)
 * @param {string} range - La plage de temps (1mo, 3mo, 6mo, 1y, etc.)
 * @param {number} refreshInterval - L'intervalle de rafraîchissement en millisecondes
 * @returns {Object} - Les données boursières en temps réel et l'état de chargement
 */
export function useRealTimeStockData(symbol, interval = '1d', range = '1mo', refreshInterval = 60000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Utiliser une référence pour stocker l'intervalle de rafraîchissement
  const intervalRef = useRef(null);
  
  // Fonction pour récupérer les données
  const fetchData = async () => {
    if (!symbol) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`/api/stock?symbol=${symbol}&interval=${interval}&range=${range}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error(`Erreur lors de la récupération des données pour ${symbol}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Effet pour récupérer les données initiales et configurer l'intervalle de rafraîchissement
  useEffect(() => {
    // Nettoyer l'intervalle précédent
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Récupérer les données initiales
    fetchData();
    
    // Configurer l'intervalle de rafraîchissement
    intervalRef.current = setInterval(fetchData, refreshInterval);
    
    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, interval, range, refreshInterval]);
  
  return { data, loading, error, lastUpdated, refetch: fetchData };
}

/**
 * Hook personnalisé pour les mises à jour en temps réel des listes d'actions ou ETFs
 * @param {string} endpoint - Le point de terminaison API à appeler
 * @param {Object} params - Les paramètres de la requête
 * @param {number} refreshInterval - L'intervalle de rafraîchissement en millisecondes
 * @returns {Object} - Les données en temps réel et l'état de chargement
 */
export function useRealTimeListData(endpoint, params = {}, refreshInterval = 300000) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Utiliser une référence pour stocker l'intervalle de rafraîchissement
  const intervalRef = useRef(null);
  
  // Construire l'URL avec les paramètres
  const buildUrl = () => {
    const url = new URL(endpoint, window.location.origin);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });
    
    return url.toString();
  };
  
  // Fonction pour récupérer les données
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const url = buildUrl();
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error(`Erreur lors de la récupération des données depuis ${endpoint}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Effet pour récupérer les données initiales et configurer l'intervalle de rafraîchissement
  useEffect(() => {
    // Nettoyer l'intervalle précédent
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Récupérer les données initiales
    fetchData();
    
    // Configurer l'intervalle de rafraîchissement
    intervalRef.current = setInterval(fetchData, refreshInterval);
    
    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [endpoint, JSON.stringify(params), refreshInterval]);
  
  return { data, loading, error, lastUpdated, refetch: fetchData };
}

/**
 * Composant pour afficher le temps écoulé depuis la dernière mise à jour
 * @param {Object} props - Les propriétés du composant
 * @param {Date} props.lastUpdated - La date de la dernière mise à jour
 * @returns {JSX.Element} - Le composant d'affichage du temps écoulé
 */
export function LastUpdatedIndicator({ lastUpdated }) {
  const [timeAgo, setTimeAgo] = useState('');
  
  useEffect(() => {
    if (!lastUpdated) return;
    
    // Fonction pour calculer le temps écoulé
    const calculateTimeAgo = () => {
      const now = new Date();
      const diffInSeconds = Math.floor((now - lastUpdated) / 1000);
      
      if (diffInSeconds < 60) {
        setTimeAgo(`il y a ${diffInSeconds} seconde${diffInSeconds > 1 ? 's' : ''}`);
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        setTimeAgo(`il y a ${minutes} minute${minutes > 1 ? 's' : ''}`);
      } else {
        const hours = Math.floor(diffInSeconds / 3600);
        setTimeAgo(`il y a ${hours} heure${hours > 1 ? 's' : ''}`);
      }
    };
    
    // Calculer le temps écoulé initial
    calculateTimeAgo();
    
    // Mettre à jour le temps écoulé toutes les secondes
    const intervalId = setInterval(calculateTimeAgo, 1000);
    
    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, [lastUpdated]);
  
  if (!lastUpdated) {
    return null;
  }
  
  return (
    <div className="text-xs text-gray-500">
      Dernière mise à jour: {timeAgo}
    </div>
  );
}

/**
 * Composant pour afficher une notification de changement de prix
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.previousData - Les données précédentes
 * @param {Object} props.currentData - Les données actuelles
 * @param {number} props.threshold - Le seuil de changement en pourcentage
 * @returns {JSX.Element} - Le composant de notification
 */
export function PriceChangeNotification({ previousData, currentData, threshold = 1.0 }) {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    if (!previousData || !currentData || !previousData.meta || !currentData.meta) {
      return;
    }
    
    const prevPrice = previousData.meta.regularMarketPrice;
    const currentPrice = currentData.meta.regularMarketPrice;
    
    if (!prevPrice || !currentPrice) {
      return;
    }
    
    // Calculer le pourcentage de changement
    const changePercent = ((currentPrice - prevPrice) / prevPrice) * 100;
    
    // Vérifier si le changement dépasse le seuil
    if (Math.abs(changePercent) >= threshold) {
      const direction = changePercent > 0 ? 'hausse' : 'baisse';
      const symbol = currentData.meta.symbol;
      const name = currentData.meta.shortName || symbol;
      
      // Créer une nouvelle notification
      const notification = {
        id: Date.now(),
        symbol,
        name,
        price: currentPrice,
        changePercent,
        direction,
        timestamp: new Date()
      };
      
      // Ajouter la notification à la liste
      setNotifications(prev => [notification, ...prev].slice(0, 5));
    }
  }, [previousData, currentData, threshold]);
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg max-w-xs ${
            notification.direction === 'hausse' ? 'bg-green-100 border-l-4 border-green-500' : 'bg-red-100 border-l-4 border-red-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold">{notification.name}</p>
              <p className={notification.direction === 'hausse' ? 'text-green-700' : 'text-red-700'}>
                {notification.price.toFixed(2)} ({notification.changePercent > 0 ? '+' : ''}{notification.changePercent.toFixed(2)}%)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

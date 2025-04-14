// src/lib/api/yahooFinance.js - Version modifiée sans dépendances Cloudflare
import axios from 'axios';

/**
 * Module d'intégration avec l'API Yahoo Finance
 * Version modifiée pour fonctionner sans dépendances Cloudflare
 */

// Fonction pour récupérer les données d'un graphique boursier
export async function getStockChartData(symbol, interval = '1d', range = '1mo') {
  try {
    // Utilisation d'axios au lieu de l'API Cloudflare
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
      params: {
        interval,
        range,
        includePrePost: false,
        includeAdjustedClose: true,
        events: 'div,split'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour ${symbol}:`, error);
    return { error: true, message: error.message };
  }
}

// Fonction pour récupérer les données de plusieurs actions en une seule requête
export async function getBatchStockData(symbols) {
  try {
    // Traitement séquentiel des symboles
    const results = {};
    for (const symbol of symbols) {
      const data = await getStockChartData(symbol);
      results[symbol] = data;
    }
    
    return results;
  } catch (error) {
    console.error('Erreur lors de la récupération des données par lots:', error);
    return { error: true, message: error.message };
  }
}

// Fonction pour récupérer les informations sur les détenteurs d'actions
export async function getStockHolders(symbol) {
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}`, {
      params: {
        modules: 'insiderHolders'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détenteurs pour ${symbol}:`, error);
    return { error: true, message: error.message };
  }
}

// Fonction pour récupérer les analyses et insights sur une action
export async function getStockInsights(symbol) {
  try {
    const response = await axios.get(`https://query1.finance.yahoo.com/v1/finance/insights`, {
      params: {
        symbol
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des insights pour ${symbol}:`, error);
    return { error: true, message: error.message };
  }
}

// Fonction pour stocker les données dans une base de données locale
export async function storeStockData(symbol, data) {
  // Version simplifiée utilisant localStorage pour le stockage côté client
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`stock_${symbol}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      return true;
    } catch (error) {
      console.error(`Erreur lors du stockage des données pour ${symbol}:`, error);
      return false;
    }
  }
  return false;
}

// Fonction pour récupérer les données stockées localement
export function getStoredStockData(symbol) {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`stock_${symbol}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération des données stockées pour ${symbol}:`, error);
    }
  }
  return null;
}

// Liste de symboles d'actions populaires pour les démos
export const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' }
];

// Liste de symboles d'ETFs populaires pour les démos
export const popularETFs = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF' },
  { symbol: 'VGT', name: 'Vanguard Information Technology ETF' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF' },
  { symbol: 'IEMG', name: 'iShares Core MSCI Emerging Markets ETF' },
  { symbol: 'AGG', name: 'iShares Core U.S. Aggregate Bond ETF' },
  { symbol: 'GLD', name: 'SPDR Gold Shares' }
];

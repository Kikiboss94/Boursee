"use client";

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import StockChart from '@/components/charts/StockChart';
import StockTable from '@/components/charts/StockTable';
import StockDetail from '@/components/charts/StockDetail';
import { useRealTimeStockData, useRealTimeListData, LastUpdatedIndicator, PriceChangeNotification } from '@/lib/realtime';

/**
 * Page d'accueil du site d'analyse boursière avec mises à jour en temps réel
 */
export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [chartType, setChartType] = useState('line');
  const [interval, setInterval] = useState('1d');
  const [range, setRange] = useState('1mo');
  const [previousData, setPreviousData] = useState(null);

  // Utiliser les hooks de mise à jour en temps réel
  const { 
    data: stocksData, 
    loading: stocksLoading, 
    lastUpdated: stocksLastUpdated 
  } = useRealTimeListData('/api/stocks', { withData: 'true' }, 60000);
  
  const { 
    data: etfsData, 
    loading: etfsLoading, 
    lastUpdated: etfsLastUpdated 
  } = useRealTimeListData('/api/etfs', { withData: 'true' }, 60000);
  
  const { 
    data: symbolData, 
    loading: symbolLoading, 
    lastUpdated: symbolLastUpdated,
    refetch: refetchSymbolData
  } = useRealTimeStockData(selectedSymbol, interval, range, 30000);

  // Mettre à jour les données précédentes pour les notifications
  useEffect(() => {
    if (symbolData && !symbolLoading) {
      setPreviousData(prevData => {
        // Ne mettre à jour que si les données actuelles sont différentes
        if (!prevData || (prevData.chartData?.meta?.regularMarketPrice !== symbolData.chartData?.meta?.regularMarketPrice)) {
          return { ...symbolData };
        }
        return prevData;
      });
    }
  }, [symbolData, symbolLoading]);

  // Formater les données pour l'affichage
  const formatStocksForTable = (data) => {
    if (!data || !data.stocks) return [];
    
    return data.stocks.slice(0, 5).map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.data?.meta?.regularMarketPrice || 0,
      change: stock.data?.meta?.regularMarketChangePercent || 0,
      volume: stock.data?.meta?.regularMarketVolume || 0
    }));
  };
  
  const formatEtfsForTable = (data) => {
    if (!data || !data.etfs) return [];
    
    return data.etfs.slice(0, 5).map(etf => ({
      symbol: etf.symbol,
      name: etf.name,
      price: etf.data?.meta?.regularMarketPrice || 0,
      change: etf.data?.meta?.regularMarketChangePercent || 0,
      volume: etf.data?.meta?.regularMarketVolume || 0
    }));
  };
  
  // Gérer la sélection d'un symbole
  const handleSelectSymbol = (item) => {
    setSelectedSymbol(item.symbol);
  };
  
  // Formater les données du symbole sélectionné
  const formattedSymbolData = symbolData ? {
    meta: symbolData.chartData?.meta,
    chartData: symbolData.chartData,
    insights: symbolData.insights,
    holders: symbolData.holders
  } : null;
  
  return (
    <Layout>
      <div className="space-y-8">
        <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Analyse Boursière en Temps Réel</h1>
            <p className="text-xl">
              Suivez et analysez les actions et ETFs avec des données en temps réel et des outils d'analyse technique avancés.
            </p>
          </div>
        </section>
        
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {formattedSymbolData ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{formattedSymbolData.meta?.shortName || selectedSymbol}</h2>
                      <LastUpdatedIndicator lastUpdated={symbolLastUpdated} />
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      <select 
                        className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                      >
                        <option value="line">Ligne</option>
                        <option value="area">Aire</option>
                        <option value="volume">Volume</option>
                      </select>
                      <select 
                        className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                      >
                        <option value="1d">Journalier</option>
                        <option value="1wk">Hebdomadaire</option>
                        <option value="1mo">Mensuel</option>
                      </select>
                      <select 
                        className="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                      >
                        <option value="1mo">1 mois</option>
                        <option value="3mo">3 mois</option>
                        <option value="6mo">6 mois</option>
                        <option value="1y">1 an</option>
                        <option value="5y">5 ans</option>
                      </select>
                      <button 
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                        onClick={refetchSymbolData}
                      >
                        Actualiser
                      </button>
                    </div>
                  </div>
                  <StockChart 
                    data={formattedSymbolData.chartData} 
                    symbol={selectedSymbol}
                    interval={interval}
                    type={chartType}
                  />
                </div>
                
                <StockDetail 
                  data={formattedSymbolData} 
                  symbol={selectedSymbol} 
                />
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des données...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Actions Populaires</h2>
                <LastUpdatedIndicator lastUpdated={stocksLastUpdated} />
              </div>
              {stocksLoading ? (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p className="text-gray-500 text-center">Chargement...</p>
                </div>
              ) : (
                <StockTable 
                  data={formatStocksForTable(stocksData)} 
                  onSelect={handleSelectSymbol} 
                />
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">ETFs Populaires</h2>
                <LastUpdatedIndicator lastUpdated={etfsLastUpdated} />
              </div>
              {etfsLoading ? (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <p className="text-gray-500 text-center">Chargement...</p>
                </div>
              ) : (
                <StockTable 
                  data={formatEtfsForTable(etfsData)} 
                  onSelect={handleSelectSymbol} 
                />
              )}
            </div>
          </div>
        </section>
      </div>
      
      {/* Composant de notification pour les changements de prix significatifs */}
      <PriceChangeNotification 
        previousData={previousData?.chartData} 
        currentData={formattedSymbolData?.chartData} 
        threshold={0.5} 
      />
    </Layout>
  );
}

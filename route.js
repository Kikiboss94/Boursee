// src/app/api/etfs/route.js - Version modifiée sans dépendances Cloudflare
import { NextResponse } from 'next/server';
import { popularETFs, getStockChartData } from '@/lib/api/yahooFinance';

export async function GET(request) {
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const withData = searchParams.get('withData') === 'true';
    
    // Si withData est true, récupérer les données pour chaque ETF
    if (withData) {
      // Récupérer les données pour les 5 premiers ETFs (pour des raisons de performance)
      const etfsWithData = await Promise.all(
        popularETFs.slice(0, 5).map(async (etf) => {
          try {
            const data = await getStockChartData(etf.symbol, '1d', '1mo');
            return {
              ...etf,
              data,
              exchange: 'NASDAQ', // Valeur par défaut
              currency: 'USD',    // Valeur par défaut
              category: 'ETF'     // Valeur par défaut
            };
          } catch (error) {
            console.error(`Erreur lors de la récupération des données pour ${etf.symbol}:`, error);
            return etf;
          }
        })
      );
      
      return NextResponse.json({ etfs: etfsWithData });
    }
    
    // Sinon, retourner simplement la liste des ETFs
    return NextResponse.json({ etfs: popularETFs });
  } catch (error) {
    console.error('Erreur lors de la récupération des ETFs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

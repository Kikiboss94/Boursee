import { useState } from 'react';

/**
 * Composant pour afficher les détails d'une action ou ETF
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.data - Les données détaillées de l'action ou ETF
 * @param {string} props.symbol - Le symbole de l'action ou ETF
 * @returns {JSX.Element} Le composant de détail
 */
export default function StockDetail({ data, symbol }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!data) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-500 text-center">Chargement des données pour {symbol}...</p>
      </div>
    );
  }
  
  // Extraire les données pertinentes
  const { meta, insights, holders } = data;
  
  // Formater les valeurs numériques
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toFixed(decimals);
  };
  
  // Formater les pourcentages
  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const formatted = Number(value).toFixed(2);
    return `${formatted}%`;
  };
  
  // Déterminer la classe CSS en fonction de la valeur
  const getValueClass = (value) => {
    if (value === null || value === undefined) return '';
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{meta?.shortName || meta?.longName || symbol}</h2>
            <p className="text-gray-600">{meta?.exchangeName} · {meta?.currency}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-3xl font-bold">
              {formatNumber(meta?.regularMarketPrice)}
            </div>
            <div className={`text-lg ${getValueClass(meta?.regularMarketChangePercent)}`}>
              {formatNumber(meta?.regularMarketChange)} ({formatPercent(meta?.regularMarketChangePercent)})
            </div>
          </div>
        </div>
        
        {/* Onglets de navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Aperçu
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'technicals'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('technicals')}
            >
              Analyse Technique
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'holders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('holders')}
            >
              Détenteurs
            </button>
          </nav>
        </div>
        
        {/* Contenu des onglets */}
        <div>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Cours le plus haut (52 sem.)</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatNumber(meta?.fiftyTwoWeekHigh)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Cours le plus bas (52 sem.)</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatNumber(meta?.fiftyTwoWeekLow)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Volume</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{meta?.regularMarketVolume?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Plus haut du jour</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatNumber(meta?.regularMarketDayHigh)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Plus bas du jour</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatNumber(meta?.regularMarketDayLow)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Clôture précédente</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{formatNumber(meta?.chartPreviousClose)}</p>
                </div>
              </div>
              
              {insights?.companySnapshot && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu de l'entreprise</h3>
                  <p className="text-gray-600 mb-4">{insights.companySnapshot.sectorInfo}</p>
                  
                  {insights.companySnapshot.company && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500">Innovation</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${insights.companySnapshot.company.innovativeness * 10}%` }}></div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500">Recrutement</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${insights.companySnapshot.company.hiring * 10}%` }}></div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-500">Durabilité</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${insights.companySnapshot.company.sustainability * 10}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'technicals' && (
            <div className="space-y-6">
              {insights?.instrumentInfo?.technicalEvents && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Indicateurs Techniques</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Perspectives à court terme */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Court Terme</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {insights.instrumentInfo.technicalEvents.shortTermOutlook?.stateDescription || 'N/A'}
                      </p>
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${
                          insights.instrumentInfo.technicalEvents.shortTermOutlook?.direction === 'up' 
                            ? 'text-green-600' 
                            : insights.instrumentInfo.technicalEvents.shortTermOutlook?.direction === 'down'
                              ? 'text-red-600'
                              : 'text-gray-600'
                        }`}>
                          {insights.instrumentInfo.technicalEvents.shortTermOutlook?.scoreDescription || 'N/A'}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({insights.instrumentInfo.technicalEvents.shortTermOutlook?.score || 'N/A'})
                        </span>
                      </div>
                    </div>
                    
                    {/* Perspectives à moyen terme */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Moyen Terme</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {insights.instrumentInfo.technicalEvents.intermediateTermOutlook?.stateDescription || 'N/A'}
                      </p>
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${
                          insights.instrumentInfo.technicalEvents.intermediateTermOutlook?.direction === 'up' 
                            ? 'text-green-600' 
                            : insights.instrumentInfo.technicalEvents.intermediateTermOutlook?.direction === 'down'
                              ? 'text-red-600'
                              : 'text-gray-600'
                        }`}>
                          {insights.instrumentInfo.technicalEvents.intermediateTermOutlook?.scoreDescription || 'N/A'}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({insights.instrumentInfo.technicalEvents.intermediateTermOutlook?.score || 'N/A'})
                        </span>
                      </div>
                    </div>
                    
                    {/* Perspectives à long terme */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Long Terme</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {insights.instrumentInfo.technicalEvents.longTermOutlook?.stateDescription || 'N/A'}
                      </p>
                      <div className="flex items-center">
                        <span className={`text-lg font-bold ${
                          insights.instrumentInfo.technicalEvents.longTermOutlook?.direction === 'up' 
                            ? 'text-green-600' 
                            : insights.instrumentInfo.technicalEvents.longTermOutlook?.direction === 'down'
                              ? 'text-red-600'
                              : 'text-gray-600'
                        }`}>
                          {insights.instrumentInfo.technicalEvents.longTermOutlook?.scoreDescription || 'N/A'}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({insights.instrumentInfo.technicalEvents.longTermOutlook?.score || 'N/A'})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {insights?.instrumentInfo?.keyTechnicals && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Niveaux Clés</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Support</h4>
                      <p className="mt-1 text-lg font-semibold text-green-600">
                        {formatNumber(insights.instrumentInfo.keyTechnicals.support)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Résistance</h4>
                      <p className="mt-1 text-lg font-semibold text-red-600">
                        {formatNumber(insights.instrumentInfo.keyTechnicals.resistance)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">Stop Loss</h4>
                      <p className="mt-1 text-lg font-semibold text-orange-600">
                        {formatNumber(insights.instrumentInfo.keyTechnicals.stopLoss)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'holders' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Principaux Détenteurs</h3>
              
              {holders?.holders && holders.holders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Relation
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date de Transaction
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {holders.holders.map((holder, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {holder.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {holder.relation}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {holder.positionDirect?.fmt || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {holder.latestTransDate?.fmt || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
 
(Content truncated due to size limit. Use line ranges to read in chunks)
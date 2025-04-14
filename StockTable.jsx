import { useState, useEffect } from 'react';

/**
 * Composant pour afficher un tableau des données boursières
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.data - Les données des actions ou ETFs
 * @param {Function} props.onSelect - Fonction appelée lors de la sélection d'une ligne
 * @returns {JSX.Element} Le composant de tableau
 */
export default function StockTable({ data, onSelect }) {
  const [sortField, setSortField] = useState('symbol');
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortedData, setSortedData] = useState([]);
  
  useEffect(() => {
    if (!data || data.length === 0) {
      setSortedData([]);
      return;
    }
    
    // Trier les données
    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? (aValue || 0) - (bValue || 0) 
          : (bValue || 0) - (aValue || 0);
      }
    });
    
    setSortedData(sorted);
  }, [data, sortField, sortDirection]);
  
  // Fonction pour changer le tri
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Fonction pour formater les valeurs numériques
  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return 'N/A';
    return Number(value).toFixed(decimals);
  };
  
  // Fonction pour formater les pourcentages
  const formatPercent = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const formatted = Number(value).toFixed(2);
    return `${formatted}%`;
  };
  
  // Fonction pour déterminer la classe CSS en fonction de la valeur
  const getValueClass = (value) => {
    if (value === null || value === undefined) return '';
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };
  
  if (!sortedData || sortedData.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <p className="text-gray-500 text-center">Aucune donnée disponible</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('symbol')}
              >
                Symbole
                {sortField === 'symbol' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Nom
                {sortField === 'name' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                Dernier Cours
                {sortField === 'price' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('change')}
              >
                Variation
                {sortField === 'change' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('volume')}
              >
                Volume
                {sortField === 'volume' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr 
                key={item.symbol || index} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect && onSelect(item)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {item.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatNumber(item.price)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getValueClass(item.change)}`}>
                  {formatPercent(item.change)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.volume ? item.volume.toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

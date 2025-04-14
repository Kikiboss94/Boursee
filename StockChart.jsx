import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, AreaChart, BarChart, Bar
} from 'recharts';

/**
 * Composant de graphique pour afficher l'historique des prix d'une action ou ETF
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.data - Les données de l'historique des prix
 * @param {string} props.symbol - Le symbole de l'action ou ETF
 * @param {string} props.interval - L'intervalle des données (1d, 1wk, 1mo, etc.)
 * @param {string} props.type - Le type de graphique (line, area, candle, etc.)
 * @returns {JSX.Element} Le composant de graphique
 */
export default function StockChart({ data, symbol, interval = '1d', type = 'line' }) {
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    if (!data || !data.timestamp || !data.quote) {
      return;
    }
    
    // Formater les données pour le graphique
    const formattedData = data.timestamp.map((timestamp, index) => {
      const date = new Date(timestamp * 1000);
      return {
        date: formatDate(date, interval),
        timestamp,
        open: data.quote.open[index],
        high: data.quote.high[index],
        low: data.quote.low[index],
        close: data.quote.close[index],
        volume: data.quote.volume[index],
        adjClose: data.adjclose ? data.adjclose[index] : data.quote.close[index],
      };
    }).filter(item => item.close !== null);
    
    setChartData(formattedData);
  }, [data, interval]);
  
  // Fonction pour formater la date en fonction de l'intervalle
  const formatDate = (date, interval) => {
    if (interval === '1d' || interval === '5d') {
      return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (interval === '1wk' || interval === '1mo') {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    } else {
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };
  
  // Fonction pour formater les valeurs dans le tooltip
  const formatTooltipValue = (value) => {
    return value ? value.toFixed(2) : 'N/A';
  };
  
  // Personnalisation du tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 shadow-lg rounded">
          <p className="font-bold">{label}</p>
          <p className="text-green-600">
            Ouverture: {formatTooltipValue(payload[0].payload.open)}
          </p>
          <p className="text-blue-600">
            Clôture: {formatTooltipValue(payload[0].payload.close)}
          </p>
          <p className="text-red-600">
            Plus haut: {formatTooltipValue(payload[0].payload.high)}
          </p>
          <p className="text-orange-600">
            Plus bas: {formatTooltipValue(payload[0].payload.low)}
          </p>
          <p className="text-gray-600">
            Volume: {payload[0].payload.volume ? payload[0].payload.volume.toLocaleString() : 'N/A'}
          </p>
        </div>
      );
    }
    return null;
  };
  
  if (chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-100 rounded">
        <p className="text-gray-500">Aucune donnée disponible pour {symbol}</p>
      </div>
    );
  }
  
  // Déterminer les valeurs min et max pour l'axe Y
  const prices = chartData.flatMap(item => [item.low, item.high]).filter(Boolean);
  const minPrice = Math.min(...prices) * 0.99;
  const maxPrice = Math.max(...prices) * 1.01;
  
  // Rendu du graphique en fonction du type
  if (type === 'area') {
    return (
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[minPrice, maxPrice]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="close" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  } else if (type === 'volume') {
    return (
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="volume" fill="#82ca9d" name="Volume" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    // Type par défaut: line
    return (
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[minPrice, maxPrice]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="close" stroke="#8884d8" name="Prix de clôture" dot={false} />
            <Line type="monotone" dataKey="open" stroke="#82ca9d" name="Prix d'ouverture" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

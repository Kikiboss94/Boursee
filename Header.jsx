import Link from 'next/link';

/**
 * Composant Header pour le site d'analyse boursière
 * @returns {JSX.Element} Le composant Header
 */
export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                <polyline points="16 7 22 7 22 13"></polyline>
              </svg>
              <span>BourseTrend</span>
            </Link>
          </div>
          
          <nav className="flex flex-wrap justify-center md:justify-end space-x-1 md:space-x-4">
            <Link href="/" className="px-3 py-2 rounded hover:bg-blue-700 transition-colors">
              Accueil
            </Link>
            <Link href="/actions" className="px-3 py-2 rounded hover:bg-blue-700 transition-colors">
              Actions
            </Link>
            <Link href="/etfs" className="px-3 py-2 rounded hover:bg-blue-700 transition-colors">
              ETFs
            </Link>
            <Link href="/watchlist" className="px-3 py-2 rounded hover:bg-blue-700 transition-colors">
              Listes de Surveillance
            </Link>
            <Link href="/analyses" className="px-3 py-2 rounded hover:bg-blue-700 transition-colors">
              Analyses
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

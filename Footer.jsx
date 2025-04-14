/**
 * Composant Footer pour le site d'analyse boursière
 * @returns {JSX.Element} Le composant Footer
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">BourseTrend</h3>
            <p className="text-gray-300">
              Votre plateforme d'analyse boursière en temps réel pour suivre et analyser les actions et ETFs.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Accueil</a></li>
              <li><a href="/actions" className="text-gray-300 hover:text-white transition-colors">Actions</a></li>
              <li><a href="/etfs" className="text-gray-300 hover:text-white transition-colors">ETFs</a></li>
              <li><a href="/watchlist" className="text-gray-300 hover:text-white transition-colors">Listes de Surveillance</a></li>
              <li><a href="/analyses" className="text-gray-300 hover:text-white transition-colors">Analyses</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Avertissement</h3>
            <p className="text-gray-300">
              Les informations fournies sur ce site sont à titre informatif uniquement et ne constituent pas des conseils d'investissement.
              Les performances passées ne préjugent pas des performances futures.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} BourseTrend. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

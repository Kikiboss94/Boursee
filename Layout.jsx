import Header from './Header';
import Footer from './Footer';

/**
 * Composant Layout principal pour le site d'analyse boursière
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Le contenu à afficher dans le layout
 * @returns {JSX.Element} Le composant Layout
 */
export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

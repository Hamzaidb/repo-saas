import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow p-8 text-center">
        <div className="text-6xl mb-4">🧭</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
        <p className="text-gray-600 mb-6">
          Désolé, la page que vous recherchez n'existe pas encore ou a été déplacée.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/products"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Voir les produits
          </Link>
        </div>
      </div>
    </main>
  );
}

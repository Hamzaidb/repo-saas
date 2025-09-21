// apps/frontend/src/app/success/page.tsx
import Link from 'next/link';

export default function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams?.session_id;
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi</h1>
          <p className="text-gray-600 mb-6">
            Merci pour votre achat. Votre paiement a été confirmé.
          </p>
          {sessionId && (
            <p className="text-sm text-gray-500 mb-8">
              ID de session Stripe: <span className="font-mono">{sessionId}</span>
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continuer vos achats
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

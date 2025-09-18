import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenue sur la boutique de figurines</h1>
      <p className="mb-4">Découvrez nos figurines et passez commande facilement.</p>

      <Link
        href="/products"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Voir les produits
      </Link>
    </main>
  );
}


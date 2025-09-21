"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error('[Navbar] Sign out failed', e);
    }
  };

  return (
    <nav className="bg-black shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-light text-white ">FigurineStore</Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/products" className="text-white hover:text-indigo-600">Boutique</Link>
            <Link href="/about" className="text-white hover:text-indigo-600">À propos</Link>
            <Link href="/cart" className="text-white hover:text-indigo-600">Panier 🛒</Link>

            {!isAuthenticated ? (
              <Link 
                href="/login" 
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Se connecter
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">FigurineStore</Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-indigo-600">Boutique</Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600">À propos</Link>
            <Link href="/cart" className="text-gray-700 hover:text-indigo-600">Panier 🛒</Link>
            <Link 
              href="/login" 
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Mon compte
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

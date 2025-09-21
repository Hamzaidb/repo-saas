'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
};

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(items));
}

export default function CartPage() {
  // Initialize from localStorage in a lazy initializer to avoid a read->write race on first mount
  const [items, setItems] = useState<CartItem[]>(() => {
    const data = readCart();
    console.log('[CartPage] Initial state from localStorage:', data);
    return data;
  });
  const didMount = useRef(false);

  // Mark as mounted after first paint; avoids writing during initial hydration
  useEffect(() => {
    didMount.current = true;
  }, []);

  useEffect(() => {
    if (!didMount.current) {
      console.log('[CartPage] Skipping initial write (before mount). Current items:', items);
      return;
    }
    console.log('[CartPage] Items changed, writing to localStorage:', items);
    writeCart(items);
  }, [items]);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [items]
  );

  const formatPrice = (price: number) => price.toFixed(2);

  const inc = (id: string) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity + 1 } : it)));
  const dec = (id: string) =>
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it))
    );
  const removeItem = (id: string) => setItems((prev) => prev.filter((it) => it.id !== id));
  const clear = () => setItems([]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Votre panier</h1>
          <Link
            href="/products"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Continuer vos achats →
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-10 rounded-lg shadow-sm text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-500 mb-6">Ajoutez des produits à votre panier pour les voir ici.</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Voir les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div key={it.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {it.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image_url} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">🖼️</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{it.name}</h3>
                    <p className="text-sm text-gray-500">{formatPrice(it.price)} € / unité</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="inline-flex items-center border rounded">
                        <button
                          onClick={() => dec(it.id)}
                          className="px-3 py-1 text-gray-700 hover:bg-gray-50"
                          aria-label="Diminuer la quantité"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 min-w-8 text-center">{it.quantity}</span>
                        <button
                          onClick={() => inc(it.id)}
                          className="px-3 py-1 text-gray-700 hover:bg-gray-50"
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-md font-semibold text-gray-900">
                      {formatPrice(it.price * it.quantity)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h2>
              <div className="flex items-center justify-between text-gray-700 mb-2">
                <span>Total</span>
                <span className="text-xl font-bold">{formatPrice(total)} €</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Taxes et frais de livraison calculés lors du paiement.</p>
              <button
                className="w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                onClick={() => alert('Paiement non implémenté dans cette démo')}
              >
                Passer au paiement
              </button>
              <button
                className="mt-3 w-full inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={clear}
              >
                Vider le panier
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

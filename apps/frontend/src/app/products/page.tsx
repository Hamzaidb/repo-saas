'use client';

import React, { useState, useEffect } from 'react';

// Types pour correspondre à votre schéma Prisma
interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number; // Changé de string à number
  stock: number;
  category_id?: string;
  created_at?: string;
  categories?: Category;
}

interface ApiResponse {
  data: Product[];
}

interface SingleProductResponse {
  data: Product;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productId, setProductId] = useState('');

  const API_BASE = 'http://localhost:3001';

  // Récupérer tous les produits
  const fetchAllProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data: ApiResponse = await response.json();
      
      if (response.ok) {
        setProducts(data.data || []);
      } else {
        setError((data as any).error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer un produit par ID
  const fetchProductById = async () => {
    if (!productId.trim()) {
      setError('Veuillez entrer un ID de produit');
      return;
    }

    setLoading(true);
    setError('');
    setSelectedProduct(null);
    
    try {
      const response = await fetch(`${API_BASE}/products/${productId}`);
      const data: SingleProductResponse = await response.json();
      
      if (response.ok) {
        setSelectedProduct(data.data);
      } else {
        setError((data as any).error || 'Produit non trouvé');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les produits au démarrage
  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test API Produits
          </h1>
          <p className="text-gray-600">
            Interface simple pour tester votre backend Fastify
          </p>
        </div>

        {/* Test de connexion */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            🔗 Test de connexion
          </h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={fetchAllProducts}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? '⏳ Chargement...' : '🔄 Recharger tous les produits'}
            </button>
            <span className="text-sm text-gray-500">
              API: {API_BASE}/products
            </span>
          </div>
        </div>

        {/* Recherche par ID */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            🔍 Rechercher un produit par ID
          </h2>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Entrez l'ID du produit"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={fetchProductById}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? '⏳' : '🔍 Rechercher'}
            </button>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-500 mr-2">❌</span>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Produit sélectionné */}
        {selectedProduct && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              📦 Produit trouvé
            </h2>
            <div className="bg-gray-50 rounded-md p-4">
              <pre className="text-sm text-gray-700 overflow-x-auto">
                {JSON.stringify(selectedProduct, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Liste des produits */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            📋 Tous les produits ({products.length})
          </h2>
          
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl">⏳</div>
              <p className="text-gray-500 mt-2">Chargement...</p>
            </div>
          )}

          {!loading && products.length === 0 && !error && (
            <div className="text-center py-8">
              <span className="text-6xl mb-4 block">📦</span>
              <p className="text-gray-500">Aucun produit trouvé</p>
              <p className="text-sm text-gray-400 mt-2">
                Votre base de données est peut-être vide
              </p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="space-y-4">
              {products.map((product, index) => (
                <div 
                  key={product.id || index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {product.name || 'Nom non défini'}
                        </h3>
                        {product.categories && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {product.categories.name}
                          </span>
                        )}
                        {product.stock !== undefined && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            product.stock > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            Stock: {product.stock}
                          </span>
                        )}
                      </div>
                      
                      {product.description && (
                        <p className="text-gray-600 text-sm mt-1 mb-2">
                          {product.description}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500">
                        <span className="font-mono">ID: {product.id}</span>
                        {product.price && (
                          <span className="font-semibold text-green-600">
                            💰 {product.price.toFixed(2)}€
                          </span>
                        )}
                        {product.category_id && (
                          <span>Cat ID: {product.category_id}</span>
                        )}
                        {product.created_at && (
                          <span>
                            📅 {new Date(product.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="text-blue-500 hover:text-blue-700 text-sm ml-4 whitespace-nowrap"
                    >
                      👁️ Voir détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informations de debug */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>🔧 Interface de test pour l'API backend</p>
          <p>Serveur: {API_BASE}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
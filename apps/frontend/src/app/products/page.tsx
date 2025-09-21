'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  price: number;
  stock: number;
  category_id?: string;
  image_url?: string;
  images?: string[];
  created_at?: string;
  categories?: Category;
}

interface ApiResponse {
  data: Product[];
}

interface CategoryStatsResponse {
  data: {
    id: string;
    name: string;
    count: number;
  }[];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const API_BASE = 'http://localhost:3001';

  // Helper pour formater le prix
  const formatPrice = (price: any): string => {
    if (typeof price === 'number') return price.toFixed(2);
    if (typeof price === 'string') {
      const parsed = parseFloat(price);
      return isNaN(parsed) ? '0.00' : parsed.toFixed(2);
    }
    return '0.00';
  };

  // Récupérer tous les produits et catégories
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/categories/stats`)
      ]);
      
      if (productsResponse.ok) {
        const productsData: ApiResponse = await productsResponse.json();
        setProducts(productsData.data || []);
      } else {
        throw new Error('Failed to fetch products');
      }

      if (categoriesResponse.ok) {
        const categoriesData: CategoryStatsResponse = await categoriesResponse.json();
        setCategories(categoriesData.data || []);
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'in-stock') return product.stock > 0;
    if (selectedCategory === 'out-of-stock') return product.stock === 0;
    return product.category_id === selectedCategory;
  });

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'stock':
        return b.stock - a.stock;
      case 'newest':
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  // Calculs pour la pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset à la page 1 quand on change de filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-500">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchData} 
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div>
        {/* En-tête avec image de bannière */}
        <div className="relative bg-gray-800">
          <div className="h-56 bg-indigo-600 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
            <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-6xl">🏪</span>
            </div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="md:ml-auto md:w-1/2 md:pl-10">
              <h2 className="text-base font-semibold uppercase tracking-wider text-gray-300">
                Notre collection
              </h2>
              <p className="mt-2 text-white text-3xl font-extrabold tracking-tight sm:text-4xl">
                Des figurines exceptionnelles
              </p>
              <p className="mt-3 text-lg text-gray-300">
                Découvrez notre sélection de {products.length} figurines de qualité supérieure pour les collectionneurs exigeants.
              </p>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-12 pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Tous les produits ({sortedProducts.length})
            </h1>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Page {currentPage} sur {totalPages}
              </span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-black"
              >
                <option value="newest">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
                <option value="stock">Stock disponible</option>
              </select>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Produits
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filtres */}
              <div className="hidden lg:block">
                <h3 className="sr-only">Filtres</h3>
                
                {/* Filtres rapides */}
                <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                  <li>
                    <button 
                      onClick={() => setSelectedCategory('all')}
                      className={selectedCategory === 'all' ? 'text-indigo-600' : 'hover:text-indigo-600'}
                    >
                      Tous ({products.length})
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setSelectedCategory('in-stock')}
                      className={selectedCategory === 'in-stock' ? 'text-indigo-600' : 'hover:text-indigo-600'}
                    >
                      En stock ({products.filter(p => p.stock > 0).length})
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setSelectedCategory('out-of-stock')}
                      className={selectedCategory === 'out-of-stock' ? 'text-indigo-600' : 'hover:text-indigo-600'}
                    >
                      Rupture de stock ({products.filter(p => p.stock === 0).length})
                    </button>
                  </li>
                </ul>

                {/* Filtres par catégorie */}
                <div className="border-b border-gray-200 py-6">
                  <h3 className="font-medium text-gray-900 mb-4">Catégories</h3>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const categoryProductCount = products.filter(p => p.category_id === category.id).length;
                      return (
                        <div key={category.id} className="flex items-center">
                          <input
                            id={`filter-category-${category.id}`}
                            name="category"
                            type="radio"
                            checked={selectedCategory === category.id}
                            onChange={() => setSelectedCategory(category.id)}
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-category-${category.id}`}
                            className="ml-3 text-sm text-gray-600 cursor-pointer"
                          >
                            {category.name} ({categoryProductCount})
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Grille des produits */}
              <div className="lg:col-span-3">
                {sortedProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
                    <p className="text-gray-500">Essayez de modifier vos filtres</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                      {currentProducts.map((product) => (
                        <div key={product.id} className="group relative">
                          <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                width={300}
                                height={400}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-4xl bg-gray-100">
                                🖼️
                              </div>
                            )}
                            
                            {/* Badges */}
                            <div className="absolute top-2 right-2 space-y-1">
                              {product.stock === 0 && (
                                <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  Rupture
                                </div>
                              )}
                              {product.stock > 0 && product.stock <= 5 && (
                                <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  Stock faible
                                </div>
                              )}
                            </div>
                            
                            {/* Badge catégorie */}
                            {product.categories && (
                              <div className="absolute top-2 left-2">
                                <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  {product.categories.name}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-4 flex justify-between">
                            <div className="flex-1">
                              <h3 className="text-sm text-gray-700">
                                <Link href={`/products/${product.id}`}>
                                  <span aria-hidden="true" className="absolute inset-0" />
                                  {product.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {product.categories?.name || 'Non catégorisé'}
                              </p>
                              {product.description && (
                                <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                              
                              {/* Stock */}
                              <div className="mt-2">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  product.stock > 5 
                                    ? 'bg-green-100 text-green-800' 
                                    : product.stock > 0
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {formatPrice(product.price)} €
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <nav
                        className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-8"
                        aria-label="Pagination"
                      >
                        <div className="-mt-px flex w-0 flex-1">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium ${
                              currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                          >
                            <svg
                              className="mr-3 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Précédent
                          </button>
                        </div>
                        
                        <div className="hidden md:-mt-px md:flex">
                          {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            const isCurrentPage = pageNumber === currentPage;
                            const shouldShow = 
                              pageNumber === 1 ||
                              pageNumber === totalPages ||
                              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);
                            
                            if (!shouldShow && pageNumber !== currentPage - 2 && pageNumber !== currentPage + 2) {
                              return null;
                            }
                            
                            if ((pageNumber === currentPage - 2 && currentPage > 3) || 
                                (pageNumber === currentPage + 2 && currentPage < totalPages - 2)) {
                              return (
                                <span key={pageNumber} className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                                  ...
                                </span>
                              );
                            }
                            
                            return (
                              <button
                                key={pageNumber}
                                onClick={() => setCurrentPage(pageNumber)}
                                className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                                  isCurrentPage
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                                aria-current={isCurrentPage ? 'page' : undefined}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                        </div>
                        
                        <div className="-mt-px flex w-0 flex-1 justify-end">
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium ${
                              currentPage === totalPages
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                            }`}
                          >
                            Suivant
                            <svg
                              className="ml-3 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M2 10a.75.75 0 01.75-.75h12.59l-2.1 1.95a.75.75 0 111.02 1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </nav>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
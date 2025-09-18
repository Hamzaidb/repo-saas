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
  price: string; // Decimal vient comme string depuis l'API
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

// Type pour un produit
type CollectionProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
};

// Fonction pour récupérer les produits (à remplacer par un appel API réel)
async function getProducts(): Promise<CollectionProduct[]> {
  // Simulation de données
  return [
    {
      id: '1',
      name: 'Figurine Dragon Ball Z - Son Goku',
      price: 49.99,
      category: 'Anime',
      rating: 4.8,
      image: '/placeholder-figurine-1.jpg',
      isNew: true,
      isBestSeller: true,
    },
    {
      id: '2',
      name: 'Figurine Marvel - Iron Man Mark L',
      price: 89.99,
      category: 'Marvel',
      rating: 4.9,
      image: '/placeholder-figurine-2.jpg',
      isBestSeller: true,
    },
    {
      id: '3',
      name: 'Figurine Star Wars - Dark Vador',
      price: 69.99,
      category: 'Star Wars',
      rating: 4.7,
      image: '/placeholder-figurine-3.jpg',
      isNew: true,
    },
    // Ajoutez plus de produits ici
  ];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productId, setProductId] = useState('');
  const [collectionProducts, setCollectionProducts] = useState<CollectionProduct[]>([]);

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
    getProducts().then((data) => setCollectionProducts(data));
  }, []);

  return (
    <div className="bg-white">
      <div>
        {/* En-tête avec image de bannière */}
        <div className="relative bg-gray-800">
          <div className="h-56 bg-indigo-600 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
            <Image
              className="w-full h-full object-cover"
              src="/banner-collection.jpg"
              alt="Collection de figurines"
              width={1000}
              height={600}
            />
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
                Découvrez notre sélection de figurines de qualité supérieure pour les collectionneurs exigeants.
              </p>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-12 pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Tous les produits
            </h1>

            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                    id="menu-button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    Trier
                    <svg
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Produits
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filtres */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Catégories</h3>
                <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                  <li>
                    <a href="#" className="text-indigo-600">Tout</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-indigo-600">Nouveautés</a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-indigo-600">Meilleures ventes</a>
                  </li>
                </ul>

                <div className="border-b border-gray-200 py-6">
                  <h3 className="-my-3 flow-root">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500"
                      aria-controls="filter-section-0"
                      aria-expanded="false"
                    >
                      <span className="font-medium text-gray-900">Catégorie</span>
                      <span className="ml-6 flex items-center">
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div className="pt-6" id="filter-section-0">
                    <div className="space-y-4">
                      {['Anime', 'Marvel', 'Star Wars', 'DC Comics', 'Jeux Vidéo'].map((category) => (
                        <div key={category} className="flex items-center">
                          <input
                            id={`filter-category-${category}`}
                            name="category[]"
                            value={category}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-category-${category}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>

              {/* Grille des produits */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {collectionProducts.map((product) => (
                    <div key={product.id} className="group relative">
                      <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                        <Image
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                          width={300}
                          height={400}
                        />
                        {product.isNew && (
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Nouveau
                          </div>
                        )}
                        {product.isBestSeller && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                            Meilleure vente
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">
                            <Link href={`/products/${product.id}`}>
                              <span aria-hidden="true" className="absolute inset-0" />
                              {product.name}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{product.price} €</p>
                      </div>
                      <div className="mt-2 flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <svg
                            key={rating}
                            className={`h-4 w-4 ${product.rating > rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-xs text-gray-500">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <nav
                  className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-8"
                  aria-label="Pagination"
                >
                  <div className="-mt-px flex w-0 flex-1">
                    <a
                      href="#"
                      className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
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
                    </a>
                  </div>
                  <div className="hidden md:-mt-px md:flex">
                    <a
                      href="#"
                      className="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
                      aria-current="page"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      2
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      3
                    </a>
                    <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                      ...
                    </span>
                    <a
                      href="#"
                      className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      8
                    </a>
                  </div>
                  <div className="-mt-px flex w-0 flex-1 justify-end">
                    <a
                      href="#"
                      className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
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
                    </a>
                  </div>
                </nav>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
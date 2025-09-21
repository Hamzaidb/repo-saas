"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Types pour l'API
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

interface CategoryStats {
  id: string;
  name: string;
  description?: string;
  count: number;
}

interface CategoryStatsResponse {
  data: CategoryStats[];
}

// Types pour l'affichage
type DisplayCategory = {
  id: string;
  name: string;
  count: number;
  icon: string;
};

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  avatar: string;
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<DisplayCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Mapping des catégories avec leurs icônes
  const categoryIcons: { [key: string]: string } = {
    'Anime': '🎌',
    'Marvel': '🦸',
    'Star Wars': '⚔️',
    'DC Comics': '🦇',
    'Jeux Vidéo': '🎮',
    'Films & Séries': '🎬',
    'Dragons': '🐉',
    'Fantasy': '🧙‍♂️',
    'Manga': '📚',
    'Superhéros': '🦸‍♀️'
  };

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les produits et les catégories en parallèle
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories/stats`)
        ]);
        
        if (productsResponse.ok) {
          const productsData: ApiResponse = await productsResponse.json();
          // Prendre les 6 premiers produits comme "featured"
          setFeaturedProducts(productsData.data.slice(0, 6));
        }
        
        if (categoriesResponse.ok) {
          const categoriesData: CategoryStatsResponse = await categoriesResponse.json();
          // Convertir en format d'affichage avec icônes
          const displayCategories: DisplayCategory[] = categoriesData.data.map((cat) => ({
            id: cat.id,
            name: cat.name,
            count: cat.count,
            icon: categoryIcons[cat.name] || '📦'
          }));
          setCategories(displayCategories);
        } else {
          // Fallback: créer les catégories basées sur les produits si l'API categories échoue
          if (productsResponse.ok) {
            const productsData: ApiResponse = await productsResponse.json();
            const categoryMap = new Map<string, { count: number; id: string }>();
            
            productsData.data.forEach(product => {
              const categoryName = product.categories?.name || 'Autres';
              const categoryId = product.categories?.id || 'other';
              const existing = categoryMap.get(categoryName);
              categoryMap.set(categoryName, {
                count: (existing?.count || 0) + 1,
                id: existing?.id || categoryId
              });
            });
            
            const displayCategories: DisplayCategory[] = Array.from(categoryMap.entries()).map(([name, data]) => ({
              id: data.id,
              name,
              count: data.count,
              icon: categoryIcons[name] || '📦'
            }));
            
            setCategories(displayCategories);
          }
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
        
        // Fallback vers les données statiques en cas d'erreur
        setFeaturedProducts([]);
        setCategories([
          { id: 'anime', name: "Anime", count: 0, icon: "🎌" },
          { id: 'marvel', name: "Marvel", count: 0, icon: "🦸" },
          { id: 'star-wars', name: "Star Wars", count: 0, icon: "⚔️" },
          { id: 'dc', name: "DC Comics", count: 0, icon: "🦇" },
          { id: 'gaming', name: "Jeux Vidéo", count: 0, icon: "🎮" },
          { id: 'movies', name: "Films & Séries", count: 0, icon: "🎬" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Données statiques qui restent fixes
  const testimonials: Testimonial[] = [
    {
      quote: "La plus belle figurine de ma collection, livraison ultra rapide !",
      author: "Thomas L.",
      role: "Collectionneur",
      avatar: "👤"
    },
    {
      quote: "Vendeur sérieux, produit conforme à la description. Je recommande !",
      author: "Sophie M.",
      role: "Acheteuse",
      avatar: "👩"
    },
    {
      quote: "Plateforme intuitive pour vendre mes créations. Très satisfait des ventes.",
      author: "Marc D.",
      role: "Vendeur",
      avatar: "👨‍🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar globale via layout */}

      {/* Hero Section */}
      <div className="relative bg-indigo-700">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Découvrez notre collection exclusive de figurines
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
            La plus belle sélection de figurines de collection, soigneusement sélectionnées pour les passionnés.
          </p>
          <div className="mt-10">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10"
            >
              Découvrir la collection
            </Link>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 bg-white text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="py-12 bg-red-50 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Categories */}
          <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Nos univers
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  Explorez nos différentes gammes de figurines
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="group bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 text-center"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {category.count} article{category.count !== 1 ? 's' : ''}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Products */}
          <div className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Nos dernières arrivées
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  Les figurines récemment ajoutées à notre collection
                </p>
              </div>

              {featuredProducts.length === 0 ? (
                <div className="mt-10 text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500">Aucun produit disponible pour le moment</p>
                </div>
              ) : (
                <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {featuredProducts.map((product) => (
                    <div key={product.id} className="group relative bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover object-center" />
                          ) : (
                            <span>🖼️</span>
                          )}
                        </div>
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
                            <p className="mt-2 text-xs text-gray-400 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
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
              )}

              <div className="mt-10 text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Voir toutes les figurines
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Testimonials */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Ce que disent nos clients
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-3xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <p className="mt-4 font-medium text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Prêt à commencer votre collection ?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Découvrez nos dernières arrivées et trouvez la figurine de vos rêves.
          </p>
          <Link
            href="/products"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Voir tous les produits
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Boutique</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/products" className="text-base text-gray-500 hover:text-gray-900">Toutes les figurines</Link></li>
                <li><Link href="/categories" className="text-base text-gray-500 hover:text-gray-900">Catégories</Link></li>
                <li><Link href="/new-arrivals" className="text-base text-gray-500 hover:text-gray-900">Nouveautés</Link></li>
                <li><Link href="/deals" className="text-base text-gray-500 hover:text-gray-900">Promotions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Vendre</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/sell" className="text-base text-gray-500 hover:text-gray-900">Vendre une figurine</Link></li>
                <li><Link href="/seller-guide" className="text-base text-gray-500 hover:text-gray-900">Guide du vendeur</Link></li>
                <li><Link href="/fees" className="text-base text-gray-500 hover:text-gray-900">Frais de vente</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">À propos</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/about" className="text-base text-gray-500 hover:text-gray-900">Notre histoire</Link></li>
                <li><Link href="/blog" className="text-base text-gray-500 hover:text-gray-900">Blog</Link></li>
                <li><Link href="/careers" className="text-base text-gray-500 hover:text-gray-900">Carrières</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Aide</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/help" className="text-base text-gray-500 hover:text-gray-900">Centre d'aide</Link></li>
                <li><Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">Nous contacter</Link></li>
                <li><Link href="/shipping" className="text-base text-gray-500 hover:text-gray-900">Livraison</Link></li>
                <li><Link href="/returns" className="text-base text-gray-500 hover:text-gray-900">Retours</Link></li>
              </ul>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} FigurineStore. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
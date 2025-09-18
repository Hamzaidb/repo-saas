import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
};

type Category = {
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
  const featuredProducts: Product[] = [
    {
      id: 1,
      name: "Figurine Dragon Ball Z - Son Goku",
      price: 49.99,
      category: "Anime",
      rating: 4.8,
      image: "/placeholder-figurine-1.jpg"
    },
    {
      id: 2,
      name: "Figurine Marvel - Iron Man Mark L",
      price: 89.99,
      category: "Marvel",
      rating: 4.9,
      image: "/placeholder-figurine-2.jpg"
    },
    {
      id: 3,
      name: "Figurine Star Wars - Dark Vador",
      price: 69.99,
      category: "Star Wars",
      rating: 4.7,
      image: "/placeholder-figurine-3.jpg"
    },
  ];

  const categories: Category[] = [
    { name: "Anime", count: 1245, icon: "🎌" },
    { name: "Marvel", count: 876, icon: "🦸" },
    { name: "Star Wars", count: 932, icon: "⚔️" },
    { name: "DC Comics", count: 654, icon: "🦇" },
    { name: "Jeux Vidéo", count: 754, icon: "🎮" },
    { name: "Films & Séries", count: 543, icon: "🎬" },
  ];

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
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">FigurineStore</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-indigo-600">Boutique</Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600">À propos</Link>
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
                key={category.name}
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 text-center"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{category.count} articles</p>
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
              Nos meilleures ventes
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Les figurines préférées de nos clients
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center" />
                    ) : (
                      <span>🖼️</span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/product/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{product.price.toFixed(2)} €</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-xs text-gray-500">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

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

import Image from 'next/image';
import { notFound } from 'next/navigation';

// Type pour un produit
type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  rating: number;
  stock: number;
  images: string[];
  details: string[];
};

// Fonction pour récupérer un produit par son ID (à remplacer par un appel API réel)
async function getProduct(id: string): Promise<Product | null> {
  // Simulation de données
  const products: Product[] = [
    {
      id: '1',
      name: 'Figurine Dragon Ball Z - Son Goku',
      price: 49.99,
      description: 'Figurine officielle Dragon Ball Z de Son Goku en Super Saiyan, édition limitée avec base de présentation.',
      category: 'Anime',
      rating: 4.8,
      stock: 15,
      images: [
        '/placeholder-figurine-1.jpg',
        '/placeholder-figurine-2.jpg',
        '/placeholder-figurine-3.jpg'
      ],
      details: [
        'Hauteur: 25cm',
        'Matière: PVC de haute qualité',
        'Peinture à la main',
        'Base incluse',
        'Emballage: Boîte fenêtrée'
      ]
    },
    // Ajoutez d'autres produits selon vos besoins
  ];

  return products.find(product => product.id === id) || null;
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Galerie d'images */}
          <div className="space-y-4">
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover object-center"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div key={index} className="aspect-square rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={image}
                    alt={`${product.name} - Vue ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Détails du produit */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Informations produit</h2>
              <p className="text-3xl text-gray-900">
                {product.price.toFixed(2)} €
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {product.stock > 0 
                  ? `${product.stock} en stock` 
                  : 'Rupture de stock'}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 space-y-3">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Détails</h3>
              <div className="mt-4">
                <ul role="list" className="pl-4 list-disc text-sm space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="text-gray-600">
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <div className="mt-4 flex">
                <button
                  type="submit"
                  className={`max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                </button>
              </div>
              <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  Livraison sous 2-3 jours ouvrés<br />
                  <span className="text-indigo-600 font-medium">Retours gratuits sous 30 jours</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section avis */}
        <section aria-labelledby="reviews-heading" className="mt-16 sm:mt-24">
          <div className="border-t border-gray-200 pt-10">
            <h2 id="reviews-heading" className="text-lg font-medium text-gray-900">
              Avis clients
            </h2>

            <div className="mt-6 space-y-10">
              <div className="flex flex-col sm:flex-row">
                <div className="order-2 mt-6 sm:mt-0 sm:ml-16">
                  <h3 className="text-sm font-medium text-gray-900">
                    Excellent produit
                  </h3>
                  <p className="sr-only">5 étoiles</p>
                  <div className="mt-3 space-y-6 text-sm text-gray-600">
                    <p>
                      La qualité de cette figurine est exceptionnelle. Les détails sont incroyables et la peinture est parfaite.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

// Type pour un produit (adapté à votre API)
type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category_id: number;
  categories?: {
    id: number;
    name: string;
  };
  rating?: number;
  stock: number;
  images?: string[];
  image_url?: string; 
  details?: string[];
  created_at: string;
  updated_at: string;
};

// Fonction pour récupérer un produit par son ID
async function getProduct(id: string): Promise<Product | null> {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
    const response = await fetch(`${apiBaseUrl}/products/${id}`, {
      cache: 'no-store', 
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const rawImages: string[] = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image_url ? [product.image_url] : ['/placeholder-product.jpg']);

  const productImages = rawImages
    .filter((u) => typeof u === 'string' && u.length > 0)
    .map((u) => (u.startsWith('http://') || u.startsWith('https://') ? u : (u.startsWith('/') ? u : `/${u}`)));

  const productDetails = product.details && product.details.length > 0
    ? product.details
    : ['Produit de qualité', 'Livraison rapide', 'Garantie fabricant'];

  const hasRating = typeof product.rating === 'number';
  const ratingValue = hasRating ? (product.rating as number) : 0;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="space-y-4">
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
              <Image
                src={productImages[0]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover object-center"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.slice(0, 4).map((image, index) => (
                <div key={`${image}-${index}`} className="aspect-square rounded-md overflow-hidden border border-gray-200">
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

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>

            {product.categories && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {product.categories.name}
                </span>
              </div>
            )}

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

            {hasRating && (
              <div className="mt-3 flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <svg
                      key={rating}
                      className={`${
                        ratingValue > rating ? 'text-yellow-400' : 'text-gray-200'
                      } h-5 w-5 flex-shrink-0`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-900">{ratingValue.toFixed(1)}</p>
              </div>
            )}

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
                  {productDetails.map((detail, index) => (
                    <li key={index} className="text-gray-600">
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <div className="mt-4 flex cursor-pointer">
                <AddToCartButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image_url={productImages[0]}
                  defaultQuantity={1}
                  goToCartOnAdd
                />
              </div>
              <div className="mt-6 flex justify-items-start text-sm text-center text-gray-500">
                <p>
                  Livraison sous 2-3 jours ouvrés<br />
                  <span className="text-indigo-600 font-medium">Retours gratuits sous 30 jours</span>
                </p>
              </div>
            </div>
          </div>
        </div>

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
                      La qualité de ce produit est exceptionnelle. Très satisfait de mon achat !
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
import { Package, Clock, CheckCircle, Heart, Star, Truck } from 'lucide-react';

const recentOrders = [
  { id: 'ORD-1234', date: '15 Sep 2023', status: 'En cours', total: '149,98 €', items: 2 },
  { id: 'ORD-1233', date: '10 Sep 2023', status: 'Livré', total: '89,99 €', items: 1 },
  { id: 'ORD-1232', date: '05 Sep 2023', status: 'Annulé', total: '199,97 €', items: 3 },
];

const wishlist = [
  { id: 1, name: 'Figurine Dragon Ball Z - Vegeta', price: '59,99 €', image: '/placeholder-figurine-4.jpg' },
  { id: 2, name: 'Figurine Marvel - Spider-Man', price: '69,99 €', image: '/placeholder-figurine-5.jpg' },
];

export default function BuyerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Compte</h1>
        <p className="mt-1 text-sm text-gray-500">Bienvenue dans votre espace personnel</p>
      </div>

      {/* Commandes récentes */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Mes commandes</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Voir tout l'historique
          </button>
        </div>
        
        <div className="mt-4">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande récente</h3>
              <p className="mt-1 text-sm text-gray-500">Commencez à magasiner pour découvrir nos produits.</p>
              <div className="mt-6">
                <a
                  href="/products"
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Voir les produits
                </a>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Commande
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.items} article{order.items > 1 ? 's' : ''}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{order.date}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === 'Livré' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'Annulé'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{order.total}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <a href={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                          Voir les détails
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Liste de souhaits */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Ma liste de souhaits</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Voir tout
            </button>
          </div>
          
          <div className="mt-4 space-y-4">
            {wishlist.length === 0 ? (
              <div className="text-center py-4">
                <Heart className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Votre liste de souhaits est vide</p>
              </div>
            ) : (
              wishlist.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        <a href={`/products/${item.id}`}>{item.name}</a>
                      </h4>
                      <p className="mt-1 text-sm font-medium text-gray-900">{item.price}</p>
                    </div>
                  </div>
                  <button className="ml-4 text-red-600 hover:text-red-500">
                    <span className="sr-only">Retirer de la liste de souhaits</span>
                    <Heart className="h-5 w-5" aria-hidden="true" fill="currentColor" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Adresses */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Mes adresses</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Gérer
            </button>
          </div>
          
          <div className="mt-4">
            <div className="rounded-md border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900">Adresse de livraison par défaut</h3>
              <p className="mt-1 text-sm text-gray-500">
                123 Rue des Figurines<br />
                75001 Paris, France
              </p>
              <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

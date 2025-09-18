import { CreditCard, Package, CheckCircle, Truck } from 'lucide-react';

const stats = [
  { name: 'Commandes en cours', value: '3', icon: Truck, change: '+12%', changeType: 'increase' },
  { name: 'Collection', value: '24', icon: Package, change: '+4', changeType: 'increase' },
  { name: 'Dépenses totales', value: '1,234.50 €', icon: CreditCard, change: '+19.8%', changeType: 'decrease' },
  { name: 'Commandes terminées', value: '15', icon: CheckCircle, change: '+2', changeType: 'increase' },
];

const recentActivity = [
  { id: 1, type: 'commande', description: 'Commande #1234 expédiée', date: 'Il y a 2 heures', status: 'expédiée' },
  { id: 2, type: 'paiement', description: 'Paiement reçu pour la commande #1233', date: 'Il y a 1 jour', status: 'payé' },
  { id: 3, type: 'commande', description: 'Nouvelle commande #1235', date: 'Il y a 2 jours', status: 'en attente' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">Bienvenue sur votre espace personnel.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Activité récente</h3>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-b-lg">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.date}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {activity.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 px-6 py-3 text-right">
            <a href="/dashboard/activity" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Voir toute l'activité
            </a>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Actions rapides</h3>
        </div>
        <div className="bg-white p-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/products"
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Voir la boutique
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    Explorer les nouvelles figurines
                  </dd>
                </div>
              </div>
            </div>
          </a>
          {/* Add more quick action cards here */}
        </div>
      </div>
    </div>
  );
}

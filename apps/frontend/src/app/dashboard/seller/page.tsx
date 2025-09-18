import { CreditCard, Package, CheckCircle, Truck, Users, BarChart } from 'lucide-react';

const stats = [
  { name: 'Commandes en cours', value: '3', icon: Truck, change: '+12%', changeType: 'increase' },
  { name: 'Produits en vente', value: '24', icon: Package, change: '+4', changeType: 'increase' },
  { name: 'Revenus (30j)', value: '1,234.50 €', icon: CreditCard, change: '+19.8%', changeType: 'increase' },
  { name: 'Clients actifs', value: '42', icon: Users, change: '+5', changeType: 'increase' },
];

const recentActivity = [
  { id: 1, type: 'commande', description: 'Commande #1234 expédiée', date: 'Il y a 2 heures', status: 'expédiée' },
  { id: 2, type: 'paiement', description: 'Paiement reçu pour la commande #1233', date: 'Il y a 1 jour', status: 'payé' },
  { id: 3, type: 'commande', description: 'Nouvelle commande #1235', date: 'Il y a 2 jours', status: 'en attente' },
];

export default function SellerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Vendeur</h1>
        <p className="mt-1 text-sm text-gray-500">Vue d'ensemble de votre activité commerciale</p>
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

      {/* Grille principale */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activité récente */}
        <div className="lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Activité récente</h2>
            <div className="mt-4 space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {activity.type === 'commande' && (
                        <Truck className="h-5 w-5 text-blue-500" />
                      )}
                      {activity.type === 'paiement' && (
                        <CreditCard className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Graphique des ventes */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Ventes des 7 derniers jours</h2>
          <div className="mt-4 flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-500">Graphique des ventes à venir</p>
          </div>
        </div>
      </div>
    </div>
  );
}

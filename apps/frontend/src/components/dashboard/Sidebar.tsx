'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ShoppingCart, Users, Settings, LogOut } from 'lucide-react';

// Changer les chemins pour qu'ils soient relatifs
const navigation = [
  { name: 'Tableau de bord', href: '.', icon: Home },  // Chemin relatif
  { name: 'Mes Commandes', href: 'orders', icon: ShoppingCart },
  { name: 'Ma Collection', href: 'collection', icon: Package },
  { name: 'Mon Profil', href: 'profile', icon: Users },
  { name: 'Paramètres', href: 'settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-blue-600">FigurineStore</span>
        </div>
        
        {/* Navigation */}
        <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-gray-400'
                    }`} 
                    aria-hidden="true" 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Bottom Navigation */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50">
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

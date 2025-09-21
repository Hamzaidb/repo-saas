'use client';

import { useState } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

export function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher des figurines..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="sr-only">Voir les notifications</span>
            <div className="relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </div>
          </button>

          {/* Profile dropdown */}
          <div className="relative ml-3">
            <div>
              <button
                type="button"
                className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="user-menu"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="sr-only">Ouvrir le menu utilisateur</span>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline">
                  Mon Compte
                </span>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-400 hidden md:inline" />
              </button>
            </div>

            {/* Dropdown menu */}
            {isProfileOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1" role="none">
                  <a
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Mon Profil
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Paramètres
                  </a>
                  <a
                    href="/api/auth/signout"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Se déconnecter
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

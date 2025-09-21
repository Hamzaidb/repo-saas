"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
          router.push('/login');
          return;
        }
        if (!user) {
          router.push('/login');
          return;
        }
        setUser(user);
        setProfileName((user.user_metadata as any)?.name ?? '');
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/login');
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: profileName },
      });
      if (error) throw error;
      setMessage('Profil mis à jour avec succès.');
      // Rafraîchir localement l'utilisateur
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== password2) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword('');
      setPassword2('');
      setMessage('Mot de passe mis à jour avec succès.');
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du mot de passe");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Baseline metrics (placeholders, à remplacer par des vraies données)
  const lastLogin = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('fr-FR') : 'N/A';
  const metrics = {
    commandesTotal: 0,
    depenseTotaleEUR: 0,
    derniereConnexion: lastLogin,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec déconnexion */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Dashboard
            </h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Vue d'ensemble du compte */}
            <h2 className="text-xl font-semibold text-gray-900">
              Bienvenue, {user.user_metadata?.name || user.email} !
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Voici votre espace personnel.
            </p>

            {/* Informations utilisateur */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informations du compte
              </h3>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dernière connexion</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {lastLogin}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Compte créé</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleString('fr-FR')}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Métriques basiques d'utilisation */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-500">Commandes totales</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{metrics.commandesTotal}</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-500">Dépense totale</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{metrics.depenseTotaleEUR.toFixed(2)} €</p>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-500">Dernière connexion</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 text-base">{metrics.derniereConnexion}</p>
                </div>
              </div>
            </div>

            {/* Section paramètres du compte */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <form onSubmit={handleUpdateProfile} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres du profil</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'affichage</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {savingProfile ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                  </div>
                </div>
              </form>

              <form onSubmit={handleChangePassword} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={changingPassword}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {changingPassword ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {(message || error) && (
              <div className="mt-4">
                {message && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800 text-sm">{message}</div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm">{error}</div>
                )}
              </div>
            )}

            {/* Anciennes cartes d'information (exemples) */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Mes commandes
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Suivez l'état de vos commandes en cours
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Mes informations
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Gérez vos informations personnelles
                  </p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Adresses
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Gérez vos adresses de livraison
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const router = useRouter();
  
  // Créer le client Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setSuccess('Connexion réussie ! Redirection...');
        router.push('/dashboard');
        
      }
    } catch (err: any) {
      setError(
        err.message === 'Invalid login credentials' 
          ? 'Email ou mot de passe incorrect'
          : err.message || 'Erreur lors de la connexion'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion avec Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion à votre compte
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <span className="text-green-800 text-sm">{success}</span>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            
          </div>
<div className="flex justify-center">
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                Mot de passe oublié ?
              </Link>
            </div>
          <div className="space-y-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 px-4 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50"
            >
              Continuer avec Google
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
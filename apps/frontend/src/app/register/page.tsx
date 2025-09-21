'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Créer le client Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations côté client
    if (formData.password !== formData.confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }

    if (formData.password.length < 8) {
      return setError('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (formData.name.trim().length < 2) {
      return setError('Le nom doit contenir au moins 2 caractères');
    }

    setLoading(true);

    try {
      // 1. Créer l'utilisateur avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // 2. Créer l'enregistrement dans votre table users via votre API
        const userResponse = await fetch('http://localhost:3001/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: authData.user.id, // Utiliser l'ID Supabase Auth
            email: formData.email,
            name: formData.name,
            password: 'supabase_managed', // Placeholder car le mot de passe est géré par Supabase
          }),
        });

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.error || 'Erreur lors de la création du profil utilisateur');
        }

        const userData = await userResponse.json();

        // 3. Envoyer l'email de vérification (automatique via Supabase)
        // Supabase gère déjà cela automatiquement

        // 4. Envoyer l'email de bienvenue personnalisé
        try {
          await fetch('http://localhost:3001/auth/send-welcome', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: authData.user.id
            }),
          });
        } catch (emailError) {
          // Ne pas faire échouer l'inscription si l'email de bienvenue échoue
          console.warn('Email de bienvenue non envoyé:', emailError);
        }

        setSuccess(
          'Compte créé avec succès ! ' +
          'Vérifiez votre email pour confirmer votre inscription. ' +
          'Un email de bienvenue vous a également été envoyé.'
        );
        
        // Redirection après quelques secondes
        setTimeout(() => {
          router.push('/login?message=account-created');
        }, 4000);
      }
    } catch (err: any) {
      console.error('Erreur d\'inscription:', err);
      
      // Messages d'erreur spécifiques
      if (err.message?.includes('already registered') || err.message?.includes('already been registered')) {
        setError('Cette adresse email est déjà utilisée');
      } else if (err.message?.includes('Invalid email')) {
        setError('Adresse email invalide');
      } else if (err.message?.includes('Password') || err.message?.includes('password')) {
        setError('Le mot de passe ne respecte pas les critères requis (8 caractères minimum)');
      } else if (err.message?.includes('signup')) {
        setError('Erreur lors de la création du compte. Veuillez réessayer.');
      } else {
        setError(err.message || 'Une erreur est survenue lors de l\'inscription');
      }
    } finally {
      setLoading(false);
    }
  };

  // Connexion avec google (non utilisé en ce moment)
  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription avec Google');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <span className="text-red-400 mr-2">❌</span>
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <span className="text-green-400 mr-2">✅</span>
              <div className="text-green-800 text-sm">
                <p>{success}</p>
                <p className="mt-2 text-xs">Redirection automatique dans quelques secondes...</p>
              </div>
            </div>
          </div>
        )}


        
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder="Votre nom complet"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder="Minimum 8 caractères"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Le mot de passe doit contenir au moins 8 caractères
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                placeholder="Confirmez votre mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création du compte...
                </span>
              ) : (
                'Créer un compte'
              )}
            </button>
{/*
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Ou</span>
              </div>
            </div>

              
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full py-3 px-4 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="mr-2">🔍</span>
              S'inscrire avec Google
            </button>*/}
          </div>
        </form>

        <div className="text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

interface PasswordStrength {
  score: number;
  feedback: string[];
  isStrong: boolean;
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');

  // Configuration de l'API et Supabase
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  
  // Créer le client Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fonction pour évaluer la force du mot de passe
  const checkPasswordStrength = (pwd: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (pwd.length >= 8) score += 1;
    else if (pwd.length > 0) feedback.push('Doit contenir au moins 8 caractères');

    if (pwd.length >= 12) score += 1;

    if (/[a-z]/.test(pwd)) score += 1;
    else if (pwd.length > 0) feedback.push('Doit contenir au moins une lettre minuscule');

    if (/[A-Z]/.test(pwd)) score += 1;
    else if (pwd.length > 0) feedback.push('Doit contenir au moins une lettre majuscule');

    if (/\d/.test(pwd)) score += 1;
    else if (pwd.length > 0) feedback.push('Doit contenir au moins un chiffre');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(pwd)) {
      score += 1;
    }

    return {
      score,
      feedback,
      isStrong: score >= 4
    };
  };

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Lien de réinitialisation invalide ou incomplet');
        return;
      }

      try {
        // Vérifier le token JWT avec votre API
        const response = await fetch(
          `${API_BASE_URL}/auth/verify-reset-token?token=${encodeURIComponent(token)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Token invalide ou expiré');
        }

        // Décoder le token JWT côté client pour récupérer l'email
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          setUserEmail(tokenPayload.email);
        } catch (decodeError) {
          console.warn('Impossible de décoder le token:', decodeError);
        }

        setValidToken(true);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
        setError(errorMessage);
        console.error('Token verification error:', err);
      }
    };

    verifyToken();
  }, [token, API_BASE_URL]);

  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength(null);
    }
  }, [password]);

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 2) return 'Faible';
    if (score <= 3) return 'Moyen';
    if (score <= 4) return 'Bon';
    return 'Excellent';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validations côté client
    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }

    if (!passwordStrength?.isStrong) {
      return setError('Le mot de passe ne respecte pas les critères de sécurité requis');
    }

    setLoading(true);

    try {
      // 1. Vérifier le token une dernière fois avec votre API
      const tokenResponse = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenData.success) {
        throw new Error(tokenData.message || 'Token invalide');
      }

      // 2. Décoder le token pour récupérer les informations
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      
      // Vérifier si votre token JWT contient les informations de session Supabase
      if (tokenPayload.access_token && tokenPayload.refresh_token) {
        // Restaurer la session avec les tokens Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: tokenPayload.access_token,
          refresh_token: tokenPayload.refresh_token
        });

        if (sessionError) {
          throw new Error(`Erreur de session: ${sessionError.message}`);
        }

        // Maintenant mettre à jour le mot de passe
        const { error: updateError } = await supabase.auth.updateUser({
          password: password
        });

        if (updateError) {
          throw new Error(`Erreur lors de la mise à jour: ${updateError.message}`);
        }
      } else {
        // Utiliser l'API REST de Supabase directement
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'apikey': supabaseKey!
          },
          body: JSON.stringify({
            password: password
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la mise à jour du mot de passe');
        }
      }

      setMessage('Votre mot de passe a été réinitialisé avec succès ! Redirection vers la page de connexion...');
      
      // Déconnecter l'utilisateur pour forcer une nouvelle connexion
      await supabase.auth.signOut();
      
      // Redirection après 3 secondes
      setTimeout(() => {
        router.push('/login?message=password-reset-success');
      }, 3000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
      setError(errorMessage);
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  // États de chargement et d'erreur
  if (!validToken && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Vérification du lien de réinitialisation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Lien invalide
            </h2>
            <p className="mt-2 text-center text-gray-600">{error}</p>
            <div className="mt-6 space-y-2">
              <div>
                <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  Demander un nouveau lien de réinitialisation
                </Link>
              </div>
              <div>
                <Link href="/login" className="font-medium text-gray-600 hover:text-gray-500 transition-colors">
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2v6m0 0V9a2 2 0 00-2-2M9 7a2 2 0 00-2 2v6a2 2 0 002 2h6M9 7V5a2 2 0 012-2h4a2 2 0 012 2v2M9 7h6" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Définir un nouveau mot de passe
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {userEmail ? `Nouveau mot de passe pour ${userEmail}` : 'Choisissez un mot de passe sécurisé'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {message ? (
          <div className="space-y-4">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                href="/login" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Aller à la page de connexion maintenant
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Entrez votre nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                
                {/* Indicateur de force du mot de passe */}
                {passwordStrength && password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="text-xs text-gray-600 space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                  placeholder="Confirmez votre nouveau mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                
                {/* Validation de confirmation */}
                {confirmPassword && password && (
                  <div className="mt-2">
                    {password === confirmPassword ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs">Les mots de passe correspondent</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-red-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs">Les mots de passe ne correspondent pas</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !passwordStrength?.isStrong || password !== confirmPassword}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                  loading || !passwordStrength?.isStrong || password !== confirmPassword
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Traitement en cours...' : 'Réinitialiser le mot de passe'}
              </button>
            </div>
          </form>
        )}

        <div className="text-sm text-center">
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            ← Retour à la page de connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
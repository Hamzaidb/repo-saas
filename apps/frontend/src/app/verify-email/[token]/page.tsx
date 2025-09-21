'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Vérification de votre email en cours...');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Lien de vérification invalide ou expiré');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Échec de la vérification de l\'email');
        }

        setStatus('success');
        setMessage('Votre email a été vérifié avec succès !');
        
        // Redirection automatique vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Une erreur est survenue lors de la vérification de l\'email');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'verifying' && (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
          
          {status === 'success' && (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {status === 'verifying' && 'Vérification en cours'}
            {status === 'success' && 'Email vérifié !'}
            {status === 'error' && 'Erreur de vérification'}
          </h2>
          
          <p className="mt-2 text-center text-gray-600">
            {message}
          </p>
          
          {status === 'success' && (
            <div className="mt-4">
              <div className="text-sm text-gray-500">
                Redirection vers la page de connexion...
              </div>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-6">
              <Link 
                href="/register" 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Retour à la page d'inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

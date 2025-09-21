import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Types pour les différents tokens
export interface EmailVerificationPayload {
  userId: string;
  email: string;
  type: 'email_verification';
}

export interface PasswordResetPayload {
  userId: string;
  email: string;
  type: 'password_reset';
}

/**
 * Génère un token JWT pour la vérification d'email
 */
export function generateEmailVerificationToken(userId: string, email: string): string {
  const payload: EmailVerificationPayload = {
    userId,
    email,
    type: 'email_verification'
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '6h',
    issuer: 'votre-app',
    audience: 'email-verification'
  });
}

/**
 * Génère un token JWT pour la réinitialisation de mot de passe
 */
export function generatePasswordResetToken(userId: string, email: string): string {
  const payload: PasswordResetPayload = {
    userId,
    email,
    type: 'password_reset'
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '1h',
    issuer: 'votre-app',
    audience: 'password-reset'
  });
}

/**
 * Vérifie et décode un token de vérification d'email
 */
export function verifyEmailVerificationToken(token: string): EmailVerificationPayload {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'votre-app',
      audience: 'email-verification'
    }) as EmailVerificationPayload;

    if (payload.type !== 'email_verification') {
      throw new Error('Type de token invalide');
    }

    return payload;
  } catch (error) {
    throw new Error('Token de vérification invalide ou expiré');
  }
}

/**
 * Vérifie et décode un token de réinitialisation de mot de passe
 */
export function verifyPasswordResetToken(token: string): PasswordResetPayload {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: 'votre-app',
      audience: 'password-reset'
    }) as PasswordResetPayload;

    if (payload.type !== 'password_reset') {
      throw new Error('Type de token invalide');
    }

    return payload;
  } catch (error) {
    throw new Error('Token de réinitialisation invalide ou expiré');
  }
}

/**
 * Génère une URL de vérification d'email
 */
export function generateEmailVerificationUrl(userId: string, email: string): string {
  const token = generateEmailVerificationToken(userId, email);
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${baseUrl}/verify-email?token=${token}`;
}

/**
 * Génère une URL de réinitialisation de mot de passe
 */
export function generatePasswordResetUrl(userId: string, email: string): string {
  const token = generatePasswordResetToken(userId, email);
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${baseUrl}/reset-password?token=${token}`;
}
import bcrypt from 'bcrypt';

// Configuration
const SALT_ROUNDS = 12;

/**
 * Hache un mot de passe avec bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Vérifie si un mot de passe correspond à son hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Vérifie la force d'un mot de passe
 */
export function checkPasswordStrength(password: string): {
  isStrong: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Longueur
  if (password.length >= 8) score += 1;
  else feedback.push('Doit contenir au moins 8 caractères');

  if (password.length >= 12) score += 1;

  // Caractères minuscules
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Doit contenir au moins une lettre minuscule');

  // Caractères majuscules
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Doit contenir au moins une lettre majuscule');

  // Chiffres
  if (/\d/.test(password)) score += 1;
  else feedback.push('Doit contenir au moins un chiffre');

  // Caractères spéciaux
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Recommandé : ajouter des caractères spéciaux');
  }

  // Pas de répétitions
  if (!/(.)\1{2,}/.test(password)) {
    score += 1;
  } else {
    feedback.push('Éviter les caractères répétés');
  }

  return {
    isStrong: score >= 4,
    score,
    feedback,
  };
}

/**
 * Génère un mot de passe aléatoire sécurisé
 */
export function generateSecurePassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  let password = '';
  
  // Assurer au moins un caractère de chaque type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Remplir le reste aléatoirement
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mélanger les caractères
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}
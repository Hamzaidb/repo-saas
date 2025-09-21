import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password.utils';
import { emailService } from './email.service';
import { 
  generateEmailVerificationUrl, 
  generatePasswordResetUrl,
  verifyEmailVerificationToken,
  verifyPasswordResetToken
} from '../utils/jwt.utils';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  /**
   * 1. EMAIL DE BIENVENUE
   * Envoie un email de bienvenue après inscription
   */
  async sendWelcomeEmail(userId: string): Promise<void> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (!user) {
      throw new Error('Utilisateur introuvable');
    }

    const loginUrl = `${process.env.FRONTEND_URL}/login`;

    await emailService.sendWelcomeEmail({
      to: user.email,
      name: user.name,
      loginUrl
    });
  }

  /**
   * 2. VÉRIFICATION D'EMAIL
   * Envoie un email de vérification
   */
  async sendEmailVerification(userId: string): Promise<void> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { email: true, name: true }
    });

    if (!user) {
      throw new Error('Utilisateur introuvable');
    }

    const verifyUrl = generateEmailVerificationUrl(userId, user.email);

    await emailService.sendVerificationEmail({
      to: user.email,
      name: user.name,
      verifyUrl,
      expiresIn: '6 heures'
    });
  }

  /**
   * Vérifie un email avec le token JWT
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const payload = verifyEmailVerificationToken(token);
      
      // Vérifier que l'utilisateur existe toujours
      const user = await this.prisma.users.findUnique({
        where: { id: payload.userId }
      });

      if (!user) {
        return { success: false, message: 'Utilisateur introuvable' };
      }

      if (user.email !== payload.email) {
        return { success: false, message: 'Email modifié depuis la création du token' };
      }

      // Marquer l'email comme vérifié (ajoutez ce champ à votre schéma si nécessaire)
      await this.prisma.users.update({
        where: { id: payload.userId },
        data: { 
          // email_verified: true,  // Ajoutez ce champ à votre schéma
          // email_verified_at: new Date()
        }
      });

      return { success: true, message: 'Email vérifié avec succès' };
    } catch (error) {
      return { success: false, message: 'Token invalide ou expiré' };
    }
  }

  /**
   * 3. RÉINITIALISATION DE MOT DE PASSE
   * Demande une réinitialisation (remplace votre système actuel)
   */
  async requestPasswordReset(email: string): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();

    const user = await this.prisma.users.findUnique({
      where: { email: cleanEmail },
      select: { id: true, email: true, name: true }
    });

    // Pour la sécurité, on ne révèle pas si l'email existe
    if (!user) {
      console.warn(`Tentative de reset pour email inexistant: ${cleanEmail}`);
      return; // Sortie silencieuse
    }

    const resetUrl = generatePasswordResetUrl(user.id, user.email);

    await emailService.sendResetPasswordEmail({
      to: user.email,
      name: user.name,
      resetUrl,
      expiresIn: '1 heure'
    });
  }

  /**
   * Vérifie un token de réinitialisation
   */
  async verifyPasswordResetToken(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const payload = verifyPasswordResetToken(token);
      
      const user = await this.prisma.users.findUnique({
        where: { id: payload.userId }
      });

      if (!user || user.email !== payload.email) {
        return { success: false, message: 'Token invalide' };
      }

      return { success: true, message: 'Token valide' };
    } catch (error) {
      return { success: false, message: 'Token invalide ou expiré' };
    }
  }

  /**
   * Réinitialise le mot de passe avec un token JWT
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const payload = verifyPasswordResetToken(token);
      
      const user = await this.prisma.users.findUnique({
        where: { id: payload.userId }
      });

      if (!user || user.email !== payload.email) {
        return { success: false, message: 'Token invalide' };
      }

      // IMPORTANT: Ici on ne modifie PAS le mot de passe en base
      // Car Supabase Auth gère les mots de passe automatiquement
      // On retourne juste le succès pour indiquer que le token était valide
      
      return { 
        success: true, 
        message: 'Token validé. Le mot de passe sera modifié côté client via Supabase Auth.' 
      };
    } catch (error) {
      return { success: false, message: 'Token invalide ou expiré' };
    }
  }
}

export const authService = new AuthService(new PrismaClient());
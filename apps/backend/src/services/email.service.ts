import { Resend } from 'resend';

// Types pour les différents emails
export interface WelcomeEmailData {
  to: string;
  name: string;
  loginUrl?: string;
}

export interface VerifyEmailData {
  to: string;
  name: string;
  verifyUrl: string;
  expiresIn: string;
}

export interface ResetPasswordEmailData {
  to: string;
  name: string;
  resetUrl: string;
  expiresIn: string;
}

export class EmailService {
  private resend: Resend;
  private fromEmail: string;
  private isProduction: boolean;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@votresite.com';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Envoie un email de bienvenue
   */
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const { to, name, loginUrl } = data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenue !</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #f8f9fa; }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            font-weight: bold;
            margin: 20px 0; 
          }
          .footer { padding: 20px; font-size: 12px; color: #666; text-align: center; background: #fff; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bienvenue ${name} !</h1>
            <p>Votre compte a été créé avec succès chez Figurinestore</p>
          </div>
          
          <div class="content">
            <h2>Bienvenue ! 🎊</h2>
            <p>Cliquez sur le bouton ci-dessous pour accéder à votre compte.</p>
            
            <p>Votre compte est maintenant actif et vous pouvez suivre vos commandes en toute tranquillité.</p>
            
            ${loginUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl}" class="button">Accéder à mon compte</a>
              </div>
            ` : ''}

            
            <p>Bonne découverte chez Figurinestore ! 🚀</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: `🎉 Bienvenue ${name} !`,
      html
    });
  }

  /**
   * Envoie un email de vérification
   */
  async sendVerificationEmail(data: VerifyEmailData): Promise<void> {
    const { to, name, verifyUrl, expiresIn } = data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vérifiez votre email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #f8f9fa; }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            font-weight: bold;
            margin: 20px 0; 
          }
          .warning { background: #fef3cd; border-left: 4px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { padding: 20px; font-size: 12px; color: #666; text-align: center; background: #fff; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Vérifiez votre email</h1>
            <p>Une dernière étape pour activer votre compte</p>
          </div>
          
          <div class="content">
            <p>Bonjour <strong>${name}</strong>,</p>
            
            <p>Pour finaliser la création de votre compte et accéder à toutes nos fonctionnalités, nous devons vérifier votre adresse email.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" class="button">✅ Vérifier mon email</a>
            </div>
            
            <div class="warning">
              <strong>⏰ Important :</strong> Ce lien expire dans <strong>${expiresIn}</strong>.
            </div>
            
            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #4f46e5; font-size: 14px;">${verifyUrl}</p>
            
            <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: `📧 Vérifiez votre adresse email`,
      html
    });
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   */
  async sendResetPasswordEmail(data: ResetPasswordEmailData): Promise<void> {
    const { to, name, resetUrl, expiresIn } = data;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de mot de passe</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px 20px; background: #f8f9fa; }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            font-weight: bold;
            margin: 20px 0; 
          }
          .warning { background: #fef3cd; border-left: 4px solid #fbbf24; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .security { background: #dcfce7; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .footer { padding: 20px; font-size: 12px; color: #666; text-align: center; background: #fff; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Réinitialisation de mot de passe</h1>
            <p>Demande de changement de mot de passe</p>
          </div>
          
          <div class="content">
            <p>Bonjour <strong>${name}</strong>,</p>
            
            <p>Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">🔑 Réinitialiser mon mot de passe</a>
            </div>
            
            <div class="warning">
              <strong>⏰ Attention :</strong> Ce lien expire dans <strong>${expiresIn}</strong> pour votre sécurité.
            </div>
            
            <p>Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :</p>
            <p style="word-break: break-all; color: #dc2626; font-size: 14px;">${resetUrl}</p>
            
            <div class="security">
              <strong>🛡️ Sécurité :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe actuel reste inchangé.
            </div>
          </div>
          
          <div class="footer">
            <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: `🔐 Réinitialisation de votre mot de passe`,
      html
    });
  }

  /**
   * Méthode privée pour envoyer un email via Resend
   */
  private async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
    console.log('🔍 Debug email service:', {
      nodeEnv: process.env.NODE_ENV,
      isProduction: this.isProduction,
      hasResendKey: !!process.env.RESEND_API_KEY,
      resendKeyLength: process.env.RESEND_API_KEY?.length,
      fromEmail: this.fromEmail,
      toEmail: to
    });

    if (!this.isProduction) {
      console.log('📧 Mode développement - Email simulé');
      console.log('📧 Email à envoyer:', {
        from: this.fromEmail,
        to,
        subject,
        preview: html.substring(0, 100) + '...'
      });
      return;
    }

    console.log('📤 Mode production - Envoi via Resend...');
    
    try {
      const emailData = {
        from: this.fromEmail,
        to,
        subject,
        html
      };
      
      console.log('📋 Données email à envoyer:', {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        htmlLength: emailData.html.length
      });

      const result = await this.resend.emails.send(emailData);
      
      console.log('📧 Réponse Resend complète:', JSON.stringify(result, null, 2));
      console.log('✅ Email envoyé avec succès, ID:', result.data?.id);
      
    } catch (error) {
      console.error('❌ Erreur Resend complète:', error);
      if (error instanceof Error) {
        console.error('❌ Message d\'erreur:', error.message);
        console.error('❌ Stack trace:', error.stack);
      }
      throw new Error('Impossible d\'envoyer l\'email: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  }
}

export const emailService = new EmailService();
import { FastifyInstance } from 'fastify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { authService } from '../services/simple-auth.service';

// Schémas de validation réutilisables
const emailSchema = z.string().email().toLowerCase().trim();
const passwordSchema = z.string().min(8);
const userIdSchema = z.string().min(1);
const tokenSchema = z.string().min(1);

export async function authRoutes(fastify: FastifyInstance) {
  
  // ===========================================
  // 1. EMAIL DE BIENVENUE
  // ===========================================
  
  fastify.post('/send-welcome', {
    schema: {
      description: 'Envoyer un email de bienvenue après inscription',
      tags: ['Email'],
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', description: 'ID de l\'utilisateur' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: { userId: string } }>, reply: FastifyReply) => {
    try {
      const schema = z.object({ userId: userIdSchema });
      const { userId } = schema.parse(request.body);

      await authService.sendWelcomeEmail(userId);

      return reply.status(200).send({
        success: true,
        message: 'Email de bienvenue envoyé avec succès'
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Données invalides',
          errors: error.issues
        });
      }

      request.log.error({ error, msg: 'Error in sendWelcomeEmail' });
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de bienvenue'
      });
    }
  });

  // ===========================================
  // 2. VÉRIFICATION D'EMAIL
  // ===========================================
  
  fastify.post('/send-verification', {
    schema: {
      description: 'Envoyer un email de vérification',
      tags: ['Email'],
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', description: 'ID de l\'utilisateur' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: { userId: string } }>, reply: FastifyReply) => {
    try {
      const schema = z.object({ userId: userIdSchema });
      const { userId } = schema.parse(request.body);

      await authService.sendEmailVerification(userId);

      return reply.status(200).send({
        success: true,
        message: 'Email de vérification envoyé avec succès'
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Données invalides',
          errors: error.issues
        });
      }

      request.log.error({ error, msg: 'Error in sendEmailVerification' });
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de vérification'
      });
    }
  });

  fastify.get('/verify-email', {
    schema: {
      description: 'Vérifier un email avec un token JWT',
      tags: ['Email'],
      querystring: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string', description: 'Token de vérification JWT' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply) => {
    try {
      const schema = z.object({ token: tokenSchema });
      const { token } = schema.parse(request.query);

      const result = await authService.verifyEmail(token);

      return reply.status(result.success ? 200 : 400).send(result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Token requis'
        });
      }

      request.log.error({ error, msg: 'Error in verifyEmail' });
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors de la vérification de l\'email'
      });
    }
  });

  // ===========================================
  // 3. RÉINITIALISATION DE MOT DE PASSE
  // ===========================================
  
  fastify.post('/forgot-password', {
    schema: {
      description: 'Demander une réinitialisation de mot de passe',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', description: 'Email de l\'utilisateur' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) => {
    try {
      const schema = z.object({ email: emailSchema });
      const { email } = schema.parse(request.body);

      await authService.requestPasswordReset(email);

      return reply.status(200).send({
        success: true,
        message: 'Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.'
      });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Email invalide',
          errors: error.issues
        });
      }

      request.log.error({ error, msg: 'Error in requestPasswordReset' });
      return reply.status(500).send({
        success: false,
        message: 'Erreur serveur interne'
      });
    }
  });

  fastify.get('/verify-reset-token', {
    schema: {
      description: 'Vérifier la validité d\'un token de réinitialisation',
      tags: ['Auth'],
      querystring: {
        type: 'object',
        required: ['token'],
        properties: {
          token: { type: 'string', description: 'Token de réinitialisation JWT' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply) => {
    try {
      const schema = z.object({ token: tokenSchema });
      const { token } = schema.parse(request.query);

      const result = await authService.verifyPasswordResetToken(token);

      return reply.status(result.success ? 200 : 400).send(result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Token requis'
        });
      }

      request.log.error({ error, msg: 'Error in verifyPasswordResetToken' });
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors de la vérification du token'
      });
    }
  });

  fastify.post('/reset-password', {
    schema: {
      description: 'Réinitialiser le mot de passe avec un token JWT',
      tags: ['Auth'],
      body: {
        type: 'object',
        required: ['token', 'password', 'confirmPassword'],
        properties: {
          token: { type: 'string', description: 'Token de réinitialisation JWT' },
          password: { type: 'string', minLength: 8, description: 'Nouveau mot de passe' },
          confirmPassword: { type: 'string', description: 'Confirmation du mot de passe' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: { token: string; password: string; confirmPassword: string } }>, reply: FastifyReply) => {
    try {
      const schema = z.object({
        token: tokenSchema,
        password: passwordSchema,
        confirmPassword: z.string()
      }).refine(data => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword']
      });

      const { token, password } = schema.parse(request.body);

      const result = await authService.resetPassword(token, password);

      return reply.status(result.success ? 200 : 400).send(result);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          message: 'Données invalides',
          errors: error.issues
        });
      }

      request.log.error({ error, msg: 'Error in resetPassword' });
      return reply.status(500).send({
        success: false,
        message: 'Erreur lors de la réinitialisation du mot de passe'
      });
    }
  });

  // ===========================================
  // 4. ROUTE UTILITAIRE (optionnelle)
  // ===========================================
  
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      success: true,
      message: 'Service d\'authentification opérationnel',
      timestamp: new Date().toISOString()
    });
  });
}
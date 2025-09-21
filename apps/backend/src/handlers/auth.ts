import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { authService } from '../services/simple-auth.service';

// Schémas de validation
const emailSchema = z.string().email().toLowerCase().trim();
const passwordSchema = z.string().min(8);

/**
 * Handler pour envoyer un email de bienvenue
 */
export async function sendWelcomeEmailHandler(
  request: FastifyRequest<{ Body: { userId: string } }>,
  reply: FastifyReply
) {
  try {
    const { userId } = request.body;

    if (!userId) {
      return reply.status(400).send({
        success: false,
        message: 'userId requis'
      });
    }

    await authService.sendWelcomeEmail(userId);

    return reply.status(200).send({
      success: true,
      message: 'Email de bienvenue envoyé'
    });
  } catch (error: unknown) {
    request.log.error({ error, msg: 'Error in sendWelcomeEmail' });
    return reply.status(500).send({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email'
    });
  }
}

/**
 * Handler pour envoyer un email de vérification
 */
export async function sendEmailVerificationHandler(
  request: FastifyRequest<{ Body: { userId: string } }>,
  reply: FastifyReply
) {
  try {
    const { userId } = request.body;

    if (!userId) {
      return reply.status(400).send({
        success: false,
        message: 'userId requis'
      });
    }

    await authService.sendEmailVerification(userId);

    return reply.status(200).send({
      success: true,
      message: 'Email de vérification envoyé'
    });
  } catch (error: unknown) {
    request.log.error({ error, msg: 'Error in sendEmailVerification' });
    return reply.status(500).send({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email'
    });
  }
}

/**
 * Handler pour vérifier un email
 */
export async function verifyEmailHandler(
  request: FastifyRequest<{ Querystring: { token: string } }>,
  reply: FastifyReply
) {
  try {
    const { token } = request.query;

    if (!token) {
      return reply.status(400).send({
        success: false,
        message: 'Token requis'
      });
    }

    const result = await authService.verifyEmail(token);

    return reply.status(result.success ? 200 : 400).send(result);
  } catch (error: unknown) {
    request.log.error({ error, msg: 'Error in verifyEmail' });
    return reply.status(500).send({
      success: false,
      message: 'Erreur lors de la vérification'
    });
  }
}

/**
 * Handler pour demander une réinitialisation de mot de passe (SIMPLIFIÉ)
 */
export async function requestPasswordResetHandler(
  request: FastifyRequest<{ Body: { email: string } }>,
  reply: FastifyReply
) {
  try {
    const schema = z.object({ email: emailSchema });
    const { email } = schema.parse(request.body);

    await authService.requestPasswordReset(email);

    return reply.status(200).send({
      success: true,
      message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation.'
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
      message: 'Erreur serveur'
    });
  }
}

/**
 * Handler pour vérifier un token de réinitialisation
 */
export async function verifyPasswordResetTokenHandler(
  request: FastifyRequest<{ Querystring: { token: string } }>,
  reply: FastifyReply
) {
  try {
    const { token } = request.query;

    if (!token) {
      return reply.status(400).send({
        success: false,
        message: 'Token requis'
      });
    }

    const result = await authService.verifyPasswordResetToken(token);

    return reply.status(result.success ? 200 : 400).send(result);
  } catch (error: unknown) {
    request.log.error({ error, msg: 'Error in verifyPasswordResetToken' });
    return reply.status(500).send({
      success: false,
      message: 'Erreur lors de la vérification du token'
    });
  }
}

/**
 * Handler pour réinitialiser le mot de passe (SIMPLIFIÉ)
 */
export async function resetPasswordHandler(
  request: FastifyRequest<{ Body: { token: string; password: string; confirmPassword: string } }>,
  reply: FastifyReply
) {
  try {
    const schema = z.object({
      token: z.string().min(1),
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
      message: 'Erreur lors de la réinitialisation'
    });
  }
}
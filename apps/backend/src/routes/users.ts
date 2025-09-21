import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodError } from 'zod';
import { authService } from '../services/simple-auth.service';

const createUserSchema = z.object({
  id: z.string().uuid(), 
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string(), 
});

export default async function userRoutes(fastify: FastifyInstance) {
  // POST /users - Créer un utilisateur
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userData = createUserSchema.parse(request.body);
      
      const user = await fastify.prisma.users.create({
        data: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          password: userData.password,
        },
      });

      // Envoyer l'email de bienvenue après création réussie
      try {
        await authService.sendWelcomeEmail(user.id);
        fastify.log.info(`Email de bienvenue envoyé à: ${user.email}`);
      } catch (emailError: unknown) {
        // Log l'erreur mais ne fait pas échouer la création de compte
        const emailErrorMessage = emailError instanceof Error ? emailError.message : 'Unknown email error';
        fastify.log.error(`Erreur envoi email bienvenue: ${emailErrorMessage}`);
      }
      
      reply.status(201).send({ 
        data: user,
        message: 'Utilisateur créé avec succès. Un email de bienvenue a été envoyé.'
      });
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        reply.status(400).send({ 
          error: 'Invalid user data', 
          details: error.issues 
        });
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      fastify.log.error(`Error creating user: ${errorMessage}`);
      reply.status(500).send({ error: 'Failed to create user' });
    }
  });
}
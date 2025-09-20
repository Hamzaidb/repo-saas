import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodError } from 'zod';

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
      
      reply.status(201).send({ data: user });
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
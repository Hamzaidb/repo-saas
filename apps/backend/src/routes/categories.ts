// src/routes/categories.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Fonction pour transformer les données Prisma en format JSON propre
function transformCategoryData(category: any) {
  return {
    ...category,
    products: category.products ? category.products.map((product: any) => ({
      ...product,
      price: product.price ? parseFloat(product.price.toString()) : 0,
      created_at: product.created_at ? product.created_at.toISOString() : null,
    })) : [],
    _count: category._count || { products: category.products?.length || 0 }
  };
}

export default async function categoryRoutes(fastify: FastifyInstance) {

  // GET /categories - Récupérer toutes les catégories avec le nombre de produits
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const categories = await fastify.prisma.categories.findMany({
        include: {
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy: {
          name: 'asc',
        },
      });
      
      const transformedCategories = categories.map(transformCategoryData);
      
      return { data: transformedCategories };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      fastify.log.error(`Error in getAllCategories: ${errorMessage}`);
      reply.status(500).send({ error: 'Failed to fetch categories' });
    }
  });

  // GET /categories/:id - Récupérer une catégorie avec ses produits
  fastify.get('/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      
      const category = await fastify.prisma.categories.findUnique({
        where: { id },
        include: {
          products: {
            orderBy: {
              created_at: 'desc',
            },
          },
          _count: {
            select: {
              products: true
            }
          }
        },
      });
      
      if (!category) {
        reply.status(404).send({ error: 'Category not found' });
        return;
      }
      
      const transformedCategory = transformCategoryData(category);
      
      return { data: transformedCategory };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      fastify.log.error(`Error in getCategoryById: ${errorMessage}`);
      reply.status(500).send({ error: 'Failed to fetch category' });
    }
  });

  // GET /categories/stats - Récupérer les statistiques des catégories (pour la homepage)
  fastify.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const categories = await fastify.prisma.categories.findMany({
        include: {
          _count: {
            select: {
              products: true
            }
          }
        },
        orderBy: {
          name: 'asc',
        },
      });
      
      // Format simplifié pour la homepage
      const categoryStats = categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        count: category._count.products
      }));
      
      return { data: categoryStats };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      fastify.log.error(`Error in getCategoryStats: ${errorMessage}`);
      reply.status(500).send({ error: 'Failed to fetch category stats' });
    }
  });
}
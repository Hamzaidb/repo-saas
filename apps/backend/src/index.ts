import { buildApp } from './app';
import corsPlugin from './plugins/cors';

async function main() {
  const app = await buildApp();
  await app.register(corsPlugin);
  await app.listen({ port: 3001, host: '0.0.0.0' });
  
  app.log.info(' Server ready at http://localhost:3001');
  
  console.log('Available routes:');
  console.log(app.printRoutes());
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
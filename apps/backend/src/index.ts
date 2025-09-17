import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma.js";

const server = Fastify({ logger: true });

server.register(prismaPlugin);


server.listen({ port: 3001 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`🚀 Server ready at ${address}`);
});

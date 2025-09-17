import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify();

app.register(cors);

app.get("/", async () => {
  return { message: "Hello from backend!" };
});

app.listen({ port: 4000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});

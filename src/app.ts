import fastify from "fastify";
import { usersRoutes } from "./routes/users";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

export const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.withTypeProvider<ZodTypeProvider>().register(usersRoutes, {
  prefix: "users",
});

app.get("/status", (request, reply) => {
  reply.send({
    status: "ok",
  });
});

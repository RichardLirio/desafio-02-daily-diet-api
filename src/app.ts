import fastify from "fastify";
import { usersRoutes } from "./routes/users";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import cookie from "@fastify/cookie";

export const app = fastify();

app.register(cookie);

app.register(usersRoutes, {
  prefix: "users",
});

app.get("/status", (request, reply) => {
  reply.send({
    status: "ok",
  });
});

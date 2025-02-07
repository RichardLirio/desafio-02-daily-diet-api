import fastify from "fastify";
import { usersRoutes } from "./routes/users";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import cookie from "@fastify/cookie";
import { loginRoute } from "./routes/auth";

export const app = fastify();

app.register(cookie);

app.register(usersRoutes, {
  prefix: "user",
});

app.register(loginRoute, {
  prefix: "auth",
});

app.get("/status", (request, reply) => {
  reply.send({
    status: "ok",
  });
});

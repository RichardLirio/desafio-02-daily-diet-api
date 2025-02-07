import fastify from "fastify";
import { usersRoutes } from "./routes/users";
import cookie from "@fastify/cookie";
import { loginRoute } from "./routes/auth";
import { mealsRoutes } from "./routes/meals";

export const app = fastify();

app.register(cookie);

app.register(usersRoutes, {
  prefix: "user",
});

app.register(loginRoute, {
  prefix: "auth",
});

app.register(mealsRoutes, {
  prefix: "meal",
});

app.get("/status", (request, reply) => {
  reply.send({
    status: "ok",
  });
});

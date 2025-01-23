import { FastifyInstance } from "fastify";
import { createUserHandler, getUsersHandler } from "../controllers/users";
import { userSchema } from "../schemas/users";

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        body: userSchema,
      },
    },
    createUserHandler
  );

  app.get("/", getUsersHandler);
}

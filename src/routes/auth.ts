import { FastifyInstance } from "fastify";
import { createUserBodySchema } from "../schemas/users";
import { knex } from "../database";
import { verifyPassword } from "../utils/hash";
import { randomUUID } from "crypto";

export async function loginRoute(app: FastifyInstance) {
  //Login User
  app.post("/", async (request, reply) => {
    try {
      const { email, password } = createUserBodySchema.parse(request.body);

      const findUser = await knex("users")
        .where({
          email: email,
        })
        .first();

      if (!findUser) {
        return reply.code(404).send({
          message: "User does not exist.",
          error: true,
          success: false,
        });
      }

      const checkPassword = verifyPassword({
        candidatePassword: password,
        salt: findUser.salt,
        hash: findUser.password,
      });

      if (checkPassword) {
        let userId = findUser.id;
        if (userId) {
          reply.cookie("userId", userId, {
            path: "/",
            maxAge: 60 * 60 * 4, // 4 HORAS
          });
        }

        reply.code(200).send({
          message: "Password correto.",
          error: false,
          success: true,
        });
      }
      reply.code(401).send({
        message: "Invalid password.",
        error: true,
        success: false,
      });
    } catch (error) {
      reply.code(500).send({
        message: error,
        error: true,
        success: false,
      });
    }
  });
}

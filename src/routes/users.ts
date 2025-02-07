import { FastifyInstance } from "fastify";
import { hashPassword } from "../utils/hash";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { createUserBodySchema } from "../schemas/users";
import { checkUserLogin } from "../middlewares/check-user-login";

export async function usersRoutes(app: FastifyInstance) {
  //Create user
  app.post("/", async (request, reply) => {
    const { email, password } = createUserBodySchema.parse(request.body);

    try {
      const { hash, salt } = hashPassword(password);

      const findUser = await knex("users")
        .where({
          email: email,
        })
        .first();

      if (findUser) {
        reply.code(404).send({
          message: "User already exists.",
          error: true,
          success: false,
        });
      }

      const user = await knex("users")
        .insert({
          id: randomUUID(),
          email,
          password: hash,
          salt: salt,
        })
        .returning("*");

      reply.code(200).send({
        data: user,
        message: "User create succesfuly.",
        error: false,
        success: true,
      });
    } catch (error) {
      reply.code(500).send({
        message: error,
        error: true,
        success: false,
      });
    }
  });

  app.get("/", { preHandler: [checkUserLogin] }, async (request, reply) => {
    const userId = request.cookies.userId;

    const user = await knex("users")
      .where({
        id: userId,
      })
      .first()
      .returning("*");

    if (user) {
      reply.code(201).send({
        user: user,
        error: false,
        success: true,
      });
    }
  });
}

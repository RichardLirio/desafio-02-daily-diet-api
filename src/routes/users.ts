import { FastifyInstance } from "fastify";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../utils/hash";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { createUserBodySchema } from "../schemas/users";

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

  //Login User
  app.post("/auth", async (request, reply) => {
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
        reply;
      }
    } catch (error) {
      reply.code(500).send({
        message: error,
        error: true,
        success: false,
      });
    }
  });

  app.get("/", async (request, reply) => {
    reply.code(200).send({
      teste: "ok",
    });
  });
}

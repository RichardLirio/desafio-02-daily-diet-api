import { FastifyReply, FastifyRequest } from "fastify";
import { createUserSchema } from "../schemas/users";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { hashPassword } from "../utils/hash";

export async function createUserHandler(
  request: FastifyRequest<{ Body: createUserSchema }>,
  reply: FastifyReply
) {
  try {
    const { email, password } = request.body;

    const { hash, salt } = hashPassword(password);

    const user = await knex("users").insert({
      id: randomUUID(),
      email,
      password: hash,
      salt: salt,
    }).returning;

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
}

export async function getUsersHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send({
    teste: true,
  });
}

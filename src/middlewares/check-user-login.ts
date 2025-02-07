import { FastifyReply, FastifyRequest } from "fastify";

export async function checkUserLogin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.cookies.userId;
  if (!userId) {
    reply.code(401).send({
      message: "Unauthorized.",
      error: true,
      success: false,
    });
  }
}

import { FastifyReply, FastifyRequest } from "fastify";

export async function checkUserLogin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionUserId = request.cookies.sessionId;
  if (!sessionUserId) {
    reply.code(401).send({
      message: "Unauthorized.",
      error: true,
      success: false,
    });
  }
}

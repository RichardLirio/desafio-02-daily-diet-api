import { app } from "./server";

app.get("/status", (request, reply) => {
  reply.send({
    status: "ok",
  });
});

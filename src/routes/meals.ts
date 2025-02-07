import { FastifyInstance } from "fastify";
import { checkUserLogin } from "../middlewares/check-user-login";
import { createMealBodySchema, getMealsParamsSchema } from "../schemas/meals";
import { knex } from "../database";
import { randomUUID } from "crypto";
import { error } from "console";

export async function mealsRoutes(app: FastifyInstance) {
  //Create meal
  app.post("/", { preHandler: [checkUserLogin] }, async (request, reply) => {
    try {
      const { name, description, consumed_at, onDiet } =
        createMealBodySchema.parse(request.body);

      const { userId } = request.cookies;

      const meal = await knex("meals")
        .insert({
          id: randomUUID(),
          userId: userId,
          name: name,
          description: description,
          consumed_at: consumed_at,
          onDiet: onDiet,
        })
        .returning("*");

      reply.code(201).send({
        data: meal,
        message: "Meal create succesfuly.",
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

  //all mals
  app.get("/", { preHandler: [checkUserLogin] }, async (request, reply) => {
    try {
      const { userId } = request.cookies;
      const meals = await knex("meals").where("userId", userId).select();

      reply.code(200).send({
        meals,
      });
    } catch (error) {
      reply.code(500).send({
        message: error,
        error: true,
        success: false,
      });
    }
  });

  //unic meal
  app.get("/:id", { preHandler: [checkUserLogin] }, async (request, reply) => {
    try {
      const { userId } = request.cookies;

      const { id } = getMealsParamsSchema.parse(request.params);

      const meal = await knex("meals")
        .where({
          userId: userId,
          id,
        })
        .first();

      reply.code(200).send({
        meal,
      });
    } catch (error) {
      reply.code(500).send({
        message: error,
        error: true,
        success: false,
      });
    }
  });

  //delete meal
  app.delete(
    "/:id",
    { preHandler: [checkUserLogin] },
    async (request, reply) => {
      try {
        const { userId } = request.cookies;

        const { id } = getMealsParamsSchema.parse(request.params);

        await knex("meals").delete().where({
          userId: userId,
          id,
        });

        reply.code(200).send({
          message: "Meal deleted.",
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
  );

  app.put("/:id", { preHandler: [checkUserLogin] }, async (request, reply) => {
    try {
      const { name, description, consumed_at, onDiet } =
        createMealBodySchema.parse(request.body);

      const { userId } = request.cookies;

      const { id } = getMealsParamsSchema.parse(request.params);

      const meal = await knex("meals")
        .where({
          userId: userId,
          id,
        })
        .first();

      if (!meal) {
        reply.code(404).send({
          message: "Meal not found",
          error: true,
          success: false,
        });
      }

      await knex("meals")
        .where({
          userId: userId,
          id,
        })
        .update({
          name: name,
          description: description,
          consumed_at: consumed_at,
          onDiet: onDiet,
        });

      reply.code(201).send({
        message: "Meal update succesfuly.",
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
}

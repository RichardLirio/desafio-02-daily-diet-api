import { z } from "zod";

export const createMealBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  consumed_at: z.string(),
  onDiet: z.boolean(),
});

export const getMealsParamsSchema = z.object({
  id: z.string().uuid(),
});

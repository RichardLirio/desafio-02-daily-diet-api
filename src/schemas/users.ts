import { boolean, z } from "zod";

export const createUserBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

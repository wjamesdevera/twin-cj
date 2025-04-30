import { z } from "zod";

export const jsonSchema = z.object({
  data: z.string().refine((value) => {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }, "Invalid JSON input"),
});

export const idSchema = z.object({
  id: z.string(),
});

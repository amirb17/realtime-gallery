import { z } from "zod";

export const userNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters.")
  .max(30, "Name must be 30 characters or less.")
  .regex(
    /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes.",
  );
import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username should be at least of 3 characters" }),
  email: z.string().email({ message: "Email should be valid" }),
  password: z
    .string()
    .min(6, { message: "password should be at least of 6 characters" }),
});

export const signInSchema = z.object({
  email: z.string().email({ message: "Email should be valid!" }),
  password: z.string(),
});

export const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least of 3 characters"),
  description: z
    .string()
    .min(5, "Description must be at least of 5 characters"),
  status: z.string(),
  priority: z.string(),
  dueDate: z.date().optional(),
});

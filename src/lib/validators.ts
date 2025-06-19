import {z} from 'zod';


export const registerSchema = z.object({
    name:z.string().min(3),
    email:z.string().email(),
    password:z.string().min(3)
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export const createVideoSchema = z.object({
  title: z.string(),
  description: z.string(),
  video:z.string(),
  userId:z.number().int()
})
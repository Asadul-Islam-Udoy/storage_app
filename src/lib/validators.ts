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
  video:z.string().optional(),
  videoUrl:z.string().optional(),
  userId:z.number().int()
}).refine(data => data.video || data.videoUrl, {
  message: "Either a video file or a video URL must be provided.",
  path: ["video"]  // You can point the error to video or videoUrl
});


export const updateVideoSchema = z.object({
  title: z.string(),
  description: z.string(),
  video:z.string().optional(),
  userId:z.number().int()
})
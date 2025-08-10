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


export const createPicturesSchema = z.object({
  title: z.string(),
  description: z.string(),
  picture:z.string().optional(),
  pictureUrl:z.string().optional(),
  userId:z.number().int()
}).refine(data => data.picture || data.pictureUrl, {
  message: "Either a picture file or a picture URL must be provided.",
  path: ["picture"]  // You can point the error to video or videoUrl
});

export const updatePictureSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  picture: z.string().optional(),
  pictureUrl: z.string().url().optional(),
  userId: z.number(),
});
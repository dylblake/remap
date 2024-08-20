import { z } from 'zod';

export const baseSchema = z.object({
  id: z.number().positive().int(),
  createdAt: z.string().datetime(),  
  updatedAt: z.string().datetime(),  
});

export type BaseModel = z.infer<typeof baseSchema>;

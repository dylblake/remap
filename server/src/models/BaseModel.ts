import { z } from 'zod';

export const baseSchema = z.object({
  id: z.number().positive().int().optional(), 
  createdAt: z.string().datetime().optional(),  
  updatedAt: z.string().datetime().optional(),  
});

export type BaseModel = z.infer<typeof baseSchema>;

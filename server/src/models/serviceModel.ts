import { z } from 'zod';
import { baseSchema } from './BaseModel';

export const serviceSchema = baseSchema.extend({
  uuid: z.string().uuid(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  type: z.enum(['upper', 'middle', 'lower']),
  upperServiceId: z.string().uuid().optional(),
  middleServiceId: z.string().uuid().optional(),
  order: z.number().min(0, "Order must be a non-negative integer"), 
});

export type ServiceModel = z.infer<typeof serviceSchema>;
import { z } from 'zod';
import { baseSchema } from './BaseModel';

export const serviceSchema = baseSchema.extend({
  uuid: z.string().uuid(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  tier: z.enum(['pending', 'approved', 'rejected']),
  upperServiceId: z.string().uuid().optional(),
  middleServiceId: z.string().uuid().optional(),
});

export type ServiceModel = z.infer<typeof serviceSchema>;

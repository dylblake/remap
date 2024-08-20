import { z } from 'zod';
import { baseSchema } from './BaseModel'

export const serviceSchema = baseSchema.extend({
  primaryServiceUUID: z.string().uuid(),
  serviceName: z.string().min(2, "Name must be at least 2 characters long"),
  primaryServiceId: z.string().uuid(),
  secondaryServiceId: z.string().uuid(),
});

export type User = z.infer<typeof serviceSchema>;

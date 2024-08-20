import { z } from 'zod';
import { baseSchema } from './BaseModel'

export const primaryServiceSchema = baseSchema.extend({
  primaryServiceUUID: z.string().uuid(),
  serviceName: z.string().min(2, "Name must be at least 2 characters long"),
  primaryServiceId: z.string().uuid(),
  secondaryServiceId: z.string().uuid(),
  email: z.string().email("Invalid email address"),
  age: z.number().optional(),
});

export type User = z.infer<typeof primaryServiceSchema>;

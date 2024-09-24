import { z } from "zod";
import { baseSchema } from "./BaseModel";
import { uuidSchema } from "./uuidSchema";

export const domainSchema = baseSchema.extend({
  uuid: z.string().uuid(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
  level: z.enum(["upper", "middle", "lower"]),
  upperDomainId: uuidSchema.nullable(),
  middleDomainId: uuidSchema.nullable(),
  order: z.number().min(0, "Order must be a non-negative integer"),
});

export type DomainModel = z.infer<typeof domainSchema>;

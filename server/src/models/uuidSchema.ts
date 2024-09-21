import { z } from 'zod';

// Define a UUID schema using Zod for validation
export const uuidSchema = z.string().uuid();
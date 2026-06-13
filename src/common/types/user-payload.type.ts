import {z} from 'zod';

export const UserPayloadSchema = z.object({
    id: z.number(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.email(),
});

export type UserPayload = z.infer<typeof UserPayloadSchema>;
import { z } from 'zod';

export const envSchema = z.object({
    APP_NAME: z.string(),

    APP_PORT: z.coerce.number().default(3000),

    NODE_ENV: z.enum([
        'development',
        'test',
        'production',
    ]),

    SWAGGER_ENABLED: z.coerce.boolean(),

    SWAGGER_PATH: z.string(),

    SWAGGER_TITLE: z.string(),

    SWAGGER_DESCRIPTION: z.string(),

    SWAGGER_VERSION: z.string(),
});

export type EnvVariables = z.infer<typeof envSchema>;

export function validateEnv() {
    return envSchema.parse(process.env);
}
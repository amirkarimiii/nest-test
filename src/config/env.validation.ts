import { z } from 'zod';

export const envSchema = z.object({
    APP_NAME: z.string(),

    APP_PORT: z.coerce.number().default(3000),

    NODE_ENV: z.enum([
        'development',
        'test',
        'production',
    ]),

    API_KEY: z.string().min(32),
    INTERNAL_SERVICE_TOKEN: z.string().min(32),

    DATABASE_URL: z.url({ message: 'Invalid DATABASE_URL format' }),

    SWAGGER_ENABLED: z.coerce.boolean(),
    SWAGGER_PATH: z.string(),
    SWAGGER_TITLE: z.string(),
    SWAGGER_DESCRIPTION: z.string(),
    SWAGGER_VERSION: z.string(),

    CACHE_HOST: z.ipv4(),
    CACHE_PORT: z.coerce.number().int().min(0).max(65535),
    CACHE_TTL: z.coerce.number().int().positive(),

});

export type EnvVariables = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, any>) {
    return envSchema.parse(config);
}
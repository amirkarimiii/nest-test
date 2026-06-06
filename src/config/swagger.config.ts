import {
    DocumentBuilder,
    SwaggerCustomOptions,
} from '@nestjs/swagger';

export function buildSwaggerConfig(
    title: string,
    description: string,
    version: string,
) {
    return new DocumentBuilder()
        .setTitle(title)
        .setDescription(description)
        .setVersion(version)
        .addApiKey(
            {
                type: 'apiKey',
                name: 'x-api-key',
                in: 'header',
            },
            'api-key-auth',
        )
        .addApiKey(
            {
                type: 'apiKey',
                name: 'x-internal-service',
                in: 'header',
            },
            'internal-service-auth',
        )
        .build();
}

export const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
        persistAuthorization: true,
        filter: true,
        showRequestDuration: true,
        tryItOutEnabled: true,
    },
};
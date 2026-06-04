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
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'JWT-auth',
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
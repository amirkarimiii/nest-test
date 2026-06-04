import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_TITLE || 'My API')
    .setDescription(process.env.SWAGGER_DESCRIPTION || 'API documentation')
    .setVersion(process.env.SWAGGER_VERSION || '1.0')
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        },
        'JWT-auth',
    )
    .addApiKey(
        {
            type: 'apiKey',
            name: 'X-API-Key',
            in: 'header',
            description: 'API Key for external services',
        },
        'api-key',
    )
    .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        tryItOutEnabled: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'My API Documentation',
};
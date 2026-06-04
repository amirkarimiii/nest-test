import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { swaggerConfig, swaggerCustomOptions } from './swagger.config';

export function setupSwagger(app: INestApplication) {
    const configService = app.get(ConfigService);
    const isSwaggerEnabled = configService.get<boolean>('swagger.enabled');

    if (!isSwaggerEnabled) {
        console.log('⚠️  Swagger is disabled');
        return;
    }

    const swaggerPath = configService.get<string>('swagger.path', 'api');

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document, swaggerCustomOptions);

    console.log(`📚 Swagger documentation available at: /${swaggerPath}`);
}
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';

import {
    buildSwaggerConfig,
    swaggerCustomOptions,
} from './swagger.config';

export function setupSwagger(
    app: INestApplication,
) {
    const config = app.get(ConfigService);

    const enabled =
        config.get<boolean>('swagger.enabled');

    if (!enabled) {
        return;
    }

    const title =
        config.get<string>('swagger.title')!;

    const description =
        config.get<string>('swagger.description')!;

    const version =
        config.get<string>('swagger.version')!;

    const path =
        config.get<string>('swagger.path')!;

    const document = SwaggerModule.createDocument(
        app,
        buildSwaggerConfig(
            title,
            description,
            version,
        ),
    );

    SwaggerModule.setup(
        path,
        app,
        document,
        swaggerCustomOptions,
    );
}
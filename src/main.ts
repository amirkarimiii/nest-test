import {NestFactory} from '@nestjs/core';
import {AppModule} from './modules/app.module';
import {ConfigService} from "@nestjs/config";
import {setupSwagger} from "./config/swagger.setup";
import {ValidationPipe} from "@nestjs/common";
import {GlobalExceptionFilter} from "./common/exceptions/global-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import {LoggingInterceptor} from "./common/interceptors/logging.interceptor";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        })
    );
    app.useGlobalFilters(
        new GlobalExceptionFilter(),
    );
    const configService = app.get(ConfigService);
    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new ResponseInterceptor(),
    );
    const port = configService.get<number>('app.port', 3000);
    setupSwagger(app);
    await app.listen(port);
    console.log(`Application started on port ${port}`);
}

bootstrap().catch((err) => {
    console.error('runtime error!', err);
    process.exit(1);
});
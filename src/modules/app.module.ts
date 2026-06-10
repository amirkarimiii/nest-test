import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';

import configuration from "../config/configuration";

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {HealthModule} from "./health/health.module";
import {UsersModule} from "./user/user.module";
import {validateEnv} from "../config/env.validation";
import {PrismaModule} from "../infrastructure/database/prisma.module";
import {RequestIdMiddleware} from "../common/middlewares/request-id.middleware";
import {LifecycleModule} from "./lifecycle/lifecycle.module";
import {CacheModule} from "./cache/cache.module";
import {MicroserviceModule} from "./microservice/microservice.module";

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
        load: [configuration],
        validate: validateEnv,
    }),
        HealthModule,
        UsersModule,
        PrismaModule,
        LifecycleModule,
        CacheModule.forRootAsync(),
        MicroserviceModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestIdMiddleware,).forRoutes('*');
    }
}

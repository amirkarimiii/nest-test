import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from "../config/configuration";

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {HealthModule} from "./health/health.module";
import {UsersModule} from "./user/user.module";
import {validateEnv} from "../config/env.validation";
import {PrismaModule} from "../../prisma/prisma.module";

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    validate: validateEnv,
  }),
    HealthModule,
    UsersModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

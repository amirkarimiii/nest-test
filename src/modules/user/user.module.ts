import { Module } from '@nestjs/common';
import { UsersController } from "./user.controller";
import {UsersService} from "./user.service";
import {MicroserviceModule} from "../microservice/microservice.module";


@Module({
    imports: [MicroserviceModule],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
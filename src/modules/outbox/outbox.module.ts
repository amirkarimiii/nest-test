import {Module} from "@nestjs/common";
import {OutboxService} from "./outbox.service";
import {OutboxController} from "./outbox.controller";
import {PrismaModule} from "../../infrastructure/database/prisma.module";
import {MicroserviceModule} from "../microservice/microservice.module";


@Module({
    imports: [PrismaModule, MicroserviceModule],
    providers: [OutboxService],
    controllers: [OutboxController],
    exports: [OutboxService],
})
export class OutboxModule {}
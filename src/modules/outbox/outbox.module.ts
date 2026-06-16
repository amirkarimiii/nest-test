import {Module} from "@nestjs/common";
import {OutboxService} from "./outbox.service";
import {OutboxController} from "./outbox.controller";
import {PrismaModule} from "../../infrastructure/database/prisma.module";
import {MicroserviceModule} from "../microservice/microservice.module";
import {OutboxDeadLetterService} from "./dead-letter/outbox-dead-letter.service";


@Module({
    imports: [PrismaModule, MicroserviceModule],
    providers: [OutboxService, OutboxDeadLetterService],
    controllers: [OutboxController],
    exports: [OutboxService],
})
export class OutboxModule {}
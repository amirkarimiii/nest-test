import {Module} from "@nestjs/common";
import {OutboxService} from "./outbox.service";
import {OutboxController} from "./outbox.controller";
import {PrismaModule} from "../../infrastructure/database/prisma.module";
import {MicroserviceModule} from "../microservice/microservice.module";
import {OutboxDeadLetterService} from "./dead-letter/outbox-dead-letter.service";
import {OutboxPublishEventService} from "./pollings/outbox-publish-event.service";
import {OutboxRecoveryStuckService} from "./pollings/outbox-recovery-stuck.service";


@Module({
    imports: [PrismaModule, MicroserviceModule],
    providers: [
        OutboxService,
        OutboxDeadLetterService,
        OutboxPublishEventService,
        OutboxRecoveryStuckService
    ],
    controllers: [OutboxController],
    exports: [OutboxService],
})
export class OutboxModule {}
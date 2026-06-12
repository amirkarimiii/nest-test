import {Module} from "@nestjs/common";
import {OutboxService} from "./outbox.service";
import {OutboxController} from "./outbox.controller";
import {PrismaModule} from "../../infrastructure/database/prisma.module";


@Module({
    imports: [PrismaModule],
    providers: [OutboxService],
    controllers: [OutboxController],
    exports: [OutboxService],
})
export class OutboxModule {}
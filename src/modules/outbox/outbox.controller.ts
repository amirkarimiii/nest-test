import {Controller, Get} from "@nestjs/common";
import {OutboxService} from "./outbox.service";


@Controller('outbox')
export class OutboxController {

    constructor(private readonly outboxService: OutboxService) {}

    @Get()
    async getOutbox() {
        return await this.outboxService.getUnprocessedEvents();
    }

}
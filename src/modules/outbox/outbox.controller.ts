import {Controller, Get} from "@nestjs/common";
import {OutboxService} from "./outbox.service";


@Controller('outbox')
export class OutboxController {

    constructor(private readonly outboxService: OutboxService) {}

    @Get('/pending')
    async getPendingEvents() {
        return await this.outboxService.getPendingEvents();
    }

    @Get('/processed')
    async getProcessedEvents() {
        return await this.outboxService.getProcessedEvents();
    }

    @Get('/pend-count')
    async getPendingCount() {
        return await this.outboxService.getPendingEventsCount();
    }

}
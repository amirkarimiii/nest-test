import {Controller, Get, Param, ParseIntPipe, Post, Query} from "@nestjs/common";
import {OutboxService} from "./outbox.service";
import {OutboxDeadLetterService} from "./dead-letter/outbox-dead-letter.service";
import {DeadLetterCount} from "./dto/dead-letter-count.dto";


@Controller('outbox')
export class OutboxController {

    constructor(
        private readonly outboxService: OutboxService,
        private readonly deadLetterService: OutboxDeadLetterService,
    ) {
    }

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

    @Get('/dead-letters')
    async deadLetters(@Query() query: DeadLetterCount) {
        return this.deadLetterService.getDeadLetters(query.count);
    }

    @Post('/dead-letters/:id/retry')
    async retry(@Param('id') id: string) {
        return this.deadLetterService.retryFromDeadLetter(id);
    }
}
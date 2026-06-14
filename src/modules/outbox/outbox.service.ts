import {Injectable, Logger} from "@nestjs/common";
import {PrismaService} from "../../infrastructure/database/prisma.service";
import {EventTypesEnum} from "../../common/enums/event-types.enum";
import {UserPayload, UserPayloadSchema} from "../../common/types/user-payload.type";
import {OutboxStatus} from "generated/prisma/enums";
import {OutboxQueue} from "../../infrastructure/bull/queue/outbox.queue";
import {Cron, CronExpression} from "@nestjs/schedule";


@Injectable()
export class OutboxService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly outboxQueue: OutboxQueue,
    ) {}

    private readonly logger = new Logger(OutboxService.name);

    @Cron('*/20 * * * * *')
    async publishEvents() {

        const events = await this.prisma.outboxEvent.findMany({
            where: {
                OR: [
                    {
                        status: OutboxStatus.PENDING
                    },
                    {
                        status: OutboxStatus.FAILED,
                        attempts: {
                            lt: 10
                        }
                    }
                ]
            },
            take: 20,
        });
        for (const event of events) {
            switch (event.eventType) {
                case EventTypesEnum.USER_CREATED: {
                    const result = UserPayloadSchema.safeParse(event.payload);

                    if (!result.success) {
                        this.logger.error(`Validation failed for event ${event.id}: ${result.error}`);
                        await this.prisma.outboxEvent.update({
                            where: {id: event.id},
                            data: {status: OutboxStatus.FAILED, attempts: {increment: 1}}
                        });
                        continue;
                    }

                    try {
                        await this.outboxQueue.addEvent(event.eventType, result.data, event.id);
                        await this.prisma.outboxEvent.update({
                            where: {
                                id: event.id,
                            },
                            data: {
                                status: OutboxStatus.ENQUEUED,
                            }
                        });
                    } catch (error) {
                        this.logger.error(`Failed to process event ${event.id}: ${error.message}`);
                        await this.prisma.outboxEvent.update({
                            where: {id: event.id},
                            data: {
                                status: OutboxStatus.FAILED,
                                attempts: {increment: 1},
                                updatedAt: new Date(),
                            }
                        }).catch(dbErr => this.logger.error(`Critical: DB update failed after outbox failure: ${dbErr.message}`));
                    }
                }
            }
        }

    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async stuckEventRecovery() {

        const fiveMinutesAgo = new Date();
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

        await this.prisma.outboxEvent.updateMany({
            where: {
                status: OutboxStatus.ENQUEUED,
                updatedAt: {
                    lt: fiveMinutesAgo
                }
            },
            data: {
                status: OutboxStatus.PENDING,
                updatedAt: new Date().toISOString(),
            }
        });

    }

    async getPendingEvents() {
        return this.prisma.outboxEvent.findMany({
            where: {
                status: OutboxStatus.PENDING
            },
            take: 100,
            orderBy: {
                createdAt: 'asc'
            }
        });
    }

    async getPendingEventsCount() {
        return this.prisma.outboxEvent.count({
            where: {
                status: OutboxStatus.PENDING
            }
        });
    }

    async getProcessedEvents() {
        return this.prisma.outboxEvent.findMany({
            where: {
                status: OutboxStatus.PROCESSED
            },
            take: 100,
            orderBy: {
                createdAt: 'asc'
            }
        });
    }

}
import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {PrismaService} from "../../infrastructure/database/prisma.service";
import {EventTypesEnum} from "../../common/enums/event-types.enum";
import {UserPayloadSchema} from "../../common/types/user-payload.type";
import {OutboxStatus} from "generated/prisma/enums";
import {OutboxQueue} from "../../infrastructure/bull/queue/outbox.queue";
import {Cron, CronExpression} from "@nestjs/schedule";
import {EventHandlerInterface} from "./event-handler/event-handler.interface";
import {ModuleRef} from "@nestjs/core";
import {UserCreatedHandler} from "./event-handler/user-created.handler";


@Injectable()
export class OutboxService implements OnModuleInit {

    private readonly handlersMap = new Map<string, EventHandlerInterface>();

    constructor(
        private readonly prisma: PrismaService,
        private readonly outboxQueue: OutboxQueue,
        private readonly moduleRef: ModuleRef
    ) {}

    onModuleInit() {
        const handlers = [
            this.moduleRef.get(UserCreatedHandler, { strict: false }),
        ];

        for (const handler of handlers) {
            this.handlersMap.set(handler.eventType, handler);
        }
    }
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
            const handler = this.handlersMap.get(event.eventType);
            if (!handler) {
                this.logger.error(`No handler found for event type: ${event.eventType}`);
                continue;
            }
            try {
                await handler.handle(event.payload, event.id);
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
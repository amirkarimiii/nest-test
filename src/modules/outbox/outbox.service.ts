import {Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {PrismaService} from "../../infrastructure/database/prisma.service";
import {OutboxStatus} from "generated/prisma/enums";
import {Cron, CronExpression} from "@nestjs/schedule";
import {EventHandlerInterface} from "./event-handler/event-handler.interface";
import {ModuleRef} from "@nestjs/core";
import {UserCreatedHandler} from "./event-handler/user-created.handler";


@Injectable()
export class OutboxService implements OnModuleInit {

    private readonly handlersMap = new Map<string, EventHandlerInterface>();

    constructor(
        private readonly prisma: PrismaService,
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
            if (event.status === OutboxStatus.PROCESSING) {
                this.logger.warn(`Event ${event.id} is already being processed. Skipping.`);
                continue
            }
            try {
                await this.prisma.outboxEvent.update({
                    where: {
                        id: event.id,
                    },
                    data: {
                        status: OutboxStatus.ENQUEUED,
                    }
                });
                await handler.handle(event.payload, event.id);
                await this.prisma.outboxEvent.update({
                    where: {
                        id: event.id,
                    },
                    data: {
                        status: OutboxStatus.PROCESSING,
                    }
                });
            } catch (error) {
                this.logger.error(`Failed to process event ${event.id}: ${error.message}`);
                await this.prisma.outboxEvent.update({
                    where: {id: event.id},
                    data: {
                        status: OutboxStatus.FAILED,
                        attempts: {increment: 1},
                    }
                }).catch(dbErr => this.logger.error(`Critical: DB update failed after outbox failure: ${dbErr.message}`));
            }
        }

    }

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
import {Injectable, OnModuleInit} from "@nestjs/common";
import {PrismaService} from "../../infrastructure/database/prisma.service";
import {OutboxStatus} from "generated/prisma/enums";
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
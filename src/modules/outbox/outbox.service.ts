import {Injectable} from "@nestjs/common";
import {Cron, CronExpression} from "@nestjs/schedule";
import {PrismaService} from "../../infrastructure/database/prisma.service";
import {EventTypesEnum} from "../../common/enums/event-types.enum";
import {MicroserviceService} from "../microservice/microservice.service";
import {UserPayloadSchema} from "../../common/types/user-payload.type";


@Injectable()
export class OutboxService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly microservice: MicroserviceService,
    ) {
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async publishEvents() {

        const events = await this.prisma.outboxEvent.findMany({
            where: {
                processed: false
            },
            take: 100,
        });

        for (const event of events) {
            switch (event.eventType) {
                case EventTypesEnum.USER_CREATED: {
                    const result = UserPayloadSchema.safeParse(event.payload);
                    if (result.success) {
                        const payload = result.data;
                        this.microservice.notifyUserCreation(event.eventType, payload);
                        await this.prisma.outboxEvent.update({
                            where: {
                                id: event.id,
                            },
                            data: {
                                processed: true,
                                processedAt: new Date(),
                            },
                        });
                    } else {
                        throw new Error("Unable to parse payload type");
                    }
                }
            }
        }

    }

    async getUnprocessedEvents() {
        return this.prisma.outboxEvent.findMany({
            where: {
                processed: false
            },
            take: 100,
            orderBy: {
                createdAt: 'asc'
            }
        });
    }

}
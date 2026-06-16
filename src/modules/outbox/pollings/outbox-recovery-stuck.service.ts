import {Injectable} from "@nestjs/common";
import {OutboxStatus} from "../../../../generated/prisma/enums";
import {PrismaService} from "../../../infrastructure/database/prisma.service";


@Injectable()
export class OutboxRecoveryStuckService {

    constructor(private readonly prisma: PrismaService) {}

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

}
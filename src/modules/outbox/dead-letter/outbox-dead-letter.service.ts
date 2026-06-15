import {Injectable, Logger} from "@nestjs/common";
import {PrismaService} from "../../../infrastructure/database/prisma.service";
import {OutboxStatus} from "../../../../generated/prisma/enums";
import {Prisma} from "../../../../generated/prisma/client";


@Injectable()
export class OutboxDeadLetterService {

    private readonly logger = new Logger(OutboxDeadLetterService.name);

    constructor(private readonly prisma: PrismaService) {}

    async getDeadLetters(take = 50) {
        return this.prisma.outboxDeadLetter.findMany({
            take,
            orderBy: {failedAt: 'desc'}
        });
    }

    async retryFromDeadLetter(id: string) {
        const dl = await this.prisma.outboxDeadLetter.findUnique(
            {where: {id}}
        );
        if (!dl)
            throw new Error('Dead letter not found');

        const payload = dl.payload === null ? Prisma.JsonNull : dl.payload

        await this.prisma.outboxEvent.create({
            data: {
                id: dl.outboxEventId,
                eventType: dl.eventType,
                payload: payload,
                status: OutboxStatus.PENDING,
                attempts: 0,
            }
        });

        await this.prisma.outboxDeadLetter.delete({where: {id}});
    }

    async archive(id: string) {
        await this.prisma.outboxDeadLetter.delete(
            {where: {id}}
        );
    }

}
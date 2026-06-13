import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateUserDto} from "../../common/dto/create-user.dto";
import {PrismaService} from "src/infrastructure/database/prisma.service";
import {MicroserviceService} from "../microservice/microservice.service";
import {EventTypesEnum} from "../../common/enums/event-types.enum";
import {OutboxService} from "../outbox/outbox.service";


@Injectable()
export class UsersService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly outboxService: OutboxService,
    ) {
    }

    async findAll(isActive?: boolean) {
        return this.prisma.user.findMany({
            where: {
                isActive: isActive
            }
        });
    }

    async findById(id: number) {
        const user = await this.prisma.user.findUnique({where: {id}});
        if (!user) {
            throw new NotFoundException(
                `User ${id} not found`,
            );
        }
        return user;
    }

    async create(dto: CreateUserDto) {
        return this.prisma.$transaction(
            async (tx) => {
                const user = await tx.user.create({data: dto});
                await this.outboxService.publishEvents(
                    EventTypesEnum.USER_CREATED, {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email
                });
                return user;
            }
        );
    }
}

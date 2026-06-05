import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {PrismaService} from "src/infrastructure/database/prisma.service";


@Injectable()
export class UsersService {

    constructor(private readonly prisma: PrismaService) {
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
        return this.prisma.user.create({data: dto});
    }

}

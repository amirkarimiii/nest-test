import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";



@Injectable()
export class UsersService {

    private users = [
        {
            id: 1,
            name: "david",
            email: "david@example.com",
        }
    ];

    findAll() {
        return this.users;
    }

    findById(id: number) {

        const user = this.users.find(
            u => u.id === id,
        );

        if (!user) {
            throw new NotFoundException(
                `User ${id} not found`,
            );
        }

        return user;
    }

    create(dto: CreateUserDto) {

        const user = {
            id: this.users.length + 1,
            ...dto,
        };

        this.users.push(user);

        return user;
    }

}

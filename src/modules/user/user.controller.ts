import {Body, Controller, Get, Param, ParseIntPipe, Post} from "@nestjs/common";
import {ApiCreatedResponse, ApiOkResponse, ApiTags} from "@nestjs/swagger";
import {UsersService} from "./user.service";
import { UserResponseDto } from "./dto/user-response.dto";
import {CreateUserDto} from "./dto/create-user.dto";


@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    @ApiOkResponse({
        type: UserResponseDto,
        isArray: true,
    })
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({
        type: UserResponseDto,
    })
    findById(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.userService.findById(id);
    }

    @Post()
    @ApiCreatedResponse({
        type: UserResponseDto,
    })
    create(
        @Body()
        dto: CreateUserDto,
    ) {
        return this.userService.create(dto);
    }

}
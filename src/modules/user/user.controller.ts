import {Body, Controller, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Query, UseGuards} from "@nestjs/common";
import {ApiCreatedResponse, ApiOkResponse, ApiQuery, ApiSecurity, ApiTags} from "@nestjs/swagger";
import {UsersService} from "./user.service";
import { UserResponseDto } from "./dto/user-response.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {ApiKeyGuard} from "../../common/guards/api-key.guard";
import {InternalServiceTokenGuard} from "../../common/guards/internal-service-token.guard";


@ApiTags('Users')
@Controller('users')
@UseGuards(
    ApiKeyGuard,
    InternalServiceTokenGuard
)
@ApiSecurity('api-key-auth')
@ApiSecurity('internal-service-auth')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    @ApiOkResponse({
        type: UserResponseDto,
        isArray: true,
    })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean })
    async findAll(@Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean) {
        return this.userService.findAll(isActive);
    }

    @Get(':id')
    @ApiOkResponse({
        type: UserResponseDto,
    })
    async findById(
        @Param('id', ParseIntPipe)
        id: number,
    ) {
        return this.userService.findById(id);
    }

    @Post()
    @ApiCreatedResponse({
        type: UserResponseDto,
    })
    async create(
        @Body()
        dto: CreateUserDto,
    ) {
        return this.userService.create(dto);
    }

}
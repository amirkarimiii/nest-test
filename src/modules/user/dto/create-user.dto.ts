import {
    IsEmail,
    IsString,
    MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty({
        example: 'Ali',
    })
    @IsString()
    @MinLength(2)
    readonly name: string;

    @ApiProperty({
        example: 'ali@test.com',
    })
    @IsEmail()
    readonly email: string;
}
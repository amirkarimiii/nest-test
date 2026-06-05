import {
    IsBoolean,
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
    readonly firstname: string;

    @ApiProperty({
        example: 'Ali',
    })
    @IsString()
    @MinLength(2)
    readonly lastname: string;

    @ApiProperty({
        example: 'ali@test.com',
    })
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        example: true,
    })
    @IsBoolean()
    readonly isActive: boolean;
}
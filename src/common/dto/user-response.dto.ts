import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {

    @ApiProperty()
    readonly id: number;

    @ApiProperty()
    readonly firstname: string;

    @ApiProperty()
    readonly lastname: string;

    @ApiProperty()
    readonly isActive: boolean;

    @ApiProperty()
    readonly email: string;

    @ApiProperty()
    readonly createdAt: Date;
}
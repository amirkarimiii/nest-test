import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {

    @ApiProperty()
    readonly success: boolean;

    @ApiProperty()
    readonly statusCode: number;

    @ApiProperty()
    readonly message: string;

    @ApiProperty()
    readonly path: string;

    @ApiProperty()
    readonly timestamp: string;
}
import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
    @ApiProperty({
        description: 'server response description',
        example: 'Hello World!',
        type: String,
    })
    message: string;
}
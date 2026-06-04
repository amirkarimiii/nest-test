import {ApiProperty} from "@nestjs/swagger";

export class HealthResponseDto {
    @ApiProperty({
        description: 'service health response description',
        example: 'UP',
        enum: ['UP', 'DOWN', 'DEGRADED'],
        type: String,
    })
    status: string;
}
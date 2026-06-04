import {ApiProperty} from "@nestjs/swagger";
import {HealthStatus} from "../../../common/enums/healthStatus";

export class HealthResponseDto {
    @ApiProperty({
        description: 'service health response description',
        example: 'UP',
        enum: HealthStatus,
        type: String,
    })
    readonly status: HealthStatus;
}
import {ApiProperty} from "@nestjs/swagger";
import {HealthStatusEnum} from "../../../common/enums/health-status.enum";

export class HealthResponseDto {
    @ApiProperty({
        description: 'service health response description',
        example: 'UP',
        enum: HealthStatusEnum,
        type: String,
    })
    readonly status: HealthStatusEnum;
}
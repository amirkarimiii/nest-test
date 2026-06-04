import {Controller, Get} from "@nestjs/common";
import {HealthService} from "./health.service";
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiOkResponse,
    ApiServiceUnavailableResponse
} from '@nestjs/swagger';
import {HealthResponseDto} from "./dto/health.dto";

@ApiTags('Health Check')
@Controller("health")
export class HealthController {
    constructor(private readonly healthService: HealthService) {}
    @Get()
    @ApiOperation({
        summary: 'Check service health',
        description: 'This endpoint verifies the health status of the service. It is used for monitoring and load balancers.',
    })
    @ApiOkResponse({
        description: 'Service is healthy and running',
        type: HealthResponseDto,
    })
    @ApiServiceUnavailableResponse({
        description: 'Service is unavailable (usually during internal errors)',
    })
    @ApiResponse({
        status: 500,
        description: 'Service internal error',
    })
    health(): HealthResponseDto {
        return this.healthService.health();
    }
}
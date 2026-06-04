import {Injectable} from "@nestjs/common";
import {HealthResponseDto} from "./dto/health.dto";
import {HealthStatus} from "../../common/enums/healthStatus";

@Injectable()
export class HealthService {
    health(): HealthResponseDto {
        return {
            status: HealthStatus.UP
        };
    }
}
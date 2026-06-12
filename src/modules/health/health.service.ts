import {Injectable} from "@nestjs/common";
import {HealthResponseDto} from "./dto/health.dto";
import {HealthStatusEnum} from "../../common/enums/health-status.enum";

@Injectable()
export class HealthService {
    health(): HealthResponseDto {
        return {
            status: HealthStatusEnum.UP
        };
    }
}
import {IsInt, IsOptional, Max, Min} from "class-validator";
import {Type} from "class-transformer";

export class DeadLetterCount {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    count?: number = 50;
}
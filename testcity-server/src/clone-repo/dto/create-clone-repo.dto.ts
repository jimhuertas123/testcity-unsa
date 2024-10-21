import { IsNotEmpty, IsString } from "class-validator";

export class AnalyzeSourceDto {
    @IsNotEmpty()
    @IsString()
    cloneUrl: string;
}

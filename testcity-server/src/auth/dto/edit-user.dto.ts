import { IsArray, IsBoolean, IsEmail, IsOptional, IsString} from "class-validator";

export class EditUserDto {
    
    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @IsString()
    password?: string;

}
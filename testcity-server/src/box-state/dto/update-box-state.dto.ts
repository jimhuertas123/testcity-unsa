import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { BoxState } from '../config/enum-state-box';

export class UpdateBoxStateDto {

    @IsString()
    @IsEmail()
    boxId: string;

    @IsEnum(BoxState)
    state:BoxState;
}

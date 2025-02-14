import { IsEmail, IsNotEmpty, MinLength, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    type: string;

    @IsString()
    @IsOptional()
    role: string;

    @IsString()
    @IsOptional()
    key: string;

    @IsBoolean()
    @IsOptional()
    active: boolean;

    @IsString()
    @IsOptional()
    phone: string;

    @IsNumber()
    @IsOptional()
    n1?: number;


}

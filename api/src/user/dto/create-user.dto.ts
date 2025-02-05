import { IsEmail, IsNotEmpty, MinLength, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    tipo: string;

    @IsString()
    @IsOptional()
    chave: string;

    @IsNumber()
    @IsOptional()
    n1?: number;

    @IsNumber()
    @IsOptional()
    n2?: number;

    @IsNumber()
    @IsOptional()
    n3?: number;

    @IsNumber()
    @IsOptional()
    n4?: number;

    @IsNumber()
    @IsOptional()
    n5?: number;

    @IsNumber()
    @IsOptional()
    n6?: number;

    @IsNumber()
    @IsOptional()
    n7?: number;

    @IsNumber()
    @IsOptional()
    n8?: number;

    @IsNumber()
    @IsOptional()
    n9?: number;

    @IsNumber()
    @IsOptional()
    n10?: number;
}

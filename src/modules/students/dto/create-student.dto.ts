import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    name: string;

    @IsString()
    surname: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    cin?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsDateString()
    @IsOptional()
    birthDate?: string;

    @IsString()
    @IsOptional()
    schoolLevel?: string;

    @IsString()
    @IsOptional()
    currentSchool?: string;

    @IsString()
    @IsOptional()
    parentName?: string;

    @IsString()
    @IsOptional()
    parentPhone?: string;

    @IsString()
    @IsOptional()
    parentRelation?: string;
}

export class UpdateStudentDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    surname?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    cin?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsDateString()
    @IsOptional()
    birthDate?: string;

    @IsString()
    @IsOptional()
    schoolLevel?: string;

    @IsString()
    @IsOptional()
    currentSchool?: string;

    @IsEnum(['active', 'inactive'])
    @IsOptional()
    status?: 'active' | 'inactive';

    @IsString()
    @IsOptional()
    parentName?: string;

    @IsString()
    @IsOptional()
    parentPhone?: string;

    @IsString()
    @IsOptional()
    parentRelation?: string;
}
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ModuleContent, LessonType, Lesson } from '../module.entity';

export class LessonDto {
    @IsString() @IsNotEmpty() id: string;
    @IsString() @IsNotEmpty() title: string;
    @IsString() @IsNotEmpty() type: LessonType;
    @IsOptional() @IsString() contentUrl?: string;
    @IsOptional() @IsInt() duration?: number;
}

export class ModuleContentDto {
    @IsArray() @ValidateNested({ each: true }) @Type(() => LessonDto) lessons: LessonDto[] = [];
}

export class CreateModuleDto {
    @IsString() @IsNotEmpty() userId: string;
    @IsString() @IsNotEmpty() title: string;
    @IsString() @IsNotEmpty() description: string;
    @IsInt() orderIndex: number;
    @IsInt() estimatedDuration: number;
    @ValidateNested() @Type(() => ModuleContentDto) content: ModuleContentDto;
    @IsArray() @IsString({ each: true }) prerequisites: string[] = [];
}

export class UpdateModuleDto {
    @IsOptional() @IsString() title?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsInt() orderIndex?: number;
    @IsOptional() @IsInt() estimatedDuration?: number;
    @IsOptional() @ValidateNested() @Type(() => ModuleContentDto) content?: ModuleContentDto;
    @IsOptional() @IsArray() @IsString({ each: true }) prerequisites?: string[];
    @IsString() @IsNotEmpty() userId: string;
}

export class ReorderModulesDto {
    @IsArray() @IsUUID('all', { each: true }) moduleIds: string[];
    @IsString() @IsNotEmpty() userId: string;
}
import { IsEnum, IsOptional, IsString, IsUUID, IsNotEmpty, ValidateNested, IsInt, IsArray, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { Status, Difficulty } from '../courses.entity';

export class TeamSizeDto {
    @IsInt() @Min(1) min: number;
    @IsInt() @Min(1) max: number;
}
    
    
export class CourseSettingsDto {
    @IsOptional() @IsInt() @Min(1) maxStudents?: number;
    @IsOptional() @IsInt() @Min(1) minStudents?: number;
    @IsOptional() @ValidateNested() @Type(() => TeamSizeDto) teamSize?: TeamSizeDto;
    @IsOptional() @IsBoolean() discussionEnabled?: boolean;
}
    
    
export class CourseMetadataDto {
    @IsOptional() @IsInt() @Min(0) duration?: number;
    @IsOptional() @IsEnum(Difficulty) difficulty?: Difficulty;
    @IsOptional() @IsArray() @IsString({ each: true }) prerequisites?: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
    @IsOptional() @IsString() targetAudience?: string;
}

export class CreateCourseDto {
    @IsString() @IsNotEmpty() title: string;
    @IsString() @IsNotEmpty() description: string;
    @IsUUID() instructorId: string;
    @IsOptional() @IsEnum(Status) status?: Status;
    @IsOptional() @ValidateNested() @Type(() => CourseMetadataDto) metadata?: CourseMetadataDto;
    @IsOptional() @ValidateNested() @Type(() => CourseSettingsDto) settings?: CourseSettingsDto;
}



export class UpdateCourseDto {
    @IsString() @IsNotEmpty() userId: string;
    @IsOptional() @IsString() title?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsEnum(Status) status?: Status;
    @IsOptional() @ValidateNested() @Type(() => CourseMetadataDto) metadata?: CourseMetadataDto;
    @IsOptional() @ValidateNested() @Type(() => CourseSettingsDto) settings?: CourseSettingsDto;
}
    
    
export class FilterCoursesDto {
    @IsOptional() @IsString() q?: string;
    @IsOptional() @IsEnum(Difficulty) difficulty?: Difficulty;
    @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
    @IsOptional() @IsUUID() instructorId?: string;
    @IsOptional() @IsString() cursor?: string;
    @IsOptional() @IsInt() @Min(1) @Max(100) limit?: number = 20;
}
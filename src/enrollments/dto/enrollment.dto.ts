import { IsEnum, IsOptional } from 'class-validator';
import { EnrollmentStatus } from '../enrollments.entity';

export class MyCoursesQueryDto {
    @IsEnum(EnrollmentStatus, { each: false }) @IsOptional() status?: EnrollmentStatus;
}

export class UpdateProgressDto {
    @IsEnum(EnrollmentStatus) status: EnrollmentStatus;
}
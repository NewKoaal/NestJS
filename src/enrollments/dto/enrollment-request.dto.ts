import { IsOptional, IsString, IsUUID } from 'class-validator';

export class EnrollDirectDto {
    @IsUUID() courseId: string;
}

export class RequestEnrollmentDto {
    @IsString() @IsOptional() requestMessage?: string;
}
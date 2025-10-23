import { IsEmail, IsNotEmpty, IsString, IsUUID, IsInt, Min, Max } from 'class-validator';

export class InviteToCourseDto {
    @IsUUID() courseId: string;

    @IsEmail() inviteeEmail: string;

    @IsInt() @Min(1) @Max(720) expiresInHours: number;
}

export class AcceptInvitationDto {
    @IsString() @IsNotEmpty() id: string;
}
import { IsEmail, IsString } from 'class-validator';

export class CreateCourseDto {
    @IsEmail() 
    email!: string;

    @IsString() 
    password!: string;
}
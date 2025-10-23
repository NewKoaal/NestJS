import { Status, Difficulty } from '../courses.entity';
export declare class TeamSizeDto {
    min: number;
    max: number;
}
export declare class CourseSettingsDto {
    maxStudents?: number;
    minStudents?: number;
    teamSize?: TeamSizeDto;
    discussionEnabled?: boolean;
}
export declare class CourseMetadataDto {
    duration?: number;
    difficulty?: Difficulty;
    prerequisites?: string[];
    tags?: string[];
    targetAudience?: string;
}
export declare class CreateCourseDto {
    title: string;
    description: string;
    instructorId: string;
    status?: Status;
    metadata?: CourseMetadataDto;
    settings?: CourseSettingsDto;
}
export declare class UpdateCourseDto {
    userId: string;
    title?: string;
    description?: string;
    status?: Status;
    metadata?: CourseMetadataDto;
    settings?: CourseSettingsDto;
}
export declare class FilterCoursesDto {
    q?: string;
    difficulty?: Difficulty;
    tags?: string[];
    instructorId?: string;
    cursor?: string;
    limit?: number;
}

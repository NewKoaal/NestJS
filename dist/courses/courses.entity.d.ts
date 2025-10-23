import { User } from '../users/users.entity';
import { Module } from './module.entity';
export declare enum Status {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}
export declare enum Difficulty {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED"
}
export declare class Course {
    id: string;
    title: string;
    description: string;
    instructorId: string;
    instructor?: User;
    status: string;
    metadata: {
        duration: number;
        difficulty: Difficulty;
        prerequisites: string[];
        tags: string[];
        targetAudience: string;
    };
    settings: {
        maxStudents: number;
        minStudents: number;
        teamSize: {
            min: number;
            max: number;
        };
        discussionEnabled: boolean;
    };
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    modules: Module[];
}

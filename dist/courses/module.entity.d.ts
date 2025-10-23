import { Course } from './courses.entity';
export declare enum LessonType {
    VIDEO = "VIDEO",
    DOCUMENT = "DOCUMENT",
    QUIZ = "QUIZ",
    ASSIGNMENT = "ASSIGNMENT"
}
export type Lesson = {
    id: string;
    title: string;
    type: LessonType;
    contentURL?: string;
    duration?: number;
    data?: Record<string, any>;
};
export type ModuleContent = {
    lessons: Lesson[];
};
export declare class Module {
    id: string;
    courseId: string;
    course?: Course;
    title: string;
    description: string;
    orderIndex: number;
    estimatedDuration: number;
    content: ModuleContent;
    prerequisites: string[];
    createdAt: Date;
    updatedAt: Date;
}

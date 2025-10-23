import { LessonType } from '../module.entity';
export declare class LessonDto {
    id: string;
    title: string;
    type: LessonType;
    contentUrl?: string;
    duration?: number;
}
export declare class ModuleContentDto {
    lessons: LessonDto[];
}
export declare class CreateModuleDto {
    userId: string;
    title: string;
    description: string;
    orderIndex: number;
    estimatedDuration: number;
    content: ModuleContentDto;
    prerequisites: string[];
}
export declare class UpdateModuleDto {
    title?: string;
    description?: string;
    orderIndex?: number;
    estimatedDuration?: number;
    content?: ModuleContentDto;
    prerequisites?: string[];
    userId: string;
}
export declare class ReorderModulesDto {
    moduleIds: string[];
    userId: string;
}

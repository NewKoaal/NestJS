import { Repository } from 'typeorm';
import { Course } from './courses.entity';
import { Module } from './module.entity';
import { User } from '../users/users.entity';
import { CreateCourseDto, UpdateCourseDto, FilterCoursesDto } from './dto/course.dto';
import { CreateModuleDto, UpdateModuleDto, ReorderModulesDto } from './dto/module.dto';
export declare class CoursesService {
    private readonly courseRepository;
    private readonly moduleRepository;
    private readonly userRepository;
    constructor(courseRepository: Repository<Course>, moduleRepository: Repository<Module>, userRepository: Repository<User>);
    createCourse(dto: CreateCourseDto): Promise<Course>;
    listCourses(filter: FilterCoursesDto): Promise<{
        data: Course[];
        nextCursor: string | null;
    }>;
    getCourse(id: string): Promise<Course>;
    updateCourse(courseId: string, dto: UpdateCourseDto): Promise<Course>;
    softDeleteCourse(id: string): Promise<void>;
    publishCourse(id: string): Promise<Course>;
    archiveCourse(id: string): Promise<Course>;
    addModule(courseId: string, dto: CreateModuleDto): Promise<Module>;
    listModules(courseId: string): Promise<Module[]>;
    updateModule(courseId: string, moduleId: string, dto: UpdateModuleDto): Promise<Module>;
    deleteModule(courseId: string, moduleId: string): Promise<void>;
    reorderModules(courseId: string, dto: ReorderModulesDto): Promise<Module[]>;
    private ensureCourseExists;
}

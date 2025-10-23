import { CoursesService } from './courses.service';
import { CreateCourseDto, FilterCoursesDto, UpdateCourseDto } from './dto/course.dto';
import { CreateModuleDto, ReorderModulesDto, UpdateModuleDto } from './dto/module.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    list(filter: FilterCoursesDto): Promise<{
        data: import("./courses.entity").Course[];
        nextCursor: string | null;
    }>;
    createCourse(dto: CreateCourseDto): Promise<import("./courses.entity").Course>;
    getOneCourse(id: string): Promise<import("./courses.entity").Course>;
    updateCourse(id: string, dto: UpdateCourseDto): Promise<import("./courses.entity").Course>;
    removeCourse(id: string): Promise<void>;
    publish(id: string): Promise<import("./courses.entity").Course>;
    archive(id: string): Promise<import("./courses.entity").Course>;
    addModule(courseId: string, dto: CreateModuleDto): Promise<import("./module.entity").Module>;
    listModules(courseId: string): Promise<import("./module.entity").Module[]>;
    updateModule(courseId: string, moduleId: string, dto: UpdateModuleDto): Promise<import("./module.entity").Module>;
    deleteModule(courseId: string, moduleId: string): Promise<void>;
    reorderModules(courseId: string, dto: ReorderModulesDto): Promise<import("./module.entity").Module[]>;
}

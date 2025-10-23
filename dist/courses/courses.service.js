"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const courses_entity_1 = require("./courses.entity");
const module_entity_1 = require("./module.entity");
const users_entity_1 = require("../users/users.entity");
function decodeCursor(cursor) {
    if (!cursor)
        return null;
    try {
        const [createdAt, id] = Buffer.from(cursor, 'base64').toString('utf8').split('|');
        return { createdAt: new Date(createdAt), id };
    }
    catch {
        return null;
    }
}
function encodeCursor(createdAt, id) {
    return Buffer.from(`${createdAt.toISOString()}|${id}`, 'utf8').toString('base64');
}
let CoursesService = class CoursesService {
    courseRepository;
    moduleRepository;
    userRepository;
    constructor(courseRepository, moduleRepository, userRepository) {
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.userRepository = userRepository;
    }
    async createCourse(dto) {
        if (!dto.instructorId)
            throw new common_1.NotFoundException('No instructor given');
        else {
            const id = dto.instructorId;
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user)
                throw new common_1.NotFoundException('Instructor not found');
            else {
                if (user.role != 'INSTRUCTOR')
                    throw new common_1.NotFoundException('Not an instructor');
            }
        }
        const course = this.courseRepository.create({ ...dto, status: dto.status ?? courses_entity_1.Status.DRAFT });
        return this.courseRepository.save(course);
    }
    async listCourses(filter) {
        const qb = this.courseRepository.createQueryBuilder('c');
        if (filter.q) {
            qb.andWhere(new typeorm_1.Brackets((q) => {
                q.where('c.title ILIKE :q', { q: `%${filter.q}%` })
                    .orWhere('c.description ILIKE :q', { q: `%${filter.q}%` });
            }));
        }
        if (filter.difficulty) {
            qb.andWhere("(c.metadata->>'difficulty') = :difficulty", { difficulty: filter.difficulty });
        }
        if (filter.tags && filter.tags.length) {
            qb.andWhere("EXISTS (SELECT 1 FROM jsonb_array_elements_text(c.metadata->'tags') t WHERE t = ANY(:tags))", { tags: filter.tags });
        }
        if (filter.instructorId) {
            qb.andWhere('c.instructorId = :instructorId', { instructorId: filter.instructorId });
        }
        qb.orderBy('c.createdAt', 'DESC').addOrderBy('c.id', 'DESC');
        const cursor = decodeCursor(filter.cursor);
        if (cursor) {
            qb.andWhere(new typeorm_1.Brackets((q) => {
                q.where('c.createdAt < :createdAt', { createdAt: cursor.createdAt })
                    .orWhere('c.createdAt = :createdAt AND c.id < :id', { createdAt: cursor.createdAt, id: cursor.id });
            }));
        }
        const take = Math.min(Math.max(filter.limit ?? 20, 1), 100);
        qb.take(take + 1);
        const rows = await qb.getMany();
        const hasMore = rows.length > take;
        const data = rows.slice(0, take);
        const nextCursor = hasMore ? encodeCursor(data[data.length - 1].createdAt, data[data.length - 1].id) : null;
        return { data, nextCursor };
    }
    async getCourse(id) {
        const course = await this.courseRepository.findOne({ where: { id }, relations: ['modules'] });
        if (!course)
            throw new common_1.NotFoundException('Course not found');
        return course;
    }
    async updateCourse(courseId, dto) {
        if (!dto.userId)
            throw new common_1.NotFoundException('No instructor given');
        else {
            let id = dto.userId;
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user)
                throw new common_1.NotFoundException('Instructor not found');
            id = courseId;
            const course = await this.courseRepository.findOne({ where: { id } });
            if (!course)
                throw new common_1.NotFoundException('Course not found');
            else {
                if (course.instructorId != dto.userId)
                    throw new common_1.NotFoundException('Wrong instructor');
            }
        }
        const course = await this.getCourse(courseId);
        Object.assign(course, dto);
        return this.courseRepository.save(course);
    }
    async softDeleteCourse(id) {
        const course = await this.getCourse(id);
        await this.courseRepository.softRemove(course);
    }
    async publishCourse(id) {
        const course = await this.getCourse(id);
        if (course.status === courses_entity_1.Status.ARCHIVED)
            throw new common_1.BadRequestException('Archived courses cannot be published');
        course.status = courses_entity_1.Status.PUBLISHED;
        course.publishedAt = new Date();
        return this.courseRepository.save(course);
    }
    async archiveCourse(id) {
        const course = await this.getCourse(id);
        course.status = courses_entity_1.Status.ARCHIVED;
        return this.courseRepository.save(course);
    }
    async addModule(courseId, dto) {
        if (!dto.userId)
            throw new common_1.NotFoundException('No instructor given');
        else {
            let id = dto.userId;
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user)
                throw new common_1.NotFoundException('No instructor found');
            else {
                if (user.role != 'INSTRUCTOR')
                    throw new common_1.NotFoundException('Not an instructor');
            }
        }
        await this.ensureCourseExists(courseId);
        const exists = await this.moduleRepository.findOne({ where: { courseId, orderIndex: dto.orderIndex } });
        if (exists)
            throw new common_1.BadRequestException('orderIndex already exists for this course');
        const mod = this.moduleRepository.create({ ...dto, courseId });
        return this.moduleRepository.save(mod);
    }
    async listModules(courseId) {
        await this.ensureCourseExists(courseId);
        return this.moduleRepository.find({ where: { courseId }, order: { orderIndex: 'ASC' } });
    }
    async updateModule(courseId, moduleId, dto) {
        if (!dto.userId)
            throw new common_1.NotFoundException('Instructor not found');
        else {
            const id = dto.userId;
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user)
                throw new common_1.NotFoundException('Instructor not found');
        }
        const mod = await this.moduleRepository.findOne({ where: { id: moduleId, courseId } });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
        Object.assign(mod, dto);
        if (dto.orderIndex !== undefined) {
            const exists = await this.moduleRepository.findOne({ where: { courseId, orderIndex: dto.orderIndex } });
            if (exists && exists.id !== moduleId)
                throw new common_1.BadRequestException('orderIndex already exists for this course');
        }
        return this.moduleRepository.save(mod);
    }
    async deleteModule(courseId, moduleId) {
        const mod = await this.moduleRepository.findOne({ where: { id: moduleId, courseId } });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
        await this.moduleRepository.remove(mod);
    }
    async reorderModules(courseId, dto) {
        if (!dto.userId)
            throw new common_1.NotFoundException('Instructor not found');
        else {
            const id = dto.userId;
            const user = await this.userRepository.findOne({ where: { id } });
            if (!user)
                throw new common_1.NotFoundException('Instructor not found');
        }
        await this.ensureCourseExists(courseId);
        const mods = await this.moduleRepository.find({ where: { courseId } });
        if (mods.length !== dto.moduleIds.length || new Set(dto.moduleIds).size !== dto.moduleIds.length)
            throw new common_1.BadRequestException('moduleIds must include each module exactly once');
        const map = new Map(mods.map((m) => [m.id, m]));
        dto.moduleIds.forEach((id, idx) => {
            const m = map.get(id);
            if (!m)
                throw new common_1.BadRequestException(`Unknown module id: ${id}`);
            m.orderIndex = idx + 1;
        });
        return this.moduleRepository.save([...map.values()]);
    }
    async ensureCourseExists(id) {
        const exists = await this.courseRepository.findOne({ where: { id } });
        if (!exists)
            throw new common_1.NotFoundException('Course not found');
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(courses_entity_1.Course)),
    __param(1, (0, typeorm_2.InjectRepository)(module_entity_1.Module)),
    __param(2, (0, typeorm_2.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], CoursesService);
//# sourceMappingURL=courses.service.js.map
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Course, Status } from './courses.entity';
import { Module } from './module.entity';
import { User } from '../users/users.entity';

import { CreateCourseDto, UpdateCourseDto, FilterCoursesDto } from './dto/course.dto';
import { CreateModuleDto, UpdateModuleDto, ReorderModulesDto } from './dto/module.dto';

function decodeCursor(cursor?: string): { createdAt: Date; id: string } | null {
  if (!cursor) return null;
  try {
    const [createdAt, id] = Buffer.from(cursor, 'base64').toString('utf8').split('|');
    return { createdAt: new Date(createdAt), id };
  } catch {
    return null;
  }
}
  
function encodeCursor(createdAt: Date, id: string): string {
  return Buffer.from(`${createdAt.toISOString()}|${id}`, 'utf8').toString('base64');
}

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private readonly courseRepository: Repository<Course>,
    @InjectRepository(Module) private readonly moduleRepository: Repository<Module>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createCourse(dto: CreateCourseDto): Promise<Course> {
    if (!dto.instructorId) throw new NotFoundException('No instructor given');
    else {
      const id = dto.instructorId;
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('Instructor not found');
      else {
        if (user.role != 'INSTRUCTOR') throw new NotFoundException('Not an instructor');
      }
    }

    const course = this.courseRepository.create({ ...dto, status: dto.status ?? Status.DRAFT });
    return this.courseRepository.save(course);
  }

  async listCourses(filter: FilterCoursesDto) {
    const qb = this.courseRepository.createQueryBuilder('c');
    
    if (filter.q) {
      qb.andWhere(new Brackets((q) => {
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
      qb.andWhere(new Brackets((q) => {
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

  async getCourse(id: string): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id }, relations: ['modules'] });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
  
  
  async updateCourse(courseId: string, dto: UpdateCourseDto): Promise<Course> {
    if (!dto.userId) throw new NotFoundException('No instructor given');
    else {
      let id = dto.userId;
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('Instructor not found');

      id = courseId;
      const course = await this.courseRepository.findOne({ where: { id } });

      if (!course) throw new NotFoundException('Course not found');
      else {
        if (course.instructorId != dto.userId) throw new NotFoundException('Wrong instructor');
      }
    }

    const course = await this.getCourse(courseId);
    Object.assign(course, dto);
    return this.courseRepository.save(course);
  }

  async softDeleteCourse(id: string): Promise<void> {
    const course = await this.getCourse(id);
    await this.courseRepository.softRemove(course);
  }
  
  
  async publishCourse(id: string): Promise<Course> {
    const course = await this.getCourse(id);
    if (course.status === Status.ARCHIVED) throw new BadRequestException('Archived courses cannot be published');
    course.status = Status.PUBLISHED;
    course.publishedAt = new Date();
    return this.courseRepository.save(course);
  }
  
  
  async archiveCourse(id: string): Promise<Course> {
    const course = await this.getCourse(id);
    course.status = Status.ARCHIVED;
    return this.courseRepository.save(course);
  }

  // Modules
  async addModule(courseId: string, dto: CreateModuleDto): Promise<Module> {
    if (!dto.userId) throw new NotFoundException('No instructor given');
    else {
      let id = dto.userId;
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('No instructor found');
      else {
        if (user.role != 'INSTRUCTOR') throw new NotFoundException('Not an instructor');
      }
    }

    await this.ensureCourseExists(courseId);

    const exists = await this.moduleRepository.findOne({ where: { courseId, orderIndex: dto.orderIndex } });
    if (exists) throw new BadRequestException('orderIndex already exists for this course');
    
    const mod = this.moduleRepository.create({ ...dto, courseId });
    return this.moduleRepository.save(mod);
  }
  
  async listModules(courseId: string): Promise<Module[]> {
    await this.ensureCourseExists(courseId);
    return this.moduleRepository.find({ where: { courseId }, order: { orderIndex: 'ASC' } });
  }
  
  async updateModule(courseId: string, moduleId: string, dto: UpdateModuleDto): Promise<Module> {
    if (!dto.userId) throw new NotFoundException('Instructor not found');
    else {
      const id = dto.userId;
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('Instructor not found');
    }

    const mod = await this.moduleRepository.findOne({ where: { id: moduleId, courseId } });
    if (!mod) throw new NotFoundException('Module not found');
    Object.assign(mod, dto);
    
    if (dto.orderIndex !== undefined) {
      const exists = await this.moduleRepository.findOne({ where: { courseId, orderIndex: dto.orderIndex } });
      if (exists && exists.id !== moduleId) throw new BadRequestException('orderIndex already exists for this course');
    }
    
    return this.moduleRepository.save(mod);
  }
  
  async deleteModule(courseId: string, moduleId: string): Promise<void> {
    const mod = await this.moduleRepository.findOne({ where: { id: moduleId, courseId } });
    if (!mod) throw new NotFoundException('Module not found');
    await this.moduleRepository.remove(mod);
  }
  
  async reorderModules(courseId: string, dto: ReorderModulesDto): Promise<Module[]> {
    if (!dto.userId) throw new NotFoundException('Instructor not found');
    else {
      const id = dto.userId;
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('Instructor not found');
    }

    await this.ensureCourseExists(courseId);
    const mods = await this.moduleRepository.find({ where: { courseId } });
    if (mods.length !== dto.moduleIds.length || new Set(dto.moduleIds).size !== dto.moduleIds.length)
    throw new BadRequestException('moduleIds must include each module exactly once');
    
    const map = new Map<string, Module>(mods.map((m) => [m.id, m] as const));
    dto.moduleIds.forEach((id, idx) => {
      const m = map.get(id);
      if (!m) throw new BadRequestException(`Unknown module id: ${id}`);
      m.orderIndex = idx + 1;
    });
    
    return this.moduleRepository.save([...map.values()]);
  }
  
  private async ensureCourseExists(id: string): Promise<void> {
    const exists = await this.courseRepository.findOne({ where: { id } });
    if (!exists) throw new NotFoundException('Course not found');
  }
}

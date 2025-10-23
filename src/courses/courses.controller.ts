import { Controller, Get, Post, Patch, Delete, Query, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';

import { CreateCourseDto, FilterCoursesDto, UpdateCourseDto } from './dto/course.dto';
import { CreateModuleDto, ReorderModulesDto, UpdateModuleDto } from './dto/module.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
    list(@Query() filter: FilterCoursesDto) {
    return this.coursesService.listCourses(filter);
  }

  @Post()
    createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Get(':id')
  getOneCourse(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.coursesService.getCourse(id);
  }

  @Patch(':id')
    updateCourse(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.updateCourse(id, dto);
  }

  @Delete(':id')
    removeCourse(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.coursesService.softDeleteCourse(id);
  }

  @Post(':id/publish')
    publish(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.coursesService.publishCourse(id);
  }

  @Post(':id/archive')
    archive(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.coursesService.archiveCourse(id);
  }

  // Modules
  @Post(':id/modules')
  addModule(@Param('id', new ParseUUIDPipe()) courseId: string, @Body() dto: CreateModuleDto) {
    return this.coursesService.addModule(courseId, dto);
  }

  @Get(':id/modules')
  listModules(@Param('id', new ParseUUIDPipe()) courseId: string) {
    return this.coursesService.listModules(courseId);
  }

  @Patch(':id/modules/:moduleId')
  updateModule(
    @Param('id', new ParseUUIDPipe()) courseId: string,
    @Param('moduleId', new ParseUUIDPipe()) moduleId: string,
    @Body() dto: UpdateModuleDto,
  ) {
    return this.coursesService.updateModule(courseId, moduleId, dto);
  }

  @Delete(':id/modules/:moduleId')
  deleteModule(
    @Param('id', new ParseUUIDPipe()) courseId: string,
    @Param('moduleId', new ParseUUIDPipe()) moduleId: string,
  ) {
    return this.coursesService.deleteModule(courseId, moduleId);
  }

  @Post(':id/modules/:moduleId/reorder')
  reorderModules(
    @Param('id', new ParseUUIDPipe()) courseId: string,
    @Body() dto: ReorderModulesDto,
  ) {
    return this.coursesService.reorderModules(courseId, dto);
  }
}
